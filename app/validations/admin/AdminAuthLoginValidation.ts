import UserModel from "../../../models/UserModel"
import Messengers from "../../helpers/messengers"
import {body} from "express-validator"

export const AdminAuthLoginValidation = [
    body('email').notEmpty().withMessage(Messengers.error.champs.requis)
        .isEmail().withMessage(Messengers.error.email.invalide)
        .custom(async (value: string | null) => {
            if (!value) {
                return Promise.reject(Messengers.error.champs.requis)
            }
            const user = await UserModel.findOne({ where: { email: value } })
            if (!user) {
                return Promise.reject(Messengers.error.email.aucun_compte)
            }
        }).escape()
        .bail(),

    body('password')
        .notEmpty().withMessage(Messengers.error.champs.requis)
        .isLength({ min: 6 }).withMessage("6 " + Messengers.error.string.min),
]