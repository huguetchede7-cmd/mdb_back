import { body } from 'express-validator'

export const EmailContactUsValidation = {
    process: [
        body('fullname')
            .notEmpty()
            .withMessage('Veuillez saisir votre nom complet')
            .isString()
            .withMessage("Le nom n'est pas valide"),

        body('email')
            .notEmpty() 
            .withMessage("Veuillez saisir votre adresse email")
            .isEmail()
            .withMessage('Cette adresse email n\'est pas valide'),

        body('service')
            .notEmpty()
            .withMessage('Veuillez sélectionner un service')
            .isString()
            .withMessage("Le service n'est pas valide")
            .isIn(['information', 'appointment', 'complaint', 'support', 'partnership', 'other'])
            .withMessage("Le service sélectionné n'est pas valide"),

        body('message')
            .notEmpty()
            .withMessage('Veuillez saisir votre message')
            .isString()
            .withMessage("Le message n'est pas valide")
    ]
}
