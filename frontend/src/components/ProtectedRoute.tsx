import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { token, isInitialized } = useAuthStore()

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div
          className="w-10 h-10 rounded-full border-[3px] animate-spin"
          style={{ borderColor: 'var(--border-soft)', borderTopColor: 'var(--accent-amber)' }}
        />
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
