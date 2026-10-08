import { motion } from 'motion/react'
import { ease } from '../../lib/motion'

export function Sparkline({
  points,
  color = '#5b6bd6',
  height = 88,
  width = 260,
  fill = true,
}: {
  points: number[]
  color?: string
  height?: number
  width?: number
  fill?: boolean
}) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const yTop = 8
  const yBottom = height - 8
  const px = (i: number) => (i / Math.max(1, points.length - 1)) * width
  const py = (v: number) => yBottom - ((v - min) / span) * (yBottom - yTop)
  const d = points.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} aria-hidden="true">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.24" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill ? (
        <motion.path
          d={`${d} L${width},${yBottom} L0,${yBottom} Z`}
          fill="url(#spark-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        />
      ) : null}
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease }}
      />
    </svg>
  )
}
