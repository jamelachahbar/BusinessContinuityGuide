import { useState, useCallback, useEffect } from 'react'
import { useWorkbenchContext } from '../context/WorkbenchContext'

/** Auto-apply any pending criticality renames to loaded data */
function applyCriticalityRenames<T>(data: T, storagePrefix: string): T {
  const ledger: Record<string, string> = JSON.parse(localStorage.getItem(`${storagePrefix}criticalityRenames`) || '{}')
  if (Object.keys(ledger).length === 0) return data
  if (!Array.isArray(data)) return data
  let changed = false
  const updated = (data as unknown[]).map(row => {
    if (row && typeof row === 'object' && 'criticality' in row) {
      const r = row as Record<string, unknown>
      const oldName = r.criticality as string
      if (ledger[oldName]) {
        changed = true
        return { ...r, criticality: ledger[oldName] }
      }
    }
    return row
  })
  return (changed ? updated : data) as T
}

export function useWorkbenchData<T>(key: string, defaultValue: T): [T, (value: T) => void, () => void] {
  const { saveData, loadData, storagePrefix } = useWorkbenchContext()
  const [value, setValue] = useState<T>(() => {
    let loaded = loadData(key, defaultValue)
    // Persist default data so external updates can find it
    if (localStorage.getItem(`${storagePrefix}${key}`) === null) {
      saveData(key, defaultValue)
    }
    // Auto-apply pending criticality renames
    loaded = applyCriticalityRenames(loaded, storagePrefix)
    return loaded
  })

  const setData = useCallback((newValue: T) => {
    setValue(newValue)
    saveData(key, newValue)
  }, [key, saveData])

  const resetToDefault = useCallback(() => {
    setValue(defaultValue)
    localStorage.removeItem(`${storagePrefix}${key}`)
  }, [key, defaultValue, storagePrefix])

  // Re-read from localStorage when external changes occur
  useEffect(() => {
    const handler = () => setValue(applyCriticalityRenames(loadData(key, defaultValue), storagePrefix))
    window.addEventListener('workbench-data-changed', handler)
    return () => window.removeEventListener('workbench-data-changed', handler)
  }, [key, defaultValue, loadData])

  return [value, setData, resetToDefault]
}
