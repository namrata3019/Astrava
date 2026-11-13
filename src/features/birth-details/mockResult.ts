import type { AstrologySystem } from './schema'

export type SampleChartResult = {
  source: 'mock'
  system: AstrologySystem
  label: 'Sample data, not your chart'
  summary: string
  details: string[]
}

const sampleChartFixtures: Record<AstrologySystem, SampleChartResult> = {
  vedic: {
    source: 'mock',
    system: 'vedic',
    label: 'Sample data, not your chart',
    summary:
      'This static preview is not calculated from the details you entered. Chart calculations are not connected in this prototype.',
    details: [
      'No planetary positions or houses have been generated.',
      'Your birth details were not saved.',
    ],
  },
  western: {
    source: 'mock',
    system: 'western',
    label: 'Sample data, not your chart',
    summary:
      'This static preview is not calculated from the details you entered. Chart calculations are not connected in this prototype.',
    details: [
      'No planetary positions or houses have been generated.',
      'Your birth details were not saved.',
    ],
  },
}

export function createSampleChartResult(system: AstrologySystem): SampleChartResult {
  return sampleChartFixtures[system]
}
