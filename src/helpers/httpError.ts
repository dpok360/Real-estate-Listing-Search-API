import { HttpStatusEnum, ReasonPhrasesEnum } from '@src/enums';

export class HttpError extends Error {
    public readonly code: HttpStatusEnum;
    public readonly details?: string;

    constructor(code: HttpStatusEnum, message: string, details?: string) {
        super(message);
        this.name = 'HttpError';
        this.code = code;
        this.details = details;
    }

    // Convenience factories
    static notFound(message: string, details?: string) {
        return new HttpError(HttpStatusEnum.NOT_FOUND, message, details);
    }

    static conflict(message: string, details?: string) {
        return new HttpError(HttpStatusEnum.CONFLICT, message, details);
    }

    static badRequest(message: string, details?: string) {
        return new HttpError(HttpStatusEnum.BAD_REQUEST, message, details);
    }

    static unauthorized(message: string, details?: string) {
        return new HttpError(HttpStatusEnum.UNAUTHORIZED, message, details);
    }

    static forbidden(message: string, details?: string) {
        return new HttpError(HttpStatusEnum.FORBIDDEN, message, details);
    }
}
