import { statusMeta } from '../../data'
import type { TaskStatus } from '../../data'
import type { ReactNode } from 'react'

export function StatusBadge({ status }: { status: TaskStatus }) {
  const meta = statusMeta[status]
  const cls = meta.tone ? `badge badge--${meta.tone}` : 'badge'
  return <span className={cls}>{meta.label}</span>
}

export function ToneBadge({
  children,
  tone,
}: {
  children: ReactNode
  tone?: 'violet' | 'amber' | 'green' | 'red'
}) {
  return <span className={tone ? `badge badge--${tone}` : 'badge'}>{children}</span>
}
