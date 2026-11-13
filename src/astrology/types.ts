export type AstrologySystem = 'vedic' | 'western'
export type BirthDetails = {
  name?: string
  birthDate: string
  birthTime: string | null
  unknownBirthTime: boolean
  city: string
  countryCode: string
  timezone: string
  system: AstrologySystem
}

export type PlanetName =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Rahu'
  | 'Ketu'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto'

export type VedicCalculationSettings = {
  zodiac: 'Sidereal'
  ayanamsha: 'Lahiri'
  houseSystem: 'Whole Sign'
  nodeType: 'Mean node'
}

export type WesternCalculationSettings = {
  zodiac: 'Tropical'
  houseSystem: 'Whole Sign'
  nodeType: 'Mean node'
  aspectOrbs: 'Major aspects, 6° maximum'
}

export type CalculationSettings =
  | VedicCalculationSettings
  | WesternCalculationSettings

export type HousePlacement = {
  house: number
  sign: string
  planets: PlanetName[]
}

export type VedicPlanetaryPosition = {
  planet: PlanetName
  sign: string
  house: number
  retrograde: boolean
  nakshatra?: string
  pada?: number
}

export type WesternPlanetaryPosition = {
  planet: PlanetName
  sign: string
  house: number
  retrograde: boolean
}

export type PlanetaryPosition =
  | VedicPlanetaryPosition
  | WesternPlanetaryPosition

type MockChartBase<
  System extends AstrologySystem,
  Settings extends CalculationSettings,
> = {
  system: System
  source: 'mock'
  sampleLabel: 'Sample data, not your chart'
  settings: Settings
  ascendant: string | null
  placements: System extends 'vedic'
    ? VedicPlanetaryPosition[]
    : WesternPlanetaryPosition[]
  houses: HousePlacement[]
  accessibleSummary: string
}

export type VedicChartData = MockChartBase<'vedic', VedicCalculationSettings> & {
  moonNakshatra: {
    name: string
    pada: number
  } | null
  dasha: {
    mahaDasha: PlanetName
    antarDasha: PlanetName
    samplePeriod: string
  } | null
}

export type ElementName = 'Fire' | 'Earth' | 'Air' | 'Water'
export type ModalityName = 'Cardinal' | 'Fixed' | 'Mutable'

export type WesternChartData = MockChartBase<
  'western',
  WesternCalculationSettings
> & {
  aspects: Array<{
    planets: [PlanetName, PlanetName]
    aspect: 'Conjunction' | 'Sextile' | 'Square' | 'Trine' | 'Opposition'
  }>
  elements: Record<ElementName, number>
  modalities: Record<ModalityName, number>
}

export type ChartData = VedicChartData | WesternChartData

export type ChartFor<System extends AstrologySystem> = Extract<
  ChartData,
  { system: System }
>

export interface AstrologyCalculator<System extends AstrologySystem> {
  calculateChart(): ChartFor<System>
  getPlanetaryPositions(chart: ChartFor<System>): ChartFor<System>['placements']
  getAscendant(chart: ChartFor<System>): string | null
  getHousePlacements(chart: ChartFor<System>): HousePlacement[]
}
