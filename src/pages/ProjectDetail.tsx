import { useNavigate, useParams } from 'react-router-dom'
import { Page, PageHead, Section } from '../components/ui/Page'
import { Kpi } from '../components/ui/Kpi'
import { StatusBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { Icon } from '../components/Icon'
import { findProject, tasks } from '../data'

const milestones = [
  { t: '项目立项', d: '10-01', state: 'done' as const },
  { t: '需求与口径对齐', d: '10-03', state: 'done' as const },
  { t: '流程与数据源接入', d: '10-12', state: 'now' as const },
  { t: '名单交付与复盘', d: '12-20', state: 'todo' as const },
]

const members = [
  { name: '李楠', role: '负责人' },
  { name: '周然', role: '协作' },
  { name: '陈曦', role: '协作' },
]

export function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = findProject(id)

  if (!project) {
    return (
      <Page>
        <PageHead title="项目不存在" sub={`没有找到编号为 ${id} 的项目。`} />
        <Section>
          <EmptyState
            icon="folder"
            title="换一个项目看看"
            body="项目编号可能已经变化，或者这个项目属于其他租户。"
            action={
              <button className="btn btn--primary" onClick={() => navigate('/projects')}>
                返回项目列表
              </button>
            }
          />
        </Section>
      </Page>
    )
  }

  const related = tasks.slice(0, 4)

  return (
    <Page>
      <PageHead
        title={project.name}
        sub={`${project.goal} · ${project.window}`}
        actions={
          <>
            <span
              className={
                project.status === '已交付'
                  ? 'badge badge--green'
                  : project.status === '待评审'
                    ? 'badge badge--amber'
                    : 'badge badge--violet'
              }
            >
              {project.status}
            </span>
            <button className="btn">
              <Icon name="user" size={15} />
              成员
            </button>
          </>
        }
      />

      <Section>
        <div className="grid grid--4">
          <Kpi value={project.tasks} label="关联任务" note={`${project.done} 条已完成`} />
          <Kpi value={project.progress} suffix="%" label="完成度" note="按验收口径计算" />
          <Kpi value={3} label="参与人" note={project.owner + ' 负责'} />
          <Kpi value={2} label="开放问题" note="1 条需要你介入" />
        </div>
      </Section>

      <Section>
        <div className="split" style={{ marginTop: 18 }}>
          <div className="card">
            <div className="card__hd">
              <Icon name="clock" size={15} />
              <b>里程碑</b>
            </div>
            <div className="card__bd">
              <div className="timeline">
                {milestones.map((m) => (
                  <div className="tl-item" key={m.t}>
                    <span
                      className={`tl-item__dot${m.state === 'done' ? ' tl-item__dot--done' : m.state === 'todo' ? ' tl-item__dot--todo' : ''}`}
                    />
                    <div>
                      <div className="tl-item__t">{m.t}</div>
                      <div className="tl-item__d">{m.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="stack">
            <div className="card">
              <div className="card__hd">
                <Icon name="user" size={15} />
                <b>成员</b>
              </div>
              <div>
                {members.map((m) => (
                  <div className="list-row" key={m.name}>
                    <div className="avatar avatar--sm">{m.name.slice(0, 1)}</div>
                    <div className="list-row__t">{m.name}</div>
                    <div className="list-row__end">
                      <span className="badge">{m.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card__hd">
                <Icon name="database" size={15} />
                <b>使用的数据源</b>
              </div>
              <div className="card__bd stack stack--sm">
                {['人才市场公开岗位', '企业内部岗位库', '简历语料'].map((s) => (
                  <div className="row" key={s} style={{ gap: 9 }}>
                    <Icon name="database" size={15} className="muted" />
                    <span style={{ fontSize: 12.6 }}>{s}</span>
                  </div>
                ))}
                <button className="link" onClick={() => navigate('/resources')}>
                  资源总览 <Icon name="arrow" size={13} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="card table-wrap" style={{ marginTop: 18 }}>
          <div className="card__hd">
            <b>关联任务</b>
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
                <th>流程</th>
                <th>负责人</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {related.map((t) => (
                <tr key={t.id} onClick={() => navigate(`/tasks/${t.id}`)}>
                  <td className="mono">#{t.id}</td>
                  <td style={{ fontWeight: 600 }}>{t.title}</td>
                  <td>{t.flow}</td>
                  <td>{t.owner}</td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </Page>
  )
}
