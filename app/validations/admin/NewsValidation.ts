import { body } from 'express-validator';

export const NewsValidation = {
    create: [
        body('title')
            .notEmpty()
            .isString()
            .withMessage("Le nom de l'actualité doit être une chaîne de caractères"),
        body('short_description')
            .optional()
            .notEmpty()
            .isString()
            .withMessage("La description courte doit être une chaîne de caractères"),

        body('description')
            .isString()
            .withMessage("La description doit être une chaîne de caractères"),

    ],

    update: [
        body('title')
            .notEmpty()
            .isString()
            .withMessage("Le nom de l'actualité doit être une chaîne de caractères"),
        body('short_description')
            .optional()
            .notEmpty()
            .isString()
            .withMessage("La description courte doit être une chaîne de caractères"),
        body('description')
            .optional()
            .isString()
            .withMessage("La description doit être une chaîne de caractères"),
    ],

};

export const ValidateNews = (method: 'create' | 'update' ) => {
    return NewsValidation[method];
};
