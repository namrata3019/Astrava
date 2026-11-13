import { Link } from 'react-router-dom'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Footer } from '../components/navigation/Footer'
import { Navigation } from '../components/navigation/Navigation'

const reports = [
  {
    id: 'complete-chart',
    title: 'Complete Birth Chart Report',
    description: 'An overview designed to connect chart structure, settings, and reflective themes.',
    sections: ['Chart facts and settings', 'Personality and emotional themes', 'Evidence-linked reflection prompts'],
  },
  {
    id: 'career',
    title: 'Career and Wealth Compass',
    description: 'A framework for exploring work, resources, and professional values without promising outcomes.',
    sections: ['Relevant chart factors', 'Supporting and limiting themes', 'Questions for personal reflection'],
  },
  {
    id: 'relationships',
    title: 'Relationship Insights',
    description: 'A calm, non-deterministic way to reflect on connection and communication.',
    sections: ['Relationship-related chart factors', 'Multiple possible expressions', 'Conversation prompts'],
  },
  {
    id: 'vedic-dasha',
    title: 'Vedic Dasha Report',
    description: 'A planned explanation of period calculations, once a verified calculation engine is available.',
    sections: ['Calculation source and settings', 'Verified period dates', 'Traditional context and limitations'],
  },
  {
    id: 'western-blueprint',
    title: 'Western Natal Blueprint',
    description: 'A planned tropical-chart report with placements, aspects, and their evidence.',
    sections: ['Tropical chart facts', 'Aspects and stated orbs', 'Evidence-linked reflective themes'],
  },
]

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <a
        className="sr-only z-50 rounded-full bg-champagne px-4 py-2 text-midnight focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Skip to content
      </a>
      <Navigation />
      <main
        className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"
        id="main-content"
      >
        <div className="mx-auto max-w-6xl">
          <Badge>Sample catalogue · checkout unavailable</Badge>
          <h1 className="mt-4 font-display text-4xl text-midnight sm:text-5xl">
            Reports built around clear evidence
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink/75">
            These are planned report formats, not completed personal reports.
            Previews explain the intended structure; they contain no calculated
            personal chart data.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reports.map((report) => (
              <Card
                as="article"
                aria-labelledby={`report-${report.id}`}
                className="flex flex-col"
                key={report.id}
              >
                <Badge className="self-start">Sample preview</Badge>
                <h2
                  className="mt-4 font-display text-2xl text-midnight"
                  id={`report-${report.id}`}
                >
                  {report.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-ink/75">
                  {report.description}
                </p>
                <details className="mt-5 rounded-xl border border-soft-gray bg-ivory p-4">
                  <summary className="min-h-8 cursor-pointer text-sm font-semibold text-[#765522] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#765522]">
                    View sample outline
                  </summary>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6 text-ink/75">
                    {report.sections.map((section) => (
                      <li key={section}>{section}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs leading-5 text-ink/65">
                    Structure preview only. No personal interpretation or
                    calculation is included.
                  </p>
                </details>
                <Button
                  className="mt-6 w-full"
                  disabled
                  type="button"
                >
                  Coming soon
                </Button>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-sm leading-6 text-ink/70">
            Explore the current{' '}
            <Link
              className="font-semibold text-[#765522] underline"
              to="/interpretation"
            >
              fixture-backed interpretation preview
            </Link>{' '}
            or read the{' '}
            <Link
              className="font-semibold text-[#765522] underline"
              to="/methodology"
            >
              methodology and limitations
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
