import { body } from 'express-validator';

export const CommentValidation = {
  create: [
    body('type')
      .notEmpty()
      .isString()
      .withMessage('Le type de commentaire est requis'),

    body('item_id')
      .notEmpty()
      .isInt({ gt: 0 })
      .withMessage('L’élément ciblé est invalide'),

    body('message')
      .notEmpty()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Le message du commentaire est requis'),
  ],


  update: [
    body('message')
      .notEmpty()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Le message du commentaire est requis'),
  ],


};

export const ValidateComment = (
  method:
    | 'create'
    | 'update'
) => {
  return CommentValidation[method];
};
