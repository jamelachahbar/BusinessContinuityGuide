import { useState } from 'react'
import {
  makeStyles,
  tokens,
  Tab,
  TabList,
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
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  header: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    padding: '20px 40px',
    boxShadow: tokens.shadow8,
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '600',
  },
  subtitle: {
    margin: '8px 0 0 0',
    fontSize: '14px',
    opacity: 0.9,
  },
  navigation: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: '16px 40px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '40px',
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Azure Business Continuity Guide</h1>
        <p className={styles.subtitle}>
          A comprehensive resource for BCDR planning and implementation
        </p>
      </header>

      <nav className={styles.navigation}>
        <TabList
          selectedValue={selectedTab}
          onTabSelect={(_, data) => setSelectedTab(data.value as TabValue)}
        >
          <Tab icon={<Home24Regular />} value="home">
            Home
          </Tab>
          <Tab icon={<BookOpen24Regular />} value="phase1">
            Phase 1: Prepare
          </Tab>
          <Tab icon={<ClipboardTaskListLtr24Regular />} value="phase2">
            Phase 2: Application Continuity
          </Tab>
          <Tab icon={<Shield24Regular />} value="phase3">
            Phase 3: Business Continuity
          </Tab>
        </TabList>
      </nav>

      <main className={styles.content}>{renderContent()}</main>
    </div>
  )
}

export default App
