import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, loginUser } from '../api/auth'
import { useAuthStore } from '../store/authStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setToken, initialize } = useAuthStore()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await registerUser(username, email, password)
      const data = await loginUser(email, password)
      setToken(data.access_token)
      await initialize()
      navigate('/')
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(detail ?? 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Background glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(200,133,58,0.08)' }} />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(212,105,74,0.05)' }} />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-float"
            style={{
              background: 'linear-gradient(135deg, #C8853A, #D4694A)',
              boxShadow: '0 4px 24px rgba(200,133,58,0.35)',
            }}
          >
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-3xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Join BookReel</h1>
          <p className="mt-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>Start your reading journey today</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="bookworm42"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--text-placeholder)' }}>Minimum 6 characters</p>
            </div>

            {error && (
              <div
                className="text-sm font-medium px-4 py-3 rounded-2xl animate-fade-in flex items-center gap-2"
                style={{
                  backgroundColor: 'rgba(212,105,74,0.08)',
                  border: '1px solid rgba(212,105,74,0.18)',
                  color: 'var(--accent-terra)',
                }}
              >
                <span>⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 py-3"
            >
              {isLoading ? (
                <span
                  className="w-5 h-5 rounded-full border-2 animate-spin"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff' }}
                />
              ) : ''}
              {isLoading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid var(--border-soft)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold transition-colors hover:opacity-80"
                style={{ color: 'var(--accent-amber)' }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
