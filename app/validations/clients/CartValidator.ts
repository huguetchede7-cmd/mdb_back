import { body, param } from 'express-validator';
import ProductModel from '../../../models/ProductModel';

export const CartValidation = {
    create: [
        body('product_id')
            .notEmpty()
            .withMessage('Le champ product_id est requis')
            .isInt({ min: 1 })
            .withMessage('Le champ product_id doit être un entier positif')
            .custom((value) => {
                return ProductModel.findByPk(value).then((product) => {
                    if (!product) {
                        return Promise.reject('Le produit n\'existe pas');
                    }
                });
            }),

        body('quantity')
            .notEmpty()
            .withMessage('Le champ quantity est requis')
            .isInt({ min: 1 })
            .withMessage('La quantité doit être un entier supérieur ou égal à 1'),
    ],

    delete: [
        param('id')
            .notEmpty()
            .withMessage('L\'identifiant du panier est requis')
            .isInt({ min: 1 })
            .withMessage('L\'identifiant doit être un entier positif'),
    ],
};

export const ValidateCart = (method: 'create' | 'delete') => {
    return CartValidation[method];
};
