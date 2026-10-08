export type TaskStatus = 'todo' | 'review' | 'ready' | 'done' | 'blocked'
export type RunState = 'idle' | 'running' | 'done' | 'blocked'

export interface TaskRow {
  id: string
  code: string
  title: string
  flow: string
  source: '手动创建' | '定时触发' | '事件触发' | '流程派生'
  status: TaskStatus
  runs: number
  createdAt: string
  owner: string
  attention?: string
}

export interface FlowStep {
  name: string
  desc: string
  node: string
}

export interface FlowDef {
  id: string
  name: string
  domain: string
  owner: string
  version: string
  desc: string
  steps: FlowStep[]
  runs: number
  success: number
  gate: string
  inputs: string[]
  outputs: string[]
  sources: string[]
}

export interface ProjectRow {
  id: string
  name: string
  goal: string
  tasks: number
  done: number
  progress: number
  owner: string
  status: '进行中' | '待评审' | '已交付'
  window: string
}

export interface DataSourceRow {
  id: string
  name: string
  type: string
  cadence: string
  lastSync: string
  coverage: number
  status: '正常' | '延迟' | '缺数'
}

export interface AgentRow {
  id: string
  name: string
  domain: string
  owner: string
  state: '在线' | '休眠' | '需人工'
  runs24h: number
  latency: string
}

export interface ApprovalRow {
  id: string
  flow: string
  change: string
  submitter: string
  tier: '只读' | '可写' | '永久人审'
  risk: '低' | '中' | '高'
  waiting: string
}

export interface RuleRow {
  id: string
  name: string
  scope: string
  threshold: string
  applies: string
  updatedBy: string
  updatedAt: string
  on: boolean
}

export interface DocItem {
  id: string
  title: string
  section: string
  updated: string
  body: { h?: string; p?: string; ul?: string[] }[]
}

export interface DeptRow {
  name: string
  licensed: number
  iq: number
  trend: number
  tokens: string
  perUser: string
  agents: number
  platform: string
  adoption: number
  value: string
  valueNote: string
  cost: string
}

export const workspaces = ['演示租户'] as const

export const tasks: TaskRow[] = [
  {
    id: '1499',
    code: 'MANUAL-A1C46AA2BFD',
    title: '招聘产品市场经理（华东）',
    flow: '人才招聘',
    source: '手动创建',
    status: 'review',
    runs: 1,
    createdAt: '2026-10-04',
    owner: '李楠',
    attention: '缺少实时检索工具，已挂起',
  },
  {
    id: '1498',
    code: 'CRON-7F20B19C4A31',
    title: '岗位画像周度刷新 · 数据治理条线',
    flow: '岗位画像刷新',
    source: '定时触发',
    status: 'done',
    runs: 12,
    createdAt: '2026-10-04',
    owner: '系统',
  },
  {
    id: '1497',
    code: 'MANUAL-3D9188E07C22',
    title: '网络安全治理与 GRC 负责人 · 候选名单核验',
    flow: '人才招聘',
    source: '手动创建',
    status: 'ready',
    runs: 2,
    createdAt: '2026-10-03',
    owner: '李楠',
  },
  {
    id: '1496',
    code: 'EVENT-58C1A0D94F77',
    title: '新岗位发布事件 → 自动生成角色简报',
    flow: '角色简报生成',
    source: '事件触发',
    status: 'done',
    runs: 3,
    createdAt: '2026-10-03',
    owner: '系统',
  },
  {
    id: '1495',
    code: 'MANUAL-B2E7C4310D5A',
    title: '高级数据治理负责人 · 简历批量解析',
    flow: '简历解析',
    source: '手动创建',
    status: 'review',
    runs: 1,
    createdAt: '2026-10-02',
    owner: '周然',
  },
  {
    id: '1494',
    code: 'FLOW-D9A3F6712E08',
    title: '由「角色简报生成」派生的面试安排',
    flow: '面试安排',
    source: '流程派生',
    status: 'todo',
    runs: 0,
    createdAt: '2026-10-02',
    owner: '周然',
  },
  {
    id: '1493',
    code: 'CRON-2B64E15A9D07',
    title: '人才市场月度简报 · 2026-09',
    flow: '人才市场简报',
    source: '定时触发',
    status: 'done',
    runs: 1,
    createdAt: '2026-10-01',
    owner: '系统',
  },
  {
    id: '1492',
    code: 'MANUAL-6C02E8B74A19',
    title: '社媒策划 · 秋季雇主品牌活动',
    flow: '社媒策划',
    source: '手动创建',
    status: 'blocked',
    runs: 1,
    createdAt: '2026-09-30',
    owner: '陈曦',
    attention: '等待品牌口径确认',
  },
]

