'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ApplicationStatus, JobApplication, SortDirection, SortField } from '@/types'
import type { ApplicationFormOutput } from '@/components/ApplicationForm'
import { generateId, loadApplications, saveApplications } from '@/lib/storage'
import ApplicationCard from '@/components/ApplicationCard'
import ApplicationForm from '@/components/ApplicationForm'
import StatsPanel from '@/components/StatsPanel'
import StatusBadge from '@/components/StatusBadge'

const ALL_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
]

export default function Home() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null)
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('dateApplied')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setApplications(loadApplications())
    setMounted(true)
  }, [])

  function handleSave(formData: ApplicationFormOutput) {
    const now = new Date().toISOString()
    let updated: JobApplication[]

    if (editingApp) {
      updated = applications.map(app =>
        app.id === editingApp.id
          ? {
              ...app,
              companyName: formData.companyName,
              positionName: formData.positionName,
              dateApplied: formData.dateApplied,
              status: formData.status,
              jobDescriptionSummary: formData.jobDescriptionSummary || undefined,
              payRange: formData.payRange,
              payType: formData.payType,
              employmentType: formData.employmentType,
              locationType: formData.locationType,
              location: formData.location,
              duration: formData.duration,
              benefits: formData.benefits,
              jobTags: formData.jobTags,
              jobMatch: formData.jobMatch,
              extraNotes: formData.extraNotes || undefined,
              updatedAt: now,
            }
          : app
      )
    } else {
      const newApp: JobApplication = {
        id: generateId(),
        companyName: formData.companyName,
        positionName: formData.positionName,
        dateApplied: formData.dateApplied,
        status: formData.status,
        jobDescriptionSummary: formData.jobDescriptionSummary || undefined,
        payRange: formData.payRange,
        payType: formData.payType,
        employmentType: formData.employmentType,
        locationType: formData.locationType,
        location: formData.location,
        duration: formData.duration,
        benefits: formData.benefits,
        jobTags: formData.jobTags,
        jobMatch: formData.jobMatch,
        extraNotes: formData.extraNotes || undefined,
        createdAt: now,
        updatedAt: now,
      }
      updated = [newApp, ...applications]
    }

    setApplications(updated)
    saveApplications(updated)
    setShowForm(false)
    setEditingApp(null)
  }

  function handleDelete(id: string) {
    const updated = applications.filter(a => a.id !== id)
    setApplications(updated)
    saveApplications(updated)
  }

  function handleEdit(app: JobApplication) {
    setEditingApp(app)
    setShowForm(true)
  }

  function handleAddNew() {
    setEditingApp(null)
    setShowForm(true)
  }

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const filtered = useMemo(() => {
    let result = [...applications]

    if (filterStatus !== 'All') {
      result = result.filter(a => a.status === filterStatus)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        a =>
          a.companyName.toLowerCase().includes(q) ||
          a.positionName.toLowerCase().includes(q) ||
          a.jobDescriptionSummary?.toLowerCase().includes(q) ||
          a.extraNotes?.toLowerCase().includes(q) ||
          a.jobTags?.some(tag => tag.toLowerCase().includes(q))
      )
    }

    result.sort((a, b) => {
      const valA: string = a[sortField] ?? ''
      const valB: string = b[sortField] ?? ''
      const cmp = valA.localeCompare(valB)
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [applications, filterStatus, searchQuery, sortField, sortDir])

  if (!mounted) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Subtle background texture */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232,169,48,0.06), transparent)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px 64px',
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: '40px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-accent)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Career Dashboard
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 5vw, 52px)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  margin: 0,
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                }}
              >
                Job Applications
              </h1>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: '15px',
                  color: 'var(--color-text-muted)',
                  fontWeight: 300,
                }}
              >
                Track your job search. Every application in one place.
              </p>
            </div>

            <button
              onClick={handleAddNew}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'var(--color-accent)',
                border: 'none',
                borderRadius: '10px',
                color: '#0D0C0A',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.01em',
                boxShadow: '0 0 0 1px rgba(232,169,48,0.3), 0 4px 16px rgba(232,169,48,0.2)',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Application
            </button>
          </div>

          {/* Stats */}
          {applications.length > 0 && (
            <div style={{ marginTop: '28px' }}>
              <StatsPanel applications={applications} />
            </div>
          )}
        </header>

        {/* Controls */}
        {applications.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {/* Search */}
            <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-text-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="form-input"
                placeholder="Search company, role, tags, notes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Sort:</span>
              {(['dateApplied', 'companyName', 'positionName'] as SortField[]).map(field => {
                const labels: Record<string, string> = { dateApplied: 'Date', companyName: 'Company', positionName: 'Role' }
                const active = sortField === field
                return (
                  <button
                    key={field}
                    onClick={() => toggleSort(field)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: `1px solid ${active ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      background: active ? 'var(--color-accent-glow)' : 'transparent',
                      color: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      fontSize: '12px',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {labels[field]}
                    {active && (
                      <span style={{ fontSize: '10px' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Status filter pills */}
        {applications.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {(['All', ...ALL_STATUSES] as const).map(status => {
              const count =
                status === 'All'
                  ? applications.length
                  : applications.filter(a => a.status === status).length
              if (status !== 'All' && count === 0) return null
              const active = filterStatus === status
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    border: `1px solid ${active ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: active ? 'var(--color-accent-glow)' : 'transparent',
                    color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    fontSize: '13px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: active ? 600 : 400,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {status}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      opacity: 0.7,
                    }}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Content */}
        {applications.length === 0 ? (
          <EmptyState onAdd={handleAddNew} />
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 24px',
              color: 'var(--color-text-muted)',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '16px', margin: 0 }}>No applications match your filters.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterStatus('All') }}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-accent)',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            className="card-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px',
            }}
          >
            {filtered.map(app => (
              <ApplicationCard
                key={app.id}
                application={app}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <ApplicationForm
          editing={editingApp}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingApp(null) }}
        />
      )}
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
        gap: '24px',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>

      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            margin: '0 0 8px',
          }}
        >
          No applications yet
        </h2>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '15px', maxWidth: '360px' }}>
          Start tracking your job search. Add your first application and keep everything organized.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={onAdd}
          style={{
            padding: '12px 28px',
            background: 'var(--color-accent)',
            border: 'none',
            borderRadius: '10px',
            color: '#0D0C0A',
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(232,169,48,0.25)',
          }}
        >
          Add Your First Application
        </button>

        {/* Example badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px', opacity: 0.6 }}>
          {(['Applied', 'Interview', 'Offer', 'Rejected'] as ApplicationStatus[]).map(s => (
            <StatusBadge key={s} status={s} size="sm" />
          ))}
        </div>
      </div>
    </div>
  )
}
