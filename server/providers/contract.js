// ───────────────────────────────────────────────
// Provider 契约：所有数据源适配器都要返回这种"归一化"结构，
// 这样无论数据来自 mock / 新榜 / 微博 / 千瓜，聚合层和前端都用同一套字段。
// ───────────────────────────────────────────────

/**
 * @typedef {Object} TrendItem      一条趋势
 * @property {string} categoryId    所属分类 id（见前端 CATEGORIES）
 * @property {string} title         趋势标题
 * @property {number} heat          热度 0-100
 * @property {string} desc          描述
 * @property {string[]} tags        话题标签
 * @property {string} posts         笔记/播放量等文案
 * @property {string} source        数据来源标识（newrank / weibo …）
 * @property {string} fetchedAt     ISO 时间
 */

/**
 * @typedef {Object} Blogger        一个博主
 * @property {string} id            稳定唯一 id（建议 `${platform}:${uid}`）
 * @property {string} name
 * @property {string} platform      抖音 | 小红书 | 微博 | B站
 * @property {string} followers     粉丝数文案
 * @property {string} avatar        头像 emoji 或 URL
 * @property {string} tag           标签/领域
 * @property {boolean} verified
 * @property {string} color         主题色
 * @property {string} source
 */

/**
 * @typedef {Object} FeedPost       博主动态
 * @property {string} id
 * @property {string} bloggerId
 * @property {string} bloggerName
 * @property {string} platform
 * @property {string} title
 * @property {string} preview
 * @property {string} likes
 * @property {string} comments
 * @property {string} time
 * @property {boolean} isHot
 * @property {string} cat
 * @property {string} url           原文链接（可直接跳转平台）
 * @property {string} source
 */

/**
 * 每个 provider 需实现下面的接口（任意子集，缺的返回空数组即可）：
 *
 *   export default {
 *     id: 'newrank',
 *     enabled(): boolean,                       // 密钥是否齐全
 *     async fetchTrends(): Promise<TrendItem[]>,
 *     async fetchBloggers(handles): Promise<Blogger[]>,
 *     async fetchFeed(bloggerIds): Promise<FeedPost[]>,
 *     async searchBloggers(query): Promise<Blogger[]>,   // 按关键字搜 KOL
 *   }
 */

export const emptyProvider = {
  id: 'noop',
  enabled: () => false,
  async fetchTrends() { return [] },
  async fetchBloggers() { return [] },
  async fetchFeed() { return [] },
  async searchBloggers() { return [] },
}
