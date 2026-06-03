import { Link } from 'react-router-dom'
import type { Book } from '../types'

interface Props {
  book: Book
  reelCount?: number
}

const COVER_COLORS = [
  'from-peach-200 to-peach-300',
  'from-lavender-200 to-lavender-300',
  'from-mint-200 to-mint-300',
  'from-blush-200 to-blush-300',
]

function getCoverColor(id: number) {
  return COVER_COLORS[id % COVER_COLORS.length]
}

export default function BookCard({ book, reelCount }: Props) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="card group hover:shadow-cozy-md transition-all duration-300 animate-scale-in block"
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
          <div className={`w-full h-44 bg-gradient-to-br ${getCoverColor(book.id)} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
            <span className="text-5xl select-none">📖</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-warm-900 text-sm leading-snug line-clamp-2 mb-1">{book.title}</h3>
        <p className="text-warm-500 text-xs font-medium mb-2">{book.author}</p>
        <div className="flex items-center justify-between">
          <span className="genre-tag">{book.genre}</span>
          {reelCount !== undefined && (
            <span className="text-xs text-warm-400 font-medium">{reelCount} reels</span>
          )}
        </div>
      </div>
    </Link>
  )
}
