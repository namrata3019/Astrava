import type { PlanetaryPosition } from '../../astrology/types'
import { Card } from '../common/Card'

type PlanetaryPlacementTableProps = {
  positions: PlanetaryPosition[]
  system: 'vedic' | 'western'
}

export function PlanetaryPlacementTable({
  positions,
  system,
}: PlanetaryPlacementTableProps) {
  return (
    <Card as="section" aria-labelledby="planetary-placements-title">
      <h2
        className="font-display text-2xl text-midnight"
        id="planetary-placements-title"
      >
        Planetary placements
      </h2>
      <div
        aria-label="Scrollable planetary placement table"
        className="mt-5 min-w-0 overflow-x-auto"
        role="region"
        tabIndex={0}
      >
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <caption className="sr-only">
            {system === 'vedic' ? 'Vedic sidereal' : 'Western tropical'} sample
            planetary positions and fixture details
          </caption>
          <thead>
            <tr className="border-b border-soft-gray text-xs uppercase tracking-wide text-ink/65">
              <th className="py-3 pr-4 font-semibold" scope="col">Planet</th>
              <th className="px-4 py-3 font-semibold" scope="col">Sign</th>
              <th className="px-4 py-3 font-semibold" scope="col">House</th>
              <th className="px-4 py-3 font-semibold" scope="col">Motion</th>
              {system === 'vedic' && (
                <th className="py-3 pl-4 font-semibold" scope="col">
                  Nakshatra · Pada
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr
                className="border-b border-soft-gray/70 last:border-0"
                key={position.planet}
              >
                <th className="py-3 pr-4 font-semibold text-midnight" scope="row">
                  {position.planet}
                </th>
                <td className="px-4 py-3 text-ink/80">{position.sign}</td>
                <td className="px-4 py-3 text-ink/80">{position.house}</td>
                <td className="px-4 py-3 text-ink/80">
                  {position.retrograde ? 'Retrograde' : 'Direct'}
                </td>
                {system === 'vedic' && (
                  <td className="py-3 pl-4 text-ink/80">
                    {'nakshatra' in position && position.nakshatra
                      ? `${position.nakshatra}${position.pada ? ` · Pada ${position.pada}` : ''}`
                      : 'Not included in this fixture'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
