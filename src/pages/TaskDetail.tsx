import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Page, PageHead, Section } from '../components/ui/Page'
import { Tabs } from '../components/ui/Tabs'
import { IntegrityBlock } from '../components/ui/IntegrityBlock'
import { StatusBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { Icon } from '../components/Icon'
import { findTask, tasks } from '../data'
import { useUi } from '../store/ui'

type TabId = 'brief' | 'runs' | 'evidence' | 'talk'

const executions = [
  { name: '岗位分诊', at: '13:44:02', dur: '0.8s', note: '判定为「中级 · 市场」，走标准链路' },
  { name: 'JD 撰写', at: '13:44:03', dur: '6.1s', note: '生成了 1 份职位描述草案' },
  { name: '候选人寻访', at: '13:44:09', dur: '0.2s', note: '未找到可用的实时检索工具，节点挂起' },
  { name: '初筛 / 名单核验 / 简报生成', at: '—', dur: '—', note: '因上游挂起，未执行', todo: true },
]

const evidence = [
  { name: '人才市场公开岗位', rows: '口径内 1,284 条', state: '可读', tone: 'badge badge--green' },
  { name: '企业内部岗位库', rows: '142 条', state: '可读', tone: 'badge badge--green' },
  { name: '实时检索工具', rows: '未接入', state: '缺失', tone: 'badge badge--red' },
]

export function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useUi((s) => s.toast)
  const task = findTask(id)
  const [tab, setTab] = useState<TabId>('brief')
  const [comments, setComments] = useState([
    { who: '周然', at: '今天 10:20', text: '这条挂了是因为检索工具没接进来，先把工具接上再重跑，别手工补候选人。' },
    { who: '李楠', at: '今天 10:32', text: '同意。重跑后我直接看入围名单，另外简报里把地点写成「华东」而不是上海。' },
  ])
  const [draft, setDraft] = useState('')

  if (!task) {
    return (
      <Page>
        <PageHead title="任务不存在" sub={`没有找到编号为 ${id} 的任务。`} />
        <Section>
          <EmptyState
            icon="check"
            title="换一条任务看看"
            body="任务编号可能已经变化，或者这条任务属于其他租户。"
            action={
              <button className="btn btn--primary" onClick={() => navigate('/tasks')}>
                返回任务列表
              </button>
            }
          />
        </Section>
      </Page>
    )
  }

  return (
    <Page>
      <PageHead
        title={task.title}
        sub={`#${task.id} · ${task.code} · ${task.flow} · 创建于 ${task.createdAt}`}
        actions={
          <>
            <StatusBadge status={task.status} />
            <button className="btn" onClick={() => toast('已触发重跑（演示，不会真正执行）')}>
              <Icon name="refresh" size={15} />
              重跑
            </button>
            <button className="btn" onClick={() => toast('已导出简报（演示）')}>
              <Icon name="download" size={15} />
              导出
            </button>
            <button className="btn" onClick={() => toast('已归档（演示）')}>
              <Icon name="archive" size={15} />
              归档
            </button>
          </>
        }
      />

      <Section>
        <div className="split">
          <div className="card card--pad">
            <div style={{ fontSize: 15, fontWeight: 660 }}>任务 #{task.id}</div>

            <div className="field-block">
              <div className="k">编号</div>
              <div className="field-block__v mono">{task.code}</div>
            </div>
            <div className="field-block">
              <div className="k">标题</div>
              <div className="field-block__v">{task.title}</div>
            </div>
            <div className="field-block">
              <div className="k">描述</div>
              <div className="field-block__v">
                执行「{task.flow}」流程。生成完整职位描述，寻访符合条件的人选，核验其背景，安排初筛，筛出终面名单，
                并产出一份给业务负责人的简报。
              </div>
            </div>
            <div className="field-block">
              <div className="k">附加信息</div>
              <div className="field-block__v kv-inline">
                <span>
                  <span className="k">来源</span>
                  <br />
                  {task.source}
                </span>
                <span>
                  <span className="k">创建时间</span>
                  <br />
                  {task.createdAt}
                </span>
                <span>
                  <span className="k">流程</span>
                  <br />
                  {task.flow}
                </span>
                <span>
                  <span className="k">负责人</span>
                  <br />
                  {task.owner}
                </span>
              </div>
            </div>

            <IntegrityBlock
              items={[
                { kind: 'warn', label: '原因', detail: '当前环境未接入实时检索工具' },
                {
                  kind: 'warn',
                  label: '数据完整性',
                  detail: '未产出任何虚构候选人 —— 因缺少真实数据接入，流程已挂起',
                },
                {
                  kind: 'act',
                  label: '待人工动作',
                  detail: '接入检索工具或等价数据源后重跑本任务',
                },
              ]}
            />

            <div className="runs row" style={{ marginTop: 14 }}>
              <span className="badge">执行次数</span>
              <span className="num">{task.runs}</span>
              <div className="spacer" />
              <button className="link" onClick={() => setTab('runs')}>
                查看执行记录 <Icon name="arrow" size={13} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="card">
            <div style={{ padding: '4px 18px 0' }}>
              <Tabs
                value={tab}
                onChange={setTab}
                items={[
                  { id: 'brief', label: '简报' },
                  { id: 'runs', label: '执行记录' },
                  { id: 'evidence', label: '证据与来源' },
                  { id: 'talk', label: '评论' },
                ]}
              />
            </div>

            <div style={{ padding: '20px 26px 26px' }}>
              {tab === 'brief' ? (
                <div className="doc">
                  <div className="doc__meta">{task.createdAt} 13:51</div>
                  <h2>产品市场经理 · 华东</h2>
                  <div className="doc__sub">招聘漏斗简报</div>

                  <h3>1. 角色概览</h3>
                  <table className="doctable">
                    <thead>
                      <tr>
                        <th>项目</th>
                        <th>详情</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>职位</td>
                        <td>产品市场经理</td>
                      </tr>
                      <tr>
                        <td>地点</td>
                        <td>中国 · 华东</td>
                      </tr>
                      <tr>
                        <td>部门</td>
                        <td>市场部 · 产品市场</td>
                      </tr>
                      <tr>
                        <td>层级</td>
                        <td>中级（经理）</td>
                      </tr>
                      <tr>
                        <td>核心关注</td>
                        <td>GTM 策略、产品定位、销售赋能，以及面向企业级软件的市场研究</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>2. 职位描述</h3>
                  <div className="statusline">
                    <Icon name="alert" size={14} strokeWidth={2} />
                    <span>
                      <b>状态：部分完成</b> —— 职位描述已由「JD 撰写」节点生成，但完整职位正文未返回，需要接入
                      检索工具后重跑；在补齐之前，本简报不提供候选人名单。
                    </span>
                  </div>

                  <h3>3. 结论与限制</h3>
                  <p className="muted-2" style={{ fontSize: 13 }}>
                    本次执行只完成了角色定义部分。按规则「无来源不得产出」，系统没有生成任何候选人，
                    也没有用通用描述填充名单。补齐数据源后重跑即可得到完整简报，历史执行记录会保留。
                  </p>
                </div>
              ) : null}

              {tab === 'runs' ? (
                <div className="timeline">
                  {executions.map((e) => (
                    <div className="tl-item" key={e.name}>
                      <span
                        className={`tl-item__dot${e.todo ? ' tl-item__dot--todo' : ' tl-item__dot--done'}`}
                      />
                      <div>
                        <div className="row" style={{ gap: 10 }}>
                          <span className="tl-item__t">{e.name}</span>
                          <span className="muted mono" style={{ fontSize: 11 }}>
                            {e.at} · {e.dur}
                          </span>
                        </div>
                        <div className="tl-item__d">{e.note}</div>
                      </div>
                    </div>
                  ))}
                  <div className="row" style={{ marginTop: 18 }}>
                    <button className="btn" onClick={() => toast('已展开节点级输入输出（演示）')}>
                      <Icon name="layers" size={15} />
                      节点级输入输出
                    </button>
                    <button className="btn" onClick={() => toast('已从挂起节点续跑（演示）')}>
                      <Icon name="refresh" size={15} />
                      从挂起节点重跑
                    </button>
                  </div>
                </div>
              ) : null}

              {tab === 'evidence' ? (
                <div className="stack">
                  {evidence.map((e) => (
                    <div className="card" key={e.name}>
                      <div className="list-row" style={{ borderBottom: 0 }}>
                        <div className="list-row__icon">
                          <Icon name="database" size={14} />
                        </div>
                        <div>
                          <div className="list-row__t">{e.name}</div>
                          <div className="list-row__d">{e.rows}</div>
                        </div>
                        <div className="list-row__end">
                          <span className={e.tone}>{e.state}</span>
                          <button
                            className="icon-btn icon-btn--sm"
                            title="查看依据"
                            onClick={() => toast('打开来源明细（演示）')}
                          >
                            <Icon name="upRight" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="muted" style={{ fontSize: 11.5 }}>
                    每条结论都必须能点回来源；没有来源的内容不会出现在简报里。
                  </div>
                </div>
              ) : null}

              {tab === 'talk' ? (
                <div className="stack">
                  {comments.map((c) => (
                    <div className="row row--top" key={c.at} style={{ gap: 12 }}>
                      <div className="avatar">{c.who.slice(0, 1)}</div>
                      <div style={{ minWidth: 0 }}>
                        <div className="row" style={{ gap: 8 }}>
                          <b style={{ fontSize: 12.5 }}>{c.who}</b>
                          <span className="muted" style={{ fontSize: 11 }}>
                            {c.at}
                          </span>
                        </div>
                        <div style={{ fontSize: 12.8 }}>{c.text}</div>
                      </div>
                    </div>
                  ))}
                  <div className="row" style={{ gap: 10, marginTop: 6 }}>
                    <input
                      className="input"
                      value={draft}
                      placeholder="写下你的意见，会跟任务一起留痕"
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && draft.trim()) {
                          setComments((c) => [
                            ...c,
                            { who: '李楠', at: '刚刚', text: draft.trim() },
                          ])
                          setDraft('')
                        }
                      }}
                    />
                    <button
                      className="btn btn--accent"
                      onClick={() => {
                        if (!draft.trim()) return
                        setComments((c) => [...c, { who: '李楠', at: '刚刚', text: draft.trim() }])
                        setDraft('')
                      }}
                    >
                      发送
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="card" style={{ marginTop: 18 }}>
          <div className="card__hd">
            <b>同流程的其他任务</b>
            <div className="spacer" />
            <button className="link" onClick={() => navigate('/tasks')}>
              全部 <Icon name="arrow" size={13} strokeWidth={2} />
            </button>
          </div>
          <div>
            {tasks
              .filter((t) => t.flow === task.flow && t.id !== task.id)
              .slice(0, 3)
              .map((t) => (
                <div
                  className="list-row list-row--click"
                  key={t.id}
                  onClick={() => navigate(`/tasks/${t.id}`)}
                >
                  <div className="list-row__icon">
                    <Icon name="check" size={14} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="list-row__t">{t.title}</div>
                    <div className="list-row__d">
                      #{t.id} · {t.source} · {t.createdAt}
                    </div>
                  </div>
                  <div className="list-row__end">
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Section>
    </Page>
  )
}
