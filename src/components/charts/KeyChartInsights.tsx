import { Card } from '../common/Card'

type KeyChartInsightsProps = {
  items: string[]
  title?: string
}

export function KeyChartInsights({
  items,
  title = 'Fixture details',
}: KeyChartInsightsProps) {
  return (
    <Card as="section" aria-labelledby="fixture-details-title">
      <h2
        className="font-display text-2xl text-midnight"
        id="fixture-details-title"
      >
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink/70">
        These are descriptive fields from the sample fixture, not personalized
        interpretations.
      </p>
      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              className="flex gap-3 text-sm leading-6 text-ink/80"
              key={item}
            >
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-[#765522]"
              />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-ink/70">
          This field is not included in the sample fixture.
        </p>
      )}
    </Card>
  )
}
