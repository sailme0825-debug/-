// ───────────────────────────────────────────────
// Crawler Provider（路径C：抓取「公开」数据，全部免费）
// 当前两个公开源（均无需登录、是平台公开榜单）：
//   1) 微博热搜榜      → 过滤美妆词 → 「美妆热点」趋势
//   2) B站美妆护肤排行榜 → 真实视频+UP主 → 「彩妆趋势」 + 「博主动态」
//
// ⚠️ 边界与自律：
//   · 只抓公开榜单，不碰登录态 / 个人主页 / 受保护内容 / 需签名的接口
//     （B站新版 v2 排行榜要 wbi 签名，本 provider 不用，改用公开的 region 接口）
//   · 每个源单次刷新最多 1 个请求，且有最小间隔限速 + 结果缓存，礼貌爬取
//   · 任意失败静默降级（返回空/上次缓存），由聚合层用其他源兜底
// ───────────────────────────────────────────────
import { config } from '../config.js'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const WEIBO_URL = 'https://weibo.com/ajax/side/hotSearch'
const biliRankUrl = rid => `https://api.bilibili.com/x/web-interface/ranking/region?rid=${rid}&day=3`
// B站时尚大区下的美妆相邻分区（公开排行榜，无需签名）
const BILI_ZONES = [
  { rid: 157, zone: '美妆护肤' },
  { rid: 158, zone: '穿搭' },
  { rid: 159, zone: '时尚潮流' },
]
const MIN_INTERVAL = 60 * 1000

const BEAUTY = [
  '美妆', '彩妆', '护肤', '化妆', '口红', '粉底', '腮红', '眼影', '睫毛',
  '面膜', '精华', '妆容', '香水', '美甲', '医美', '素颜', '卸妆', '防晒',
]

// 每个源独立限速 + 缓存上次成功结果，避免频繁刷新时数据闪烁
const cache = {
  weibo: { at: 0, data: [] },
  bili: { at: 0, data: [] },
}

async function getJSON(url, referer) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 12000)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, 'Referer': referer, 'Accept': 'application/json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(t)
  }
}

const wan = n => { n = Number(n) || 0; return n >= 10000 ? `${(n / 10000).toFixed(1)}万` : String(n) }
// B站 create 是 "YYYY-MM-DD HH:mm" 字符串，取日期部分展示
const fmtDate = s => (s || '').split(' ')[0] || ''

// ── 微博热搜 → TrendItem[]（限速时回退上次缓存）──
async function weiboTrends() {
  if (Date.now() - cache.weibo.at < MIN_INTERVAL) return cache.weibo.data
  try {
    const json = await getJSON(WEIBO_URL, 'https://weibo.com/')
    const list = (json?.data?.realtime || [])
      .filter(r => BEAUTY.some(k => (r.word || '').includes(k)))
      .map((r, i) => {
        const topic = (r.word_scheme || '').replace(/^#|#$/g, '').trim()
        const title = (r.word || '').trim()
        return {
          categoryId: 'hot',
          title,
          heat: Math.max(55, 99 - i),
          desc: '来自微博实时热搜榜（公开数据）',
          tags: [topic && topic !== title ? `#${topic}` : '#微博热搜', r.label_name && `#${r.label_name}`].filter(Boolean),
          posts: r.num ? `${Number(r.num).toLocaleString('zh-CN')} 讨论` : '',
          source: 'crawler', fetchedAt: new Date().toISOString(),
        }
      })
    cache.weibo = { at: Date.now(), data: list }
    return list
  } catch (e) {
    console.warn('[crawler] 微博热搜抓取失败:', e.message)
    return cache.weibo.data
  }
}

// ── B站多个美妆相邻分区排行榜 → 视频数组（标注分区，限速时回退缓存）──
async function biliVideos() {
  if (Date.now() - cache.bili.at < MIN_INTERVAL) return cache.bili.data
  const results = await Promise.allSettled(
    BILI_ZONES.map(async ({ rid, zone }) => {
      const json = await getJSON(biliRankUrl(rid), 'https://www.bilibili.com/')
      const list = (json?.code === 0 && Array.isArray(json.data)) ? json.data : []
      return list.map(v => ({ ...v, zone }))
    })
  )
  const merged = []
  const seen = new Set()
  for (const r of results) {
    if (r.status !== 'fulfilled') { console.warn('[crawler] B站分区抓取失败:', r.reason?.message); continue }
    for (const v of r.value) if (!seen.has(v.bvid)) { seen.add(v.bvid); merged.push(v) }
  }
  if (merged.length) cache.bili = { at: Date.now(), data: merged }
  return merged.length ? merged : cache.bili.data
}

export default {
  id: 'crawler',
  enabled: () => config.crawler.enabled,

  async fetchTrends() {
    const [weibo, bili] = await Promise.all([weiboTrends(), biliVideos()])
    // B站「美妆护肤」分区热门视频 → 「彩妆趋势」分类（保持垂直）
    const biliTrends = bili
      .filter(v => v.zone === '美妆护肤')
      .sort((a, b) => (b.play || 0) - (a.play || 0))
      .slice(0, 8)
      .map((v, i) => ({
        categoryId: 'makeup',
        title: v.title,
        heat: Math.max(55, 96 - i),
        desc: `B站 @${v.author} · ${wan(v.play)}播放`,
        tags: ['#B站美妆', `#${v.author}`],
        posts: `${wan(v.play)} 播放`,
        source: 'crawler', fetchedAt: new Date().toISOString(),
      }))
    return [...weibo, ...biliTrends]
  },

  // B站排行榜 → 真实「博主动态」
  async fetchFeed() {
    const bili = await biliVideos()
    return bili.map(v => ({
      id: `bili:${v.bvid}`,
      bloggerId: `B站:${v.mid}`,
      bloggerName: v.author,
      platform: 'B站',
      title: v.title,
      preview: (v.description && v.description !== '-') ? v.description : `▶ ${wan(v.play)} 播放`,
      likes: wan(v.favorites),
      comments: wan(v.video_review),
      time: fmtDate(v.create),
      isHot: (v.play || 0) > 1_000_000,
      cat: v.zone || '彩妆趋势',
      url: `https://www.bilibili.com/video/${v.bvid}`,
      source: 'crawler',
    }))
  },

  // 博主档案 / KOL 搜索：公开渠道拿不到完整档案，交给付费 provider 或 mock
  async fetchBloggers() { return [] },
  async searchBloggers() { return [] },
}
