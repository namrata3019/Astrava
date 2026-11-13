import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-midnight text-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <p className="font-display text-2xl tracking-[0.12em]">ASTRAVA</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-ivory/65">
            Astrology, interpreted personally. Built around clear methods,
            thoughtful context, and respect for your own perspective.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-ivory/75 md:justify-end">
          <a className="hover:text-ivory" href="/#faq">FAQ</a>
          <a className="hover:text-ivory" href="/#privacy">Privacy</a>
          <a className="hover:text-ivory" href="mailto:hello@astrava.example">Contact</a>
          <Link className="hover:text-ivory" to="/birth-details">Explore my chart</Link>
          <Link className="hover:text-ivory" to="/explore">Explore Your Chart</Link>
          <Link className="hover:text-ivory" to="/interpretation">Interpretations</Link>
          <Link className="hover:text-ivory" to="/reports">Reports</Link>
          <Link className="hover:text-ivory" to="/methodology">Methodology</Link>
          <Link className="hover:text-ivory" to="/account">Sign in</Link>
        </nav>
      </div>
      <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-ivory/55">
        Astrology is for self-reflection and entertainment, not professional,
        medical, legal, or financial advice.
      </div>
    </footer>
  )
}
