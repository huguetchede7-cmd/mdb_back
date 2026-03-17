import { body } from 'express-validator';

export const PasswordValidation = {
    editPassword: [
        body('old_password')
        .notEmpty()
        .withMessage('Veuillez saisir votre mot de passe'),
    
        body('new_password')
        .notEmpty()
        .withMessage('Veuillez saisir votre mot de passe')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères')
        .matches(/[a-z]/)
        .withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
        .matches(/[A-Z]/)
        .withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
        .matches(/[0-9]/)
        .withMessage('Le mot de passe doit contenir au moins un chiffre')
    ]
};

export const validatePassword = (method: keyof typeof PasswordValidation) => {
    return PasswordValidation[method];
};