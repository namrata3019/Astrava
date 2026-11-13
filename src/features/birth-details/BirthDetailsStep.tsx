import { SelectField, TextField } from '../../components/common/Field'
import {
  type BirthDetailsErrors,
  type BirthDetailsFieldChange,
  type BirthDetailsFormValues,
} from './schema'
import { countries } from './timezones'

type BirthDetailsStepProps = {
  errors: BirthDetailsErrors
  onChange: BirthDetailsFieldChange
  onCountryChange: (countryCode: string) => void
  values: BirthDetailsFormValues
}

const countryOptions = [{ label: 'Choose a country', value: '' }, ...countries]

export function BirthDetailsStep({
  errors,
  onChange,
  onCountryChange,
  values,
}: BirthDetailsStepProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <TextField
          hint="Optional"
          id="name"
          inputProps={{
            autoComplete: 'name',
            maxLength: 80,
            onChange: (event) => onChange('name', event.target.value),
            value: values.name,
          }}
          label="Full name"
        />
      </div>
      <TextField
        error={errors.birthDate}
        id="birthDate"
        inputProps={{
          autoComplete: 'bday',
          max: new Date().toISOString().slice(0, 10),
          onChange: (event) => onChange('birthDate', event.target.value),
          required: true,
          type: 'date',
          value: values.birthDate,
        }}
        label="Date of birth"
      />
      <TextField
        error={errors.birthTime}
        hint="Use the local time recorded at birth."
        id="birthTime"
        inputProps={{
          disabled: values.unknownBirthTime,
          onChange: (event) => onChange('birthTime', event.target.value),
          required: !values.unknownBirthTime,
          step: 60,
          type: 'time',
          value: values.birthTime,
        }}
        label="Birth time"
      />
      <div className="sm:col-span-2">
        <label className="flex min-h-11 items-start gap-3 rounded-xl border border-soft-gray bg-white p-4 text-sm leading-6 text-ink">
          <input
            checked={values.unknownBirthTime}
            className="mt-1 size-4 accent-[#765522]"
            onChange={(event) => {
              const unknownBirthTime = event.target.checked
              onChange('unknownBirthTime', unknownBirthTime)
              if (unknownBirthTime) onChange('birthTime', '')
            }}
            type="checkbox"
          />
          <span>I don’t know my birth time</span>
        </label>
        {values.unknownBirthTime && (
          <p
            aria-live="polite"
            className="mt-3 rounded-xl border border-champagne/40 bg-champagne/10 p-4 text-sm leading-6 text-ink"
            role="status"
          >
            Without an exact time, Ascendant and house results may be
            unavailable or less reliable. This prototype will not infer a time
            or present those results as certain.
          </p>
        )}
      </div>
      <TextField
        error={errors.city}
        hint="Enter the city as it was known at the time of birth."
        id="city"
        inputProps={{
          autoComplete: 'address-level2',
          maxLength: 120,
          onChange: (event) => onChange('city', event.target.value),
          required: true,
          value: values.city,
        }}
        label="Birth city"
      />
      <SelectField
        error={errors.countryCode}
        id="countryCode"
        label="Birth country"
        options={countryOptions}
        selectProps={{
          autoComplete: 'country',
          onChange: (event) => onCountryChange(event.target.value),
          required: true,
          value: values.countryCode,
        }}
      />
    </div>
  )
}
