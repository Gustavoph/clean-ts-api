import { SignUpController } from './sign-up'
import { ok, serverError, badRequest } from '../../helpers'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { EmailValidator, AccountModel, AddAccount, Validation, AddAccountModel, HttpRequest } from './sign-up-protocols'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  emailValidatorStub: EmailValidator
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid@mail.com',
  password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(addAccountStub, validationStub, emailValidatorStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  it('should return 400 if no passwordConfirmation is fails', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  it('should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    await sut.handle(makeFakeRequest())

    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => { throw new Error() })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any@mail.com',
      password: 'any_password'
    })
  })

  it('should return 500 with AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any@mail.com',
      password: 'any_password'
    })
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validate = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validate).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
