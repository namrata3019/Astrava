import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  as?: 'article' | 'div' | 'section'
}

export function Card({
  as: Element = 'article',
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <Element
      className={`rounded-3xl border border-soft-gray bg-white p-6 shadow-[0_18px_50px_-36px_rgba(16,21,37,0.28)] ${className}`}
      {...props}
    >
      {children}
    </Element>
  )
}
