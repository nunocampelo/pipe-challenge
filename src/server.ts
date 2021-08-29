import 'reflect-metadata'
import express, { Express } from 'express'
import morgan from 'morgan'

import middleware from './middleware'
import routes from './api'
import errorHandlers from './middleware/errorHandlers'
import { Logger, getLogger } from './logger'
import initFeatures from './features'
import featuresConfig from './features/config'
import { applyMiddleware, applyRoutes } from './middleware/request/RequestProcessing'
import { createConnection } from 'typeorm'

const initialize = new Promise<Express>(async (resolve: any) => {

    await createConnection()

    process.on('uncaughtException', e => {
        logger.error('uncaught exception', e)
        process.exit(1)
    })

    process.on('unhandledRejection', e => {
        logger.error('unhandled rejection', e)
        process.exit(1)
    })

    const logger: Logger = getLogger('server')
    const app: Express = express()

    app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
        stream: {
            write: function (message: string) {
                logger.info(message)
            }
        }
    }))

    // initialize app features
    initFeatures(app, routes, featuresConfig)

    // TIP: Request handlers are applied by their added order
    logger.info(`adding general middleware`)
    applyMiddleware(middleware, app)

    applyRoutes(routes, app)

    applyMiddleware(errorHandlers, app)

    if (process.env.NODE_ENV === 'test') {
        return resolve(app)
    }

    const { PORT = 7000 } = process.env
    app.listen(PORT, async () => {
        logger.info(`server running at http://localhost:%s`, PORT)
        resolve(app)
    })
})

export default initialize