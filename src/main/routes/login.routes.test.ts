import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection
describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    it('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Gustavo',
          email: 'gusta.coliveira07@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const password = await hash('123456', 12)
      await accountCollection.insertOne({
        name: 'Gustavo',
        email: 'gusta.colivei07@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'gusta.colivei07@gmail.com',
          password: '123456'
        })
        .expect(200)
    })

    it('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'gusta.colivei07@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
