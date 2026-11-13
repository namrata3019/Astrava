import type { HousePlacement } from '../../astrology/types'
import { Card } from '../common/Card'

type BirthChartDiagramProps = {
  houses: HousePlacement[]
  system: 'vedic' | 'western'
}

export function BirthChartDiagram({ houses, system }: BirthChartDiagramProps) {
  const systemName = system === 'vedic' ? 'Vedic sidereal' : 'Western tropical'

  return (
    <Card as="figure" aria-labelledby="house-sign-map-title">
      <h2
        className="font-display text-2xl text-midnight"
        id="house-sign-map-title"
      >
        House and sign map
      </h2>
      <figcaption className="mt-2 text-sm leading-6 text-ink/70">
        {systemName} sample. This schematic groups fixture placements by house;
        it is not an astronomical chart or to scale.
      </figcaption>
      <ol
        aria-label={`${systemName} sample houses`}
        className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
      >
        {houses.map(({ house, sign, planets }) => (
          <li
            className="min-h-24 rounded-2xl border border-soft-gray bg-ivory/70 p-3"
            key={house}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/70">
              House {house}
            </p>
            <p className="mt-1 font-display text-lg text-midnight">{sign}</p>
            <p className="mt-1 text-xs leading-5 text-ink/70">
              {planets.length ? planets.join(', ') : 'No fixture placements'}
            </p>
          </li>
        ))}
      </ol>
    </Card>
  )
}
