import { useNavigate, useParams } from 'react-router-dom'
import { Page, PageHead, Section } from '../components/ui/Page'
import { Icon } from '../components/Icon'
import { EmptyState } from '../components/ui/EmptyState'
import { findFlow, tasks } from '../data'
import { useUi } from '../store/ui'

const versions = [
  { v: 'v7', at: '10-02', by: '李楠', note: '新增「名单核验」节点，Gate 收紧为逐条带来源' },
  { v: 'v6', at: '09-18', by: '周然', note: '初筛改为确定性函数，去掉模型判断' },
  { v: 'v5', at: '09-04', by: '李楠', note: '简报改为两段式：角色概览 + 结论与限制' },
]

export function FlowDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useUi((s) => s.toast)
  const flow = findFlow(id)

  if (!flow) {
    return (
      <Page>
        <PageHead title="流程不存在" sub={`没有找到编号为 ${id} 的流程。`} />
        <Section>
          <EmptyState
            icon="flow"
            title="换一条流程看看"
            body="流程编号可能已经变化，或者这条流程属于其他租户。"
            action={
              <button className="btn btn--primary" onClick={() => navigate('/flows')}>
                返回 Flow Library
              </button>
            }
          />
        </Section>
      </Page>
    )
  }

  const runs = tasks.filter((t) => t.flow === flow.name).slice(0, 4)

  return (
    <Page>
      <PageHead
        title={flow.name}
        sub={flow.desc}
        actions={
          <>
            <span className="badge">{flow.domain}</span>
            <span className="badge badge--violet">{flow.version}</span>
            <button className="btn" onClick={() => toast('已用这条流程发起任务（演示）')}>
              <Icon name="plus" size={15} />
              用它发起任务
            </button>
            <button className="btn" onClick={() => navigate('/approvals')}>
              <Icon name="approve" size={15} />
              提交变更审批
            </button>
          </>
        }
      />

      <Section>
        <div className="grid grid--4">
          {[
            { n: flow.runs.toLocaleString(), l: '累计运行', d: '近 30 天 1,284 次' },
            { n: `${flow.success}%`, l: '成功率', d: '失败多为正确阻断' },
            { n: String(flow.steps.length), l: '节点数', d: '含 2 个确定性节点' },
            { n: flow.owner, l: '负责人', d: '变更需负责人确认' },
          ].map((k) => (
            <div className="card kpi" key={k.l}>
              <div className="kpi__n num">{k.n}</div>
              <div className="kpi__l">{k.l}</div>
              <div className="kpi__d">{k.d}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="card" style={{ marginTop: 18 }}>
          <div className="card__hd">
            <Icon name="branch" size={15} />
            <b>执行链路</b>
            <div className="spacer" />
            <span className="hd-sub">节点可单独重跑，带独立输入输出与缓存</span>
          </div>
          <div className="card__bd">
            <div className="node-row">
              {flow.steps.map((s, i) => (
                <div className="row" key={s.name} style={{ gap: 0, flex: '0 0 auto' }}>
                  {i > 0 ? (
                    <div className="node-link">
                      <Icon name="arrow" size={14} />
                    </div>
                  ) : null}
                  <div className="node">
                    <div className="node__t">{s.name}</div>
                    <div className="node__d">{s.desc}</div>
                    <div className="mono muted" style={{ fontSize: 10.5, marginTop: 6 }}>
                      {s.node}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="statusline"
              style={{ marginTop: 18, borderLeftColor: 'var(--violet)' }}
            >
              <Icon name="shield" size={14} strokeWidth={2} />
              <span>
                <b>Gate：</b>
                {flow.gate}
              </span>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid--2" style={{ marginTop: 18 }}>
          <div className="card">
            <div className="card__hd">
              <Icon name="list" size={15} />
              <b>输入与产出</b>
            </div>
            <div className="card__bd stack">
              <div>
                <div className="k" style={{ fontSize: 10.5, color: 'var(--ink-3)', fontWeight: 600 }}>
                  输入
                </div>
                <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
                  {flow.inputs.map((x) => (
                    <span className="badge" key={x}>
                      {x}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="k" style={{ fontSize: 10.5, color: 'var(--ink-3)', fontWeight: 600 }}>
                  产出
                </div>
                <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
                  {flow.outputs.map((x) => (
                    <span className="badge badge--violet" key={x}>
                      {x}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="k" style={{ fontSize: 10.5, color: 'var(--ink-3)', fontWeight: 600 }}>
                  使用数据源
                </div>
                <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
                  {flow.sources.map((x) => (
                    <span className="badge" key={x}>
                      <Icon name="database" size={12} />
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card__hd">
              <Icon name="history" size={15} />
              <b>版本历史</b>
            </div>
            <div className="card__bd">
              <div className="timeline">
                {versions.map((v) => (
                  <div className="tl-item" key={v.v}>
                    <span className="tl-item__dot tl-item__dot--done" />
                    <div>
                      <div className="row" style={{ gap: 8 }}>
                        <span className="tl-item__t">{v.v}</span>
                        <span className="muted" style={{ fontSize: 11 }}>
                          {v.at} · {v.by}
                        </span>
                      </div>
                      <div className="tl-item__d">{v.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="card table-wrap" style={{ marginTop: 18 }}>
          <div className="card__hd">
            <b>最近运行</b>
            <div className="spacer" />
            <button className="link" onClick={() => navigate('/tasks')}>
              全部 <Icon name="arrow" size={13} strokeWidth={2} />
            </button>
          </div>
          <table className="table table--click">
            <thead>
              <tr>
                <th>编号</th>
                <th>标题</th>
                <th>来源</th>
                <th>执行次数</th>
                <th>创建时间</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((t) => (
                <tr key={t.id} onClick={() => navigate(`/tasks/${t.id}`)}>
                  <td className="mono">#{t.id}</td>
                  <td style={{ fontWeight: 600 }}>{t.title}</td>
                  <td className="muted-2">{t.source}</td>
                  <td className="num">{t.runs}</td>
                  <td className="muted-2">{t.createdAt}</td>
                </tr>
              ))}
              {runs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted" style={{ textAlign: 'center', padding: 24 }}>
                    这条流程还没有运行记录。
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Section>
    </Page>
  )
}
