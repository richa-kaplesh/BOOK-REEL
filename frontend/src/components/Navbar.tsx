import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const isActive = (path: string) => location.pathname === path

  const navLink = (to: string, icon: React.ReactNode, label: string) => (
    <Link
      to={to}
      className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 text-xs font-semibold ${
        isActive(to)
          ? 'bg-peach-200 text-warm-900'
          : 'text-warm-500 hover:text-warm-800 hover:bg-cream-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-cream-100/90 backdrop-blur-sm border-b border-cream-200 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-peach-300 to-lavender-300 flex items-center justify-center shadow-cozy group-hover:shadow-cozy-md transition-all">
            <BookIcon />
          </div>
          <span className="font-extrabold text-lg text-warm-900 tracking-tight">BookReel</span>
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="btn-ghost text-sm"
            >
              Sign out
            </button>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2">Sign in</Link>
          )}
        </div>
      </header>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cream-100/95 backdrop-blur-sm border-t border-cream-200 flex items-center justify-around px-2 py-2 md:hidden">
        {navLink('/', <HomeIcon />, 'Feed')}
        {navLink('/search', <SearchIcon />, 'Search')}
        {user && navLink('/add-book', <PlusIcon />, 'Add')}
        {user
          ? navLink(`/profile/${user.id}`, <UserIcon />, 'Profile')
          : navLink('/login', <UserIcon />, 'Sign in')
        }
      </nav>

      {/* Side nav (desktop) */}
      <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-56 flex-col gap-1 px-3 py-4 bg-cream-100 border-r border-cream-200 z-40">
        <SideLink to="/" icon={<HomeIcon />} label="Feed" active={isActive('/')} />
        <SideLink to="/search" icon={<SearchIcon />} label="Search" active={isActive('/search')} />
        {user && <SideLink to="/add-book" icon={<PlusIcon />} label="Add Book" active={isActive('/add-book')} />}
        {user
          ? <SideLink to={`/profile/${user.id}`} icon={<UserIcon />} label="Profile" active={location.pathname.startsWith('/profile')} />
          : <SideLink to="/login" icon={<UserIcon />} label="Sign in" active={isActive('/login')} />
        }
      </aside>
    </>
  )
}

function SideLink({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
        active ? 'bg-peach-200 text-warm-900' : 'text-warm-500 hover:text-warm-800 hover:bg-cream-200'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}
