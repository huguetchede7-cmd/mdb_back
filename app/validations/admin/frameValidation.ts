import { body } from 'express-validator';

export const FrameValidation = {
    create: [
        body('name')
            .notEmpty()
            .withMessage('Le nom de la monture est requis')
            .isString()
            .withMessage('Le nom doit être une chaîne de caractères'),
    ],

    update: [
        body('name')
            .optional()
            .isString()
            .withMessage('Le nom doit être une chaîne de caractères'),
    ],

    delete: [
        body('target')
            .notEmpty()
            .withMessage("L'identifiant est requis pour la suppression"),
    ],
};

export const validateFrame = (method: 'create' | 'update' | 'delete') => {
    return FrameValidation[method];
};
