import { useState } from 'react'
import { Page, PageHead, Section } from '../components/ui/Page'
import { Tabs } from '../components/ui/Tabs'
import { Icon } from '../components/Icon'
import { approvalHistory, approvals } from '../data'
import { useUi } from '../store/ui'

type TabId = 'queue' | 'history'

export function FlowApprovals() {
  const [tab, setTab] = useState<TabId>('queue')
  const toast = useUi((s) => s.toast)
  const [done, setDone] = useState<Record<string, '通过' | '退回'>>({})

  const pending = approvals.filter((a) => !done[a.id])

  return (
    <Page>
      <PageHead
        title="Flow Approvals"
        sub="流程上线前的审批与放权边界：改一次、全流程生效、可审计、可回滚。"
        actions={
          <>
            <span className="badge badge--amber">{pending.length} 条待审</span>
            <button className="btn" onClick={() => toast('已全部标记为已读（演示）')}>
              <Icon name="check" size={15} />
              全部标记已读
            </button>
          </>
        }
      />

      <Section>
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { id: 'queue', label: `待审队列（${pending.length}）` },
            { id: 'history', label: '审批历史' },
          ]}
        />

        <div style={{ marginTop: 18 }}>
          {tab === 'queue' ? (
            <div className="card table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>流程</th>
                    <th>变更</th>
                    <th>提交人</th>
                    <th>放权档位</th>
                    <th>风险</th>
                    <th>等待</th>
                    <th className="ta-r">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 600 }}>{a.flow}</td>
                      <td className="muted-2">{a.change}</td>
                      <td>{a.submitter}</td>
                      <td>
                        <span
                          className={
                            a.tier === '永久人审'
                              ? 'badge badge--violet'
                              : a.tier === '可写'
                                ? 'badge badge--amber'
                                : 'badge'
                          }
                        >
                          {a.tier}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            a.risk === '高'
                              ? 'badge badge--red'
                              : a.risk === '中'
                                ? 'badge badge--amber'
                                : 'badge badge--green'
                          }
                        >
                          {a.risk}
                        </span>
                      </td>
                      <td className="muted-2 nowrap">{a.waiting}</td>
                      <td className="ta-r nowrap">
                        <button
                          className="btn btn--sm"
                          onClick={() => {
                            setDone((d) => ({ ...d, [a.id]: '退回' }))
                            toast(`已退回「${a.change}」`)
                          }}
                        >
                          退回
                        </button>
                        <button
                          className="btn btn--sm btn--accent"
                          style={{ marginLeft: 8 }}
                          onClick={() => {
                            setDone((d) => ({ ...d, [a.id]: '通过' }))
                            toast(`已通过「${a.change}」`)
                          }}
                        >
                          通过
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pending.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="muted" style={{ textAlign: 'center', padding: 28 }}>
                        队列已清空。你这轮的审批都处理完了。
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>流程</th>
                    <th>变更</th>
                    <th>处理人</th>
                    <th>时间</th>
                    <th>结果</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalHistory.map((h) => (
                    <tr key={h.change}>
                      <td style={{ fontWeight: 600 }}>{h.flow}</td>
                      <td className="muted-2">{h.change}</td>
                      <td>{h.by}</td>
                      <td className="muted-2 nowrap">{h.at}</td>
                      <td>
                        <span
                          className={h.result === '通过' ? 'badge badge--green' : 'badge badge--red'}
                        >
                          {h.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Section>

      <Section>
        <div className="grid grid--3" style={{ marginTop: 18 }}>
          {[
            { t: '只读', d: '只产出建议，不写回任何系统。适合尚未验证的流程。', icon: 'lock' },
            { t: '可写', d: '可以在受控范围内写入，但每一步必须留痕。', icon: 'key' },
            { t: '永久人审', d: '对外承诺、金额、人事决定必须有人签字才能生效。', icon: 'shield' },
          ].map((x) => (
            <div className="card card--pad" key={x.t}>
              <div className="row" style={{ gap: 9, marginBottom: 8 }}>
                <Icon name={x.icon} size={16} className="muted" />
                <b style={{ fontSize: 13.2 }}>{x.t}</b>
              </div>
              <p className="muted-2" style={{ fontSize: 12.4 }}>
                {x.d}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  )
}
