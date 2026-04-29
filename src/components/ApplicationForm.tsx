'use client'

import { useEffect, useRef, useState } from 'react'
import type { ApplicationStatus, EmploymentType, JobApplication, LocationType, PayType } from '@/types'

const STATUS_OPTIONS: ApplicationStatus[] = [
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
]

const PAY_TYPE_OPTIONS: PayType[] = ['Hourly', 'Salary', 'Commission', 'Other']
const EMPLOYMENT_TYPE_OPTIONS: EmploymentType[] = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Other']
const LOCATION_TYPE_OPTIONS: LocationType[] = ['On-Site', 'Hybrid', 'Remote', 'Other']
const JOB_MATCH_OPTIONS = [1, 2, 3, 4, 5] as const

interface FormData {
  companyName: string
  positionName: string
  dateApplied: string
  jobDescriptionSummary: string
  payRangeMin: string
  payRangeMax: string
  payType: PayType | ''
  employmentType: EmploymentType | ''
  locationType: LocationType | ''
  location: string
  duration: string
  benefits: string        // comma-separated for input
  jobTags: string         // comma-separated for input
  jobMatch: number | ''
  extraNotes: string
  status: ApplicationStatus
}

const emptyForm: FormData = {
  companyName: '',
  positionName: '',
  dateApplied: new Date().toISOString().split('T')[0],
  jobDescriptionSummary: '',
  payRangeMin: '',
  payRangeMax: '',
  payType: '',
  employmentType: '',
  locationType: '',
  location: '',
  duration: '',
  benefits: '',
  jobTags: '',
  jobMatch: '',
  extraNotes: '',
  status: 'Applied',
}

function appToForm(app: JobApplication): FormData {
  return {
    companyName: app.companyName,
    positionName: app.positionName,
    dateApplied: app.dateApplied,
    jobDescriptionSummary: app.jobDescriptionSummary ?? '',
    payRangeMin: app.payRange?.[0] != null ? String(app.payRange[0]) : '',
    payRangeMax: app.payRange?.[1] != null ? String(app.payRange[1]) : '',
    payType: app.payType ?? '',
    employmentType: app.employmentType ?? '',
    locationType: app.locationType ?? '',
    location: app.location ?? '',
    duration: app.duration ?? '',
    benefits: app.benefits?.join(', ') ?? '',
    jobTags: app.jobTags?.join(', ') ?? '',
    jobMatch: app.jobMatch ?? '',
    extraNotes: app.extraNotes ?? '',
    status: app.status,
  }
}

/** Parse form data back into the shape onSave expects */
export interface ApplicationFormOutput {
  companyName: string
  positionName: string
  dateApplied: string
  jobDescriptionSummary: string
  payRange?: number[]
  payType?: PayType
  employmentType?: EmploymentType
  locationType?: LocationType
  location?: string
  duration?: string
  benefits?: string[]
  jobTags?: string[]
  jobMatch?: number
  extraNotes: string
  status: ApplicationStatus
}

interface ApplicationFormProps {
  editing: JobApplication | null
  onSave: (data: ApplicationFormOutput) => void
  onClose: () => void
}

