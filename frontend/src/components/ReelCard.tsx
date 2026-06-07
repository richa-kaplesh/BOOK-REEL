import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Reel, Book } from '../types'

interface Props {
  reel: Reel
  book?: Book
}

/* Genre → warm gradient for card header strip */
const GENRE_GRADIENTS: Record<string, string> = {
  fiction:      'linear-gradient(135deg, #C8853A22 0%, #D4694A15 100%)',
  'non-fiction':'linear-gradient(135deg, #7A8EA022 0%, #5F8EAA15 100%)',
  'self-help':  'linear-gradient(135deg, #7C9E7E22 0%, #5A8A5E15 100%)',
  business:     'linear-gradient(135deg, #9E8A6A22 0%, #7A6A4A15 100%)',
  psychology:   'linear-gradient(135deg, #9B7EA022 0%, #7A5A8A15 100%)',
  science:      'linear-gradient(135deg, #5F9EA822 0%, #3A7A8A15 100%)',
  history:      'linear-gradient(135deg, #A8966A22 0%, #8A7A4A15 100%)',
  philosophy:   'linear-gradient(135deg, #6A7EA822 0%, #4A5A8A15 100%)',
}

function getGenreGradient(genre: string) {
  return GENRE_GRADIENTS[genre.toLowerCase()] ?? GENRE_GRADIENTS.fiction
}

const TYPE_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  quote:     { label: 'Quote',     emoji: '❝', color: '#C8853A' },
  concept:   { label: 'Concept',   emoji: '💡', color: '#D4694A' },
  technique: { label: 'Technique', emoji: '✦',  color: '#7C9E7E' },
  summary:   { label: 'Summary',   emoji: '📖', color: '#9B7EA0' },
  lesson:    { label: 'Lesson',    emoji: '🌿', color: '#5F9EA8' },
}

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type.toLowerCase()] ?? TYPE_CONFIG.concept
}

export default function ReelCard({ reel, book }: Props) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const config = getTypeConfig(reel.type)
  const genreGradient = book ? getGenreGradient(book.genre) : GENRE_GRADIENTS.fiction

  const handleLike = () => {
    setIsAnimating(true)
    setLiked((p) => !p)
    setLikeCount((p) => (liked ? p - 1 : p + 1))
    setTimeout(() => setIsAnimating(false), 350)
  }

  return (
    <article className="w-full max-w-md mx-auto animate-slide-up">
      <div className="card" style={{ overflow: 'hidden' }}>

        {/* Genre gradient header strip */}
        <div style={{ background: genreGradient, borderBottom: '1px solid var(--border-soft)' }}>
          {book ? (
            <Link to={`/books/${book.id}`} className="block group">
              <div className="flex items-center gap-3 px-4 py-3">
                {book.cover_image_url ? (
                  <img
                    src={book.cover_image_url}
                    alt={book.title}
                    className="h-12 w-9 object-cover rounded-xl shadow-warm-sm shrink-0 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className="h-12 w-9 rounded-xl shadow-warm-sm shrink-0 flex items-center justify-center text-lg"
                    style={{ backgroundColor: 'var(--bg-pill)', border: '1px solid var(--border-soft)' }}
                  >
                    📖
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-serif font-semibold text-sm leading-snug line-clamp-1 group-hover:opacity-80 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                    {book.title}
                  </p>
                  <p className="text-xs font-medium mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                    {book.author}
                  </p>
                </div>
                <span className="genre-tag shrink-0 text-xs">{book.genre}</span>
              </div>
            </Link>
          ) : (
            <div className="h-2" />
          )}
        </div>

        {/* Reel body */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="tag text-xs font-semibold"
              style={{
                backgroundColor: `${config.color}15`,
                color: config.color,
                border: `1px solid ${config.color}25`,
              }}
            >
              {config.emoji} {reel.type}
            </span>
            <span className="text-xs font-medium ml-auto" style={{ color: 'var(--text-placeholder)' }}>
              #{reel.order_index + 1}
            </span>
          </div>

          {/* Content — serif for quote type, sans for others */}
          <p
            className={`text-base leading-relaxed ${reel.type === 'quote' ? 'font-serif italic text-lg' : 'font-medium'}`}
            style={{ color: 'var(--text-primary)' }}
          >
            {reel.type === 'quote' && (
              <span style={{ color: 'var(--accent-amber)', fontSize: '1.5em', lineHeight: '1', marginRight: '4px', fontFamily: 'Georgia, serif' }}>"</span>
            )}
            {reel.content}
            {reel.type === 'quote' && (
              <span style={{ color: 'var(--accent-amber)', fontSize: '1.5em', lineHeight: '1', marginLeft: '2px', fontFamily: 'Georgia, serif' }}>"</span>
            )}
          </p>
        </div>

        {/* Footer */}
        <div
          className="px-5 pb-4 pt-3 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border-soft)' }}
        >
          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-sm font-semibold transition-all duration-200"
            style={{ color: liked ? '#D4694A' : 'var(--text-muted)' }}
          >
            <span
              className={`text-lg leading-none transition-transform duration-200 ${isAnimating ? 'animate-bounce-heart' : ''}`}
            >
              {liked ? '♥' : '♡'}
            </span>
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>

          {book && (
            <Link
              to={`/books/${book.id}`}
              className="text-xs font-semibold transition-colors duration-200 hover:opacity-70"
              style={{ color: 'var(--accent-amber)' }}
            >
              All reels →
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
