import { getRepository } from 'typeorm'
import { Organisation } from '../entity/Organisation'
import { Relation } from '../entity/Relation'

const pageSize = 100

export const saveAll = async (organisations: Organisation[]) => {

  const orgRepo = getRepository(Organisation)
  const relationRepo = getRepository(Relation)

  await orgRepo.save(organisations)
  await Promise.all(organisations.map(org => relationRepo.save(org.sourceRelation)))
}

export const getOrganisationRelations = async (orgName: string, page: number) => {
  return getRepository(Relation)
    .createQueryBuilder('relation')
    .leftJoinAndSelect('relation.source', 'source')
    .leftJoinAndSelect('relation.target', 'target')
    .where('target.name = :orgName')
    .orderBy('target.name', 'DESC')
    .skip(page * pageSize)
    .take(pageSize)
    .setParameters({ orgName })
    .getMany()
}