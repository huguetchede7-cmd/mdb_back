
import UserModel from '../../../models/UserModel';
import apiHelpers from '../../helpers/apiHelpers';
import { Request, Response } from 'express';

export class FCMNotificationController {

    static async update(req: Request, res: Response) : Promise<void>  {
        try {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
            const user_id = req.headers?.auth_user
            const data = req.body;

            if (!data?.token) {
                throw new Error("Token manquant")
            }

            const result = await UserModel.update({ fcm_token: data.token }, {
                where: { id: user_id }
            })

            if (!result[0]) {
                throw new Error("Impossible de sauvegarder le token")
            }

            responseJson.message = "Token mis a jour avec succes"
            responseJson.statut = true
            res.status(200).json(responseJson);
            return 
        } catch (err) {
            res.status(400).json(apiHelpers.bindError(err as Error));
            return 
        }
    }
}