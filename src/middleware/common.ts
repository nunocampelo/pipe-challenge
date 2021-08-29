import { Router } from 'express'
import cors from 'cors'
import parser from 'body-parser'
import compression from 'compression'

import cookieParser from 'cookie-parser'
import { getLogger, Logger } from '../logger'

const logger: Logger = getLogger('middleware.common')

export const handleCors = (router: Router) => {

    logger.info(`adding cors middleware`)
    router.use(cors({ credentials: true, origin: true }))
}

export const handleBodyRequestParsing = (router: Router) => {

    logger.info(`adding json parsing middleware`)
    router.use(parser.urlencoded({ extended: true }))
    router.use(parser.json())
}

export const handleCookiesParsing = (router: Router) => {

    logger.info(`adding cookie parsing middleware`)
    router.use(cookieParser())
}

export const handleCompression = (router: Router) => {

    logger.info(`adding http request compression middleware`)
    router.use(compression())
}