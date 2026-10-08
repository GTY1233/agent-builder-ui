import { useState } from 'react'
import { Page, PageHead, Section } from '../components/ui/Page'
import { Tabs } from '../components/ui/Tabs'
import { Icon } from '../components/Icon'
import { auditLog } from '../data'
import { useUi } from '../store/ui'

type TabId = 'tenant' | 'members' | 'roles' | 'model' | 'integrations' | 'audit'

const members = [
  { name: '李楠', email: 'linan@example.com', role: '业务负责人', scope: '人才条线', state: '正常' },
  { name: '周然', email: 'zhouran@example.com', role: '协作', scope: '人才 / 数据', state: '正常' },
  { name: '陈曦', email: 'chenxi@example.com', role: '协作', scope: '市场条线', state: '待激活' },
  { name: '系统', email: 'system@example.com', role: '服务账号', scope: '全局只读', state: '正常' },
]

const integrations = [
  { name: '企业通讯工具', desc: '把任务通知与审批推送到日常聊天工具', on: true },
  { name: '日历', desc: '读取面试官空档，写回面试排期', on: true },
  { name: '文档库', desc: '简报与产物归档到文档空间', on: false },
  { name: '检索工具', desc: '提供实时检索能力（当前缺失，导致任务被阻断）', on: false },
]

