import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { allNav } from '../lib/routes'
import { flows, projects, tasks } from '../data'
import { useUi } from '../store/ui'
import { modalVariants, ease } from '../lib/motion'
import { Icon } from './Icon'

interface Entry {
  label: string
  to: string
  icon: string
  hint: string
  kind: string
}

function buildIndex(): Entry[] {
  const nav: Entry[] = allNav.map((n) => ({
    label: n.label,
    to: n.to,
    icon: n.icon,
    hint: n.keywords ?? '',
    kind: '导航',
  }))
  const flowsEntries: Entry[] = flows.map((f) => ({
    label: f.name,
    to: `/flows/${f.id}`,
    icon: 'flow',
    hint: `${f.domain} · ${f.owner} · ${f.version}`,
    kind: '流程',
  }))
  const taskEntries: Entry[] = tasks.slice(0, 6).map((t) => ({
    label: t.title,
    to: `/tasks/${t.id}`,
    icon: 'check',
    hint: `#${t.id} · ${t.flow}`,
    kind: '任务',
  }))
  const projectEntries: Entry[] = projects.map((p) => ({
    label: p.name,
    to: `/projects/${p.id}`,
    icon: 'folder',
    hint: `${p.owner} · ${p.progress}%`,
    kind: '项目',
  }))
  return [
    ...nav,
    ...flowsEntries,
    ...taskEntries,
    ...projectEntries,
    {
      label: 'Command Center',
      to: '/command',
      icon: 'gauge',
      hint: '治理与成效',
      kind: '导航',
    },
    { label: '新建任务', to: '/tasks/new', icon: 'plus', hint: '发起一条任务', kind: '操作' },
  ]
}

export function CommandPalette() {
  const open = useUi((s) => s.paletteOpen)
  const setPalette = useUi((s) => s.setPalette)
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const index = useMemo(buildIndex, [])

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return index.slice(0, 9)
    return index
      .filter((e) =>
        `${e.label} ${e.hint} ${e.kind}`.toLowerCase().includes(needle),
      )
      .slice(0, 12)
  }, [q, index])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette(!useUi.getState().paletteOpen)
      }
      if (e.key === 'Escape') setPalette(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setPalette])

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      window.setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  useEffect(() => setActive(0), [q])

  function commit(entry?: Entry) {
    const target = entry ?? results[active]
    if (!target) return
    setPalette(false)
    navigate(target.to)
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setPalette(false)}
          />
          <div className="modal-wrap" style={{ alignItems: 'flex-start', paddingTop: '12vh' }}>
            <motion.div
              className="cmd"
              variants={modalVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ duration: 0.22, ease }}
            >
              <div className="cmd__input">
                <Icon name="search" size={17} />
                <input
                  ref={inputRef}
                  value={q}
                  placeholder="搜索任务、流程、项目或页面"
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      setActive((a) => Math.min(results.length - 1, a + 1))
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      setActive((a) => Math.max(0, a - 1))
                    } else if (e.key === 'Enter') {
                      e.preventDefault()
                      commit()
                    }
                  }}
                />
                <kbd>Esc</kbd>
              </div>
              <div className="cmd__list">
                {results.length === 0 ? (
                  <div className="muted" style={{ padding: '18px 12px', fontSize: 12.5 }}>
                    没有匹配项。可以试试「流程」「任务」或者条线名称。
                  </div>
                ) : (
                  results.map((r, i) => (
                    <button
                      key={r.kind + r.to + r.label}
                      className="cmd__item"
                      data-active={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => commit(r)}
                    >
                      <Icon name={r.icon} size={16} />
                      <span>{r.label}</span>
                      <span className="k">{r.hint || r.kind}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
