import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Reel, Book } from '../types'

interface Props {
  reel: Reel
  book?: Book
}

const TYPE_STYLES: Record<string, { bg: string; text: string; emoji: string }> = {
  quote:     { bg: 'bg-lavender-100', text: 'text-lavender-400', emoji: '💬' },
  concept:   { bg: 'bg-mint-100',     text: 'text-mint-400',     emoji: '💡' },
  technique: { bg: 'bg-peach-100',    text: 'text-peach-400',    emoji: '🛠️' },
  summary:   { bg: 'bg-blush-100',    text: 'text-blush-300',    emoji: '📝' },
  lesson:    { bg: 'bg-cream-200',    text: 'text-warm-600',     emoji: '🌱' },
}

function getTypeStyle(type: string) {
  return TYPE_STYLES[type.toLowerCase()] ?? TYPE_STYLES.concept
}

const COVER_GRADIENTS = [
  'from-peach-200 to-lavender-200',
  'from-lavender-200 to-mint-200',
  'from-mint-200 to-blush-200',
  'from-blush-200 to-peach-200',
]

export default function ReelCard({ reel, book }: Props) {
  // TODO: wire to POST /reels/{id}/like once backend exposes the endpoint
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const style = getTypeStyle(reel.type)
  const gradient = COVER_GRADIENTS[reel.id % COVER_GRADIENTS.length]

  const handleLike = () => {
    setIsAnimating(true)
    setLiked((p) => !p)
    setLikeCount((p) => (liked ? p - 1 : p + 1))
    setTimeout(() => setIsAnimating(false), 350)
  }

  return (
    <article className="card w-full max-w-md mx-auto animate-slide-up">
      {/* Book cover strip */}
      {book && (
        <Link to={`/books/${book.id}`} className="block group">
          <div className={`relative h-16 bg-gradient-to-r ${gradient} overflow-hidden flex items-center gap-3 px-4`}>
            {book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="h-12 w-9 object-cover rounded-lg shadow-md shrink-0 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="h-12 w-9 bg-white/30 rounded-lg shadow-md shrink-0 flex items-center justify-center text-xl">
                📖
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-warm-900 text-sm truncate">{book.title}</p>
              <p className="text-warm-700 text-xs truncate">{book.author}</p>
            </div>
            <span className="ml-auto genre-tag shrink-0">{book.genre}</span>
          </div>
        </Link>
      )}

      {/* Reel body */}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className={`tag ${style.bg} ${style.text} shrink-0`}>
            {style.emoji} {reel.type}
          </span>
          <span className="text-xs text-warm-400 font-medium ml-auto">#{reel.order_index + 1}</span>
        </div>

        <p className="text-warm-800 text-base leading-relaxed font-medium">{reel.content}</p>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 flex items-center justify-between border-t border-cream-200 pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 ${
            liked ? 'text-red-400' : 'text-warm-400 hover:text-red-400'
          }`}
        >
          <span
            className={`text-xl leading-none transition-transform duration-200 ${
              isAnimating ? 'animate-bounce-heart' : ''
            }`}
          >
            {liked ? '❤️' : '🤍'}
          </span>
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>

        {book && (
          <Link
            to={`/books/${book.id}`}
            className="text-xs text-warm-400 hover:text-peach-400 font-semibold transition-colors"
          >
            All reels →
          </Link>
        )}
      </div>
    </article>
  )
}
