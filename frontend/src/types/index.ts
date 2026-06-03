export interface User {
  id: number
  username: string
  email: string
  created_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface Book {
  id: number
  title: string
  author: string
  genre: string
  cover_image_url?: string | null
  source_url?: string | null
  created_at: string
}

export interface Reel {
  id: number
  book_id: number
  type: string
  content: string
  order_index: number
  created_at: string
}

export interface ReelWithBook extends Reel {
  book?: Book
}
