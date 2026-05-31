// 每日定时刷新：用 node-cron 按 config.refreshCron 周期性触发聚合。
import cron from 'node-cron'
import { config } from '../config.js'
import { refreshAll } from './aggregator.js'

export function startScheduler() {
  if (!cron.validate(config.refreshCron)) {
    console.error('[scheduler] 无效的 cron 表达式:', config.refreshCron)
    return
  }
  cron.schedule(config.refreshCron, async () => {
    console.log('[scheduler] 定时刷新触发', new Date().toISOString())
    try { await refreshAll() } catch (e) { console.error('[scheduler] 刷新失败', e.message) }
  }, { timezone: 'Asia/Shanghai' })

  console.log(`[scheduler] 已启动，cron="${config.refreshCron}" (Asia/Shanghai)`)
}
