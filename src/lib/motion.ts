import { useEffect, useRef, useState } from 'react'
import type { Transition, Variants } from 'motion/react'

export const ease = [0.22, 0.61, 0.36, 1] as const

export const spring: Transition = { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }

/** 侧栏选中背景、Tabs 下划线这类"滑动到新位置"的过渡 */
export const layoutTransition: Transition = spring

export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease, when: 'beforeChildren', staggerChildren: 0.045 },
  },
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.34, ease } },
}

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.24, ease } },
}

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.24, ease } },
  exit: { opacity: 0, scale: 0.98, y: 6, transition: { duration: 0.16, ease } },
}

export const drawerVariants: Variants = {
  hidden: { x: '100%' },
  show: { x: 0, transition: { duration: 0.3, ease } },
  exit: { x: '100%', transition: { duration: 0.22, ease } },
}

export const toastVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease } },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.16, ease } },
}

/** 数字滚动：进入视口后从 0 滚到目标值 */
export function useCountUp(target: number, duration = 900, decimals = 0) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
      else setValue(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  const factor = Math.pow(10, decimals)
  return (Math.round(value * factor) / factor).toFixed(decimals)
}

/** 路由切换时给一个很短的骨架屏，避免瞬间闪白 */
export function useRoutePulse(key: string, ms = 220) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), ms)
    return () => window.clearTimeout(t)
  }, [key, ms])
  return loading
}
