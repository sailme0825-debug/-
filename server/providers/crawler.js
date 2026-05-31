// ───────────────────────────────────────────────
// Crawler Provider（路径C：抓取「公开」数据）
// 目前只抓微博热搜榜——这是公开榜单、无需登录，过滤出美妆相关条目，
// 喂给前端「美妆热点 / 抖音热议」分类。
//
// ⚠️ 边界与自律：
//   · 只抓公开榜单，不碰任何登录态 / 个人主页 / 受保护内容
//   · 单次刷新只发 1 个请求，且有最小间隔限速，避免给对方造成压力
//   · 任意失败都静默降级（返回空数组），由聚合层用其他源兜底
//   · 博主追踪 / 动态抓取在小红书·抖音上需登录与签名，本 provider 不做
//     （那属于绕过平台反爬，违反 ToS，有封号与法律风险）
// ───────────────────────────────────────────────
import { config } from '../config.js'

const HOT_SEARCH_URL = 'https://weibo.com/ajax/side/hotSearch'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

// 美妆相关关键词：命中其一即纳入
const BEAUTY = [
  '美妆', '彩妆', '护肤', '化妆', '口红', '粉底', '腮红', '眼影', '睫毛',
  '面膜', '精华', '妆容', '香水', '美甲', '医美', '素颜', '卸妆', '防晒',
]

// 简单限速：两次抓取至少间隔 N 毫秒，礼貌爬取
let lastFetch = 0
const MIN_INTERVAL = 60 * 1000

async function fetchHotSearch() {
  const now = Date.now()
  if (now - lastFetch < MIN_INTERVAL) return null // 限速：太频繁就跳过本轮
  lastFetch = now

  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 12000)
  try {
    const res = await fetch(HOT_SEARCH_URL, {
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, 'Referer': 'https://weibo.com/', 'Accept': 'application/json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    return json?.data?.realtime || []
  } finally {
    clearTimeout(t)
  }
}

// 把一条热搜映射为归一化 TrendItem
function normalize(row, index) {
  const title = (row.word || '').trim()
  const topic = (row.word_scheme || '').replace(/^#|#$/g, '').trim()
  return {
    categoryId: 'hot',
    title,
    // 榜单越靠前越热，按名次换算 0-100（限定 55~99，避免极端值）
    heat: Math.max(55, 99 - index),
    desc: '来自微博实时热搜榜（公开数据）',
    tags: [topic && topic !== title ? `#${topic}` : '#微博热搜', row.label_name && `#${row.label_name}`].filter(Boolean),
    posts: row.num ? `${Number(row.num).toLocaleString('zh-CN')} 讨论` : '',
    source: 'crawler',
    fetchedAt: new Date().toISOString(),
  }
}

export default {
  id: 'crawler',
  // 通过把 crawler 列入 PROVIDERS 启用；可用 config 开关额外约束
  enabled: () => config.crawler.enabled,

  async fetchTrends() {
    try {
      const list = await fetchHotSearch()
      if (!list) return [] // 被限速跳过
      return list
        .filter(r => BEAUTY.some(k => (r.word || '').includes(k)))
        .map(normalize)
    } catch (e) {
      console.warn('[crawler] 微博热搜抓取失败:', e.message)
      return []
    }
  },

  // 博主 / 动态 / 搜索：公开渠道拿不到，交给付费 provider 或 mock
  async fetchBloggers() { return [] },
  async fetchFeed() { return [] },
  async searchBloggers() { return [] },
}
