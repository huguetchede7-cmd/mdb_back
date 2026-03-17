import { body, param } from 'express-validator'

export const AppSettingValidation = {
  create: [
    body('slug')
      .notEmpty()
      .withMessage('Le slug est requis')
      .isString()
      .withMessage('Le slug doit être une chaîne de caractères'),

    body('label')
      .notEmpty()
      .withMessage('Le label est requis')
      .isString()
      .withMessage('Le label doit être une chaîne de caractères'),

    body('description')
      .optional()
      .isString()
      .withMessage('La description doit être une chaîne de caractères'),

    body('value')
      .notEmpty()
      .withMessage('La valeur est requise')
      .isString()
      .withMessage('La valeur doit être une chaîne de caractères'),
  ],

  update: [
    body('value')
      .notEmpty()
      .withMessage('La valeur est requise')
      .isString()
      .withMessage('La valeur doit être une chaîne de caractères'),
  ],

  delete: [
    param('id')
      .notEmpty()
      .withMessage("L'identifiant est requis pour la suppression")
      .isInt()
      .withMessage("L'identifiant doit être un nombre"),
  ],
}

export const validateAppSetting = (
  method: 'create' | 'update' | 'delete'
) => {
  return AppSettingValidation[method]
}
