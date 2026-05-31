import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { CATEGORIES, DAILY_CONTENT, bloggers as seedBloggers, createCustomBlogger } from './data.js'
import { fetchTrends, fetchBloggers, fetchFeed, triggerRefresh, searchKol } from './api.js'

/* ─── Tabs ─────────────────────────────────── */
const TABS = [
  { id: 'trends',   icon: '🔥', label: '趋势' },
  { id: 'bloggers', icon: '👩‍💄', label: 'KOL' },
  { id: 'feed',     icon: '📱', label: '动态' },
  { id: 'profile',  icon: '👤', label: '我的' },
]

/* ─── Helpers ───────────────────────────────── */
function HeatBar({ value, color }) {
  return (
    <div className="heat-track">
      <div className="heat-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

function Chip({ label, color }) {
  return <span className="chip" style={{ background: `${color}15`, color }}>{label}</span>
}

/* ─── Vocab Card ────────────────────────────── */
function VocabCard({ cat }) {
  const item = DAILY_CONTENT[cat.id]?.[0]
  if (!item?.vocab) return null
  return (
    <div className="vocab-grid">
      {item.vocab.map(v => (
        <div key={v.word} className="vocab-item">
          <span className="vocab-word">{v.word}</span>
          <span className="vocab-def">{v.def}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Content List ──────────────────────────── */
function ContentList({ cat, byCategory }) {
  // vocab 走本地内置；其余优先用后端数据，缺失则回退本地
  if (cat.id === 'vocab') return <VocabCard cat={cat} />
  const items = byCategory?.[cat.id] || DAILY_CONTENT[cat.id] || []
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="content-row">
          <div className="content-rank" style={{ color: i === 0 ? cat.color : '#9CA3AF' }}>
            {i + 1}
          </div>
          <div className="content-body">
            <div className="content-title-row">
              <span className="content-title">{item.title}</span>
              <span className="content-heat" style={{ color: cat.color }}>{item.heat}</span>
            </div>
            <p className="content-desc">{item.desc}</p>
            <div className="content-meta-row">
              <HeatBar value={item.heat} color={cat.color} />
              <span className="content-posts">{item.posts}</span>
            </div>
            {item.tags.length > 0 && (
              <div className="chip-row">
                {item.tags.map(t => <Chip key={t} label={t} color={cat.color} />)}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  )
}

/* ─── Category Section ──────────────────────── */
function CategorySection({ cat, byCategory, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="cat-section">
      <button className="cat-header" onClick={() => setOpen(o => !o)}>
        <div className="cat-header-left">
          <span className="cat-dot" style={{ background: cat.color }} />
          <span className="cat-icon">{cat.icon}</span>
          <span className="cat-label">{cat.label}</span>
        </div>
        <span className="cat-chevron" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
      </button>
      {open && (
        <div className="cat-body">
          <ContentList cat={cat} byCategory={byCategory} />
        </div>
      )}
    </div>
  )
}

/* ─── Trends Tab ────────────────────────────── */
function TrendsTab() {
  const [refreshing, setRefreshing] = useState(false)
  const [data, setData] = useState({ source: 'local', updatedAt: null, byCategory: DAILY_CONTENT })

  // 从后端拉取（失败自动降级本地）
  const load = useCallback(async () => {
    setRefreshing(true)
    const result = await fetchTrends()
    setData(result)
    setRefreshing(false)
  }, [])

  // 点刷新：让后端重新聚合，再拉一次
  const refresh = useCallback(async () => {
    setRefreshing(true)
    await triggerRefresh()
    const result = await fetchTrends()
    setData(result)
    setRefreshing(false)
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 5 * 60 * 1000)  // 前端每5分钟拉一次最新快照
    return () => clearInterval(t)
  }, [load])

  const time = data.updatedAt
    ? new Date(data.updatedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    : '本地数据'
  const subtitle = data.source === 'live'
    ? `实时更新于 ${time} · 后端自动刷新`
    : '当前为离线示例数据 · 启动后端可接入实时源'

  return (
    <div className="tab-content">
      <div className="trends-topbar">
        <div>
          <h2 className="topbar-title">今日美妆日报</h2>
          <p className="topbar-sub">
            <span className={`live-dot ${data.source === 'live' ? 'on' : 'off'}`} />
            {subtitle}
          </p>
        </div>
        <button className={`icon-btn ${refreshing ? 'spin' : ''}`} onClick={refresh} disabled={refreshing}>🔄</button>
      </div>
      <div className="scroll-area">
        {refreshing
          ? <div className="loading-box"><div className="spinner" /><p>刷新中…</p></div>
          : CATEGORIES.map((cat, i) => (
              <CategorySection key={cat.id} cat={cat} byCategory={data.byCategory} defaultOpen={i === 0} />
            ))
        }
      </div>
    </div>
  )
}

/* ─── Bloggers Tab ──────────────────────────── */
function BloggerRow({ b, followed, onToggle }) {
  return (
    <div className="blogger-card">
      <div className="b-avatar" style={{ background: `${b.color}18` }}>
        <span>{b.avatar}</span>
        {b.verified && <span className="v-badge" style={{ background: b.color }}>✓</span>}
      </div>
      <div className="b-info">
        <div className="b-name-row">
          <span className="b-name">{b.name}</span>
          <span className="platform-tag">{b.platform}</span>
        </div>
        <span className="b-tag" style={{ color: b.color }}>{b.tag}</span>
        <span className="b-fans">{b.followers} 粉丝</span>
      </div>
      <button
        className="follow-btn"
        style={followed
          ? { background: '#F3F4F6', color: '#9CA3AF' }
          : { background: b.color, color: '#fff' }}
        onClick={() => onToggle(b.id)}
      >
        {followed ? '已关注' : '+ 关注'}
      </button>
    </div>
  )
}

const PLATFORMS = ['抖音', '小红书', '微博', 'B站']

function AddBloggerSheet({ followedIds, onClose, onFollowSuggested, onAddCustom }) {
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState('全部')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  // 防抖搜索后端 KOL 库
  useEffect(() => {
    const q = query.trim()
    if (!q) { setResults([]); setLoading(false); return }
    setLoading(true)
    const timer = setTimeout(async () => {
      const { results } = await searchKol(q)
      setResults(results)
      setLoading(false)
    }, 350)
    return () => clearTimeout(timer)
  }, [query])

  const filtered = platform === '全部' ? results : results.filter(b => b.platform === platform)
  const exactExists = results.some(b => b.name === query.trim())
  const canCustom = query.trim().length > 0 && !loading && !exactExists

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="add-title">搜索并添加 KOL</h3>

        <div className="add-search-row">
          <span className="add-search-icon">🔍</span>
          <input
            className="add-input"
            placeholder="搜索 KOL 名称 / 领域，如 程十安、护肤、欧美妆"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && <button className="add-clear" onClick={() => setQuery('')}>✕</button>}
        </div>

        <div className="platform-row">
          {['全部', ...PLATFORMS].map(p => (
            <button
              key={p}
              className={`platform-chip ${platform === p ? 'active' : ''}`}
              onClick={() => setPlatform(p)}
            >{p}</button>
          ))}
        </div>

        <div className="add-list">
          {loading && (
            <div className="search-loading"><div className="spinner sm" /><span>搜索中…</span></div>
          )}

          {!loading && filtered.map(b => {
            const isFollowed = followedIds.has(b.id)
            return (
              <div key={b.id} className="suggest-row">
                <div className="b-avatar sm" style={{ background: `${b.color}18` }}>
                  <span>{b.avatar}</span>
                  {b.verified && <span className="v-badge" style={{ background: b.color }}>✓</span>}
                </div>
                <div className="b-info">
                  <div className="b-name-row">
                    <span className="b-name">{b.name}</span>
                    <span className="platform-tag">{b.platform}</span>
                  </div>
                  <span className="b-tag" style={{ color: b.color }}>{b.tag} · {b.followers}粉丝</span>
                </div>
                <button
                  className="follow-btn"
                  style={isFollowed
                    ? { background: '#F3F4F6', color: '#9CA3AF' }
                    : { background: b.color, color: '#fff' }}
                  onClick={() => onFollowSuggested(b)}
                >
                  {isFollowed ? '已添加' : '+ 关注'}
                </button>
              </div>
            )
          })}

          {canCustom && (
            <button
              className="custom-add-btn"
              onClick={() => { onAddCustom(query, platform === '全部' ? '抖音' : platform); onClose() }}
            >
              <span className="custom-add-icon">＋</span>
              <span>没找到？手动添加「{query.trim()}」</span>
            </button>
          )}

          {!loading && !query.trim() && (
            <p className="add-empty">输入关键字，搜索全网美妆 KOL</p>
          )}
        </div>

        <button className="add-done-btn" onClick={onClose}>完成</button>
      </div>
    </div>
  )
}

function BloggersTab() {
  const [list, setList] = useState(seedBloggers)
  const [followed, setFollowed] = useState(new Set([1, 2]))
  const [showAdd, setShowAdd] = useState(false)

  // 后端在线时，用后端追踪到的博主作为初始列表并默认标记已关注
  useEffect(() => {
    fetchBloggers().then(r => {
      if (r.source === 'live' && r.bloggers.length) {
        setList(r.bloggers)
        setFollowed(new Set(r.bloggers.map(b => b.id)))
      }
    })
  }, [])

  const toggle = id => setFollowed(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s })

  const followSuggested = b => {
    setList(prev => prev.some(x => x.id === b.id) ? prev : [b, ...prev])
    setFollowed(prev => new Set(prev).add(b.id))
  }

  const addCustom = (name, platform) => {
    const b = createCustomBlogger(name, platform)
    setList(prev => [b, ...prev])
    setFollowed(prev => new Set(prev).add(b.id))
  }

  return (
    <div className="tab-content">
      <div className="trends-topbar">
        <div>
          <h2 className="topbar-title">美妆 KOL</h2>
          <p className="topbar-sub">已关注 {followed.size} 位 KOL</p>
        </div>
        <button className="add-blogger-btn" onClick={() => setShowAdd(true)}>＋ 添加 KOL</button>
      </div>
      <div className="scroll-area">
        {list.map(b => (
          <BloggerRow key={b.id} b={b} followed={followed.has(b.id)} onToggle={toggle} />
        ))}
      </div>
      {showAdd && (
        <AddBloggerSheet
          followedIds={followed}
          onClose={() => setShowAdd(false)}
          onFollowSuggested={followSuggested}
          onAddCustom={addCustom}
        />
      )}
    </div>
  )
}

/* ─── Feed Tab ──────────────────────────────── */
function FeedTab() {
  const [posts, setPosts] = useState([])
  const [source, setSource] = useState('local')
  const [liked, setLiked] = useState(new Set())
  const toggle = id => setLiked(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s })

  useEffect(() => {
    fetchFeed().then(r => { setPosts(r.feed); setSource(r.source) })
  }, [])

  return (
    <div className="tab-content">
      <div className="trends-topbar">
        <div>
          <h2 className="topbar-title">博主动态</h2>
          <p className="topbar-sub">
            <span className={`live-dot ${source === 'live' ? 'on' : 'off'}`} />
            {source === 'live' ? '后端实时聚合' : '关注博主的最新内容'}
          </p>
        </div>
      </div>
      <div className="scroll-area">
        {posts.map(post => (
          <div key={post.id} className="feed-card">
            <div className="feed-top">
              <div className="feed-avatar" style={{ background: `${post.blogger.color}18` }}>{post.blogger.avatar}</div>
              <div className="feed-meta">
                <span className="feed-name">{post.blogger.name}</span>
                <span className="feed-time">{post.time} · {post.platform}</span>
              </div>
              <div className="feed-right">
                {post.isHot && <span className="hot-tag">🔥 热门</span>}
                <Chip label={post.cat} color={post.blogger.color} />
              </div>
            </div>
            <div className="feed-body">
              <div className="feed-thumb">{post.image}</div>
              <div className="feed-text">
                <p className="feed-title">{post.title}</p>
                <p className="feed-preview">{post.preview}</p>
              </div>
            </div>
            <div className="feed-actions">
              <button className="act-btn" onClick={() => toggle(post.id)}>
                <span>{liked.has(post.id) ? '❤️' : '🤍'}</span>
                <span style={{ color: liked.has(post.id) ? '#FF6B9D' : '#9CA3AF' }}>{post.likes}</span>
              </button>
              <button className="act-btn"><span>💬</span><span>{post.comments}</span></button>
              <button className="act-btn"><span>📤</span><span>分享</span></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Profile Tab ───────────────────────────── */
function ProfileTab() {
  const settings = [
    { icon: '🔔', label: '推送通知',  sub: '每日 10:00 自动推送趋势日报' },
    { icon: '🎨', label: '内容偏好',  sub: '彩妆 / 护肤 / 医美 / 工具' },
    { icon: '📱', label: '关注平台',  sub: '抖音 / 小红书 / 微博' },
    { icon: '🌙', label: '深色模式',  sub: '跟随系统' },
    { icon: '💬', label: '意见反馈',  sub: '告诉我们你的想法' },
    { icon: 'ℹ️', label: '关于',      sub: '美妆趋势 v2.0.0' },
  ]
  return (
    <div className="tab-content">
      <div className="profile-hero">
        <div className="profile-ava">💁‍♀️</div>
        <h2 className="profile-name">美妆爱好者</h2>
        <p className="profile-bio">探索美妆的无限可能 ✨</p>
        <div className="stats-row">
          {[['6', '关注博主'], ['15', '追踪分类'], ['138', '浏览记录']].map(([n, l]) => (
            <div key={l} className="stat-cell">
              <span className="stat-n">{n}</span>
              <span className="stat-l">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-area" style={{ marginTop: 8 }}>
        {settings.map(s => (
          <div key={s.label} className="setting-row">
            <span className="setting-icon">{s.icon}</span>
            <div className="setting-text">
              <span className="setting-label">{s.label}</span>
              <span className="setting-sub">{s.sub}</span>
            </div>
            <span className="setting-arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Root ──────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState('trends')
  const today = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })

  return (
    <div className="app">
      <header className="app-header">
        <span className="header-logo">💄</span>
        <span className="header-title">美妆趋势</span>
        <span className="header-date">{today}</span>
      </header>

      <main className="app-main">
        {active === 'trends'   && <TrendsTab />}
        {active === 'bloggers' && <BloggersTab />}
        {active === 'feed'     && <FeedTab />}
        {active === 'profile'  && <ProfileTab />}
      </main>

      <nav className="tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
            {active === t.id && <span className="tab-pip" />}
          </button>
        ))}
      </nav>
    </div>
  )
}
