import type { ChartData } from '../../astrology/types'
import { Card } from '../common/Card'

type ChartSummaryProps = {
  ascendant: string | null
  chart: ChartData
}

export function ChartSummary({
  ascendant,
  chart,
}: ChartSummaryProps) {
  const sunSign = chart.placements.find(({ planet }) => planet === 'Sun')?.sign
  const moonSign = chart.placements.find(({ planet }) => planet === 'Moon')?.sign

  return (
    <Card as="section" aria-labelledby="chart-summary-title">
      <h2
        className="font-display text-2xl text-midnight"
        id="chart-summary-title"
      >
        Chart summary
      </h2>
      <p className="mt-3 text-sm leading-6 text-ink/75">
        {chart.accessibleSummary}
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-ivory p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink/70">
            Sun sign
          </dt>
          <dd className="mt-1 text-sm font-semibold text-midnight">
            {sunSign ?? 'Not included in this fixture'}
          </dd>
        </div>
        <div className="rounded-2xl bg-ivory p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink/70">
            Moon sign
          </dt>
          <dd className="mt-1 text-sm font-semibold text-midnight">
            {moonSign ?? 'Not included in this fixture'}
          </dd>
        </div>
        <div className="rounded-2xl bg-ivory p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink/70">
            Astrology system
          </dt>
          <dd className="mt-1 text-sm font-semibold text-midnight">
            {chart.system === 'vedic' ? 'Vedic · Sidereal' : 'Western · Tropical'}
          </dd>
        </div>
        <div className="rounded-2xl bg-ivory p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink/70">
            Sample Ascendant
          </dt>
          <dd className="mt-1 text-sm font-semibold text-midnight">
            {ascendant ?? 'Not included in this fixture'}
          </dd>
        </div>
        <div className="rounded-2xl bg-ivory p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink/70">
            Data source
          </dt>
          <dd className="mt-1 text-sm font-semibold text-midnight">
            Static mock fixture
          </dd>
        </div>
      </dl>
    </Card>
  )
}
