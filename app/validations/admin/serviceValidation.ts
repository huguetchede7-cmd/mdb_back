import { body } from 'express-validator';

export const ServiceValidation = {

    // Validation rules for service creation, update, and deletion
    create: [
        body('name').notEmpty().withMessage('Le nom est requis').isString(),
        body('price').optional().isNumeric(),
        body('short_description').optional().isString(),
        body('icon').optional().isString(),
        body('full_description').optional().isString(),
        body('is_visible').optional().isBoolean(),
    ],

    // Validation rules for updating a service
    update: [
        body('name').optional().isString(),
        body('price').optional().isNumeric(),
        body('short_description').optional().isString(),
        body('icon').optional().isString(),
        body('full_description').optional().isString(),
        body('is_visible').optional().isBoolean(),
    ],

};

export const validateService = (method: 'create' | 'update') => {
    return ServiceValidation[method];
};
