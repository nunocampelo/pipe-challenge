import { Relation } from '../../../domain/organisation/entity/Relation'
import { RelationDTO } from './dto/RelationDTO'
import { Request, Response, NextFunction } from 'express'
import * as requestProcessor from '../../../middleware/request/RequestProcessing'
import * as organisationConverter from './converter/OrganisationConverter'
import * as organizationService from '../../../domain/organisation/service/OrganisationService'
import * as caching from '../../../features/caching'

// import { getLogger, Logger } from '../../../logger'
// const logger: Logger = getLogger('OrganisationController')

export const postOrganisations = async (req: Request, res: Response, next: NextFunction) => {

  const orgs = organisationConverter.fromOrganizationRequestDTO(req.body)
  await organizationService.save(orgs)

  res.status(201).send()
  caching.getAgent()?.clear()
}

export const getOrganisationRelations = async (req: Request, res: Response, next: NextFunction) => {

  const page: number = parseInt(req.query.page as string || '0')
  const orgName = req.query.name as string

  const relations: Relation[] = await organizationService.getOrganisationRelations(orgName, page)

  const responseBody: RelationDTO[] = relations.map(rel => {
    return {
      org_name: rel.source.name,
      relationship_type: rel.type
    }
  })

  requestProcessor.storeResponseBody(req, responseBody)
  res.status(200).send(responseBody)
}
