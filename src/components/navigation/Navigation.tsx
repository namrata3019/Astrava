import { ArrowUpRight, Orbit } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../common/Badge'
import { buttonStyles } from '../common/Button'

const navLinks = [
  { href: '#methodology', label: 'Explore astrology' },
  { href: '#vedic', label: 'Vedic' },
  { href: '#western', label: 'Western' },
  { href: '#how-it-works', label: 'How it works' },
]

export function Navigation() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-midnight/95 text-ivory backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          aria-label="ASTRAVA home"
          className="inline-flex shrink-0 items-center gap-2.5 rounded-lg text-ivory"
          to="/"
        >
          <span className="grid size-9 place-items-center rounded-full border border-champagne/70 text-champagne">
            <Orbit aria-hidden="true" size={19} strokeWidth={1.5} />
          </span>
          <span className="font-display text-2xl tracking-[0.12em]">ASTRAVA</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              className="rounded-sm text-sm text-ivory/75 transition-colors hover:text-ivory"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
          <span
            aria-label="Sign in, coming soon"
            className="inline-flex items-center gap-2 text-sm text-ivory/65"
          >
            Sign in <Badge className="px-2 py-0.5 text-[10px]" tone="dark">Soon</Badge>
          </span>
        </nav>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <Link
            className={`${buttonStyles.primary} inline-flex min-h-10 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors`}
            to="/birth-details"
          >
            Explore my chart <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>

        <details className="group relative lg:hidden">
          <summary className="grid min-h-11 min-w-11 cursor-pointer list-none place-items-center rounded-full border border-white/25 text-sm font-medium text-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne">
            <span className="group-open:hidden">Menu</span>
            <span className="hidden group-open:inline">Close</span>
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 top-14 flex w-[min(88vw,22rem)] flex-col gap-1 rounded-2xl border border-white/15 bg-midnight p-3 shadow-2xl"
          >
            {navLinks.map((link) => (
              <a
                className="rounded-xl px-4 py-3 text-sm text-ivory/85 hover:bg-white/10"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
            <span className="flex items-center justify-between px-4 py-3 text-sm text-ivory/65">
              Sign in <Badge className="px-2 py-0.5 text-[10px]" tone="dark">Soon</Badge>
            </span>
            <Link
              className={`${buttonStyles.primary} mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold`}
              to="/birth-details"
            >
              Explore my chart <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </nav>
        </details>
      </div>
    </header>
  )
}
