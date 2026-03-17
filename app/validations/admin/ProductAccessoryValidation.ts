import { body } from 'express-validator';

export const ProductAccessoryValidation = {
    create: [
        body('name')
            .notEmpty()
            .withMessage("Le nom du produit est requis")
            .isString()
            .withMessage("Le nom du produit doit être une chaîne de caractères"),

        body('price')
            .notEmpty()
            .withMessage("Le prix est requis")
            .isNumeric()
            .withMessage("Le prix doit être un nombre"),

        body('ref')
            .notEmpty()
            .withMessage("La référence est requise")
            .isString()
            .withMessage("La référence doit être une chaîne de caractères"),

            body('brand_id')
            .optional()
            .isInt()
            .withMessage("brand_id doit être un entier"),


        body('quantity')
            .optional()
            .isInt({ min: 0 })
            .withMessage("La quantité doit être un entier positif"),

      body('color')
        .optional()
        .isString()
        .withMessage("La couleur doit être une chaîne de caractères"),

      
        body('accessories_category')
            .optional()
            .isInt()
            .withMessage("accessories_category doit être un entier"),

        body('description')
            .optional()
            .isString()
            .withMessage("La description doit être une chaîne de caractères"),
      body('manufacturd_description')
        .optional()
        .isString(),
        body('promotional_price')
        .optional()
        .isString()
        .withMessage("Le prix doit être un nombre"),
    ],

    update: [
        body('name')
            .optional()
            .isString()
            .withMessage("Le nom du produit doit être une chaîne de caractères"),

        body('price')
            .optional()
            .isNumeric()
            .withMessage("Le prix doit être un nombre"),

        body('ref')
            .optional()
            .isString()
            .withMessage("La référence doit être une chaîne de caractères"),

        body('size')
            .optional()
            .isString()
            .withMessage("La taille doit être une chaîne de caractères"),

        body('quantity')
            .optional()
            .isInt({ min: 0 })
            .withMessage("La quantité doit être un entier positif"),

        body('brand_id')
            .optional()
            .isInt()
            .withMessage("brand_id doit être un entier"),

            body('accessories_category')
            .optional()
            .isInt()
            .withMessage("accessories_category doit être un entier"),

      body('color')
        .optional()
        .isString()
        .withMessage("La couleur doit être une chaîne de caractères"),
      body('manufacturd_description')
        .optional()
        .isString(),

        body('description')
            .optional()
            .isString()
            .withMessage("La description doitêtre une chaîne de caractères"),

        body('promotional_price')
        .optional()
        .isString()
        .withMessage("Le prix doit être un nombre")

    ],
};

export const ValidateProductAccessory = (method: 'create' | 'update') => {
    return ProductAccessoryValidation[method];
};
