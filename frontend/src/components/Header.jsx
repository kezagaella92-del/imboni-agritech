import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Map', to: '/map' },
  { label: 'Districts', to: '/districts' },
  { label: 'Compare', to: '/compare' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClasses = ({ isActive }) => [
    'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-farm-sun focus-visible:ring-offset-2 focus-visible:ring-offset-farm-dark',
    isActive
      ? 'bg-white/15 text-farm-sun'
      : 'text-white/90 hover:bg-white/10 hover:text-farm-sun',
  ].join(' ')

  return (
    <header
      onKeyDown={(event) => {
        if (event.key === 'Escape') setMenuOpen(false)
      }}
      className="relative z-20 bg-farm-dark px-4 py-3 text-white shadow-lg sm:px-6 sm:py-4"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex min-h-11 w-full items-center justify-between sm:w-auto">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="rounded-sm text-xl font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-farm-sun sm:text-2xl"
          >
            Imboni Agri-tech
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-farm-sun sm:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-6 w-6"
            >
              {menuOpen ? (
                <path d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } absolute left-0 right-0 top-full flex-col gap-1 border-t border-white/10 bg-farm-dark p-3 shadow-lg sm:static sm:flex sm:flex-row sm:items-center sm:gap-1 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none`}
        >
          {navigationItems.map(({ label, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              className={linkClasses}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
