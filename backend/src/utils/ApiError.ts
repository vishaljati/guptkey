import { type ApiFailure } from "../types/Api.types.js";

export class ApiError extends Error {
    public statusCode: number;
    public errors?: unknown;

    constructor(
        statusCode: number,
        message: string,
        errors?: unknown,
        stack?: string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON(): ApiFailure {
        return {
            statusCode: this.statusCode,
            message: this.message,
            errors: this.errors,
        };
    }
}