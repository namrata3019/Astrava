import { SelectField } from '../../components/common/Field'
import {
  type AstrologySystem,
  type BirthDetailsErrors,
  type BirthDetailsFieldChange,
  type BirthDetailsFormValues,
} from './schema'
import {
  getTimeZoneLabel,
  getTimeZonesForCountry,
} from './timezones'

type MethodSelectionStepProps = {
  errors: BirthDetailsErrors
  onChange: BirthDetailsFieldChange
  values: BirthDetailsFormValues
}

const systemOptions: Array<{
  value: AstrologySystem
  title: string
  description: string
}> = [
  {
    value: 'vedic',
    title: 'Vedic astrology',
    description: 'Sidereal zodiac; settings such as Lahiri ayanamsha are stated explicitly.',
  },
  {
    value: 'western',
    title: 'Western astrology',
    description: 'Tropical zodiac; house system and aspect orbs are stated explicitly.',
  },
]

export function MethodSelectionStep({
  errors,
  onChange,
  values,
}: MethodSelectionStepProps) {
  const timezoneOptions = [
    { label: 'Choose a timezone', value: '' },
    ...getTimeZonesForCountry(values.countryCode).map((timeZone) => ({
      label: getTimeZoneLabel(timeZone),
      value: timeZone.name,
    })),
  ]

  return (
    <div className="space-y-7">
      <div>
        <SelectField
          error={errors.timezone}
          hint="Choose the IANA timezone that matches your birth location. The local list shows major cities; if your city is not listed, confirm the regional timezone."
          id="timezone"
          label="Birth timezone"
          options={timezoneOptions}
          selectProps={{
            onChange: (event) => onChange('timezone', event.target.value),
            required: true,
            value: values.timezone,
          }}
        />
        <p className="mt-3 text-xs leading-5 text-ink/65">
          Historical timezone and daylight-saving rules can differ from current
          rules. This prototype does not calculate historical offsets.
        </p>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-ink">
          Choose an astrology system
        </legend>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          Vedic uses a sidereal zodiac; Western uses a tropical zodiac. The
          prototype will not choose for you.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {systemOptions.map((option) => (
            <label
              className={`flex min-h-28 cursor-pointer gap-3 rounded-2xl border p-4 transition-colors ${values.system === option.value ? 'border-[#765522] bg-champagne/10' : 'border-soft-gray bg-white hover:border-[#b6a27d]'}`}
              key={option.value}
            >
              <input
                aria-describedby={errors.system ? 'system-error' : undefined}
                aria-invalid={Boolean(errors.system)}
                checked={values.system === option.value}
                className="mt-1 size-4 accent-[#765522]"
                id={`system-${option.value}`}
                name="system"
                onChange={() => onChange('system', option.value)}
                required
                type="radio"
                value={option.value}
              />
              <span>
                <span className="block text-sm font-semibold text-midnight">
                  {option.title}
                </span>
                <span className="mt-1 block text-sm leading-5 text-ink/70">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </div>
        {errors.system && (
          <p
            className="mt-2 text-sm font-medium text-red-800"
            id="system-error"
            role="alert"
          >
            {errors.system}
          </p>
        )}
      </fieldset>
    </div>
  )
}
