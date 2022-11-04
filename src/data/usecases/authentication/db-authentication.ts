import { HashComparer, LoadAccountByEmailRepository } from '../../protocols'
import { Authentication, AuthenticationModel } from '../add-account/db-add-account-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly hashComparer: HashComparer,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      await this.hashComparer.compare(authentication.password, account.password)
    }
    return null
  }
}
