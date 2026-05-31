// ───────────────────────────────────────────────
// 新榜 Provider（路径B：第三方数据服务，追踪任意博主的现实方案）
// 新榜提供全平台 KOL 榜单 / 博主数据 / 内容趋势的商用 API。
// 这里是接入骨架：填入 NEWRANK_API_KEY 并把 PROVIDERS 设为含 newrank 即启用。
//
// ⚠️ 字段映射需以你拿到的实际接口文档为准——下面的 endpoint / 字段名是示意，
//    签约后按真实响应结构调整 normalize* 函数即可，其余代码无需改动。
// ───────────────────────────────────────────────
import { config } from '../config.js'

const BEAUTY_KEYWORDS = ['美妆', '彩妆', '护肤', '化妆']

async function call(path, params = {}) {
  const url = new URL(path, config.newrank.baseUrl)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url, {
    headers: { 'Key': config.newrank.apiKey, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`[newrank] ${res.status} ${res.statusText}`)
  return res.json()
}

// 将新榜的榜单条目映射为归一化 TrendItem
function normalizeTrend(row) {
  return {
    categoryId: 'hot',                 // 可按 row 的领域字段细分到 makeup/skincare...
    title: row.title || row.keyword,
    heat: Math.min(100, Math.round((row.hotScore || row.heat || 0))),
    desc: row.summary || '',
    tags: (row.tags || []).map(t => `#${t}`),
    posts: row.interactCount ? `${row.interactCount} 互动` : '',
    source: 'newrank',
    fetchedAt: new Date().toISOString(),
  }
}

function normalizeBlogger(row) {
  return {
    id: `${row.platform}:${row.accountId}`,
    name: row.nickname,
    platform: row.platform,
    followers: row.fansCount,
    avatar: row.avatarUrl || '🌟',
    tag: row.category || '美妆',
    verified: !!row.verified,
    color: '#FF6B9D',
    source: 'newrank',
  }
}

export default {
  id: 'newrank',
  enabled: () => Boolean(config.newrank.apiKey),

  async fetchTrends() {
    // 示意：拉取美妆领域热榜
    const data = await call('/sync/rank/beauty', { type: 'hot', size: 20 })
    return (data.list || []).map(normalizeTrend)
  },

  async fetchBloggers(handles = []) {
    // handles: 你想追踪的博主列表。逐个查询其档案。
    const out = []
    for (const h of handles) {
      try {
        const data = await call('/sync/account/info', { account: h })
        if (data.data) out.push(normalizeBlogger(data.data))
      } catch (e) { console.warn('[newrank] blogger fail', h, e.message) }
    }
    return out
  },

  async searchBloggers(query = '') {
    if (!query.trim()) return []
    // 示意：新榜的达人搜索接口
    const data = await call('/sync/account/search', { keyword: query, size: 20 })
    return (data.list || []).map(normalizeBlogger)
  },

  async fetchFeed(bloggerIds = []) {
    const out = []
    for (const id of bloggerIds) {
      const accountId = id.split(':')[1]
      try {
        const data = await call('/sync/account/posts', { account: accountId, size: 5 })
        for (const p of data.list || []) {
          if (!BEAUTY_KEYWORDS.some(k => (p.title || '').includes(k))) continue
          out.push({
            id: p.postId,
            bloggerId: id,
            bloggerName: p.nickname,
            platform: p.platform,
            title: p.title,
            preview: p.desc || '',
            likes: String(p.likeCount ?? ''),
            comments: String(p.commentCount ?? ''),
            time: p.publishTime,
            isHot: (p.likeCount || 0) > 10000,
            cat: '美妆热点',
            url: p.url,
            source: 'newrank',
          })
        }
      } catch (e) { console.warn('[newrank] feed fail', id, e.message) }
    }
    return out
  },
}
