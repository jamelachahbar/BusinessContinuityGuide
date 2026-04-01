/**
 * Unified Design System — color palette and tokens.
 * All colors used across the app should reference these constants.
 */

/* ── Brand gradient ── */
export const BRAND = {
  primary: '#667eea',
  secondary: '#764ba2',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradientVertical: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
  hover: '#5a6fd6',
  light: 'rgba(102, 126, 234, 0.08)',
  ring: 'rgba(102, 126, 234, 0.35)',
} as const

/* ── Criticality severity ── */
export const SEVERITY = {
  critical: '#dc3545',
  high: '#fd7e14',
  warning: '#ffc107',
  success: '#28a745',
  info: '#0078d4',
  neutral: '#6c757d',
} as const

/* ── Surface / background ── */
export const SURFACE = {
  page: '#f8f9fa',
  card: '#ffffff',
  cardHover: '#f1f5f9',
  muted: '#e2e8f0',
  border: '#e2e8f0',
  divider: 'rgba(255, 255, 255, 0.15)',
} as const

/* ── Text ── */
export const TEXT = {
  primary: '#1a202c',
  secondary: '#718096',
  muted: '#a0aec0',
  inverse: '#ffffff',
  onWarning: '#1a1a1a',
} as const

/* ── Chart palette ── */
export const CHART = {
  blue: '#667eea',
  purple: '#764ba2',
  green: '#28a745',
  red: '#dc3545',
  orange: '#fd7e14',
  yellow: '#ffc107',
  cyan: '#17a2b8',
  teal: '#20c997',
  navy: '#1a237e',
  pink: '#f093fb',
} as const

/* ── Service map node colors ── */
export const NODE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Networking: { bg: '#4285F4', border: '#3367d6', text: '#fff' },
  Compute:    { bg: '#764ba2', border: '#5e3a82', text: '#fff' },
  Data:       { bg: '#28a745', border: '#1e7e34', text: '#fff' },
  Cache:      { bg: '#fd7e14', border: '#d96a0b', text: '#fff' },
  Messaging:  { bg: '#ffc107', border: '#d6a206', text: '#1a1a1a' },
  Security:   { bg: '#dc3545', border: '#bd2130', text: '#fff' },
  Monitoring: { bg: '#17a2b8', border: '#117a8b', text: '#fff' },
  Identity:   { bg: '#1a237e', border: '#0d1259', text: '#fff' },
  Storage:    { bg: '#20c997', border: '#17a37d', text: '#fff' },
} as const

/* ── RACI colors ── */
export const RACI = {
  R: '#003366',
  A: '#336699',
  C: '#6699CC',
  I: '#99CCFF',
  IText: '#1a202c',
} as const

/* ── Sidebar ── */
export const SIDEBAR = {
  width: 240,
  collapsedWidth: 64,
  transition: '0.25s cubic-bezier(0.4, 0, 0.2, 1)',
} as const

/* ── Response plan scope gradient ── */
export const SCOPE_COLORS = [
  '#1a237e', '#283593', '#303f9f', '#3949ab', '#3f51b5', '#5c6bc0',
] as const
