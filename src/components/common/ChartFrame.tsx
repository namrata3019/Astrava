import type { HTMLAttributes, ReactNode } from 'react'

type ChartFrameProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  description: string
  title: string
}

export function ChartFrame({
  children,
  className = '',
  description,
  title,
  ...props
}: ChartFrameProps) {
  return (
    <div
      className={`rounded-3xl border border-white/15 bg-white/[0.04] p-5 ${className}`}
      {...props}
    >
      <div className="mb-5">
        <h3 className="font-display text-xl text-ivory">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-ivory/70">{description}</p>
      </div>
      {children}
    </div>
  )
}
