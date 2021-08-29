import { CachingConfig } from '../config'

import CachingAgent from './RedisAgent'
import { Route } from '../../api'
import { Router, Request, Response, NextFunction } from 'express'
import { getLogger, Logger } from '../../logger'

let cachingAgent: any;

export const init = (config: CachingConfig) => {

    const logger: Logger = getLogger('caching')

    cachingAgent = CachingAgent(config.provider?.redis.config)
    // cachingAgent.waitConnection()
    logger.info(`caching initialization %s`, cachingAgent.waitConnection() ? 'succeeded' : 'failed')

    const checkCache = async (req: Request, res: Response, next: NextFunction) => {

        if (!cachingAgent.isConnected()) {
            return next()
        }

        logger.info(`checking cache for value %s`, req.originalUrl)
        const rawValue = await cachingAgent.get(req.originalUrl)

        if (rawValue) {
            logger.info(`got value from caching`)
            const cachedValue: object = JSON.parse(rawValue)
            res.send(cachedValue)
        } else {
            logger.info(`value not found in cache, continuing...`)
            next()
        }
    }

    const updateCache = (req: Request, res: Response, next: NextFunction) => {

        res.on('finish', function () {

            if (!cachingAgent.isConnected()) {
                // return next()
                return
            }

            logger.info(`checking %s property`, 'request.locals.responseBody')
            if (req.locals?.responseBody) {
                logger.info(`setting cache value for key %s`, req.originalUrl)
                cachingAgent.set(req.originalUrl, JSON.stringify(req.locals.responseBody))
            }
        })

        next()
    }

    return {
        applyRoutesCaching: (routes: Route[], router: Router) => {

            logger.info(`applying caching handlers to routes`)

            routes.map((route: Route) => {

                const { method, path, cache } = route;

                if (cache) {
                    logger.info(`adding caching to %s %s`, method.toUpperCase(), path);
                    (router as any)[method](path, checkCache, updateCache)
                }
            })
        }
    }
}

export const getAgent = () => cachingAgent