import bcrypt from 'bcrypt'
import { BcryptAdapater } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapater => {
  return new BcryptAdapater(salt)
}

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('valid_password')
    expect(hashSpy).toHaveBeenCalledWith('valid_password', salt)
  })

  it('should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('valid_password')
    expect(hash).toBe('hash')
  })

  it('should throws if Bcrypt throw', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => { throw new Error() })
    const promise = sut.hash('valid_password')
    await expect(promise).rejects.toThrow()
  })
})
