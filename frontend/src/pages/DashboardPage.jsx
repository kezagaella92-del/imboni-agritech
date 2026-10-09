import { overview, surveyInfo, farmingPractices, topCrops } from '../data/nationalStats'
import CropChart from '../components/CropChart'
import PracticesChart from '../components/PracticesChart'
import SurveyContext from '../components/SurveyContext'

function formatNumber(n) {
  return n.toLocaleString('en-US')
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-farm-green">
      <div className="text-3xl font-bold text-farm-green mb-1">{value}</div>
      <div className="text-sm font-semibold text-farm-dark">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  )
}

function PracticeBar({ label, value, ssf, lsf }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="font-semibold text-farm-dark">{label}</span>
        <span className="text-farm-green font-bold">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
        <div
          className="bg-farm-green h-2 rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      {(ssf !== undefined || lsf !== undefined) && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>Small-scale: {ssf}%</span>
          <span>Large-scale: {lsf}%</span>
        </div>
      )}
    </div>
  )
}

function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-farm-dark mb-2">National Dashboard</h1>
        <p className="text-gray-600">
          {surveyInfo.season} · Data collected {surveyInfo.dataCollectionStart} – {surveyInfo.dataCollectionEnd}
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard value={surveyInfo.districts} label="Districts covered" />
        <StatCard value={formatNumber(surveyInfo.segments)} label="Sampled segments" />
        <StatCard value={surveyInfo.largeScaleFarmers} label="Large-scale farmers" />
        <StatCard value="Season B" label="2026 agricultural season" />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-farm-dark mb-4 border-b-2 border-farm-green pb-2 inline-block">Land Use</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          <StatCard
            value={`${(overview.totalLand / 1000000).toFixed(3)}M ha`}
            label="Total land area"
          />
          <StatCard
            value={`${(overview.agriculturalLand / 1000000).toFixed(3)}M ha`}
            label="Agricultural land"
            sub={`${overview.agriculturalPercent}% of total`}
          />
          <StatCard
            value={`${(overview.seasonalCropsLand / 1000000).toFixed(3)}M ha`}
            label="Seasonal crops"
          />
          <StatCard
            value={`${(overview.permanentCropsLand / 1000000).toFixed(3)}M ha`}
            label="Permanent crops"
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-farm-dark mb-4 border-b-2 border-farm-green pb-2 inline-block">Visualizations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <CropChart />
          <PracticesChart />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-farm-dark mb-4 border-b-2 border-farm-green pb-2 inline-block">Farming Practices Detail</h2>
        <div className="bg-white p-6 rounded-lg shadow-md mt-4">
          <PracticeBar label="Organic fertilizer" value={farmingPractices.organicFertilizer.overall} ssf={farmingPractices.organicFertilizer.ssf} lsf={farmingPractices.organicFertilizer.lsf} />
          <PracticeBar label="Inorganic fertilizer" value={farmingPractices.inorganicFertilizer.overall} ssf={farmingPractices.inorganicFertilizer.ssf} lsf={farmingPractices.inorganicFertilizer.lsf} />
          <PracticeBar label="Improved seeds" value={farmingPractices.improvedSeeds.overall} ssf={farmingPractices.improvedSeeds.ssf} lsf={farmingPractices.improvedSeeds.lsf} />
          <PracticeBar label="Pesticides" value={farmingPractices.pesticides.overall} ssf={farmingPractices.pesticides.ssf} lsf={farmingPractices.pesticides.lsf} />
          <PracticeBar label="Agroforestry" value={farmingPractices.agroforestry.overall} />
          <PracticeBar label="Irrigation" value={farmingPractices.irrigation.overall} />
          <PracticeBar label="Mechanization" value={farmingPractices.mechanization.overall} />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-farm-dark mb-4 border-b-2 border-farm-green pb-2 inline-block">Top Crops by Area</h2>
        <div className="mt-4 overflow-x-auto rounded-lg bg-white shadow-md">
          <table className="w-full min-w-[440px]">
            <thead className="bg-farm-dark text-white">
              <tr>
                <th className="text-left p-4">Crop</th>
                <th className="text-right p-4">Area (ha)</th>
              </tr>
            </thead>
            <tbody>
              {topCrops.map((crop) => (
                <tr key={crop.name} className="border-b hover:bg-farm-light">
                  <td className="p-4 font-medium">{crop.name}</td>
                  <td className="p-4 text-right text-farm-green font-bold">
                    {formatNumber(crop.area)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SurveyContext className="mt-8" />
    </main>
  )
}

export default DashboardPage
