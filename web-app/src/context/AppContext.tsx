/**
 * Application Context — manages multiple application workloads.
 *
 * Phase 1 (Prepare) and Phase 3 (Business Continuity) are organizational-level.
 * Phase 2 (Application Continuity) is per-application — each application gets
 * its own set of requirements, BIA, gap assessment, cost, tests, etc.
 *
 * Data is namespaced in localStorage as:
 *   abcg_phase2-{appSlug}-{key}
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

const STORAGE_KEY = 'abcg_app-registry'

export interface AppEntry {
  id: string
  name: string
  createdAt: string
}

interface AppContextType {
  /** All registered applications */
  apps: AppEntry[]
  /** Currently selected application */
  currentApp: AppEntry
  /** Select a different application */
  selectApp: (id: string) => void
  /** Create a new application */
  addApp: (name: string) => void
  /** Rename an application */
  renameApp: (id: string, name: string) => void
  /** Delete an application and its data */
  deleteApp: (id: string) => void
  /** Get the storage key prefix for Phase 2 data */
  phase2Prefix: string
}

const AppContext = createContext<AppContextType | null>(null)

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'app'
}

function loadRegistry(): AppEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try { return JSON.parse(raw) as AppEntry[] } catch { return [] }
}

function saveRegistry(apps: AppEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
}

const DEFAULT_APP: AppEntry = {
  id: 'default',
  name: 'Sample Application',
  createdAt: new Date().toISOString(),
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [apps, setApps] = useState<AppEntry[]>(() => {
    const saved = loadRegistry()
    return saved.length > 0 ? saved : [DEFAULT_APP]
  })
  const [currentId, setCurrentId] = useState<string>(() => {
    const saved = localStorage.getItem('abcg_current-app')
    const registry = loadRegistry()
    if (saved && registry.some(a => a.id === saved)) return saved
    return registry[0]?.id ?? 'default'
  })

  const currentApp = apps.find(a => a.id === currentId) ?? apps[0] ?? DEFAULT_APP

  const selectApp = useCallback((id: string) => {
    setCurrentId(id)
    localStorage.setItem('abcg_current-app', id)
    // Force page reload to reset all useWorkbenchData hooks
    window.location.reload()
  }, [])

  const addApp = useCallback((name: string) => {
    const id = `${slugify(name)}-${Date.now()}`
    const entry: AppEntry = { id, name, createdAt: new Date().toISOString() }
    const updated = [...apps, entry]
    setApps(updated)
    saveRegistry(updated)
    selectApp(id)
  }, [apps, selectApp])

  const renameApp = useCallback((id: string, name: string) => {
    const updated = apps.map(a => a.id === id ? { ...a, name } : a)
    setApps(updated)
    saveRegistry(updated)
  }, [apps])

  const deleteApp = useCallback((id: string) => {
    // Remove all Phase 2 data for this app
    const prefix = `abcg_phase2-${id}-`
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key?.startsWith(prefix)) localStorage.removeItem(key)
    }
    const updated = apps.filter(a => a.id !== id)
    if (updated.length === 0) updated.push(DEFAULT_APP)
    setApps(updated)
    saveRegistry(updated)
    if (currentId === id) selectApp(updated[0].id)
  }, [apps, currentId, selectApp])

  const phase2Prefix = `phase2-${currentApp.id}-`

  return (
    <AppContext.Provider value={{ apps, currentApp, selectApp, addApp, renameApp, deleteApp, phase2Prefix }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
