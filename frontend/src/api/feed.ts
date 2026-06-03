import api from './axios'
import type { Reel } from '../types'

export async function getGlobalFeed(skip = 0, limit = 10): Promise<Reel[]> {
  const res = await api.get('/feeds/', { params: { skip, limit } })
  return res.data
}

export async function getGenreFeed(genre: string, skip = 0, limit = 10): Promise<Reel[]> {
  const res = await api.get(`/feeds/genre/${encodeURIComponent(genre)}`, { params: { skip, limit } })
  return res.data
}
