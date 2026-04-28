import type { ApplicationStatus } from '@/types'

const statusConfig: Record<ApplicationStatus, { color: string; bg: string; dot: string }> = {
  Applied: {
    color: '#4A90D9',
    bg: 'rgba(74, 144, 217, 0.12)',
    dot: '#4A90D9',
  },
  'Phone Screen': {
    color: '#9B72CF',
    bg: 'rgba(155, 114, 207, 0.12)',
    dot: '#9B72CF',
  },
  Interview: {
    color: '#E8A930',
    bg: 'rgba(232, 169, 48, 0.12)',
    dot: '#E8A930',
  },
  Offer: {
    color: '#4CAF6E',
    bg: 'rgba(76, 175, 110, 0.12)',
    dot: '#4CAF6E',
  },
  Rejected: {
    color: '#E05252',
    bg: 'rgba(224, 82, 82, 0.12)',
    dot: '#E05252',
  },
  Withdrawn: {
    color: '#5A5448',
    bg: 'rgba(90, 84, 72, 0.18)',
    dot: '#5A5448',
  },
}

interface StatusBadgeProps {
  status: ApplicationStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '5px' : '6px',
        padding: size === 'sm' ? '3px 8px' : '4px 10px',
        borderRadius: '999px',
        backgroundColor: config.bg,
        color: config.color,
        fontSize: size === 'sm' ? '11px' : '12px',
        fontWeight: 500,
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        border: `1px solid ${config.color}22`,
      }}
    >
      <span
        style={{
          width: size === 'sm' ? '5px' : '6px',
          height: size === 'sm' ? '5px' : '6px',
          borderRadius: '50%',
          backgroundColor: config.dot,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  )
}

export { statusConfig }
