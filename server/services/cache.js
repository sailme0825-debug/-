// 简单的文件 + 内存缓存。定时任务刷新后写入，重启后仍能秒回上次数据。
import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CACHE_DIR = join(__dirname, '..', '.cache')
const CACHE_FILE = join(CACHE_DIR, 'snapshot.json')

let memory = { trends: [], bloggers: [], feed: [], updatedAt: null }

export async function loadFromDisk() {
  try {
    const raw = await readFile(CACHE_FILE, 'utf8')
    memory = JSON.parse(raw)
    console.log('[cache] 已从磁盘恢复快照', memory.updatedAt)
  } catch {
    console.log('[cache] 无历史快照，等待首次刷新')
  }
  return memory
}

export async function save(snapshot) {
  memory = { ...snapshot, updatedAt: new Date().toISOString() }
  try {
    await mkdir(CACHE_DIR, { recursive: true })
    await writeFile(CACHE_FILE, JSON.stringify(memory, null, 2))
  } catch (e) {
    console.warn('[cache] 写盘失败', e.message)
  }
  return memory
}

export function get() { return memory }
