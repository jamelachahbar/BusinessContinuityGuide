import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

const STORAGE_PREFIX = 'abcg_'

export interface WorkbenchContextType {
  saveData: (key: string, data: unknown) => void
  loadData: <T>(key: string, defaultValue: T) => T
  exportJSON: () => void
  importJSON: (file: File) => Promise<void>
  clearAll: () => void
  hasData: boolean
}

const WorkbenchContext = createContext<WorkbenchContextType | null>(null)

function getAllWorkbenchKeys(): string[] {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_PREFIX)) {
      keys.push(key)
    }
  }
  return keys
}

export function WorkbenchProvider({ children }: { children: ReactNode }) {
  const [hasData, setHasData] = useState(() => getAllWorkbenchKeys().length > 0)

  const refreshHasData = useCallback(() => {
    setHasData(getAllWorkbenchKeys().length > 0)
  }, [])

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key?.startsWith(STORAGE_PREFIX) || e.key === null) {
        refreshHasData()
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [refreshHasData])

  const saveData = useCallback((key: string, data: unknown) => {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data))
    setHasData(true)
  }, [])

  const loadData = useCallback(<T,>(key: string, defaultValue: T): T => {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    if (raw === null) return defaultValue
    try {
      return JSON.parse(raw) as T
    } catch {
      return defaultValue
    }
  }, [])

  const exportJSON = useCallback(() => {
    const keys = getAllWorkbenchKeys()
    const data: Record<string, unknown> = {}
    for (const fullKey of keys) {
      const raw = localStorage.getItem(fullKey)
      if (raw !== null) {
        try {
          data[fullKey.slice(STORAGE_PREFIX.length)] = JSON.parse(raw)
        } catch {
          data[fullKey.slice(STORAGE_PREFIX.length)] = raw
        }
      }
    }

    const exported = {
      _meta: {
        app: 'ABC Guide Workbench',
        version: 1,
        exportedAt: new Date().toISOString(),
      },
      data,
    }

    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const date = new Date().toISOString().slice(0, 10)
    const a = document.createElement('a')
    a.href = url
    a.download = `ABC_Guide_Workbench_${date}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const importJSON = useCallback(async (file: File) => {
    const text = await file.text()
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      throw new Error('Invalid JSON file')
    }

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('_meta' in parsed) ||
      !('data' in parsed)
    ) {
      throw new Error('Invalid workbench export file — missing _meta or data')
    }

    const { data } = parsed as { data: Record<string, unknown> }
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid workbench export file — data is not an object')
    }

    for (const [key, value] of Object.entries(data)) {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
    }
    setHasData(true)
  }, [])

  const clearAll = useCallback(() => {
    const keys = getAllWorkbenchKeys()
    for (const key of keys) {
      localStorage.removeItem(key)
    }
    setHasData(false)
  }, [])

  return (
    <WorkbenchContext.Provider value={{ saveData, loadData, exportJSON, importJSON, clearAll, hasData }}>
      {children}
    </WorkbenchContext.Provider>
  )
}

export function useWorkbenchContext(): WorkbenchContextType {
  const ctx = useContext(WorkbenchContext)
  if (!ctx) {
    throw new Error('useWorkbenchContext must be used within a WorkbenchProvider')
  }
  return ctx
}
