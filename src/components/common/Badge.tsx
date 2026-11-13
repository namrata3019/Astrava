import type { HTMLAttributes, ReactNode } from 'react'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  tone?: 'light' | 'dark' | 'outline'
}

const toneClasses: Record<NonNullable<BadgeProps['tone']>, string> = {
  light: 'border border-champagne/40 bg-champagne/10 text-ink',
  dark: 'border border-champagne/35 bg-white/5 text-ivory',
  outline: 'border border-soft-gray bg-transparent text-ink',
}

export function Badge({
  children,
  className = '',
  tone = 'light',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${toneClasses[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
