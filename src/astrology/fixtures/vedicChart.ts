import type { VedicChartData } from '../types.ts'

export const vedicChartFixture: VedicChartData = {
  system: 'vedic',
  source: 'mock',
  sampleLabel: 'Sample data, not your chart',
  settings: {
    zodiac: 'Sidereal',
    ayanamsha: 'Lahiri',
    houseSystem: 'Whole Sign',
    nodeType: 'Mean node',
  },
  ascendant: 'Taurus',
  placements: [
    { planet: 'Sun', sign: 'Taurus', house: 1, retrograde: false },
    {
      planet: 'Moon',
      sign: 'Taurus',
      house: 1,
      retrograde: false,
      nakshatra: 'Rohini',
      pada: 2,
    },
    { planet: 'Mercury', sign: 'Gemini', house: 2, retrograde: false },
    { planet: 'Venus', sign: 'Cancer', house: 3, retrograde: false },
    { planet: 'Mars', sign: 'Leo', house: 4, retrograde: false },
    { planet: 'Jupiter', sign: 'Pisces', house: 11, retrograde: false },
    { planet: 'Saturn', sign: 'Aquarius', house: 10, retrograde: true },
    { planet: 'Rahu', sign: 'Libra', house: 6, retrograde: true },
    { planet: 'Ketu', sign: 'Aries', house: 12, retrograde: true },
  ],
  houses: [
    { house: 1, sign: 'Taurus', planets: ['Sun', 'Moon'] },
    { house: 2, sign: 'Gemini', planets: ['Mercury'] },
    { house: 3, sign: 'Cancer', planets: ['Venus'] },
    { house: 4, sign: 'Leo', planets: ['Mars'] },
    { house: 5, sign: 'Virgo', planets: [] },
    { house: 6, sign: 'Libra', planets: ['Rahu'] },
    { house: 7, sign: 'Scorpio', planets: [] },
    { house: 8, sign: 'Sagittarius', planets: [] },
    { house: 9, sign: 'Capricorn', planets: [] },
    { house: 10, sign: 'Aquarius', planets: ['Saturn'] },
    { house: 11, sign: 'Pisces', planets: ['Jupiter'] },
    { house: 12, sign: 'Aries', planets: ['Ketu'] },
  ],
  moonNakshatra: { name: 'Rohini', pada: 2 },
  dasha: {
    mahaDasha: 'Moon',
    antarDasha: 'Jupiter',
    samplePeriod: 'Illustrative fixture period; no dates calculated.',
  },
  accessibleSummary:
    'Illustrative Vedic sidereal sample fixture using Lahiri ayanamsha and Whole Sign houses. Its sample ascendant is Taurus. The sample Moon is in Taurus, Rohini, pada 2. This data is not calculated from user details.',
}
