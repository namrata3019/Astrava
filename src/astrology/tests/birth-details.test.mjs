import assert from 'node:assert/strict'
import test from 'node:test'
import { birthDetailsSubmissionSchema } from '../../features/birth-details/schema.ts'

const validBirthDetails = {
  name: '',
  birthDate: '2000-01-15',
  birthTime: '12:30',
  unknownBirthTime: false,
  city: 'New York',
  countryCode: 'US',
  timezone: 'America/New_York',
  system: 'western',
}

test('birth details accept an explicit system and matching IANA timezone', () => {
  const result = birthDetailsSubmissionSchema.safeParse(validBirthDetails)

  assert.equal(result.success, true)
})

test('unknown birth time is accepted without inferring a time', () => {
  const result = birthDetailsSubmissionSchema.safeParse({
    ...validBirthDetails,
    birthTime: '',
    unknownBirthTime: true,
    system: 'vedic',
  })

  assert.equal(result.success, true)
  if (result.success) assert.equal(result.data.birthTime, '')
})

test('future dates, mismatched timezones, and missing system choices are rejected', () => {
  const futureDateValue = new Date()
  futureDateValue.setUTCDate(futureDateValue.getUTCDate() + 1)

  const futureDate = birthDetailsSubmissionSchema.safeParse({
    ...validBirthDetails,
    birthDate: futureDateValue.toISOString().slice(0, 10),
  })
  const mismatchedTimezone = birthDetailsSubmissionSchema.safeParse({
    ...validBirthDetails,
    timezone: 'Europe/London',
  })
  const missingSystem = birthDetailsSubmissionSchema.safeParse({
    ...validBirthDetails,
    system: '',
  })

  assert.equal(futureDate.success, false)
  assert.equal(mismatchedTimezone.success, false)
  assert.equal(missingSystem.success, false)
})
