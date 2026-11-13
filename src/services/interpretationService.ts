import type { ChartData, PlanetName } from '../astrology/types'
import {
  chartDataSchema,
  chartInterpretationSchema,
  type ChartInterpretation,
} from '../features/interpretations/schema.ts'
import { interpretationRules } from '../features/interpretations/interpretationRules.ts'

const houseThemes: Record<number, string> = {
  1: 'identity and first impressions',
  2: 'personal resources and values',
  3: 'communication and everyday learning',
  4: 'home and personal foundations',
  5: 'creativity and self-expression',
  6: 'daily routines and service',
  7: 'partnership and collaboration',
  8: 'shared matters and personal change',
  9: 'study, beliefs, and wider perspective',
  10: 'public life and professional direction',
  11: 'community and long-term aims',
  12: 'rest, retreat, and reflection',
}

const houseOrdinals: Record<number, string> = {
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: '4th',
  5: '5th',
  6: '6th',
  7: '7th',
  8: '8th',
  9: '9th',
  10: '10th',
  11: '11th',
  12: '12th',
}

function findPlacement(chart: ChartData, planet: PlanetName) {
  return chart.placements.find((placement) => placement.planet === planet)
}

function createSection(
  chart: ChartData,
  rule: (typeof interpretationRules.vedic)[number],
): ChartInterpretation['sections'][number] {
  const placement = findPlacement(chart, rule.planet)

  if (!placement) {
    return {
      id: rule.id,
      title: rule.title,
      summary: `This sample fixture does not include a ${rule.planet} placement, so there is not enough supported chart evidence for this section.`,
      reflectionQuestion: 'No chart-based reflection prompt is available for this sample.',
      evidence: [],
    }
  }

  const houseTheme = houseThemes[placement.house]
  const systemName = chart.system === 'vedic' ? 'Vedic' : 'Western'
  const details = [
    `${rule.planet} is shown in ${placement.sign}, in house ${placement.house}.`,
  ]

  if (chart.system === 'vedic') {
    const vedicPlacement = chart.placements.find(
      (candidate) => candidate.planet === rule.planet,
    )
    if (vedicPlacement?.nakshatra) {
      const pada = vedicPlacement.pada ? `, pada ${vedicPlacement.pada}` : ''
      details.push(
        `${rule.planet} is shown in ${vedicPlacement.nakshatra}${pada}.`,
      )
    }
  }

  return {
    id: rule.id,
    title: rule.title,
    summary: `In this sample, ${rule.planet} is shown in ${placement.sign}, in the ${houseOrdinals[placement.house]} house associated with ${houseTheme}. In traditional ${systemName} astrology, ${rule.planet} is associated with ${rule.planetTheme}; this can be a prompt for reflection, not a fixed description or prediction.`,
    reflectionQuestion: rule.reflectionPrompt,
    evidence: [{
      type: 'placement',
      planet: rule.planet,
      sign: placement.sign,
      house: placement.house,
      detail: details.join(' '),
    }],
  }
}

export function interpretChart(input: unknown): ChartInterpretation {
  const chart = chartDataSchema.parse(input)
  const rules = interpretationRules[chart.system]
  const result = {
    system: chart.system,
    source: 'mock',
    sampleLabel: 'Sample interpretation, not a personal reading',
    sections: rules.map((rule) => createSection(chart, rule)),
    disclaimer:
      'For self-reflection and entertainment only; not professional, medical, legal, or financial advice.',
  }

  return chartInterpretationSchema.parse(result)
}
