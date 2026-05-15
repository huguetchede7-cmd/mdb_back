import apiHelpers from '../../helpers/apiHelpers'
import { Request, Response } from 'express'
import UserModel from '../../../models/UserModel'
import AdminRoleModel from '../../../models/AdminRoleModel'
import { ACCOUNT_TYPES } from '../../../models/AccountTypeModel'
import { Sanitizer } from '../../helpers/sanitizer'
import { matchedData, validationResult } from 'express-validator'
import Messengers from '../../helpers/messengers'
import { BcryptMake } from '../../helpers/bcryptHelpers'


export default class AccountAdminAppController {

    static async createAdmin(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                responseJson.statut = false
                responseJson.message = Messengers.error.general.default
                responseJson.errors = Sanitizer.arrayToKeyObject('path', errors.array() as [])
                res.status(400).json(responseJson)
                return
            }

            const data = matchedData(req)

            const nowDate = Sanitizer.getTimeByTimezone()
            const randomName = Sanitizer.generateNum(10, 'user')
            const username = await Sanitizer.uniqueData(UserModel, 'username', randomName)

            // Vérification du rôle
            if (data.admin_role_id) {
                const roleExists = await AdminRoleModel.findByPk(data.admin_role_id)
                if (!roleExists) {
                    responseJson.statut = false
                    responseJson.message = "Le rôle sélectionné n'existe pas"
                    res.status(400).json(responseJson)
                    return
                }
            }

            const newAdmin = await UserModel.create({
                username: username,
                firstname: data.firstname,
                lastname: data.lastname,
                account_type: ACCOUNT_TYPES.ADMIN,
                email: data.email,
                ban_statut: false,
                created_at: nowDate,
                updated_at: nowDate,
                email_verified_at: nowDate,
                phone_verified_at: nowDate,
                password: await BcryptMake(data.password),
                kyc: '1',
                admin_role_id: data.admin_role_id ? Number(data.admin_role_id) : null,
            })

            responseJson.statut = true
            responseJson.message = 'Compte administrateur créé avec succès'
            responseJson.data = {
                id: newAdmin.id,
                username: newAdmin.username,
                fullname: newAdmin.fullname,
                role_id: newAdmin.admin_role_id
            }
            
            res.status(201).json(responseJson)
        } catch (error) {
            console.error(error)
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }
}