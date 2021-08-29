import { BusinessError } from '../../../middleware/error/errors'
import { Organisation } from '../entity/Organisation'
import { Relation } from '../entity/Relation'
import * as organisationRepo from '../repository/OrganisationRepository'

export const save = async (organisations: Organisation[]) => {

  try {
    await organisationRepo.saveAll(organisations)
  } catch (e) {
    throw new BusinessError('Error persisting orgs')
  }
}

export const getOrganisationRelations = async (orgName: string, page: number = 0): Promise<Relation[]> => {
  return organisationRepo.getOrganisationRelations(orgName, page)
}