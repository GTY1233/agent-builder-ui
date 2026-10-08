import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, Section } from '../components/ui/Page'
import { Icon } from '../components/Icon'
import { useUi } from '../store/ui'
import { tasks } from '../data'

const presets = ['晨间简报', '财务报告解读', '市场速览', '客户准备', '本周到期事项']

const agenda = [
  { time: '09:30', title: '招聘周会 · 三个岗位进度对齐', tag: '会议' },
  { time: '13:00', title: '合同评审 · 两个风险条款需要你确认', tag: '待签' },
  { time: '16:30', title: '秋季雇主品牌活动启动会', tag: '会议' },
]

const outputs = [
  { name: '岗位画像刷新 · 数据治理条线', at: '今天 06:12', kind: '画像' },
  { name: '人才市场月度简报 · 2026-09', at: '昨天 21:04', kind: '简报' },
  { name: '秋季活动内容日历（初稿）', at: '昨天 17:22', kind: '内容' },
]

export function Home() {
  const [ask, setAsk] = useState('')
  const navigate = useNavigate()
  const toast = useUi((s) => s.toast)

  function goNew(text: string) {
    const v = text.trim()
    navigate('/tasks/new', { state: { prefill: v || '我需要招聘一位产品市场经理' } })
    if (v) toast('已带入新建任务，可继续编辑')
  }

  return (
    <Page>
      <Section>
        <div className="home-head">
          <h1>早上好</h1>
          <p>10 月 8 日 星期四 · 演示环境 · 所有数据均为样例</p>
        </div>
        <div className="ask">
          <div className="askbox">
            <input
              value={ask}
              placeholder="问问助理：今天有什么需要我处理的？"
              onChange={(e) => setAsk(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') goNew(ask)
              }}
            />
            <div className="askrow">
              <button className="icon-btn icon-btn--sm" title="添加附件">
                <Icon name="plus" size={16} />
              </button>
              <div className="spacer" />
              <button className="icon-btn icon-btn--sm" title="语音输入">
                <Icon name="mic" size={16} />
              </button>
              <button
                className={`send${ask.trim() ? ' send--ready' : ''}`}
                onClick={() => goNew(ask)}
                title="发送"
              >
                <Icon name="send" size={16} />
              </button>
            </div>
          </div>
          <div className="chips">
            {presets.map((p) => (
              <button
                key={p}
                className="chip"
                onClick={() => {
                  setAsk(p)
                  toast('预设问题已填入，可继续编辑')
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.55fr) minmax(0, 1fr)',
            gap: 18,
            marginTop: 30,
          }}
        >
          <div className="card card--pad">
            <h3 style={{ fontSize: 14.5, marginBottom: 9 }}>你的两分钟简报</h3>
            <p className="muted-2" style={{ fontSize: 13, marginBottom: 12 }}>
              今日重点：新签合作进入合同评审，法务给出的两个风险条款需要你确认口径；招聘方面，三个岗位搜索进入收尾，
              其中「网络安全治理负责人」已产出 5 人入围名单，等待你的复核。系统另提示一条正确阻断：秋季雇主品牌活动
              因缺少品牌口径确认，尚未继续执行。
            </p>
            <button className="link" onClick={() => navigate('/tasks/1497')}>
              查看完整简报 <Icon name="arrow" size={13} strokeWidth={2} />
            </button>
          </div>

          <div className="card">
            <div className="card__hd">
              <b>需要你</b>
              <div className="spacer" />
              <span className="hd-sub">3 项</span>
            </div>
            <div>
              {[
                { t: '正式函件待签发 · 星瀚动力', d: '由 AI 团队起草 · 需你在发送前签字', tag: '来自 AI', tone: 'badge badge--violet' },
                { t: 'AI 任务审批 · 已 2 天无更新', d: '市政方向 · 建议今日跟进', tag: '待办', tone: 'badge badge--amber' },
                { t: '出访席位安排 · 已备两套方案', d: '礼宾处提出 · 需你在候选名单上拍板', tag: '待办', tone: 'badge badge--amber' },
              ].map((n) => (
                <div className="list-row" key={n.t}>
                  <div style={{ minWidth: 0 }}>
                    <div className="list-row__t">{n.t}</div>
                    <div className="list-row__d">{n.d}</div>
                  </div>
                  <div className="list-row__end">
                    <span className={n.tone}>{n.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid--3" style={{ marginTop: 18 }}>
          <div className="card">
            <div className="card__hd">
              <Icon name="clock" size={15} />
              <b>今日日程</b>
            </div>
            <div>
              {agenda.map((a) => (
                <div className="list-row" key={a.time}>
                  <span className="mono muted" style={{ fontSize: 12 }}>
                    {a.time}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.8, fontWeight: 600 }}>{a.title}</div>
                  </div>
                  <div className="list-row__end">
                    <span className={a.tag === '待签' ? 'badge badge--amber' : 'badge'}>
                      {a.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card__hd">
              <Icon name="file" size={15} />
              <b>最近产出</b>
            </div>
            <div>
              {outputs.map((o) => (
                <div className="list-row" key={o.name}>
                  <div className="list-row__icon">
                    <Icon name="file" size={14} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.8, fontWeight: 600 }}>{o.name}</div>
                    <div className="list-row__d">{o.at}</div>
                  </div>
                  <div className="list-row__end">
                    <span className="badge">{o.kind}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card__hd">
              <Icon name="zap" size={15} />
              <b>快捷入口</b>
            </div>
            <div className="card__bd stack stack--sm">
              {[
                { label: '发起一条任务', to: '/tasks/new', icon: 'plus' },
                { label: '查看进行中的任务', to: '/tasks', icon: 'check' },
                { label: '打开 Command Center', to: '/command', icon: 'gauge' },
                { label: '查看规则与阈值', to: '/rules', icon: 'rules' },
              ].map((q) => (
                <button key={q.label} className="btn" onClick={() => navigate(q.to)}>
                  <Icon name={q.icon} size={15} />
                  <span style={{ flex: 1, textAlign: 'left' }}>{q.label}</span>
                  <Icon name="right" size={13} />
                </button>
              ))}
              <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                有 {tasks.filter((t) => t.status !== 'done').length} 条任务未完成
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Page>
  )
}
