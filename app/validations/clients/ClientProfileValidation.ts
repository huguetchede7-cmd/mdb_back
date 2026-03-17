import { body } from 'express-validator'

export const ClientProfileValidation = {
    editProfile: [
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
        .withMessage('Cette adresse email n\'est pas valide'),

    body('phone')
        .optional()
        .notEmpty()
        .custom(async (value) => {
            if (value && !/^\d+_\d+$/.test(value)) {
                throw new Error('Le format de votre numéro de téléphone n\'est pas valide');
            }
            return true;
        }),
    
    body('whatsapp')
        .optional()
        .notEmpty()
        .custom(async (value) => {
            if (value && !/^\d+_\d+$/.test(value)) {
                throw new Error('Le format de votre numéro de téléphone n\'est pas valide');
            }
            return true;
        }),
    ]
}

export const ValidateClientProfile = (method: 'editProfile') => {
    return ClientProfileValidation[method]
}
