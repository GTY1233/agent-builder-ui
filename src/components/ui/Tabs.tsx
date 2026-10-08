import { motion } from 'motion/react'
import { useId, useRef } from 'react'
import { layoutTransition } from '../../lib/motion'

export function Tabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const uid = useId()

  return (
    <div className="tabs" ref={ref} role="tablist">
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          aria-selected={value === it.id}
          onClick={() => onChange(it.id)}
        >
          {it.label}
          {value === it.id ? (
            <motion.span
              layoutId={`tabs-ink-${uid}`}
              className="tabs__ink"
              transition={layoutTransition}
              style={{ left: 8, right: 8 }}
            />
          ) : null}
        </button>
      ))}
    </div>
  )
}
