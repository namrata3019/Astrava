import { getTimeZones, type TimeZone } from '@vvo/tzdb'

export const timeZones = getTimeZones()

export const countries = Array.from(
  new Map(
    timeZones.map(({ countryCode, countryName }) => [
      countryCode,
      { label: countryName, value: countryCode },
    ]),
  ).values(),
).sort((first, second) => first.label.localeCompare(second.label))

export function getTimeZonesForCountry(countryCode: string): TimeZone[] {
  return timeZones.filter((timeZone) => timeZone.countryCode === countryCode)
}

export function getTimeZoneLabel(timeZone: TimeZone): string {
  const cities = timeZone.mainCities.slice(0, 3).join(', ')
  const location = cities ? ` — ${cities}` : ''

  return `${timeZone.alternativeName}${location} (${timeZone.name})`
}
