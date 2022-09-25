import bcrypt from 'bcrypt'
import { BcryptAdapater } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  }

}))

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BcryptAdapater(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('valid_password')
    expect(hashSpy).toHaveBeenCalledWith('valid_password', salt)
  })

  it('should return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapater(salt)
    const hash = await sut.encrypt('valid_password')
    expect(hash).toBe('hash')
  })
})
