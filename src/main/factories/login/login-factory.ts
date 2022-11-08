import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { makeLoginValidation } from './login-validation-factory'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapater } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../config/env'

export const makeLoginController = (): Controller => {
  const salt = 12
  const hashCompare = new BcryptAdapater(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const dBAuthentication = new DbAuthentication(jwtAdapter, hashCompare, accountMongoRepository, accountMongoRepository)
  const loginController = new LoginController(makeLoginValidation(), dBAuthentication)
  const logMongoRepository = new LogMongoRepository()
  const controller = new LogControllerDecorator(loginController, logMongoRepository)
  return controller
}
