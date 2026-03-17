import { body } from 'express-validator';
import ProductModel from '../../../models/ProductModel';

const FavoriteValidator = {
    switch: [
        body('product_id')
        .notEmpty()
        .withMessage('Le produit est requis.')
        .bail()
        .isNumeric()
        .withMessage('Identifiant produit invalide.')
        .bail()
        .custom(async (value) => {
            const product = await ProductModel.findByPk(value);
            if (!product) {
                throw new Error('Produit introuvable');
            }
            return true;
        })
    ]
};

export default FavoriteValidator;
