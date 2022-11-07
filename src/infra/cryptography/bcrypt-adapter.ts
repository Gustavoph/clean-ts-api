import bcrypt from 'bcrypt'
import { HashComparer, Hasher } from '../../data/protocols'

export class BcryptAdapater implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)
    return await Promise.resolve(true)
  }
}
