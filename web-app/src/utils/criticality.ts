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

/* ═══════ Configurable criticality levels ═══════ */

export interface ConfigurableCriticalityLevel {
  name: string
  color: string
  textColor: string
}

export const DEFAULT_CRITICALITY_LEVELS: ConfigurableCriticalityLevel[] = [
  { name: 'Mission Critical',    color: '#dc3545', textColor: '#ffffff' },
  { name: 'Business Critical',   color: '#dc3545', textColor: '#ffffff' },
  { name: 'Compliance Critical', color: '#dc3545', textColor: '#ffffff' },
  { name: 'Safety Critical',     color: '#dc3545', textColor: '#ffffff' },
  { name: 'Security Critical',   color: '#fd7e14', textColor: '#ffffff' },
  { name: 'Unit Critical',       color: '#fd7e14', textColor: '#ffffff' },
  { name: 'High',                color: '#ffc107', textColor: '#1a1a1a' },
  { name: 'Medium',              color: '#28a745', textColor: '#ffffff' },
  { name: 'Low',                 color: '#28a745', textColor: '#ffffff' },
  { name: 'Unsupported',         color: '#6c757d', textColor: '#ffffff' },
]

/** Build a color lookup from a dynamic levels array */
export function buildCriticalityMap(levels: ConfigurableCriticalityLevel[]): (name: string) => CriticalityLevel {
  const map: Record<string, CriticalityLevel> = {}
  for (const l of levels) {
    map[l.name.trim().toLowerCase()] = l
  }
  return (name: string) => map[name.trim().toLowerCase()] ?? { name, color: '#6c757d', textColor: '#ffffff' }
}

/**
 * Shape of a row inside the Phase 1 Criticality Model — the single source of
 * truth for tiers + criticality levels across the workbench. Optional fields
 * are tolerated so consumers can pass partial data without crashing.
 */
export interface CriticalityModelRowLike {
  tier?: string
  criticality?: string
  color?: string
  textColor?: string
}

/**
 * Derive the configurable criticality-level list (used for dropdowns, badges,
 * color lookups) from the Phase 1 Criticality Model rows. Deduplicates by
 * criticality name, preserves order, and falls back to gray when missing.
 */
export function levelsFromCriticalityRows(rows: CriticalityModelRowLike[]): ConfigurableCriticalityLevel[] {
  const seen = new Set<string>()
  const out: ConfigurableCriticalityLevel[] = []
  for (const r of rows ?? []) {
    const name = (r?.criticality ?? '').trim()
    if (!name) continue
    const key = name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push({
      name,
      color: r.color || '#6c757d',
      textColor: r.textColor || '#ffffff',
    })
  }
  return out.length > 0 ? out : DEFAULT_CRITICALITY_LEVELS
}

/**
 * Derive the unique tier labels (in order of first appearance) from the
 * Phase 1 Criticality Model rows. Used for table column headers (Fault Model,
 * BCM) so tier names propagate automatically when edited in one place.
 */
export function tiersFromCriticalityRows(rows: CriticalityModelRowLike[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const r of rows ?? []) {
    const tier = (r?.tier ?? '').trim()
    if (!tier || seen.has(tier)) continue
    seen.add(tier)
    out.push(tier)
  }
  return out
}
