import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-farm-dark px-4 py-4 text-white shadow-lg sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="w-fit text-xl font-bold focus:outline-none focus:ring-2 focus:ring-farm-sun sm:text-2xl">Imboni Agri-tech</Link>
        <nav aria-label="Main navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link to="/" className="rounded-sm hover:text-farm-sun focus:outline-none focus:ring-2 focus:ring-farm-sun">Home</Link>
          <Link to="/dashboard" className="rounded-sm hover:text-farm-sun focus:outline-none focus:ring-2 focus:ring-farm-sun">Dashboard</Link>
          <Link to="/map" className="rounded-sm hover:text-farm-sun focus:outline-none focus:ring-2 focus:ring-farm-sun">Map</Link>
          <Link to="/districts" className="rounded-sm hover:text-farm-sun focus:outline-none focus:ring-2 focus:ring-farm-sun">Districts</Link>
          <Link to="/compare" className="rounded-sm hover:text-farm-sun focus:outline-none focus:ring-2 focus:ring-farm-sun">Compare</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
