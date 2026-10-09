import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const DistrictsPage = lazy(() => import('./pages/DistrictsPage'))
const DistrictDetailPage = lazy(() => import('./pages/DistrictDetailPage'))
const ComparePage = lazy(() => import('./pages/ComparePage'))

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-farm-light flex flex-col">
        <Header />
        <div className="flex-1">
          <Suspense fallback={<div className="mx-auto flex min-h-[40vh] max-w-6xl items-center justify-center px-4 text-gray-600" role="status">Loading page…</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/districts" element={<DistrictsPage />} />
              <Route path="/districts/:districtName" element={<DistrictDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
