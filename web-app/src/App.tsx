import { useState, useEffect, useRef, useCallback } from 'react'
import {
  makeStyles,
  tokens,
  shorthands,
  Button,
  Tooltip,
  Badge,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogTrigger,
} from '@fluentui/react-components'
import {
  Home24Regular,
  BookOpen24Regular,
  ClipboardTaskListLtr24Regular,
  Shield24Regular,
  People24Regular,
  BookDatabase24Regular,
  LinkMultiple24Regular,
  Navigation24Regular,
  Dismiss24Regular,
  ChevronRight16Regular,
  ArrowDownload24Regular,
  ArrowUpload24Regular,
  Print24Regular,
  Delete24Regular,
  Settings24Regular,
  TableSimple24Regular,
  PanelLeftContract24Regular,
  Lightbulb20Regular,
} from '@fluentui/react-icons'
import { WorkbenchProvider, useWorkbenchContext } from './context/WorkbenchContext'
import { AppProvider, useAppContext } from './context/AppContext'
import Home from './components/Home'
import Phase1Prepare from './components/Phase1Prepare'
import Phase2ApplicationContinuity from './components/Phase2ApplicationContinuity'
import Phase3BusinessContinuity from './components/Phase3BusinessContinuity'
import Personas from './components/Personas'
import Glossary from './components/Glossary'
import References from './components/References'
import Settings from './components/Settings'
import AppSelector from './components/AppSelector'
import GuidedTour from './components/GuidedTour'
import { exportAllPhasesToCsv } from './utils/exportAllCsv'
import { generateBcpPdf } from './utils/generateBcpPdf'
import { generateBcpDocx } from './utils/generateBcpDocx'
import { isInScope, relevanceLabel, navRelevance } from './utils/planFocus'
import type { PlanFocus } from './utils/planFocus'
import { useWorkbenchData } from './hooks/useWorkbenchData'

/* ═══════════════════════════════════════════════════════
   Design constants
   ═══════════════════════════════════════════════════════ */

const SIDEBAR_W = 240
const SIDEBAR_COLLAPSED_W = 68
const MOBILE_BP = '768px'
const TRANSITION = '0.25s cubic-bezier(0.4, 0, 0.2, 1)'

