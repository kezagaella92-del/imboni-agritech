import { useEffect, useMemo, useState } from 'react'
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import { Link, useNavigate } from 'react-router-dom'
import { districts } from '../data/districts'
import { surveyInfo } from '../data/nationalStats'

const METRICS = {
  agriPercent: { label: 'Agricultural land', unit: '%', digits: 1, basis: 'of district land area' },
  erosionControl: { label: 'Erosion protection', unit: '%', digits: 1, basis: 'of surveyed farmers' },
  organicFert: { label: 'Organic fertilizer use', unit: '%', digits: 1, basis: 'of surveyed farmers' },
  inorganicFert: { label: 'Inorganic fertilizer use', unit: '%', digits: 1, basis: 'of surveyed farmers' },
  agroforestry: { label: 'Agroforestry adoption', unit: '%', digits: 1, basis: 'of surveyed farmers' },
  irrigation: { label: 'Irrigation adoption', unit: '%', digits: 1, basis: 'of surveyed farmers' },
  mechanization: { label: 'Mechanization use', unit: '%', digits: 1, basis: 'of surveyed farmers' },
}

const MAP_COLORS = ['#eff6e8', '#cde6b2', '#99cb73', '#5ca44e', '#236b39']

function MapPage() {
  const [geoData, setGeoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [metric, setMetric] = useState('agriPercent')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const navigate = useNavigate()
  const metricInfo = METRICS[metric]

  const districtsByName = useMemo(
    () => new Map(districts.map((district) => [district.name.toLowerCase(), district])),
    [],
  )
  const sortedValues = useMemo(
    () => districts.map((district) => district[metric]).sort((a, b) => a - b),
    [metric],
  )
  const thresholds = useMemo(
    () => [0.2, 0.4, 0.6, 0.8].map((fraction) => {
      const index = Math.min(sortedValues.length - 1, Math.ceil(fraction * sortedValues.length) - 1)
      return sortedValues[index]
    }),
    [sortedValues],
  )
  const legend = useMemo(
    () => MAP_COLORS.map((color, index) => {
      const label = index === 0
        ? `≤ ${thresholds[0].toFixed(0)}`
        : index === MAP_COLORS.length - 1
          ? `> ${thresholds[thresholds.length - 1].toFixed(0)}`
          : `${thresholds[index - 1].toFixed(0)}–${thresholds[index].toFixed(0)}`
      return { color, label }
    }),
    [thresholds],
  )

  useEffect(() => {
    const controller = new AbortController()
    const loadMapData = async () => {
      try {
        const response = await fetch('/rwanda-districts.geojson', { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Map boundaries could not be loaded (HTTP ${response.status}).`)
        }
        const data = await response.json()
        if (!Array.isArray(data.features) || data.features.length === 0) {
          throw new Error('The district boundary file is empty or invalid.')
        }
        setGeoData(data)
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Map boundaries could not be loaded.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    loadMapData()
    return () => controller.abort()
  }, [loadAttempt])

  const findDistrict = (name) =>
    districtsByName.get(String(name).toLowerCase())

  const styleFeature = (feature) => {
    const district = findDistrict(feature.properties.shapeName)
    const value = district?.[metric]
    const bucketIndex = value === undefined
      ? -1
      : thresholds.findIndex((threshold) => value <= threshold)
    const colorIndex = bucketIndex === -1 ? MAP_COLORS.length - 1 : bucketIndex
    return {
      fillColor: bucketIndex === -1 && value === undefined ? '#9ca3af' : MAP_COLORS[colorIndex],
      weight: 1.5,
      opacity: 1,
      color: '#ffffff',
      fillOpacity: 0.78,
    }
  }

  const onEachFeature = (feature, layer) => {
    const district = findDistrict(feature.properties.shapeName)
    const title = district?.name || feature.properties.shapeName
    const detail = district
      ? `${district.province} Province · ${metricInfo.label}: ${district[metric].toFixed(metricInfo.digits)}${metricInfo.unit} ${metricInfo.basis}`
      : 'Survey data is not available for this boundary.'
    layer.bindTooltip(
      `<strong>${title}</strong><br/><span>${detail}</span>`,
      { sticky: true },
    )
    layer.on({
      mouseover: (event) => {
        event.target.setStyle({ weight: 3, color: '#14532d', fillOpacity: 0.95 })
        event.target.bringToFront()
      },
      mouseout: (event) => event.target.setStyle(styleFeature(feature)),
      click: () => {
        if (district) navigate(`/districts/${encodeURIComponent(district.name)}`)
      },
    })
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-farm-green">Explore Rwanda</p>
          <h1 className="text-3xl font-bold text-farm-dark sm:text-4xl">Agriculture map</h1>
          <p className="mt-2 text-gray-600">Choose an indicator, then select a district to open its profile.</p>
        </div>
        <Link
          to="/compare"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-farm-green px-4 py-2 font-semibold text-farm-dark transition hover:bg-farm-light focus:outline-none focus:ring-2 focus:ring-farm-green"
        >
          Compare districts
        </Link>
      </div>

      <section className="mb-4 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <label htmlFor="map-metric" className="mb-1 block text-sm font-semibold text-farm-dark">District indicator</label>
          <select
            id="map-metric"
            value={metric}
            onChange={(event) => setMetric(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-farm-green sm:w-72"
          >
            {Object.entries(METRICS).map(([key, item]) => (
              <option key={key} value={key}>{item.label}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-500">
          Darker districts indicate higher {metricInfo.label.toLowerCase()}.
        </p>
      </section>

      <div className="relative h-[55vh] min-h-[360px] max-h-[680px] overflow-hidden rounded-xl bg-white shadow-lg sm:min-h-[460px]">
        {geoData && (
          <MapContainer
            center={[-1.94, 29.87]}
            zoom={8}
            minZoom={7}
            maxZoom={12}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON key={metric} data={geoData} style={styleFeature} onEachFeature={onEachFeature} />
          </MapContainer>
        )}
        {loading && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/90 px-6 text-center text-gray-600">
            Loading district boundaries…
          </div>
        )}
        {error && (
          <div role="alert" className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/95 p-6">
            <div className="max-w-md text-center">
              <h2 className="text-lg font-bold text-farm-dark">Map unavailable</h2>
              <p className="mt-2 text-sm text-gray-600">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true)
                  setError('')
                  setGeoData(null)
                  setLoadAttempt((attempt) => attempt + 1)
                }}
                className="mt-4 min-h-11 rounded-lg bg-farm-green px-5 py-2 font-semibold text-white hover:bg-farm-dark focus:outline-none focus:ring-2 focus:ring-farm-green focus:ring-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2" aria-label={`${metricInfo.label} legend`}>
          {legend.map((item, index) => (
            <span key={`${item.color}-${index}`} className="inline-flex items-center gap-1.5 text-xs text-gray-600">
              <span className="h-3.5 w-3.5 rounded-sm border border-black/10" style={{ backgroundColor: item.color }} />
              {item.label}{metricInfo.unit}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
            <span className="h-3.5 w-3.5 rounded-sm bg-gray-400" /> No data
          </span>
        </div>
        <p className="text-xs leading-relaxed text-gray-500">
          {surveyInfo.source} · {surveyInfo.season} · {metricInfo.basis}
        </p>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        District boundaries: geoBoundaries · Survey period: {surveyInfo.period}. Map tiles require an internet connection.
      </p>
    </main>
  )
}

export default MapPage
