import { useState, useCallback, useEffect } from 'react'
import { useWorkbenchContext } from '../context/WorkbenchContext'

export function useWorkbenchData<T>(key: string, defaultValue: T): [T, (value: T) => void, () => void] {
  const { saveData, loadData, storagePrefix } = useWorkbenchContext()
  const [value, setValue] = useState<T>(() => loadData(key, defaultValue))

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
    const handler = () => setValue(loadData(key, defaultValue))
    window.addEventListener('workbench-data-changed', handler)
    return () => window.removeEventListener('workbench-data-changed', handler)
  }, [key, defaultValue, loadData])

  return [value, setData, resetToDefault]
}
