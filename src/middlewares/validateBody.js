export const validateBody = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        res.status(400).send({
            status: 400,
            message: 'Validation failed',
            errors: error.details.map((details) => details.message),
        });
    }
};
