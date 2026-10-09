import surveyData from './generatedSurveyData.json'

export const overview = surveyData.overview

export const surveyInfo = {
  districts: 30,
  segments: 1200,
  largeScaleFarmers: 505,
  dataCollectionStart: surveyData.survey.collectionStart,
  dataCollectionEnd: surveyData.survey.collectionEnd,
  period: surveyData.survey.period,
  source: surveyData.survey.source,
  season: surveyData.survey.season,
}

export const farmingPractices = surveyData.farmingPractices

export const topCrops = surveyData.topCrops
