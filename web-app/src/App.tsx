import { useState } from 'react'
import {
  makeStyles,
} from '@fluentui/react-components'
import {
  Home24Regular,
  BookOpen24Regular,
  ClipboardTaskListLtr24Regular,
  Shield24Regular,
} from '@fluentui/react-icons'
import Home from './components/Home'
import Phase1Prepare from './components/Phase1Prepare'
import Phase2ApplicationContinuity from './components/Phase2ApplicationContinuity'
import Phase3BusinessContinuity from './components/Phase3BusinessContinuity'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f8f9fa',
  },
  sidebar: {
    width: '280px',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 24px rgba(102, 126, 234, 0.15)',
  },
  logo: {
    marginBottom: '48px',
  },
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
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '15px',
    fontWeight: '500',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    textAlign: 'left',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
    },
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  navIcon: {
    fontSize: '20px',
  },
  mainContent: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#f8f9fa',
  },
  contentWrapper: {
    padding: '40px 48px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
})

type TabValue = 'home' | 'phase1' | 'phase2' | 'phase3'

function App() {
  const styles = useStyles()
  const [selectedTab, setSelectedTab] = useState<TabValue>('home')

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
      default:
        return <Home onNavigate={setSelectedTab} />
    }
  }

  const navItems = [
    { value: 'home' as TabValue, icon: <Home24Regular />, label: 'Home' },
    { value: 'phase1' as TabValue, icon: <BookOpen24Regular />, label: 'Phase 1: Prepare' },
    { value: 'phase2' as TabValue, icon: <ClipboardTaskListLtr24Regular />, label: 'Phase 2: Application Continuity' },
    { value: 'phase3' as TabValue, icon: <Shield24Regular />, label: 'Phase 3: Business Continuity' },
  ]

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoTitle}>ABC Guide</div>
          <div className={styles.logoSubtitle}>Business Continuity</div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.value}
              className={`${styles.navItem} ${selectedTab === item.value ? styles.navItemActive : ''}`}
              onClick={() => setSelectedTab(item.value)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App
