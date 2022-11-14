import env from '../../../config/env'
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { BcryptAdapater } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { Authentication } from '../../../../domain/usecases'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const hashCompare = new BcryptAdapater(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const dBAuthentication = new DbAuthentication(jwtAdapter, hashCompare, accountMongoRepository, accountMongoRepository)
  return dBAuthentication
}
