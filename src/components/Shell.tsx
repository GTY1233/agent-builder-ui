import { motion } from 'motion/react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { crumbFor, footNav, navGroups } from '../lib/routes'
import { layoutTransition } from '../lib/motion'
import { useUi } from '../store/ui'
import { Icon } from './Icon'
import { CommandPalette } from './CommandPalette'
import { Toaster } from './Toaster'

function Sidebar() {
  const navigate = useNavigate()
  return (
    <aside className="side">
      <div className="brand">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="2" width="9" height="9" rx="2.6" fill="currentColor" />
          <rect x="13" y="2" width="9" height="9" rx="2.6" fill="currentColor" opacity=".45" />
          <rect x="2" y="13" width="9" height="9" rx="2.6" fill="currentColor" opacity=".45" />
          <rect x="13" y="13" width="9" height="9" rx="2.6" fill="currentColor" />
        </svg>
        <div className="brand__name">Agent Builder</div>
      </div>

      <button className="cta" onClick={() => navigate('/tasks/new')}>
        <Icon name="plus" size={18} />
        <span className="cta__txt">
          <b>新建任务</b>
          <span>与你的 AI 团队一起执行</span>
        </span>
      </button>

      <nav className="side__nav">
        {navGroups.map((g) => (
          <div key={g.title ?? 'main'}>
            {g.title ? <div className="navgroup">{g.title}</div> : null}
            {g.items.map((it) => (
              <NavLink key={it.to} to={it.to} end={it.to === '/'} className="nav">
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <motion.span
                        layoutId="nav-bg"
                        className="nav__bg"
                        transition={layoutTransition}
                      />
                    ) : null}
                    <Icon name={it.icon} size={18} />
                    <span className="side__label">{it.label}</span>
                    {it.to === '/resources' ? (
                      <Icon name="right" size={13} className="nav__chev" />
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="side__foot">
        {footNav.map((it) => (
          <NavLink key={it.to} to={it.to} className="nav">
            {({ isActive }) => (
              <>
                {isActive ? (
                  <motion.span
                    layoutId="nav-bg-foot"
                    className="nav__bg"
                    transition={layoutTransition}
                  />
                ) : null}
                <Icon name={it.icon} size={18} />
                <span className="side__label">{it.label}</span>
              </>
            )}
          </NavLink>
        ))}
        <div className="user">
          <div className="avatar">李</div>
          <div>
            <div className="user__name">李楠</div>
            <div className="user__role">业务负责人</div>
          </div>
        </div>
        <div className="side__stamp">
          形态复刻自 Inception42 Catalyst
          <br />
          交互模版 · 非成品
        </div>
      </div>
    </aside>
  )
}

function Topbar() {
  const collapsed = useUi((s) => s.collapsed)
  const toggleCollapsed = useUi((s) => s.toggleCollapsed)
  const theme = useUi((s) => s.theme)
  const toggleTheme = useUi((s) => s.toggleTheme)
  const setPalette = useUi((s) => s.setPalette)
  const toast = useUi((s) => s.toast)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const parts = crumbFor(pathname)

  return (
    <header className="topbar">
      <button
        className="icon-btn"
        onClick={toggleCollapsed}
        title={collapsed ? '展开侧栏' : '收起侧栏'}
        aria-label="切换侧栏"
      >
        <Icon name="panel" />
      </button>

      <div className="crumb">
        {parts.map((p, i) => (
          <span key={p + i} className="row" style={{ gap: 7 }}>
            {i > 0 ? <span>›</span> : null}
            {i === parts.length - 1 ? <b>{p}</b> : <span>{p}</span>}
          </span>
        ))}
      </div>

      <div className="spacer" />

      <button className="pill" onClick={() => navigate('/command')}>
        <Icon name="gauge" size={15} />
        Command Center
      </button>

      <button
        className="search"
        onClick={() => setPalette(true)}
        style={{ textAlign: 'left' }}
        title="打开命令面板"
      >
        <Icon name="search" size={15} />
        <span style={{ flex: 1, fontSize: 12.5 }}>搜索任务、流程、智能体</span>
        <kbd>⌘K</kbd>
      </button>

      <div className="pill">
        <span className="pill-dot" />
        演示租户
      </div>

      <button
        className="icon-btn"
        title="分析助手"
        onClick={() => toast('分析助手：这里会基于当前页数据给出解读（演示）')}
      >
        <Icon name="spark" />
      </button>

      <button
        className="icon-btn badge-dot"
        title="通知"
        onClick={() => toast('1 条待处理：任务 #1492 等待品牌口径确认')}
      >
        <Icon name="bell" />
        <i>1</i>
      </button>

      <button
        className="icon-btn"
        onClick={toggleTheme}
        title={theme === 'dark' ? '切换到浅色' : '切换到深色'}
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>
    </header>
  )
}

export function AppShell() {
  const collapsed = useUi((s) => s.collapsed)
  const { pathname } = useLocation()

  return (
    <div className="app" data-collapsed={collapsed}>
      <Sidebar />
      <div className="main">
        <Topbar />
        <motion.main
          className="stage"
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <Outlet />
        </motion.main>
      </div>
      <CommandPalette />
      <Toaster />
    </div>
  )
}
