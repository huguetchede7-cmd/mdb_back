import { body } from 'express-validator'

export const UserValidation = {
  create: [
    body('firstname')
      .notEmpty()
      .isString()
      .withMessage('Le prénom doit être une chaîne de caractères'),

    body('lastname')
      .notEmpty()
      .isString()
      .withMessage('Le nom doit être une chaîne de caractères'),

    body('email')
      .notEmpty()
      .isEmail()
      .withMessage('L’email doit être une adresse email valide'),

    body('phone')
      .optional()
      .isString()
      .withMessage('Le numéro de téléphone doit être une chaîne de caractères'),

    body('whatsapp')
      .optional()
      .isString()
      .withMessage('Le numéro de whatsapp doit être une chaîne de caractères'),

    body('client_ref')
      .optional()
  ],
  update: [
    body('firstname')
      .optional()
      .isString()
      .withMessage('Le prénom doit être une chaîne de caractères'),

    body('lastname')
      .optional()
      .isString()
      .withMessage('Le nom doit être une chaîne de caractères'),

    body('email')
      .optional()
      .isEmail()
      .withMessage('L’email doit être une adresse email valide'),

    body('phone')
      .optional()
      .isString()
      .withMessage('Le numéro de téléphone doit être une chaîne de caractères'),

    body('whatsapp')
      .optional()
      .isString()
      .withMessage('Le numéro de whatsapp doit être une chaîne de caractères'),

    body('client_ref')
      .optional()
  ],
}

export const ValidateUser = (method: 'create' | 'update') => {
  return UserValidation[method]
}