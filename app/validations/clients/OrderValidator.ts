import { body } from 'express-validator';
import { Op } from 'sequelize';
import ProductModel from '../../../models/ProductModel';
import DeliveryPriceModel from '../../../models/DeliveryPriceModel';

export const OrderValidator = {
  init: [
    body('products')
      .notEmpty()
      .withMessage('Les produits sont requis.')
      .isString()
      .withMessage('Les produits doivent être une chaîne de caractères.')
      .custom(async (value) => {
        const productsArr = String(value).split(',').map(item => item.trim()).filter(Boolean);

        if (!productsArr.length) {
          throw new Error('Aucun produit trouvé.');
        }

        for (const prod of productsArr) {
          if (!prod.includes(':')) {
            throw new Error(`Format de produit invalide pour "${prod}". Utilisez id:quantité.`);
          }
          const [id, quantity] = prod.split(':').map(e => e.trim());
          if ( id === undefined || quantity === undefined || id === '' || quantity === '' || isNaN(Number(id)) || isNaN(Number(quantity))) {
            throw new Error(`L'identifiant ou la quantité sont invalides pour "${prod}".`);
          }
          const qtyNum = Number(quantity);
          if (!Number.isInteger(qtyNum) || qtyNum < 1) {
            throw new Error(`La quantité doit être un entier positif pour "${prod}".`);
          }

          const checkProduct = await ProductModel.findOne({
            where: {
              id: id,
              quantity: {
                [Op.gte]: qtyNum
              }
            }
          });

          if (!checkProduct) {
            throw new Error(`Le produit "${id}" n'a pas assez de stock.`);
          }
        }
        return true;
      }),

    body('delivery')
    .custom(async (value, { req }) => {
      if (typeof req.body.delivery !== 'undefined' ) {
        const delivery = await DeliveryPriceModel.findOne({
          where: {
            id: value,
          }
        });
        if (!delivery) {
          throw new Error('Mode de livraison invalide.');
        }
        return true;
      }
      return true;
    }),

    body('delivery_adress')
      .custom(async (value, { req }) => {
        if (typeof req.body.delivery !== 'undefined' && !value) {
          throw new Error('Adresse de livraison invalide.');
        }
        if (value?.length < 10) {
          throw new Error('Adresse de livraison trop courte.');
        }
        return true;
      }),

    body('personnal_address')
      .optional()
      .isString()
      .withMessage('Adresse personnelle invalide.')
      .isLength({ max: 255 })
      .withMessage('Adresse personnelle trop longue.'),

    body('fullname')
      .isString()
      .withMessage('Nom et prénom invalides.')
      .isLength({ max: 255 })
      .withMessage('Nom et prénom trop long.'),

    body('email')
      .isEmail()
      .withMessage('Email invalide.')
      .isLength({ max: 255 })
      .withMessage('Adresse email trop longue.'),

    body('phone')
      .isString()
      .withMessage('Téléphone invalide.')
      .matches(/^\d{1,}_\d{6,}$/)
      .withMessage('Format téléphone: code_numéro. (Ex: 229_987654321)')
      .isLength({ max: 50 })
      .withMessage('Téléphone trop long.'),

    body('city')
      .isString()
      .withMessage('Ville invalide.')
      .isLength({ max: 255 })
      .withMessage('Nom de la ville trop longue.'),

    body('country')
      .isString()
      .withMessage('Pays invalide.')
      .isLength({ max: 255 })
      .withMessage('Nom du pays trop long.'),

    body('postal_code')
      .optional()
      .isString()
      .withMessage('Code postal invalide.')
      .isLength({ max: 20 })
      .withMessage('Code postal trop longue.'),
  ],

  confirm: [
    body('transaction_id')
      .notEmpty()
      .withMessage('Numéro de transaction requis.')
      .isString()
      .withMessage('Numéro de transaction invalide.'),
    body('reference')
      .notEmpty()
      .withMessage('Référence de commande requise.')
      .isString()
      .withMessage('Référence de commande invalide.'),
  ]
};
