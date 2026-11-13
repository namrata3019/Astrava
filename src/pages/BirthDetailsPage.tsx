import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import type { BirthDetails } from '../astrology/types'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Footer } from '../components/navigation/Footer'
import { Navigation } from '../components/navigation/Navigation'
import { BirthDetailsStep } from '../features/birth-details/BirthDetailsStep'
import { MethodSelectionStep } from '../features/birth-details/MethodSelectionStep'
import {
  type AstrologySystem,
  type BirthDetailsErrors,
  type BirthDetailsField,
  type BirthDetailsFormValues,
  birthDetailsSchema,
  birthDetailsSubmissionSchema,
} from '../features/birth-details/schema'
import { createSampleChartResult } from '../features/birth-details/mockResult'
import { useVault } from '../features/vault/VaultProvider'

const initialValues: BirthDetailsFormValues = {
  name: '',
  birthDate: '',
  birthTime: '',
  unknownBirthTime: false,
  city: '',
  countryCode: '',
  timezone: '',
  system: '',
}

const fieldNames: BirthDetailsField[] = [
  'name',
  'birthDate',
  'birthTime',
  'unknownBirthTime',
  'city',
  'countryCode',
  'timezone',
  'system',
]

function getFieldErrors(issues: z.ZodIssue[]): BirthDetailsErrors {
  const errors: BirthDetailsErrors = {}

  for (const issue of issues) {
    const field = fieldNames.find((name) => name === issue.path[0])

    if (field && !errors[field]) errors[field] = issue.message
  }

  return errors
}

function focusFirstError(errors: BirthDetailsErrors) {
  const firstField = fieldNames.find((field) => errors[field])

  if (!firstField) return

  const elementId = firstField === 'system' ? 'system-vedic' : firstField
  document.getElementById(elementId)?.focus()
}

