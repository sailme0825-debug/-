// ───────────────────────────────────────────────
// 后端配置：通过环境变量切换数据源 / 注入 API 密钥
// 复制 .env.example 为 .env 并填入真实密钥后即可启用真实数据源
// ───────────────────────────────────────────────
import 'dotenv/config'

export const config = {
  port: process.env.PORT || 4000,

  // 每日定时刷新的 cron 表达式（默认每天 10:00）
  // 也可设为 '*/30 * * * *' 等做更频繁的拉取
  refreshCron: process.env.REFRESH_CRON || '0 10 * * *',

  // 启用的数据源 provider，按优先级排列，逗号分隔
  // 可选：mock | newrank | weibo | douyin | qiangua
  // 默认仅 mock，开箱即用、无需任何密钥
  providers: (process.env.PROVIDERS || 'mock').split(',').map(s => s.trim()),

  // ── 第三方数据服务密钥（路径B：追踪博主的现实方案）──
  newrank: {
    apiKey: process.env.NEWRANK_API_KEY || '',
    baseUrl: process.env.NEWRANK_BASE_URL || 'https://api.newrank.cn',
  },
  qiangua: {
    apiKey: process.env.QIANGUA_API_KEY || '',
    baseUrl: process.env.QIANGUA_BASE_URL || 'https://api.qian-gua.com',
  },

  // ── 官方开放平台（路径A：热榜 + 自有账号数据）──
  weibo: {
    accessToken: process.env.WEIBO_ACCESS_TOKEN || '',
    baseUrl: 'https://api.weibo.com/2',
  },
  douyin: {
    clientKey: process.env.DOUYIN_CLIENT_KEY || '',
    clientSecret: process.env.DOUYIN_CLIENT_SECRET || '',
    baseUrl: 'https://open.douyin.com',
  },
}

// 数据缓存有效期（毫秒）。定时任务会主动刷新；此值用于兜底防止频繁打第三方接口
export const CACHE_TTL = 1000 * 60 * 60 * 6 // 6 小时
