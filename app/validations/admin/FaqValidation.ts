import { body } from 'express-validator';

export const FaqValidation = {
    create: [
        body('question').notEmpty().withMessage('La question est requise'),
        body('answer').notEmpty().withMessage('La réponse est requise'),
    ],

    update: [
        body('question').optional().isString(),
        body('answer').optional().isString(),
    ],
};

export const validateFaq = (method: 'create' | 'update' ) => {
    return FaqValidation[method];
};