export const flows: FlowDef[] = [
  {
    id: 'talent',
    name: '人才招聘',
    domain: '人才',
    owner: '李楠',
    version: 'v7',
    desc: '从职位描述撰写、候选人寻访、面试筛选到终面名单，自动完成并产出一份人可读的结论简报。',
    steps: [
      { name: '岗位分诊', desc: '判断岗位类型与难度', node: 'fn.classify' },
      { name: 'JD 撰写', desc: '生成职位描述草案', node: 'agent.jd-writer' },
      { name: '候选人寻访', desc: '检索可得候选人来源', node: 'tool.search' },
      { name: '初筛', desc: '按硬性条件过滤', node: 'fn.screen' },
      { name: '名单核验', desc: '逐条回溯证据', node: 'agent.verifier' },
      { name: '简报生成', desc: '输出对客可读结论', node: 'agent.reporter' },
    ],
    runs: 1284,
    success: 96.2,
    gate: '入围名单必须逐条带来源；无来源不得产出',
    inputs: ['岗位名称', '地点', '层级', '硬性条件'],
    outputs: ['角色概览', '职位描述', '入围名单', '简报文档'],
    sources: ['人才市场公开岗位', '企业内部岗位库', '简历语料'],
  },
  {
    id: 'resume',
    name: '简历解析',
    domain: '人才',
    owner: '周然',
    version: 'v3',
    desc: '批量解析简历，抽取学历、经历与能力项，按岗位要求打分并输出结构化候选人档案。',
    steps: [
      { name: '文档识别', desc: '版面与字段识别', node: 'fn.ocr' },
      { name: '字段抽取', desc: '学历 / 经历 / 技能', node: 'agent.extractor' },
      { name: '能力映射', desc: '映射到能力项', node: 'fn.map' },
      { name: '匹配打分', desc: '按岗位要求评分', node: 'fn.score' },
    ],
    runs: 742,
    success: 98.1,
    gate: '关键字段缺失的比例超过 10% 时整体降级为草案',
    inputs: ['简历文件', '岗位要求'],
    outputs: ['结构化档案', '能力评分', '缺口说明'],
    sources: ['简历附件', '能力词表'],
  },
  {
    id: 'social',
    name: '社媒策划',
    domain: '市场',
    owner: '陈曦',
    version: 'v2',
    desc: '根据活动目标生成社媒内容排期、文案与配图建议，输出可直接排期的内容日历。',
    steps: [
      { name: '目标解析', desc: '拆解活动目标与人群', node: 'agent.brief' },
      { name: '选题', desc: '生成选题清单', node: 'agent.topic' },
      { name: '文案', desc: '逐条撰写文案', node: 'agent.copy' },
      { name: '排期', desc: '输出内容日历', node: 'fn.schedule' },
    ],
    runs: 318,
    success: 92.7,
    gate: '涉及对外承诺的措辞必须人工确认',
    inputs: ['活动目标', '目标人群', '渠道'],
    outputs: ['选题清单', '文案', '内容日历'],
    sources: ['品牌口径库', '历史投放表现'],
  },
  {
    id: 'radar',
    name: '岗位画像刷新',
    domain: '数据',
    owner: '系统',
    version: 'v5',
    desc: '按条线聚合公开岗位，抽取能力项并刷新画像分布，产出变化与缺口说明。',
    steps: [
      { name: '抓取', desc: '按条线抓取公开岗位', node: 'job.pull' },
      { name: '去重', desc: '按业务键去重', node: 'fn.dedupe' },
      { name: '能力抽取', desc: '抽取能力项与频次', node: 'agent.skill-extract' },
      { name: '聚合', desc: '按条线聚合分布', node: 'fn.aggregate' },
      { name: '变化说明', desc: '生成变化与缺口', node: 'agent.delta' },
    ],
    runs: 2140,
    success: 99.4,
    gate: '样本量低于阈值时不输出结论，只输出样本说明',
    inputs: ['条线清单', '时间窗'],
    outputs: ['画像分布', '能力频次', '变化说明'],
    sources: ['公开招聘岗位', '企业名录', '产业资讯'],
  },
  {
    id: 'brief',
    name: '角色简报生成',
    domain: '人才',
    owner: '李楠',
    version: 'v4',
    desc: '把零散的岗位要求整理成结构化角色简报，供后续寻访与筛选直接消费。',
    steps: [
      { name: '归一化', desc: '统一字段口径', node: 'fn.normalize' },
      { name: '职责拆解', desc: '拆出职责与要求', node: 'agent.decompose' },
      { name: '简报撰写', desc: '输出角色简报', node: 'agent.brief' },
    ],
    runs: 566,
    success: 97.3,
    gate: '职责与要求必须可追溯到输入原文',
    inputs: ['岗位原始描述'],
    outputs: ['角色概览', '职责清单', '要求清单'],
    sources: ['岗位原始描述'],
  },
  {
    id: 'interview',
    name: '面试安排',
    domain: '人才',
    owner: '周然',
    version: 'v1',
    desc: '根据入围名单与面试官日程，产出可执行的面试安排并生成通知草稿。',
    steps: [
      { name: '日程匹配', desc: '匹配面试官空档', node: 'fn.calendar' },
      { name: '排期', desc: '生成面试排期', node: 'fn.schedule' },
      { name: '通知草稿', desc: '生成通知文本', node: 'agent.notice' },
    ],
    runs: 96,
    success: 94.8,
    gate: '通知草稿需人工确认后发出',
    inputs: ['入围名单', '面试官日程'],
    outputs: ['面试排期', '通知草稿'],
    sources: ['日历', '入围名单'],
  },
]

