export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={`${sizes[size]} rounded-full border-4 border-peach-200 border-t-peach-400 animate-spin`} />
  )
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100">
      <Spinner size="lg" />
    </div>
  )
}
