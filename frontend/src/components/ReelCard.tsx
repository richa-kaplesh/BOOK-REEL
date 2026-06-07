import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Reel, Book } from '../types'

interface Props {
  reel: Reel
  book?: Book
}

const TYPE_CONFIG: Record<string, { bg: string; text: string; border: string; emoji: string }> = {
  quote:     { bg: 'bg-indigo-500/15',  text: 'text-indigo-300',  border: 'border-indigo-500/25',  emoji: '💬' },
  concept:   { bg: 'bg-amber-500/15',   text: 'text-amber-300',   border: 'border-amber-500/25',   emoji: '💡' },
  technique: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/25', emoji: '🛠️' },
  summary:   { bg: 'bg-rose-500/15',    text: 'text-rose-300',    border: 'border-rose-500/25',    emoji: '📝' },
  lesson:    { bg: 'bg-slate-500/15',   text: 'text-slate-300',   border: 'border-slate-500/25',   emoji: '🌱' },
}

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type.toLowerCase()] ?? TYPE_CONFIG.concept
}

const COVER_GRADIENTS = [
  'from-indigo-900 via-void-800 to-void-700',
  'from-violet-900 via-void-800 to-void-700',
  'from-slate-800 via-void-800 to-void-700',
  'from-blue-900 via-void-800 to-void-700',
]

export default function ReelCard({ reel, book }: Props) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const config = getTypeConfig(reel.type)
  const gradient = COVER_GRADIENTS[reel.id % COVER_GRADIENTS.length]

  const handleLike = () => {
    setIsAnimating(true)
    setLiked((p) => !p)
    setLikeCount((p) => (liked ? p - 1 : p + 1))
    setTimeout(() => setIsAnimating(false), 350)
  }

  return (
    <article className="w-full max-w-md mx-auto animate-slide-up group">
      <div className="card border-white/8 hover:border-indigo-500/20 hover:shadow-glass-lg transition-all duration-300">
        {/* Book cover strip */}
        {book && (
          <Link to={`/books/${book.id}`} className="block">
            <div className={`relative h-16 bg-gradient-to-r ${gradient} overflow-hidden flex items-center gap-3 px-4 border-b border-white/5`}>
              {/* Subtle indigo glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none" />

              {book.cover_image_url ? (
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="h-12 w-9 object-cover rounded-lg shadow-glass shrink-0 group-hover:scale-105 transition-transform duration-300 z-10"
                />
              ) : (
                <div className="h-12 w-9 bg-white/10 rounded-lg shadow-glass shrink-0 flex items-center justify-center text-xl z-10 border border-white/10">
                  📖
                </div>
              )}
              <div className="min-w-0 z-10">
                <p className="font-bold text-white text-sm truncate">{book.title}</p>
                <p className="text-slate-400 text-xs truncate">{book.author}</p>
              </div>
              <span className="ml-auto genre-tag shrink-0 z-10">{book.genre}</span>
            </div>
          </Link>
        )}

        {/* Reel body */}
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <span className={`tag ${config.bg} ${config.text} border ${config.border} shrink-0`}>
              {config.emoji} {reel.type}
            </span>
            <span className="text-xs text-slate-600 font-medium ml-auto">#{reel.order_index + 1}</span>
          </div>

          <p className="text-slate-200 text-base leading-relaxed font-medium">
            {reel.content}
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 flex items-center justify-between border-t border-white/5 pt-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 ${
              liked
                ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                : 'text-slate-500 hover:text-rose-400'
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
              className="text-xs text-slate-500 hover:text-indigo-400 font-semibold transition-colors duration-200"
            >
              All reels →
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
