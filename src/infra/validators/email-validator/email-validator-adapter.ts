import validator from 'validator'
import { EmailValidator } from '../../../presentation/protocols'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string) {
    return validator.isEmail(email)
  }
}
