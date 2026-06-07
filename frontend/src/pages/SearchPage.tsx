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
    <div className="min-h-screen bg-void-950 pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-14 z-30 bg-void-950/90 backdrop-blur-xl px-4 py-4 border-b border-white/5">
        <h1 className="text-xl font-extrabold text-white mb-3">
          <span className="gradient-text">Search</span>
        </h1>
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by book title or author…"
            className="input-field pl-11 pr-10"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10"
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
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 text-4xl">
              🔎
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-slate-500 font-medium mb-1">No reels match "<span className="text-slate-300">{query}</span>"</p>
            <p className="text-slate-600 text-sm">Try a different title or author name</p>
          </div>
        )}

        {!isLoading && !searched && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 animate-float">
              <span className="text-5xl">📖</span>
            </div>
            <p className="text-white font-semibold text-lg mb-1">Search for a book or author</p>
            <p className="text-slate-500 text-sm">Find reels from your favourite reads</p>
          </div>
        )}

        {!isLoading && reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} book={books[reel.book_id]} />
        ))}
      </div>
    </div>
  )
}
