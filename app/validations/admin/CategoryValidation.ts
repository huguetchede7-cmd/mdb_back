import { body } from "express-validator";

export const CategoryValidation = {
    create: [
        body("name")
            .notEmpty()
            .withMessage("Le nom de la catégorie est requis")
            .isString()
            .withMessage("Le nom doit être une chaîne de caractères"),
    ],
    update: [
        body("name")
            .optional()
            .isString()
            .withMessage("Le nom doit être une chaîne de caractères"),
    ],
    delete: [
        body("id")
            .notEmpty()
            .withMessage("ID requis pour suppression")
            .isInt()
            .withMessage("L'ID doit être un entier valide"),
    ],
};

export const validateCategory = (method: "create" | "update" | "delete") => {
    return CategoryValidation[method];
};
