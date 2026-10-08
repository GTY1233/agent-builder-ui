import { motion } from 'motion/react'
import { ease } from '../../lib/motion'

export function BarChart({
  data,
  height = 150,
  color = 'var(--violet)',
  unit = '',
}: {
  data: { label: string; value: number }[]
  height?: number
  color?: string
  unit?: string
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          height,
          paddingBottom: 4,
        }}
      >
        {data.map((d, i) => (
          <div key={d.label} style={{ flex: 1, textAlign: 'center' }}>
            <div
              className="num muted-2"
              style={{ fontSize: 10.5, marginBottom: 5, height: 14 }}
            >
              {d.value}
              {unit}
            </div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: Math.max(4, (d.value / max) * (height - 40)) }}
              transition={{ duration: 0.7, delay: i * 0.06, ease }}
              style={{
                background: color,
                borderRadius: '5px 5px 2px 2px',
                opacity: 0.82,
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        {data.map((d) => (
          <div
            key={d.label}
            className="muted"
            style={{ flex: 1, textAlign: 'center', fontSize: 10.5 }}
          >
            {d.label}
          </div>
        ))}
      </div>
    </div>
  )
}
