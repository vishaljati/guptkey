import { type ApiSuccess } from "../types/Api.types.js";

export class ApiResponse<T> {
    constructor(
        public readonly statusCode: number,
        public readonly message: string,
        public readonly data?: T,
    ) {}

    toJSON(): ApiSuccess<T> {
        return {
            statusCode: this.statusCode,
            data: this.data,
            message: this.message,
        };
    }

}