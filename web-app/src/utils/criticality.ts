/**
 * Shared criticality color mapping.
 * Maps criticality level names to their display color.
 * Used across Phase 1, Phase 2, Phase 3, and MBCO tables.
 */

export interface CriticalityLevel {
  name: string
  color: string
  textColor: string
}

const CRITICALITY_MAP: Record<string, CriticalityLevel> = {
  'mission critical':     { name: 'Mission Critical',     color: '#dc3545', textColor: '#ffffff' },
  'business critical':    { name: 'Business Critical',    color: '#dc3545', textColor: '#ffffff' },
  'compliance critical':  { name: 'Compliance Critical',  color: '#dc3545', textColor: '#ffffff' },
  'safety critical':      { name: 'Safety Critical',      color: '#dc3545', textColor: '#ffffff' },
  'security critical':    { name: 'Security Critical',    color: '#fd7e14', textColor: '#ffffff' },
  'unit critical':        { name: 'Unit Critical',        color: '#fd7e14', textColor: '#ffffff' },
  'high':                 { name: 'High',                 color: '#ffc107', textColor: '#1a1a1a' },
  'medium':               { name: 'Medium',               color: '#28a745', textColor: '#ffffff' },
  'low':                  { name: 'Low',                  color: '#28a745', textColor: '#ffffff' },
  'unsupported':          { name: 'Unsupported',          color: '#6c757d', textColor: '#ffffff' },
}

/**
 * Get the color for a criticality level by name (case-insensitive).
 * Falls back to gray for unknown levels.
 */
export function getCriticalityColor(name: string): CriticalityLevel {
  const key = name.trim().toLowerCase()
  return CRITICALITY_MAP[key] ?? { name, color: '#6c757d', textColor: '#ffffff' }
}

/**
 * Get all known criticality levels (for dropdowns, legends, etc.)
 */
export function getAllCriticalityLevels(): CriticalityLevel[] {
  return Object.values(CRITICALITY_MAP)
}

/**
 * Return only the unique criticality levels suitable for a dropdown selector.
 */
export function getCriticalityOptions(): { label: string; value: string; color: string }[] {
  return [
    { label: 'Mission Critical', value: 'Mission Critical', color: '#dc3545' },
    { label: 'Business Critical', value: 'Business Critical', color: '#dc3545' },
    { label: 'Compliance Critical', value: 'Compliance Critical', color: '#dc3545' },
    { label: 'Safety Critical', value: 'Safety Critical', color: '#dc3545' },
    { label: 'Security Critical', value: 'Security Critical', color: '#fd7e14' },
    { label: 'Unit Critical', value: 'Unit Critical', color: '#fd7e14' },
    { label: 'High', value: 'High', color: '#ffc107' },
    { label: 'Medium', value: 'Medium', color: '#28a745' },
    { label: 'Low', value: 'Low', color: '#28a745' },
    { label: 'Unsupported', value: 'Unsupported', color: '#6c757d' },
  ]
}
