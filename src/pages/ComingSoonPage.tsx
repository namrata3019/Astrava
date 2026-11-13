import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/common/Badge'
import { buttonStyles } from '../components/common/Button'
import { Footer } from '../components/navigation/Footer'
import { Navigation } from '../components/navigation/Navigation'

export function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <main className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center">
        <Badge>Coming in a future phase</Badge>
        <h1 className="mt-6 font-display text-4xl leading-tight text-midnight sm:text-5xl">
          Your chart journey starts here.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-ink/75">
          Birth details and chart calculations are not available in this
          prototype yet. No personal details have been requested or stored.
        </p>
        <Link
          className={`${buttonStyles.primary} mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold`}
          to="/"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back to the overview
        </Link>
      </main>
      <Footer />
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <main className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center">
        <Badge tone="outline">Page not found</Badge>
        <h1 className="mt-6 font-display text-4xl leading-tight text-midnight sm:text-5xl">
          This path is not part of the map.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-ink/75">
          The page may have moved, or it may not be available in this prototype.
        </p>
        <Link
          className={`${buttonStyles.primary} mt-8 inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold`}
          to="/"
        >
          Return home
        </Link>
      </main>
      <Footer />
    </div>
  )
}
