import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from 'sequelize';
import { HttpStatusEnum, ReasonPhrasesEnum } from '../enums';
import { HttpError } from '@src/helpers/httpError';

/**
 * Build error response for validation errors.
 */
function buildError(err: any) {
    // Custom HttpError
    if (err instanceof HttpError) {
        return {
            success: false,
            code: err.code,
            message: err.message,
            ...(err.details && { details: err.details }),
        };
    }

    // Validation errors
    if (err.isJoi) {
        return {
            success: false,
            code: HttpStatusEnum.BAD_REQUEST,
            message: ReasonPhrasesEnum.BAD_REQUEST,
            details:
                err.details &&
                err.details.map((err: any) => {
                    return {
                        message: err.message,
                        param: err.path.join('.'),
                    };
                }),
        };
    }

    // HTTP errors
    else if (err.isBoom) {
        return {
            success: false,
            code: err.output.statusCode,
            message: err.output.payload.message || err.output.payload.error,
            ...(err.data && {
                details: err.data.map((err: any) => {
                    return {
                        message: err.message,
                        param: err.path.join('.'),
                    };
                }),
            }),
        };
    } else if (err.constructor.name === 'FirebaseAuthError') {
        return {
            success: false,
            code: HttpStatusEnum.UNAUTHORIZED,
            message: 'Invalid access token',
            ...(err.data && {
                details: err.data.map((err: any) => {
                    return {
                        message: 'Invalid access token',
                        param: err.path.join('.'),
                    };
                }),
            }),
        };
    }
    // Sequelize errors
    else if (err instanceof UniqueConstraintError) {
        return {
            success: false,
            code: HttpStatusEnum.CONFLICT,
            message: ReasonPhrasesEnum.CONFLICT,
            details: [
                {
                    message: err.message,
                },
            ],
        };
    } else if (err instanceof ForeignKeyConstraintError) {
        return {
            success: false,
            code: HttpStatusEnum.CONFLICT,
            message: ReasonPhrasesEnum.CONFLICT,
            details: [
                {
                    message: err.message,
                },
            ],
        };
    } else if (err instanceof ValidationError) {
        return {
            success: false,
            code: HttpStatusEnum.BAD_REQUEST,
            message: ReasonPhrasesEnum.BAD_REQUEST,
            details: err.errors.map((item) => {
                return {
                    message: item.message,
                    path: item.path,
                };
            }),
        };
    } else if (err.code == 'LIMIT_FILE_SIZE') {
        return {
            success: false,
            code: HttpStatusEnum.REQUEST_TOO_LONG,
            message: ReasonPhrasesEnum.REQUEST_TOO_LONG,
        };
    }

    // Return INTERNAL_SERVER_ERROR for all other cases
    else {
        return {
            success: false,
            code: HttpStatusEnum.INTERNAL_SERVER_ERROR,
            message: ReasonPhrasesEnum.INTERNAL_SERVER_ERROR,
        };
    }
}

export default buildError;
