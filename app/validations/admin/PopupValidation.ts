import { body } from 'express-validator';

// Validation rules for popup creation, update, and deletion
export const popupValidation = {
    create: [
        body('redirection_link')
            .notEmpty().withMessage('Le lien de redirection est requis')
            .isString().withMessage('Le lien de redirection doit être une chaîne de caractères'),
    ],
    update: [
        body('redirection_link').optional().isString().withMessage('Le lien de redirection doit être une chaîne de caractères'),
    ],
};

export const validatePopup = (method: 'create' | 'update') => {
    return popupValidation[method];
};