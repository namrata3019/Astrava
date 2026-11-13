import { z } from 'zod'

const planetSchema = z.enum([
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Rahu',
  'Ketu',
  'Uranus',
  'Neptune',
  'Pluto',
])

const housePlacementSchema = z.object({
  house: z.number().int().min(1).max(12),
  sign: z.string().min(1),
  planets: z.array(planetSchema),
}).strict()

const mockChartBase = {
  source: z.literal('mock'),
  sampleLabel: z.literal('Sample data, not your chart'),
  ascendant: z.string().nullable(),
  houses: z.array(housePlacementSchema),
  accessibleSummary: z.string().min(1),
}

const vedicChartSchema = z.object({
  ...mockChartBase,
  system: z.literal('vedic'),
  settings: z.object({
    zodiac: z.literal('Sidereal'),
    ayanamsha: z.literal('Lahiri'),
    houseSystem: z.literal('Whole Sign'),
    nodeType: z.literal('Mean node'),
  }).strict(),
  placements: z.array(z.object({
    planet: planetSchema,
    sign: z.string().min(1),
    house: z.number().int().min(1).max(12),
    retrograde: z.boolean(),
    nakshatra: z.string().min(1).optional(),
    pada: z.number().int().min(1).max(4).optional(),
  }).strict()),
  moonNakshatra: z.object({
    name: z.string().min(1),
    pada: z.number().int().min(1).max(4),
  }).strict().nullable(),
  dasha: z.object({
    mahaDasha: planetSchema,
    antarDasha: planetSchema,
    samplePeriod: z.string().min(1),
  }).strict().nullable(),
}).strict()

const westernChartSchema = z.object({
  ...mockChartBase,
  system: z.literal('western'),
  settings: z.object({
    zodiac: z.literal('Tropical'),
    houseSystem: z.literal('Whole Sign'),
    nodeType: z.literal('Mean node'),
    aspectOrbs: z.literal('Major aspects, 6° maximum'),
  }).strict(),
  placements: z.array(z.object({
    planet: planetSchema,
    sign: z.string().min(1),
    house: z.number().int().min(1).max(12),
    retrograde: z.boolean(),
  }).strict()),
  aspects: z.array(z.object({
    planets: z.tuple([planetSchema, planetSchema]),
    aspect: z.enum([
      'Conjunction',
      'Sextile',
      'Square',
      'Trine',
      'Opposition',
    ]),
  }).strict()),
  elements: z.object({
    Fire: z.number().nonnegative(),
    Earth: z.number().nonnegative(),
    Air: z.number().nonnegative(),
    Water: z.number().nonnegative(),
  }).strict(),
  modalities: z.object({
    Cardinal: z.number().nonnegative(),
    Fixed: z.number().nonnegative(),
    Mutable: z.number().nonnegative(),
  }).strict(),
}).strict()

export const chartDataSchema = z.discriminatedUnion('system', [
  vedicChartSchema,
  westernChartSchema,
])

const evidenceSchema = z.object({
  type: z.literal('placement'),
  planet: planetSchema,
  sign: z.string().min(1),
  house: z.number().int().min(1).max(12),
  detail: z.string().min(1),
}).strict()

const interpretationSectionSchema = z.object({
  id: z.enum([
    'personality',
    'emotional-patterns',
    'communication',
    'strengths',
    'challenges',
    'career',
    'relationships',
    'self-development',
  ]),
  title: z.string().min(1),
  summary: z.string().min(1),
  reflectionQuestion: z.string().min(1),
  evidence: z.array(evidenceSchema),
}).strict()

export const chartInterpretationSchema = z.object({
  system: z.enum(['vedic', 'western']),
  source: z.literal('mock'),
  sampleLabel: z.literal('Sample interpretation, not a personal reading'),
  sections: z.array(interpretationSectionSchema).length(8),
  disclaimer: z.literal(
    'For self-reflection and entertainment only; not professional, medical, legal, or financial advice.',
  ),
}).strict()

export type ChartInterpretation = z.infer<typeof chartInterpretationSchema>
