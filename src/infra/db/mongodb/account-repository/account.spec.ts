import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  it('Should return an accoun on success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any@mail.com',
      password: 'hashed_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any@mail.com')
    expect(account.password).toBe('hashed_password')
  })
})
