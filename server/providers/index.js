// Provider 注册表：按 config.providers 顺序加载、过滤掉未配置密钥的。
import { config } from '../config.js'
import mock from './mock.js'
import newrank from './newrank.js'
import weibo from './weibo.js'

const REGISTRY = { mock, newrank, weibo }

export function getActiveProviders() {
  const active = config.providers
    .map(id => REGISTRY[id])
    .filter(Boolean)
    .filter(p => p.enabled())

  // 没有任何真实源就绪时，兜底用 mock，保证服务可用
  if (active.length === 0) {
    console.warn('[providers] 无可用真实数据源，回退到 mock')
    return [mock]
  }
  console.log('[providers] 已启用:', active.map(p => p.id).join(', '))
  return active
}
