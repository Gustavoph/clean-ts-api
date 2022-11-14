import { AddSurvey, AddSurveyModel, AddSurveyRepository } from '../add-account/db-add-account-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  async add (data: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(data)
    return null
  }
}
