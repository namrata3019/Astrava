import { z } from 'zod'
import type { AstrologySystem } from '../../astrology/types.ts'
import { countries, timeZones } from './timezones.ts'

export type { AstrologySystem } from '../../astrology/types.ts'

const countryCodes = new Set(countries.map((country) => country.value))
const timeZoneByName = new Map(timeZones.map((timeZone) => [timeZone.name, timeZone]))
const systemSchema = z.enum(['vedic', 'western'], {
  error: 'Choose Vedic or Western astrology.',
})

const birthDetailsFields = {
  name: z.string().trim().max(80, 'Name must be 80 characters or fewer.'),
  birthDate: z.string().min(1, 'Enter your date of birth.'),
  birthTime: z.string(),
  unknownBirthTime: z.boolean(),
  city: z.string().trim().min(1, 'Enter your birth city.').max(120, 'City must be 120 characters or fewer.'),
  countryCode: z.string().min(1, 'Choose your birth country.'),
}

const birthDetailsBaseSchema = z.object(birthDetailsFields)

function validateBirthDetails(
  value: z.infer<typeof birthDetailsBaseSchema>,
  context: z.RefinementCtx,
) {
  if (value.birthDate) {
    const date = new Date(`${value.birthDate}T00:00:00.000Z`)
    const isValidDate =
      /^\d{4}-\d{2}-\d{2}$/.test(value.birthDate) &&
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === value.birthDate

    if (!isValidDate) {
      context.addIssue({
        code: 'custom',
        message: 'Enter a valid date.',
        path: ['birthDate'],
      })
    } else if (value.birthDate > new Date().toISOString().slice(0, 10)) {
      context.addIssue({
        code: 'custom',
        message: 'Date of birth cannot be in the future.',
        path: ['birthDate'],
      })
    }
  }

  if (!value.unknownBirthTime) {
    if (!value.birthTime) {
      context.addIssue({
        code: 'custom',
        message: 'Enter a birth time or choose “I don’t know my birth time.”',
        path: ['birthTime'],
      })
    } else if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value.birthTime)) {
      context.addIssue({
        code: 'custom',
        message: 'Enter a valid birth time.',
        path: ['birthTime'],
      })
    }
  }

  if (value.countryCode && !countryCodes.has(value.countryCode)) {
    context.addIssue({
      code: 'custom',
      message: 'Choose a country from the list.',
      path: ['countryCode'],
    })
  }
}

export const birthDetailsSchema = birthDetailsBaseSchema.superRefine(validateBirthDetails)

export const birthDetailsSubmissionSchema = z
  .object({
    ...birthDetailsFields,
    timezone: z.string().min(1, 'Choose the IANA timezone for your birth location.'),
    system: systemSchema,
  })
  .superRefine((value, context) => {
    validateBirthDetails(value, context)

    if (!value.timezone) return

    const timeZone = timeZoneByName.get(value.timezone)

    if (!timeZone || timeZone.countryCode !== value.countryCode) {
      context.addIssue({
        code: 'custom',
        message: 'Choose a timezone listed for your selected country.',
        path: ['timezone'],
      })
    }
  })

export type BirthDetailsFormValues = {
  name: string
  birthDate: string
  birthTime: string
  unknownBirthTime: boolean
  city: string
  countryCode: string
  timezone: string
  system: AstrologySystem | ''
}

export type BirthDetailsField = keyof BirthDetailsFormValues

export type BirthDetailsErrors = Partial<Record<BirthDetailsField, string>>

export type BirthDetailsFieldChange = <Field extends BirthDetailsField>(
  field: Field,
  value: BirthDetailsFormValues[Field],
) => void
