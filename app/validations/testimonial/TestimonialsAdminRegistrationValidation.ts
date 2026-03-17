import { body } from 'express-validator';
import Messengers from '../../helpers/messengers';

export const TestimonialsAdminRegistrationValidation = [
    body('name')
        .notEmpty().withMessage(Messengers.error.champs.requis)
        .escape()
        .bail(),

    body('description')
        .notEmpty().withMessage(Messengers.error.champs.requis)
        .escape()
        .bail(),

    body('rating')
        .notEmpty().withMessage(Messengers.error.champs.requis)
        .bail()
        .isInt({ min: 1, max: 5 }).withMessage("La note doit être comprise entre 1 et 5."),

];
