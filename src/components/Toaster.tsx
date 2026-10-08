import { AnimatePresence, motion } from 'motion/react'
import { useUi } from '../store/ui'
import { toastVariants } from '../lib/motion'

export function Toaster() {
  const toasts = useUi((s) => s.toasts)
  return (
    <div className="toast-wrap">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className="toast"
            variants={toastVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
