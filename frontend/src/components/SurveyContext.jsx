import { surveyInfo } from '../data/nationalStats'

function SurveyContext({ className = '' }) {
  return (
    <aside className={`rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-gray-700 ${className}`}>
      <p className="font-semibold text-farm-dark">
        {surveyInfo.source} · {surveyInfo.season}
      </p>
      <p className="mt-1">
        Survey period: {surveyInfo.period}. Fieldwork: {surveyInfo.dataCollectionStart} – {surveyInfo.dataCollectionEnd}.
      </p>
      <p className="mt-1 text-xs leading-relaxed text-gray-600">
        Land areas are shown in thousand hectares (k ha). Practice figures are the reported percentage of farmers.
        Crop-area totals use hectares (ha). Figures describe the survey period, not a live forecast.
      </p>
    </aside>
  )
}

export default SurveyContext