export default function BirthDetailsPage() {
  const navigate = useNavigate()
  const vault = useVault()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<BirthDetailsErrors>({})
  const [step, setStep] = useState<1 | 2>(1)
  const [sampleSystem, setSampleSystem] = useState<AstrologySystem | null>(null)
  const [saveEncrypted, setSaveEncrypted] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [saveBusy, setSaveBusy] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (vault.status !== 'unlocked' || profileLoaded) return

    const savedProfile = vault.contents?.birthDetails
    if (savedProfile) {
      setValues({
        name: savedProfile.name ?? '',
        birthDate: savedProfile.birthDate,
        birthTime: savedProfile.birthTime ?? '',
        unknownBirthTime: savedProfile.unknownBirthTime,
        city: savedProfile.city,
        countryCode: savedProfile.countryCode,
        timezone: savedProfile.timezone,
        system: savedProfile.system,
      })
      setSaveEncrypted(true)
    }

    setProfileLoaded(true)
  }, [profileLoaded, vault.contents, vault.status])

  function updateField<Field extends BirthDetailsField>(
    field: Field,
    value: BirthDetailsFormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleCountryChange(countryCode: string) {
    setValues((current) => ({ ...current, countryCode, timezone: '' }))
    setErrors((current) => ({
      ...current,
      countryCode: undefined,
      timezone: undefined,
    }))
  }

  function continueToMethodSelection() {
    const result = birthDetailsSchema.safeParse(values)

    if (!result.success) {
      const nextErrors = getFieldErrors(result.error.issues)
      setErrors(nextErrors)
      focusFirstError(nextErrors)
      return
    }

    setErrors({})
    setStep(2)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaveError('')
    const result = birthDetailsSubmissionSchema.safeParse(values)

    if (!result.success) {
      const nextErrors = getFieldErrors(result.error.issues)
      setErrors(nextErrors)
      focusFirstError(nextErrors)
      return
    }

    if (saveEncrypted) {
      const birthDetails: BirthDetails = {
        name: result.data.name || undefined,
        birthDate: result.data.birthDate,
        birthTime: result.data.unknownBirthTime ? null : result.data.birthTime,
        unknownBirthTime: result.data.unknownBirthTime,
        city: result.data.city,
        countryCode: result.data.countryCode,
        timezone: result.data.timezone,
        system: result.data.system,
      }

      if (vault.status === 'unlocked' && vault.contents) {
        setSaveBusy(true)
        try {
          await vault.saveContents({
            ...vault.contents,
            birthDetails,
          })
          navigate('/account')
        } catch (requestError: unknown) {
          setSaveError(
            requestError instanceof Error
              ? requestError.message
              : 'Your encrypted profile could not be saved. Try again.',
          )
        } finally {
          setSaveBusy(false)
        }
        return
      }

      vault.setPendingBirthDetails(birthDetails)
      navigate('/account?flow=register')
      return
    }

    vault.setPendingBirthDetails(null)
    setSampleSystem(result.data.system)
    setValues(initialValues)
    setErrors({})
  }

  function startOver() {
    setValues(initialValues)
    setErrors({})
    setStep(1)
    setSampleSystem(null)
    setSaveEncrypted(false)
    vault.setPendingBirthDetails(null)
  }

  const sampleResult = sampleSystem ? createSampleChartResult(sampleSystem) : null

  return (
    <div className="min-h-screen bg-ivory">
      <a
        className="sr-only z-50 rounded-full bg-champagne px-4 py-2 text-midnight focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Skip to content
      </a>
      <Navigation />
      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16" id="main-content">
        <div className="mx-auto max-w-3xl">
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-ink hover:text-[#765522]"
            to="/"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back to overview
          </Link>

          <div className="mt-8">
            <Badge>Sample preview · account saving is optional</Badge>
            <h1 className="mt-4 font-display text-4xl leading-tight text-midnight sm:text-5xl">
              Explore your birth chart
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/75">
              Share only what is needed. The sample preview stays on this page;
              if you choose encrypted saving, we will ask you to create or sign
              in to an account before sending an encrypted vault to the API.
            </p>
          </div>

          {sampleResult ? (
            <Card as="section" aria-labelledby="sample-result-title" className="mt-10 p-6 sm:p-8">
              <Badge>{sampleResult.label}</Badge>
              <h2
                className="mt-5 font-display text-3xl text-midnight"
                id="sample-result-title"
              >
                Sample preview
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink/75">{sampleResult.summary}</p>
              <p className="mt-5 text-sm font-semibold text-ink">
                Selected system: {sampleResult.system === 'vedic' ? 'Vedic' : 'Western'}
              </p>
              <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-6 text-ink/75">
                {sampleResult.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-champagne bg-champagne px-5 py-2.5 text-sm font-semibold text-midnight hover:border-[#d2b37e] hover:bg-[#d2b37e]"
                  to={`/chart?system=${sampleSystem}`}
                >
                  View sample dashboard <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Button onClick={startOver} type="button" variant="quiet">
                  Start again
                </Button>
              </div>
            </Card>
          ) : (
            <Card as="section" aria-labelledby="form-title" className="mt-10 p-6 sm:p-8">
              <div aria-label={`Step ${step} of 2`} className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#765522]">
                  Step {step} of 2
                </p>
                <div
                  aria-hidden="true"
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-soft-gray"
                >
                  <div
                    className={`h-full rounded-full bg-champagne transition-all ${step === 1 ? 'w-1/2' : 'w-full'}`}
                  />
                </div>
              </div>

              <h2
                aria-live="polite"
                className="font-display text-3xl text-midnight"
                id="form-title"
              >
                {step === 1 ? 'Your birth details' : 'Timezone and astrology system'}
              </h2>

              <form
                className="mt-7"
                noValidate
                onSubmit={step === 1 ? (event) => {
                  event.preventDefault()
                  continueToMethodSelection()
                } : handleSubmit}
              >
                {step === 1 ? (
                  <BirthDetailsStep
                    errors={errors}
                    onChange={updateField}
                    onCountryChange={handleCountryChange}
                    values={values}
                  />
                ) : (
                  <MethodSelectionStep
                    errors={errors}
                    onChange={updateField}
                    values={values}
                  />
                )}

                {step === 2 && (
                  <label className="mt-7 flex min-h-11 items-start gap-3 rounded-xl border border-soft-gray bg-white p-4 text-sm leading-6 text-ink">
                    <input
                      checked={saveEncrypted}
                      className="mt-1 size-4 accent-[#765522]"
                      onChange={(event) => setSaveEncrypted(event.target.checked)}
                      type="checkbox"
                    />
                    <span>
                      <strong className="block">Save birth details encrypted to my account</strong>
                      <span className="mt-1 block text-ink/70">
                        Your browser encrypts them before they are sent. You
                        will need an account and a separate vault passphrase to
                        return to this profile.
                      </span>
                    </span>
                  </label>
                )}

                {saveError && (
                  <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-900" role="alert">
                    {saveError}
                  </p>
                )}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-soft-gray pt-6 sm:flex-row sm:justify-between">
                  {step === 1 ? (
                    <span className="text-xs leading-5 text-ink/65">
                      Name is optional. Other fields are required unless birth
                      time is marked unknown.
                    </span>
                  ) : (
                    <Button
                      onClick={() => {
                        setErrors({})
                        setStep(1)
                      }}
                      type="button"
                      variant="quiet"
                    >
                      <ArrowLeft aria-hidden="true" size={16} />
                      Back
                    </Button>
                  )}
                  <Button
                    className="sm:min-w-48"
                    disabled={saveBusy}
                    type={step === 1 ? 'button' : 'submit'}
                    onClick={step === 1 ? continueToMethodSelection : undefined}
                  >
                    {step === 1 ? (
                      <>
                        Continue <ArrowRight aria-hidden="true" size={16} />
                      </>
                    ) : (
                      saveBusy
                        ? 'Saving encrypted profile…'
                        : saveEncrypted
                          ? 'Continue to encrypted account'
                          : 'Show sample preview'
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 flex gap-3 rounded-2xl bg-midnight/[0.04] p-4">
                <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-[#765522]" size={18} />
                <p className="text-xs leading-5 text-ink/70">
                  The sample path sends and stores no birth details. If you
                  explicitly choose account saving, the browser encrypts the
                  vault first; the self-hosted API receives ciphertext only.
                  The timezone list is bundled locally and makes no lookup
                  request.
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
