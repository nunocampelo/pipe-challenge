import { Request, Response, NextFunction } from 'express'
import { HTTPNotFoundError } from './error/errors'
import { getLogger, Logger } from '../logger'

const logger: Logger = getLogger('requestChecks')

export const checkQParamPresent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    logger.info('checking presence of %s param', 'request.query.q')

    if (!req.query.q) {
        throw new HTTPNotFoundError('Missing q parameter')
    } else {
        next()
    }
}

export const checkParamPresent = (paramName: string) => {

    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        logger.info('checking presence of %s param', `request.query.${paramName}`)

        if (!req.query[paramName]) {
            throw new HTTPNotFoundError(`Missing ${paramName} parameter`)
        } else {
            next()
        }
    }
}