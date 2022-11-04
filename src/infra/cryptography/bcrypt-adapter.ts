import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols'

export class BcryptAdapater implements Encrypter {
  constructor (private readonly salt: number) {}

  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
