// ───────────────────────────────────────────────
// 微博 Provider（路径A：官方开放平台）
// 适合：① 微博热搜榜 → 喂给"美妆热点/抖音热议"分类
//       ② 你自己授权账号的内容
// 不适合：追踪任意第三方博主（官方 API 拿不到）→ 那部分交给新榜(路径B)。
//
// 接入：到 open.weibo.com 创建应用，走 OAuth2 拿 access_token 填入 .env。
// ───────────────────────────────────────────────
import { config } from '../config.js'

const BEAUTY = ['美妆', '彩妆', '护肤', '口红', '粉底', '化妆']

async function call(path, params = {}) {
  const url = new URL(`${config.weibo.baseUrl}${path}`)
  url.searchParams.set('access_token', config.weibo.accessToken)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url)
  if (!res.ok) throw new Error(`[weibo] ${res.status} ${res.statusText}`)
  return res.json()
}

export default {
  id: 'weibo',
  enabled: () => Boolean(config.weibo.accessToken),

  async fetchTrends() {
    // 微博热搜榜，过滤出美妆相关条目
    try {
      const data = await call('/trends/hourly.json')
      const list = data.trends || data.data || []
      return list
        .filter(t => BEAUTY.some(k => (t.name || t.word || '').includes(k)))
        .map((t, i) => ({
          categoryId: 'hot',
          title: t.name || t.word,
          heat: Math.max(60, 100 - i * 3),
          desc: '来自微博实时热搜',
          tags: ['#微博热搜'],
          posts: t.num ? `${t.num} 讨论` : '',
          source: 'weibo',
          fetchedAt: new Date().toISOString(),
        }))
    } catch (e) {
      console.warn('[weibo] trends fail', e.message)
      return []
    }
  },

  // 官方 API 无法追踪任意博主，这里只返回空，由聚合层用其他 provider 补齐
  async fetchBloggers() { return [] },
  async fetchFeed() { return [] },
  async searchBloggers() { return [] },
}
