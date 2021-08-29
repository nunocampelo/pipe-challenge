import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'js-yaml'
import fs from 'fs'

const openAPIDocument: any = YAML.safeLoad(fs.readFileSync('./config/api-docs/v1.yaml', 'utf8'))

export const handleAPIDocs = (router: Router) =>
    router.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(openAPIDocument))