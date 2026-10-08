export interface NavItem {
  to: string
  label: string
  icon: string
  keywords?: string
}

export interface NavGroup {
  title?: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    items: [
      { to: '/', label: '首页', icon: 'home', keywords: 'home assistant 助理 简报' },
      { to: '/dashboard', label: '工作台', icon: 'grid', keywords: 'dashboard 驾驶舱' },
      { to: '/tasks', label: '任务', icon: 'check', keywords: 'task 工单 运行' },
      { to: '/projects', label: '项目', icon: 'folder', keywords: 'project' },
      { to: '/resources', label: '资源', icon: 'layers', keywords: 'resource 数据源 本体 知识' },
    ],
  },
  {
    title: 'BUILD',
    items: [
      { to: '/flows', label: 'Flow Library', icon: 'flow', keywords: '流程库 flow 编排' },
      { to: '/approvals', label: 'Flow Approvals', icon: 'approve', keywords: '审批 放权' },
    ],
  },
  {
    title: 'RULES',
    items: [{ to: '/rules', label: 'Rule Manager', icon: 'rules', keywords: '规则 阈值' }],
  },
]

export const footNav: NavItem[] = [
  { to: '/docs', label: '文档', icon: 'book', keywords: 'docs 说明' },
  { to: '/settings', label: '设置', icon: 'gear', keywords: 'settings 租户 权限 模型 集成' },
]

export const allNav: NavItem[] = [...navGroups.flatMap((g) => g.items), ...footNav]

export function findNav(pathname: string): NavItem | undefined {
  return allNav.find((n) => n.to === pathname)
}

export function crumbFor(pathname: string, tail?: string) {
  const seg = pathname.split('/').filter(Boolean)
  if (seg.length === 0) return ['首页']
  const map: Record<string, string> = {
    dashboard: '工作台',
    tasks: '任务',
    projects: '项目',
    resources: '资源',
    flows: 'Flow Library',
    approvals: 'Flow Approvals',
    rules: 'Rule Manager',
    command: 'Command Center',
    docs: '文档',
    settings: '设置',
  }
  const head = map[seg[0]] ?? seg[0]
  const parts = [head]
  if (seg[1]) parts.push(tail ?? (seg[1] === 'new' ? '新建任务' : `#${seg[1]}`))
  return parts
}
