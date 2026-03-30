import {
  makeStyles,
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  tokens,
  Card,
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
})

function Phase1Prepare() {
  const styles = useStyles()

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Phase 1: Prepare</h1>
      <p className={styles.description}>
        This phase covers fundamental BCDR concepts and provides structured
        templates for assessing business continuity. Build your foundation with
        criticality models, business commitment frameworks, and essential
        planning artifacts.
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Concepts</h2>
        <Accordion collapsible>
          <AccordionItem value="shared-responsibility">
            <AccordionHeader>Shared Responsibility Model</AccordionHeader>
            <AccordionPanel>
              <div className={styles.content}>
                Understanding the division of responsibilities between Microsoft
                and customers for BCDR in Azure. Microsoft manages the
                underlying infrastructure reliability, while customers are
                responsible for application-level resilience and data protection.
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="design-patterns">
            <AccordionHeader>Design Patterns</AccordionHeader>
            <AccordionPanel>
              <div className={styles.content}>
                Common architectural patterns for achieving high availability
                and disaster recovery in Azure, including:
                <ul className={styles.list}>
                  <li>Active-Active and Active-Passive configurations</li>
                  <li>Multi-region deployment strategies</li>
                  <li>Availability zones and regional pairs</li>
                  <li>Backup and restore patterns</li>
                </ul>
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="reliability-tradeoffs">
            <AccordionHeader>Reliability Trade-offs</AccordionHeader>
            <AccordionPanel>
              <div className={styles.content}>
                Balance business requirements with technical and financial
                constraints. Consider trade-offs between:
                <ul className={styles.list}>
                  <li>Cost vs. availability</li>
                  <li>Performance vs. resilience</li>
                  <li>Complexity vs. recoverability</li>
                  <li>RTO/RPO vs. implementation effort</li>
                </ul>
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Supporting Artifacts</h2>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Criticality Model</div>
          <div className={styles.content}>
            Define application criticality levels (e.g., Mission Critical, Business
            Critical, Important, Standard) based on business impact. Each level
            should specify:
            <ul className={styles.list}>
              <li>Business impact of outages</li>
              <li>Maximum tolerable downtime (MTD)</li>
              <li>Recovery time objectives (RTO)</li>
              <li>Recovery point objectives (RPO)</li>
            </ul>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Business Commitment Model</div>
          <div className={styles.content}>
            Document commitments for each criticality level across multiple
            dimensions:
            <ul className={styles.list}>
              <li><strong>General Requirements:</strong> SLA, MTD, RPO, RTO definitions</li>
              <li><strong>Availability Requirements:</strong> Redundancy, failover mechanisms</li>
              <li><strong>Recoverability Requirements:</strong> Backup retention, cross-region replication</li>
              <li><strong>Deployment Requirements:</strong> Infrastructure as Code, automation</li>
              <li><strong>Monitoring Requirements:</strong> Metrics, alerts, dashboards</li>
              <li><strong>Security Control Requirements:</strong> DDoS protection, encryption</li>
              <li><strong>Testing Requirements:</strong> Failover tests, chaos engineering</li>
            </ul>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Fault Model and Resilience Strategies</div>
          <div className={styles.content}>
            Define common failure types and pre-approved mitigation strategies for
            each application criticality tier. Document failure modes such as:
            <ul className={styles.list}>
              <li>Zone failures</li>
              <li>Region outages</li>
              <li>Service degradations</li>
              <li>Data corruption events</li>
            </ul>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>RACI Matrix</div>
          <div className={styles.content}>
            Clarify roles and responsibilities using the RACI framework:
            <ul className={styles.list}>
              <li><strong>Responsible:</strong> Those who do the work</li>
              <li><strong>Accountable:</strong> Those who are ultimately answerable</li>
              <li><strong>Consulted:</strong> Those whose input is needed</li>
              <li><strong>Informed:</strong> Those who need to be kept updated</li>
            </ul>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Application Requirements Template</div>
          <div className={styles.content}>
            Structured template for gathering BCDR requirements during stakeholder
            workshops. Categories include:
            <ul className={styles.list}>
              <li>Availability and performance requirements</li>
              <li>Recovery objectives and constraints</li>
              <li>Compliance and regulatory needs</li>
              <li>Testing and validation requirements</li>
            </ul>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.cardTitle}>Test Plans Template</div>
          <div className={styles.content}>
            Define testing strategies for each application criticality level:
            <ul className={styles.list}>
              <li>Production redeployment tests</li>
              <li>Failover and failback procedures</li>
              <li>Recovery validation</li>
              <li>Load, stress, and performance testing</li>
              <li>Chaos engineering experiments</li>
              <li>User acceptance testing (UAT)</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Phase1Prepare
