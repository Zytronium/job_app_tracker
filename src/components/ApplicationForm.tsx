'use client'

import { useEffect, useRef, useState } from 'react'
import type { ApplicationStatus, JobApplication } from '@/types'

const STATUS_OPTIONS: ApplicationStatus[] = [
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
]

interface FormData {
  companyName: string
  positionName: string
  dateApplied: string
  jobDescriptionSummary: string
  salarySpecified: string
  extraNotes: string
  status: ApplicationStatus
}

const emptyForm: FormData = {
  companyName: '',
  positionName: '',
  dateApplied: new Date().toISOString().split('T')[0],
  jobDescriptionSummary: '',
  salarySpecified: '',
  extraNotes: '',
  status: 'Applied',
}

interface ApplicationFormProps {
  editing: JobApplication | null
  onSave: (data: FormData) => void
  onClose: () => void
}

export default function ApplicationForm({ editing, onSave, onClose }: ApplicationFormProps) {
  const [form, setForm] = useState<FormData>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      setForm({
        companyName: editing.companyName,
        positionName: editing.positionName,
        dateApplied: editing.dateApplied,
        jobDescriptionSummary: editing.jobDescriptionSummary ?? '',
        salarySpecified: editing.salarySpecified ?? '',
        extraNotes: editing.extraNotes ?? '',
        status: editing.status,
      })
    } else {
      setForm(emptyForm)
    }
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
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) {
      onSave(form)
    }
  }

  function update(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

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
          maxWidth: '560px',
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

            {/* Company + Position row */}
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

            {/* Date + Status row */}
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

            {/* Salary */}
            <Field label="Salary Specified">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. $120,000 or $90k–$110k / year"
                value={form.salarySpecified}
                onChange={e => update('salarySpecified', e.target.value)}
              />
            </Field>

            {/* Job Description */}
            <Field label="Job Description Summary">
              <textarea
                className="form-input"
                placeholder="Paste key responsibilities, requirements, or notes about the role..."
                value={form.jobDescriptionSummary}
                onChange={e => update('jobDescriptionSummary', e.target.value)}
                rows={4}
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
