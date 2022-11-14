import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyModel } from '../../../../domain/usecases'
import { AddSurveyRepository } from '../../../../data/protocols'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const result = await surveyCollection.insertOne(surveyData)
    const survey = await surveyCollection.findOne({ _id: result.insertedId })
    return MongoHelper.map(survey)
  }
}
