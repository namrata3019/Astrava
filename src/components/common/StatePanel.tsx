import type { ReactNode } from 'react'

type StatePanelProps = {
  action?: ReactNode
  description: string
  title: string
  type?: 'empty' | 'error' | 'loading'
}

export function StatePanel({
  action,
  description,
  title,
  type = 'empty',
}: StatePanelProps) {
  const isError = type === 'error'

  return (
    <div
      aria-live={isError ? 'assertive' : 'polite'}
      className="rounded-2xl border border-soft-gray bg-white p-6 text-center"
      role={isError ? 'alert' : 'status'}
    >
      {type === 'loading' && (
        <span
          aria-hidden="true"
          className="mx-auto mb-4 block size-6 animate-spin rounded-full border-2 border-champagne border-t-transparent"
        />
      )}
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-ink/70">
        {description}
      </p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
