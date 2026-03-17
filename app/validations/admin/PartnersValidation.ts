import { body } from 'express-validator';

export const PartnersValidation = {
    create: [
        body('name').notEmpty().withMessage('Le nom est requis'),
        body('link').notEmpty().isURL().withMessage('Le lien doit être une URL valide'),
        body('type').isIn(['business', 'professional']).withMessage('Le type doit être "business" ou "professional"'),
    ],

    update: [
        body('name').notEmpty().isString(),
        body('link').notEmpty().isURL().withMessage('Le lien doit être une URL valide'),
        body('type').notEmpty().isIn(['business', 'professional']).withMessage('Le type doit être "business" ou "professional"'),
    ],
};

export const validatePartners = (method: 'create' | 'update' ) => {
    return PartnersValidation[method];
};
