import { useParams, Link } from 'react-router-dom'
import SurveyContext from '../components/SurveyContext'
import { districts, provinceColors } from '../data/districts'

function DistrictDetailPage() {
  const { districtName } = useParams()
  const district = districts.find((d) => d.name === districtName)

  if (!district) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-farm-dark mb-4">District not found</h1>
        <Link to="/districts" className="text-farm-green hover:underline">
          ← Back to all districts
        </Link>
      </main>
    )
  }

  const stats = [
    { label: 'Total land area', value: `${district.totalLand.toFixed(2)}k ha` },
    { label: 'Agricultural land', value: `${district.agriLand.toFixed(2)}k ha` },
    { label: '% agricultural', value: `${district.agriPercent.toFixed(1)}%` },
    { label: 'Seasonal crops', value: `${district.seasonalCrops.toFixed(2)}k ha` },
    { label: 'Permanent crops', value: `${district.permanentCrops.toFixed(2)}k ha` },
    { label: 'Erosion control', value: `${district.erosionControl.toFixed(1)}%` },
    { label: 'Agroforestry', value: `${district.agroforestry.toFixed(1)}%` },
    { label: 'Organic fertilizer', value: `${district.organicFert.toFixed(1)}%` },
    { label: 'Inorganic fertilizer', value: `${district.inorganicFert.toFixed(1)}%` },
    { label: 'Irrigation adoption', value: `${district.irrigation.toFixed(1)}%` },
    { label: 'Agroforestry adoption', value: `${district.agroforestry.toFixed(1)}%` },
    { label: 'Mechanization use', value: `${district.mechanization.toFixed(1)}%` },
  ]

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link to="/districts" className="text-farm-green hover:underline mb-4 inline-block">
        ← Back to all districts
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-farm-dark sm:text-4xl">{district.name}</h1>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${provinceColors[district.province]}`}>
              {district.province} Province
            </span>
          </div>
          <p className="text-gray-600">Agricultural profile · Season B 2026</p>
        </div>
        <Link
          to={`/compare?district=${encodeURIComponent(district.name)}`}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-farm-green px-4 py-2 font-semibold text-farm-dark hover:bg-farm-light focus:outline-none focus:ring-2 focus:ring-farm-green"
        >
          Compare this district
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="min-w-0 rounded-lg border-l-4 border-farm-green bg-white p-5 shadow-md sm:p-6">
            <div className="mb-1 text-2xl font-bold tabular-nums text-farm-green">{s.value}</div>
            <div className="text-sm text-farm-dark font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <SurveyContext className="mt-8" />
    </main>
  )
}

export default DistrictDetailPage
