import { useState, useEffect, useRef } from 'react'
import { searchReels } from '../api/search'
import { getBook } from '../api/books'
import ReelCard from '../components/ReelCard'
import Spinner from '../components/Spinner'
import type { Reel, Book } from '../types'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [reels, setReels] = useState<Reel[]>([])
  const [books, setBooks] = useState<Record<number, Book>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runSearch = async (q: string) => {
    if (!q.trim()) {
      setReels([])
      setSearched(false)
      return
    }
    setIsLoading(true)
    setSearched(true)
    try {
      const results = await searchReels(q)
      setReels(results)

      const newBookIds = [...new Set(results.map((r) => r.book_id))].filter((id) => !books[id])
      const entries = await Promise.all(
        newBookIds.map(async (id) => {
          try { return [id, await getBook(id)] as [number, Book] }
          catch { return null }
        })
      )
      const newBooks: Record<number, Book> = {}
      entries.forEach((e) => { if (e) newBooks[e[0]] = e[1] })
      setBooks((prev) => ({ ...prev, ...newBooks }))
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runSearch(query), 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <div className="min-h-screen bg-cream-100 pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-14 z-30 bg-cream-100/95 backdrop-blur-sm px-4 py-4 border-b border-cream-200">
        <h1 className="text-xl font-extrabold text-warm-900 mb-3">🔍 Search</h1>
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by book title or author…"
            className="input-field pl-11"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-700 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}

        {!isLoading && searched && reels.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-5xl mb-4">🔎</div>
            <h3 className="text-xl font-bold text-warm-700 mb-2">No results</h3>
            <p className="text-warm-400 font-medium">Try a different title or author name</p>
          </div>
        )}

        {!isLoading && !searched && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-warm-500 font-medium text-lg">Search for a book or author</p>
            <p className="text-warm-400 text-sm mt-1">Find reels from your favorite reads</p>
          </div>
        )}

        {!isLoading && reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} book={books[reel.book_id]} />
        ))}
      </div>
    </div>
  )
}
