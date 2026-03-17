import { Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import { Sanitizer } from '../../helpers/sanitizer';
import apiHelpers from '../../helpers/apiHelpers';
import Messengers from '../../helpers/messengers';
import AdminRolePermissionModel from '../../../models/AdminRolePermissionModel';
import AdminRoleModel from '../../../models/AdminRoleModel'

export default class AdminRolePermissionAdminAppController {

  static async rolesListe(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON };
    try {
      const roles = await AdminRoleModel.scope('orderByIdAsc').findAll();
      if (!roles.length) {
        throw new Error('__messageFormatted__id__Aucune permissions trouvée');
      }

      responseJson.statut = true;
      responseJson.message = 'Liste des permissions récupérée avec succès';
      responseJson.data = roles;

      res.status(200).json(responseJson);
    } catch (error) {
      res.status(400).json(apiHelpers.bindError(error as Error));
    }
  }

  static async show(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON };

    try {
      const adminId = parseInt(req.params.id);

      const permissions = await AdminRolePermissionModel.findAll({
        where: { admin_id: adminId },
        attributes: ['id', 'role_id', 'admin_id', 'created_at'],
      });

      if (!permissions.length) {
        throw new Error(
          '__messageFormatted__target__Aucun rôle associé à cet utilisateur'
        );
      }

      responseJson.statut = true;
      responseJson.message = 'Rôles de l’utilisateur récupérés avec succès';
      responseJson.data = permissions;

      res.status(200).json(responseJson);
    } catch (error) {
      res.status(400).json(apiHelpers.bindError(error as Error));
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON };

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        responseJson.statut = false;
        responseJson.message = Messengers.error.general.default;
        responseJson.errors = Sanitizer.arrayToKeyObject(
          'path',
          errors.array() as []
        );
        res.status(400).json(responseJson);
        return;
      }

      const data = matchedData(req);
      const nowDate = Sanitizer.getTimeByTimezone();

      const { admin_id, role_ids } = data;

      /** 1️⃣ Supprimer toutes les anciennes permissions de l’admin */
      await AdminRolePermissionModel.destroy({
        where: { admin_id },
      });

      /** 2️⃣ Créer les nouvelles permissions */
      const permissionsToCreate = role_ids.map((role_id: number) => ({
        admin_id,
        role_id,
        created_at: nowDate,
      }));

      const permissions = await AdminRolePermissionModel.bulkCreate(
        permissionsToCreate
      );

      responseJson.statut = true;
      responseJson.message = 'Permissions mises à jour avec succès';
      responseJson.data = permissions;

      res.status(200).json(responseJson);
    } catch (error) {
      res.status(400).json(apiHelpers.bindError(error as Error));
    }
  }
}
