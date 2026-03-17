import { body } from 'express-validator';

export const bannerTextValidation = {
    create: [
        body('text')
            .notEmpty()
            .withMessage('Le texte de la bannière est requis')
            .isString()
            .withMessage('Le texte doit être une chaîne de caractères'),
    ],
    update: [
        body('target')
            .notEmpty()
            .withMessage('ID requis pour mise à jour'),
        body('text')
            .optional()
            .isString()
            .withMessage('Le texte doit être une chaîne de caractères'),
    ],
    delete: [
        body('target')
            .notEmpty()
            .withMessage('ID requis pour suppression'),
    ],
};

export const validateBannerText = (method: 'create' | 'update' | 'delete') => {
    return bannerTextValidation[method];
};