/* ═══════════════════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════════════════ */

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f8f9fa',
  },

  /* ── Mobile overlay ── */
  overlay: {
    display: 'none',
    [`@media (max-width: ${MOBILE_BP})`]: {
      display: 'block',
      position: 'fixed',
      inset: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 99,
    },
  },

  /* ── Sidebar ── */
  sidebar: {
    width: `${SIDEBAR_W}px`,
    minWidth: `${SIDEBAR_W}px`,
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 24px rgba(102, 126, 234, 0.15)',
    zIndex: 100,
    transitionProperty: 'width, min-width',
    transitionDuration: TRANSITION,
    overflowX: 'hidden',
    [`@media (max-width: ${MOBILE_BP})`]: {
      position: 'fixed',
      top: '0',
      left: '0',
      bottom: '0',
      transform: 'translateX(-100%)',
      transitionProperty: 'transform',
      transitionDuration: '0.3s',
      transitionTimingFunction: 'ease',
    },
  },
  sidebarCollapsed: {
    width: `${SIDEBAR_COLLAPSED_W}px`,
    minWidth: `${SIDEBAR_COLLAPSED_W}px`,
  },
  sidebarMobileOpen: {
    [`@media (max-width: ${MOBILE_BP})`]: {
      transform: 'translateX(0)',
    },
  },

  /* ── Sidebar header ── */
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('20px', '12px', '16px', '12px'),
    minHeight: '64px',
    overflow: 'hidden',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  logoIcon: {
    width: '28px',
    height: '28px',
    flexShrink: 0,
  },
  logoTextWrap: {
    overflow: 'hidden',
    transitionProperty: 'opacity, max-width',
    transitionDuration: TRANSITION,
    maxWidth: '160px',
  },
  logoTextHidden: {
    opacity: 0,
    maxWidth: '0px',
    overflow: 'hidden',
  },
  logoTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: '1.2',
  },
  logoSub: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
  },
  collapseBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    ...shorthands.borderRadius('8px'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    ...shorthands.border('none'),
    cursor: 'pointer',
    flexShrink: 0,
    ':hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
    [`@media (max-width: ${MOBILE_BP})`]: { display: 'none' },
  },
  closeMobile: {
    display: 'none',
    [`@media (max-width: ${MOBILE_BP})`]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      ...shorthands.borderRadius('8px'),
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      color: '#ffffff',
      ...shorthands.border('none'),
      cursor: 'pointer',
      ':hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
    },
  },

  /* ── Nav section label ── */
  navSection: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.45)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    ...shorthands.padding('16px', '16px', '6px', '16px'),
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    transitionProperty: 'opacity',
    transitionDuration: TRANSITION,
  },
  navSectionHidden: {
    opacity: 0,
  },

  /* ── Nav items ── */
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    ...shorthands.padding('0', '8px'),
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    ...shorthands.padding('10px', '12px'),
    ...shorthands.borderRadius('10px'),
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: '0.15s',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    fontWeight: '500',
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    width: '100%',
    textAlign: 'left' as const,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
    },
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    color: '#ffffff',
    fontWeight: '600',
  },
  navIcon: {
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  navLabel: {
    overflow: 'hidden',
    transitionProperty: 'opacity, max-width',
    transitionDuration: TRANSITION,
    maxWidth: '180px',
  },
  navLabelHidden: {
    opacity: 0,
    maxWidth: '0px',
    overflow: 'hidden',
  },

  /* ── Footer ── */
  sidebarFooter: {
    ...shorthands.padding('12px', '16px'),
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    transitionProperty: 'opacity',
    transitionDuration: TRANSITION,
  },
  footerHidden: { opacity: 0 },
  versionText: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center' as const,
  },

  /* ── Main wrapper ── */
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: '0',
    transitionProperty: 'margin-left',
    transitionDuration: TRANSITION,
  },

  /* ── Top bar ── */
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    ...shorthands.padding('12px', '32px'),
    backgroundColor: '#ffffff',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    [`@media (max-width: ${MOBILE_BP})`]: {
      ...shorthands.padding('12px', '16px'),
    },
  },
  hamburger: {
    display: 'none',
    [`@media (max-width: ${MOBILE_BP})`]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      ...shorthands.borderRadius('8px'),
      backgroundColor: 'transparent',
      color: tokens.colorNeutralForeground1,
      ...shorthands.border('1px', 'solid', '#e2e8f0'),
      cursor: 'pointer',
      ':hover': { backgroundColor: '#f1f5f9' },
    },
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#718096',
    flex: 1,
  },
  breadcrumbSep: {
    display: 'flex',
    alignItems: 'center',
    color: '#a0aec0',
  },
  breadcrumbCurrent: {
    color: '#1a202c',
    fontWeight: '600',
    fontSize: '15px',
  },
  toolbarActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  mainContent: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#f8f9fa',
  },
  contentWrapper: {
    ...shorthands.padding('32px', '32px'),
    maxWidth: '1400px',
    ...shorthands.margin('0', 'auto'),
    [`@media (max-width: ${MOBILE_BP})`]: {
      ...shorthands.padding('20px', '16px'),
    },
  },
  hiddenInput: {
    display: 'none',
  },
})

/* ═══════════════════════════════════════════════════════
   App types
   ═══════════════════════════════════════════════════════ */

type TabValue = 'home' | 'phase1' | 'phase2' | 'phase3' | 'personas' | 'glossary' | 'references' | 'settings'

const PAGE_LABELS: Record<TabValue, string> = {
  home: 'Home',
  phase1: 'Phase 1: Prepare',
  phase2: 'Phase 2: Application Continuity',
  phase3: 'Phase 3: Business Continuity',
  personas: 'Personas',
  glossary: 'Glossary',
  references: 'References',
  settings: 'Settings',
}

