import { Express, Request, Response, NextFunction } from 'express'

import { Route } from '../../api'

type Wrapper = ((router: Express) => void)

export const applyMiddleware = (middleware: Wrapper[], router: Express) => {
    for (const wrapper of middleware) {
        wrapper(router)
    }
}

export const applyRoutes = (routes: Route[], router: Express) => {
    for (const route of routes) {
        const { method, path, handler } = route;
        (router as any)[method](path, handler)
    }
}

export const storeResponseBody = (request: Request, body: object) => {

    if (!request.locals) {
        request.locals = {}
    }

    request.locals.responseBody = body
}

export const emptyRequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    next()
}