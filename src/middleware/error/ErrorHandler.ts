import { Request, Response, NextFunction } from 'express'
import { getLogger, Logger } from '../../logger'
import { BusinessError, HTTPClientError } from './errors'

const logger: Logger = getLogger('ErrorHandler')

export const businessError = (err: Error, res: Response, next: NextFunction) => {

    if (err instanceof BusinessError) {

        logger.error(`business error`, err);
        res.status(400).send(err.message);

    } else {
        next(err);
    }
}

export const clientError = (err: Error, res: Response, next: NextFunction) => {

    if (err instanceof HTTPClientError) {

        logger.error(`client error`, err);
        res.status(err.statusCode).send(err.message);

    } else {
        next(err);
    }
}

export const serverError = (err: Error, res: Response, next: NextFunction) => {

    logger.error(`server error`, err);

    if (process.env.NODE_ENV === 'production') {

        res.status(500).send('internal Server Error');

    } else {

        res.status(500).send(err.stack);
    }
}

export const notFoundError = (req: Request, res: Response) => {
    logger.error(req.url);
    res.status(404).send("This is not the page you're looking for");
}