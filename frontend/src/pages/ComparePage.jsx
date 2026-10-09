import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SurveyContext from '../components/SurveyContext'
import { districts, provinces } from '../data/districts'

const INDICATORS = [
  { key: 'agriPercent', label: 'Agricultural land', unit: '%', digits: 1 },
  { key: 'totalLand', label: 'Total land area', unit: 'k ha', digits: 2 },
  { key: 'agriLand', label: 'Agricultural land area', unit: 'k ha', digits: 2 },
  { key: 'seasonalCrops', label: 'Seasonal crops', unit: 'k ha', digits: 2 },
  { key: 'permanentCrops', label: 'Permanent crops', unit: 'k ha', digits: 2 },
  { key: 'erosionControl', label: 'Erosion protection', unit: '%', digits: 1 },
  { key: 'organicFert', label: 'Organic fertilizer use', unit: '%', digits: 1 },
  { key: 'inorganicFert', label: 'Inorganic fertilizer use', unit: '%', digits: 1 },
  { key: 'agroforestry', label: 'Agroforestry adoption', unit: '%', digits: 1 },
  { key: 'irrigation', label: 'Irrigation adoption', unit: '%', digits: 1 },
  { key: 'mechanization', label: 'Mechanization use', unit: '%', digits: 1 },
]

const MAX_DISTRICTS = 4

function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [provinceFilter, setProvinceFilter] = useState('All')
  const selectedNames = searchParams.getAll('district')
    .filter((name, index, values) => values.indexOf(name) === index)
    .filter((name) => districts.some((district) => district.name === name))
    .slice(0, MAX_DISTRICTS)
  const selectedDistricts = useMemo(
    () => selectedNames.map((name) => districts.find((district) => district.name === name)),
    [selectedNames],
  )
  const availableDistricts = districts.filter(
    (district) => provinceFilter === 'All' || district.province === provinceFilter,
  )

  const toggleDistrict = (name) => {
    const nextNames = selectedNames.includes(name)
      ? selectedNames.filter((selected) => selected !== name)
      : selectedNames.length < MAX_DISTRICTS
        ? [...selectedNames, name]
        : selectedNames
    setSearchParams(nextNames.map((selected) => ['district', selected]))
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-farm-green">District insights</p>
          <h1 className="text-3xl font-bold text-farm-dark sm:text-4xl">Compare districts</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Select 2–{MAX_DISTRICTS} districts to compare land use and reported farming practices.
          </p>
        </div>
        <Link to="/districts" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-farm-green px-4 py-2 font-semibold text-farm-dark hover:bg-farm-light focus:outline-none focus:ring-2 focus:ring-farm-green">
          Browse districts
        </Link>
      </div>

      <section className="mb-8 rounded-xl bg-white p-4 shadow-sm sm:p-6" aria-labelledby="district-picker-heading">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="district-picker-heading" className="text-lg font-bold text-farm-dark">Choose districts</h2>
            <p className="mt-1 text-sm text-gray-600">{selectedNames.length} of {MAX_DISTRICTS} selected</p>
          </div>
          <label className="text-sm font-medium text-gray-700">
            Filter by province
            <select
              value={provinceFilter}
              onChange={(event) => setProvinceFilter(event.target.value)}
              className="mt-1 block min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-farm-green sm:w-56"
            >
              <option value="All">All provinces</option>
              {provinces.map((province) => <option key={province} value={province}>{province}</option>)}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {availableDistricts.map((district) => {
            const checked = selectedNames.includes(district.name)
            const disabled = !checked && selectedNames.length >= MAX_DISTRICTS
            return (
              <label
                key={district.name}
                className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  checked ? 'border-farm-green bg-green-50 text-farm-dark' : 'border-gray-200 hover:border-green-300'
                } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleDistrict(district.name)}
                  className="h-4 w-4 accent-green-700 focus:ring-farm-green"
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{district.name}</span>
                  <span className="block truncate text-xs text-gray-500">{district.province}</span>
                </span>
              </label>
            )
          })}
        </div>
        {selectedDistricts.length > 0 && (
          <button
            type="button"
            onClick={() => setSearchParams([])}
            className="mt-4 min-h-10 text-sm font-semibold text-farm-green underline decoration-transparent underline-offset-2 hover:decoration-current focus:outline-none focus:ring-2 focus:ring-farm-green"
          >
            Clear selection
          </button>
        )}
      </section>

      {selectedDistricts.length >= 2 ? (
        <section aria-labelledby="comparison-heading">
          <h2 id="comparison-heading" className="mb-4 text-xl font-bold text-farm-dark">Side-by-side results</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {INDICATORS.map((indicator) => {
              const maxValue = Math.max(...selectedDistricts.map((district) => district[indicator.key]))
              return (
                <article key={indicator.key} className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                  <h3 className="mb-4 font-bold text-farm-dark">{indicator.label}</h3>
                  <div className="space-y-4">
                    {selectedDistricts.map((district) => {
                      const value = district[indicator.key]
                      const width = maxValue === 0 ? 0 : (value / maxValue) * 100
                      return (
                        <div key={district.name}>
                          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                            <Link to={`/districts/${encodeURIComponent(district.name)}`} className="truncate font-medium text-farm-dark hover:text-farm-green hover:underline">
                              {district.name}
                            </Link>
                            <span className="shrink-0 font-semibold tabular-nums text-gray-800">
                              {value.toFixed(indicator.digits)} {indicator.unit}
                            </span>
                          </div>
                          <div
                            className="h-2.5 overflow-hidden rounded-full bg-gray-100"
                            role="img"
                            aria-label={`${district.name}: ${value.toFixed(indicator.digits)} ${indicator.unit}`}
                          >
                            <div
                              className="h-full rounded-full bg-farm-green transition-[width] duration-300"
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </article>
              )
            })}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-gray-600">
            Bar lengths are scaled within each indicator to the highest selected value. Percentages show reported farmer
            adoption (except agricultural land, which is a share of district land area); denominators can differ by indicator.
          </p>
        </section>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
          <h2 className="text-lg font-bold text-farm-dark">Select at least two districts</h2>
          <p className="mt-2 text-sm text-gray-600">Choose districts above to see their indicators compared here.</p>
        </div>
      )}

      <SurveyContext className="mt-8" />
    </main>
  )
}

export default ComparePage
