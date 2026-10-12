class ApiError extends Error {

    constructor(statusCode, message, details = null, view = 'errors/error') {
        super(message);

        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.details = details;
        this.view = view;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(
        message = 'Bad request',
        details = null,
        view = 'errors/400'
    ) {
        return new ApiError(400, message, details, view);
    }

    static unauthorized(
        message = 'Unauthorized',
        details = null,
        view = 'errors/401'
    ) {
        return new ApiError(401, message, details, view);
    }

    static forbidden(
        message = 'Forbidden',
        details = null,
        view = 'errors/403'
    ) {
        return new ApiError(403, message, details, view);
    }

    static notFound(
        message = 'Resource not found',
        details = null,
        view = 'errors/404'
    ) {
        return new ApiError(404, message, details, view);
    }

    static conflict(
        message = 'Resource already exists',
        details = null,
        view = 'errors/409'
    ) {
        return new ApiError(409, message, details, view);
    }

    static internal(
        message = 'Internal server error',
        details = null,
        view = 'errors/500'
    ) {
        return new ApiError(500, message, details, view);
    }
}

module.exports = ApiError;