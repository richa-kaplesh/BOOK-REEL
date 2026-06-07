export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div
      className={`${sizes[size]} rounded-full border-2 animate-spin`}
      style={{ borderColor: 'var(--border-soft)', borderTopColor: 'var(--accent-amber)' }}
    />
  )
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--border-soft)', borderTopColor: 'var(--accent-amber)' }}
        />
        <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading…</p>
      </div>
    </div>
  )
}
