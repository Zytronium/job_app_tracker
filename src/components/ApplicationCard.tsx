'use client'

import type { JobApplication } from '@/types'
import StatusBadge from './StatusBadge'

interface ApplicationCardProps {
  application: JobApplication
  onEdit: (app: JobApplication) => void
  onDelete: (id: string) => void
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatSalary(salary: string): string {
  // If it looks like a number, format it
  const clean = salary.replace(/[$,\s]/g, '')
  const num = parseFloat(clean)
  if (!isNaN(num) && num > 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num)
  }
  return salary
}

export default function ApplicationCard({ application, onEdit, onDelete }: ApplicationCardProps) {
  const {
    companyName,
    positionName,
    dateApplied,
    jobDescriptionSummary,
    salarySpecified,
    extraNotes,
    status,
  } = application

  return (
    <div
      className="app-card"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background:
            status === 'Offer'
              ? 'linear-gradient(90deg, #4CAF6E, transparent)'
              : status === 'Rejected'
              ? 'linear-gradient(90deg, #E05252, transparent)'
              : status === 'Interview'
              ? 'linear-gradient(90deg, #E8A930, transparent)'
              : 'transparent',
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            {companyName}
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              margin: 0,
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {positionName}
          </h3>
        </div>
        <StatusBadge status={status} size="sm" />
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {formatDate(dateApplied)}
          </span>
        </div>

        {salarySpecified && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--color-accent)',
                fontWeight: 500,
              }}
            >
              {formatSalary(salarySpecified)}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {jobDescriptionSummary && (
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {jobDescriptionSummary}
        </p>
      )}

      {/* Notes */}
      {extraNotes && (
        <div
          style={{
            background: 'var(--color-surface-elevated)',
            borderLeft: '2px solid var(--color-border)',
            borderRadius: '0 6px 6px 0',
            padding: '10px 12px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              lineHeight: 1.5,
              fontStyle: 'italic',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {extraNotes}
          </p>
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: 'auto',
          paddingTop: '4px',
          borderTop: '1px solid var(--color-border-subtle)',
        }}
      >
        <button
          onClick={() => onEdit(application)}
          style={{
            flex: 1,
            padding: '8px',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            color: 'var(--color-text-secondary)',
            fontSize: '12px',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--color-accent)'
            el.style.color = 'var(--color-accent)'
            el.style.background = 'var(--color-accent-glow)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--color-border)'
            el.style.color = 'var(--color-text-secondary)'
            el.style.background = 'transparent'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>
        <button
          onClick={() => {
            if (confirm(`Remove "${positionName}" at ${companyName}?`)) {
              onDelete(application.id)
            }
          }}
          style={{
            padding: '8px 12px',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            color: 'var(--color-text-muted)',
            fontSize: '12px',
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.borderColor = '#E05252'
            el.style.color = '#E05252'
            el.style.background = 'rgba(224, 82, 82, 0.08)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--color-border)'
            el.style.color = 'var(--color-text-muted)'
            el.style.background = 'transparent'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  )
}
