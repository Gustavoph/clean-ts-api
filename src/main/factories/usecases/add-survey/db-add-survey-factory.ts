import { AddSurvey } from '../../../../domain/usecases'
import { DbAddSurvey } from '../../../../data/usecases/add-survey/db-add-survey'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/survey-mongo-respository'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  const dbAddSurvey = new DbAddSurvey(surveyMongoRepository)
  return dbAddSurvey
}
