import { validationResult } from 'express-validator';
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        res.status(400).json({
            success: false,
            message: errorMessages,
            error: 'Validation failed'
        });
        return;
    }
    next();
};
//# sourceMappingURL=validate.js.map