import { useNavigate } from 'react-router-dom'
import { Page, Section } from '../components/ui/Page'
import { Kpi } from '../components/ui/Kpi'
import { StatusBadge } from '../components/ui/StatusBadge'
import { BarChart } from '../components/charts/BarChart'
import { Icon } from '../components/Icon'
import { agents, tasks } from '../data'

const week = [
  { label: '周一', value: 42 },
  { label: '周二', value: 61 },
  { label: '周三', value: 55 },
  { label: '周四', value: 74 },
  { label: '周五', value: 68 },
  { label: '周六', value: 12 },
  { label: '周日', value: 8 },
]

export function Dashboard() {
  const navigate = useNavigate()
  const active = tasks.filter((t) => t.status !== 'done')

  return (
    <Page>
      <Section>
        <div className="hero">
          <div className="hero__kick">人才招聘</div>
          <h1>早上好，李楠。</h1>
          <p>先建一份角色简报，再把人选推进到经验证的候选名单。今天有 3 条任务需要你介入。</p>
        </div>
      </Section>

      <Section>
        <div className="cockrow" style={{ marginTop: 18 }}>
          <div className="cockleft">
            <div className="cocktop">
              <div className="startcard" onClick={() => navigate('/tasks/new')}>
                <div className="startcard__icon">
                  <Icon name="plus" size={18} />
                </div>
                <div>
                  <div className="startcard__t">开始人才搜索</div>
                  <div className="startcard__d">用自然语言描述你需要的画像</div>
                </div>
                <div className="spacer" />
                <Icon name="arrow" size={18} className="muted" />
              </div>
              <Kpi value={65} label="活跃岗位" note="65 个岗位搜索" />
              <Kpi value={3} label="需要你介入" note="1 条正确阻断" />
            </div>

            <div className="card">
              <div className="card__hd">
                <b>我的工作</b>
                <span className="hd-sub">最近的岗位搜索</span>
                <div className="spacer" />
                <button className="link" onClick={() => navigate('/tasks')}>
                  全部 <Icon name="arrow" size={13} strokeWidth={2} />
                </button>
              </div>
              <div>
                {active.slice(0, 5).map((t) => (
                  <div
                    className="list-row list-row--click"
                    key={t.id}
                    onClick={() => navigate(`/tasks/${t.id}`)}
                  >
                    <div className="list-row__icon">
                      <Icon name="flow" size={14} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="list-row__t">{t.title}</div>
                      <div className="list-row__d">
                        #{t.id} · {t.flow} · {t.createdAt}
                      </div>
                    </div>
                    <div className="list-row__end">
                      <StatusBadge status={t.status} />
                      <Icon name="right" size={13} className="muted" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="orch">
            <div className="orch__kick">编排 · 人才智能体</div>
            <h3>一份简报，一份完整的人才情报报告。</h3>
            <p>
              流程 A4 通过产品 API 网关，编排岗位分诊、职位描述撰写、寻访、筛选与经验证入围；每一步的输入输出都留痕。
            </p>
            <button className="orch__btn" onClick={() => navigate('/flows/talent')}>
              开始人才招聘 <Icon name="arrow" size={15} />
            </button>
            <div className="orch__foot">智能体编排经由网关获取能力</div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid--2" style={{ marginTop: 18 }}>
          <div className="card">
            <div className="card__hd">
              <Icon name="activity" size={15} />
              <b>本周运行次数</b>
              <div className="spacer" />
              <span className="hd-sub">共 320 次</span>
            </div>
            <div className="card__bd">
              <BarChart data={week} height={150} unit="" />
            </div>
          </div>

          <div className="card">
            <div className="card__hd">
              <Icon name="spark" size={15} />
              <b>智能体状态</b>
              <div className="spacer" />
              <button className="link" onClick={() => navigate('/resources')}>
                资源 <Icon name="arrow" size={13} strokeWidth={2} />
              </button>
            </div>
            <div>
              {agents.map((a) => (
                <div className="list-row" key={a.id}>
                  <div className="list-row__icon">
                    <Icon name="spark" size={14} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="list-row__t">{a.name}</div>
                    <div className="list-row__d">
                      24h {a.runs24h} 次 · 平均 {a.latency}
                    </div>
                  </div>
                  <div className="list-row__end">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </Page>
  )
}
