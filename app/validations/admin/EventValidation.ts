import { body } from 'express-validator';

export const EventValidation = {
    create: [
        body('name')
            .notEmpty()
            .isString()
            .withMessage("Le nom de l'événement doit être une chaîne de caractères"),
        body('description')
            .notEmpty()
            .isString()
            .withMessage("La description doit être une chaîne de caractères"),
        body('address')
            .notEmpty()
            .isString()
            .withMessage("L'adresse doit être une chaîne de caractères"),
        body('google_map_url')
            .optional(),
        body('longitude')
            .optional()
            .isFloat()
            .withMessage("La longitude doit être un nombre décimal"),
        body('latitude')
            .optional()
            .isFloat()
            .withMessage("La latitude doit être un nombre décimal"),
        body('date_from')
            .notEmpty()
            .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
            .withMessage("La date de début doit être au format YYYY-MM-DD HH:mm:ss"),
        body('date_to')
            .notEmpty()
            .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
            .withMessage("La date de fin doit être au format YYYY-MM-DD HH:mm:ss"),
        body('custom_author')
            .optional()
            .isString()
            .withMessage("L'auteur personnalisé doit être une chaîne de caractères"),
        body('targets')
            .isString()
            .withMessage("Les cibles doivent être un tableau d'identifiants"),
    ],

    update: [
        body('name')
            .notEmpty()
            .isString()
            .withMessage("Le nom de l'événement doit être une chaîne de caractères"),
        body('description')
            .notEmpty()
            .isString()
            .withMessage("La description doit être une chaîne de caractères"),
        body('address')
            .notEmpty()
            .isString()
            .withMessage("L'adresse doit être une chaîne de caractères"),
        body('google_map_url')
            .optional()
            .isURL()
            .withMessage("L'URL Google Maps doit être une URL valide"),
        body('longitude')
            .optional()
            .isFloat()
            .withMessage("La longitude doit être un nombre décimal"),
        body('latitude')
            .optional()
            .isFloat()
            .withMessage("La latitude doit être un nombre décimal"),
        body('date_from')
            .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
            .withMessage("La date de début doit être au format YYYY-MM-DD HH:mm:ss"),
        body('date_to')
            .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
            .withMessage("La date de fin doit être au format YYYY-MM-DD HH:mm:ss"),
        body('custom_author')
            .optional()
            .isString()
            .withMessage("L'auteur personnalisé doit être une chaîne de caractères"),
        body('targets')
            .isString()
            .withMessage("Les cibles doivent être un tableau d'identifiants"),
    ],
};

export const ValidateEvent = (method: 'create' | 'update') => {
    return EventValidation[method];
};