export const projects: ProjectRow[] = [
  {
    id: 'p-talent-2026q4',
    name: '2026 Q4 关键岗位补员',
    goal: '在 12 月底前完成 6 个关键岗位的入围名单交付',
    tasks: 42,
    done: 27,
    progress: 64,
    owner: '李楠',
    status: '进行中',
    window: '2026-10-01 → 2026-12-31',
  },
  {
    id: 'p-skill-map',
    name: '岗位能力画像刷新',
    goal: '把四条线岗位画像刷新到当期版本，并标注样本边界',
    tasks: 18,
    done: 16,
    progress: 89,
    owner: '系统',
    status: '待评审',
    window: '2026-09-01 → 2026-10-15',
  },
  {
    id: 'p-employer-brand',
    name: '雇主品牌秋季活动',
    goal: '产出 6 周内容日历并完成投放效果复盘',
    tasks: 24,
    done: 9,
    progress: 38,
    owner: '陈曦',
    status: '进行中',
    window: '2026-09-15 → 2026-11-30',
  },
  {
    id: 'p-governance',
    name: '智能体治理基线',
    goal: '固化放权档位、阈值与审计留痕，形成可复用的治理配置',
    tasks: 12,
    done: 12,
    progress: 100,
    owner: '周然',
    status: '已交付',
    window: '2026-08-01 → 2026-09-30',
  },
]

export const sources: DataSourceRow[] = [
  { id: 's1', name: '公开招聘岗位', type: '网页采集', cadence: '每日', lastSync: '今天 06:12', coverage: 96, status: '正常' },
  { id: 's2', name: '企业名录', type: '外部数据集', cadence: '每月', lastSync: '10-01 09:30', coverage: 88, status: '正常' },
  { id: 's3', name: '简历语料', type: '内部上传', cadence: '按需', lastSync: '昨天 18:44', coverage: 72, status: '延迟' },
  { id: 's4', name: '品牌口径库', type: '内部维护', cadence: '每月', lastSync: '09-28 11:02', coverage: 64, status: '缺数' },
  { id: 's5', name: '产业资讯', type: 'RSS / 网页', cadence: '每小时', lastSync: '今天 14:00', coverage: 91, status: '正常' },
  { id: 's6', name: '历史投放表现', type: '内部导出', cadence: '每周', lastSync: '10-02 10:15', coverage: 79, status: '正常' },
]

