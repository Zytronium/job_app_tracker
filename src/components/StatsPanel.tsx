import type { ApplicationStatus, JobApplication } from '@/types'

const STAT_CONFIGS: Array<{ label: string; status?: ApplicationStatus; color: string }> = [
  { label: 'Total', color: 'var(--color-text-secondary)' },
  { label: 'Active', status: 'Applied', color: '#4A90D9' },
  { label: 'Interviews', status: 'Interview', color: '#E8A930' },
  { label: 'Offers', status: 'Offer', color: '#4CAF6E' },
  { label: 'Rejected', status: 'Rejected', color: '#E05252' },
]

export default function StatsPanel({ applications }: { applications: JobApplication[] }) {
  const counts = {
    Total: applications.length,
    Active: applications.filter(a => a.status === 'Applied' || a.status === 'Phone Screen').length,
    Interviews: applications.filter(a => a.status === 'Interview').length,
    Offers: applications.filter(a => a.status === 'Offer').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  }

  const responseRate =
    applications.length > 0
      ? Math.round(
          ((counts.Interviews + counts.Offers) / applications.length) * 100
        )
      : 0

  return (
    <div
      style={{
        display: 'flex',
        gap: '2px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: '12px',
        overflow: 'hidden',
        padding: '2px',
      }}
    >
      {STAT_CONFIGS.map(({ label, color }) => {
        const count = counts[label as keyof typeof counts]
        return (
          <div
            key={label}
            style={{
              flex: 1,
              padding: '14px 16px',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '22px',
                fontWeight: 500,
                color,
                lineHeight: 1,
              }}
            >
              {count}
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              {label}
            </span>
          </div>
        )
      })}

      <div
        style={{
          width: '1px',
          background: 'var(--color-border-subtle)',
          margin: '8px 4px',
          flexShrink: 0,
        }}
      />

      <div
        style={{
          flex: 1,
          padding: '14px 16px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '22px',
            fontWeight: 500,
            color: responseRate > 20 ? '#4CAF6E' : responseRate > 10 ? '#E8A930' : 'var(--color-text-secondary)',
            lineHeight: 1,
          }}
        >
          {responseRate}%
        </span>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Response
        </span>
      </div>
    </div>
  )
}
