import {
  makeStyles,
} from '@fluentui/react-components'
import {
  BookOpen24Regular,
  ClipboardTaskListLtr24Regular,
  Shield24Regular,
  ArrowRight24Regular,
  Document24Regular,
  Beaker24Regular,
  Lightbulb24Regular,
  CheckmarkCircle24Regular,
} from '@fluentui/react-icons'

const useStyles = makeStyles({
  container: {
    width: '100%',
  },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '24px',
    padding: '64px 48px',
    marginBottom: '48px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '16px',
    lineHeight: '1.2',
  },
  heroDescription: {
    fontSize: '20px',
    lineHeight: '1.6',
    maxWidth: '700px',
    opacity: 0.95,
    marginBottom: '32px',
  },
  heroButton: {
    backgroundColor: 'white',
    color: '#667eea',
    fontWeight: '600',
    padding: '12px 32px',
    fontSize: '16px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    },
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '24px',
    color: '#1a202c',
  },
  phaseCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '24px',
    marginBottom: '64px',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    ':hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
    },
  },
  cardIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    fontSize: '28px',
    color: 'white',
  },
  cardIconPhase1: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  cardIconPhase2: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  cardIconPhase3: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#1a202c',
  },
  cardDescription: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#718096',
    marginBottom: '20px',
  },
  cardButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#667eea',
    fontWeight: '600',
    fontSize: '15px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'gap 0.2s ease',
    ':hover': {
      gap: '12px',
    },
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    marginTop: '32px',
  },
  feature: {
    background: 'white',
    padding: '28px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.2s ease',
    ':hover': {
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
      transform: 'translateY(-2px)',
    },
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    fontSize: '24px',
    color: 'white',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#1a202c',
  },
  featureDescription: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#718096',
  },
})

interface HomeProps {
  onNavigate: (tab: 'home' | 'phase1' | 'phase2' | 'phase3') => void
}

function Home({ onNavigate }: HomeProps) {
  const styles = useStyles()

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Azure Business Continuity Guide
        </h1>
        <p className={styles.heroDescription}>
          A comprehensive and practical resource that helps you design and execute a BCDR plan for your Azure resources. Navigate through structured phases to build resilient business continuity strategies.
        </p>
        <button
          className={styles.heroButton}
          onClick={() => window.open('https://github.com/Azure/BusinessContinuityGuide/releases/download/v0.55/ABCG.v0.55.xlsx', '_blank')}
        >
          Download Excel Workbook v0.55
        </button>
      </div>

      <h2 className={styles.sectionTitle}>Explore BCDR Phases</h2>
      <div className={styles.phaseCards}>
        <div className={styles.card} onClick={() => onNavigate('phase1')}>
          <div className={`${styles.cardIcon} ${styles.cardIconPhase1}`}>
            <BookOpen24Regular />
          </div>
          <h3 className={styles.cardTitle}>Phase 1: Prepare</h3>
          <p className={styles.cardDescription}>
            Review fundamental concepts and create structured templates for assessing business continuity. Define criticality models, business commitments, and establish your BCDR framework.
          </p>
          <button className={styles.cardButton}>
            <span>Explore Phase 1</span>
            <ArrowRight24Regular />
          </button>
        </div>

        <div className={styles.card} onClick={() => onNavigate('phase2')}>
          <div className={`${styles.cardIcon} ${styles.cardIconPhase2}`}>
            <ClipboardTaskListLtr24Regular />
          </div>
          <h3 className={styles.cardTitle}>Phase 2: Application Continuity</h3>
          <p className={styles.cardDescription}>
            Assess, implement, and test continuity plans for individual applications. Includes business impact analysis, fault tree analysis, and testing procedures.
          </p>
          <button className={styles.cardButton}>
            <span>Explore Phase 2</span>
            <ArrowRight24Regular />
          </button>
        </div>

        <div className={styles.card} onClick={() => onNavigate('phase3')}>
          <div className={`${styles.cardIcon} ${styles.cardIconPhase3}`}>
            <Shield24Regular />
          </div>
          <h3 className={styles.cardTitle}>Phase 3: Business Continuity</h3>
          <p className={styles.cardDescription}>
            Coordinate application continuity plans into a comprehensive business continuity plan. Define MBCO, manage risks, and maintain your BCDR strategy.
          </p>
          <button className={styles.cardButton}>
            <span>Explore Phase 3</span>
            <ArrowRight24Regular />
          </button>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>What's Included</h2>
      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>
            <Document24Regular />
          </div>
          <div className={styles.featureTitle}>Documentation</div>
          <div className={styles.featureDescription}>
            Comprehensive coverage of BCDR concepts on Microsoft Azure with detailed guides and best practices.
          </div>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>
            <Beaker24Regular />
          </div>
          <div className={styles.featureTitle}>Templates</div>
          <div className={styles.featureDescription}>
            Ready-to-use templates for defining BCDR requirements consistently across your organization.
          </div>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>
            <CheckmarkCircle24Regular />
          </div>
          <div className={styles.featureTitle}>Examples</div>
          <div className={styles.featureDescription}>
            Sample assessments, plans, and checklists for implementation guidance.
          </div>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>
            <Lightbulb24Regular />
          </div>
          <div className={styles.featureTitle}>Best Practices</div>
          <div className={styles.featureDescription}>
            Industry-proven methodologies for Azure business continuity planning.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
