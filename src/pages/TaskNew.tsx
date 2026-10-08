import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Page, Section } from '../components/ui/Page'
import { Icon } from '../components/Icon'
import { flows } from '../data'
import { useUi } from '../store/ui'
import { ease, spring } from '../lib/motion'

const selected = ['talent', 'resume', 'social']

const runSteps = [
  '解析意图，匹配流程',
  '检索可用数据源',
  '执行流程节点（JD 撰写 → 寻访 → 初筛）',
  '生成简报并留存执行记录',
]

export function TaskNew() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useUi((s) => s.toast)
  const [mode, setMode] = useState<'task' | 'team'>('task')
  const [text, setText] = useState('')
  const [flowId, setFlowId] = useState('talent')
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState(-1)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const prefill = (location.state as { prefill?: string } | null)?.prefill
    if (prefill) setText(prefill)
  }, [location.state])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const flow = flows.find((f) => f.id === flowId) ?? flows[0]

  function start() {
    const v = text.trim()
    if (!v) {
      toast('先描述一下你要做什么')
      return
    }
    if (running) return
    setRunning(true)
    setStep(0)
    runSteps.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStep(i + 1), 620 * (i + 1)))
    })
    timers.current.push(
      window.setTimeout(() => {
        setRunning(false)
        navigate('/tasks/1499')
        toast('任务已生成，注意数据完整性提示')
      }, 620 * runSteps.length + 420),
    )
  }

  return (
    <Page>
      <Section>
        <div className="seg" style={{ margin: '0 auto' }}>
          <button aria-pressed={mode === 'task'} onClick={() => setMode('task')}>
            新建任务
          </button>
          <button aria-pressed={mode === 'team'} onClick={() => setMode('team')}>
            创建团队
          </button>
        </div>
      </Section>

      <Section>
        <div className="hi">你好</div>
      </Section>

      {mode === 'task' ? (
        <Section>
          <div className="composer">
            <div className="compbox">
              <textarea
                value={text}
                placeholder="我需要招聘一位产品市场经理"
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    start()
                  }
                }}
              />
              <div className="comprow">
                <button className="icon-btn icon-btn--sm" title="添加附件">
                  <Icon name="clip" size={16} />
                </button>
                <button className="icon-btn icon-btn--sm" title="语音输入">
                  <Icon name="mic" size={16} />
                </button>
                <div className="mode">
                  <span className="dot" />
                  计划模式
                </div>
                <div className="hint">⌘ ↵ 开始 · 拖入文件</div>
                <button
                  className={`send${text.trim() ? ' send--ready' : ''}`}
                  onClick={start}
                  title="开始"
                >
                  <Icon name="send" size={16} />
                </button>
              </div>
            </div>

            <div className="runwith">
              <div className="runwith__lbl">RUN WITH</div>
              <div className="flowchips">
                {flows
                  .filter((f) => selected.includes(f.id))
                  .map((f) => (
                    <button
                      key={f.id}
                      className={`chip${flowId === f.id ? ' chip--on' : ''}`}
                      onClick={() => setFlowId(f.id)}
                    >
                      {flowId === f.id ? (
                        <Icon name="check" size={13} strokeWidth={2.2} />
                      ) : null}
                      {f.name}
                    </button>
                  ))}
                <button
                  className="chip"
                  onClick={() => {
                    toast('流程库里有 6 条流程，可搜索或按条线筛选')
                    navigate('/flows')
                  }}
                >
                  更多流程
                  <Icon name="upRight" size={13} strokeWidth={2} />
                </button>
              </div>
              <div className="flowdesc">{flow.desc}</div>
            </div>

            <div className="ver">
              团队版本 <span className="box">{flow.version}（当前）</span>
            </div>
          </div>
        </Section>
      ) : (
        <Section>
          <div className="composer">
            <div className="card card--pad">
              <h3 style={{ fontSize: 14.5, marginBottom: 8 }}>创建团队</h3>
              <p className="muted-2" style={{ fontSize: 12.8, marginBottom: 14 }}>
                团队 = 一组共享流程版本、数据源与放权档位的人。创建后，团队成员看到的工作台与任务队列按角色裁剪。
              </p>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="team-name">团队名称</label>
                  <input id="team-name" className="input" placeholder="例如：人才招聘小组" />
                </div>
                <div className="field">
                  <label htmlFor="team-owner">负责人</label>
                  <input id="team-owner" className="input" defaultValue="李楠" />
                </div>
                <div className="field full">
                  <label htmlFor="team-flows">初始流程</label>
                  <div className="row wrap" style={{ gap: 8, marginTop: 4 }}>
                    {flows.slice(0, 4).map((f) => (
                      <span className="chip chip--on" key={f.id}>
                        {f.name}
                      </span>
                    ))}
                    <button className="chip" onClick={() => navigate('/flows')}>
                      <Icon name="plus" size={13} />
                      添加
                    </button>
                  </div>
                </div>
              </div>
              <div className="row" style={{ marginTop: 18 }}>
                <button className="btn btn--accent" onClick={() => toast('团队创建为演示操作，未真正写入')}>
                  创建团队
                </button>
                <button className="btn" onClick={() => setMode('task')}>
                  返回
                </button>
              </div>
            </div>
          </div>
        </Section>
      )}

      <AnimatePresence>
        {running ? (
          <motion.div
            className="runveil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="runbox"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...spring }}
            >
              <h3>正在执行「{flow.name}」</h3>
              <div className="runbox__s">已收到：{text.trim()}</div>
              {runSteps.map((s, i) => (
                <div
                  className={`step${i < step ? ' step--done' : i === step ? ' step--now' : ''}`}
                  key={s}
                >
                  <span className="step__b">
                    {i < step ? <Icon name="check" size={10} strokeWidth={2.6} /> : null}
                  </span>
                  {s}
                </div>
              ))}
              <div className="progress" style={{ marginTop: 16 }}>
                <motion.i
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((step + 1) / runSteps.length) * 100)}%` }}
                  transition={{ duration: 0.4, ease }}
                  style={{ display: 'block', height: '100%', background: 'var(--violet)' }}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Page>
  )
}
