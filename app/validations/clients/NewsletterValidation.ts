import { body } from 'express-validator';

export const NewsletterValidation = {
    subscribe: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage("L'adresse email doit être valide")
    ],
};

export const ValidateNewsletter = (method: 'subscribe') => {
    return NewsletterValidation[method];
};
