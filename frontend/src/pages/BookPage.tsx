import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBook } from '../api/books'
import { getBookReels } from '../api/reels'
import ReelCard from '../components/ReelCard'
import Spinner from '../components/Spinner'
import type { Book, Reel } from '../types'

const COVER_GRADIENTS = [
  'from-peach-200 to-lavender-200',
  'from-lavender-200 to-mint-200',
  'from-mint-200 to-blush-200',
  'from-blush-200 to-peach-200',
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
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-cream-100">
        <span className="text-5xl">😕</span>
        <p className="text-warm-600 font-semibold">{error || 'Book not found'}</p>
        <Link to="/" className="btn-primary">Back to feed</Link>
      </div>
    )
  }

  const gradient = COVER_GRADIENTS[book.id % COVER_GRADIENTS.length]

  return (
    <div className="min-h-screen bg-cream-100 pb-20 md:pb-8">
      {/* Hero */}
      <div className={`bg-gradient-to-br ${gradient} px-4 pt-6 pb-8`}>
        <Link to="/" className="inline-flex items-center gap-2 text-warm-700 font-semibold text-sm mb-6 hover:text-warm-900 transition-colors">
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
                className="w-24 h-32 object-cover rounded-2xl shadow-cozy-md"
              />
            ) : (
              <div className="w-24 h-32 bg-white/40 rounded-2xl shadow-cozy-md flex items-center justify-center">
                <span className="text-4xl">📖</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-extrabold text-warm-900 leading-tight mb-1">{book.title}</h1>
            <p className="text-warm-700 font-semibold mb-3">{book.author}</p>
            <div className="flex flex-wrap gap-2">
              <span className="genre-tag">{book.genre}</span>
              <span className="tag bg-white/50 text-warm-700">{reels.length} reels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reels list */}
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        <h2 className="text-lg font-extrabold text-warm-900">Key insights</h2>

        {reels.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-5xl mb-3">🌿</div>
            <p className="text-warm-500 font-medium">No reels for this book yet.</p>
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
