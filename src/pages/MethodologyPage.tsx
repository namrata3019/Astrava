import { Link } from 'react-router-dom'
import { Badge } from '../components/common/Badge'
import { Card } from '../components/common/Card'
import { Footer } from '../components/navigation/Footer'
import { Navigation } from '../components/navigation/Navigation'

const stages = [
  {
    number: '01',
    title: 'Choose a system',
    description: 'Vedic sidereal and Western tropical chart data stay in separate pipelines. The user chooses explicitly.',
  },
  {
    number: '02',
    title: 'Calculate before interpreting',
    description: 'A deterministic chart engine must establish and validate chart facts before an interpretation can use them.',
  },
  {
    number: '03',
    title: 'Explain with evidence',
    description: 'Interpretive language should identify the supported placements it references, acknowledge uncertainty, and invite reflection.',
  },
]

export default function MethodologyPage() {
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
        <div className="mx-auto max-w-5xl">
          <Badge>Methodology and limitations</Badge>
          <h1 className="mt-4 font-display text-4xl text-midnight sm:text-5xl">
            Calculation first. Interpretation second.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink/75">
            ASTRAVA is designed to make the source, system, and limits of each
            chart and interpretation clear. The current prototype demonstrates
            this structure with fixtures; it does not calculate real charts.
          </p>

          <section aria-labelledby="method-stages-heading" className="mt-9">
            <h2
              className="font-display text-3xl text-midnight"
              id="method-stages-heading"
            >
              How the experience is structured
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {stages.map((stage) => (
                <Card as="article" key={stage.number}>
                  <p className="font-display text-3xl text-[#765522]">
                    {stage.number}
                  </p>
                  <h3 className="mt-4 font-display text-2xl text-midnight">
                    {stage.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink/75">
                    {stage.description}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="systems-heading" className="mt-10">
            <h2 className="font-display text-3xl text-midnight" id="systems-heading">
              Two systems, kept distinct
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Card as="article">
                <h3 className="font-display text-2xl text-midnight">
                  Vedic · Sidereal
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink/75">
                  The sample fixture identifies a sidereal zodiac, Lahiri
                  ayanamsha, Whole Sign houses, and mean nodes. Vedic-specific
                  fields such as Nakshatra and sample Dasha are not transferred
                  to the Western path.
                </p>
              </Card>
              <Card as="article">
                <h3 className="font-display text-2xl text-midnight">
                  Western · Tropical
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink/75">
                  The separate sample fixture identifies a tropical zodiac,
                  Whole Sign houses, mean nodes, and a stated maximum orb for
                  major aspects. Western aspects and distributions are not
                  transferred to the Vedic path.
                </p>
              </Card>
            </div>
          </section>

          <section aria-labelledby="current-state-heading" className="mt-10">
            <h2
              className="font-display text-3xl text-midnight"
              id="current-state-heading"
            >
              What is and is not implemented
            </h2>
            <Card as="section" className="mt-5">
              <ul className="space-y-3 text-sm leading-6 text-ink/75">
                <li>
                  <strong className="text-ink">Chart data:</strong> sample
                  fixtures only; no ephemeris or real birth-data calculation is
                  connected.
                </li>
                <li>
                  <strong className="text-ink">Interpretations:</strong>{' '}
                  deterministic, structured reflective examples based on
                  supported fixture placements; no generative AI or personal
                  interpretation is used.
                </li>
                <li>
                  <strong className="text-ink">Evidence:</strong> each sample
                  section exposes its source placement. Missing placements are
                  not invented; sample Dasha data is not used to make timing
                  claims.
                </li>
                <li>
                  <strong className="text-ink">Reports:</strong> catalogue
                  outlines only. Checkout and report generation are not
                  available.
                </li>
                <li>
                  <strong className="text-ink">Uncertainty:</strong> birth-time
                  accuracy and historical timezone/DST limitations matter for
                  real chart calculation; this prototype does not resolve them.
                </li>
              </ul>
            </Card>
          </section>

          <p className="mt-8 text-sm leading-6 text-ink/70">
            View the{' '}
            <Link className="font-semibold text-[#765522] underline" to="/interpretation">
              sample interpretation
            </Link>
            , the{' '}
            <Link className="font-semibold text-[#765522] underline" to="/reports">
              planned report catalogue
            </Link>
            , or the{' '}
            <Link className="font-semibold text-[#765522] underline" to="/chart">
              sample chart dashboards
            </Link>
            .
          </p>

          <p className="mt-6 rounded-2xl border border-champagne/40 bg-champagne/10 p-4 text-sm leading-6 text-ink">
            Astrology content is for self-reflection and entertainment only.
            It is not professional, medical, legal, or financial advice, and
            no outcome is guaranteed.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
