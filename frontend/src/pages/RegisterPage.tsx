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
      // Auto-login after register
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
    <div className="min-h-screen bg-gradient-to-br from-lavender-100 via-cream-100 to-mint-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lavender-300 to-mint-300 flex items-center justify-center shadow-cozy-md mx-auto mb-4">
            <span className="text-3xl">🌸</span>
          </div>
          <h1 className="text-3xl font-extrabold text-warm-900">Join BookReel</h1>
          <p className="text-warm-500 mt-1 font-medium">Start your reading journey today 🌿</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-warm-700 mb-2">Username</label>
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
              <label className="block text-sm font-semibold text-warm-700 mb-2">Email</label>
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
              <label className="block text-sm font-semibold text-warm-700 mb-2">Password</label>
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
            </div>

            {error && (
              <div className="bg-blush-100 border border-blush-300 text-warm-700 text-sm font-medium px-4 py-3 rounded-2xl animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="w-5 h-5 rounded-full border-2 border-lavender-400/30 border-t-lavender-400 animate-spin" />
              ) : ''}
              {isLoading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-warm-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-lavender-400 font-bold hover:text-lavender-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
