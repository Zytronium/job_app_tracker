'use client'

import { useState } from 'react'
import type { JobApplication, PayType } from '@/types'
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

function formatCurrency(num: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num)
  }

function formatPayRange(payRange?: number[], payType?: PayType): string | null {
  if (!payRange || payRange.length === 0) return null

  const suffix =
    payType === 'Hourly' ? ' / hr'
    : payType === 'Salary' ? ' / yr'
    : ''

  if (payRange.length === 1 || payRange[0] === payRange[1]) {
    return `${formatCurrency(payRange[0])}${suffix}`
  }
  return `${formatCurrency(payRange[0])} – ${formatCurrency(payRange[1])}${suffix}`
}

const MATCH_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Perfect',
}

const MATCH_COLORS: Record<number, string> = {
  1: '#E05252',
  2: '#E07B2A',
  3: '#E8A930',
  4: '#6BBD8C',
  5: '#63e1df',
}

export default function ApplicationCard({ application, onEdit, onDelete }: ApplicationCardProps) {
  const [expanded, setExpanded] = useState(false)

  const {
    companyName,
    positionName,
    dateApplied,
    jobDescriptionSummary,
    payRange,
    payType,
    extraNotes,
    status,
    location,
    locationType,
    employmentType,
    duration,
    benefits,
    jobTags,
    jobMatch,
  } = application

  const formattedPay = formatPayRange(payRange, payType)

  const hasExpandableContent =
    location || locationType || employmentType || duration ||
    (benefits && benefits.length > 0) || (jobTags && jobTags.length > 0) || jobMatch

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
        transition: 'border-color 0.2s ease',
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
        {/* Date */}
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

        {/* Pay */}
        {formattedPay && (
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
              {formattedPay}
            </span>
          </div>
        )}

        {/* Employment type */}
        {employmentType && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              {employmentType}
            </span>
          </div>
        )}

        {/* Location */}
        {(location || locationType) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              {[location, locationType].filter(Boolean).join(' · ')}
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

      {/* Tags */}
      {jobTags && jobTags.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {jobTags.map(tag => (
            <span
              key={tag}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                background: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: '4px',
                padding: '2px 7px',
                letterSpacing: '0.03em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Expanded section */}
      {expanded && hasExpandableContent && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingTop: '4px',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          {/* Job Match */}
          {jobMatch && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Job Match
              </span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <div
                    key={n}
                    style={{
                      width: '20px',
                      height: '4px',
                      borderRadius: '2px',
                      background: n <= jobMatch ? MATCH_COLORS[jobMatch] : 'var(--color-border)',
                      transition: 'background 0.2s',
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '12px', color: MATCH_COLORS[jobMatch], fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                {MATCH_LABELS[jobMatch]}
              </span>
            </div>
          )}

          {/* Duration */}
          {duration && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
                Duration
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{duration}</span>
            </div>
          )}

          {/* Benefits */}
          {benefits && benefits.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0, paddingTop: '2px' }}>
                Benefits
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {benefits.map(b => (
                  <span
                    key={b}
                    style={{
                      fontSize: '11px',
                      color: '#4CAF6E',
                      background: 'rgba(76, 175, 110, 0.1)',
                      border: '1px solid rgba(76, 175, 110, 0.25)',
                      borderRadius: '4px',
                      padding: '2px 7px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
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
              WebkitLineClamp: expanded ? undefined : 2,
              WebkitBoxOrient: 'vertical',
              overflow: expanded ? 'visible' : 'hidden',
            }}
          >
            {extraNotes}
          </p>
        </div>
      )}

      {/* Show more / Collapse */}
      {hasExpandableContent && (
        <button
          onClick={() => setExpanded(prev => !prev)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--color-text-muted)',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.04em',
            marginTop: '-4px',
            width: 'fit-content',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-accent)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          {expanded ? 'collapse' : 'show more'}
        </button>
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
