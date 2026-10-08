import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, PageHead, Section } from '../components/ui/Page'
import { Icon } from '../components/Icon'
import { flows } from '../data'

export function FlowLibrary() {
  const navigate = useNavigate()
  const [domain, setDomain] = useState('全部')
  const [q, setQ] = useState('')

  const domains = useMemo(
    () => ['全部', ...Array.from(new Set(flows.map((f) => f.domain)))],
    [],
  )

  const rows = flows.filter((f) => {
    if (domain !== '全部' && f.domain !== domain) return false
    const needle = q.trim().toLowerCase()
    if (!needle) return true
    return `${f.name} ${f.desc} ${f.owner}`.toLowerCase().includes(needle)
  })

  return (
    <Page>
      <PageHead
        title="Flow Library"
        sub="可复用的智能体流程：谁在什么条件下、用哪些数据、产出什么。流程是装配单元，不是一次性脚本。"
        actions={
          <button className="btn btn--primary">
            <Icon name="plus" size={15} />
            新建流程
          </button>
        }
      />

      <Section>
        <div className="row wrap" style={{ gap: 12, marginBottom: 16 }}>
          <div className="seg">
            {domains.map((d) => (
              <button key={d} aria-pressed={domain === d} onClick={() => setDomain(d)}>
                {d}
              </button>
            ))}
          </div>
          <div className="spacer" />
          <label className="search" style={{ minWidth: 260 }}>
            <Icon name="search" size={15} />
            <input
              value={q}
              placeholder="搜索流程名称、说明或负责人"
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
        </div>

        <div className="grid grid--2">
          {rows.map((f) => (
            <div
              className="card card--pad clickable"
              key={f.id}
              onClick={() => navigate(`/flows/${f.id}`)}
            >
              <div className="row" style={{ gap: 10, marginBottom: 8 }}>
                <span
                  className="list-row__icon"
                  style={{
                    background: 'var(--violet-soft)',
                    borderColor: 'var(--violet-line)',
                    color: 'var(--violet)',
                  }}
                >
                  <Icon name="flow" size={14} />
                </span>
                <b style={{ fontSize: 14 }}>{f.name}</b>
                <span className="badge">{f.domain}</span>
                <span className="badge badge--violet">{f.version}</span>
                <div className="spacer" />
                <Icon name="right" size={14} className="muted" />
              </div>

              <p className="muted-2" style={{ fontSize: 12.6, marginBottom: 12 }}>
                {f.desc}
              </p>

              <div className="row wrap" style={{ gap: 6, marginBottom: 12 }}>
                {f.steps.slice(0, 4).map((s) => (
                  <span className="badge" key={s.name}>
                    {s.name}
                  </span>
                ))}
                {f.steps.length > 4 ? (
                  <span className="badge">+{f.steps.length - 4}</span>
                ) : null}
              </div>

              <div className="row" style={{ gap: 20 }}>
                <div>
                  <div className="num" style={{ fontSize: 15, fontWeight: 640 }}>
                    {f.runs.toLocaleString()}
                  </div>
                  <div className="muted" style={{ fontSize: 10.5 }}>
                    累计运行
                  </div>
                </div>
                <div>
                  <div className="num" style={{ fontSize: 15, fontWeight: 640 }}>
                    {f.success}%
                  </div>
                  <div className="muted" style={{ fontSize: 10.5 }}>
                    成功率
                  </div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.6, fontWeight: 600 }}>{f.owner}</div>
                  <div className="muted" style={{ fontSize: 10.5 }}>
                    负责人
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  )
}
