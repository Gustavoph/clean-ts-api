import { LogControllerDecorator } from '../decorators/log'
import { BcryptAdapater } from '../../infra/cryptography/bcrypt-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/sign-up/sign-up'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { EmailValidatorAdapter } from '../../utils/email-validator/email-validator-adapter'

export const makeSignUpController = () => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapater(salt)
  const emailValidatorAdapter = new EmailValidatorAdapter()

  const logMongoRepository = new LogMongoRepository()
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(dbAddAccount, emailValidatorAdapter)
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
