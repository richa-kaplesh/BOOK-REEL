import { Link } from 'react-router-dom'
import type { Book } from '../types'

interface Props {
  book: Book
  reelCount?: number
}

const COVER_GRADIENTS = [
  'linear-gradient(135deg, #C8853A 0%, #D4694A 100%)',
  'linear-gradient(135deg, #7C9E7E 0%, #5F9EA8 100%)',
  'linear-gradient(135deg, #9B7EA0 0%, #6A7EA8 100%)',
  'linear-gradient(135deg, #9E8A6A 0%, #C8853A 100%)',
]

function getCoverGradient(id: number) {
  return COVER_GRADIENTS[id % COVER_GRADIENTS.length]
}

export default function BookCard({ book, reelCount }: Props) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="card-hover block animate-scale-in group"
    >
      {/* Cover */}
      <div className="relative overflow-hidden">
        {book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-44 flex items-center justify-center group-hover:scale-105 transition-transform duration-500"
            style={{ background: getCoverGradient(book.id) }}
          >
            <span className="text-5xl select-none opacity-70">📖</span>
          </div>
        )}
        {/* Warm overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3
          className="font-serif font-semibold text-sm leading-snug line-clamp-2 mb-1 transition-colors duration-200"
          style={{ color: 'var(--text-primary)' }}
        >
          {book.title}
        </h3>
        <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
          {book.author}
        </p>
        <div className="flex items-center justify-between">
          <span className="genre-tag">{book.genre}</span>
          {reelCount !== undefined && (
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {reelCount} reels
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
