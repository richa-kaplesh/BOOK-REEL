import { useEffect, useState, FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserById, updateMe, deleteMe } from '../api/users'
import { useAuthStore } from '../store/authStore'
import Spinner from '../components/Spinner'
import type { User } from '../types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const AVATAR_COLORS = [
  'from-peach-200 to-peach-300',
  'from-lavender-200 to-lavender-300',
  'from-mint-200 to-mint-300',
  'from-blush-200 to-blush-300',
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
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-cream-100">
        <span className="text-5xl">😕</span>
        <p className="text-warm-600 font-semibold">User not found</p>
      </div>
    )
  }

  const avatarGradient = AVATAR_COLORS[profile.id % AVATAR_COLORS.length]
  const initials = profile.username.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-cream-100 pb-20 md:pb-8">
      {/* Profile header */}
      <div className="bg-gradient-to-br from-lavender-100 to-mint-100 px-4 pt-8 pb-10">
        <div className="max-w-lg mx-auto text-center animate-slide-up">
          {/* Avatar */}
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center shadow-cozy-md mx-auto mb-4 text-3xl font-extrabold text-warm-900`}>
            {initials}
          </div>
          <h1 className="text-2xl font-extrabold text-warm-900">@{profile.username}</h1>
          <p className="text-warm-500 font-medium text-sm mt-1">{profile.email}</p>
          <p className="text-warm-400 text-xs mt-1 font-medium">Joined {formatDate(profile.created_at)}</p>

          {isOwnProfile && (
            <button
              onClick={() => setIsEditing((p) => !p)}
              className="mt-4 btn-secondary text-sm py-2"
            >
              {isEditing ? 'Cancel edit' : 'Edit profile'}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        {/* Edit form */}
        {isEditing && isOwnProfile && (
          <div className="card p-6 mb-6 animate-scale-in">
            <h2 className="text-lg font-bold text-warm-900 mb-4">Edit profile</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-warm-700 mb-1.5">Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-warm-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-warm-700 mb-1.5">
                  New password <span className="text-warm-400 font-normal">(leave blank to keep current)</span>
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
                <div className="bg-blush-100 border border-blush-300 text-warm-700 text-sm font-medium px-4 py-3 rounded-2xl">
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div className="bg-mint-100 border border-mint-300 text-mint-400 text-sm font-semibold px-4 py-3 rounded-2xl">
                  Profile updated!
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving && <span className="w-4 h-4 rounded-full border-2 border-warm-900/30 border-t-warm-900 animate-spin" />}
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          </div>
        )}

        {/* Stats card */}
        <div className="card p-5 mb-6">
          <h2 className="text-base font-bold text-warm-900 mb-4">Account info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-peach-100 rounded-2xl p-4 text-center">
              <p className="text-2xl font-extrabold text-warm-900">#{profile.id}</p>
              <p className="text-xs font-semibold text-warm-500 mt-1">Member ID</p>
            </div>
            <div className="bg-lavender-100 rounded-2xl p-4 text-center">
              <p className="text-sm font-extrabold text-warm-900">{formatDate(profile.created_at)}</p>
              <p className="text-xs font-semibold text-warm-500 mt-1">Joined</p>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        {isOwnProfile && (
          <div className="card p-5 border border-blush-200">
            <h2 className="text-base font-bold text-warm-700 mb-1">Danger zone</h2>
            <p className="text-sm text-warm-400 font-medium mb-4">This action is permanent and cannot be undone.</p>
            <button
              onClick={handleDeleteAccount}
              className="text-sm font-semibold text-red-400 hover:text-red-500 border border-red-200 hover:border-red-300 px-4 py-2 rounded-xl transition-all duration-200"
            >
              Delete my account
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
