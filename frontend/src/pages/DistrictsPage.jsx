import { useState } from 'react'
import { Link } from 'react-router-dom'
import SurveyContext from '../components/SurveyContext'
import { districts, provinces, provinceColors } from '../data/districts'

function DistrictsPage() {
  const [search, setSearch] = useState('')
  const [provinceFilter, setProvinceFilter] = useState('All')
  const [selectedForCompare, setSelectedForCompare] = useState([])
  const [showSelected, setShowSelected] = useState(false)

  const filtered = districts.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchesProvince = provinceFilter === 'All' || d.province === provinceFilter
    const matchesCompare = !showSelected || selectedForCompare.includes(d.name)
    return matchesSearch && matchesProvince && matchesCompare
  })

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-farm-dark sm:text-4xl">🌾 Districts</h1>
          <p className="text-gray-600">Explore agricultural data for all 30 districts of Rwanda</p>
        </div>
        <Link
          to={`/compare${selectedForCompare.length ? `?${selectedForCompare.map((name) => `district=${encodeURIComponent(name)}`).join('&')}` : ''}`}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-farm-green px-4 py-2 font-semibold text-farm-dark transition hover:bg-farm-light focus:outline-none focus:ring-2 focus:ring-farm-green"
        >
          Compare districts{selectedForCompare.length > 0 ? ` (${selectedForCompare.length})` : ''}
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          aria-label="Search districts"
          placeholder="Search districts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-farm-green"
        />
        <select
          aria-label="Filter by province"
          value={provinceFilter}
          onChange={(e) => setProvinceFilter(e.target.value)}
          className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-farm-green sm:w-56"
        >
          <option value="All">All Provinces</option>
          {provinces.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500">Showing {filtered.length} of {districts.length} districts</p>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <input
            id="compare-filter"
            type="checkbox"
            checked={showSelected}
            onChange={(event) => setShowSelected(event.target.checked)}
            disabled={selectedForCompare.length === 0}
            className="h-4 w-4 accent-green-700"
          />
          <label htmlFor="compare-filter">Show selected districts only</label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {filtered.map((district) => (
          <article key={district.name} className="flex flex-col rounded-lg border-t-4 border-farm-green bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:p-6">
            <Link
              to={`/districts/${encodeURIComponent(district.name)}`}
              className="group rounded-sm focus:outline-none focus:ring-2 focus:ring-farm-green"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <h2 className="text-xl font-bold text-farm-dark group-hover:text-farm-green">{district.name}</h2>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${provinceColors[district.province]}`}>
                  {district.province}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-2"><span className="text-gray-500">Total land:</span><span className="font-semibold tabular-nums">{district.totalLand.toFixed(1)}k ha</span></div>
                <div className="flex justify-between gap-2"><span className="text-gray-500">Agricultural land:</span><span className="font-semibold tabular-nums text-farm-green">{district.agriPercent.toFixed(1)}%</span></div>
                <div className="flex justify-between gap-2"><span className="text-gray-500">Organic fertilizer:</span><span className="font-semibold tabular-nums">{district.organicFert.toFixed(1)}%</span></div>
              </div>
              <span className="mt-4 inline-block text-sm font-semibold text-farm-green">View profile →</span>
            </Link>
            <label className="mt-4 flex min-h-11 items-center gap-2 border-t border-gray-100 pt-3 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={selectedForCompare.includes(district.name)}
                onChange={() => setSelectedForCompare((current) => {
                  if (current.includes(district.name)) return current.filter((name) => name !== district.name)
                  return current.length < 4 ? [...current, district.name] : current
                })}
                disabled={!selectedForCompare.includes(district.name) && selectedForCompare.length >= 4}
                className="h-4 w-4 accent-green-700"
              />
              Add to comparison
            </label>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-gray-500">
          <p className="mb-2 text-xl">No districts found</p>
          <p className="text-sm">Try a different search term, province, or comparison selection.</p>
        </div>
      )}
      <SurveyContext className="mt-8" />
    </main>
  )
}

export default DistrictsPage
