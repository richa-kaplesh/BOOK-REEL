import { create } from 'zustand'
import type { User } from '../types'
import { getMe } from '../api/auth'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isInitialized: boolean
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isLoading: false,
  isInitialized: false,

  setToken: (token) => {
    localStorage.setItem('access_token', token)
    set({ token })
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem('access_token')
    set({ user: null, token: null })
  },

  initialize: async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      set({ isInitialized: true })
      return
    }
    set({ isLoading: true })
    try {
      const user = await getMe()
      set({ user, token, isLoading: false, isInitialized: true })
    } catch {
      localStorage.removeItem('access_token')
      set({ user: null, token: null, isLoading: false, isInitialized: true })
    }
  },
}))
