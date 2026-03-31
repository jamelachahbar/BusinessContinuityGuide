import { useState, useEffect, useRef, useCallback } from 'react'
import {
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components'
import {
  Home24Regular,
  BookOpen24Regular,
  ClipboardTaskListLtr24Regular,
  Shield24Regular,
  People24Regular,
  BookDatabase24Regular,
  Navigation24Regular,
  Dismiss24Regular,
  ChevronRight16Regular,
} from '@fluentui/react-icons'
import Home from './components/Home'
import Phase1Prepare from './components/Phase1Prepare'
import Phase2ApplicationContinuity from './components/Phase2ApplicationContinuity'
import Phase3BusinessContinuity from './components/Phase3BusinessContinuity'
import Personas from './components/Personas'
import Glossary from './components/Glossary'

const MOBILE_BREAKPOINT = '768px'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f8f9fa',
  },
  /* --- Sidebar overlay (mobile only) --- */
  overlay: {
    display: 'none',
    [`@media (max-width: ${MOBILE_BREAKPOINT})`]: {
      display: 'block',
      position: 'fixed',
      inset: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 99,
    },
  },
  overlayHidden: {
    display: 'none',
  },
  /* --- Sidebar --- */
  sidebar: {
    width: '280px',
    minWidth: '280px',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    ...shorthands.padding('32px', '24px'),
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 24px rgba(102, 126, 234, 0.15)',
    zIndex: 100,
    [`@media (max-width: ${MOBILE_BREAKPOINT})`]: {
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
  sidebarOpen: {
    [`@media (max-width: ${MOBILE_BREAKPOINT})`]: {
      transform: 'translateX(0)',
    },
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '48px',
  },
  logo: {},
  logoTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '4px',
  },
  logoSubtitle: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  closeSidebar: {
    display: 'none',
    [`@media (max-width: ${MOBILE_BREAKPOINT})`]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      ...shorthands.borderRadius('8px'),
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      color: '#ffffff',
      ...shorthands.border('none'),
      cursor: 'pointer',
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
      },
    },
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    ...shorthands.padding('14px', '16px'),
    ...shorthands.borderRadius('12px'),
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: '15px',
    fontWeight: '500',
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    width: '100%',
    textAlign: 'left' as const,
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    },
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderLeftColor: '#ffffff',
    fontWeight: '600',
    ':hover': {
      borderLeftColor: '#ffffff',
    },
  },
  navIcon: {
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  sidebarFooter: {
    ...shorthands.padding('16px', '0', '0', '0'),
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: '16px',
  },
  versionText: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center' as const,
  },
  /* --- Main content area --- */
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: '0',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    ...shorthands.padding('16px', '48px'),
    backgroundColor: '#ffffff',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    [`@media (max-width: ${MOBILE_BREAKPOINT})`]: {
      ...shorthands.padding('12px', '16px'),
    },
  },
  hamburger: {
    display: 'none',
    [`@media (max-width: ${MOBILE_BREAKPOINT})`]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      ...shorthands.borderRadius('10px'),
      backgroundColor: 'transparent',
      color: tokens.colorNeutralForeground1,
      ...shorthands.border('1px', 'solid', '#e2e8f0'),
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#f1f5f9',
      },
    },
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#718096',
  },
  breadcrumbSeparator: {
    display: 'flex',
    alignItems: 'center',
    color: '#a0aec0',
  },
  breadcrumbCurrent: {
    color: '#1a202c',
    fontWeight: '600',
    fontSize: '16px',
  },
  mainContent: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#f8f9fa',
  },
  contentWrapper: {
    ...shorthands.padding('40px', '48px'),
    maxWidth: '1400px',
    ...shorthands.margin('0', 'auto'),
    [`@media (max-width: ${MOBILE_BREAKPOINT})`]: {
      ...shorthands.padding('24px', '16px'),
    },
  },
})

type TabValue = 'home' | 'phase1' | 'phase2' | 'phase3' | 'personas' | 'glossary'

const PAGE_LABELS: Record<TabValue, string> = {
  home: 'Home',
  phase1: 'Phase 1: Prepare',
  phase2: 'Phase 2: Application Continuity',
  phase3: 'Phase 3: Business Continuity',
  personas: 'Personas',
  glossary: 'Glossary',
}

function App() {
  const styles = useStyles()
  const [selectedTab, setSelectedTab] = useState<TabValue>('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const mainContentRef = useRef<HTMLElement>(null)

  // Scroll to top on page change
  useEffect(() => {
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedTab])

  const handleNav = useCallback((tab: TabValue) => {
    setSelectedTab(tab)
    setSidebarOpen(false)
  }, [])

  const renderContent = () => {
    switch (selectedTab) {
      case 'home':
        return <Home onNavigate={setSelectedTab} />
      case 'phase1':
        return <Phase1Prepare />
      case 'phase2':
        return <Phase2ApplicationContinuity />
      case 'phase3':
        return <Phase3BusinessContinuity />
      case 'personas':
        return <Personas />
      case 'glossary':
        return <Glossary />
      default:
        return <Home onNavigate={setSelectedTab} />
    }
  }

  const navItems = [
    { value: 'home' as TabValue, icon: <Home24Regular />, label: 'Home' },
    { value: 'phase1' as TabValue, icon: <BookOpen24Regular />, label: 'Phase 1: Prepare' },
    { value: 'phase2' as TabValue, icon: <ClipboardTaskListLtr24Regular />, label: 'Phase 2: App Continuity' },
    { value: 'phase3' as TabValue, icon: <Shield24Regular />, label: 'Phase 3: Business Continuity' },
    { value: 'personas' as TabValue, icon: <People24Regular />, label: 'Personas' },
    { value: 'glossary' as TabValue, icon: <BookDatabase24Regular />, label: 'Glossary' },
  ]

  return (
    <div className={styles.container}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoTitle}>ABC Guide</div>
            <div className={styles.logoSubtitle}>Business Continuity</div>
          </div>
          <button
            className={styles.closeSidebar}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <Dismiss24Regular />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.value}
              className={`${styles.navItem} ${selectedTab === item.value ? styles.navItemActive : ''}`}
              onClick={() => handleNav(item.value)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.versionText}>ABC Guide v0.55</div>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.mainWrapper}>
        <header className={styles.topBar}>
          <button
            className={styles.hamburger}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Navigation24Regular />
          </button>
          <div className={styles.breadcrumb}>
            <span>ABC Guide</span>
            <span className={styles.breadcrumbSeparator}><ChevronRight16Regular /></span>
            <span className={styles.breadcrumbCurrent}>{PAGE_LABELS[selectedTab]}</span>
          </div>
        </header>

        <main ref={mainContentRef} className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
