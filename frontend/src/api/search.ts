import api from './axios'
import type { Reel } from '../types'

export async function searchReels(q: string, skip = 0, limit = 20): Promise<Reel[]> {
  const res = await api.get('/search/', { params: { q, skip, limit } })
  return res.data
}
