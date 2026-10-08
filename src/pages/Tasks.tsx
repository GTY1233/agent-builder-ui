import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, PageHead, Section } from '../components/ui/Page'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Icon } from '../components/Icon'
import { tasks } from '../data'
import type { TaskStatus } from '../data'

const statusFilters: { id: 'all' | TaskStatus; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'todo', label: '待开始' },
  { id: 'review', label: '审核中' },
  { id: 'ready', label: '待你确认' },
  { id: 'blocked', label: '正确阻断' },
  { id: 'done', label: '已交付' },
]

const columns: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: '待开始' },
  { id: 'review', label: '审核中' },
  { id: 'ready', label: '待你确认' },
  { id: 'done', label: '已交付' },
]

export function Tasks() {
  const navigate = useNavigate()
  const [view, setView] = useState<'list' | 'board'>('list')
  const [status, setStatus] = useState<'all' | TaskStatus>('all')
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return tasks.filter((t) => {
      if (status !== 'all' && t.status !== status) return false
      if (!needle) return true
      return `${t.title} ${t.flow} ${t.id} ${t.owner}`.toLowerCase().includes(needle)
    })
  }, [status, q])

  return (
    <Page>
      <PageHead
        title="任务"
        sub="每条任务都是一次可回溯的执行：谁发起、走了哪条流程、读了什么数据、产出了什么。"
        actions={
          <>
            <div className="seg">
              <button aria-pressed={view === 'list'} onClick={() => setView('list')}>
                列表
              </button>
              <button aria-pressed={view === 'board'} onClick={() => setView('board')}>
                看板
              </button>
            </div>
            <button className="btn btn--primary" onClick={() => navigate('/tasks/new')}>
              <Icon name="plus" size={15} />
              新建任务
            </button>
          </>
        }
      />

      <Section>
        <div className="row wrap" style={{ gap: 12, marginBottom: 14 }}>
          <div className="seg">
            {statusFilters.map((s) => (
              <button
                key={s.id}
                aria-pressed={status === s.id}
                onClick={() => setStatus(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="spacer" />
          <label className="search" style={{ minWidth: 240 }}>
            <Icon name="search" size={15} />
            <input
              value={q}
              placeholder="按标题、流程或编号搜索"
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <button className="btn" onClick={() => setQ('')}>
            <Icon name="filter" size={15} />
            清空筛选
          </button>
        </div>

        {view === 'list' ? (
          <div className="card table-wrap">
            <table className="table table--click">
              <thead>
                <tr>
                  <th>编号</th>
                  <th>标题</th>
                  <th>流程</th>
                  <th>来源</th>
                  <th>负责人</th>
                  <th>执行</th>
                  <th>创建时间</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} onClick={() => navigate(`/tasks/${t.id}`)}>
                    <td className="mono">#{t.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 12.8 }}>{t.title}</div>
                      {t.attention ? (
                        <div className="muted" style={{ fontSize: 11 }}>
                          {t.attention}
                        </div>
                      ) : null}
                    </td>
                    <td>{t.flow}</td>
                    <td className="muted-2">{t.source}</td>
                    <td>{t.owner}</td>
                    <td className="num">{t.runs}</td>
                    <td className="muted-2 nowrap">{t.createdAt}</td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="muted" style={{ textAlign: 'center', padding: 28 }}>
                      没有符合筛选条件的任务。
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="kanban">
            {columns.map((c) => {
              const col = rows.filter((t) => t.status === c.id)
              return (
                <div className="kanban__col" key={c.id}>
                  <div className="kanban__hd">
                    <span>{c.label}</span>
                    <span className="badge">{col.length}</span>
                  </div>
                  {col.map((t) => (
                    <div
                      className="kanban__card"
                      key={t.id}
                      onClick={() => navigate(`/tasks/${t.id}`)}
                    >
                      <div className="kanban__t">{t.title}</div>
                      <div className="kanban__m">
                        <Icon name="flow" size={13} />
                        <span>{t.flow}</span>
                        <div className="spacer" />
                        <span className="mono">#{t.id}</span>
                      </div>
                    </div>
                  ))}
                  {col.length === 0 ? (
                    <div className="muted" style={{ fontSize: 11.5, padding: '10px 4px' }}>
                      暂无
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </Section>
    </Page>
  )
}
