import * as Express from 'express'

declare module 'express' {
    export interface Request {
        locals?: {
            responseBody?: object
        }
    }
}