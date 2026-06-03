import axios from 'axios'
import api from './axios'
import type { TokenResponse, User } from '../types'

const BASE = 'http://127.0.0.1:8000'

export async function registerUser(username: string, email: string, password: string): Promise<User> {
  const res = await api.post('/auth/register', { username, email, password })
  return res.data
}

// Login uses OAuth2 form-data: username field = email
export async function loginUser(email: string, password: string): Promise<TokenResponse> {
  const params = new URLSearchParams()
  params.append('username', email)
  params.append('password', password)
  const res = await axios.post<TokenResponse>(`${BASE}/auth/login`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return res.data
}

export async function getMe(): Promise<User> {
  const res = await api.get('/auth/me')
  return res.data
}
