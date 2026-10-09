import { surveyInfo } from '../data/nationalStats'

function Footer() {
  return (
    <footer className="bg-farm-dark text-white py-6 text-center mt-20">
      <p className="px-4 text-sm">
        Data source: {surveyInfo.source}, {surveyInfo.season} · Fieldwork: {surveyInfo.dataCollectionStart} – {surveyInfo.dataCollectionEnd}
      </p>
    </footer>
  )
}

export default Footer
