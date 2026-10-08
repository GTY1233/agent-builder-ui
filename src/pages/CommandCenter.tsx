import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Page, PageHead, Section } from '../components/ui/Page'
import { Tabs } from '../components/ui/Tabs'
import { Kpi } from '../components/ui/Kpi'
import { LineChart } from '../components/charts/LineChart'
import { Sparkline } from '../components/charts/Sparkline'
import { BarChart } from '../components/charts/BarChart'
import { Donut } from '../components/charts/Donut'
import { Icon } from '../components/Icon'
import { agents, auditLog, depts } from '../data'
import { ease, modalVariants } from '../lib/motion'

type TabId = 'overview' | 'agents' | 'cost' | 'audit'

const ranges = ['1 天', '30 天', '90 天', '本季', '本年', '自定义']

const valueMain = [17.6, 17.2, 17.0, 16.4, 16.0, 15.6, 15.5, 15.4, 15.6, 16.2, 16.9, 17.4, 17.8, 18.3, 18.7, 19.0, 19.2]
const valuePrior = [17.4, 16.9, 16.4, 15.8, 15.4, 15.1, 15.0, 15.1, 15.5, 16.0, 16.5, 16.9, 17.2, 17.4, 17.6, 17.8, 17.9]

const costBreakdown = [
  { label: '模型调用', value: 6200 },
  { label: '检索工具', value: 2400 },
  { label: '存储', value: 1800 },
  { label: '其他', value: 1600 },
]