/* Nav items with section grouping */
const NAV_SECTIONS: { label: string; items: { value: TabValue; icon: React.ReactNode; label: string }[] }[] = [
  {
    label: 'Menu',
    items: [
      { value: 'home',     icon: <Home24Regular />,                   label: 'Dashboard' },
      { value: 'phase1',   icon: <BookOpen24Regular />,               label: 'Phase 1: Prepare' },
      { value: 'phase2',   icon: <ClipboardTaskListLtr24Regular />,   label: 'Phase 2: App Continuity' },
      { value: 'phase3',   icon: <Shield24Regular />,                 label: 'Phase 3: Business' },
      { value: 'personas', icon: <People24Regular />,                 label: 'Personas' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { value: 'glossary',   icon: <BookDatabase24Regular />,   label: 'Glossary' },
      { value: 'references', icon: <LinkMultiple24Regular />,   label: 'References' },
    ],
  },
  {
    label: 'General',
    items: [
      { value: 'settings', icon: <Settings24Regular />, label: 'Settings' },
    ],
  },
]

/* ═══════════════════════════════════════════════════════
   Lightning bolt logo component
   ═══════════════════════════════════════════════════════ */

function BoltLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#ffffff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"/>
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   App Content
   ═══════════════════════════════════════════════════════ */

function AppContent() {
  const styles = useStyles()
  const [selectedTab, setSelectedTab] = useState<TabValue>('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [tourRun, setTourRun] = useState(() => localStorage.getItem('abcg_tour-seen') !== '1')
  const mainContentRef = useRef<HTMLElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { exportJSON, importJSON, clearAll, hasData } = useWorkbenchContext()
  const { currentApp } = useAppContext()
  const [settings] = useWorkbenchData<{ planFocus?: PlanFocus }>('settings', { planFocus: 'bcdr' })

  useEffect(() => {
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedTab])

  const handleNav = useCallback((tab: TabValue) => {
    setSelectedTab(tab)
    setMobileOpen(false)
  }, [])

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try { await importJSON(file) } catch (err) { console.error('Import failed:', err) }
    e.target.value = ''
  }, [importJSON])

  const handleClear = useCallback(() => {
    clearAll()
    setClearDialogOpen(false)
  }, [clearAll])

  const collapsed = sidebarCollapsed
  const hideText = collapsed ? styles.navLabelHidden : ''

  const renderContent = () => {
    switch (selectedTab) {
      case 'home': return <Home onNavigate={setSelectedTab} />
      case 'phase1': return <Phase1Prepare />
      case 'phase2': return <Phase2ApplicationContinuity />
      case 'phase3': return <Phase3BusinessContinuity />
      case 'personas': return <Personas />
      case 'glossary': return <Glossary />
      case 'references': return <References />
      case 'settings': return <Settings />
      default: return <Home onNavigate={setSelectedTab} />
    }
  }

  return (
    <div className={styles.root}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} aria-hidden />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''} ${mobileOpen ? styles.sidebarMobileOpen : ''}`}
        data-no-print
        data-tour="sidebar"
      >
        {/* Header */}
        <div className={styles.sidebarHeader}>
          {collapsed ? (
            /* Collapsed: just the bolt icon, click to expand */
            <button
              className={styles.collapseBtn}
              onClick={() => setSidebarCollapsed(false)}
              aria-label="Expand sidebar"
              style={{ margin: '0 auto' }}
            >
              <BoltLogo className={styles.logoIcon} />
            </button>
          ) : (
            /* Expanded: logo + text + collapse button */
            <>
              <div className={styles.logo}>
                <BoltLogo className={styles.logoIcon} />
                <div className={styles.logoTextWrap}>
                  <div className={styles.logoTitle}>Boltplan</div>
                  <div className={styles.logoSub}>Business Continuity Guide</div>
                </div>
              </div>
              <button
                className={styles.collapseBtn}
                onClick={() => setSidebarCollapsed(true)}
                aria-label="Collapse sidebar"
              >
                <PanelLeftContract24Regular />
              </button>
            </>
          )}
          <button
            className={styles.closeMobile}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <Dismiss24Regular />
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div className={`${styles.navSection} ${collapsed ? styles.navSectionHidden : ''}`}>
                {section.label}
              </div>
              {section.items.map((item) => {
                const inScope = isInScope(navRelevance[item.value] || 'bcdr', settings.planFocus || 'bcdr')
                const btn = (
                  <button
                    key={item.value}
                    className={`${styles.navItem} ${selectedTab === item.value ? styles.navItemActive : ''}`}
                    onClick={() => handleNav(item.value)}
                    data-tour={item.value}
                    style={{ opacity: inScope ? 1 : 0.45 }}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={`${styles.navLabel} ${hideText}`}>
                      {item.label}
                      {(settings.planFocus || 'bcdr') !== 'bcdr' && (
                        <Badge
                          size="small"
                          appearance="outline"
                          color={inScope ? 'brand' : 'informative'}
                          style={{ marginLeft: '8px', fontSize: '10px' }}
                        >
                          {relevanceLabel(navRelevance[item.value] || 'bcdr')}
                        </Badge>
                      )}
                    </span>
                  </button>
                )
                return collapsed ? (
                  <Tooltip key={item.value} content={item.label} relationship="label" positioning="after">
                    {btn}
                  </Tooltip>
                ) : btn
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={`${styles.sidebarFooter} ${collapsed ? styles.footerHidden : ''}`}>
          <div className={styles.versionText}>BoltPlan v1.0</div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={styles.main}>
        {/* Top bar with breadcrumb + actions */}
        <header className={styles.topBar} data-no-print>
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Navigation24Regular />
          </button>
          <div className={styles.breadcrumb}>
            <span>BoltPlan</span>
            <span className={styles.breadcrumbSep}><ChevronRight16Regular /></span>
            <span className={styles.breadcrumbCurrent}>{PAGE_LABELS[selectedTab]}</span>
          </div>
          <div className={styles.toolbarActions} data-tour="toolbar">
            <Button appearance="subtle" size="small" icon={<Lightbulb20Regular />} onClick={() => setTourRun(true)}>Tour</Button>
            <Button appearance="subtle" size="small" icon={<TableSimple24Regular />} onClick={exportAllPhasesToCsv}>CSV</Button>
            <Button appearance="subtle" size="small" icon={<Print24Regular />} onClick={generateBcpPdf}>PDF</Button>
            <Button appearance="subtle" size="small" icon={<ArrowDownload24Regular />} onClick={generateBcpDocx}>DOCX</Button>
            <Button appearance="subtle" size="small" icon={<ArrowDownload24Regular />} onClick={exportJSON} disabled={!hasData}>JSON</Button>
            <Button appearance="subtle" size="small" icon={<ArrowUpload24Regular />} onClick={() => fileInputRef.current?.click()}>Import</Button>
            <input ref={fileInputRef} type="file" accept=".json" className={styles.hiddenInput} onChange={handleImport} />
            <Dialog open={clearDialogOpen} onOpenChange={(_, d) => setClearDialogOpen(d.open)}>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="subtle" size="small" icon={<Delete24Regular />} disabled={!hasData}>Clear</Button>
              </DialogTrigger>
              <DialogSurface>
                <DialogBody>
                  <DialogTitle>Clear All Workbench Data?</DialogTitle>
                  <DialogContent>
                    This will permanently remove all saved workbench data from your browser. This action cannot be undone.
                  </DialogContent>
                  <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                      <Button appearance="secondary">Cancel</Button>
                    </DialogTrigger>
                    <Button appearance="primary" onClick={handleClear}>Clear All</Button>
                  </DialogActions>
                </DialogBody>
              </DialogSurface>
            </Dialog>
          </div>
        </header>

        {/* Content */}
        <main ref={mainContentRef} className={styles.mainContent}>
          <div className={styles.contentWrapper} key={currentApp.id}>
            {selectedTab !== 'home' && <div data-tour="app-selector"><AppSelector /></div>}
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Guided tour overlay */}
      <GuidedTour run={tourRun} onFinish={() => setTourRun(false)} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   App root
   ═══════════════════════════════════════════════════════ */

export default function App() {
  return (
    <AppProvider>
      <WorkbenchProvider>
        <AppContent />
      </WorkbenchProvider>
    </AppProvider>
  )
}
