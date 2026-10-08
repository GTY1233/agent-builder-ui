import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, PageHead, Section } from '../components/ui/Page'
import { Donut } from '../components/charts/Donut'
import { Icon } from '../components/Icon'
import { projects } from '../data'

const filters = ['全部', '进行中', '待评审', '已交付'] as const

export function Projects() {
  const navigate = useNavigate()
  const [f, setF] = useState<(typeof filters)[number]>('全部')
  const rows = projects.filter((p) => f === '全部' || p.status === f)

  return (
    <Page>
      <PageHead
        title="项目"
        sub="把一组任务组织成项目，共享数据源、成员与验收口径。"
        actions={
          <button className="btn btn--primary" onClick={() => navigate('/tasks/new')}>
            <Icon name="plus" size={15} />
            新建项目
          </button>
        }
      />

      <Section>
        <div className="seg" style={{ marginBottom: 16 }}>
          {filters.map((x) => (
            <button key={x} aria-pressed={f === x} onClick={() => setF(x)}>
              {x}
            </button>
          ))}
        </div>

        <div className="grid grid--2">
          {rows.map((p) => (
            <div
              className="card card--pad clickable"
              key={p.id}
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              <div className="row row--top" style={{ gap: 16 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="row" style={{ gap: 10, marginBottom: 6 }}>
                    <span
                      className={
                        p.status === '已交付'
                          ? 'badge badge--green'
                          : p.status === '待评审'
                            ? 'badge badge--amber'
                            : 'badge badge--violet'
                      }
                    >
                      {p.status}
                    </span>
                    <span className="muted" style={{ fontSize: 11 }}>
                      {p.window}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 15, marginBottom: 6 }}>{p.name}</h3>
                  <p className="muted-2" style={{ fontSize: 12.8 }}>
                    {p.goal}
                  </p>
                  <div className="row" style={{ gap: 10, marginTop: 14 }}>
                    <div className="avatar avatar--sm">{p.owner.slice(0, 1)}</div>
                    <span className="muted" style={{ fontSize: 11.5 }}>
                      {p.owner}
                    </span>
                    <div className="spacer" />
                    <span className="muted" style={{ fontSize: 11.5 }}>
                      {p.done}/{p.tasks} 条任务完成
                    </span>
                  </div>
                  <div className="progress progress--green" style={{ marginTop: 10 }}>
                    <i style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                <Donut value={p.progress} total={100} size={92} thickness={9} label="进度" />
              </div>
            </div>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="muted" style={{ padding: 24, textAlign: 'center' }}>
            该状态下暂无项目。
          </div>
        ) : null}
      </Section>
    </Page>
  )
}
