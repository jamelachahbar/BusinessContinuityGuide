import { useState, useCallback } from 'react'
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

  return [value, setData, resetToDefault]
}
