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

// 按视频标题关键词把 B站美妆视频分流到更细的前端分类（命中靠前者优先，默认彩妆趋势）
const ROUTES = [
  { id: 'medical',   kw: ['医美', '水光', '玻尿酸', '热玛吉', '光子', '抗衰', '童颜针', '超声炮', '项目'] },
  { id: 'technique', kw: ['教程', '技巧', '画法', '教学', '手把手', '怎么画', '怎么化', '新手', '如何', '步骤', '上妆'] },
  { id: 'skincare',  kw: ['护肤', '精华', '面膜', '水乳', '防晒', '抗老', '保湿', '痘', '油皮', '干皮', '敏感肌', '卸妆', '面霜', '爽肤'] },
  { id: 'tools',     kw: ['化妆刷', '美妆蛋', '粉扑', '刷具', '卷发棒', '美容仪', '工具', '夹睫毛'] },
  { id: 'color',     kw: ['显白', '冷白皮', '黄黑皮', '色系', '配色', '春夏', '秋冬', '氛围色'] },
]
function routeCategory(title = '') {
  for (const r of ROUTES) if (r.kw.some(k => title.includes(k))) return r.id
  return 'makeup' // 默认归入「彩妆趋势」
}

// ── 微博热搜 → TrendItem[]（限速时回退上次缓存）──
async function weiboTrends() {
  if (Date.now() - cache.weibo.at < MIN_INTERVAL) return cache.weibo.data
  try {
    const json = await getJSON(WEIBO_URL, 'https://weibo.com/')
    const realtime = json?.data?.realtime || []
    const mk = (r, i, categoryId, desc) => {
      const topic = (r.word_scheme || '').replace(/^#|#$/g, '').trim()
      const title = (r.word || '').trim()
      return {
        categoryId, title,
        heat: Math.max(55, 99 - i),
        desc,
        tags: [topic && topic !== title ? `#${topic}` : '#微博热搜', r.label_name && `#${r.label_name}`].filter(Boolean),
        posts: r.num ? `${Number(r.num).toLocaleString('zh-CN')} 讨论` : '',
        source: 'crawler', fetchedAt: new Date().toISOString(),
      }
    }
    // ① 美妆相关 → 「美妆热点」
    const hot = realtime
      .filter(r => BEAUTY.some(k => (r.word || '').includes(k)))
      .map((r, i) => mk(r, i, 'hot', '来自微博实时热搜榜（公开数据）'))
    // ② 整榜 TOP 全民热议话题 → 「抖音年轻人热议」（vlog 选题素材）
    const buzz = realtime
      .slice(0, 12)
      .map((r, i) => mk(r, i, 'douyin', '微博热搜榜·全民热议话题'))
    const list = [...hot, ...buzz]
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
    // B站「美妆护肤」分区热门视频 → 按标题关键词分流到 妆容技巧/护肤新品/医美/工具/彩妆趋势
    const ranked = bili
      .filter(v => v.zone === '美妆护肤')
      .sort((a, b) => (b.play || 0) - (a.play || 0))
    const perCat = {} // 每个分类内部计名次，用于热度递减
    const biliTrends = ranked.map(v => {
      const categoryId = routeCategory(v.title)
      const rank = (perCat[categoryId] = (perCat[categoryId] || 0) + 1)
      return {
        categoryId,
        title: v.title,
        heat: Math.max(55, 96 - rank * 2),
        desc: `B站 @${v.author} · ${wan(v.play)}播放`,
        tags: ['#B站美妆', `#${v.author}`],
        posts: `${wan(v.play)} 播放`,
        source: 'crawler', fetchedAt: new Date().toISOString(),
      }
    })
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
