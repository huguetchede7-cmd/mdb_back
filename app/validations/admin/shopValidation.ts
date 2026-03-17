import { body } from 'express-validator';

export const ShopValidation = {
    create: [
        body('name').notEmpty().withMessage('Le nom est requis'),
        body('email').optional().isEmail().withMessage('Email invalide'),
        body('short_description').optional().isString(),
        body('phone1').optional().isString(),
        body('phone2').optional().isString(),
        body('whatsapp1').optional().isString(),
        body('whatsapp2').optional().isString(),
        body('latitude').optional().isString(),
        body('longitude').optional().isString(),
        body('address').optional().isString(),
    ],

    update: [
        body('name').optional().isString(),
        body('email').optional().isEmail().withMessage('Email invalide'),
        body('short_description').optional().isString(),
        body('phone1').optional().isString(),
        body('phone2').optional().isString(),
        body('whatsapp1').optional().isString(),
        body('whatsapp2').optional().isString(),
        body('latitude').optional().isString(),
        body('longitude').optional().isString(),
        body('address').optional().isString(),
    ],
};

export const validateShop = (method: 'create' | 'update' ) => {
    return ShopValidation[method];
};