export function CommandCenter() {
  const [tab, setTab] = useState<TabId>('overview')
  const [range, setRange] = useState('30 天')
  const [drill, setDrill] = useState(false)

  return (
    <Page>
      <PageHead
        title="Command Center"
        sub="跨平台观测与治理：所有智能体的运行、成本、价值与采纳情况。"
        actions={
          <>
            <div className="ranges">
              {ranges.map((r) => (
                <button key={r} aria-pressed={range === r} onClick={() => setRange(r)}>
                  {r}
                </button>
              ))}
            </div>
            <button className="btn">
              <Icon name="download" size={15} />
              导出
            </button>
          </>
        }
      />

      <Section>
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { id: 'overview', label: '概览' },
            { id: 'agents', label: '智能体' },
            { id: 'cost', label: '成本' },
            { id: 'audit', label: '审计' },
          ]}
        />

        {tab === 'overview' ? (
          <>
            <div className="ccgrid">
              <div className="card cchd">
                <div className="cchd__lbl">综合指数（IIQ）</div>
                <div className="cchd__big num">78.4</div>
                <div className="cchd__note">
                  本月 AI 影响指数上升 2.6 至 78.4，主要由工程条线拉动（+4.1）。需关注：销售条线（−1.2）。
                  数字口径：跨已接入平台汇总，样本为最近 {range}。
                </div>
                <div style={{ marginTop: 10 }}>
                  <button className="link" onClick={() => setDrill(true)}>
                    综合指数怎么算 <Icon name="arrow" size={13} strokeWidth={2} />
                  </button>
                </div>
                <div className="cchd__spark">
                  <Sparkline
                    points={[72, 72.6, 73.5, 74.2, 75, 75.4, 76, 76.8, 77.6, 78.4]}
                    color="#5b6bd6"
                    height={88}
                  />
                </div>
              </div>

              <Kpi value={1700} label="节省工时（小时）" note="+12% 对比前 30 天" format={(n) => `${(n / 1000).toFixed(1)}K`} />
              <Kpi value={100} label="活跃智能体" note="+3 本月" />
              <Kpi value={12} suffix="M" label="累计 Tokens" note="今日 950K Tokens" />
              <Kpi
                value={49}
                prefix="¥"
                suffix="K"
                label="创造价值"
                note="3.4× AI 投入回报 · 点开看模型"
                onClick={() => setDrill(true)}
              />
              <Kpi value={12} prefix="¥" suffix="K" label="总成本" note="−¥12K 对比前 30 天" />
              <Kpi value={2400} label="平台运行次数" note="+20 本月" />
            </div>

            <div className="muted" style={{ fontSize: 11.5, margin: '22px 0 9px', lineHeight: 1.7 }}>
              部门对比：工程条线领先（82.1），市场条线 68.5 落后 13.6 分 —— 建议把工程条线表现最好的 3 个智能体
              复制到市场与销售条线，而不是单纯增加席位数。责任部门：组织发展部。
            </div>

            <div className="card table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>部门</th>
                    <th>综合指数</th>
                    <th>趋势</th>
                    <th>Tokens 用量</th>
                    <th>人均 Tokens</th>
                    <th>活跃智能体</th>
                    <th>平台</th>
                    <th>采纳率</th>
                    <th>价值 · 30 天</th>
                    <th>成本 · 30 天</th>
                  </tr>
                </thead>
                <tbody>
                  {depts.map((d) => (
                    <tr key={d.name}>
                      <td>
                        <div className="dep">
                          <span className="dep__sq">
                            <Icon name="grid" size={13} />
                          </span>
                          <span>
                            <span className="dep__t" style={{ display: 'block' }}>
                              {d.name}
                            </span>
                            <span className="dep__d">{d.licensed} 位已授权用户</span>
                          </span>
                        </div>
                      </td>
                      <td className="num">{d.iq}</td>
                      <td className={d.trend >= 0 ? 'up num' : 'down num'}>
                        {d.trend >= 0 ? '↑' : '↓'} {Math.abs(d.trend)}
                      </td>
                      <td className="num">{d.tokens}</td>
                      <td className="num">{d.perUser}</td>
                      <td className="num">{d.agents}</td>
                      <td className="muted-2">{d.platform}</td>
                      <td className="num">
                        {d.adoption}%
                        <span className="bar">
                          <i style={{ width: `${d.adoption}%` }} />
                        </span>
                      </td>
                      <td className="num">
                        {d.value}
                        <div className="muted" style={{ fontSize: 10.5 }}>
                          {d.valueNote}
                        </div>
                      </td>
                      <td className="num">{d.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {tab === 'agents' ? (
          <div className="grid grid--2" style={{ marginTop: 18 }}>
            <div className="card">
              <div className="card__hd">
                <Icon name="activity" size={15} />
                <b>各条线活跃智能体数</b>
              </div>
              <div className="card__bd">
                <BarChart
                  data={depts.map((d) => ({ label: d.name.replace('条线', ''), value: d.agents }))}
                  height={170}
                />
              </div>
            </div>
            <div className="card">
              <div className="card__hd">
                <Icon name="spark" size={15} />
                <b>智能体运行排行（24 小时）</b>
              </div>
              <div>
                {[...agents]
                  .sort((a, b) => b.runs24h - a.runs24h)
                  .map((a) => (
                    <div className="list-row" key={a.id}>
                      <span className="list-row__icon">
                        <Icon name="spark" size={13} />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div className="list-row__t">{a.name}</div>
                        <div className="list-row__d">
                          {a.domain} · 平均 {a.latency}
                        </div>
                      </div>
                      <div className="list-row__end">
                        <span className="num" style={{ fontWeight: 600 }}>
                          {a.runs24h}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : null}

        {tab === 'cost' ? (
          <div className="grid grid--2" style={{ marginTop: 18 }}>
            <div className="card">
              <div className="card__hd">
                <Icon name="database" size={15} />
                <b>成本构成（30 天）</b>
              </div>
              <div className="card__bd">
                <BarChart data={costBreakdown} height={170} unit=" 元" color="var(--amber)" />
              </div>
            </div>
            <div className="card">
              <div className="card__hd">
                <Icon name="gauge" size={15} />
                <b>投入产出</b>
              </div>
              <div className="card__bd">
                <div className="row" style={{ gap: 24 }}>
                  <Donut value={340} total={100} size={120} thickness={11} label="回报倍数" />
                  <div className="stack stack--sm">
                    <div>
                      <div className="num" style={{ fontSize: 20, fontWeight: 650 }}>
                        ¥49K
                      </div>
                      <div className="muted" style={{ fontSize: 11 }}>
                        创造价值
                      </div>
                    </div>
                    <div>
                      <div className="num" style={{ fontSize: 20, fontWeight: 650 }}>
                        ¥12K
                      </div>
                      <div className="muted" style={{ fontSize: 11 }}>
                        总成本
                      </div>
                    </div>
                  </div>
                </div>
                <p className="muted-2" style={{ fontSize: 12.4, marginTop: 16 }}>
                  价值创造为 AI 投入的 3.4 倍。差额来自采纳红利：把日常重复工作迁到智能体流程上，
                  比单纯增加席位更快拉高倍数。
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {tab === 'audit' ? (
          <div className="card table-wrap" style={{ marginTop: 18 }}>
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
      </Section>

      <AnimatePresence>
        {drill ? (
          <>
            <motion.div
              className="veil"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setDrill(false)}
            />
            <div className="modal-wrap">
              <motion.div
                className="modal"
                variants={modalVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                transition={{ duration: 0.24, ease }}
              >
                <button className="icon-btn modal__x" onClick={() => setDrill(false)}>
                  <Icon name="x" />
                </button>
                <div className="modal__kick">最近 30 天 · 价值模型</div>
                <div className="modal__top">
                  <div className="modal__big">¥49K</div>
                  <div className="modal__cap">由「节省工时 × 人力成本 + 影响半径」建模</div>
                </div>
                <div className="modal__say">
                  创造价值为 AI 投入的 3.4 倍 —— 差额就是采纳红利。把日常重复工作迁到智能体流程上，
                  比单纯增加席位更快拉高这个倍数。
                </div>
                <LineChart
                  series={[
                    { points: valueMain, color: '#6c5ce7', fill: true },
                    { points: valuePrior, color: '#9aa2bc', dashed: true },
                  ]}
                  yLabels={['¥18.5K', '¥16.9K', '¥15.3K', '¥13.8K']}
                  xLabels={['30 天前', '前 30 天', '今天']}
                  height={200}
                />
                <div className="stat-grid">
                  <div className="stat">
                    <div className="stat__n">¥14.7K</div>
                    <div className="stat__l">低</div>
                  </div>
                  <div className="stat">
                    <div className="stat__n">¥16.4K</div>
                    <div className="stat__l">均值</div>
                  </div>
                  <div className="stat">
                    <div className="stat__n">¥18.5K</div>
                    <div className="stat__l">高</div>
                  </div>
                  <div className="stat">
                    <div className="stat__n">+5.8%</div>
                    <div className="stat__l">对比前 30 天</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>
    </Page>
  )
}
