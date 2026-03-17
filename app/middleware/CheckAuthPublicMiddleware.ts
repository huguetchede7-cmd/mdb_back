import { RequestHandler } from 'express';
import apiHelpers from '../helpers/apiHelpers';
import UserModel from '../../models/UserModel';
import Messengers from '../helpers/messengers';

export class CheckAuthPublicMiddleware {
    static process: RequestHandler = async (req, res, next) => {
        const token = req.headers.authorization;
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON };

        if (!token) {
            responseJson.message = Messengers.error.general.default;
            res.status(401).json(responseJson); 
            return;
        }

        try {
            const user = await UserModel.findOne({
                where: { 
                    jwt_token: token,  
                    ban_statut: false,
                },
            });
            if (!user) {
                responseJson.message = Messengers.error.general.default;
                res.status(401).json(responseJson);
                return;
            }

            const userData = user.get();
            req.headers['auth_user'] = String(userData.id);
            next();
        } catch (error) {
            next(error);
        }
    };
}
