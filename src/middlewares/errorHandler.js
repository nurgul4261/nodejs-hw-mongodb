import { HttpError } from 'http-errors';

// eslint-disable-next-line no-unused-vars
export const errorHandler = ((err, req, res, next) => {
    if (err instanceof HttpError) {
        return res.status(err.status).send({
            status: err.status,
            message: err.message,
            data: err,
        });
    }

    res.status(500).send({
      status: err.status ?? 500,
      message: 'Internal server error',
      data: err,
    });
});
