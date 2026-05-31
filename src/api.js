// 前端 API 客户端：优先从后端拉真实数据，失败则降级到本地内置数据，
// 保证后端没启动时 App 依然能用。
import { CATEGORIES, DAILY_CONTENT, bloggers as localBloggers, SUGGESTED_BLOGGERS, generateFeed } from './data.js'

const TIMEOUT = 4000

async function getJSON(path) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT)
  try {
    const res = await fetch(path, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(t)
  }
}

// 把后端归一化的 trends 按分类分组，匹配前端 CategorySection 的渲染结构
function groupTrendsByCategory(trends) {
  const map = {}
  for (const t of trends) {
    (map[t.categoryId] ||= []).push({
      title: t.title, heat: t.heat, desc: t.desc, tags: t.tags || [], posts: t.posts || '',
    })
  }
  return map
}

export async function fetchTrends() {
  try {
    const { trends, updatedAt } = await getJSON('/api/trends')
    return { source: 'live', updatedAt, byCategory: groupTrendsByCategory(trends) }
  } catch {
    return { source: 'local', updatedAt: null, byCategory: DAILY_CONTENT }
  }
}

export async function fetchBloggers() {
  try {
    const { bloggers } = await getJSON('/api/bloggers')
    if (bloggers?.length) return { source: 'live', bloggers }
  } catch { /* fall through */ }
  return { source: 'local', bloggers: localBloggers }
}

export async function fetchFeed() {
  try {
    const { feed } = await getJSON('/api/feed')
    if (feed?.length) {
      const normalized = feed.map(f => ({
        id: f.id,
        blogger: { name: f.bloggerName, avatar: '🌸', color: '#FF6B9D' },
        title: f.title, preview: f.preview, likes: f.likes, comments: f.comments,
        time: f.time, platform: f.platform, isHot: f.isHot, image: '🎨', cat: f.cat, url: f.url,
      }))
      return { source: 'live', feed: normalized }
    }
  } catch { /* fall through */ }
  return { source: 'local', feed: generateFeed() }
}

// KOL 搜索：优先后端实时搜索；后端不可用时降级到本地推荐库过滤
export async function searchKol(query) {
  const q = query.trim()
  if (!q) return { source: 'local', results: [] }
  try {
    const { results } = await getJSON(`/api/kol/search?q=${encodeURIComponent(q)}`)
    if (Array.isArray(results)) return { source: 'live', results }
  } catch { /* fall through */ }
  const ql = q.toLowerCase()
  const local = SUGGESTED_BLOGGERS.filter(
    b => b.name.toLowerCase().includes(ql) || b.tag.toLowerCase().includes(ql)
  )
  return { source: 'local', results: local }
}

export async function triggerRefresh() {
  try {
    const res = await fetch('/api/refresh', { method: 'POST' })
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}

export { CATEGORIES }
