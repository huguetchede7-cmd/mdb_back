import { Request } from 'express';
import { validationResult, ValidationError } from 'express-validator';

// Utilisation du type ValidationError directement
const ValidationGetErrors = (req: Request): ValidationError[] | null => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errors.array();
    }
    return null;
};

export default ValidationGetErrors;