export const agents: AgentRow[] = [
  { id: 'a1', name: 'JD 撰写', domain: '人才', owner: '李楠', state: '在线', runs24h: 268, latency: '4.2s' },
  { id: 'a2', name: '候选人核验', domain: '人才', owner: '李楠', state: '在线', runs24h: 143, latency: '11.8s' },
  { id: 'a3', name: '简历抽取', domain: '人才', owner: '周然', state: '在线', runs24h: 512, latency: '2.6s' },
  { id: 'a4', name: '能力抽取', domain: '数据', owner: '系统', state: '在线', runs24h: 890, latency: '3.1s' },
  { id: 'a5', name: '变化说明', domain: '数据', owner: '系统', state: '需人工', runs24h: 24, latency: '9.4s' },
  { id: 'a6', name: '文案撰写', domain: '市场', owner: '陈曦', state: '休眠', runs24h: 18, latency: '6.7s' },
]

export const approvals: ApprovalRow[] = [
  { id: 'ap1', flow: '人才招聘', change: '新增「入围名单核验」节点', submitter: '李楠', tier: '永久人审', risk: '中', waiting: '4 小时' },
  { id: 'ap2', flow: '岗位画像刷新', change: '样本量阈值 200 → 320', submitter: '系统', tier: '只读', risk: '低', waiting: '1 天' },
  { id: 'ap3', flow: '社媒策划', change: '开启「对外措辞人工确认」Gate', submitter: '陈曦', tier: '永久人审', risk: '高', waiting: '2 天' },
  { id: 'ap4', flow: '简历解析', change: '降级阈值 10% → 8%', submitter: '周然', tier: '可写', risk: '中', waiting: '5 天' },
]

export const approvalHistory: { flow: string; change: string; by: string; at: string; result: '通过' | '退回' }[] = [
  { flow: '面试安排', change: '新增通知草稿节点', by: '周然', at: '10-04 15:20', result: '通过' },
  { flow: '社媒策划', change: '渠道从 3 个扩展到 5 个', by: '陈曦', at: '10-02 11:08', result: '退回' },
  { flow: '人才招聘', change: '简报模板改为两段式', by: '李楠', at: '09-30 09:41', result: '通过' },
]

export const rules: RuleRow[] = [
  { id: 'r1', name: '无来源不得产出', scope: '全局', threshold: '硬门禁', applies: '全部流程', updatedBy: '周然', updatedAt: '09-30', on: true },
  { id: 'r2', name: '样本量下限', scope: '数据条线', threshold: '≥ 320 条', applies: '岗位画像刷新', updatedBy: '系统', updatedAt: '10-02', on: true },
  { id: 'r3', name: '字段缺失降级线', scope: '人才条线', threshold: '≤ 8%', applies: '简历解析', updatedBy: '周然', updatedAt: '10-01', on: true },
  { id: 'r4', name: '对外措辞人工确认', scope: '市场条线', threshold: '强制', applies: '社媒策划', updatedBy: '陈曦', updatedAt: '10-03', on: true },
  { id: 'r5', name: '越权访问零变更', scope: '全局', threshold: '硬门禁', applies: '全部流程', updatedBy: '周然', updatedAt: '09-28', on: true },
  { id: 'r6', name: '金额类结论双人复核', scope: '全局', threshold: '强制', applies: '全部流程', updatedBy: '李楠', updatedAt: '09-26', on: false },
]

