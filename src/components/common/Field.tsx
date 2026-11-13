import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'

type FieldCopyProps = {
  error?: string
  hint?: string
  label: string
}

type TextFieldProps = FieldCopyProps & {
  id: string
  inputProps?: InputHTMLAttributes<HTMLInputElement>
}

type SelectFieldProps = FieldCopyProps & {
  id: string
  options: Array<{ label: string; value: string }>
  selectProps?: SelectHTMLAttributes<HTMLSelectElement>
}

function FieldCopy({
  error,
  hint,
  label,
  id,
}: FieldCopyProps & { id: string }): ReactNode {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <>
      <label className="mb-2 block text-sm font-semibold text-ink" htmlFor={id}>
        {label}
      </label>
      {hint && (
        <span className="mb-2 block text-sm leading-5 text-ink/70" id={hintId}>
          {hint}
        </span>
      )}
      {error && (
        <span className="mt-2 block text-sm font-medium text-red-800" id={errorId}>
          {error}
        </span>
      )}
    </>
  )
}

export function TextField({
  error,
  hint,
  id,
  inputProps,
  label,
}: TextFieldProps) {
  const describedBy = [
    hint ? `${id}-hint` : undefined,
    error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div>
      <FieldCopy error={error} hint={hint} id={id} label={label} />
      <input
        className="min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 text-ink placeholder:text-ink/55"
        id={id}
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error)}
        {...inputProps}
      />
    </div>
  )
}

export function SelectField({
  error,
  hint,
  id,
  label,
  options,
  selectProps,
}: SelectFieldProps) {
  const describedBy = [
    hint ? `${id}-hint` : undefined,
    error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div>
      <FieldCopy error={error} hint={hint} id={id} label={label} />
      <select
        className="min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 text-ink"
        id={id}
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error)}
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
