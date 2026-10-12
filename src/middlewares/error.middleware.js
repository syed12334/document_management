
const ApiError = require('../utils/ApiError');

/* eslint-disable no-unused-vars */

const notFoundHandler = (req, res, next) => {
    next(
        ApiError.notFound(
            `Route ${req.originalUrl} not found`
        )
    );
};

const errorHandler = (err, req, res, next) => {

    let {
        statusCode = 500,
        message = 'Internal Server Error',
        details
    } = err;

    // Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    }

    // Sequelize unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Duplicate record found';
    }

    // Render appropriate error page
    const errorPages = {
        400: '400',
        403: '403',
        404: '404',
        409: '409',
        429: '429',
        500: '500'
    };

    const errorView = errorPages[statusCode] || '500';

    return res.status(statusCode).render(
        `errors/${errorView}`,
        {
            layout: 'layouts/error',
            title: statusCode === 429
                ? 'Too Many Requests'
                : statusCode === 404
                    ? 'Page Not Found'
                    : 'Server Error',
            message,
            details
        }
    );
};

module.exports = {
    notFoundHandler,
    errorHandler
};

