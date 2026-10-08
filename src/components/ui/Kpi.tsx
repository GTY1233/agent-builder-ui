import { useCountUp } from '../../lib/motion'

export function Kpi({
  value,
  label,
  note,
  decimals = 0,
  prefix = '',
  suffix = '',
  format,
  tone,
  big,
  onClick,
}: {
  value: number
  label: string
  note?: string
  decimals?: number
  prefix?: string
  suffix?: string
  format?: (n: number) => string
  tone?: 'amber'
  big?: boolean
  onClick?: () => void
}) {
  const shown = useCountUp(value, 900, decimals)
  const text = format ? format(Number(shown)) : shown

  return (
    <div
      className={`card kpi${tone === 'amber' ? ' kpi--amber' : ''}${onClick ? ' clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      <div className={`kpi__n num${big ? ' kpi__n--lg' : ''}`}>
        {prefix}
        {text}
        {suffix}
      </div>
      <div className="kpi__l">{label}</div>
      {note ? <div className="kpi__d">{note}</div> : null}
    </div>
  )
}
