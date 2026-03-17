import { body } from 'express-validator';

export const brandValidation = {
    create: [
        body('name').notEmpty().withMessage('Le texte de la bannière est requis'),
        body('is_famous').optional().isBoolean(),
    ],
    update: [
        body('name').optional().isString(),
        body('is_famous').optional().isBoolean(),
    ],
    delete: [
        body('target').notEmpty().withMessage('ID requis pour suppression'),
    ],
};

export const validateBanner = (method: 'create' | 'update' | 'delete') => {
    return brandValidation[method];
};