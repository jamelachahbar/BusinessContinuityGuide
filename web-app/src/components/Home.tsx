import {
  makeStyles,
  shorthands,
  Badge,
} from '@fluentui/react-components'
import {
  BookOpen24Regular,
  ClipboardTaskListLtr24Regular,
  Shield24Regular,
  ArrowRight16Regular,
  DocumentBulletList24Regular,
  LightbulbCheckmark24Regular,
  CheckmarkStarburst24Regular,
  AppsList24Regular,
  ShieldCheckmark24Regular,
  DataTrending24Regular,
  ClipboardTask24Regular,
  Checkmark16Filled,
  Circle16Regular,
} from '@fluentui/react-icons'
import { useAppContext } from '../context/AppContext'

const useStyles = makeStyles({
  container: {
    width: '100%',
  },
  /* Welcome header */
  welcomeBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '4px',
  },
  welcomeSubtitle: {
    fontSize: '15px',
    color: '#718096',
    lineHeight: '1.5',
  },
  downloadBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#667eea',
    color: 'white',
    fontWeight: '600',
    ...shorthands.padding('10px', '24px'),
    fontSize: '14px',
    ...shorthands.borderRadius('10px'),
    ...shorthands.border('none'),
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: '0.2s',
    ':hover': {
      backgroundColor: '#5a6fd6',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.35)',
    },
  },
  /* Metric summary cards */
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '32px',
    [`@media (max-width: 900px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [`@media (max-width: 560px)`]: {
      gridTemplateColumns: '1fr',
    },
  },
  metricCard: {
    background: 'white',
    ...shorthands.borderRadius('16px'),
    ...shorthands.padding('24px'),
    ...shorthands.border('1px', 'solid', '#e2e8f0'),
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a202c',
    lineHeight: '1.2',
  },
  metricLabel: {
    fontSize: '13px',
    color: '#a0aec0',
    fontWeight: '500',
  },
  metricTag: {
    marginTop: '8px',
  },
  progressCard: {
    background: 'white',
    ...shorthands.borderRadius('16px'),
    ...shorthands.padding('24px'),
    ...shorthands.border('1px', 'solid', '#e2e8f0'),
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    marginBottom: '32px',
  },
  progressHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  progressTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
  },
  progressBar: {
    height: '8px',
    ...shorthands.borderRadius('4px'),
    backgroundColor: '#e2e8f0',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    ...shorthands.borderRadius('4px'),
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    transitionProperty: 'width',
    transitionDuration: '0.5s',
  },
  stepList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#718096',
  },
  stepDone: {
    color: '#1a202c',
  },
  stepIcon: {
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#1a202c',
  },
  /* Phase cards */
  phaseCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '40px',
    [`@media (max-width: 900px)`]: {
      gridTemplateColumns: '1fr',
    },
  },
  phaseCard: {
    background: 'white',
    ...shorthands.borderRadius('16px'),
    ...shorthands.padding('28px'),
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: '0.25s',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    ...shorthands.border('1px', 'solid', '#e2e8f0'),
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
    },
  },
  phaseHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '16px',
  },
  phaseIcon: {
    width: '44px',
    height: '44px',
    ...shorthands.borderRadius('12px'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    color: 'white',
    flexShrink: 0,
  },
  phaseIconP1: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  phaseIconP2: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  phaseIconP3: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  phaseTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
  },
  phaseDesc: {
    fontSize: '14px',
    lineHeight: '1.55',
    color: '#718096',
    marginBottom: '16px',
    minHeight: '64px',
  },
  phaseFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phaseLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#667eea',
    fontWeight: '600',
    fontSize: '14px',
    backgroundColor: 'transparent',
    ...shorthands.border('none'),
    cursor: 'pointer',
    ...shorthands.padding('0'),
  },
  /* Feature grid */
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '32px',
    [`@media (max-width: 900px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [`@media (max-width: 560px)`]: {
      gridTemplateColumns: '1fr',
    },
  },
  featureCard: {
    background: 'white',
    ...shorthands.padding('20px'),
    ...shorthands.borderRadius('14px'),
    ...shorthands.border('1px', 'solid', '#e2e8f0'),
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transitionProperty: 'all',
    transitionDuration: '0.2s',
    ':hover': {
      boxShadow: '0 6px 14px rgba(0,0,0,0.07)',
      transform: 'translateY(-2px)',
    },
  },
  featureIcon: {
    width: '40px',
    height: '40px',
    ...shorthands.borderRadius('10px'),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    fontSize: '20px',
    color: 'white',
  },
  featureTitle: {
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#1a202c',
  },
  featureDesc: {
    fontSize: '13px',
    lineHeight: '1.5',
    color: '#718096',
  },
})

