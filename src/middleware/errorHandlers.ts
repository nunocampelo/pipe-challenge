import { Request, Response, NextFunction, Router } from 'express'
import * as errorHandler from './error/ErrorHandler'
import { getLogger, Logger } from '../logger'

const logger: Logger = getLogger('errorHandlers')

const handleBusinessError = (router: Router) => {

    logger.info(`adding handler for business errors`);

    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        errorHandler.businessError(err, res, next);
    })
}

const handleServerError = (router: Router) => {

    logger.info(`adding handler for server errors`);

    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        errorHandler.serverError(err, res, next);
    })
}

const handleClientError = (router: Router) => {

    logger.info(`adding handler for client errors`);

    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        errorHandler.clientError(err, res, next);
    })
}

const handle404Error = (router: Router) => {

    logger.info(`adding handler for not found errors`);

    router.use((req: Request, res: Response) => {
        errorHandler.notFoundError(req, res);
    })
}

export default [
    handleBusinessError,
    handleClientError,
    handleServerError,
    handle404Error
]