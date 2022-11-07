import bcrypt from 'bcrypt'
import { BcryptAdapater } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapater => {
  return new BcryptAdapater(salt)
}

describe('Bcrypt Adapter', () => {
  it('should call hash with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('valid_password')
    expect(hashSpy).toHaveBeenCalledWith('valid_password', salt)
  })

  it('should return a valid hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('valid_password')
    expect(hash).toBe('hash')
  })

  it('should throws if hash throw', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => { throw new Error() })
    const promise = sut.hash('valid_password')
    await expect(promise).rejects.toThrow()
  })

  it('should call compare with correct value', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  it('should return true when compare succeeds', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })

  it('should return false when compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.resolve(false))
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })

  it('should throws if compare throw', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare')
      .mockImplementationOnce(() => { throw new Error() })
    const promise = sut.compare('any_value', 'any_hash')
    await expect(promise).rejects.toThrow()
  })
})
