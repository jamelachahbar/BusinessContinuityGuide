/**
 * Application Context — manages multiple application workloads.
 * ALL workbench data is namespaced per application.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

const REGISTRY_KEY = 'abcg_app-registry'
const CURRENT_KEY = 'abcg_current-app'

export interface AppEntry {
  id: string
  name: string
  createdAt: string
}

interface AppContextType {
  apps: AppEntry[]
  currentApp: AppEntry
  selectApp: (id: string) => void
  addApp: (name: string) => void
  renameApp: (id: string, name: string) => void
  deleteApp: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'app'
}

function loadRegistry(): AppEntry[] {
  const raw = localStorage.getItem(REGISTRY_KEY)
  if (!raw) return []
  try { return JSON.parse(raw) as AppEntry[] } catch { return [] }
}

function saveRegistry(apps: AppEntry[]): void {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(apps))
}

const DEFAULT_APP: AppEntry = {
  id: 'default',
  name: 'Sample Solution',
  createdAt: new Date().toISOString(),
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [apps, setApps] = useState<AppEntry[]>(() => {
    const saved = loadRegistry()
    return saved.length > 0 ? saved : [DEFAULT_APP]
  })
  const [currentId, setCurrentId] = useState<string>(() => {
    const saved = localStorage.getItem(CURRENT_KEY)
    const registry = loadRegistry()
    if (saved && registry.some(a => a.id === saved)) return saved
    return registry[0]?.id ?? 'default'
  })

  const currentApp = apps.find(a => a.id === currentId) ?? apps[0] ?? DEFAULT_APP

  const selectApp = useCallback((id: string) => {
    setCurrentId(id)
    localStorage.setItem(CURRENT_KEY, id)
  }, [])

  const addApp = useCallback((name: string) => {
    const id = `${slugify(name)}-${Date.now()}`
    const entry: AppEntry = { id, name, createdAt: new Date().toISOString() }
    const updated = [...apps, entry]
    setApps(updated)
    saveRegistry(updated)
    setCurrentId(id)
    localStorage.setItem(CURRENT_KEY, id)
  }, [apps])

  const renameApp = useCallback((id: string, name: string) => {
    const updated = apps.map(a => a.id === id ? { ...a, name } : a)
    setApps(updated)
    saveRegistry(updated)
  }, [apps])

  const deleteApp = useCallback((id: string) => {
    // Remove ALL data for this app
    const prefix = `abcg_${id}_`
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key?.startsWith(prefix)) localStorage.removeItem(key)
    }
    const updated = apps.filter(a => a.id !== id)
    if (updated.length === 0) updated.push(DEFAULT_APP)
    setApps(updated)
    saveRegistry(updated)
    if (currentId === id) {
      setCurrentId(updated[0].id)
      localStorage.setItem(CURRENT_KEY, updated[0].id)
    }
  }, [apps, currentId])

  return (
    <AppContext.Provider value={{ apps, currentApp, selectApp, addApp, renameApp, deleteApp }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
