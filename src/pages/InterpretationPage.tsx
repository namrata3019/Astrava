import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { AstrologySystem, ChartData } from '../astrology/types'
import { vedicCalculator } from '../astrology/adapters/vedicCalculator'
import { westernCalculator } from '../astrology/adapters/westernCalculator'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { StatePanel } from '../components/common/StatePanel'
import { Footer } from '../components/navigation/Footer'
import { Navigation } from '../components/navigation/Navigation'
import { interpretChart } from '../services/interpretationService'

const systemOptions: Array<{
  value: AstrologySystem
  title: string
  description: string
}> = [
  {
    value: 'vedic',
    title: 'Vedic · Sidereal',
    description: 'A separate sample fixture using Lahiri ayanamsha.',
  },
  {
    value: 'western',
    title: 'Western · Tropical',
    description: 'A separate sample fixture using Whole Sign houses.',
  },
]

function getSampleChart(system: AstrologySystem): ChartData {
  return system === 'vedic'
    ? vedicCalculator.calculateChart()
    : westernCalculator.calculateChart()
}

export default function InterpretationPage() {
  const [system, setSystem] = useState<AstrologySystem | ''>('')
  const chart = system ? getSampleChart(system) : null
  const interpretation = chart ? interpretChart(chart) : null

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
          <Badge>Interpretation preview · fixture only</Badge>
          <h1 className="mt-4 font-display text-4xl text-midnight sm:text-5xl">
            Explore an interpretation, and its evidence
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink/75">
            Each sample section names the placement it refers to and offers a
            question rather than a prediction. Choose a system to see its
            separate, illustrative fixture.
          </p>

          <Card as="section" aria-labelledby="sample-system-heading" className="mt-8">
            <fieldset>
              <legend
                className="font-display text-2xl text-midnight"
                id="sample-system-heading"
              >
                Choose an astrology system
              </legend>
              <p className="mt-2 text-sm leading-6 text-ink/70">
                Neither system is selected for you. This choice selects a
                sample fixture only, not a chart calculated from your birth
                details.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {systemOptions.map((option) => (
                  <label
                    className={`flex min-h-24 cursor-pointer gap-3 rounded-2xl border p-4 ${system === option.value ? 'border-[#765522] bg-champagne/10' : 'border-soft-gray bg-white hover:border-[#b6a27d]'}`}
                    key={option.value}
                  >
                    <input
                      checked={system === option.value}
                      className="mt-1 size-4 accent-[#765522]"
                      name="interpretation-system"
                      onChange={() => setSystem(option.value)}
                      type="radio"
                      value={option.value}
                    />
                    <span>
                      <span className="block text-sm font-semibold text-midnight">
                        {option.title}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-ink/70">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </Card>

          {!interpretation && (
            <div className="mt-6">
              <StatePanel
                description="Choose Vedic or Western above to view a clearly labelled example. No system or personal chart is assumed."
                title="Choose a sample system to continue"
              />
            </div>
          )}

          {interpretation && chart && (
            <section aria-labelledby="interpretation-sections-heading" className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge>{interpretation.sampleLabel}</Badge>
                <Link
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink underline decoration-champagne underline-offset-4"
                  to={`/chart?system=${interpretation.system}`}
                >
                  View the source sample chart <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
              <h2
                className="mt-5 font-display text-3xl text-midnight"
                id="interpretation-sections-heading"
              >
                {interpretation.system === 'vedic'
                  ? 'Vedic · Sidereal sample interpretation'
                  : 'Western · Tropical sample interpretation'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/70">
                Settings: {chart.settings.zodiac}
                {chart.system === 'vedic'
                  ? ` zodiac, ${chart.settings.ayanamsha} ayanamsha, ${chart.settings.houseSystem} houses.`
                  : ` zodiac, ${chart.settings.houseSystem} houses, ${chart.settings.aspectOrbs}.`}
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {interpretation.sections.map((section) => (
                  <Card
                    as="article"
                    aria-labelledby={`interpretation-${section.id}`}
                    key={section.id}
                  >
                    <h3
                      className="font-display text-2xl text-midnight"
                      id={`interpretation-${section.id}`}
                    >
                      {section.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-ink/80">
                      {section.summary}
                    </p>
                    {section.evidence.length > 0 ? (
                      <details className="mt-4 rounded-xl border border-soft-gray bg-ivory p-4">
                        <summary className="min-h-8 cursor-pointer text-sm font-semibold text-[#765522] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#765522]">
                          Why this sample says this
                        </summary>
                        <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6 text-ink/75">
                          {section.evidence.map((evidence) => (
                            <li key={`${evidence.planet}-${evidence.house}`}>
                              {evidence.detail}
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <p className="mt-4 text-sm text-ink/70">
                        No supported placement is available for this section.
                      </p>
                    )}
                    <p className="mt-4 border-t border-soft-gray pt-4 text-sm leading-6 text-ink/75">
                      <strong>Reflection:</strong> {section.reflectionQuestion}
                    </p>
                  </Card>
                ))}
              </div>
              <p className="mt-6 rounded-2xl border border-champagne/40 bg-champagne/10 p-4 text-sm leading-6 text-ink">
                {interpretation.disclaimer}
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => setSystem('')}
                  type="button"
                  variant="quiet"
                >
                  Choose a different system
                </Button>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
