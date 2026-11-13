import type { CalculationSettings as Settings } from '../../astrology/types'
import { Card } from '../common/Card'

type CalculationSettingsProps = {
  settings: Settings
}

export function CalculationSettings({ settings }: CalculationSettingsProps) {
  return (
    <Card as="section" aria-labelledby="calculation-settings-title">
      <h2
        className="font-display text-2xl text-midnight"
        id="calculation-settings-title"
      >
        Sample calculation settings
      </h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {Object.entries(settings).map(([label, value]) => (
          <div className="border-t border-soft-gray pt-3" key={label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink/70">
              {label.replace(/([A-Z])/g, ' $1')}
            </dt>
            <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-xs leading-5 text-ink/65">
        Settings describe this illustrative fixture only; no calculation was
        performed.
      </p>
    </Card>
  )
}
