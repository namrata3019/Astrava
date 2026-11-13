import type { ElementName, ModalityName } from '../../astrology/types'
import { Card } from '../common/Card'

type DistributionBreakdownProps = {
  elements: Record<ElementName, number>
  modalities: Record<ModalityName, number>
}

function DistributionGroup({
  title,
  values,
}: {
  title: string
  values: Array<[string, number]>
}) {
  return (
    <section aria-label={`${title} distribution`}>
      <h3 className="text-sm font-semibold text-midnight">{title}</h3>
      <dl className="mt-3 space-y-3">
        {values.map(([label, count]) => (
          <div className="flex items-center justify-between gap-4" key={label}>
            <dt className="text-sm text-ink/75">{label}</dt>
            <dd className="font-semibold tabular-nums text-ink">{count}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function DistributionBreakdown({
  elements,
  modalities,
}: DistributionBreakdownProps) {
  return (
    <Card as="section" aria-labelledby="distribution-title">
      <h2 className="font-display text-2xl text-midnight" id="distribution-title">
        Element and modality
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink/70">
        Counts come from the static sample fixture; no personal chart data is
        represented.
      </p>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <DistributionGroup title="Elements" values={Object.entries(elements)} />
        <DistributionGroup
          title="Modalities"
          values={Object.entries(modalities)}
        />
      </div>
    </Card>
  )
}
