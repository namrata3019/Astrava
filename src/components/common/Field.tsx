import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'

type FieldCopyProps = {
  hint?: string
  label: string
}

type TextFieldProps = FieldCopyProps & {
  error?: string
  id: string
  inputProps?: InputHTMLAttributes<HTMLInputElement>
}

type SelectFieldProps = FieldCopyProps & {
  error?: string
  id: string
  options: Array<{ label: string; value: string }>
  selectProps?: SelectHTMLAttributes<HTMLSelectElement>
}

function FieldCopy({
  hint,
  label,
  id,
}: FieldCopyProps & { id: string }): ReactNode {
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <>
      <label className="mb-2 block min-h-5 text-sm font-semibold text-ink" htmlFor={id}>
        {label}
      </label>
      <span className="mb-2 block min-h-10 text-sm leading-5 text-ink/70" id={hintId}>
        {hint}
      </span>
    </>
  )
}

function FieldError({ error, id }: { error: string; id: string }) {
  return (
    <span
      className="mt-2 block text-sm font-medium text-red-800"
      id={id}
      role="alert"
    >
      {error}
    </span>
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
      <FieldCopy hint={hint} id={id} label={label} />
      <input
        className="min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 text-ink placeholder:text-ink/70"
        id={id}
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error)}
        {...inputProps}
      />
      {error && (
        <FieldError error={error} id={`${id}-error`} />
      )}
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
      <FieldCopy hint={hint} id={id} label={label} />
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
      {error && (
        <FieldError error={error} id={`${id}-error`} />
      )}
    </div>
  )
}
