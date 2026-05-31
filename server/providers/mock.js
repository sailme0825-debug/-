// ───────────────────────────────────────────────
// Mock Provider —— 默认数据源，无需任何密钥即可跑通全链路。
// 数据结构与真实 provider 完全一致，方便前端先行联调。
// 每次拉取会对热度做轻微随机扰动，模拟"每日刷新"的变化。
// ───────────────────────────────────────────────
import { MOCK_TRENDS, MOCK_BLOGGERS, MOCK_FEED, KOL_DIRECTORY } from './mockData.js'

const COLORS = ['#FF6B9D', '#C084FC', '#F59E0B', '#34D399', '#60A5FA', '#FB7185', '#8B5CF6', '#14B8A6']
const colorFor = (id) => COLORS[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length]

const jitter = (h) => Math.max(40, Math.min(100, h + Math.round((Math.random() - 0.5) * 6)))
const now = () => new Date().toISOString()

export default {
  id: 'mock',
  enabled: () => true,

  async fetchTrends() {
    return MOCK_TRENDS.map(t => ({ ...t, heat: jitter(t.heat), source: 'mock', fetchedAt: now() }))
  },

  async fetchBloggers() {
    return MOCK_BLOGGERS.map(b => ({ ...b, source: 'mock' }))
  },

  async fetchFeed() {
    return MOCK_FEED.map(f => ({ ...f, source: 'mock' }))
  },

  // 按关键字搜索 KOL（名字 / 标签 / 平台）
  async searchBloggers(query = '') {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return KOL_DIRECTORY
      .filter(k =>
        k.name.toLowerCase().includes(q) ||
        k.tag.toLowerCase().includes(q) ||
        k.platform.toLowerCase().includes(q))
      .map(k => ({ ...k, color: colorFor(k.id), source: 'mock' }))
  },
}
