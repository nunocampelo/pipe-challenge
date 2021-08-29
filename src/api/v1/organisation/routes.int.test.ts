import { Express } from 'express'
import request from 'supertest'
import { getConnection } from 'typeorm'
import serverStart from '../../../server'
import { OrganisationRequestDTO } from './dto/OrganisationRequestDTO'
import { RelationDTO } from './dto/RelationDTO'

describe('/api/v1/organisation integration tests', () => {

  let app: Express
  const parentOrgRelations: RelationDTO[] = [
    {
      org_name: 'child_org_1',
      relationship_type: 'daughter'
    }
  ]

  beforeAll(async () => {
    app = await serverStart
  })

  afterEach(async () => {
    const entities = getConnection().entityMetadatas

    for (const entity of entities) {
      const repository = getConnection().getRepository(entity.name)
      await repository.clear()
    }
  })

  afterAll(() => {
    getConnection().close()
  })

  test('no-daughters organization relations', async () => {

    const requestBody: OrganisationRequestDTO = {
      org_name: 'parent'
    }

    const response = await request(app).get('/api/v1/organisation?name=parent').expect(200)
    expect(response.body).toEqual([])
  })

  test('parent relations', async () => {

    const requestBody: OrganisationRequestDTO = {
      org_name: 'parent',
      daughters: [{
        org_name: 'child'
      }]
    }

    await request(app).post('/api/v1/organisation')
      .send(requestBody).expect(201)

    const parentRelations = await request(app).get('/api/v1/organisation?name=parent').expect(200)

    expect(parentRelations.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ org_name: 'child', relationship_type: 'daughter' })
      ])
    )

    const childRelations = await request(app).get('/api/v1/organisation?name=child').expect(200)

    expect(childRelations.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ org_name: 'parent', relationship_type: 'parent' })
      ])
    )
  })

  test('parent and sister relations', async () => {

    const requestBody: OrganisationRequestDTO = {
      org_name: 'parent',
      daughters: [{
        org_name: 'child_1'
      }, {
        org_name: 'child_2'
      }]
    }

    await request(app).post('/api/v1/organisation')
      .send(requestBody).expect(201)

    const parentRelations = await request(app).get('/api/v1/organisation?name=parent').expect(200)

    expect(parentRelations.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ org_name: 'child_1', relationship_type: 'daughter' }),
        expect.objectContaining({ org_name: 'child_2', relationship_type: 'daughter' })
      ])
    )

    const firstChildRelations = await request(app).get('/api/v1/organisation?name=child_1').expect(200)

    expect(firstChildRelations.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ org_name: 'parent', relationship_type: 'parent' }),
        expect.objectContaining({ org_name: 'child_2', relationship_type: 'sister' })
      ])
    )

    const secondChildRelations = await request(app).get('/api/v1/organisation?name=child_2').expect(200)

    expect(secondChildRelations.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ org_name: 'parent', relationship_type: 'parent' }),
        expect.objectContaining({ org_name: 'child_1', relationship_type: 'sister' })
      ])
    )
  })

  test('multiple level organisation relations', async () => {

    const requestBody: OrganisationRequestDTO = {
      org_name: 'parent',
      daughters: [{
        org_name: 'child_1',
        daughters: [{
          org_name: 'child_2',
        },
        {
          org_name: 'child_3'
        }]
      }, {
        org_name: 'child_4'
      }]
    }

    await request(app).post('/api/v1/organisation')
      .send(requestBody).expect(201)

    const parentRelations = await request(app).get('/api/v1/organisation?name=parent').expect(200)

    expect(parentRelations.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ org_name: 'child_1', relationship_type: 'daughter' }),
        expect.objectContaining({ org_name: 'child_4', relationship_type: 'daughter' })
      ])
    )

    const childRelations = await request(app).get('/api/v1/organisation?name=child_1').expect(200)

    expect(childRelations.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ org_name: 'parent', relationship_type: 'parent' }),
        expect.objectContaining({ org_name: 'child_2', relationship_type: 'daughter' }),
        expect.objectContaining({ org_name: 'child_3', relationship_type: 'daughter' }),
        expect.objectContaining({ org_name: 'child_4', relationship_type: 'sister' })
      ])
    )
  })

  test('request with same organisation name should fail', async () => {

    const requestBody: OrganisationRequestDTO = {
      org_name: 'org',
      daughters: [{
        org_name: 'org'
      }]
    }

    await request(app).post('/api/v1/organisation')
      .send(requestBody).expect(400)
  })
})
