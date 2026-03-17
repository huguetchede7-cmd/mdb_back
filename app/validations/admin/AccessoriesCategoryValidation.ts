import { body } from 'express-validator';

export const AccessoriesCategoryValidation = {
    create: [
        body('name')
            .notEmpty()
            .withMessage('Le nom de la catégorie est requis')
            .isString()
            .withMessage('Le nom de la catégorie doit être une chaîne de caractères')
            .isLength({ min: 2, max: 100 })
            .withMessage('Le nom de la catégorie doit contenir entre 2 et 100 caractères'),
    ],

    update: [
        body('name')
            .optional()
            .isString()
            .withMessage('Le nom de la catégorie doit être une chaîne de caractères')
            .isLength({ min: 2, max: 100 })
            .withMessage('Le nom de la catégorie doit contenir entre 2 et 100 caractères'),
    ],
};

export const validateAccessoriesCategory = (method: 'create' | 'update') =>
    AccessoriesCategoryValidation[method];
