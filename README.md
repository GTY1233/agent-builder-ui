# Agent Builder · 智能体工作台（交互模版）

把 Inception42 Catalyst（Agent Builder + Command Center）的**形态**落成一个可长期维护的前端工程：任务、流程、资源、治理与成效在一个壳子里跑通，共 15 条路由，没有占位页。

> **品牌中性化说明**：本仓库复刻的是**交互形态与信息结构**，不使用对方的字标、租户名与英文原文内容。功能模块名（Agent Builder / Command Center / Flow Library / Flow Approvals / Rule Manager / RUN WITH）保留英文原样，其余界面文案为中文。
>
> **数据说明**：全部为演示数据（`src/data/index.ts`），不接任何后端，不发起真实模型调用。

## 快速开始

> **在线预览**：<https://gty1233.github.io/agent-builder-ui/> —— 每次推送到 `main` 都会由
> `.github/workflows/pages.yml` 自动构建并发布。该站点是公开可访问的。

```bash
npm install
npm run dev        # 开发：http://localhost:5173
npm run build      # 类型检查 + 构建到 dist/
npm run preview    # 预览构建产物：http://localhost:4173
npm run typecheck  # 只做类型检查
```

> ⚠️ **必须通过 HTTP 访问**。构建产物是 ES module，用 `file://` 直接双击 `dist/index.html` 会被浏览器的跨源策略拦掉（页面空白）。开发用 `npm run dev`，看产物用 `npm run preview`。

## 页面

15 条路由，侧栏导航由 `src/lib/routes.ts` 单一驱动。

| 路由 | 页面 | 说明 |
|---|---|---|
| `/` | 首页 | 助理式首页：一句话提问、两分钟简报、需要你处理的事、今日日程、最近产出 |
| `/dashboard` | 工作台 | 角色工作台：主动作、KPI、我的工作队列、编排卡、本周运行、智能体状态 |
| `/tasks` | 任务 | 列表 / 看板双视图、状态筛选、搜索 |
| `/tasks/new` | 新建任务 | 分段控件、一句话输入、`RUN WITH` 流程选择、模拟执行进度 |
| `/tasks/:id` | 任务详情 | 任务卡 + 简报/执行记录/证据与来源/评论四个页签 |
| `/projects` `/projects/:id` | 项目 与 详情 | 项目卡、进度环、里程碑、成员、关联任务 |
| `/resources` | 资源 | 数据源 / 本体与术语 / 知识条目 / 智能体 |
| `/flows` `/flows/:id` | Flow Library 与 详情 | 流程卡、执行链路（节点 DAG）、输入产出、Gate、版本历史、最近运行 |
| `/approvals` | Flow Approvals | 待审队列（可操作）+ 审批历史 + 放权档位说明 |
| `/command` | Command Center | 综合指数、KPI、部门对比、智能体、成本、审计四个页签 + 价值下钻 |
| `/rules` | Rule Manager | 规则表 + 阈值调节 + 变更记录 |
| `/docs` | 文档 | 分节导航 + 正文阅读 |
| `/settings` | 设置 | 租户 / 成员与角色 / 权限 / 模型 / 集成 / 审计 |

## 交互与动效

- **命令面板**：`⌘K` / `Ctrl+K` 搜索页面、流程、任务、项目；方向键选择，回车跳转。
- **路由进场**：页面淡入上移 + 区块逐条错位（`src/lib/motion.ts` 的 `pageVariants` / `itemVariants`）。
- **数字滚动**：KPI 从 0 滚到目标值（`useCountUp`）。
- **图表绘制**：折线用 `pathLength` 描边动画，柱状从底部生长，环形按弧长展开；折线支持悬停读数。
- **侧栏选中指示器**：`layoutId` 在两个位置之间平滑滑动。
- **执行进度**：点「开始」后本地模拟四步节点执行，再落到任务详情。
- **浮层**：价值下钻用弹层（缩放淡入），提示用 Toast（上滑淡入）。
- **深色模式**：顶栏月亮/太阳切换，写入 `localStorage`，`index.html` 里有首屏防闪脚本。
- **可访问性**：全站遵循 `prefers-reduced-motion`，`MotionConfig reducedMotion="user"` + CSS 兜底。

## 结构

```
src/
  styles/         tokens / base / components / pages —— 设计令牌与全部样式
  data/           演示数据与领域类型（唯一数据来源）
  store/          zustand：主题、侧栏、命令面板、Toast
  lib/            routes（导航与面包屑）、motion（动效变体与 hooks）
  components/
    Icon.tsx      手写 SVG 图标集（不依赖图标库，线性 1.6px 与参考一致）
    Shell.tsx     侧栏 + 顶栏 + 路由出口
    CommandPalette.tsx / Toaster.tsx
    ui/           页面容器、KPI、状态标签、Tabs、完整性区块、空态
    charts/       折线、迷你折线、柱状、环形（全部手写 SVG）
  pages/          15 个路由组件
tools/shot.mjs    CDP 截图自检工具
```

## 自检

```bash
npm run build
npm run preview &                       # 或另一个终端里跑
node tools/shot.mjs http://localhost:4173/ ./shots 1440 1000
SHOT_THEME=dark node tools/shot.mjs http://localhost:4173/ ./shots-dark 1440 1000
```

工具会逐路由截图，并断言每页 `#root` 的内容长度与可视高度，任何一页渲染不出来都会以非零码退出。

> 不要用 `chrome --screenshot` 直接截这个工程：那种方式会在动画未跑完时拍照，页面看起来是空的（进场元素还停在 `opacity:0`）。

## 已知边界

- **GitHub Pages 站点是公开的**。本仓库为公开仓库（免费账号不支持私有仓库发布 Pages），
  仓库内只有演示数据、没有真实业务信息；带客户语境的内容请勿提交到这里。

- **配色是按屏摄目测还原的，不是取色得来的**。参考素材是手机翻拍的屏幕照片，有明显偏色与反光，采样出的色值不可信（例如亮绿按钮采样到 `rgb(103,171,52)`，实际应更亮）。要精确对齐品牌色，需要拿到设计稿或清晰截图。
- **照片里读不清的小字是按语义补写的**，不是逐字复刻。
- **数据全部是演示数据**；首页也标了「所有数据均为样例」。
- **桌面优先**：1280–1920 不破版；1024 以下侧栏收成图标条；**没有做移动端**。
- 不做后端、真实鉴权与真实数据接入；模型与集成的配置页只是表单外观。

## 相关

- 上一版单文件原型：`../inception42-template-ui/`（同样的形态，单 HTML，用于快速传阅）
- 参考来源：inception42.ai 的 Catalyst（Agent Builder / Command Center）
