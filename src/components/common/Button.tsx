import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'quiet'
}

export const buttonStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'border border-champagne bg-champagne text-midnight hover:bg-[#d2b37e] hover:border-[#d2b37e]',
  secondary:
    'border border-white/35 bg-white/5 text-ivory hover:bg-white/10 hover:border-white/60',
  quiet:
    'border border-transparent bg-transparent text-ink hover:bg-indigo/5',
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${buttonStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