interface HomeProps {
  onNavigate: (tab: 'home' | 'phase1' | 'phase2' | 'phase3' | 'settings') => void
}

function Home({ onNavigate }: HomeProps) {
  const styles = useStyles()
  const { currentApp } = useAppContext()

  // Check which sections have data in localStorage for the current app
  const prefix = `abcg_${currentApp.id}_`
  const has = (key: string) => localStorage.getItem(`${prefix}${key}`) !== null

  const progressSteps = [
    { label: 'Configure Settings (org name, workload)', done: has('settings'), phase: 'settings' as const },
    { label: 'Define Criticality Model', done: has('phase1_criticalityModel'), phase: 'phase1' as const },
    { label: 'Document Requirements & ADR', done: has('phase2-requirements'), phase: 'phase2' as const },
    { label: 'Build Service Map', done: has('phase2-fta-before-nodes'), phase: 'phase2' as const },
    { label: 'Complete Business Impact Analysis', done: has('phase2-bia-metrics'), phase: 'phase2' as const },
    { label: 'Run Gap Assessment', done: has('phase2-gap-assessment'), phase: 'phase2' as const },
    { label: 'Design BCDR Architecture', done: has('phase2-continuity-design'), phase: 'phase2' as const },
    { label: 'Compare Costs (-BCDR vs +BCDR)', done: has('phase2-cost-comparison'), phase: 'phase2' as const },
    { label: 'Assign Roles', done: has('phase2-role-assignment'), phase: 'phase2' as const },
    { label: 'Plan Tests & Drills', done: has('phase2-test-summary'), phase: 'phase2' as const },
    { label: 'Complete BCP Checklist', done: has('phase3-bcp-checklist'), phase: 'phase3' as const },
    { label: 'Assess Business Risks', done: has('phase3-risk-scenarios'), phase: 'phase3' as const },
    { label: 'Define MBCO Recovery Order', done: has('phase3-mbco'), phase: 'phase3' as const },
  ]
  const doneCount = progressSteps.filter(s => s.done).length
  const progressPct = Math.round((doneCount / progressSteps.length) * 100)

  return (
    <div className={styles.container}>
      {/* Welcome header */}
      <div className={styles.welcomeBar}>
        <div>
          <div className={styles.welcomeTitle}>Azure Business Continuity Guide</div>
          <div className={styles.welcomeSubtitle}>
            Design and execute BCDR plans for your Azure resources across structured phases.
          </div>
        </div>
        <button
          className={styles.downloadBtn}
          onClick={() => window.open('https://github.com/Azure/BusinessContinuityGuide/releases/download/v0.55/ABCG.v0.55.xlsx', '_blank')}
        >
          Download Workbook v0.55
        </button>
      </div>

      {/* Metric summary row */}
      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>BCDR Phases</div>
          <div className={styles.metricValue}>3</div>
          <div className={styles.metricTag}>
            <Badge appearance="filled" color="brand" size="small">Prepare &rarr; App &rarr; Business</Badge>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Templates &amp; Tools</div>
          <div className={styles.metricValue}>30+</div>
          <div className={styles.metricTag}>
            <Badge appearance="tint" color="informative" size="small">Interactive workbench</Badge>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Criticality Tiers</div>
          <div className={styles.metricValue}>5</div>
          <div className={styles.metricTag}>
            <Badge appearance="tint" color="danger" size="small">Mission Critical &rarr; Unsupported</Badge>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Export Formats</div>
          <div className={styles.metricValue}>3</div>
          <div className={styles.metricTag}>
            <Badge appearance="tint" color="success" size="small">CSV &middot; PDF &middot; JSON</Badge>
          </div>
        </div>
      </div>

      {/* Getting Started progress */}
      <div className={styles.progressCard}>
        <div className={styles.progressHeader}>
          <div className={styles.progressTitle}>Getting Started</div>
          <Badge appearance="filled" color={progressPct === 100 ? 'success' : 'brand'} size="small">
            {doneCount}/{progressSteps.length} complete ({progressPct}%)
          </Badge>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
        </div>
        <div className={styles.stepList}>
          {progressSteps.map((step, i) => (
            <div
              key={i}
              className={`${styles.step} ${step.done ? styles.stepDone : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => onNavigate(step.phase)}
            >
              <span className={styles.stepIcon}>
                {step.done
                  ? <Checkmark16Filled style={{ color: '#28a745' }} />
                  : <Circle16Regular style={{ color: '#e2e8f0' }} />}
              </span>
              <span style={step.done ? { textDecoration: 'line-through', opacity: 0.6 } : undefined}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase cards */}
      <h2 className={styles.sectionTitle}>Explore BCDR Phases</h2>
      <div className={styles.phaseCards}>
        <div className={styles.phaseCard} onClick={() => onNavigate('phase1')}>
          <div className={styles.phaseHeader}>
            <div className={`${styles.phaseIcon} ${styles.phaseIconP1}`}>
              <BookOpen24Regular />
            </div>
            <div className={styles.phaseTitle}>Phase 1: Prepare</div>
          </div>
          <p className={styles.phaseDesc}>
            Define criticality models, business commitments, and establish your BCDR framework with interactive templates.
          </p>
          <div className={styles.phaseFooter}>
            <Badge appearance="outline" color="brand" size="small">6 templates</Badge>
            <button className={styles.phaseLink}>
              <span>Open</span>
              <ArrowRight16Regular />
            </button>
          </div>
        </div>

        <div className={styles.phaseCard} onClick={() => onNavigate('phase2')}>
          <div className={styles.phaseHeader}>
            <div className={`${styles.phaseIcon} ${styles.phaseIconP2}`}>
              <ClipboardTaskListLtr24Regular />
            </div>
            <div className={styles.phaseTitle}>Phase 2: App Continuity</div>
          </div>
          <p className={styles.phaseDesc}>
            Assess, implement, and test continuity plans with gap analysis, cost comparison, and failover procedures.
          </p>
          <div className={styles.phaseFooter}>
            <Badge appearance="outline" color="important" size="small">18 sections</Badge>
            <button className={styles.phaseLink}>
              <span>Open</span>
              <ArrowRight16Regular />
            </button>
          </div>
        </div>

        <div className={styles.phaseCard} onClick={() => onNavigate('phase3')}>
          <div className={styles.phaseHeader}>
            <div className={`${styles.phaseIcon} ${styles.phaseIconP3}`}>
              <Shield24Regular />
            </div>
            <div className={styles.phaseTitle}>Phase 3: Business Continuity</div>
          </div>
          <p className={styles.phaseDesc}>
            Risk matrix, MBCO recovery planning, BCDR dashboard, and portfolio-wide business impact analysis.
          </p>
          <div className={styles.phaseFooter}>
            <Badge appearance="outline" color="informative" size="small">7 sections</Badge>
            <button className={styles.phaseLink}>
              <span>Open</span>
              <ArrowRight16Regular />
            </button>
          </div>
        </div>
      </div>

      {/* What's included */}
      <h2 className={styles.sectionTitle}>What's Included</h2>
      <div className={styles.featureGrid}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}><DocumentBulletList24Regular /></div>
          <div className={styles.featureTitle}>Documentation</div>
          <div className={styles.featureDesc}>
            BCDR concepts, shared responsibility, design patterns, and reliability trade-offs.
          </div>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}><AppsList24Regular /></div>
          <div className={styles.featureTitle}>Templates</div>
          <div className={styles.featureDesc}>
            Editable templates for criticality, BIA, RACI, requirements, and test plans.
          </div>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}><CheckmarkStarburst24Regular /></div>
          <div className={styles.featureTitle}>Examples</div>
          <div className={styles.featureDesc}>
            Sample assessments, risk scenarios, recovery orders, and cost comparisons.
          </div>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}><LightbulbCheckmark24Regular /></div>
          <div className={styles.featureTitle}>Best Practices</div>
          <div className={styles.featureDesc}>
            Industry-proven methodologies aligned with Azure Well-Architected Framework.
          </div>
        </div>
      </div>

      {/* Workbench overview */}
      <h2 className={styles.sectionTitle}>Workbench Capabilities</h2>
      <div className={styles.featureGrid}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}><AppsList24Regular /></div>
          <div className={styles.featureTitle}>Criticality Model</div>
          <div className={styles.featureDesc}>Classify apps by impact tier with auto-colored badges.</div>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}><DataTrending24Regular /></div>
          <div className={styles.featureTitle}>Risk Assessment</div>
          <div className={styles.featureDesc}>5x5 risk matrix with impact and probability scoring.</div>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}><ShieldCheckmark24Regular /></div>
          <div className={styles.featureTitle}>MBCO Planning</div>
          <div className={styles.featureDesc}>Recovery order with dependencies and timelines.</div>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}><ClipboardTask24Regular /></div>
          <div className={styles.featureTitle}>Test Tracking</div>
          <div className={styles.featureDesc}>Failover drills, UAT, and outage communication.</div>
        </div>
      </div>
    </div>
  )
}

export default Home
