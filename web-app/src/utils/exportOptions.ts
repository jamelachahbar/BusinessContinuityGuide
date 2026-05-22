/**
 * Shared export options for PDF / DOCX / CSV generators.
 *
 * Tier-1 sections (ISO 22301 mandatory + WAF core) are always included.
 * Tier-2 sections are optional and can be toggled by the user.
 */

export interface BcpExportOptions {
  /** §9 Cost Analysis (financial planning, not BC compliance). */
  costAnalysis: boolean
  /** §8.1 Metric Comparison (engineering before/after). */
  metricComparison: boolean
  /** Appendix B: Fault Model / FMEA (WAF-recommended, not required). */
  faultModel: boolean
  /** Appendix C: RACI Matrix. */
  raci: boolean
  /** Appendix D: BCM Tier Requirements (7 sub-sections). */
  bcmTierRequirements: boolean
  /** Appendix E: Application Requirements catalog. */
  appRequirements: boolean
  /** Appendix F: Test Plans catalog. */
  testPlansCatalog: boolean
  /** Appendix G: Programme-level (Phase 3 MBCO, BIA Portfolio, Calendar, Activity). */
  programmeLevel: boolean
}

/** Defaults match current PDF/DOCX behavior (cost + metric on, rest off). */
export const defaultExportOptions: BcpExportOptions = {
  costAnalysis: true,
  metricComparison: true,
  faultModel: false,
  raci: false,
  bcmTierRequirements: false,
  appRequirements: false,
  testPlansCatalog: false,
  programmeLevel: false,
}

export const exportOptionLabels: { key: keyof BcpExportOptions; label: string; description: string }[] = [
  { key: 'costAnalysis', label: 'Cost Analysis', description: 'Current vs. +BCDR cost comparison (§9).' },
  { key: 'metricComparison', label: 'Metric Comparison', description: 'Before / after availability, reliability, security scores (§8.1).' },
  { key: 'faultModel', label: 'Fault Model (FMEA)', description: 'WAF-recommended failure mode analysis by criticality tier.' },
  { key: 'raci', label: 'RACI Matrix', description: 'Responsibility assignment across BCDR tasks.' },
  { key: 'bcmTierRequirements', label: 'BCM Tier Requirements', description: 'Detailed requirements per criticality tier (7 sub-sections).' },
  { key: 'appRequirements', label: 'Application Requirements Catalog', description: 'Per-category requirements checklist.' },
  { key: 'testPlansCatalog', label: 'Test Plans Catalog', description: 'Catalog of test types and frequencies.' },
  { key: 'programmeLevel', label: 'Programme-level (Phase 3)', description: 'MBCO recovery order, BIA portfolio, calendar, activity log.' },
]

/* ── Shared localStorage loader (used by all generators) ── */

export function getAppPrefix(): string {
  return `abcg_${localStorage.getItem('abcg_current-app') ?? 'default'}_`
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(`${getAppPrefix()}${key}`)
  if (!raw) return fallback
  try { return JSON.parse(raw) as T } catch { return fallback }
}

export function getAppName(): string {
  const id = localStorage.getItem('abcg_current-app') ?? 'default'
  const raw = localStorage.getItem('abcg_app-registry')
  if (!raw) return 'Sample Solution'
  try {
    return (JSON.parse(raw) as { id: string; name: string }[]).find(a => a.id === id)?.name ?? 'Sample Solution'
  } catch {
    return 'Sample Solution'
  }
}
