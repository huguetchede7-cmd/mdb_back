import { body } from 'express-validator';

export const bannerValidation = {
    create: [
        body('text').notEmpty().withMessage('Le texte de la bannière est requis'),
       body('redirection_link').optional().isString().withMessage('Le lien de redirection doit être une URL valide'),
    ],
    update: [
      //  body('target').notEmpty().withMessage('ID requis pour mise à jour'),
        body('text').optional().isString(),
       body('redirection_link').optional().isString().withMessage('Le lien de redirection doit être une URL valide'),
    ],
    delete: [
        body('target').notEmpty().withMessage('ID requis pour suppression'),
    ],
};

export const validateBanner = (method: 'create' | 'update' | 'delete') => {
    return bannerValidation[method];
};