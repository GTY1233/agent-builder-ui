import { useState } from 'react'
import { Page, PageHead, Section } from '../components/ui/Page'
import { Tabs } from '../components/ui/Tabs'
import { Icon } from '../components/Icon'
import { useUi } from '../store/ui'
import { agents, sources } from '../data'

type TabId = 'sources' | 'ontology' | 'knowledge' | 'agents'

const entities = [
  { name: '岗位', attrs: ['名称', '地点', '层级', '职责', '要求'], rel: '归属 → 企业；要求 → 能力项' },
  { name: '能力项', attrs: ['编号', '名称', '类别', '证据要求'], rel: '被岗位要求；被简历命中' },
  { name: '企业', attrs: ['全称', '行业', '规模', '来源'], rel: '发布 → 岗位' },
  { name: '简历', attrs: ['来源', '时间', '关键字段完整度'], rel: '命中 → 能力项' },
  { name: '流程', attrs: ['名称', '版本', '放权档位'], rel: '消费 → 数据源；产出 → 产物' },
  { name: '规则', attrs: ['名称', '作用域', '阈值'], rel: '约束 → 流程' },
]

const knowledge = [
  { t: '中级产品市场经理的常见职责边界', from: '岗位语料', at: '10-04', conf: '高' },
  { t: 'GRC 岗位对证书的要求分布（华东）', from: '岗位语料', at: '10-03', conf: '中' },
  { t: '企业级软件 GTM 与 PLG 的岗位差异', from: '产业资讯', at: '10-02', conf: '中' },
  { t: '本地招聘渠道的响应周期经验值', from: '历史项目', at: '09-29', conf: '低' },
]

export function Resources() {
  const [tab, setTab] = useState<TabId>('sources')
  const toast = useUi((s) => s.toast)

  return (
    <Page>
      <PageHead
        title="资源"
        sub="数据源、本体与术语、知识条目、智能体 —— 四类底座资产在一个入口里看全。"
        actions={
          <button className="btn" onClick={() => toast('已触发一次来源巡检（演示）')}>
            <Icon name="refresh" size={15} />
            巡检来源
          </button>
        }
      />

      <Section>
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { id: 'sources', label: '数据源' },
            { id: 'ontology', label: '本体与术语' },
            { id: 'knowledge', label: '知识条目' },
            { id: 'agents', label: '智能体' },
          ]}
        />

        <div style={{ marginTop: 18 }}>
          {tab === 'sources' ? (
            <div className="card table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>名称</th>
                    <th>类型</th>
                    <th>更新频率</th>
                    <th>最近同步</th>
                    <th>覆盖度</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td className="muted-2">{s.type}</td>
                      <td>{s.cadence}</td>
                      <td className="muted-2">{s.lastSync}</td>
                      <td>
                        {s.coverage}%
                        <span className="bar">
                          <i style={{ width: `${s.coverage}%` }} />
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            s.status === '正常'
                              ? 'badge badge--green'
                              : s.status === '延迟'
                                ? 'badge badge--amber'
                                : 'badge badge--red'
                          }
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {tab === 'ontology' ? (
            <div className="grid grid--3">
              {entities.map((e) => (
                <div className="card card--pad" key={e.name}>
                  <div className="row" style={{ gap: 9, marginBottom: 10 }}>
                    <span className="list-row__icon">
                      <Icon name="layers" size={14} />
                    </span>
                    <b style={{ fontSize: 13.5 }}>{e.name}</b>
                  </div>
                  <div className="row wrap" style={{ gap: 6, marginBottom: 10 }}>
                    {e.attrs.map((a) => (
                      <span className="badge" key={a}>
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className="muted" style={{ fontSize: 11.5 }}>
                    {e.rel}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {tab === 'knowledge' ? (
            <div className="card">
              <div className="card__hd">
                <b>沉淀的知识条目</b>
                <div className="spacer" />
                <span className="hd-sub">按置信度排序</span>
              </div>
              <div>
                {knowledge.map((k) => (
                  <div className="list-row" key={k.t}>
                    <div className="list-row__icon">
                      <Icon name="book" size={14} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="list-row__t">{k.t}</div>
                      <div className="list-row__d">
                        来源 {k.from} · {k.at}
                      </div>
                    </div>
                    <div className="list-row__end">
                      <span
                        className={
                          k.conf === '高'
                            ? 'badge badge--green'
                            : k.conf === '中'
                              ? 'badge badge--amber'
                              : 'badge'
                        }
                      >
                        置信度 {k.conf}
                      </span>
                      <button
                        className="icon-btn icon-btn--sm"
                        onClick={() => toast('打开条目详情（演示）')}
                      >
                        <Icon name="right" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {tab === 'agents' ? (
            <div className="grid grid--3">
              {agents.map((a) => (
                <div className="card card--pad" key={a.id}>
                  <div className="row" style={{ gap: 10, marginBottom: 10 }}>
                    <span
                      className="list-row__icon"
                      style={{
                        background: 'var(--violet-soft)',
                        borderColor: 'var(--violet-line)',
                        color: 'var(--violet)',
                      }}
                    >
                      <Icon name="spark" size={14} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.2, fontWeight: 640 }}>{a.name}</div>
                      <div className="muted" style={{ fontSize: 11 }}>
                        {a.domain} 条线 · {a.owner}
                      </div>
                    </div>
                    <div className="spacer" />
                    <span
                      className={
                        a.state === '在线'
                          ? 'badge badge--green'
                          : a.state === '需人工'
                            ? 'badge badge--amber'
                            : 'badge'
                      }
                    >
                      {a.state}
                    </span>
                  </div>
                  <div className="row" style={{ gap: 18 }}>
                    <div>
                      <div className="num" style={{ fontSize: 16, fontWeight: 640 }}>
                        {a.runs24h}
                      </div>
                      <div className="muted" style={{ fontSize: 10.5 }}>
                        24 小时运行
                      </div>
                    </div>
                    <div>
                      <div className="num" style={{ fontSize: 16, fontWeight: 640 }}>
                        {a.latency}
                      </div>
                      <div className="muted" style={{ fontSize: 10.5 }}>
                        平均耗时
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Section>
    </Page>
  )
}
