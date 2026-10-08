import { useState } from 'react'
import { Page, PageHead, Section } from '../components/ui/Page'
import { Icon } from '../components/Icon'
import { rules as seed } from '../data'
import type { RuleRow } from '../data'
import { useUi } from '../store/ui'

export function RuleManager() {
  const [list, setList] = useState<RuleRow[]>(seed)
  const [active, setActive] = useState<RuleRow | null>(seed[0])
  const [threshold, setThreshold] = useState(320)
  const toast = useUi((s) => s.toast)

  function toggle(id: string) {
    setList((l) => l.map((r) => (r.id === id ? { ...r, on: !r.on } : r)))
    const r = list.find((x) => x.id === id)
    if (r) toast(`规则「${r.name}」已${r.on ? '停用' : '启用'}`)
  }

  return (
    <Page>
      <PageHead
        title="Rule Manager"
        sub="阈值、口径与约束条件：改一次、全流程生效、全程留痕、可一键回滚。"
        actions={
          <>
            <span className="badge badge--green">{list.filter((r) => r.on).length} 条生效</span>
            <button className="btn btn--primary">
              <Icon name="plus" size={15} />
              新建规则
            </button>
          </>
        }
      />

      <Section>
        <div className="split">
          <div className="card table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>规则</th>
                  <th>作用域</th>
                  <th>阈值</th>
                  <th>生效</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setActive(r)}
                    style={{
                      cursor: 'pointer',
                      background: active?.id === r.id ? 'var(--surface-2)' : undefined,
                    }}
                  >
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 12.8 }}>{r.name}</div>
                      <div className="muted" style={{ fontSize: 11 }}>
                        更新于 {r.updatedAt} · {r.updatedBy}
                      </div>
                    </td>
                    <td className="muted-2">{r.scope}</td>
                    <td className="nowrap">{r.threshold}</td>
                    <td>
                      <button
                        className="switch"
                        data-on={r.on}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggle(r.id)
                        }}
                        aria-label={`切换 ${r.name}`}
                      >
                        <span className="switch__track">
                          <i />
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card card--pad">
            {active ? (
              <>
                <div className="row" style={{ gap: 9, marginBottom: 10 }}>
                  <Icon name="rules" size={16} className="muted" />
                  <b style={{ fontSize: 14 }}>{active.name}</b>
                </div>
                <p className="muted-2" style={{ fontSize: 12.6, marginBottom: 16 }}>
                  作用域：{active.scope} · 生效流程：{active.applies}。规则命中时，运行会明确输出
                  「正确阻断」并说明缺少什么，而不是给出一个看起来完整的答案。
                </p>

                <div className="field">
                  <label htmlFor="th">阈值（样本量下限）</label>
                  <input
                    id="th"
                    className="slider"
                    type="range"
                    min={100}
                    max={600}
                    step={20}
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                  />
                  <div className="row">
                    <span className="muted" style={{ fontSize: 11.5 }}>
                      100
                    </span>
                    <div className="spacer" />
                    <span className="num" style={{ fontWeight: 600 }}>
                      ≥ {threshold} 条
                    </span>
                    <div className="spacer" />
                    <span className="muted" style={{ fontSize: 11.5 }}>
                      600
                    </span>
                  </div>
                </div>

                <div className="row" style={{ gap: 10, marginTop: 16 }}>
                  <button
                    className="btn btn--accent"
                    onClick={() => {
                      setList((l) =>
                        l.map((r) =>
                          r.id === active.id ? { ...r, threshold: `≥ ${threshold} 条` } : r,
                        ),
                      )
                      toast('阈值已更新，全部引用该规则的流程同时生效')
                    }}
                  >
                    保存并生效
                  </button>
                  <button className="btn" onClick={() => toast('已回滚到上一版（演示）')}>
                    <Icon name="history" size={15} />
                    回滚
                  </button>
                </div>

                <div
                  className="muted"
                  style={{ fontSize: 11.5, marginTop: 18, borderTop: '1px solid var(--line-2)', paddingTop: 12 }}
                >
                  变更记录：10-02 系统 200 → 320；09-21 周然 150 → 200；09-05 李楠 初始 150。
                </div>
              </>
            ) : (
              <div className="muted">选择左侧任意规则查看与调整。</div>
            )}
          </div>
        </div>
      </Section>
    </Page>
  )
}
