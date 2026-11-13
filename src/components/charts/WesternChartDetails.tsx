import type { WesternChartData } from '../../astrology/types'
import { KeyChartInsights } from './KeyChartInsights'

type WesternChartDetailsProps = {
  chart: WesternChartData
}

export function WesternChartDetails({ chart }: WesternChartDetailsProps) {
  const aspects = chart.aspects.map(
    ({ planets, aspect }) => `${planets[0]} ${aspect.toLowerCase()} ${planets[1]}.`,
  )

  return (
    <KeyChartInsights
      items={aspects}
      title="Western sample aspects"
    />
  )
}
