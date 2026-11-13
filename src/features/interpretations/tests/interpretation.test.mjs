import assert from 'node:assert/strict'
import test from 'node:test'
import { westernCalculator } from '../../../astrology/adapters/westernCalculator.ts'
import { vedicCalculator } from '../../../astrology/adapters/vedicCalculator.ts'
import { interpretChart } from '../../../services/interpretationService.ts'

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const nested of Object.values(value)) deepFreeze(nested)
  }
  return value
}

test('interpretations are labelled, structured, and trace to supported Vedic placements', () => {
  const chart = deepFreeze(vedicCalculator.calculateChart())
  const before = structuredClone(chart)
  const result = interpretChart(chart)

  assert.equal(result.system, 'vedic')
  assert.equal(result.source, 'mock')
  assert.equal(result.sampleLabel, 'Sample interpretation, not a personal reading')
  assert.equal(result.sections.length, 8)
  assert.deepEqual(chart, before)

  for (const section of result.sections) {
    for (const evidence of section.evidence) {
      const placement = chart.placements.find(
        ({ planet }) => planet === evidence.planet,
      )
      assert.ok(placement)
      assert.equal(evidence.sign, placement.sign)
      assert.equal(evidence.house, placement.house)
    }
  }

  const emotionalSection = result.sections.find(
    ({ id }) => id === 'emotional-patterns',
  )
  assert.match(emotionalSection.evidence[0].detail, /Rohini, pada 2/u)
})

test('Western sample interpretation uses its own chart facts and disclaimer', () => {
  const chart = westernCalculator.calculateChart()
  const result = interpretChart(chart)
  const careerSection = result.sections.find(({ id }) => id === 'career')

  assert.equal(result.system, 'western')
  assert.equal(careerSection.evidence[0].planet, 'Mars')
  assert.equal(careerSection.evidence[0].sign, 'Taurus')
  assert.equal(careerSection.evidence[0].house, 10)
  assert.match(careerSection.summary, /10th house/u)
  assert.match(result.disclaimer, /self-reflection and entertainment/u)
})

test('invalid chart data is rejected and missing placements are not invented', () => {
  const invalidChart = {
    ...westernCalculator.calculateChart(),
    settings: { ...westernCalculator.calculateChart().settings, zodiac: 'Sidereal' },
  }

  assert.throws(() => interpretChart(invalidChart), { name: 'ZodError' })

  const chartWithoutMars = {
    ...westernCalculator.calculateChart(),
    placements: westernCalculator
      .calculateChart()
      .placements.filter(({ planet }) => planet !== 'Mars'),
  }
  const result = interpretChart(chartWithoutMars)
  const careerSection = result.sections.find(({ id }) => id === 'career')

  assert.deepEqual(careerSection.evidence, [])
  assert.match(careerSection.summary, /does not include a Mars placement/u)
})