export default function ApplicationForm({ editing, onSave, onClose }: ApplicationFormProps) {
  const [form, setForm] = useState<FormData>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setForm(editing ? appToForm(editing) : emptyForm)
    setErrors({})
  }, [editing])

  useEffect(() => {
    // Focus first input when modal opens
    setTimeout(() => firstInputRef.current?.focus(), 50)
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!form.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!form.positionName.trim()) newErrors.positionName = 'Position name is required'
    if (!form.dateApplied) newErrors.dateApplied = 'Date applied is required'

    const min = form.payRangeMin !== '' ? parseFloat(form.payRangeMin) : NaN
    const max = form.payRangeMax !== '' ? parseFloat(form.payRangeMax) : NaN

    if (form.payRangeMin !== '' && (isNaN(min) || min < 0)) {
      newErrors.payRangeMin = 'Must be a positive number'
    }
    if (form.payRangeMax !== '' && (isNaN(max) || max < 0)) {
      newErrors.payRangeMax = 'Must be a positive number'
    }
    if (!isNaN(min) && !isNaN(max) && max < min) {
      newErrors.payRangeMax = 'Max must be ≥ min'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const min = form.payRangeMin !== '' ? parseFloat(form.payRangeMin) : NaN
    const max = form.payRangeMax !== '' ? parseFloat(form.payRangeMax) : NaN

    const payRange: number[] | undefined =
      !isNaN(min) && !isNaN(max) ? [min, max]
      : !isNaN(min) ? [min]
      : undefined

    const splitTrimmed = (s: string) =>
      s.split(',').map(v => v.trim()).filter(Boolean)

    onSave({
      companyName: form.companyName.trim(),
      positionName: form.positionName.trim(),
      dateApplied: form.dateApplied,
      jobDescriptionSummary: form.jobDescriptionSummary.trim(),
      payRange,
      payType: form.payType || undefined,
      employmentType: form.employmentType || undefined,
      locationType: form.locationType || undefined,
      location: form.location.trim() || undefined,
      duration: form.duration.trim() || undefined,
      benefits: form.benefits ? splitTrimmed(form.benefits) : undefined,
      jobTags: form.jobTags ? splitTrimmed(form.jobTags) : undefined,
      jobMatch: form.jobMatch !== '' ? Number(form.jobMatch) : undefined,
      extraNotes: form.extraNotes.trim(),
      status: form.status,
    })
  }

  function update<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const payTypeSuffix = form.payType === 'Hourly' ? '/ hr' : form.payType === 'Salary' ? '/ yr' : ''

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="modal-panel"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,169,48,0.06)',
        }}
      >
        {/* Modal header */}
        <div
          style={{
            padding: '24px 28px 20px',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: 'var(--color-surface)',
            borderRadius: '16px 16px 0 0',
            zIndex: 1,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {editing ? 'Edit Application' : 'New Application'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>
              {editing ? 'Update the details below' : 'Fields marked * are required'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Company + Position */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Company Name" required error={errors.companyName}>
                <input
                  ref={firstInputRef}
                  type="text"
                  className="form-input"
                  placeholder="e.g. Acme Corp"
                  value={form.companyName}
                  onChange={e => update('companyName', e.target.value)}
                />
              </Field>
              <Field label="Position" required error={errors.positionName}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Engineer"
                  value={form.positionName}
                  onChange={e => update('positionName', e.target.value)}
                />
              </Field>
            </div>

            {/* Date + Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Date Applied" required error={errors.dateApplied}>
                <input
                  type="date"
                  className="form-input"
                  style={{ colorScheme: 'dark' }}
                  value={form.dateApplied}
                  onChange={e => update('dateApplied', e.target.value)}
                />
              </Field>
              <Field label="Status">
                <select
                  className="form-input"
                  value={form.status}
                  onChange={e => update('status', e.target.value as ApplicationStatus)}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Pay Range */}
            <SectionLabel>Compensation</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '-8px' }}>
              <Field label={`Pay Min${payTypeSuffix ? ' (' + payTypeSuffix + ')' : ''}`} error={errors.payRangeMin}>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)', fontSize: '13px', pointerEvents: 'none',
                  }}>$</span>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    style={{ paddingLeft: '22px' }}
                    placeholder="80,000"
                    value={form.payRangeMin}
                    onChange={e => update('payRangeMin', e.target.value)}
                  />
                </div>
              </Field>
              <Field label={`Pay Max${payTypeSuffix ? ' (' + payTypeSuffix + ')' : ''}`} error={errors.payRangeMax}>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)', fontSize: '13px', pointerEvents: 'none',
                  }}>$</span>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    style={{ paddingLeft: '22px' }}
                    placeholder="110,000"
                    value={form.payRangeMax}
                    onChange={e => update('payRangeMax', e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Pay Type">
                <select
                  className="form-input"
                  value={form.payType}
                  onChange={e => update('payType', e.target.value as PayType | '')}
                >
                  <option value="">— Select —</option>
                  {PAY_TYPE_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Employment + Location */}
            <SectionLabel>Role Details</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '-8px' }}>
              <Field label="Employment Type">
                <select
                  className="form-input"
                  value={form.employmentType}
                  onChange={e => update('employmentType', e.target.value as EmploymentType | '')}
                >
                  <option value="">— Select —</option>
                  {EMPLOYMENT_TYPE_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Location Type">
                <select
                  className="form-input"
                  value={form.locationType}
                  onChange={e => update('locationType', e.target.value as LocationType | '')}
                >
                  <option value="">— Select —</option>
                  {LOCATION_TYPE_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Location">
              <input
                type="text"
                className="form-input"
                  placeholder="e.g. Tulsa, OK"
                  value={form.location}
                  onChange={e => update('location', e.target.value)}
              />
            </Field>
              <Field label="Duration">
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 6-month contract"
                  value={form.duration}
                  onChange={e => update('duration', e.target.value)}
                />
              </Field>
            </div>

            {/* Job Match */}
            <Field label="Job Match">
              <div style={{ display: 'flex', gap: '8px', paddingTop: '2px' }}>
                {JOB_MATCH_OPTIONS.map(n => {
                  const selected = form.jobMatch === n
                  const color = selected ? MATCH_COLORS[n] : 'var(--color-border)'
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => update('jobMatch', selected ? '' : n)}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        border: `1px solid ${color}`,
                        borderRadius: '6px',
                        background: selected ? `${color}1A` : 'transparent',
                        color: selected ? color : 'var(--color-text-muted)',
                        fontSize: '12px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: selected ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {n}
                    </button>
                  )
                })}
              </div>
              {form.jobMatch !== '' && (
                <span style={{ fontSize: '12px', color: MATCH_COLORS[form.jobMatch as number], marginTop: '4px' }}>
                  {MATCH_LABELS[form.jobMatch as number]}
                </span>
              )}
            </Field>

            {/* Tags + Benefits */}
            <SectionLabel>Tags & Benefits</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '-8px' }}>
              <Field label="Job Tags">
                <input
                  type="text"
                  className="form-input"
                  placeholder="python, web dev, databases"
                  value={form.jobTags}
                  onChange={e => update('jobTags', e.target.value)}
                />
              </Field>
              <Field label="Benefits">
                <input
                  type="text"
                  className="form-input"
                  placeholder="401k, health, PTO"
                  value={form.benefits}
                  onChange={e => update('benefits', e.target.value)}
                />
              </Field>
            </div>
            <p style={{ margin: '-12px 0 0', fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              Separate multiple values with commas
            </p>

            {/* Job Description */}
            <SectionLabel>Notes</SectionLabel>
            <Field label="Job Description Summary" error={undefined}>
              <textarea
                className="form-input"
                placeholder="Paste key responsibilities, requirements, or notes about the role..."
                value={form.jobDescriptionSummary}
                onChange={e => update('jobDescriptionSummary', e.target.value)}
                rows={4}
                style={{ marginTop: '-8px' }}
              />
            </Field>

            {/* Extra Notes */}
            <Field label="Extra Notes">
              <textarea
                className="form-input"
                placeholder="Recruiter contact, referral, next steps, anything else..."
                value={form.extraNotes}
                onChange={e => update('extraNotes', e.target.value)}
                rows={3}
              />
            </Field>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '11px',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-text-secondary)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  flex: 2,
                  padding: '11px',
                  background: 'var(--color-accent)',
                  border: '1px solid var(--color-accent)',
                  borderRadius: '8px',
                  color: '#0D0C0A',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.01em',
                }}
              >
                {editing ? 'Save Changes' : 'Add Application'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Helpers

const MATCH_LABELS: Record<number, string> = {
  1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Perfect',
}

const MATCH_COLORS: Record<number, string> = {
  1: '#E05252', 2: '#E07B2A', 3: '#E8A930', 4: '#6BBD8C', 5: '#63e1df',
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
        borderBottom: '1px solid var(--color-border-subtle)',
        paddingBottom: '8px',
        marginBottom: '-4px',
      }}
    >
      {children}
    </div>
  )
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        style={{
          fontSize: '12px',
          fontWeight: 500,
          color: error ? '#E05252' : 'var(--color-text-secondary)',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        {label}
        {required && <span style={{ color: 'var(--color-accent)' }}>*</span>}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: '12px', color: '#E05252' }}>{error}</span>
      )}
    </div>
  )
}