export const docs: DocItem[] = [
  {
    id: 'd1',
    title: '如何发起一条任务',
    section: '快速上手',
    updated: '10-04',
    body: [
      { p: '在工作台点「新建任务」，或者直接按 ⌘K 打开命令面板搜索流程。' },
      { h: '一次任务的完整生命周期' },
      { ul: ['选择流程（RUN WITH）：决定这条任务会执行哪些节点。', '写下需求：用自然语言描述你要的结果即可。', '执行：节点按顺序跑，每一步的输入输出都会留痕。', '验收：如果是人审档位的节点，会回到你的「我的工作」。'] },
      { h: '怎么判断结果能不能用' },
      { p: '任务详情里有「数据来源与完整性」区块。只要缺少必要数据，流程会挂起并告诉你需要做什么，而不是编一个看起来完整的答案。' },
    ],
  },
  {
    id: 'd2',
    title: '流程（Flow）与节点',
    section: '概念说明',
    updated: '10-02',
    body: [
      { p: '流程是可复用的执行链路：谁在什么条件下、用哪些数据、产出什么。它由节点组成，节点可以是确定性函数，也可以是智能体。' },
      { h: '节点类型' },
      { ul: ['fn.*：确定性计算，结果可复现。', 'agent.*：需要判断的环节，输出要带依据。', 'tool.*：对外部数据源的访问，受权限与额度控制。'] },
      { p: '每个节点都有独立的输入输出与缓存，所以可以只重跑其中一个节点。' },
    ],
  },
  {
    id: 'd3',
    title: '放权档位与审批',
    section: '治理',
    updated: '09-30',
    body: [
      { p: '每条流程都带一个放权档位，决定它可以做什么。' },
      { ul: ['只读：只产出建议，不写回任何系统。', '可写：可以在受控范围内写入，但必须留痕。', '永久人审：任何对外承诺、金额、人事决定都必须有人签字。'] },
      { p: '档位变更走 Flow Approvals，审批通过后全流程生效，并且可以回滚。' },
    ],
  },
  {
    id: 'd4',
    title: '规则与阈值',
    section: '治理',
    updated: '10-03',
    body: [
      { p: '规则是对流程的硬约束：无来源不得产出、样本量下限、字段缺失降级线等。' },
      { h: '修改规则会发生什么' },
      { ul: ['改一次，所有引用该规则的流程同时生效。', '全部变更留痕，可一键回到上一版。', '被拦住的运行会记录为非「系统失败」，而是「正确阻断」。'] },
    ],
  },
  {
    id: 'd5',
    title: 'Command Center 怎么看',
    section: '治理',
    updated: '10-01',
    body: [
      { p: 'Command Center 回答三个问题：用了多少、产出多少、值不值。' },
      { ul: ['综合指数（IIQ）衡量一个条线把 AI 用进日常工作的程度。', '创造价值由「节省工时 × 人力成本 + 影响半径」建模，可下钻看算法。', '采纳率低但成本高的条线，优先做流程下沉而不是加席位。'] },
    ],
  },
]

export const depts: DeptRow[] = [
  { name: '工程条线', licensed: 155, iq: 82.1, trend: 4.1, tokens: '49M', perUser: '2.2M', agents: 46, platform: 'Catalyst +7', adoption: 50, value: '¥9.6K', valueNote: '3.6K 小时', cost: '¥3.6K' },
  { name: '销售条线', licensed: 40, iq: 74.3, trend: -1.2, tokens: '15M', perUser: '1.1M', agents: 13, platform: 'Copilot +5', adoption: 43, value: '¥1K', valueNote: '1.8K 小时', cost: '¥1.8K' },
  { name: '市场条线', licensed: 20, iq: 71.8, trend: 2, tokens: '9M', perUser: '1.6M', agents: 10, platform: 'Catalyst +4', adoption: 40, value: '¥5.2K', valueNote: '708 小时', cost: '¥708' },
  { name: '财务条线', licensed: 18, iq: 69.4, trend: 0.6, tokens: '6M', perUser: '0.9M', agents: 7, platform: 'Catalyst +2', adoption: 33, value: '¥3.1K', valueNote: '402 小时', cost: '¥540' },
]

export const auditLog: { at: string; who: string; what: string; target: string; result: '通过' | '阻断' | '退回' }[] = [
  { at: '今天 14:02', who: '系统', what: '规则命中：样本量下限', target: '岗位画像刷新', result: '阻断' },
  { at: '今天 11:47', who: '李楠', what: '确认入围名单', target: '任务 #1497', result: '通过' },
  { at: '今天 09:18', who: '周然', what: '修改阈值 8%', target: '简历解析', result: '通过' },
  { at: '昨天 18:44', who: '陈曦', what: '对外措辞未确认', target: '社媒策划 · 秋季活动', result: '退回' },
  { at: '昨天 16:30', who: '系统', what: '越权访问拦截', target: '跨条线数据请求', result: '阻断' },
]

export function findTask(id: string | undefined): TaskRow | undefined {
  return tasks.find((t) => t.id === id)
}

export function findFlow(id: string | undefined): FlowDef | undefined {
  return flows.find((f) => f.id === id)
}

export function findProject(id: string | undefined): ProjectRow | undefined {
  return projects.find((p) => p.id === id)
}

export const statusMeta: Record<TaskStatus, { label: string; tone: string }> = {
  todo: { label: '待开始', tone: '' },
  review: { label: '审核中', tone: 'amber' },
  ready: { label: '待你确认', tone: 'violet' },
  done: { label: '已交付', tone: 'green' },
  blocked: { label: '正确阻断', tone: 'red' },
}
