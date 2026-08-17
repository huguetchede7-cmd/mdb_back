import { validationResult, matchedData } from "express-validator"
import apiHelpers from "../../helpers/apiHelpers"
import UserModel from "../../../models/UserModel"
import Messengers from "../../helpers/messengers"
import { Sanitizer } from "../../helpers/sanitizer"
import { ACCOUNT_TYPES } from "../../../models/AccountTypeModel"
import { Request, Response } from "express"
import { JWTHelper } from "../../helpers/jwtHelpers"
import { NotifcationController } from "../common/NotifcationController"
import { LogHelpers } from "../../helpers/LogHelpers"
import { NotificationHelper } from "../../helpers/NotificationHelper"
import { BcryptCheck } from "../../helpers/bcryptHelpers"
import AdminRolePermissionModel from '../../../models/AdminRolePermissionModel'
import AdminRoleModel from '../../../models/AdminRoleModel'

export class AuthAdminController {

  static async loginWithEmail(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }

    try {
      // validate data
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        responseJson.statut = false
        responseJson.message = Messengers.error.general.default
        responseJson.errors = Sanitizer.arrayToKeyObject("path", errors.array() as [])
        res.status(400).json(responseJson)
        return;
      }

      const data = matchedData(req)
     const targetUser = await UserModel.findOne({ 
  where: { email: data.email },
  attributes: { include: ['password'] }
     })
     const targetUserDetail = targetUser?.get({ plain: true })

      if (targetUserDetail?.account_type != ACCOUNT_TYPES.ADMIN) {
        throw new Error("__messageFormatted__email__" + Messengers.error.email.aucun_compte)
      }

      if (targetUserDetail.ban_statut) {
        throw new Error("__messageFormatted__email__" + Messengers.error.compte.statut_bloquer)
      }

const isPasswordMatch = await BcryptCheck(data.password, targetUserDetail.password as string)
      if (!isPasswordMatch) {
        throw new Error("__messageFormatted__password__" + Messengers.error.password.incorrect)
      }

      const fetchUserResult = await AuthAdminController.fetchUser(targetUserDetail as UserModel)
      if (!fetchUserResult.statut) {
        throw new Error("")
      }

      NotifcationController.create({
        title: "Connexion",
        short_description: "Connexion avec votre compte (" + data.email + ") effectuée avec succès.",
        description: `La connexion par email a été réalisée avec succès. \nNous sommes ravis de vous revoir à nouveau sur notre plateforme.`,
        to_user: String(targetUserDetail.id),
        notification_type: String(NotificationHelper.type.login),
        statut: String(NotificationHelper.statut.success)
      }, { sendEmailToUser: false })

      res.status(200).json(fetchUserResult)
      return
    } catch (err) {
      res.status(400).json(apiHelpers.bindError(err as Error))
      return
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON };
    try {
      const user_id = Number(req.headers.auth_user);
      await UserModel.update({ jwt_token: null }, {
        where: { id: user_id }
      });

      responseJson.statut = true;
      responseJson.message = "Déconnexion effectué avec succès";
      res.status(200).json(responseJson);
      return

    } catch (err) {
      res.status(400).json(apiHelpers.bindError(err as Error));
    }
  }

  static async fetchUser(userDetail: UserModel) {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
    try {
      const newJwt = JWTHelper.generateToken(userDetail.username)
      await UserModel.update({ jwt_token: newJwt }, { where: { id: userDetail.id } })
    
     const { username, fullname, avatar, email, phone, kyc, account_type } = userDetail

// Récupérer les rôles de l'utilisateur
const permissions = await AdminRolePermissionModel.findAll({
  where: { admin_id: userDetail.id },
  include: [{ model: AdminRoleModel, as: 'role', attributes: ['id', 'title', 'slug', 'icon'] }]
});

let roles = permissions.map((p: any) => p.get({ plain: true })?.role).filter(Boolean);

// Si aucun rôle assigné → super admin, tous les accès
if (roles.length === 0) {
  const allRoles = await AdminRoleModel.findAll();
  roles = allRoles.map((r: any) => r.get({ plain: true }));
}
responseJson.data = { id: userDetail.id, token: newJwt, username, fullname, avatar, email, phone, kyc, account_type, roles }
responseJson.message = "Connexion effectuée avec succès"
responseJson.statut = true
   } catch (error) {
    LogHelpers.showException(error as Error, true)
    responseJson.statut = false
    responseJson.message = Messengers.error.general.default
}
    return responseJson
  }

}