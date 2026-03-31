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
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
  phaseFlow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  flowItem: {
    flex: '1',
    minWidth: '200px',
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    textAlign: 'center',
  },
})

function Phase2ApplicationContinuity() {
  const styles = useStyles()

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Phase 2: Application Continuity</h1>
      <p className={styles.description}>
        Iterative activities for creating continuity plans for individual
        applications. This phase includes assessment, implementation, and testing
        for each application requiring business continuity planning.
      </p>

      <div className={styles.phaseFlow}>
        <div className={styles.flowItem}>
          <Badge appearance="filled" color="brand">1</Badge>
          <h3>Assess</h3>
          <p>Gather requirements and analyze current state</p>
        </div>
        <div className={styles.flowItem}>
          <Badge appearance="filled" color="brand">2</Badge>
          <h3>Implement</h3>
          <p>Design and deploy BCDR solutions</p>
        </div>
        <div className={styles.flowItem}>
          <Badge appearance="filled" color="brand">3</Badge>
          <h3>Test</h3>
          <p>Validate and maintain continuity plans</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Badge appearance="filled" color="informative">Assess</Badge>
          Assessment Activities
        </h2>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Requirements and Architecture Decision Record</div>
          <div className={styles.content}>
            Document BCDR requirements for each application using stakeholder
            workshops. Record architectural decisions and rationale for:
            <ul className={styles.list}>
              <li>Availability and performance targets</li>
              <li>Recovery objectives (RTO/RPO)</li>
              <li>Compliance and security requirements</li>
              <li>Architecture patterns and design choices</li>
            </ul>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Service Map</div>
          <div className={styles.content}>
            Visualize application dependencies and infrastructure components.
            Include:
            <ul className={styles.list}>
              <li>Application components and services</li>
              <li>Data stores and external dependencies</li>
              <li>Network topology and traffic flows</li>
              <li>Integration points and APIs</li>
            </ul>
            Use tools like Application Insights and VM Insights to discover
            dependencies automatically.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Business Impact Analysis</div>
          <div className={styles.content}>
            Determine application criticality and define key metrics:
            <ul className={styles.list}>
              <li>Composite Service Level Objective</li>
              <li>Recovery Time Objective (RTO)</li>
              <li>Recovery Point Objective (RPO)</li>
              <li>Maximum Tolerable Downtime (MTD)</li>
              <li>Throughput and response objectives</li>
              <li>Financial impact of downtime</li>
            </ul>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Fault Tree Analysis (-BCDR)</div>
          <div className={styles.content}>
            Top-down analysis to identify potential failure modes and their causes.
            Map out contributing factors to understand reliability before BCDR
            improvements.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Architecture | Continuity Gap Assessment</div>
          <div className={styles.content}>
            Document current availability and recovery configuration by component.
            Identify gaps between current state and requirements, including cost
            analysis.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Metric Analysis</div>
          <div className={styles.content}>
            Calculate composite reliability scores across metrics for the
            application and its components before BCDR implementation.
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Badge appearance="filled" color="success">Implement</Badge>
          Implementation Activities
        </h2>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Response Plan by Scope</div>
          <div className={styles.content}>
            Define disaster event types, impact scope, and planned responses:
            <ul className={styles.list}>
              <li><strong>Global:</strong> Worldwide service outage</li>
              <li><strong>Geography:</strong> Multi-region failure</li>
              <li><strong>Region:</strong> Single region outage</li>
              <li><strong>Zone:</strong> Availability zone failure</li>
              <li><strong>Service Impact:</strong> Specific Azure service degradation</li>
              <li><strong>Data Integrity:</strong> Corruption or loss events</li>
            </ul>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Architecture | Continuity Design (+BCDR)</div>
          <div className={styles.content}>
            Updated architecture with BCDR improvements highlighted. Document
            remediation activities and validate that gaps are addressed.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Cost Comparison (-BCDR vs. +BCDR)</div>
          <div className={styles.content}>
            Calculate and compare application costs before and after BCDR
            components. Show ROI and cost justification for improvements.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Metric Comparison (+BCDR)</div>
          <div className={styles.content}>
            Recalculate reliability scores showing improvements from BCDR
            implementation. Demonstrate value of investments.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Fault Tree Analysis (+BCDR)</div>
          <div className={styles.content}>
            Updated fault tree showing reduced failure probability after BCDR
            remediation. Essential input for business case justification.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Contingency Plan</div>
          <div className={styles.content}>
            Define how operations continue if the system cannot be restored.
            Include manual workarounds and alternative processes.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Role Assignment</div>
          <div className={styles.content}>
            Assign specific individuals to BCDR roles defined in the RACI matrix.
            Include contact details, time zones, and escalation paths.
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Badge appearance="filled" color="warning">Test</Badge>
          Testing Activities
        </h2>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Test Summary</div>
          <div className={styles.content}>
            Track all testing activities and results over time. Include test
            types, schedules, outcomes, and continuous improvement actions.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Continuity Drill (Failover Test)</div>
          <div className={styles.content}>
            Document failover and failback procedures with detailed task lists.
            Identify critical business functions and their failover sequences.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Test Plan (UAT)</div>
          <div className={styles.content}>
            User Acceptance Testing procedures to validate that recovered systems
            meet business requirements and function correctly.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Outage Communication Plan</div>
          <div className={styles.content}>
            Track communication during outages organized by event scope. Define
            stakeholder notifications, status updates, and post-mortem processes.
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Maintain Application Continuity</div>
          <div className={styles.content}>
            Maintenance schedule for continuity documentation and artifacts:
            <ul className={styles.list}>
              <li>Regular review frequency</li>
              <li>Document owners and approvers</li>
              <li>Update triggers (architecture changes, test results)</li>
              <li>Version control and change tracking</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Phase2ApplicationContinuity
