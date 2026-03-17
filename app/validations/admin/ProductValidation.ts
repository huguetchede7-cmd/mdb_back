import { body } from 'express-validator';

export const ProductValidation = {
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

        body('size')
            .optional()
            .isString()
            .withMessage("La taille doit être une chaîne de caractères"),

        body('quantity')
            .optional()
            .isInt({ min: 0 })
            .withMessage("La quantité doit être un entier positif"),

        body('frame_id')
            .optional()
            .isInt()
            .withMessage("frame_id doit être un entier"),

       body('is_prestige')
         .optional()
         .isBoolean()
         .withMessage("is_prestige doit être un booléen"),

      body('genre')
        .isInt({ min: 0 })
        .withMessage("Le genre est requis"),
      body('color')
        .optional()
        .isString()
        .withMessage("La couleur doit être une chaîne de caractères"),
      body('dimension')
        .optional()
        .isString()
        .withMessage("La dimension doit être une chaîne de caractères"),


        body('brand_id')
            .optional()
            .isInt()
            .withMessage("brand_id doit être un entier"),

        body('category_id')
            .optional()
            .isInt()
            .withMessage("category_id doit être un entier"),

        body('shape_id')
            .optional()
            .isInt()
            .withMessage("glass_shape_id doit être un entier"),

        body('is_famous')
            .optional()
            .isBoolean()
            .withMessage("is_famous doit être un booléen"),

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

        body('frame_id')
            .optional()
            .isInt()
            .withMessage("frame_id doit être un entier"),

        body('brand_id')
            .optional()
            .isInt()
            .withMessage("brand_id doit être un entier"),

        body('category_id')
            .optional()
            .isInt()
            .withMessage("category_id doit être un entier"),

        body('shape_id')
            .optional()
            .isInt()
            .withMessage("glass_shape_id doit'être un entier"),

        body('is_famous')
            .optional()
            .isBoolean()
            .withMessage("is_famous doit être un booléen"),
      body('color')
        .optional()
        .isString()
        .withMessage("La couleur doit être une chaîne de caractères"),
      body('dimension')
        .optional()
        .isString()
        .withMessage("La dimension doit être une chaîne de caractères"),
      body('manufacturd_description')
        .optional()
        .isString(),

      body('is_prestige')
          .optional()
          .isBoolean()
          .withMessage("is_prestige doit être un booléen"),

      body('genre')
        .optional()
        .isInt()
        .withMessage("genre doit être un entier"),

        body('description')
            .optional()
            .isString()
            .withMessage("La description doitêtre une chaîne de caractères"),

        body('promotional_price')
        .optional()
        .isString()
        .withMessage("Le prix doit être un nombre")

    ],

    duplicate:[
      body('ref')
        .notEmpty()
        .withMessage("La référence est requise")
        .isString()
        .withMessage("La référence doit être une chaîne de caractères"),
    ]
};

export const ValidateProduct = (method: 'create' | 'update') => {
    return ProductValidation[method];
};
