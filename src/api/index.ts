import { Request, Response, NextFunction } from 'express'
import v1Routes from './v1'

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>

export type Route = {
    path: string
    method: string
    handler: Handler | Handler[]
    auth?: {
        role?: string
    },
    cache?: boolean
}

export default [...v1Routes]