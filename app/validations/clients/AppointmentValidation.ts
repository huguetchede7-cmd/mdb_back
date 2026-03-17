import { body, query } from 'express-validator';

export const AppointmentValidation = {

    // Validation pour initialiser un rendez-vous (POST /app/appointments/init)
    init: [
        body('store')
            .notEmpty()
            .withMessage('Oups ! Il semble que vous n\'ayez pas choisi de magasin. Cliquez sur un magasin dans la liste pour continuer.')
            .isInt({ min: 1 })
            .withMessage('Oups ! Il semble que vous n\'ayez pas choisi de magasin. Cliquez sur un magasin dans la liste pour continuer.'),
        
        body('service')
            .notEmpty()
            .withMessage('Désolé, vous devez choisir un service pour votre rendez-vous. Sélectionnez le type de consultation souhaité.')
            .isInt({ min: 1 })
            .withMessage('Désolé, vous devez choisir un service pour votre rendez-vous. Sélectionnez le type de consultation souhaité.'),
        
        body('start_time')
            .notEmpty()
            .withMessage('Veuillez choisir une heure de rendez-vous valide')
            .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
            .withMessage("N'oubliez pas de choisir l'heure de votre rendez-vous ! Cliquez sur un créneau horaire disponible."),

        body('more_details')
            .notEmpty()
            .withMessage('Si vous souhaitez ajouter des informations, merci d\'utiliser uniquement du texte.')
            .isLength({ max: 2000 })
            .withMessage('Votre message est un peu long. Pourriez-vous le raccourcir ? (maximum 2000 caractères)')
    ],


    // Validation pour confirmer un rendez-vous (POST /app/appointments/confirm)
    confirm: [
        body('reference')
            .notEmpty()
            .withMessage('La référence du rendez-vous est requise')
            .isString()
            .withMessage('La référence doit être une chaîne de caractères')
            .isLength({ min: 3, max: 50 })
            .withMessage('La référence doit contenir entre 3 et 50 caractères'),

        body('transaction_id')
            .optional()
            .isString()
            .withMessage('La référence de la transaction doit être une chaîne de caractères')
    ],


    // Validation pour reprogrammer un rendez-vous (PUT /app/appointments/re-program)
    reProgram: [
        body('reference')
            .notEmpty()
            .withMessage('La référence du rendez-vous est requise')
            .isString()
            .withMessage('La référence doit être une chaîne de caractères')
            .isLength({ min: 3, max: 50 })
            .withMessage('La référence doit contenir entre 3 et 50 caractères'),

        body('new_start_time')
            .notEmpty()
            .withMessage('La nouvelle heure de début est requise')
            .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
            .withMessage("N'oubliez pas de choisir l'heure de votre rendez-vous ! Cliquez sur un créneau horaire disponible."),

        body('reason')
            .notEmpty()
            .withMessage('La raison de la reprogrammation est requise')
            .isString()
            .withMessage('La raison de la reprogrammation doit être une chaîne de caractères')
            .isLength({ max: 500 })
            .withMessage('La raison ne peut pas dépasser 500 caractères')
    ],


    // Validation pour récupérer les créneaux horaires (GET /app/appointments/time-slots)
    timeSlots: [
        query('shop')
            .notEmpty()
            .withMessage('L\'ID du shop est requis')
            .isInt({ min: 1 })
            .withMessage('L\'ID du shop doit être un nombre entier positif'),
        
        query('service')
            .notEmpty()
            .withMessage('L\'ID du service est requis')
            .isInt({ min: 1 })
            .withMessage('L\'ID du service doit être un nombre entier positif'),
        
        query('date')
            .notEmpty()
            .withMessage('La date est requise')
            .matches(/^\d{4}-\d{2}-\d{2}$/)
            .withMessage('La date doit être au format yyyy-mm-dd')
    ],


    // Validation pour verrouiller un créneau horaire (POST /app/appointments/lock-time-slots)
    lockTimeSlot: [
        body('shop')
            .notEmpty()
            .withMessage('L\'ID du shop est requis')
            .isInt({ min: 1 })
            .withMessage('L\'ID du shop doit être un nombre entier positif'),
        
        body('service')
            .notEmpty()
            .withMessage('L\'ID du service est requis')
            .isInt({ min: 1 })
            .withMessage('L\'ID du service doit être un nombre entier positif'),
        
        body('date')
            .notEmpty()
            .withMessage('La nouvelle heure de début est requise')
            .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
            .withMessage("N'oubliez pas de choisir l'heure de votre rendez-vous ! Cliquez sur un créneau horaire disponible."),
    ],


    // Validation pour annuler un rendez-vous
    cancel: [
        body('reference')
            .notEmpty()
            .withMessage('La référence du rendez-vous est requise')
            .isString()
            .withMessage('La référence doit être une chaîne de caractères')
            .isLength({ min: 3, max: 50 })
            .withMessage('La référence doit contenir entre 3 et 50 caractères'),
        
        body('cancel_reason')
            .notEmpty()
            .withMessage('La raison d\'annulation est requise')
            .isString()
            .withMessage('La raison d\'annulation doit être une chaîne de caractères')
            .isLength({ min: 10, max: 500 })
            .withMessage('La raison d\'annulation doit contenir entre 10 et 500 caractères')
    ]
};

// Fonction helper pour valider les appointments
export const validateAppointment = (method: keyof typeof AppointmentValidation) => {
    return AppointmentValidation[method];
};
