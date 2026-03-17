import { body } from 'express-validator';
import UserModel from '../../../models/UserModel';

export const ClientAuthValidation = {
    register: [
        body('firstname')
            .notEmpty()
            .withMessage('Veuillez saisir votre prénom')
            .isString()
            .withMessage("Le prénom n'est pas valide"),

        body('lastname')
            .notEmpty()
            .withMessage('Veuillez saisir votre nom')
            .isString()
            .withMessage("Le nom n'est pas valide"),

        body('email')
            .notEmpty()
            .withMessage("Veuillez saisir votre adresse email")
            .isEmail()
            .withMessage('Cette adresse email n\'est pas valide')
            .custom(async (value) => {
                const existingUser = await UserModel.findOne({ where: { email: value } });
                if (existingUser) {
                    throw new Error('Un compte existe déjà avec cette adresse email');
                }
                return true;
            }),

        body('password')
            .notEmpty()
            .withMessage('Veuillez saisir un mot de passe')
            .isLength({ min: 8 })
            .withMessage('Votre mot de passe doit contenir au moins 8 caractères'),

        body('phone')
            .notEmpty()
            .custom(async (value) => {
                if (value && !/^\d+_\d+$/.test(value)) {
                    throw new Error('Le format de votre numéro de téléphone n\'est pas valide');
                }
                const existingUser = await UserModel.findOne({ where: { phone: value } });
                if (existingUser) {
                    throw new Error('Un compte existe déjà avec ce numéro de téléphone');
                }
                return true;
            }),

        body('client_code')
            .optional()
            .custom((val) => {
                if (!val) return true;
                if (val.startsWith("OHO-") && val.slice(4).length >= 2) {
                    return true;
                }
                throw new Error("Le code doit commencer par OHO- et avoir au moins 2 caractères après.");
            }),
    ],

    login: [
        body('email')
            .notEmpty()
            .withMessage('Veuillez saisir votre email')
            .isEmail()
            .withMessage('Cette adresse email n\'est pas valide'),

        body('password')
            .notEmpty()
            .withMessage('Veuillez saisir votre mot de passe'),
    ],

    authSocial: [
        body('token')
            .notEmpty()
            .withMessage('Le jeton d\'authentification est manquant')
            .isString()
            .withMessage('Le jeton d\'authentification n\'est pas valide'),

        body('type')
            .notEmpty()
            .withMessage('Le type de connexion est manquant')
            .isString()
            .withMessage('Le type de connexion n\'est pas valide')
            .isIn(['gmail', 'yahoo', 'facebook', 'apple'])
            .withMessage('Le type de connexion doit être gmail ou yahoo'),
    ],

    passwordUpdate: [
        body('old_password')
            .notEmpty()
            .withMessage('Veuillez saisir votre mot de passe'),

        body('new_password')
            .notEmpty()
            .withMessage('Veuillez saisir votre mot de passe'),
    ]
};

export const ValidateClientAuth = (method: 'register' | 'login') => {
    return ClientAuthValidation[method];
};
