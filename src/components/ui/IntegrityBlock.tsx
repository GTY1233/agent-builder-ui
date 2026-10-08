import { Icon } from '../Icon'

export interface IntegrityItem {
  kind: 'ok' | 'warn' | 'act'
  label: string
  detail: string
}

export function IntegrityBlock({
  title = '数据来源与完整性',
  items,
}: {
  title?: string
  items: IntegrityItem[]
}) {
  return (
    <div className="integrity">
      <div className="k" style={{ fontSize: 10.5, letterSpacing: '.09em', fontWeight: 600, color: 'var(--ink-3)' }}>
        {title}
      </div>
      {items.map((it) => (
        <div className="integrity__row" key={it.label}>
          <span
            className={`integrity__mk integrity__mk--${it.kind === 'ok' ? 'ok' : it.kind === 'warn' ? 'warn' : 'act'}`}
          >
            {it.kind === 'ok' ? (
              <Icon name="check" size={13} strokeWidth={2} />
            ) : it.kind === 'warn' ? (
              <Icon name="alert" size={13} strokeWidth={2} />
            ) : (
              <Icon name="arrow" size={13} strokeWidth={2} />
            )}
          </span>
          <span>
            <b style={{ fontWeight: 600 }}>{it.label}</b> <span className="muted-2">{it.detail}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
