import assert from 'node:assert/strict'
import test from 'node:test'
import { vedicCalculator } from '../adapters/vedicCalculator.ts'
import { westernCalculator } from '../adapters/westernCalculator.ts'

test('Vedic adapter returns only sidereal fixture data through the contract', () => {
  const chart = vedicCalculator.calculateChart()

  assert.equal(chart.system, 'vedic')
  assert.equal(chart.source, 'mock')
  assert.equal(chart.settings.zodiac, 'Sidereal')
  assert.equal(chart.sampleLabel, 'Sample data, not your chart')
  assert.deepEqual(vedicCalculator.getPlanetaryPositions(chart), chart.placements)
  assert.deepEqual(vedicCalculator.getHousePlacements(chart), chart.houses)
  assert.equal(vedicCalculator.getAscendant(chart), 'Taurus')
  assert.equal(chart.moonNakshatra?.name, 'Rohini')
})

test('Western adapter returns only tropical fixture data through the contract', () => {
  const chart = westernCalculator.calculateChart()

  assert.equal(chart.system, 'western')
  assert.equal(chart.source, 'mock')
  assert.equal(chart.settings.zodiac, 'Tropical')
  assert.equal(chart.sampleLabel, 'Sample data, not your chart')
  assert.deepEqual(westernCalculator.getPlanetaryPositions(chart), chart.placements)
  assert.deepEqual(westernCalculator.getHousePlacements(chart), chart.houses)
  assert.equal(westernCalculator.getAscendant(chart), 'Leo')
  assert.equal(chart.aspects.length, 3)
})

test('system fixtures remain separate and contain all twelve houses', () => {
  const vedic = vedicCalculator.calculateChart()
  const western = westernCalculator.calculateChart()

  assert.notStrictEqual(vedic.placements, western.placements)
  assert.notStrictEqual(vedic.houses, western.houses)
  assert.deepEqual(vedic.houses.map(({ house }) => house), [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ])
  assert.deepEqual(western.houses.map(({ house }) => house), [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ])
})
