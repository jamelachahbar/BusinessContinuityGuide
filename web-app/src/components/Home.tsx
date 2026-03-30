import {
  makeStyles,
  Button,
  Card,
  tokens,
} from '@fluentui/react-components'
import {
  BookOpen24Regular,
  ClipboardTaskListLtr24Regular,
  Shield24Regular,
  ArrowRight24Regular,
} from '@fluentui/react-icons'

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  title: {
    fontSize: '42px',
    fontWeight: '600',
    margin: '0 0 16px 0',
    color: tokens.colorNeutralForeground1,
  },
  description: {
    fontSize: '18px',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    maxWidth: '800px',
    margin: '0 auto 32px',
  },
  downloadSection: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: '24px',
    borderRadius: tokens.borderRadiusLarge,
    marginBottom: '48px',
    textAlign: 'center',
  },
  phaseCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginTop: '32px',
  },
  card: {
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: tokens.shadow16,
    },
  },
  cardContent: {
    padding: '24px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  cardDescription: {
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.5',
    marginBottom: '16px',
  },
  section: {
    marginTop: '48px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '24px',
    color: tokens.colorNeutralForeground1,
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  feature: {
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    borderLeft: `4px solid ${tokens.colorBrandBackground}`,
  },
  featureTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
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
        <h1 className={styles.title}>
          Welcome to the Azure Business Continuity Guide
        </h1>
        <p className={styles.description}>
          A comprehensive and practical resource that helps you design and
          execute a BCDR plan for your Azure resources. The guide provides
          documentation, templates, and examples to help you through all phases
          of your business continuity journey.
        </p>
      </div>

      <div className={styles.downloadSection}>
        <h3>Excel Workbook Version</h3>
        <p style={{ marginBottom: '16px' }}>
          Download the latest Excel workbook for offline use
        </p>
        <Button
          appearance="primary"
          as="a"
          href="https://github.com/Azure/BusinessContinuityGuide/releases/download/v0.55/ABCG.v0.55.xlsx"
          target="_blank"
        >
          Download ABCG v0.55 (Excel)
        </Button>
      </div>

      <div className={styles.phaseCards}>
        <Card className={styles.card} onClick={() => onNavigate('phase1')}>
          <div className={styles.cardContent}>
            <div className={styles.cardTitle}>
              <BookOpen24Regular />
              Phase 1: Prepare
            </div>
            <div className={styles.cardDescription}>
              Review fundamental concepts and create structured templates for
              assessing business continuity. Define criticality models,
              business commitments, and establish your BCDR framework.
            </div>
            <Button appearance="subtle" icon={<ArrowRight24Regular />} iconPosition="after">
              Explore Phase 1
            </Button>
          </div>
        </Card>

        <Card className={styles.card} onClick={() => onNavigate('phase2')}>
          <div className={styles.cardContent}>
            <div className={styles.cardTitle}>
              <ClipboardTaskListLtr24Regular />
              Phase 2: Application Continuity
            </div>
            <div className={styles.cardDescription}>
              Assess, implement, and test continuity plans for individual
              applications. Includes business impact analysis, fault tree
              analysis, and testing procedures.
            </div>
            <Button appearance="subtle" icon={<ArrowRight24Regular />} iconPosition="after">
              Explore Phase 2
            </Button>
          </div>
        </Card>

        <Card className={styles.card} onClick={() => onNavigate('phase3')}>
          <div className={styles.cardContent}>
            <div className={styles.cardTitle}>
              <Shield24Regular />
              Phase 3: Business Continuity
            </div>
            <div className={styles.cardDescription}>
              Coordinate application continuity plans into a comprehensive
              business continuity plan. Define MBCO, manage risks, and maintain
              your BCDR strategy.
            </div>
            <Button appearance="subtle" icon={<ArrowRight24Regular />} iconPosition="after">
              Explore Phase 3
            </Button>
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>What's Included</h2>
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureTitle}>Documentation</div>
            <div>
              Comprehensive coverage of BCDR concepts on Microsoft Azure
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureTitle}>Templates</div>
            <div>
              Ready-to-use templates for defining BCDR requirements consistently
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureTitle}>Examples</div>
            <div>
              Sample assessments, plans, and checklists for implementation
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureTitle}>Best Practices</div>
            <div>
              Industry-proven methodologies for Azure business continuity
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
