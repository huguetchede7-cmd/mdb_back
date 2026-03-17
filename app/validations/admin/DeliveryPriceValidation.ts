import { body } from 'express-validator';
import DeliveryPriceModel from '../../../models/DeliveryPriceModel';

export const DeliveryPriceValidation = {
  create: [
    body('departure')
      .notEmpty()
      .withMessage('Le lieu de départ est requis')
      .isString()
      .withMessage('Le lieu de départ doit être une chaîne de caractères'),

    body('arrival')
      .notEmpty()
      .withMessage('Le lieu d’arrivée est requis')
      .isString()
      .withMessage('Le lieu d’arrivée doit être une chaîne de caractères')
      .custom(async (arrival, { req }) => {
        const departure = req.body.departure;
        if (!departure || !arrival) {
          // Skip check if missing data (will be caught by other validators)
          return true;
        }
        const existing = await DeliveryPriceModel.findOne({
          where: {
            departure: departure,
            arrival: arrival,
          }
        });
        if (existing) {
          throw new Error(
            `Une tarification pour ce trajet (${departure} -> ${arrival}) existe déjà`
          );
        }
        return true;
      }),

    body('price')
      .optional()
      .isInt()
      .withMessage('Le prix doit être un nombre entier'),
  ],

  update: [
    body('departure')
      .optional()
      .isString()
      .withMessage('Le lieu de départ doit être une chaîne de caractères'),
    body('arrival')
      .optional()
      .isString()
      .withMessage('Le lieu d’arrivée doit être une chaîne de caractères'),
    body('price')
      .optional()
      .isInt()
      .withMessage('Le prix doit être un nombre entier'),
  ],
};

export const validateDeliveryPrice = (method: 'create' | 'update') => {
  return DeliveryPriceValidation[method];
};
