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
    <div className="min-h-screen bg-cream-100 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-mint-100 to-peach-100 px-4 pt-8 pb-10">
        <div className="max-w-lg mx-auto text-center animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mint-300 to-peach-300 flex items-center justify-center shadow-cozy-md mx-auto mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-3xl font-extrabold text-warm-900">Add a Book</h1>
          <p className="text-warm-600 font-medium mt-2">
            Enter a title and we'll auto-generate reels for you
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-8">
        {/* Form */}
        <div className="card p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-warm-700 mb-2">Book title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field text-base"
                placeholder="e.g. Atomic Habits"
                disabled={isLoading}
                autoFocus
              />
              <p className="text-xs text-warm-400 font-medium mt-1.5">
                We'll look it up and generate key insights automatically
              </p>
            </div>

            {error && (
              <div className="bg-blush-100 border border-blush-300 text-warm-700 text-sm font-medium px-4 py-3 rounded-2xl animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-60 py-3 text-base"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-warm-900/30 border-t-warm-900 animate-spin" />
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

        {/* Loading state with animation */}
        {isLoading && (
          <div className="card p-8 text-center animate-fade-in">
            <div className="text-5xl mb-4 animate-bounce">📚</div>
            <h3 className="text-lg font-bold text-warm-800 mb-2">Generating your reels…</h3>
            <p className="text-warm-400 text-sm font-medium">
              We're extracting key insights from this book. This may take up to 30 seconds.
            </p>
            <div className="flex justify-center gap-1 mt-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-peach-300 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Success */}
        {done && reels.length > 0 && (
          <div className="animate-slide-up space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-warm-900">
                🎉 {reels.length} reels created!
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
                  <span className="type-tag">
                    {reel.type}
                  </span>
                  <span className="text-xs text-warm-400 font-medium ml-auto">#{reel.order_index + 1}</span>
                </div>
                <p className="text-warm-800 text-sm leading-relaxed font-medium">{reel.content}</p>
              </div>
            ))}

            {reels.length > 3 && (
              <p className="text-center text-warm-400 text-sm font-medium">
                +{reels.length - 3} more reels in the feed
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setTitle(''); setDone(false); setReels([]) }}
                className="btn-ghost flex-1 text-center"
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
