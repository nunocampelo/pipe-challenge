
export class BusinessError extends Error {

    readonly name: string

    constructor(message: object | string) {

        if (message instanceof Object) {
            super(JSON.stringify(message))
        } else {
            super(message)
        }

        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export abstract class HTTPClientError extends Error {

    readonly statusCode: number;
    readonly name: string;

    constructor(message: object | string) {

        if (message instanceof Object) {
            super(JSON.stringify(message));
        } else {
            super(message);
        }

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class HTTPBadRequestError extends HTTPClientError {

    readonly statusCode = 400;

    constructor(message: string | object = 'Bad Request') {
        super(message)
    }
}

export class HTTPUnauthorizedError extends HTTPClientError {

    readonly statusCode = 401;

    constructor(message: string | object = 'Unauthorized') {
        super(message);
    }
}

export class HTTPForbiddenError extends HTTPClientError {

    readonly statusCode = 403;

    constructor(message: string | object = 'Forbidden') {
        super(message);
    }
}

export class HTTPNotFoundError extends HTTPClientError {

    readonly statusCode = 404;

    constructor(message: string | object = 'Not found') {
        super(message);
    }
}