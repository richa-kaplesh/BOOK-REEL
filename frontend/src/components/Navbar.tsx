import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTheme } from '../hooks/useTheme'

/* ── SVG Icons ── */
const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4v16m8-8H4" />
  </svg>
)
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)
const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)
const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { isDark, toggleTheme } = useTheme()

  const isActive = (path: string) => location.pathname === path

  const navLink = (to: string, icon: React.ReactNode, label: string) => (
    <Link
      to={to}
      className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 text-xs font-semibold"
      style={{
        backgroundColor: isActive(to) ? 'rgba(200,133,58,0.12)' : 'transparent',
        color: isActive(to) ? 'var(--accent-amber)' : 'var(--text-muted)',
      }}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )

  return (
    <>
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 border-b px-4 py-3 flex items-center justify-between nav-surface"
        style={{ borderColor: 'var(--border-soft)' }}
      >
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
            style={{ backgroundColor: 'var(--accent-amber)', color: '#fff', boxShadow: '0 2px 12px rgba(200,133,58,0.35)' }}
          >
            <BookIcon />
          </div>
          <span className="font-serif font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Book<span style={{ color: 'var(--accent-amber)' }}>Reel</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: 'var(--bg-pill)',
              color: 'var(--accent-amber)',
              border: '1px solid var(--border-soft)',
            }}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {user ? (
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="btn-ghost text-sm"
            >
              Sign out
            </button>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-4">Sign in</Link>
          )}
        </div>
      </header>

      {/* Bottom nav (mobile) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t flex items-center justify-around px-2 py-2 md:hidden nav-surface"
        style={{ borderColor: 'var(--border-soft)' }}
      >
        {navLink('/', <HomeIcon />, 'Feed')}
        {navLink('/search', <SearchIcon />, 'Search')}
        {user && navLink('/add-book', <PlusIcon />, 'Add')}
        {user
          ? navLink(`/profile/${user.id}`, <UserIcon />, 'Profile')
          : navLink('/login', <UserIcon />, 'Sign in')
        }
      </nav>

      {/* Side nav (desktop) */}
      <aside
        className="hidden md:flex fixed left-0 top-16 bottom-0 w-56 flex-col gap-0.5 px-3 py-5 border-r nav-surface z-40"
        style={{ borderColor: 'var(--border-soft)' }}
      >
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-placeholder)' }}>
            Menu
          </p>
        </div>

        <SideLink to="/" icon={<HomeIcon />} label="Feed" active={isActive('/')} />
        <SideLink to="/search" icon={<SearchIcon />} label="Search" active={isActive('/search')} />
        {user && <SideLink to="/add-book" icon={<PlusIcon />} label="Add Book" active={isActive('/add-book')} />}
        {user
          ? <SideLink to={`/profile/${user.id}`} icon={<UserIcon />} label="Profile" active={location.pathname.startsWith('/profile')} />
          : <SideLink to="/login" icon={<UserIcon />} label="Sign in" active={isActive('/login')} />
        }

        <div className="mt-auto">
          <div className="divider mb-3" />
          {/* Mini theme toggle in sidebar */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 hover:opacity-80"
            style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-pill)' }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>
    </>
  )
}

function SideLink({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 group"
      style={{
        backgroundColor: active ? 'rgba(200,133,58,0.10)' : 'transparent',
        color: active ? 'var(--accent-amber)' : 'var(--text-muted)',
        borderLeft: active ? '2px solid var(--accent-amber)' : '2px solid transparent',
      }}
    >
      <span className={`transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      {label}
    </Link>
  )
}
