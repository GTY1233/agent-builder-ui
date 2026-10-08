import { create } from 'zustand'

export type Theme = 'light' | 'dark'

interface UiState {
  theme: Theme
  collapsed: boolean
  paletteOpen: boolean
  toasts: { id: number; text: string }[]
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  toggleCollapsed: () => void
  setPalette: (open: boolean) => void
  toast: (text: string) => void
  dismiss: (id: number) => void
}

let toastId = 0

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem('ab-theme', theme)
  } catch {
    /* 隐私模式下写不了就算了，不影响使用 */
  }
}

const initialTheme: Theme =
  (document.documentElement.getAttribute('data-theme') as Theme) || 'light'

export const useUi = create<UiState>((set, get) => ({
  theme: initialTheme,
  collapsed: false,
  paletteOpen: false,
  toasts: [],
  setTheme: (t) => {
    applyTheme(t)
    set({ theme: t })
  },
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    set({ theme: next })
  },
  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
  setPalette: (open) => set({ paletteOpen: open }),
  toast: (text) => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts, { id, text }] }))
    window.setTimeout(() => get().dismiss(id), 2600)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
