import api from './axios'
import type { User } from '../types'

export async function getUserById(userId: number): Promise<User> {
  const res = await api.get(`/users/${userId}`)
  return res.data
}

export async function updateMe(payload: { username?: string; email?: string; password?: string }): Promise<User> {
  const res = await api.put('/users/me', payload)
  return res.data
}

export async function deleteMe(): Promise<void> {
  await api.delete('/users/me')
}
