/**
 * 视觉自检工具：用 CDP 驱动无头 Chrome，逐路由截图。
 *
 * 为什么不用 `chrome --screenshot`：那种方式要么不等动画（截到进场动画的初始帧，
 * 页面看起来是空的），要么用 --virtual-time-budget 冻结 rAF，同样截不到动效后的终态。
 * 这里连上 DevTools 协议，真实等待 render 之后再截，结果可复现。
 *
 * 用法：先起服务（npm run preview），再执行
 *   node tools/shot.mjs http://localhost:4173/ ./shots 1440 1000
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const base = (process.argv[2] ?? 'http://localhost:4173/').replace(/\/+$/, '/')
const outDir = path.resolve(process.argv[3] ?? 'shots')
const width = Number(process.argv[4] ?? 1440)
const height = Number(process.argv[5] ?? 1000)
const port = Number(process.env.CDP_PORT ?? 9333)

const ROUTES = [
  ['home', '/'],
  ['dashboard', '/dashboard'],
  ['tasks', '/tasks'],
  ['tasks-new', '/tasks/new'],
  ['task-detail', '/tasks/1499'],
  ['projects', '/projects'],
  ['project-detail', '/projects/p-talent-2026q4'],
  ['resources', '/resources'],
  ['flows', '/flows'],
  ['flow-detail', '/flows/talent'],
  ['approvals', '/approvals'],
  ['command', '/command'],
  ['rules', '/rules'],
  ['docs', '/docs'],
  ['settings', '/settings'],
]

const CHROME_CANDIDATES = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

const chromePath = CHROME_CANDIDATES.find((p) => fs.existsSync(p))
if (!chromePath) {
  console.error('找不到 Chrome/Edge，可用 CHROME 环境变量指定路径')
  process.exit(1)
}

const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ab-shot-'))
fs.mkdirSync(outDir, { recursive: true })

const child = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-prefers-reduced-motion',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    `--window-size=${width},${height}`,
    `${base}#/`,
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function findTarget() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`)
      const list = await res.json()
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (page) return page
    } catch {
      /* 还没起来 */
    }
    await sleep(250)
  }
  throw new Error('CDP 端口没有就绪')
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url)
    let id = 0
    const pending = new Map()
    const events = []
    ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data)
      if (msg.id && pending.has(msg.id)) {
        const { resolve: res, reject: rej } = pending.get(msg.id)
        pending.delete(msg.id)
        msg.error ? rej(new Error(msg.error.message)) : res(msg.result)
      } else if (msg.method) {
        events.push(msg)
      }
    })
    ws.addEventListener('open', () =>
      resolve({
        send: (method, params = {}) =>
          new Promise((res, rej) => {
            const mid = ++id
            pending.set(mid, { resolve: res, reject: rej })
            ws.send(JSON.stringify({ id: mid, method, params }))
          }),
        close: () => ws.close(),
      }),
    )
    ws.addEventListener('error', reject)
    void events
  })
}

const target = await findTarget()
const cdp = await connect(target.webSocketDebuggerUrl)

await cdp.send('Page.enable')
await cdp.send('Runtime.enable')
await cdp.send('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: false,
})

const problems = []
await sleep(1200)

/** SHOT_THEME=dark 时强制深色，用来出深色验收图 */
const forcedTheme = process.env.SHOT_THEME
if (forcedTheme) {
  await cdp.send('Runtime.evaluate', {
    expression: `document.documentElement.setAttribute('data-theme', '${forcedTheme}')`,
  })
}

for (const [name, route] of ROUTES) {
  await cdp.send('Runtime.evaluate', {
    expression: `location.hash = '#${route}'`,
  })
  await sleep(1100)
  if (forcedTheme) {
    await cdp.send('Runtime.evaluate', {
      expression: `document.documentElement.setAttribute('data-theme', '${forcedTheme}')`,
    })
  }

  const { result } = await cdp.send('Runtime.evaluate', {
    expression: `(function(){
      var root = document.getElementById('root');
      var page = document.querySelector('.page, .stage > div');
      var visible = page ? page.getBoundingClientRect().height : 0;
      return JSON.stringify({
        html: root ? root.innerHTML.length : 0,
        contentHeight: Math.round(visible),
        title: document.title
      });
    })()`,
    returnByValue: true,
  })
  const info = JSON.parse(result.value)
  if (info.html < 2000 || info.contentHeight < 120) {
    problems.push(`${name}: html=${info.html} height=${info.contentHeight}`)
  }

  const shot = await cdp.send('Page.captureScreenshot', { format: 'png' })
  fs.writeFileSync(path.join(outDir, `${name}.png`), Buffer.from(shot.data, 'base64'))
  console.log(`${name.padEnd(16)} ${route.padEnd(34)} html=${info.html} h=${info.contentHeight}`)
}

cdp.close()
child.kill()

if (problems.length) {
  console.error('\n发现问题路由：\n' + problems.join('\n'))
  process.exit(1)
}
console.log(`\n全部 ${ROUTES.length} 条路由渲染正常，截图在 ${outDir}`)
