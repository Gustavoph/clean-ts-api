import {
  Encrypter,
  AddAccount,
  AccountModel,
  AddAccountModel,
  AddAccountRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly AddAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    await this.AddAccountRepository.add(
      Object.assign({}, account, { password: hashedPassword })
    )

    return null
  }
}
