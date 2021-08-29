import { Express } from 'express'

import * as caching from './caching'
import { Route } from '../api'
import { FeaturesConfig } from './config'
import { getLogger, Logger } from '../logger'

export default async (app: Express, routes: Route[], config: FeaturesConfig) => {

    const logger: Logger = getLogger('features')

    const cachingConfig = config.caching
    logger.info(`caching feature %s`, cachingConfig.enabled ? 'enabled' : 'disabled')

    if (cachingConfig.enabled) {
        caching.init(config.caching)
            .applyRoutesCaching(routes, app)
    }
}
