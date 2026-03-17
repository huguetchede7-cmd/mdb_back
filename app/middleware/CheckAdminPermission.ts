import { RequestHandler } from "express";
import apiHelpers from "../helpers/apiHelpers";
import AdminRoleModel from "../../models/AdminRoleModel";
import AdminRolePermissionModel from "../../models/AdminRolePermissionModel";
import { Op } from "sequelize";

export class CheckAdminPermission {
  static allow = (requiredSlugs: string[]): RequestHandler => {
    return async (req, res, next) => {
      const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON };
      try {
        const adminId = req.headers["auth_user"];

        if (!adminId) {
          responseJson.error_code = "1001";
          responseJson.message = "Accès non autorisé.";
          res.status(401).json(responseJson);
          return;
        }

        if (Number(adminId) === 1) {
          return next();
        }

        const permissions = await AdminRolePermissionModel.findAll({
          where: { admin_id: adminId },
          attributes: ["role_id"],
        });

        const roleIds = permissions.map(p => p.get().role_id);

        if (roleIds.length === 0) {
          responseJson.error_code = "1003";
          responseJson.message = "Aucun rôle associé à l’utilisateur.";
          res.status(403).json(responseJson);
          return;
        }

        const roles = await AdminRoleModel.findAll({
          where: { id: { [Op.in]: roleIds } },
          attributes: ["slug"],
          order: [["id", "ASC"]],
        });

        if (!roles?.length) {
          responseJson.error_code = "1003";
          responseJson.message = "Rôles introuvables.";
          res.status(403).json(responseJson);
          return;
        }

        const userSlugs = roles.map(r => r.get().slug);

        const hasPermission = requiredSlugs.some(slug => userSlugs.includes(slug));

        if (!hasPermission) {
          responseJson.error_code = "1003";
          responseJson.message = "Accès non autorisé";
          res.status(403).json(responseJson);
          return;
        }

        next(); // tout est OK
      } catch (error) {
        next(error);
      }
    };
  };
}
