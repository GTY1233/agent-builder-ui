import { motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { ease } from '../../lib/motion'

export interface LineSeries {
  points: number[]
  color: string
  dashed?: boolean
  fill?: boolean
}

export function LineChart({
  series,
  yLabels,
  xLabels,
  height = 200,
  width = 640,
  labelWidth = 58,
}: {
  series: LineSeries[]
  yLabels?: string[]
  xLabels?: string[]
  height?: number
  width?: number
  labelWidth?: number
}) {
  const [hover, setHover] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const { min, max, count } = useMemo(() => {
    const all = series.flatMap((s) => s.points)
    const lo = Math.min(...all)
    const hi = Math.max(...all)
    const pad = (hi - lo) * 0.12 || 1
    return { min: lo - pad, max: hi + pad, count: series[0]?.points.length ?? 0 }
  }, [series])

  const x0 = labelWidth
  const x1 = width
  const yTop = 16
  const yBottom = height - 26

  const px = (i: number) => x0 + (i / Math.max(1, count - 1)) * (x1 - x0)
  const py = (v: number) => yBottom - ((v - min) / (max - min || 1)) * (yBottom - yTop)

  function pathOf(points: number[]) {
    return points.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ')
  }

  function areaOf(points: number[]) {
    return `${pathOf(points)} L${px(count - 1).toFixed(1)},${yBottom} L${x0},${yBottom} Z`
  }

  const gridYs = yLabels
    ? yLabels.map((_, i) => yTop + (i / Math.max(1, yLabels.length - 1)) * (yBottom - yTop))
    : []

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        onMouseMove={(e) => {
          const rect = svgRef.current?.getBoundingClientRect()
          if (!rect) return
          const rel = ((e.clientX - rect.left) / rect.width) * width
          const i = Math.round(((rel - x0) / (x1 - x0)) * (count - 1))
          setHover(Math.max(0, Math.min(count - 1, i)))
        }}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          {series.map((s, i) => (
            <linearGradient key={i} id={`lg-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {gridYs.map((y, i) => (
          <line
            key={i}
            x1={x0}
            y1={y}
            x2={x1}
            y2={y}
            stroke="var(--line)"
            strokeWidth="1"
            shapeRendering="crispEdges"
          />
        ))}

        {yLabels?.map((l, i) => (
          <text
            key={l + i}
            x={0}
            y={gridYs[i] + 4}
            fontSize="11"
            fill="var(--ink-3)"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {l}
          </text>
        ))}

        {series.map((s, i) =>
          s.fill ? (
            <motion.path
              key={`a-${i}`}
              d={areaOf(s.points)}
              fill={`url(#lg-${i})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease }}
            />
          ) : null,
        )}

        {series.map((s, i) => (
          <motion.path
            key={`l-${i}`}
            d={pathOf(s.points)}
            fill="none"
            stroke={s.color}
            strokeWidth={s.dashed ? 1.6 : 2.2}
            strokeDasharray={s.dashed ? '4 4' : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: i * 0.12, ease }}
          />
        ))}

        {hover !== null ? (
          <g>
            <line
              x1={px(hover)}
              y1={yTop}
              x2={px(hover)}
              y2={yBottom}
              stroke="var(--ink-3)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {series.map((s, i) => (
              <circle
                key={i}
                cx={px(hover)}
                cy={py(s.points[hover])}
                r="3.6"
                fill="var(--surface)"
                stroke={s.color}
                strokeWidth="2"
              />
            ))}
          </g>
        ) : null}

        {xLabels?.map((l, i) => (
          <text
            key={l + i}
            x={px(Math.round((i / Math.max(1, xLabels.length - 1)) * (count - 1)))}
            y={height - 6}
            fontSize="11"
            fill="var(--ink-3)"
            textAnchor={i === 0 ? 'start' : i === xLabels.length - 1 ? 'end' : 'middle'}
          >
            {l}
          </text>
        ))}
      </svg>

      {hover !== null ? (
        <div
          style={{
            position: 'absolute',
            left: `${(px(hover) / width) * 100}%`,
            top: 4,
            transform: 'translateX(-50%)',
            background: 'var(--ink)',
            color: 'var(--canvas)',
            fontSize: 11,
            padding: '4px 9px',
            borderRadius: 6,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {series.map((s) => s.points[hover].toFixed(1)).join('  ·  ')}
        </div>
      ) : null}
    </div>
  )
}
