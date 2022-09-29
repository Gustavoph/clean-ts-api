import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidation = () => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return new Error()
    }
  }

  return new ValidationStub()
}

const makeSut = () => {
  return new ValidationComposite([makeValidation()])
}

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })
})
