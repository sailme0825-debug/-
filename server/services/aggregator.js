// ───────────────────────────────────────────────
// 聚合服务：并行调用所有启用的 provider，合并 + 去重 + 排序，
// 产出一份归一化快照写入缓存。供定时任务与手动刷新复用。
// ───────────────────────────────────────────────
import { getActiveProviders } from '../providers/index.js'
import { save } from './cache.js'

// 你想长期追踪的博主 handle 列表（真实环境从数据库/用户关注列表读取）
const TRACKED_HANDLES = [
  '抖音:luowangyu', '微博:xulaoshi', '小红书:pony', '抖音:maogeping',
]

const settle = async (p, fb = []) => { try { return await p } catch (e) { console.warn(e.message); return fb } }
const byHeat = (a, b) => b.heat - a.heat

function dedupe(items, keyFn) {
  const seen = new Map()
  for (const it of items) {
    const k = keyFn(it)
    if (!seen.has(k)) seen.set(k, it)
  }
  return [...seen.values()]
}

export async function refreshAll() {
  const providers = getActiveProviders()
  const started = Date.now()

  const trendChunks = await Promise.all(providers.map(p => settle(p.fetchTrends())))
  const bloggerChunks = await Promise.all(providers.map(p => settle(p.fetchBloggers(TRACKED_HANDLES))))
  const feedChunks = await Promise.all(providers.map(p => settle(p.fetchFeed(TRACKED_HANDLES))))

  const trends = dedupe(trendChunks.flat(), t => `${t.categoryId}|${t.title}`).sort(byHeat)
  const bloggers = dedupe(bloggerChunks.flat(), b => b.id)
  const feed = dedupe(feedChunks.flat(), f => f.id)

  const snapshot = await save({ trends, bloggers, feed })
  console.log(`[aggregator] 刷新完成 ${trends.length} 趋势 / ${bloggers.length} 博主 / ${feed.length} 动态，用时 ${Date.now() - started}ms`)
  return snapshot
}
