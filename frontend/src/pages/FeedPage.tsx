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
    <div className="min-h-screen bg-cream-100 pb-20 md:pb-4">
      {/* Header */}
      <div className="sticky top-14 z-30 bg-cream-100/95 backdrop-blur-sm px-4 py-3 border-b border-cream-200">
        <h1 className="text-xl font-extrabold text-warm-900 mb-3">📚 Your Feed</h1>

        {/* Genre tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
              selectedGenre === null
                ? 'bg-peach-300 text-warm-900 shadow-cozy'
                : 'bg-cream-200 text-warm-500 hover:bg-peach-100'
            }`}
          >
            All
          </button>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
                selectedGenre === g
                  ? 'bg-peach-300 text-warm-900 shadow-cozy'
                  : 'bg-cream-200 text-warm-500 hover:bg-peach-100'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Reels feed */}
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} book={books[reel.book_id]} />
        ))}

        {/* Skeleton loading */}
        {isLoading && reels.length === 0 && (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-16 bg-cream-200 rounded-2xl mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-cream-200 rounded-full w-3/4" />
                <div className="h-4 bg-cream-200 rounded-full w-full" />
                <div className="h-4 bg-cream-200 rounded-full w-5/6" />
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
            <div className="text-6xl mb-4">🌿</div>
            <h3 className="text-xl font-bold text-warm-700 mb-2">No reels yet</h3>
            <p className="text-warm-400 font-medium">
              {selectedGenre ? `No ${selectedGenre} reels found.` : 'Add a book to get started!'}
            </p>
          </div>
        )}

        {!hasMore && reels.length > 0 && (
          <p className="text-center text-warm-400 text-sm font-medium py-4">
            You've caught up! 🎉
          </p>
        )}
      </div>
    </div>
  )
}
