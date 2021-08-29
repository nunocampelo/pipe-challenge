
export type OrganisationRequestDTO = {
  org_name: string
  daughters?: OrganisationRequestDTO[]
}