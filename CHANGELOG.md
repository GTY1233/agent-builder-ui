# Changelog

本文件记录对外可见的变化。格式遵循 Keep a Changelog，版本号遵循语义化版本。

## [0.1.0] - 2026-10-08

### Added

- 工程脚手架：React 19 + TypeScript + Vite + React Router（HashRouter）+ zustand + motion。
- 设计系统：`tokens`（明暗两套令牌）、`base`、`components`、`pages` 四层样式。
- 应用外壳：侧栏（含 BUILD / RULES 分组与滑动选中指示器）、顶栏（面包屑、Command Center 入口、搜索、租户、通知、主题）、Toast。
- 命令面板：⌘K / Ctrl+K 搜索页面、流程、任务与项目。
- 15 条路由页面：首页、工作台、任务列表、新建任务、任务详情、项目、项目详情、资源、Flow Library、Flow 详情、Flow Approvals、Command Center、Rule Manager、文档、设置。全部为实质内容，无占位页。
- 手写图表组件：折线（含悬停读数与描边动画）、迷你折线、柱状、环形。
- 手写 SVG 图标集，避免引入图标库。
- 深色模式与 `prefers-reduced-motion` 支持。
- `tools/shot.mjs`：基于 CDP 的逐路由截图与渲染断言工具。

### Notes

- 全部数据为演示数据，不接后端。
- 配色按参考屏摄目测还原，非取色所得（见 README「已知边界」）。
- 构建产物需通过 HTTP 访问，`file://` 直接打开会因 ES module 跨源策略而空白。
