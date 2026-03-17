import { body } from 'express-validator';

export class AppointmentAdminValidation {
    /**
     * Validation pour la méthode onCompleted (marquer comme terminé)
     */
    static onCompleted = [
        body('reference')
            .notEmpty()
            .withMessage('La référence du rendez-vous est requise')
            .isString()
            .withMessage('La référence doit être une chaîne de caractères'),
    ];

    /**
     * Validation pour la méthode onCanceled (annuler un rendez-vous)
     */
    static onCanceled = [
        body('reference')
            .notEmpty()
            .withMessage('La référence du rendez-vous est requise')
            .isString()
            .withMessage('La référence doit être une chaîne de caractères'),
        
        body('motif')
            .notEmpty()
            .withMessage('Le motif d\'annulation est obligatoire')
            .isString()
            .withMessage('Le motif doit être une chaîne de caractères')
            .isLength({ min: 10, max: 500 })
            .withMessage('Le motif doit contenir entre 10 et 500 caractères')
    ];
}
