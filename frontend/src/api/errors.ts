import _ from 'lodash'

export class ApiError {
    constructor(public message: string) {}
}

export class UnauthorizedError implements ApiError {
    constructor(public message: string) {}
}

export class BadRequestError implements ApiError {
    constructor(public message: string) {}
}

export class NetworkError implements ApiError {
    constructor(public message: string) {}
}

export const extractError = (error: any) => {
    if (_.isString(error)) {
        return error
    }

    if (error?.message) {
        return error.message
    }

    return 'Something went wrong!'
}
