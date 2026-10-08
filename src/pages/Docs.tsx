import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Page, PageHead, Section } from '../components/ui/Page'
import { Icon } from '../components/Icon'
import { docs } from '../data'

export function Docs() {
  const { id } = useParams()
  const [q, setQ] = useState('')
  const [current, setCurrent] = useState(id ?? docs[0].id)

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return docs
    return docs.filter((d) =>
      `${d.title} ${d.section} ${d.body.map((b) => b.p ?? '').join(' ')}`
        .toLowerCase()
        .includes(needle),
    )
  }, [q])

  const doc = docs.find((d) => d.id === current) ?? docs[0]
  const sections = Array.from(new Set(docs.map((d) => d.section)))

  return (
    <Page>
      <PageHead
        title="文档"
        sub="产品说明、操作指引与交付口径。这里也是把「我们怎么做事」讲清楚的地方。"
        actions={
          <label className="search" style={{ minWidth: 240 }}>
            <Icon name="search" size={15} />
            <input
              value={q}
              placeholder="搜索文档"
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
        }
      />

      <Section>
        <div className="doc-list">
          <div className="card card--pad">
            {sections.map((s) => (
              <div key={s} style={{ marginBottom: 14 }}>
                <div
                  className="muted"
                  style={{ fontSize: 10.5, letterSpacing: '.09em', fontWeight: 600, marginBottom: 6 }}
                >
                  {s}
                </div>
                <div className="doc-nav">
                  {rows
                    .filter((d) => d.section === s)
                    .map((d) => (
                      <button
                        key={d.id}
                        aria-current={current === d.id}
                        onClick={() => setCurrent(d.id)}
                      >
                        {d.title}
                      </button>
                    ))}
                </div>
              </div>
            ))}
            {rows.length === 0 ? (
              <div className="muted" style={{ fontSize: 12.5 }}>
                没有匹配的文档。
              </div>
            ) : null}
          </div>

          <div className="card card--pad">
            <div className="row" style={{ gap: 10, marginBottom: 6 }}>
              <span className="badge">{doc.section}</span>
              <span className="muted" style={{ fontSize: 11.5 }}>
                更新于 {doc.updated}
              </span>
            </div>
            <div className="prose">
              <h2>{doc.title}</h2>
              {doc.body.map((b, i) => (
                <div key={i}>
                  {b.h ? <h3>{b.h}</h3> : null}
                  {b.p ? <p>{b.p}</p> : null}
                  {b.ul ? (
                    <ul>
                      {b.ul.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </Page>
  )
}
