import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { itemVariants, pageVariants } from '../../lib/motion'

export function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="hidden" animate="show">
      {children}
    </motion.div>
  )
}

export function Section({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.section variants={itemVariants} className={className}>
      {children}
    </motion.section>
  )
}

export function PageHead({
  title,
  sub,
  actions,
}: {
  title: string
  sub?: string
  actions?: ReactNode
}) {
  return (
    <motion.div variants={itemVariants} className="page-head page-head--row">
      <div>
        <h1>{title}</h1>
        {sub ? <p style={{ marginBottom: 0 }}>{sub}</p> : null}
      </div>
      <div className="spacer" />
      {actions ? <div className="row">{actions}</div> : null}
    </motion.div>
  )
}

export function SkeletonPage() {
  return (
    <div className="stack">
      <div className="sk" style={{ height: 24, width: 200 }} />
      <div className="sk" style={{ height: 14, width: 320 }} />
      <div className="grid grid--3" style={{ marginTop: 8 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="sk" style={{ height: 92 }} />
        ))}
      </div>
      <div className="sk" style={{ height: 240 }} />
    </div>
  )
}
