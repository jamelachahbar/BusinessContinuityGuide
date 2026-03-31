import {
  makeStyles,
  tokens,
  Card,
  Badge,
} from '@fluentui/react-components'

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
    marginBottom: '32px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
  },
  content: {
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
  },
  list: {
    marginLeft: '24px',
    marginTop: '12px',
  },
  card: {
    marginBottom: '16px',
    padding: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: tokens.colorBrandForeground1,
  },
  highlight: {
    backgroundColor: tokens.colorBrandBackground2,
    padding: '20px',
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: '24px',
    borderLeft: `4px solid ${tokens.colorBrandBackground}`,
  },
  riskMatrix: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginTop: '16px',
  },
  riskItem: {
    padding: '16px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground3,
  },
})

function Phase3BusinessContinuity() {
  const styles = useStyles()

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Phase 3: Business Continuity</h1>
      <p className={styles.description}>
        Coordinate individual application continuity plans into a comprehensive
        business continuity strategy. Focus on MBCO planning, risk assessment,
        and ongoing management of your entire application portfolio.
      </p>

      <div className={styles.highlight}>
        <h3>Key Objective</h3>
        <p>
          Combine and coordinate application continuity plans for all critical
          applications. Define recovery priorities, manage risks, and establish
          comprehensive business continuity governance.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Business Continuity Plan</h2>
        <Card className={styles.card}>
          <div className={styles.cardTitle}>BCP Document</div>
          <div className={styles.content}>
            A comprehensive document outlining how the business will continue
            operations during unplanned disruptions. The BCP should address:
            <ul className={styles.list}>
              <li>Executive summary and plan scope</li>
              <li>Roles and responsibilities</li>
              <li>Emergency response procedures</li>
              <li>Recovery strategies and priorities</li>
              <li>Communication plans</li>
              <li>Training and awareness programs</li>
              <li>Plan maintenance and testing schedules</li>
            </ul>
            Consider industry-standard and jurisdiction-specific BCP templates when
            developing your organization's plan.
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Business Risk Assessment</h2>
        <Card className={styles.card}>
          <div className={styles.cardTitle}>Risk Identification and Analysis</div>
          <div className={styles.content}>
            Define risks most likely to impact your business. Risk is based on
            hazard assessment and organizational exposure.
            <p style={{ marginTop: '12px', fontWeight: '600' }}>
              Risk = Impact × Probability
            </p>
          </div>
        </Card>

        <div className={styles.riskMatrix}>
          <div className={styles.riskItem}>
            <Badge appearance="filled" color="danger">High Risk</Badge>
            <h4>High Probability + High Impact</h4>
            <p>Example: Data breach, cyber attacks</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Requires immediate attention and robust mitigation strategies
            </p>
          </div>
          <div className={styles.riskItem}>
            <Badge appearance="filled" color="warning">Medium-High Risk</Badge>
            <h4>High Probability + Low Impact</h4>
            <p>Example: Minor service disruptions</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Monitor and implement cost-effective controls
            </p>
          </div>
          <div className={styles.riskItem}>
            <Badge appearance="filled" color="warning">Medium-Low Risk</Badge>
            <h4>Low Probability + High Impact</h4>
            <p>Example: Major natural disasters</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Prepare contingency plans despite low likelihood
            </p>
          </div>
          <div className={styles.riskItem}>
            <Badge appearance="filled" color="success">Low Risk</Badge>
            <h4>Low Probability + Low Impact</h4>
            <p>Example: Minimal service glitches</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Monitor but may not require significant investment
            </p>
          </div>
        </div>

        <Card className={styles.card} style={{ marginTop: '16px' }}>
          <div className={styles.cardTitle}>Common Risk Categories</div>
          <div className={styles.content}>
            <ul className={styles.list}>
              <li><strong>Natural Disasters:</strong> Earthquakes, floods, hurricanes</li>
              <li><strong>Cyber Threats:</strong> Ransomware, DDoS attacks, data breaches</li>
              <li><strong>Infrastructure Failures:</strong> Power outages, network failures</li>
              <li><strong>Human Errors:</strong> Accidental deletions, misconfigurations</li>
              <li><strong>Supply Chain Disruptions:</strong> Vendor outages, dependencies</li>
            </ul>
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Minimum Business Continuity Objective (MBCO)</h2>
        <Card className={styles.card}>
          <div className={styles.cardTitle}>MBCO Planning</div>
          <div className={styles.content}>
            The MBCO represents the minimum number of applications and business
            functions that must be available before Maximum Tolerable Downtime
            (MTD) is reached to achieve business objectives during a disruption.
            <ul className={styles.list}>
              <li>Identify critical application portfolio</li>
              <li>Define recovery order and dependencies</li>
              <li>Assign recovery teams and responsibilities</li>
              <li>Establish recovery time windows</li>
              <li>Document inter-application dependencies</li>
            </ul>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Application Recovery Order</div>
          <div className={styles.content}>
            Define the sequence for recovering applications based on:
            <ul className={styles.list}>
              <li>Business criticality and impact</li>
              <li>Technical dependencies between applications</li>
              <li>Available recovery team resources</li>
              <li>Recovery time objectives (RTO)</li>
            </ul>
            Applications with the same recovery order can be recovered
            simultaneously if resources permit.
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Operational Management</h2>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Business Critical Function Calendar</div>
          <div className={styles.content}>
            Track critical business events and activities that must continue during
            disruptions:
            <ul className={styles.list}>
              <li>Critical business periods (e.g., end of quarter, tax season)</li>
              <li>Planned Azure maintenance windows</li>
              <li>BCDR testing blackout dates</li>
              <li>Major product launches or events</li>
            </ul>
            Coordinate testing schedules to avoid disruption during critical periods.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Business Impact Analysis | Portfolio Summary</div>
          <div className={styles.content}>
            Consolidated view of BIA data across all applications in the portfolio.
            Provides executive visibility into overall business continuity posture.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>BCDR Dashboard</div>
          <div className={styles.content}>
            Centralized dashboard capturing:
            <ul className={styles.list}>
              <li>Application architecture and status</li>
              <li>Requirements and compliance metrics</li>
              <li>Test schedules and results</li>
              <li>Current and historical reliability metrics</li>
              <li>Recovery capability assessments</li>
            </ul>
            Use automation to pull data from multiple sources for real-time visibility.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Maintain Business Continuity</div>
          <div className={styles.content}>
            Establish a maintenance plan for business continuity documentation:
            <ul className={styles.list}>
              <li>Regular review schedule for all BCP documents</li>
              <li>Update triggers (organizational changes, new threats)</li>
              <li>Document ownership and approval workflow</li>
              <li>Training and awareness program updates</li>
              <li>Continuous improvement process</li>
            </ul>
            Business continuity is not a one-time effort—it requires ongoing
            attention and refinement.
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Phase3BusinessContinuity
