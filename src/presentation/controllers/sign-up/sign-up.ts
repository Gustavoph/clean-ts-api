import { badRequest, ok, serverError } from '../../helpers'
import { InvalidParamError } from '../../errors'
import { AddAccount, Controller, EmailValidator, Validation, HttpRequest, HttpResponse } from './sign-up-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name, email, password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
