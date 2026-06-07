import { useEffect, useState, FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserById, updateMe, deleteMe } from '../api/users'
import { useAuthStore } from '../store/authStore'
import Spinner from '../components/Spinner'
import type { User } from '../types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #C8853A, #D4694A)',
  'linear-gradient(135deg, #7C9E7E, #5F9EA8)',
  'linear-gradient(135deg, #9B7EA0, #6A7EA8)',
  'linear-gradient(135deg, #9E8A6A, #C8853A)',
]

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { user: currentUser, logout, setUser, initialize } = useAuthStore()
  const [profile, setProfile] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editUsername, setEditUsername] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const isOwnProfile = currentUser?.id === Number(userId)

  useEffect(() => {
    if (!userId) return
    setIsLoading(true)
    getUserById(Number(userId))
      .then((u) => {
        setProfile(u)
        setEditUsername(u.username)
        setEditEmail(u.email)
      })
      .catch(() => setProfile(null))
      .finally(() => setIsLoading(false))
  }, [userId])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    setSaveSuccess(false)
    try {
      const payload: { username?: string; email?: string; password?: string } = {}
      if (editUsername !== profile?.username) payload.username = editUsername
      if (editEmail !== profile?.email) payload.email = editEmail
      if (editPassword) payload.password = editPassword
      const updated = await updateMe(payload)
      setProfile(updated)
      setUser(updated)
      setSaveSuccess(true)
      setIsEditing(false)
      setEditPassword('')
      await initialize()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setSaveError(msg ?? 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return
    try {
      await deleteMe()
      logout()
      navigate('/login')
    } catch {
      alert('Failed to delete account.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <span className="text-5xl">😕</span>
        <p className="font-semibold" style={{ color: 'var(--text-muted)' }}>User not found</p>
      </div>
    )
  }

  const avatarGradient = AVATAR_GRADIENTS[profile.id % AVATAR_GRADIENTS.length]
  const initials = profile.username.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen pb-20 md:pb-8 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(200,133,58,0.06)' }} />

      {/* Profile header */}
      <div className="relative px-4 pt-10 pb-12" style={{ borderBottom: '1px solid var(--border-soft)' }}>
        <div className="max-w-lg mx-auto text-center animate-slide-up">
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white"
            style={{
              background: avatarGradient,
              boxShadow: '0 4px 24px rgba(200,133,58,0.25)',
              border: '3px solid var(--border-soft)',
            }}
          >
            {initials}
          </div>
          <h1 className="text-2xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>@{profile.username}</h1>
          <p className="font-medium text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{profile.email}</p>
          <p className="text-xs mt-1 font-medium" style={{ color: 'var(--text-placeholder)' }}>Joined {formatDate(profile.created_at)}</p>

          {isOwnProfile && (
            <button
              onClick={() => setIsEditing((p) => !p)}
              className="mt-5 btn-secondary text-sm py-2"
            >
              {isEditing ? 'Cancel edit' : 'Edit profile'}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5 relative z-10">
        {/* Edit form */}
        {isEditing && isOwnProfile && (
          <div className="card p-6 animate-scale-in">
            <h2 className="text-lg font-serif font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Edit profile</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  New password <span style={{ color: 'var(--text-placeholder)' }} className="font-normal">(leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              {saveError && (
                <div
                  className="text-sm font-medium px-4 py-3 rounded-2xl flex items-center gap-2"
                  style={{
                    backgroundColor: 'rgba(212,105,74,0.08)',
                    border: '1px solid rgba(212,105,74,0.18)',
                    color: 'var(--accent-terra)',
                  }}
                >
                  <span>⚠️</span> {saveError}
                </div>
              )}
              {saveSuccess && (
                <div
                  className="text-sm font-semibold px-4 py-3 rounded-2xl flex items-center gap-2"
                  style={{
                    backgroundColor: 'rgba(124,158,126,0.10)',
                    border: '1px solid rgba(124,158,126,0.20)',
                    color: '#7C9E7E',
                  }}
                >
                  <span>✓</span> Profile updated successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving && (
                  <span
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff' }}
                  />
                )}
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          </div>
        )}

        {/* Stats cards */}
        <div className="card p-5">
          <h2 className="text-base font-serif font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Account info</h2>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-2xl p-4 text-center"
              style={{
                backgroundColor: 'rgba(200,133,58,0.08)',
                border: '1px solid rgba(200,133,58,0.15)',
              }}
            >
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-amber)' }}>#{profile.id}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>Member ID</p>
            </div>
            <div
              className="rounded-2xl p-4 text-center"
              style={{
                backgroundColor: 'var(--bg-pill)',
                border: '1px solid var(--border-soft)',
              }}
            >
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{formatDate(profile.created_at)}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>Joined</p>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        {isOwnProfile && (
          <div
            className="card p-5"
            style={{ borderColor: 'rgba(212,105,74,0.15)' }}
          >
            <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Danger zone</h2>
            <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-placeholder)' }}>This action is permanent and cannot be undone.</p>
            <button
              onClick={handleDeleteAccount}
              className="text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
              style={{
                color: 'var(--accent-terra)',
                border: '1px solid rgba(212,105,74,0.20)',
              }}
            >
              Delete my account
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
