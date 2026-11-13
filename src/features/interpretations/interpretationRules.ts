import type { AstrologySystem, PlanetName } from '../../astrology/types'
import type { ChartInterpretation } from './schema'

export type InterpretationSectionId =
  ChartInterpretation['sections'][number]['id']

type InterpretationRule = {
  id: InterpretationSectionId
  title: string
  planet: PlanetName
  planetTheme: string
  reflectionPrompt: string
}

type SystemRules = Record<AstrologySystem, InterpretationRule[]>

export const interpretationRules: SystemRules = {
  vedic: [
    {
      id: 'personality',
      title: 'Personality and inner nature',
      planet: 'Sun',
      planetTheme: 'vitality and self-expression',
      reflectionPrompt: 'What helps you express what matters to you?',
    },
    {
      id: 'emotional-patterns',
      title: 'Emotional patterns',
      planet: 'Moon',
      planetTheme: 'emotional rhythms and felt needs',
      reflectionPrompt: 'What helps you feel grounded when things change?',
    },
    {
      id: 'communication',
      title: 'Communication style',
      planet: 'Mercury',
      planetTheme: 'learning, observation, and communication',
      reflectionPrompt: 'Which ways of learning or communicating feel most natural?',
    },
    {
      id: 'strengths',
      title: 'Strengths to notice',
      planet: 'Jupiter',
      planetTheme: 'meaning-making, learning, and perspective',
      reflectionPrompt: 'Where do you enjoy sharing knowledge or perspective?',
    },
    {
      id: 'challenges',
      title: 'Challenges to reflect on',
      planet: 'Rahu',
      planetTheme: 'ambition and attention',
      reflectionPrompt: 'Where could pausing before acting help you choose deliberately?',
    },
    {
      id: 'career',
      title: 'Career tendencies',
      planet: 'Saturn',
      planetTheme: 'responsibility, structure, and sustained effort',
      reflectionPrompt: 'What kind of steady effort feels worthwhile to you?',
    },
    {
      id: 'relationships',
      title: 'Relationship patterns',
      planet: 'Venus',
      planetTheme: 'connection, affection, and harmony',
      reflectionPrompt: 'What helps you feel valued and connected?',
    },
    {
      id: 'self-development',
      title: 'Areas for self-development',
      planet: 'Mars',
      planetTheme: 'initiative, energy, and assertion',
      reflectionPrompt: 'Where would a small, intentional next step help?',
    },
  ],
  western: [
    {
      id: 'personality',
      title: 'Personality and inner nature',
      planet: 'Sun',
      planetTheme: 'identity, vitality, and self-expression',
      reflectionPrompt: 'What helps you express what matters to you?',
    },
    {
      id: 'emotional-patterns',
      title: 'Emotional patterns',
      planet: 'Moon',
      planetTheme: 'emotional needs and instinctive responses',
      reflectionPrompt: 'What helps you feel grounded when things change?',
    },
    {
      id: 'communication',
      title: 'Communication style',
      planet: 'Mercury',
      planetTheme: 'thinking, learning, and communication',
      reflectionPrompt: 'Which ways of learning or communicating feel most natural?',
    },
    {
      id: 'strengths',
      title: 'Strengths to notice',
      planet: 'Jupiter',
      planetTheme: 'growth, meaning, and perspective',
      reflectionPrompt: 'Where do you enjoy sharing knowledge or perspective?',
    },
    {
      id: 'challenges',
      title: 'Challenges to reflect on',
      planet: 'Saturn',
      planetTheme: 'boundaries, responsibility, and patience',
      reflectionPrompt: 'Where could patience or a clearer boundary support you?',
    },
    {
      id: 'career',
      title: 'Career tendencies',
      planet: 'Mars',
      planetTheme: 'motivation, initiative, and action',
      reflectionPrompt: 'What kind of work helps you direct your energy?',
    },
    {
      id: 'relationships',
      title: 'Relationship patterns',
      planet: 'Venus',
      planetTheme: 'connection, affection, and shared values',
      reflectionPrompt: 'What helps you feel valued and connected?',
    },
    {
      id: 'self-development',
      title: 'Areas for self-development',
      planet: 'Saturn',
      planetTheme: 'responsibility, limits, and long-term growth',
      reflectionPrompt: 'What would progress look like if you gave it time?',
    },
  ],
}
