import { Organisation } from '../../../../domain/organisation/entity/Organisation'
import { OrganisationRequestDTO } from '../dto/OrganisationRequestDTO'

export const fromOrganizationRequestDTO = (orgDTO: OrganisationRequestDTO): Organisation[] => {

  const organisations: Organisation[] = []
  const topLevelOrg: Organisation = Organisation.from(orgDTO.org_name)

  organisations.push(topLevelOrg)

  if (orgDTO.daughters) {
    organisations.push(...fromDaughtersOrganisationRequestDTO(topLevelOrg, orgDTO.daughters))
  }

  return organisations
}

const fromDaughtersOrganisationRequestDTO = (parentOrg: Organisation, daughterDTOs: OrganisationRequestDTO[]): Organisation[] => {

  const orgs: Organisation[] = []
  const daughterOrgs: Organisation[] = []

  daughterDTOs.map((daughterDTO: OrganisationRequestDTO, daughterIndex: number, daughtersDTOs: OrganisationRequestDTO[]) => {

    const daughterOrg: Organisation = Organisation.from(daughterDTO.org_name)

    daughterOrgs.push(daughterOrg)
    orgs.push(daughterOrg)

    daughterOrg.addParentRelations(parentOrg)

    for (let index = 0; index < daughterIndex; index++) {
      daughterOrg.addSisterRelations(daughterOrgs[index])
    }

    if (daughterDTO.daughters) {
      orgs.push(...fromDaughtersOrganisationRequestDTO(daughterOrg, daughterDTO.daughters))
    }
  })

  return orgs
}

