import { vedicChartFixture } from '../fixtures/vedicChart.ts'
import type { AstrologyCalculator } from '../types.ts'

export const vedicCalculator: AstrologyCalculator<'vedic'> = {
  calculateChart: () => vedicChartFixture,
  getPlanetaryPositions: (chart) => chart.placements,
  getAscendant: (chart) => chart.ascendant,
  getHousePlacements: (chart) => chart.houses,
}
