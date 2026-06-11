import { body } from 'express-validator';
import UserModel from '../../../models/UserModel';
import AdminRoleModel from '../../../models/AdminRoleModel';
import Messengers from '../../helpers/messengers';

export const AdminAccountRegisterValidation = [
    body('lastname')
        .notEmpty().withMessage(Messengers.error.champs.requis)
        .isLength({ min: 3 }).withMessage("3 " + Messengers.error.string.min)
        .escape()
        .bail(),

    body('firstname')
        .notEmpty().withMessage(Messengers.error.champs.requis)
        .isLength({ min: 3 }).withMessage("3 " + Messengers.error.string.min)
        .escape()
        .bail(),

    body('email')
        .notEmpty().withMessage(Messengers.error.champs.requis)
        .isEmail().withMessage(Messengers.error.email.invalide)
        .custom(async (value) => {
            if (!value) {
                return Promise.reject(Messengers.error.champs.requis);
            }
            const user = await UserModel.findOne({ where: { email: value } });
            if (user) {
                return Promise.reject(Messengers.error.email.deja_utiliser);
            }
        })
        .escape()
        .bail(),

    // ==================== VALIDATION DU RÔLE ====================
    body('admin_role_id')
        .notEmpty().withMessage(Messengers.error.champs.requis)
        .isInt({ min: 1 }).withMessage("Le rôle sélectionné est invalide")
        .custom(async (value) => {
            const role = await AdminRoleModel.findByPk(value);
            if (!role) {
                return Promise.reject("Le rôle sélectionné n'existe pas");
            }
            return true;
        })
        .bail(),

    body('password')
        .notEmpty().withMessage(Messengers.error.champs.requis)
        .isLength({ min: 6 }).withMessage("6 " + Messengers.error.string.min)
        .bail()
];