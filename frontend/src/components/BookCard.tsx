import { Link } from 'react-router-dom'
import type { Book } from '../types'

interface Props {
  book: Book
  reelCount?: number
}

const COVER_GRADIENTS = [
  'from-indigo-900 to-void-700',
  'from-violet-900 to-void-700',
  'from-blue-900 to-void-700',
  'from-slate-800 to-void-700',
]

function getCoverGradient(id: number) {
  return COVER_GRADIENTS[id % COVER_GRADIENTS.length]
}

export default function BookCard({ book, reelCount }: Props) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="card group hover:border-indigo-500/30 hover:shadow-glass-lg transition-all duration-300 animate-scale-in block"
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
          <div className={`w-full h-44 bg-gradient-to-br ${getCoverGradient(book.id)} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
            <span className="text-5xl select-none opacity-60">📖</span>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Indigo shine */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/10 transition-all duration-300" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 mb-1 group-hover:text-indigo-300 transition-colors duration-200">
          {book.title}
        </h3>
        <p className="text-slate-500 text-xs font-medium mb-3">{book.author}</p>
        <div className="flex items-center justify-between">
          <span className="genre-tag">{book.genre}</span>
          {reelCount !== undefined && (
            <span className="text-xs text-slate-600 font-medium">{reelCount} reels</span>
          )}
        </div>
      </div>
    </Link>
  )
}
