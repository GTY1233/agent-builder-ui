import type { ReactNode } from 'react'
import { Icon } from '../Icon'

export function EmptyState({
  icon = 'layers',
  title,
  body,
  action,
}: {
  icon?: string
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="empty">
      <div className="empty__ic">
        <Icon name={icon} size={18} />
      </div>
      <b>{title}</b>
      <p>{body}</p>
      {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
    </div>
  )
}
