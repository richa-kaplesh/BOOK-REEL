import { useEffect, useState, useCallback, useRef } from 'react'
import { getGlobalFeed, getGenreFeed } from '../api/feed'
import { getBook } from '../api/books'
import ReelCard from '../components/ReelCard'
import Spinner from '../components/Spinner'
import type { Reel, Book } from '../types'

const GENRES = ['Fiction', 'Non-Fiction', 'Self-Help', 'Business', 'Psychology', 'Science', 'History', 'Philosophy']

export default function FeedPage() {
  const [reels, setReels] = useState<Reel[]>([])
  const [books, setBooks] = useState<Record<number, Book>>({})
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [skip, setSkip] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)
  const LIMIT = 10

  const fetchReels = useCallback(async (reset = false) => {
    if (isLoading) return
    setIsLoading(true)
    const currentSkip = reset ? 0 : skip
    try {
      const data = selectedGenre
        ? await getGenreFeed(selectedGenre, currentSkip, LIMIT)
        : await getGlobalFeed(currentSkip, LIMIT)

      if (data.length < LIMIT) setHasMore(false)

      const newReels = reset ? data : [...reels, ...data]
      setReels(newReels)
      setSkip(currentSkip + data.length)

      // Fetch books for any new book_ids we don't have yet
      const newBookIds = [...new Set(data.map((r) => r.book_id))].filter((id) => !books[id])
      const bookEntries = await Promise.all(
        newBookIds.map(async (id) => {
          try { return [id, await getBook(id)] as [number, Book] }
          catch { return null }
        })
      )
      const newBooks: Record<number, Book> = {}
      bookEntries.forEach((entry) => { if (entry) newBooks[entry[0]] = entry[1] })
      setBooks((prev) => ({ ...prev, ...newBooks }))
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre, skip, isLoading])

  // Reset on genre change
  useEffect(() => {
    setReels([])
    setSkip(0)
    setHasMore(true)
    setIsLoading(false)
  }, [selectedGenre])

  // Initial load + genre change trigger
  useEffect(() => {
    fetchReels(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre])

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchReels(false)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [fetchReels, hasMore, isLoading])

  return (
    <div className="min-h-screen pb-20 md:pb-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div
        className="sticky top-14 z-30 px-4 py-4"
        style={{
          backgroundColor: 'var(--bg-primary)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-soft)',
        }}
      >
        <h1 className="text-xl font-serif font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          <span style={{ color: 'var(--accent-amber)' }}>Your</span> Feed
        </h1>

        {/* Genre filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setSelectedGenre(null)}
            className="shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200"
            style={{
              backgroundColor: selectedGenre === null ? 'rgba(200,133,58,0.12)' : 'var(--bg-pill)',
              color: selectedGenre === null ? 'var(--accent-amber)' : 'var(--text-muted)',
              border: selectedGenre === null ? '1px solid rgba(200,133,58,0.30)' : '1px solid var(--border-soft)',
              boxShadow: selectedGenre === null ? '0 0 12px rgba(200,133,58,0.15)' : 'none',
            }}
          >
            All
          </button>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className="shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200"
              style={{
                backgroundColor: selectedGenre === g ? 'rgba(200,133,58,0.12)' : 'var(--bg-pill)',
                color: selectedGenre === g ? 'var(--accent-amber)' : 'var(--text-muted)',
                border: selectedGenre === g ? '1px solid rgba(200,133,58,0.30)' : '1px solid var(--border-soft)',
                boxShadow: selectedGenre === g ? '0 0 12px rgba(200,133,58,0.15)' : 'none',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Reels feed */}
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} book={books[reel.book_id]} />
        ))}

        {/* Skeleton loading */}
        {isLoading && reels.length === 0 && (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="h-16 skeleton mb-4 rounded-2xl" />
              <div className="space-y-3">
                <div className="h-3 skeleton rounded-full w-1/4" />
                <div className="h-4 skeleton rounded-full w-3/4" />
                <div className="h-4 skeleton rounded-full w-full" />
                <div className="h-4 skeleton rounded-full w-5/6" />
              </div>
            </div>
          ))
        )}

        {/* Load more trigger */}
        <div ref={loaderRef} className="flex justify-center py-4">
          {isLoading && reels.length > 0 && <Spinner />}
        </div>

        {/* Empty state */}
        {!isLoading && reels.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4 animate-float inline-block">📖</div>
            <h3 className="text-xl font-serif font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No reels yet</h3>
            <p className="font-medium" style={{ color: 'var(--text-muted)' }}>
              {selectedGenre ? `No ${selectedGenre} reels found.` : 'Add a book to get started!'}
            </p>
          </div>
        )}

        {!hasMore && reels.length > 0 && (
          <div className="text-center py-6">
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2"
              style={{
                backgroundColor: 'var(--bg-pill)',
                border: '1px solid var(--border-soft)',
              }}
            >
              <span className="text-sm" style={{ color: 'var(--accent-amber)' }}>✦</span>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>You're all caught up</p>
              <span className="text-sm" style={{ color: 'var(--accent-amber)' }}>✦</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
