import api from './axios'
import type { Reel } from '../types'

export async function getReelsByBook(bookId: number | string, skip = 0, limit = 50): Promise<Reel[]> {
  const res = await api.get(`/reels/book/${bookId}`, { params: { skip, limit } })
  return res.data
}

export async function getBookReels(bookId: number | string): Promise<Reel[]> {
  const res = await api.get(`/reels/book/${bookId}`, { params: { skip: 0, limit: 100 } })
  const reels: Reel[] = res.data
  return reels.sort((a, b) => a.order_index - b.order_index)
}
