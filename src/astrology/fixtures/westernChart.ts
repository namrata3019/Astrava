import type { WesternChartData } from '../types.ts'

export const westernChartFixture: WesternChartData = {
  system: 'western',
  source: 'mock',
  sampleLabel: 'Sample data, not your chart',
  settings: {
    zodiac: 'Tropical',
    houseSystem: 'Whole Sign',
    nodeType: 'Mean node',
    aspectOrbs: 'Major aspects, 6° maximum',
  },
  ascendant: 'Leo',
  placements: [
    { planet: 'Sun', sign: 'Cancer', house: 12, retrograde: false },
    { planet: 'Moon', sign: 'Libra', house: 3, retrograde: false },
    { planet: 'Mercury', sign: 'Leo', house: 1, retrograde: false },
    { planet: 'Venus', sign: 'Gemini', house: 11, retrograde: false },
    { planet: 'Mars', sign: 'Taurus', house: 10, retrograde: false },
    { planet: 'Jupiter', sign: 'Sagittarius', house: 5, retrograde: false },
    { planet: 'Saturn', sign: 'Pisces', house: 8, retrograde: true },
    { planet: 'Uranus', sign: 'Capricorn', house: 6, retrograde: true },
    { planet: 'Neptune', sign: 'Capricorn', house: 6, retrograde: true },
    { planet: 'Pluto', sign: 'Scorpio', house: 4, retrograde: true },
  ],
  houses: [
    { house: 1, sign: 'Leo', planets: ['Mercury'] },
    { house: 2, sign: 'Virgo', planets: [] },
    { house: 3, sign: 'Libra', planets: ['Moon'] },
    { house: 4, sign: 'Scorpio', planets: ['Pluto'] },
    { house: 5, sign: 'Sagittarius', planets: ['Jupiter'] },
    { house: 6, sign: 'Capricorn', planets: ['Uranus', 'Neptune'] },
    { house: 7, sign: 'Aquarius', planets: [] },
    { house: 8, sign: 'Pisces', planets: ['Saturn'] },
    { house: 9, sign: 'Aries', planets: [] },
    { house: 10, sign: 'Taurus', planets: ['Mars'] },
    { house: 11, sign: 'Gemini', planets: ['Venus'] },
    { house: 12, sign: 'Cancer', planets: ['Sun'] },
  ],
  aspects: [
    { planets: ['Sun', 'Moon'], aspect: 'Square' },
    { planets: ['Venus', 'Jupiter'], aspect: 'Opposition' },
    { planets: ['Mercury', 'Mars'], aspect: 'Square' },
  ],
  elements: { Fire: 2, Earth: 1, Air: 2, Water: 2 },
  modalities: { Cardinal: 2, Fixed: 2, Mutable: 3 },
  accessibleSummary:
    'Illustrative Western tropical sample fixture using Whole Sign houses and major aspects with a six-degree maximum orb. Its sample ascendant is Leo. This data is not calculated from user details.',
}
