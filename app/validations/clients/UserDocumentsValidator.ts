import { body } from 'express-validator'

export const UserDocumentValidation = {
    create: [
        body('name')
            .notEmpty()
            .withMessage('Le nom du document est requis')
            .isString()
            .withMessage('Le nom du document doit être une chaîne de caractères'),

    ],

    update: [

        body('name')
            .optional()
            .isString()
            .withMessage('Le nom du document doit être une chaîne de caractères'),
    ]
}

export const ValidateUserDocument = (method: 'create' | 'update') => {
    return UserDocumentValidation[method]
}
