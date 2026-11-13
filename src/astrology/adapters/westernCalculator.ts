import { westernChartFixture } from '../fixtures/westernChart.ts'
import type { AstrologyCalculator } from '../types.ts'

export const westernCalculator: AstrologyCalculator<'western'> = {
  calculateChart: () => westernChartFixture,
  getPlanetaryPositions: (chart) => chart.placements,
  getAscendant: (chart) => chart.ascendant,
  getHousePlacements: (chart) => chart.houses,
}
