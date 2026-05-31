// ───────────────────────────────────────────────
// 美妆趋势后端入口
//   GET  /api/health          健康检查
//   GET  /api/trends          趋势（可 ?category=makeup 过滤）
//   GET  /api/bloggers        追踪的博主
//   GET  /api/feed            博主动态
//   GET  /api/snapshot        一次性拿全部 + 更新时间
//   POST /api/refresh         手动触发立即刷新
// ───────────────────────────────────────────────
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { config } from './config.js'
import { loadFromDisk, get } from './services/cache.js'
import { refreshAll } from './services/aggregator.js'
import { startScheduler } from './services/scheduler.js'
import { getActiveProviders } from './providers/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  const snap = get()
  res.json({ ok: true, providers: config.providers, updatedAt: snap.updatedAt })
})

app.get('/api/trends', (req, res) => {
  const { category } = req.query
  let trends = get().trends
  if (category) trends = trends.filter(t => t.categoryId === category)
  res.json({ updatedAt: get().updatedAt, count: trends.length, trends })
})

app.get('/api/bloggers', (req, res) => {
  res.json({ updatedAt: get().updatedAt, bloggers: get().bloggers })
})

// KOL 搜索：实时查询所有启用的数据源并合并去重
app.get('/api/kol/search', async (req, res) => {
  const q = (req.query.q || '').toString().trim()
  if (!q) return res.json({ query: q, results: [] })
  try {
    const providers = getActiveProviders()
    const chunks = await Promise.all(
      providers.map(p => p.searchBloggers?.(q).catch(() => []) ?? [])
    )
    const seen = new Map()
    for (const r of chunks.flat()) if (!seen.has(r.id)) seen.set(r.id, r)
    res.json({ query: q, results: [...seen.values()] })
  } catch (e) {
    res.status(500).json({ query: q, results: [], error: e.message })
  }
})

app.get('/api/feed', (req, res) => {
  res.json({ updatedAt: get().updatedAt, feed: get().feed })
})

app.get('/api/snapshot', (req, res) => {
  res.json(get())
})

app.post('/api/refresh', async (req, res) => {
  try {
    const snap = await refreshAll()
    res.json({ ok: true, updatedAt: snap.updatedAt, count: snap.trends.length })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
})

// ── 生产：托管前端构建产物（dist），前后端同源单服务 ──
// 跑过 `npm run build` 后 dist 存在即生效；开发时前端走 Vite:3000，无需 dist
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  // SPA 路由兜底：非 /api 的 GET 请求都回 index.html，交给前端路由
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) return next()
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

async function bootstrap() {
  await loadFromDisk()
  // 启动即刷新一次，保证首屏有数据
  try { await refreshAll() } catch (e) { console.error('[boot] 首次刷新失败', e.message) }
  startScheduler()
  app.listen(config.port, () => {
    const served = fs.existsSync(distDir) ? '（含前端页面）' : '（仅 API · 未构建前端）'
    console.log(`\n🚀 美妆趋势站点已启动: http://localhost:${config.port} ${served}`)
    console.log(`   数据源: ${config.providers.join(', ')}  刷新计划: ${config.refreshCron}\n`)
  })
}

bootstrap()
