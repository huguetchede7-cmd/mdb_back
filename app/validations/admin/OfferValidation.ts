import { body } from 'express-validator'

export const OfferValidation = {
  genaral: [
    body('title').notEmpty().isString().withMessage("Le titre de l'offre doit être une chaîne de caractères"),

    body('description').notEmpty().isString().withMessage('La description doit être une chaîne de caractères'),

    body('valid_from')
      .notEmpty()
      .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
      .withMessage('La date de début doit être au format yyyy-mm-dd hh:ii:ss'),

    body('expired_at').optional().isString(),

    body('categorie').isInt({ min: 1 }).withMessage('La catégorie doit être un identifiant valide'),

    body('code').optional().isString().withMessage('Le code doit être une chaîne de caractères'),

    body('client_types_target').isIn([1, 2, 3]).withMessage('Le type client doit être Club (1), Elite (2) ou Public (3)'),

    body('gender_types_target').isIn([1, 2, 3, 4, 5, 6, 7, 8]).withMessage('Le type de genre doit être un identifiant valide entre 1 et 8'),

    body('discount')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage("La remise doit être un nombre entre 0 et 100"),

    body('is_prestige')
        .isBoolean()
        .withMessage("Le statut prestige doit être un booléen"),
    ],
}


export const ValidateOffer = (method: 'genaral') => {
  return OfferValidation[method]
}
