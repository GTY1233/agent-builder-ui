import { motion } from 'motion/react'
import { ease } from '../../lib/motion'

export function Donut({
  value,
  total,
  size = 110,
  thickness = 10,
  label,
}: {
  value: number
  total: number
  size?: number
  thickness?: number
  label?: string
}) {
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, value / (total || 1)))

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--line)"
          strokeWidth={thickness}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--violet)"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1, ease }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
        }}
      >
        <div>
          <div className="num" style={{ fontSize: 22, fontWeight: 650, lineHeight: 1.1 }}>
            {Math.round(pct * 100)}%
          </div>
          {label ? <div className="muted" style={{ fontSize: 10.5 }}>{label}</div> : null}
        </div>
      </div>
    </div>
  )
}
