import { body, param } from 'express-validator'

export const UserAdminValidation = {
  create: [
    body('firstname')
      .notEmpty()
      .withMessage('Le prénom est requis')
      .isString()
      .withMessage('Le prénom doit être une chaîne de caractères'),

    body('lastname')
      .notEmpty()
      .withMessage('Le nom est requis')
      .isString()
      .withMessage('Le nom doit être une chaîne de caractères'),

    body('email')
      .notEmpty()
      .withMessage("L'email est requis")
      .isEmail()
      .withMessage("Format d'email invalide"),

    body('password')
      .optional()
      .isLength({ min: 8 })
      .withMessage('Le mot de passe doit contenir au moins 8 caractères'),

    body('role_ids')
      .isArray({ min: 1 })
      .withMessage('Les rôles doivent être un tableau'),

    body('role_ids.*')
      .isInt()
      .withMessage('Chaque rôle doit être un identifiant valide'),
  ],

  update: [
    param('id')
      .notEmpty()
      .withMessage("L'identifiant est requis")
      .isInt()
      .withMessage("L'identifiant doit être un nombre"),

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
      .withMessage("Format d'email invalide"),

   /* body('phone')
      .optional()
      .isString()
      .withMessage('Le téléphone doit être une chaîne de caractères'),
*/
    body('role_ids')
      .isArray({ min: 1 })
      .withMessage('Les rôles doivent être un tableau'),

    body('password')
      .optional()
      .isLength({ min: 8 })
      .withMessage('Le mot de passe doit contenir au moins 8 caractères'),

    body('role_ids.*')
      .isInt()
      .withMessage('Chaque rôle doit être un identifiant valide'),
  ],

  delete: [
    param('id')
      .notEmpty()
      .withMessage("L'identifiant est requis pour la suppression")
      .isInt()
      .withMessage("L'identifiant doit être un nombre"),
  ],
}

export const validateUser = (
  method: 'create' | 'update' | 'delete'
) => {
  return UserAdminValidation[method]
}
