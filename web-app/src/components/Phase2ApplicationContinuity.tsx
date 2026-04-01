import { useState } from 'react'
import {
  makeStyles,
  shorthands,
  tokens,
  Badge,
  TabList,
  Tab,
  type SelectTabData,
  type SelectTabEvent,
} from '@fluentui/react-components'
import AssessTab from './phase2/AssessTab'
import ImplementTab from './phase2/ImplementTab'
import TestTab from './phase2/TestTab'

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '36px',
    fontWeight: '600',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
  },
  description: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  tabContent: {
    paddingTop: '24px',
  },
  phaseFlow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  flowItem: {
    flex: '1',
    minWidth: '200px',
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    textAlign: 'center',
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: '0.2s',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
  },
  flowItemActive: {
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    ...shorthands.border('2px', 'solid', tokens.colorBrandStroke1),
  },
})

export default function Phase2ApplicationContinuity() {
  const styles = useStyles()
  const [selectedTab, setSelectedTab] = useState<string>('assess')

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value as string)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Phase 2: Application Continuity</h1>
      <p className={styles.description}>
        Iterative activities for creating continuity plans for individual
        applications. This phase includes assessment, implementation, and testing.
      </p>

      {/* Visual workflow indicators */}
      <div className={styles.phaseFlow}>
        <div
          className={`${styles.flowItem} ${selectedTab === 'assess' ? styles.flowItemActive : ''}`}
          onClick={() => setSelectedTab('assess')}
        >
          <Badge appearance="filled" color="brand">1</Badge>
          <h3>Assess</h3>
          <p style={{ fontSize: '13px', color: tokens.colorNeutralForeground3 }}>Gather requirements and analyze current state</p>
        </div>
        <div
          className={`${styles.flowItem} ${selectedTab === 'implement' ? styles.flowItemActive : ''}`}
          onClick={() => setSelectedTab('implement')}
        >
          <Badge appearance="filled" color="success">2</Badge>
          <h3>Implement</h3>
          <p style={{ fontSize: '13px', color: tokens.colorNeutralForeground3 }}>Design and deploy BCDR solutions</p>
        </div>
        <div
          className={`${styles.flowItem} ${selectedTab === 'test' ? styles.flowItemActive : ''}`}
          onClick={() => setSelectedTab('test')}
        >
          <Badge appearance="filled" color="warning">3</Badge>
          <h3>Test</h3>
          <p style={{ fontSize: '13px', color: tokens.colorNeutralForeground3 }}>Validate and maintain continuity plans</p>
        </div>
      </div>

      {/* Tab navigation */}
      <TabList selectedValue={selectedTab} onTabSelect={onTabSelect}>
        <Tab value="assess">Assess (6 sections)</Tab>
        <Tab value="implement">Implement (7 sections)</Tab>
        <Tab value="test">Test (5 sections)</Tab>
      </TabList>

      {/* Tab content */}
      <div className={styles.tabContent}>
        {selectedTab === 'assess' && <AssessTab />}
        {selectedTab === 'implement' && <ImplementTab />}
        {selectedTab === 'test' && <TestTab />}
      </div>
    </div>
  )
}
