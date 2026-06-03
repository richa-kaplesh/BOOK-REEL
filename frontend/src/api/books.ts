import api from './axios'
import type { Book, Reel } from '../types'

export async function getAllBooks(skip = 0, limit = 20): Promise<Book[]> {
  const res = await api.get('/books/', { params: { skip, limit } })
  return res.data
}

export async function getBook(bookId: number | string): Promise<Book> {
  const res = await api.get(`/books/${bookId}`)
  return res.data
}

export async function searchBooks(q: string): Promise<Book[]> {
  const res = await api.get('/books/search', { params: { q } })
  return res.data
}

// Creates a book from title + auto-generates reels, returns the reels list
export async function addBookFromTitle(title: string): Promise<Reel[]> {
  const res = await api.post('/books/from-title', null, { params: { title } })
  return res.data
}

export async function deleteBook(bookId: number | string): Promise<void> {
  await api.delete(`/books/${bookId}`)
}