export function Settings() {
  const [tab, setTab] = useState<TabId>('tenant')
  const [autoApprove, setAutoApprove] = useState(false)
  const [integrationState, setIntegrationState] = useState(integrations)
  const toast = useUi((s) => s.toast)

  return (
    <Page>
      <PageHead title="设置" sub="租户、成员、权限、模型与集成的统一配置入口。" />

      <Section>
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { id: 'tenant', label: '租户' },
            { id: 'members', label: '成员与角色' },
            { id: 'roles', label: '权限' },
            { id: 'model', label: '模型' },
            { id: 'integrations', label: '集成' },
            { id: 'audit', label: '审计' },
          ]}
        />

        <div style={{ marginTop: 22 }}>
          {tab === 'tenant' ? (
            <div className="card card--pad">
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="t-name">租户名称</label>
                  <input id="t-name" className="input" defaultValue="演示租户" />
                </div>
                <div className="field">
                  <label htmlFor="t-id">租户标识</label>
                  <input id="t-id" className="input mono" defaultValue="demo" readOnly />
                </div>
                <div className="field">
                  <label htmlFor="t-tz">业务时区</label>
                  <select id="t-tz" className="select" defaultValue="Asia/Shanghai">
                    <option value="Asia/Shanghai">Asia/Shanghai（UTC+8）</option>
                    <option value="Asia/Dubai">Asia/Dubai（UTC+4）</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="t-lang">界面语言</label>
                  <select id="t-lang" className="select" defaultValue="zh">
                    <option value="zh">中文（模块名保留英文）</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="field full">
                  <label htmlFor="t-desc">租户说明</label>
                  <textarea
                    id="t-desc"
                    className="textarea"
                    rows={3}
                    defaultValue="演示用租户。所有数据均为样例，不代表任何真实组织。"
                  />
                </div>
              </div>
              <div className="row" style={{ marginTop: 18 }}>
                <button className="btn btn--accent" onClick={() => toast('已保存租户设置（演示）')}>
                  保存
                </button>
                <button className="btn" onClick={() => toast('已恢复默认（演示）')}>
                  恢复默认
                </button>
              </div>
            </div>
          ) : null}

          {tab === 'members' ? (
            <div className="card table-wrap">
              <div className="card__hd">
                <b>成员</b>
                <div className="spacer" />
                <button className="btn btn--sm" onClick={() => toast('邀请链接已复制（演示）')}>
                  <Icon name="plus" size={14} />
                  邀请成员
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>账号</th>
                    <th>角色</th>
                    <th>数据范围</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.email}>
                      <td>
                        <div className="row" style={{ gap: 9 }}>
                          <span className="avatar avatar--sm">{m.name.slice(0, 1)}</span>
                          <span style={{ fontWeight: 600 }}>{m.name}</span>
                        </div>
                      </td>
                      <td className="muted-2 mono">{m.email}</td>
                      <td>{m.role}</td>
                      <td className="muted-2">{m.scope}</td>
                      <td>
                        <span
                          className={m.state === '正常' ? 'badge badge--green' : 'badge badge--amber'}
                        >
                          {m.state}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {tab === 'roles' ? (
            <div className="grid grid--2">
              <div className="card card--pad">
                <h3 style={{ fontSize: 14, marginBottom: 4 }}>放权档位</h3>
                <p className="muted-2" style={{ fontSize: 12.6, marginBottom: 14 }}>
                  档位决定智能体可以做什么。默认全部为「只读」，需要写回的能力必须逐条申请。
                </p>
                <div className="stack stack--sm">
                  {[
                    { t: '只读', d: '只产出建议，不写回' },
                    { t: '可写（受控）', d: '在指定范围内写入并留痕' },
                    { t: '永久人审', d: '对外承诺 / 金额 / 人事必须签字' },
                  ].map((x) => (
                    <div className="row" key={x.t} style={{ gap: 10, alignItems: 'flex-start' }}>
                      <Icon name="lock" size={15} className="muted" />
                      <div>
                        <div style={{ fontSize: 12.8, fontWeight: 600 }}>{x.t}</div>
                        <div className="muted" style={{ fontSize: 11.5 }}>
                          {x.d}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card card--pad">
                <h3 style={{ fontSize: 14, marginBottom: 14 }}>安全开关</h3>
                <div className="stack">
                  <button
                    className="switch"
                    data-on={autoApprove}
                    onClick={() => {
                      setAutoApprove((v) => !v)
                      toast(autoApprove ? '已关闭自动放行' : '已开启自动放行（演示，不建议）')
                    }}
                  >
                    <span className="switch__track">
                      <i />
                    </span>
                    <span>低风险变更自动放行</span>
                  </button>
                  <div className="switch" data-on={true}>
                    <span className="switch__track">
                      <i />
                    </span>
                    <span>越权访问零变更并通知</span>
                  </div>
                  <div className="switch" data-on={true}>
                    <span className="switch__track">
                      <i />
                    </span>
                    <span>全部写操作留痕且可回滚</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'model' ? (
            <div className="card card--pad">
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="m-provider">模型服务</label>
                  <select id="m-provider" className="select" defaultValue="openai-compatible">
                    <option value="openai-compatible">OpenAI 兼容接口</option>
                    <option value="private">私有化部署</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="m-name">模型名称</label>
                  <input id="m-name" className="input mono" defaultValue="gpt-5-class" />
                </div>
                <div className="field">
                  <label htmlFor="m-temp">温度</label>
                  <input id="m-temp" className="input" defaultValue="0.2" />
                </div>
                <div className="field">
                  <label htmlFor="m-budget">月度额度（元）</label>
                  <input id="m-budget" className="input" defaultValue="20000" />
                </div>
                <div className="field full">
                  <label htmlFor="m-key">密钥</label>
                  <input id="m-key" className="input mono" type="password" defaultValue="sk-demo-000" />
                </div>
              </div>
              <div className="statusline" style={{ marginTop: 18, borderLeftColor: 'var(--violet)' }}>
                <Icon name="shield" size={14} strokeWidth={2} />
                <span>
                  演示环境不发起真实模型调用。真实部署时密钥只存服务端，不下发到前端。
                </span>
              </div>
              <div className="row" style={{ marginTop: 16 }}>
                <button className="btn btn--accent" onClick={() => toast('已保存模型配置（演示）')}>
                  保存
                </button>
                <button className="btn" onClick={() => toast('连通性测试通过（演示）')}>
                  测试连通性
                </button>
              </div>
            </div>
          ) : null}

          {tab === 'integrations' ? (
            <div className="grid grid--2">
              {integrationState.map((it) => (
                <div className="card card--pad" key={it.name}>
                  <div className="row" style={{ gap: 10, marginBottom: 6 }}>
                    <Icon name="plug" size={16} className="muted" />
                    <b style={{ fontSize: 13.4 }}>{it.name}</b>
                    <div className="spacer" />
                    <button
                      className="switch"
                      data-on={it.on}
                      onClick={() => {
                        setIntegrationState((l) =>
                          l.map((x) => (x.name === it.name ? { ...x, on: !x.on } : x)),
                        )
                        toast(`${it.name} 已${it.on ? '断开' : '连接'}`)
                      }}
                    >
                      <span className="switch__track">
                        <i />
                      </span>
                    </button>
                  </div>
                  <p className="muted-2" style={{ fontSize: 12.4 }}>
                    {it.desc}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {tab === 'audit' ? (
            <div className="card table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>操作者</th>
                    <th>动作</th>
                    <th>对象</th>
                    <th>结果</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((a) => (
                    <tr key={a.at + a.what}>
                      <td className="muted-2 nowrap">{a.at}</td>
                      <td>{a.who}</td>
                      <td>{a.what}</td>
                      <td className="muted-2">{a.target}</td>
                      <td>
                        <span
                          className={
                            a.result === '通过'
                              ? 'badge badge--green'
                              : a.result === '阻断'
                                ? 'badge badge--red'
                                : 'badge badge--amber'
                          }
                        >
                          {a.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </Section>
    </Page>
  )
}
