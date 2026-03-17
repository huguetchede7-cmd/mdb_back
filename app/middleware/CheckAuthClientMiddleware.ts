import { RequestHandler } from 'express';
import apiHelpers from '../helpers/apiHelpers';
import { ACCOUNT_TYPES } from '../../models/AccountTypeModel';
import UserModel from '../../models/UserModel';
import Messengers from '../helpers/messengers';

export class CheckAuthClientMiddleware {
    static process: RequestHandler = async (req, res, next) => {
        const token = req.headers.authorization;
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON };

        if (!token) {
            responseJson.error_code = "1000";
            responseJson.message = "Votre session a expiré. Veuillez vous reconnecter.";
            res.status(401).json(responseJson); // Ne pas retourner, continuer sans valeur
            return;
        }

        try {

            // Trouver l'utilisateur
            const user = await UserModel.findOne({
                where: { jwt_token: token, account_type: ACCOUNT_TYPES.CLIENT },
            });

            if (!user) {
                responseJson.error_code = "1000";
                responseJson.message = "Votre session a expiré. Veuillez vous reconnecter.";
                res.status(401).json(responseJson); // Ne pas retourner, continuer sans valeur
                return;
            }

            const userData = user.get();

            // Vérifier si l'utilisateur est bloqué
            if (userData.ban_statut) {
                responseJson.error_code = "1000";
                responseJson.message = Messengers.error.compte.statut_bloquer;
                res.status(401).json(responseJson); // Ne pas retourner, continuer sans valeur
                return;
            }

            // Continuer...
            req.headers['auth_user'] = String(userData.id);
            next(); // Appeler explicitement next()
        } catch (error) {
            next(error); // Transmettre l'erreur au gestionnaire global
        }
    };
}
