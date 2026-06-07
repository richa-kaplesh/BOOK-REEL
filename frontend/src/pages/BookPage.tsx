import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBook } from '../api/books'
import { getBookReels } from '../api/reels'
import ReelCard from '../components/ReelCard'
import Spinner from '../components/Spinner'
import type { Book, Reel } from '../types'

const COVER_GRADIENTS = [
  'linear-gradient(135deg, #C8853A, #D4694A)',
  'linear-gradient(135deg, #7C9E7E, #5F9EA8)',
  'linear-gradient(135deg, #9B7EA0, #6A7EA8)',
  'linear-gradient(135deg, #9E8A6A, #C8853A)',
]

export default function BookPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const [book, setBook] = useState<Book | null>(null)
  const [reels, setReels] = useState<Reel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!bookId) return
    setIsLoading(true)
    Promise.all([getBook(bookId), getBookReels(bookId)])
      .then(([b, r]) => {
        setBook(b)
        setReels(r)
      })
      .catch(() => setError('Could not load this book.'))
      .finally(() => setIsLoading(false))
  }, [bookId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <span className="text-5xl">😕</span>
        <p className="font-semibold" style={{ color: 'var(--text-muted)' }}>{error || 'Book not found'}</p>
        <Link to="/" className="btn-primary">Back to feed</Link>
      </div>
    )
  }

  const gradient = COVER_GRADIENTS[book.id % COVER_GRADIENTS.length]

  return (
    <div className="min-h-screen pb-20 md:pb-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div className="px-4 pt-6 pb-8" style={{ background: `${gradient}20` }}>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-semibold text-sm mb-6 transition-colors hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="max-w-lg mx-auto flex gap-5 items-start animate-slide-up">
          {/* Cover */}
          <div className="shrink-0">
            {book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-24 h-32 object-cover rounded-2xl"
                style={{ boxShadow: 'var(--shadow-card)' }}
              />
            ) : (
              <div
                className="w-24 h-32 rounded-2xl flex items-center justify-center"
                style={{
                  background: gradient,
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <span className="text-4xl">📖</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-serif font-bold leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>
              {book.title}
            </h1>
            <p className="font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>{book.author}</p>
            <div className="flex flex-wrap gap-2">
              <span className="genre-tag">{book.genre}</span>
              <span
                className="tag"
                style={{
                  backgroundColor: 'var(--bg-pill)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                {reels.length} reels
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reels list */}
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        <h2 className="text-lg font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Key insights</h2>

        {reels.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-5xl mb-3">🌿</div>
            <p className="font-medium" style={{ color: 'var(--text-muted)' }}>No reels for this book yet.</p>
          </div>
        ) : (
          reels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} book={book} />
          ))
        )}
      </div>
    </div>
  )
}
