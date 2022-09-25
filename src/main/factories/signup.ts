import { BcryptAdapater } from '../../infra/cryptography/bcrypt-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { SignUpController } from '../../presentation/controllers/sign-up/sign-up'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { EmailValidatorAdapter } from '../../utils/email-validator/email-validator-adapter'

export const makeSignUpController = () => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapater(salt)
  const emailValidatorAdapter = new EmailValidatorAdapter()

  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

  return new SignUpController(dbAddAccount, emailValidatorAdapter)
}
