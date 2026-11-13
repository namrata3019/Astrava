import type { VedicChartData } from '../../astrology/types'
import { KeyChartInsights } from './KeyChartInsights'

type VedicChartDetailsProps = {
  chart: VedicChartData
}

export function VedicChartDetails({ chart }: VedicChartDetailsProps) {
  const details = [
    chart.moonNakshatra
      ? `Moon Nakshatra: ${chart.moonNakshatra.name}, Pada ${chart.moonNakshatra.pada}.`
      : 'Moon Nakshatra and Pada are not included in this fixture.',
    chart.dasha
      ? `Illustrative Dasha fixture: ${chart.dasha.mahaDasha} Mahadasha, ${chart.dasha.antarDasha} Antardasha. ${chart.dasha.samplePeriod}`
      : 'Dasha periods are not included in this fixture.',
  ]

  return <KeyChartInsights items={details} title="Vedic sample details" />
}
