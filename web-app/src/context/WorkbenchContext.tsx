/**
 * Workbench Context — localStorage persistence with per-app namespacing.
 *
 * All data keys are prefixed with: abcg_{appId}_{key}
 * This means every application gets its own complete set of data
 * across ALL phases (Phase 1, 2, and 3).
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useAppContext } from './AppContext'

const BASE_PREFIX = 'abcg_'

export interface WorkbenchContextType {
  saveData: (key: string, data: unknown) => void
  loadData: <T>(key: string, defaultValue: T) => T
  exportJSON: () => void
  importJSON: (file: File) => Promise<void>
  clearAll: () => void
  hasData: boolean
  /** Current app-scoped prefix for direct localStorage access */
  storagePrefix: string
}

const WorkbenchContext = createContext<WorkbenchContextType | null>(null)

export function WorkbenchProvider({ children }: { children: ReactNode }) {
  const { currentApp, importApp } = useAppContext()
  const prefix = `${BASE_PREFIX}${currentApp.id}_`

  function getKeys(): string[] {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(prefix)) keys.push(key)
    }
    return keys
  }

  const [hasData, setHasData] = useState(() => getKeys().length > 0)

  const refreshHasData = useCallback(() => {
    setHasData(getKeys().length > 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix])

  useEffect(() => {
    refreshHasData()
  }, [refreshHasData])

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key?.startsWith(prefix) || e.key === null) refreshHasData()
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [prefix, refreshHasData])

  const saveData = useCallback((key: string, data: unknown) => {
    localStorage.setItem(`${prefix}${key}`, JSON.stringify(data))
    setHasData(true)
  }, [prefix])

  const loadData = useCallback(<T,>(key: string, defaultValue: T): T => {
    const raw = localStorage.getItem(`${prefix}${key}`)
    if (raw === null) return defaultValue
    try { return JSON.parse(raw) as T } catch { return defaultValue }
  }, [prefix])

  const exportJSON = useCallback(() => {
    const keys = getKeys()
    const data: Record<string, unknown> = {}
    for (const fullKey of keys) {
      const raw = localStorage.getItem(fullKey)
      if (raw !== null) {
        const shortKey = fullKey.slice(prefix.length)
        try { data[shortKey] = JSON.parse(raw) } catch { data[shortKey] = raw }
      }
    }
    const exported = {
      _meta: { app: 'BoltPlan Workbench', version: 1, appName: currentApp.name, appId: currentApp.id, exportedAt: new Date().toISOString() },
      data,
    }
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `BoltPlan_${currentApp.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix, currentApp])

  const importJSON = useCallback(async (file: File) => {
    const text = await file.text()
    let parsed: unknown
    try { parsed = JSON.parse(text) } catch { throw new Error('Invalid JSON file') }
    if (typeof parsed !== 'object' || parsed === null || !('_meta' in parsed) || !('data' in parsed)) {
      throw new Error('Invalid workbench export file')
    }
    const { data, _meta } = parsed as { data: Record<string, unknown>; _meta: Record<string, unknown> }
    if (typeof data !== 'object' || data === null) throw new Error('Invalid data')

    // Determine target solution from export metadata. Fall back to current solution.
    const metaId = typeof _meta?.appId === 'string' ? _meta.appId : ''
    const metaName = typeof _meta?.appName === 'string' && _meta.appName.trim() ? _meta.appName : 'Imported Solution'
    const targetId = metaId ? importApp(metaId, metaName) : currentApp.id
    const targetPrefix = `${BASE_PREFIX}${targetId}_`

    // Clear any existing data under the target prefix so removed entries don't linger
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i)
      if (k?.startsWith(targetPrefix)) localStorage.removeItem(k)
    }
    for (const [key, value] of Object.entries(data)) {
      localStorage.setItem(`${targetPrefix}${key}`, JSON.stringify(value))
    }
    setHasData(true)
    // Notify all useWorkbenchData hooks to re-read from localStorage
    window.dispatchEvent(new Event('workbench-data-changed'))
  }, [prefix, currentApp.id, importApp])

  const clearAll = useCallback(() => {
    const keys = getKeys()
    for (const key of keys) localStorage.removeItem(key)
    setHasData(false)
    window.dispatchEvent(new Event('workbench-data-changed'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix])

  return (
    <WorkbenchContext.Provider value={{ saveData, loadData, exportJSON, importJSON, clearAll, hasData, storagePrefix: prefix }}>
      {children}
    </WorkbenchContext.Provider>
  )
}

export function useWorkbenchContext(): WorkbenchContextType {
  const ctx = useContext(WorkbenchContext)
  if (!ctx) throw new Error('useWorkbenchContext must be used within WorkbenchProvider')
  return ctx
}
