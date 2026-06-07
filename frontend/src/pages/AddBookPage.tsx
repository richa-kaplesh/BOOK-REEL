import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { addBookFromTitle } from '../api/books'
import type { Reel } from '../types'

export default function AddBookPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [reels, setReels] = useState<Reel[]>([])
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setError('')
    setReels([])
    setDone(false)
    setIsLoading(true)
    try {
      const result = await addBookFromTitle(title.trim())
      setReels(result)
      setDone(true)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg ?? 'Failed to add book. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(200,133,58,0.06)' }} />

      {/* Header */}
      <div className="relative px-4 pt-10 pb-10" style={{ borderBottom: '1px solid var(--border-soft)' }}>
        <div className="max-w-lg mx-auto text-center animate-slide-up">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-float"
            style={{
              background: 'linear-gradient(135deg, #C8853A, #D4694A)',
              boxShadow: '0 4px 24px rgba(200,133,58,0.35)',
            }}
          >
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Add a <span style={{ color: 'var(--accent-amber)' }}>Book</span>
          </h1>
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>
            Enter a title — we'll auto-generate key insight reels for you
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-8 relative z-10">
        {/* Form */}
        {!done && (
          <div className="card p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Book title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field text-base"
                  placeholder="e.g. Atomic Habits"
                  disabled={isLoading}
                  autoFocus
                />
                <p className="text-xs font-medium mt-1.5" style={{ color: 'var(--text-placeholder)' }}>
                  We'll look it up and generate key insights automatically
                </p>
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
                  <span>⚠️</span> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !title.trim()}
                className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-60 py-3 text-base"
              >
                {isLoading ? (
                  <>
                    <span
                      className="w-5 h-5 rounded-full border-2 animate-spin"
                      style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff' }}
                    />
                    Generating reels…
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Generate Reels
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="card p-10 text-center animate-fade-in">
            <div className="text-5xl mb-5 animate-bounce inline-block">📚</div>
            <h3 className="text-lg font-serif font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Generating your reels…</h3>
            <p className="text-sm font-medium mb-6" style={{ color: 'var(--text-muted)' }}>
              We're extracting key insights from this book. This may take up to 30 seconds.
            </p>
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full animate-bounce"
                  style={{
                    backgroundColor: 'var(--accent-amber)',
                    boxShadow: '0 0 8px rgba(200,133,58,0.4)',
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Success */}
        {done && reels.length > 0 && (
          <div className="animate-slide-up space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-serif font-bold" style={{ color: 'var(--text-primary)' }}>
                🎉 <span style={{ color: 'var(--accent-amber)' }}>{reels.length} reels created!</span>
              </h2>
              <button
                onClick={() => navigate('/')}
                className="btn-primary text-sm py-2"
              >
                View in feed
              </button>
            </div>

            {/* Preview first few reels */}
            {reels.slice(0, 3).map((reel) => (
              <div key={reel.id} className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="type-tag">{reel.type}</span>
                  <span className="text-xs font-medium ml-auto" style={{ color: 'var(--text-placeholder)' }}>#{reel.order_index + 1}</span>
                </div>
                <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>{reel.content}</p>
              </div>
            ))}

            {reels.length > 3 && (
              <p className="text-center text-sm font-medium" style={{ color: 'var(--text-placeholder)' }}>
                +{reels.length - 3} more reels in the feed
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setTitle(''); setDone(false); setReels([]) }}
                className="btn-ghost flex-1 text-center rounded-2xl"
                style={{ border: '1px solid var(--border-soft)' }}
              >
                Add another
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-primary flex-1"
              >
                Go to feed
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
