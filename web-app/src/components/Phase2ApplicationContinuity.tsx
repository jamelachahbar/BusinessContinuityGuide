import {
  makeStyles,
  shorthands,
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
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
  subsectionDesc: {
    marginBottom: '16px',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
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
    ...shorthands.padding('20px'),
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
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    textAlign: 'center',
  },
  tableWrap: {
    overflowX: 'auto',
    marginBottom: '16px',
    marginTop: '12px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  th: {
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: '600',
    textAlign: 'left',
    ...shorthands.padding('10px', '12px'),
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke1,
    whiteSpace: 'nowrap',
  },
  thCenter: {
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: '600',
    textAlign: 'center',
    ...shorthands.padding('10px', '12px'),
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke1,
  },
  thWrap: {
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: '600',
    textAlign: 'left',
    ...shorthands.padding('10px', '12px'),
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke1,
    whiteSpace: 'normal',
  },
  td: {
    ...shorthands.padding('10px', '12px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    verticalAlign: 'top',
  },
  tdCenter: {
    ...shorthands.padding('10px', '12px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '16px',
    rowGap: '8px',
    marginBottom: '16px',
    ...shorthands.padding('12px', '16px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius('8px'),
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '6px',
    fontSize: '14px',
  },
  note: {
    ...shorthands.padding('12px', '16px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius('8px'),
    marginBottom: '16px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: tokens.colorNeutralForeground2,
  },
  link: {
    color: tokens.colorBrandForeground1,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  faultTreeRoot: {
    ...shorthands.padding('16px', '20px'),
    backgroundColor: '#dc3545',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '16px',
    ...shorthands.borderRadius('8px'),
    marginBottom: '12px',
    textAlign: 'center',
  },
  faultTreeBranch: {
    marginLeft: '24px',
    ...shorthands.borderLeft('3px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.padding('0', '0', '0', '16px'),
  },
  faultTreeNode: {
    ...shorthands.padding('10px', '16px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius('6px'),
    marginBottom: '8px',
    fontSize: '14px',
  },
  faultTreeLeaf: {
    ...shorthands.padding('8px', '14px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('4px'),
    marginBottom: '6px',
    fontSize: '13px',
    ...shorthands.borderLeft('3px', 'solid', tokens.colorNeutralStroke2),
    marginLeft: '24px',
  },
  responsePlanRow: {
    ...shorthands.padding('16px', '20px'),
    ...shorthands.borderRadius('8px'),
    marginBottom: '12px',
    ...shorthands.borderLeft('5px', 'solid', 'transparent'),
  },
  responsePlanTitle: {
    fontWeight: '600',
    fontSize: '16px',
    marginBottom: '8px',
    color: '#ffffff',
  },
  responsePlanDetail: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'rgba(255,255,255,0.9)',
  },
  responsePlanLabel: {
    fontWeight: '600',
    color: '#ffffff',
  },
  serviceMapComponent: {
    ...shorthands.padding('12px', '16px'),
    ...shorthands.borderRadius('8px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  serviceMapName: {
    fontWeight: '600',
    fontSize: '14px',
  },
  serviceMapDeps: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
  },
  summaryCard: {
    ...shorthands.padding('16px', '20px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius('8px'),
    marginBottom: '12px',
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
  },
  summaryLabel: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },
  olList: {
    marginLeft: '24px',
    marginTop: '12px',
    lineHeight: '1.8',
  },
  checklistItem: {
    ...shorthands.padding('10px', '16px'),
    ...shorthands.borderRadius('6px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    marginBottom: '6px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    lineHeight: '1.5',
  },
  checkBox: {
    width: '18px',
    height: '18px',
    ...shorthands.border('2px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius('3px'),
    flexShrink: 0,
    marginTop: '2px',
  },
  costHighlight: {
    ...shorthands.padding('16px', '20px'),
    backgroundColor: '#e8f5e9',
    ...shorthands.borderRadius('8px'),
    ...shorthands.border('1px', 'solid', '#a5d6a7'),
    marginTop: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#2e7d32',
    textAlign: 'center',
  },
})

/* ────────────────────────────────────────────────────
   1. Requirements & Architecture Decision Record
   ──────────────────────────────────────────────────── */

const requirementsData: { category: string; requirement: string; status: string; adr: string }[] = [
  { category: 'Availability', requirement: 'Multi-region deployment', status: '\u2705', adr: 'Active-passive with Azure Traffic Manager' },
  { category: 'Availability', requirement: 'Zone redundancy', status: '\u2705', adr: 'All services deployed across 3 AZs' },
  { category: 'Availability', requirement: 'Load balancing', status: '\u2705', adr: 'Azure Application Gateway with WAF v2' },
  { category: 'Recovery', requirement: 'RTO < 4 hours', status: '\u2705', adr: 'Automated failover achieves ~15 min RTO' },
  { category: 'Recovery', requirement: 'RPO < 1 hour', status: '\u2705', adr: 'Continuous replication configured' },
  { category: 'Recovery', requirement: 'Geo-redundant backups', status: '\u2705', adr: 'GRS storage with 30-day retention' },
  { category: 'Deployment', requirement: 'Infrastructure as Code', status: '\u2705', adr: 'Bicep templates in source control' },
  { category: 'Deployment', requirement: 'Blue-green deployments', status: '\u274C', adr: 'Not required \u2014 canary rollout sufficient' },
  { category: 'Monitoring', requirement: 'Application Insights APM', status: '\u2705', adr: 'Full APM configured with custom dashboards' },
  { category: 'Monitoring', requirement: 'Centralized logging', status: '\u2705', adr: 'Log Analytics workspace with 90-day retention' },
  { category: 'Security', requirement: 'DDoS Protection', status: '\u2705', adr: 'Standard tier enabled on VNet' },
  { category: 'Security', requirement: 'WAF policy', status: '\u2705', adr: 'OWASP 3.2 rule set on Application Gateway' },
  { category: 'Compliance', requirement: 'Data residency', status: '\u2705', adr: 'Australia East + Australia Southeast' },
  { category: 'Compliance', requirement: 'SOC 2 Type II', status: '\u26AB', adr: 'N/A \u2014 not in regulatory scope' },
  { category: 'Testing', requirement: 'Quarterly failover drills', status: '\u2705', adr: 'Automated failover test pipeline configured' },
]

/* ────────────────────────────────────────────────────
   2. Service Map
   ──────────────────────────────────────────────────── */

const serviceMapData: { name: string; type: string; upstream: string; downstream: string }[] = [
  { name: 'Azure Front Door', type: 'Networking', upstream: 'End Users', downstream: 'App Service' },
  { name: 'App Service (Web App)', type: 'Compute', upstream: 'Azure Front Door', downstream: 'Azure SQL, Redis, Service Bus' },
  { name: 'Azure SQL Database', type: 'Data', upstream: 'App Service', downstream: 'Storage Account (backups)' },
  { name: 'Azure Cache for Redis', type: 'Cache', upstream: 'App Service', downstream: '\u2014' },
  { name: 'Azure Service Bus', type: 'Messaging', upstream: 'App Service', downstream: 'Azure Functions' },
  { name: 'Azure Functions', type: 'Compute', upstream: 'Service Bus', downstream: 'Azure SQL, Storage Account' },
  { name: 'Azure Key Vault', type: 'Security', upstream: 'App Service, Functions', downstream: '\u2014' },
  { name: 'Storage Account', type: 'Storage', upstream: 'App Service, Functions', downstream: '\u2014' },
  { name: 'Application Insights', type: 'Monitoring', upstream: 'All components', downstream: 'Log Analytics' },
  { name: 'Microsoft Entra ID', type: 'Identity', upstream: 'End Users', downstream: 'App Service, Key Vault' },
]

/* ────────────────────────────────────────────────────
   3. Business Impact Analysis
   ──────────────────────────────────────────────────── */

const biaMetrics: { metric: string; value: string; notes: string }[] = [
  { metric: 'Composite SLO', value: '99.95%', notes: 'Based on service chain calculation' },
  { metric: 'RTO', value: '4 hours', notes: 'Maximum acceptable recovery time' },
  { metric: 'RPO', value: '1 hour', notes: 'Maximum acceptable data loss' },
  { metric: 'MTD', value: '24 hours', notes: 'Maximum tolerable downtime before severe impact' },
  { metric: 'Throughput Objective', value: '1,000 TPS', notes: 'Minimum transactions per second during recovery' },
  { metric: 'Response Objective', value: '200 ms', notes: 'Maximum acceptable response time (p95)' },
  { metric: 'Revenue Impact (per hour)', value: '$50,000', notes: 'Estimated direct business loss during outage' },
  { metric: 'Daily Active Users', value: '10,000', notes: 'Average daily usage' },
]

const biaDependencies: { direction: string; items: string[] }[] = [
  { direction: 'Upstream', items: ['Customer Web Portal', 'Mobile Application', 'Partner API Gateway', 'CDN (static assets)'] },
  { direction: 'Downstream', items: ['Payment Processing Service', 'Email / Notification Service', 'Reporting Data Warehouse', 'Third-party CRM Integration'] },
]

/* ────────────────────────────────────────────────────
   4. Fault Tree Analysis (-BCDR)
   ──────────────────────────────────────────────────── */

const faultTreeBefore: { category: string; probability: string; impact: string; causes: string[] }[] = [
  { category: 'Infrastructure Failure', probability: 'Medium', impact: 'High', causes: ['Availability zone outage', 'Region-wide outage', 'Network connectivity failure', 'DNS resolution failure'] },
  { category: 'Application Failure', probability: 'Medium', impact: 'High', causes: ['Unhandled code exceptions', 'Configuration drift / error', 'Dependency service timeout', 'Memory leak / resource exhaustion'] },
  { category: 'Data Issues', probability: 'Low', impact: 'Critical', causes: ['Data corruption (application bug)', 'Accidental deletion', 'Replication lag / inconsistency', 'Schema migration failure'] },
  { category: 'Security Incident', probability: 'Low', impact: 'Critical', causes: ['DDoS attack', 'Credential compromise', 'Ransomware / malware', 'Supply chain vulnerability'] },
]

/* ────────────────────────────────────────────────────
   5. Architecture Gap Assessment (-BCDR)
   ──────────────────────────────────────────────────── */

const gapAssessmentData: { component: string; category: string; sla: string; ha: string; dr: string; gap: 'met' | 'partial' | 'gap' }[] = [
  { component: 'Microsoft Entra ID', category: 'Identity', sla: '99.99%', ha: 'Global redundancy', dr: '\u2014', gap: 'met' },
  { component: 'Azure DNS', category: 'Networking', sla: '100%', ha: 'Global anycast', dr: '\u2014', gap: 'met' },
  { component: 'Azure Front Door', category: 'Networking', sla: '99.99%', ha: 'Global load balancing', dr: '\u2014', gap: 'met' },
  { component: 'App Service Plan', category: 'Compute', sla: '99.95%', ha: 'Single region', dr: 'None', gap: 'gap' },
  { component: 'Azure SQL Database', category: 'Data', sla: '99.99%', ha: 'Zone redundant', dr: 'No geo-replication', gap: 'partial' },
  { component: 'Azure Service Bus', category: 'Messaging', sla: '99.9%', ha: 'Zone redundant', dr: 'No geo-DR', gap: 'partial' },
  { component: 'Azure Cache for Redis', category: 'Cache', sla: '99.9%', ha: 'Standard tier', dr: 'No geo-replication', gap: 'gap' },
  { component: 'Storage Account', category: 'Storage', sla: '99.9%', ha: 'LRS', dr: 'No GRS', gap: 'gap' },
  { component: 'Azure Key Vault', category: 'Security', sla: '99.99%', ha: 'Zone redundant', dr: 'Managed replication', gap: 'met' },
  { component: 'Application Insights', category: 'Monitoring', sla: '99.9%', ha: 'Regional', dr: '\u2014', gap: 'met' },
]

const gapBadge = (gap: 'met' | 'partial' | 'gap') => {
  switch (gap) {
    case 'met': return { label: '\u2705 Met', color: '#28a745' }
    case 'partial': return { label: '\u26A0\uFE0F Partial', color: '#ffc107' }
    case 'gap': return { label: '\u274C Gap', color: '#dc3545' }
  }
}

/* ────────────────────────────────────────────────────
   6. Metric Analysis (-BCDR)
   ──────────────────────────────────────────────────── */

const metricAnalysisData: { component: string; availability: string; reliability: string; security: string; composite: string }[] = [
  { component: 'App Service', availability: '99.95%', reliability: '95%', security: '80%', composite: '91.7%' },
  { component: 'Azure SQL', availability: '99.99%', reliability: '98%', security: '90%', composite: '96.0%' },
  { component: 'Redis Cache', availability: '99.9%', reliability: '90%', security: '75%', composite: '88.3%' },
  { component: 'Service Bus', availability: '99.9%', reliability: '92%', security: '85%', composite: '92.3%' },
  { component: 'Storage Account', availability: '99.9%', reliability: '95%', security: '80%', composite: '91.6%' },
  { component: 'Azure Functions', availability: '99.95%', reliability: '93%', security: '82%', composite: '91.7%' },
]

/* ────────────────────────────────────────────────────
   7. Response Plan by Scope
   ──────────────────────────────────────────────────── */

const responsePlanData: { scope: string; bgColor: string; availability: string; recoverability: string; resources: string; continuity: string; preparation: string }[] = [
  {
    scope: 'Global',
    bgColor: '#1a237e',
    availability: 'None',
    recoverability: 'Redeploy, Restore',
    resources: 'Service Providers, Authorities, IT Support',
    continuity: 'Contingency Plan',
    preparation: 'Board signoff; Communication plan; Contingency plan validation; Redeploy testing',
  },
  {
    scope: 'Azure Geography',
    bgColor: '#283593',
    availability: 'None',
    recoverability: 'Redeploy, Restore (manual)',
    resources: 'Service Providers, Authorities, IT Support',
    continuity: 'Contingency Plan',
    preparation: 'Board signoff; Communication plan; Contingency plan validation; Redeploy testing',
  },
  {
    scope: 'Azure Region',
    bgColor: '#303f9f',
    availability: 'Failover to secondary region (automated)',
    recoverability: 'Restore (manual)',
    resources: 'IT Support, Vendor',
    continuity: 'Failover Plan, Recovery Plan',
    preparation: 'App Business Owner signoff; Communication plan; Failover testing; Recovery testing',
  },
  {
    scope: 'Azure Zone',
    bgColor: '#3949ab',
    availability: 'Failover between zones (automated)',
    recoverability: 'Restore (manual)',
    resources: 'Service Providers, IT Support',
    continuity: 'Failover Plan, Recovery Plan',
    preparation: 'App Business Owner signoff; Communication plan; Failover testing; Recovery testing',
  },
  {
    scope: 'Azure Service Instance',
    bgColor: '#3f51b5',
    availability: 'None',
    recoverability: 'Restore (manual)',
    resources: 'Service Providers, IT Support',
    continuity: 'Failover Plan, Recovery Plan',
    preparation: 'App Business Owner signoff; Communication plan; Failover testing; Recovery testing',
  },
  {
    scope: 'Data Integrity Issue',
    bgColor: '#5c6bc0',
    availability: 'N/A',
    recoverability: 'Restore (manual)',
    resources: 'Service Providers, IT Support',
    continuity: 'Recovery Plan',
    preparation: 'App Business Owner signoff; Communication plan; Recovery testing',
  },
]

/* ────────────────────────────────────────────────────
   8. Architecture Continuity Design (+BCDR)
   ──────────────────────────────────────────────────── */

const continuityDesignData: { component: string; category: string; sla: string; ha: string; dr: string; remediation: string; status: 'met' | 'new' }[] = [
  { component: 'Microsoft Entra ID', category: 'Identity', sla: '99.99%', ha: 'Global redundancy', dr: '\u2014', remediation: 'No change required', status: 'met' },
  { component: 'Azure DNS', category: 'Networking', sla: '100%', ha: 'Global anycast', dr: '\u2014', remediation: 'No change required', status: 'met' },
  { component: 'Azure Front Door', category: 'Networking', sla: '99.99%', ha: 'Global load balancing', dr: '\u2014', remediation: 'No change required', status: 'met' },
  { component: 'App Service Plan', category: 'Compute', sla: '99.95%', ha: 'Zone-redundant + secondary region', dr: 'Active-passive failover', remediation: 'Deploy to secondary region with Traffic Manager', status: 'new' },
  { component: 'Azure SQL Database', category: 'Data', sla: '99.995%', ha: 'Zone redundant', dr: 'Active geo-replication', remediation: 'Enable geo-replication to paired region', status: 'new' },
  { component: 'Azure Service Bus', category: 'Messaging', sla: '99.9%', ha: 'Zone redundant', dr: 'Geo-DR pairing', remediation: 'Configure geo-disaster recovery namespace', status: 'new' },
  { component: 'Azure Cache for Redis', category: 'Cache', sla: '99.9%', ha: 'Premium with zone redundancy', dr: 'Geo-replication', remediation: 'Upgrade to Premium; enable geo-replication', status: 'new' },
  { component: 'Storage Account', category: 'Storage', sla: '99.99%', ha: 'ZRS', dr: 'GZRS', remediation: 'Migrate from LRS to GZRS', status: 'new' },
  { component: 'Azure Key Vault', category: 'Security', sla: '99.99%', ha: 'Zone redundant', dr: 'Managed replication', remediation: 'No change required', status: 'met' },
  { component: 'Application Insights', category: 'Monitoring', sla: '99.9%', ha: 'Regional', dr: '\u2014', remediation: 'No change required', status: 'met' },
]

/* ────────────────────────────────────────────────────
   9. Cost Comparison
   ──────────────────────────────────────────────────── */

const costComparisonData: { component: string; currentCost: number; bcdrCost: number }[] = [
  { component: 'App Service Plan', currentCost: 500, bcdrCost: 1000 },
  { component: 'Azure SQL Database', currentCost: 800, bcdrCost: 1200 },
  { component: 'Azure Cache for Redis', currentCost: 300, bcdrCost: 600 },
  { component: 'Azure Service Bus', currentCost: 150, bcdrCost: 225 },
  { component: 'Storage Account', currentCost: 50, bcdrCost: 75 },
  { component: 'Azure Front Door', currentCost: 200, bcdrCost: 200 },
  { component: 'Key Vault', currentCost: 10, bcdrCost: 10 },
  { component: 'Application Insights', currentCost: 100, bcdrCost: 100 },
]

/* ────────────────────────────────────────────────────
   10. Metric Comparison (+BCDR)
   ──────────────────────────────────────────────────── */

const metricComparisonData: { component: string; beforeAvail: string; afterAvail: string; beforeReliability: string; afterReliability: string; beforeSecurity: string; afterSecurity: string }[] = [
  { component: 'App Service', beforeAvail: '99.95%', afterAvail: '99.99%', beforeReliability: '95%', afterReliability: '99%', beforeSecurity: '80%', afterSecurity: '92%' },
  { component: 'Azure SQL', beforeAvail: '99.99%', afterAvail: '99.995%', beforeReliability: '98%', afterReliability: '99.5%', beforeSecurity: '90%', afterSecurity: '95%' },
  { component: 'Redis Cache', beforeAvail: '99.9%', afterAvail: '99.95%', beforeReliability: '90%', afterReliability: '97%', beforeSecurity: '75%', afterSecurity: '90%' },
  { component: 'Service Bus', beforeAvail: '99.9%', afterAvail: '99.95%', beforeReliability: '92%', afterReliability: '98%', beforeSecurity: '85%', afterSecurity: '92%' },
  { component: 'Storage Account', beforeAvail: '99.9%', afterAvail: '99.99%', beforeReliability: '95%', afterReliability: '99%', beforeSecurity: '80%', afterSecurity: '90%' },
]

/* ────────────────────────────────────────────────────
   11. Fault Tree Analysis (+BCDR)
   ──────────────────────────────────────────────────── */

const faultTreeAfter: { category: string; probability: string; impact: string; mitigations: string[] }[] = [
  { category: 'Infrastructure Failure', probability: 'Low', impact: 'Medium', mitigations: ['Zone-redundant deployment across 3 AZs', 'Active-passive multi-region failover', 'Redundant ExpressRoute + VPN hybrid', 'Azure Traffic Manager with health probes'] },
  { category: 'Application Failure', probability: 'Low', impact: 'Medium', mitigations: ['Circuit breaker + retry logic on all dependencies', 'IaC with drift detection and auto-remediation', 'Queue-based load leveling for async calls', 'Auto-scaling + resource limit alerts'] },
  { category: 'Data Issues', probability: 'Very Low', impact: 'Medium', mitigations: ['Point-in-time restore with 30-day retention', 'Soft delete enabled on all storage', 'Active geo-replication for SQL', 'Automated backup verification'] },
  { category: 'Security Incident', probability: 'Very Low', impact: 'High', mitigations: ['DDoS Protection Standard on VNet', 'Managed identity + Key Vault rotation', 'Microsoft Defender for Cloud enabled', 'WAF v2 with OWASP 3.2 rule set'] },
]

/* ────────────────────────────────────────────────────
   12. Contingency Plan
   ──────────────────────────────────────────────────── */

const contingencySteps: string[] = [
  'Declare contingency event \u2014 confirm system cannot be restored within MTD',
  'Activate contingency communication plan \u2014 notify stakeholders and customers',
  'Switch to manual / offline processes as documented per business function',
  'Engage service providers and vendor support for root cause analysis',
  'Redirect critical transactions to backup systems or partner services',
  'Establish regular status updates \u2014 hourly internally, every 2 hours externally',
  'Monitor manual processes for errors and escalate issues immediately',
  'Prepare for restoration \u2014 validate data integrity before switchback',
  'Execute controlled switchback \u2014 restore automated systems with verification',
  'Conduct post-contingency review \u2014 update contingency plan with lessons learned',
]

/* ────────────────────────────────────────────────────
   13. Role Assignment
   ──────────────────────────────────────────────────── */

const roleAssignmentData: { role: string; name: string; team: string; responsibility: string; escalation: string }[] = [
  { role: 'Incident Commander', name: '[Assigned Name]', team: 'Operations', responsibility: 'Overall incident coordination, communication, and decision-making', escalation: 'CTO / VP Engineering' },
  { role: 'Technical Lead', name: '[Assigned Name]', team: 'Engineering', responsibility: 'Lead technical response, failover execution, root cause analysis', escalation: 'Incident Commander' },
  { role: 'Communications Lead', name: '[Assigned Name]', team: 'Operations', responsibility: 'Stakeholder notifications, status page updates, customer comms', escalation: 'Incident Commander' },
  { role: 'DBA / Data Lead', name: '[Assigned Name]', team: 'Data Engineering', responsibility: 'Database failover, data restore, integrity verification', escalation: 'Technical Lead' },
  { role: 'Infrastructure Lead', name: '[Assigned Name]', team: 'Platform / SRE', responsibility: 'Network, compute, and storage failover; IaC redeployment', escalation: 'Technical Lead' },
  { role: 'Security Lead', name: '[Assigned Name]', team: 'Security', responsibility: 'Security assessment during incident, credential rotation if needed', escalation: 'Incident Commander' },
  { role: 'Business Liaison', name: '[Assigned Name]', team: 'Business Ops', responsibility: 'Activate contingency procedures, coordinate manual workarounds', escalation: 'Incident Commander' },
  { role: 'QA / Validation', name: '[Assigned Name]', team: 'QA', responsibility: 'Post-recovery validation, smoke tests, UAT coordination', escalation: 'Technical Lead' },
]

/* ────────────────────────────────────────────────────
   14. Test Summary
   ──────────────────────────────────────────────────── */

const testSummaryData: { type: string; frequency: string; lastTest: string; nextTest: string; automated: string; status: string; owner: string }[] = [
  { type: 'Region Failover', frequency: 'Quarterly', lastTest: '2026-01-15', nextTest: '2026-04-15', automated: 'Partial', status: '\u2705 Passed', owner: 'Infrastructure Lead' },
  { type: 'Zone Failover', frequency: 'Monthly', lastTest: '2026-03-01', nextTest: '2026-04-01', automated: 'Yes', status: '\u2705 Passed', owner: 'Infrastructure Lead' },
  { type: 'Database Recovery', frequency: 'Quarterly', lastTest: '2026-02-10', nextTest: '2026-05-10', automated: 'Partial', status: '\u2705 Passed', owner: 'DBA / Data Lead' },
  { type: 'Backup Restore', frequency: 'Monthly', lastTest: '2026-03-05', nextTest: '2026-04-05', automated: 'Yes', status: '\u2705 Passed', owner: 'Infrastructure Lead' },
  { type: 'Load Test', frequency: 'Monthly', lastTest: '2026-03-10', nextTest: '2026-04-10', automated: 'Yes', status: '\u26A0\uFE0F Degraded', owner: 'QA / Validation' },
  { type: 'Chaos Test', frequency: 'Quarterly', lastTest: '2026-01-20', nextTest: '2026-04-20', automated: 'Yes', status: '\u2705 Passed', owner: 'SRE Team' },
  { type: 'Penetration Test', frequency: 'Annually', lastTest: '2025-11-01', nextTest: '2026-11-01', automated: 'No', status: '\u2705 Passed', owner: 'Security Lead' },
  { type: 'UAT', frequency: 'Per Release', lastTest: '2026-03-15', nextTest: 'Next release', automated: 'No', status: '\u2705 Passed', owner: 'QA / Validation' },
  { type: 'Contingency Drill', frequency: 'Semi-annually', lastTest: '2025-12-01', nextTest: '2026-06-01', automated: 'No', status: '\u2705 Passed', owner: 'Business Liaison' },
]

/* ────────────────────────────────────────────────────
   15. Continuity Drill (Failover Test)
   ──────────────────────────────────────────────────── */

const failoverSteps: string[] = [
  'Pre-flight: Confirm all participants are available and monitoring dashboards are open',
  'Notify stakeholders that a planned failover drill is commencing',
  'Validate current health of primary and secondary regions',
  'Initiate failover: Trigger Traffic Manager / Front Door profile switch to secondary',
  'Monitor: Verify traffic is routing to secondary region endpoints',
  'Validate: Run smoke tests against secondary region (API health, UI, data consistency)',
  'Record: Document failover time, any errors, and user impact metrics',
  'Hold steady state on secondary for defined observation period (30\u201360 min)',
]

const failbackSteps: string[] = [
  'Confirm primary region is healthy and all services are running',
  'Verify data replication has caught up (no replication lag)',
  'Initiate failback: Switch Traffic Manager / Front Door back to primary',
  'Monitor: Verify traffic is routing back to primary region',
  'Validate: Run smoke tests against primary region',
  'Record: Document failback time and any issues encountered',
  'Notify stakeholders that drill is complete',
  'Conduct post-drill review and update runbook with lessons learned',
]

/* ────────────────────────────────────────────────────
   16. Test Plan (UAT)
   ──────────────────────────────────────────────────── */

const uatTestCases: { function_name: string; testSteps: string; expectedResult: string; priority: string }[] = [
  { function_name: 'User Authentication', testSteps: 'Login with valid credentials via Entra ID SSO', expectedResult: 'Successful authentication, dashboard loads within 3s', priority: 'High' },
  { function_name: 'Order Processing', testSteps: 'Submit a new order with valid payment details', expectedResult: 'Order confirmed, confirmation email received', priority: 'High' },
  { function_name: 'Data Retrieval', testSteps: 'Search and retrieve customer records', expectedResult: 'Results returned within 200ms, data accurate', priority: 'High' },
  { function_name: 'Report Generation', testSteps: 'Generate monthly sales report', expectedResult: 'Report generated with correct data, downloadable', priority: 'Medium' },
  { function_name: 'Notification Service', testSteps: 'Trigger alert notification via Service Bus', expectedResult: 'Notification delivered within 60 seconds', priority: 'Medium' },
  { function_name: 'Cache Performance', testSteps: 'Verify cached data serves correctly after failover', expectedResult: 'Cache hit ratio > 90%, no stale data', priority: 'Medium' },
  { function_name: 'File Upload', testSteps: 'Upload document to storage account', expectedResult: 'File stored in target container, accessible via URL', priority: 'Low' },
  { function_name: 'Audit Logging', testSteps: 'Perform sensitive action and check audit log', expectedResult: 'Action logged with timestamp, user, and details', priority: 'High' },
]

/* ────────────────────────────────────────────────────
   17. Outage Communication Plan
   ──────────────────────────────────────────────────── */

const commPlanData: { scope: string; preOutage: string[]; duringOutage: string[]; postOutage: string[] }[] = [
  {
    scope: 'Global / Geography',
    preOutage: ['Board and executive team pre-briefed', 'Customer communication templates prepared', 'Media / PR team on standby'],
    duringOutage: ['Hourly executive updates', 'Customer status page updated every 30 min', 'Media holding statement issued'],
    postOutage: ['Formal post-incident report to board', 'Customer impact letter with remediation steps', 'Regulatory notifications if applicable'],
  },
  {
    scope: 'Region',
    preOutage: ['App business owner notified of planned drill', 'Support team briefed on potential customer impact', 'Status page pre-configured with incident template'],
    duringOutage: ['App business owner updated every 30 min', 'Support team handling customer queries', 'Status page shows real-time incident updates'],
    postOutage: ['Post-incident review within 48 hours', 'RCA shared with stakeholders', 'Runbook updated with lessons learned'],
  },
  {
    scope: 'Zone / Service Instance',
    preOutage: ['Operations team monitoring dashboards', 'Automated alerts configured', 'On-call engineer assigned'],
    duringOutage: ['On-call engineer responds within 15 min', 'PagerDuty / alerting escalation active', 'Internal Slack/Teams channel for coordination'],
    postOutage: ['Brief post-mortem within 24 hours', 'Monitoring thresholds adjusted if needed', 'Automation improvements identified'],
  },
  {
    scope: 'Data Integrity',
    preOutage: ['Backup validation automated and recent', 'Data steward aware of restore procedures', 'Point-in-time restore tested'],
    duringOutage: ['Data team assesses scope of corruption', 'Affected systems isolated', 'Restore initiated from last known good backup'],
    postOutage: ['Data integrity verification report', 'Root cause analysis on corruption source', 'Prevention controls implemented'],
  },
]

/* ────────────────────────────────────────────────────
   18. Maintain Application Continuity
   ──────────────────────────────────────────────────── */

const maintenanceData: { document: string; frequency: string; nextReview: string; owner: string; approver: string }[] = [
  { document: 'Business Impact Analysis', frequency: 'Annually', nextReview: '2027-01-15', owner: 'Application Owner', approver: 'Business Stakeholder' },
  { document: 'Architecture Decision Record', frequency: 'Per change', nextReview: 'On next architecture change', owner: 'Solution Architect', approver: 'Technical Lead' },
  { document: 'Failover Runbook', frequency: 'Quarterly', nextReview: '2026-07-01', owner: 'Infrastructure Lead', approver: 'Operations Manager' },
  { document: 'Recovery Procedures', frequency: 'Quarterly', nextReview: '2026-07-01', owner: 'DBA / Data Lead', approver: 'Technical Lead' },
  { document: 'Contingency Plan', frequency: 'Semi-annually', nextReview: '2026-10-01', owner: 'Business Liaison', approver: 'Application Owner' },
  { document: 'Communication Plan', frequency: 'Semi-annually', nextReview: '2026-10-01', owner: 'Communications Lead', approver: 'Incident Commander' },
  { document: 'Role Assignment', frequency: 'Quarterly', nextReview: '2026-07-01', owner: 'Operations Manager', approver: 'Application Owner' },
  { document: 'Test Plans', frequency: 'Annually', nextReview: '2027-01-15', owner: 'QA / Validation', approver: 'Technical Lead' },
  { document: 'Service Map', frequency: 'Per change', nextReview: 'On next topology change', owner: 'Solution Architect', approver: 'Infrastructure Lead' },
  { document: 'Cost Analysis', frequency: 'Annually', nextReview: '2027-01-15', owner: 'Application Owner', approver: 'Finance / Business Stakeholder' },
]

/* ────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────── */

function Phase2ApplicationContinuity() {
  const styles = useStyles()

  const totalCurrent = costComparisonData.reduce((s, r) => s + r.currentCost, 0)
  const totalBcdr = costComparisonData.reduce((s, r) => s + r.bcdrCost, 0)
  const totalDiff = totalBcdr - totalCurrent
  const pctIncrease = Math.round((totalDiff / totalCurrent) * 100)

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Phase 2: Application Continuity</h1>
      <p className={styles.description}>
        Iterative activities for creating continuity plans for individual
        applications. This phase includes assessment, implementation, and testing
        for each application requiring business continuity planning.
      </p>

      {/* ── Workflow indicators ── */}
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

      {/* ================================================================
          ASSESS SECTION
          ================================================================ */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Badge appearance="filled" color="informative">Assess</Badge>
          Assessment Activities
        </h2>

        <Accordion collapsible multiple>
          {/* ── 1. Requirements & ADR ── */}
          <AccordionItem value="requirements-adr">
            <AccordionHeader>1. Requirements &amp; Architecture Decision Record</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Document BCDR requirements for each application and capture
                architecture decisions with rationale. Use stakeholder workshops
                to populate this template.
              </p>
              <div className={styles.legend}>
                <div className={styles.legendItem}>{'\u2705'} Required</div>
                <div className={styles.legendItem}>{'\u274C'} Not Required</div>
                <div className={styles.legendItem}>{'\u26AB'} N/A</div>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Category</th>
                      <th className={styles.th}>Requirement</th>
                      <th className={styles.thCenter}>Status</th>
                      <th className={styles.thWrap}>Architecture Decision Record</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requirementsData.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.td} style={{ fontWeight: 600 }}>{row.category}</td>
                        <td className={styles.td}>{row.requirement}</td>
                        <td className={styles.tdCenter}>{row.status}</td>
                        <td className={styles.td}>{row.adr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* ── 2. Service Map ── */}
          <AccordionItem value="service-map">
            <AccordionHeader>2. Service Map</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Visualize application components and their dependencies. Use{' '}
                <a className={styles.link} href="https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-map" target="_blank" rel="noopener noreferrer">Application Insights Application Map</a>{' '}
                and{' '}
                <a className={styles.link} href="https://learn.microsoft.com/en-us/azure/azure-monitor/vm/vminsights-maps" target="_blank" rel="noopener noreferrer">VM Insights Service Map</a>{' '}
                for automated dependency discovery.
              </p>
              {serviceMapData.map((svc, i) => (
                <div key={i} className={styles.serviceMapComponent}>
                  <div>
                    <div className={styles.serviceMapName}>{svc.name}</div>
                    <div className={styles.serviceMapDeps}>
                      <Badge appearance="outline" color="informative" size="small">{svc.type}</Badge>
                    </div>
                  </div>
                  <div className={styles.serviceMapDeps}>
                    <strong>Upstream:</strong> {svc.upstream} &nbsp;|&nbsp; <strong>Downstream:</strong> {svc.downstream}
                  </div>
                </div>
              ))}
              <div className={styles.note}>
                <strong>Tip:</strong> Enable Application Insights to automatically discover runtime dependencies.
                Use Azure Resource Graph queries to enumerate infrastructure dependencies.
                See{' '}
                <a className={styles.link} href="https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview" target="_blank" rel="noopener noreferrer">Application Insights overview</a>{' '}
                for setup guidance.
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* ── 3. Business Impact Analysis ── */}
          <AccordionItem value="bia">
            <AccordionHeader>3. Business Impact Analysis (BIA)</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Quantify the impact of application downtime to prioritize
                recovery investments and set objectives.
              </p>
              <div className={styles.summaryGrid}>
                {biaMetrics.slice(0, 4).map((m, i) => (
                  <div key={i} className={styles.summaryCard}>
                    <div className={styles.summaryValue}>{m.value}</div>
                    <div className={styles.summaryLabel}>{m.metric}</div>
                  </div>
                ))}
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Metric</th>
                      <th className={styles.thCenter}>Value</th>
                      <th className={styles.thWrap}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {biaMetrics.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.td} style={{ fontWeight: 600 }}>{row.metric}</td>
                        <td className={styles.tdCenter}><strong>{row.value}</strong></td>
                        <td className={styles.td}>{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 style={{ marginTop: '20px', marginBottom: '12px' }}>Dependency Analysis</h4>
              {biaDependencies.map((dep, i) => (
                <Card key={i} className={styles.card}>
                  <div className={styles.cardTitle}>{dep.direction} Dependencies</div>
                  <ul className={styles.list}>
                    {dep.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </AccordionPanel>
          </AccordionItem>

          {/* ── 4. Fault Tree Analysis (-BCDR) ── */}
          <AccordionItem value="fta-before">
            <AccordionHeader>4. Fault Tree Analysis (\u2212BCDR)</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Top-down failure analysis before BCDR improvements. Identifies
                how component failures contribute to application unavailability.
              </p>
              <div className={styles.faultTreeRoot}>
                Top Event: Application Unavailable
              </div>
              <div className={styles.faultTreeBranch}>
                {faultTreeBefore.map((branch, i) => (
                  <div key={i}>
                    <div className={styles.faultTreeNode}>
                      <strong>{branch.category}</strong>
                      <span style={{ marginLeft: '12px' }}>
                        <Badge appearance="filled" style={{ backgroundColor: branch.probability === 'Medium' ? '#ffc107' : '#fd7e14', color: '#1a1a1a', marginRight: '6px' }}>
                          P: {branch.probability}
                        </Badge>
                        <Badge appearance="filled" style={{ backgroundColor: branch.impact === 'Critical' ? '#dc3545' : '#fd7e14', color: '#ffffff' }}>
                          I: {branch.impact}
                        </Badge>
                      </span>
                    </div>
                    {branch.causes.map((cause, j) => (
                      <div key={j} className={styles.faultTreeLeaf}>{cause}</div>
                    ))}
                  </div>
                ))}
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* ── 5. Architecture Gap Assessment (-BCDR) ── */}
          <AccordionItem value="gap-assessment">
            <AccordionHeader>5. Architecture | Continuity Gap Assessment (\u2212BCDR)</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Assess each component&apos;s current HA and DR configuration against
                requirements. Gaps indicate where BCDR improvements are needed.
              </p>
              <div className={styles.legend}>
                <div className={styles.legendItem}>{'\u2705'} Met &mdash; requirement satisfied</div>
                <div className={styles.legendItem}>{'\u26A0\uFE0F'} Partial &mdash; partially addressed</div>
                <div className={styles.legendItem}>{'\u274C'} Gap &mdash; not addressed</div>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Component</th>
                      <th className={styles.th}>Category</th>
                      <th className={styles.thCenter}>SLA</th>
                      <th className={styles.thWrap}>HA Configuration</th>
                      <th className={styles.thWrap}>DR Configuration</th>
                      <th className={styles.thCenter}>Gap Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gapAssessmentData.map((row, i) => {
                      const badge = gapBadge(row.gap)
                      return (
                        <tr key={i}>
                          <td className={styles.td} style={{ fontWeight: 600 }}>{row.component}</td>
                          <td className={styles.td}>{row.category}</td>
                          <td className={styles.tdCenter}>{row.sla}</td>
                          <td className={styles.td}>{row.ha}</td>
                          <td className={styles.td}>{row.dr}</td>
                          <td className={styles.tdCenter}>
                            <Badge appearance="filled" style={{ backgroundColor: badge.color, color: badge.color === '#ffc107' ? '#1a1a1a' : '#ffffff' }}>
                              {badge.label}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* ── 6. Metric Analysis ── */}
          <AccordionItem value="metric-analysis">
            <AccordionHeader>6. Metric Analysis (\u2212BCDR)</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Baseline reliability and security scores per component before
                BCDR implementation. These scores feed into the business case for
                improvement.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Component</th>
                      <th className={styles.thCenter}>Availability</th>
                      <th className={styles.thCenter}>Reliability</th>
                      <th className={styles.thCenter}>Security</th>
                      <th className={styles.thCenter}>Composite Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricAnalysisData.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.td} style={{ fontWeight: 600 }}>{row.component}</td>
                        <td className={styles.tdCenter}>{row.availability}</td>
                        <td className={styles.tdCenter}>{row.reliability}</td>
                        <td className={styles.tdCenter}>{row.security}</td>
                        <td className={styles.tdCenter}><strong>{row.composite}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ================================================================
          IMPLEMENT SECTION
          ================================================================ */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Badge appearance="filled" color="success">Implement</Badge>
          Implementation Activities
        </h2>

        <Accordion collapsible multiple>
          {/* ── 7. Response Plan by Scope ── */}
          <AccordionItem value="response-plan">
            <AccordionHeader>7. Response Plan by Scope</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Define planned responses for each impact scope, from most severe
                (global) to most localized (data integrity). Each level specifies
                availability, recoverability, resources, and preparation
                requirements.
              </p>
              {responsePlanData.map((plan, i) => (
                <div
                  key={i}
                  className={styles.responsePlanRow}
                  style={{
                    backgroundColor: plan.bgColor,
                    borderLeftColor: plan.bgColor,
                  }}
                >
                  <div className={styles.responsePlanTitle}>
                    <Badge appearance="filled" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', marginRight: '8px' }}>
                      {i + 1}
                    </Badge>
                    {plan.scope}
                  </div>
                  <div className={styles.responsePlanDetail}>
                    <p><span className={styles.responsePlanLabel}>Availability:</span> {plan.availability}</p>
                    <p><span className={styles.responsePlanLabel}>Recoverability:</span> {plan.recoverability}</p>
                    <p><span className={styles.responsePlanLabel}>Resources:</span> {plan.resources}</p>
                    <p><span className={styles.responsePlanLabel}>Continuity:</span> {plan.continuity}</p>
                    <p style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '8px' }}>
                      <span className={styles.responsePlanLabel}>Preparation:</span> {plan.preparation}
                    </p>
                  </div>
                </div>
              ))}
            </AccordionPanel>
          </AccordionItem>

          {/* ── 8. Architecture Continuity Design (+BCDR) ── */}
          <AccordionItem value="continuity-design">
            <AccordionHeader>8. Architecture | Continuity Design (+BCDR)</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Updated architecture with BCDR improvements. Components marked
                with{' '}
                <Badge appearance="filled" style={{ backgroundColor: '#0d6efd', color: '#ffffff' }}>NEW</Badge>{' '}
                indicate changes from the gap assessment.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Component</th>
                      <th className={styles.th}>Category</th>
                      <th className={styles.thCenter}>SLA</th>
                      <th className={styles.thWrap}>HA Configuration</th>
                      <th className={styles.thWrap}>DR Configuration</th>
                      <th className={styles.thWrap}>Remediation</th>
                      <th className={styles.thCenter}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {continuityDesignData.map((row, i) => {
                      const isNew = row.status === 'new'
                      return (
                        <tr key={i} style={isNew ? { backgroundColor: 'rgba(13,110,253,0.05)' } : undefined}>
                          <td className={styles.td} style={{ fontWeight: 600 }}>{row.component}</td>
                          <td className={styles.td}>{row.category}</td>
                          <td className={styles.tdCenter}>{row.sla}</td>
                          <td className={styles.td} style={isNew ? { borderLeft: '3px dotted #0d6efd' } : undefined}>{row.ha}</td>
                          <td className={styles.td} style={isNew ? { borderLeft: '3px dotted #0d6efd' } : undefined}>{row.dr}</td>
                          <td className={styles.td}>{row.remediation}</td>
                          <td className={styles.tdCenter}>
                            {isNew ? (
                              <Badge appearance="filled" style={{ backgroundColor: '#0d6efd', color: '#ffffff' }}>NEW</Badge>
                            ) : (
                              <Badge appearance="filled" style={{ backgroundColor: '#28a745', color: '#ffffff' }}>{'\u2705'} Met</Badge>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* ── 9. Cost Comparison ── */}
          <AccordionItem value="cost-comparison">
            <AccordionHeader>9. Cost Comparison (\u2212BCDR vs. +BCDR)</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Side-by-side comparison of monthly costs before and after BCDR
                improvements. Use this to build the business case for investment.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Component</th>
                      <th className={styles.thCenter}>Current (Monthly)</th>
                      <th className={styles.thCenter}>+BCDR (Monthly)</th>
                      <th className={styles.thCenter}>Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costComparisonData.map((row, i) => {
                      const diff = row.bcdrCost - row.currentCost
                      return (
                        <tr key={i}>
                          <td className={styles.td} style={{ fontWeight: 600 }}>{row.component}</td>
                          <td className={styles.tdCenter}>${row.currentCost.toLocaleString()}</td>
                          <td className={styles.tdCenter}>${row.bcdrCost.toLocaleString()}</td>
                          <td className={styles.tdCenter} style={{ color: diff > 0 ? '#dc3545' : '#28a745', fontWeight: 600 }}>
                            {diff > 0 ? '+' : ''}{`$${diff.toLocaleString()}`}
                          </td>
                        </tr>
                      )
                    })}
                    <tr style={{ fontWeight: 700, backgroundColor: tokens.colorNeutralBackground3 }}>
                      <td className={styles.td}>Total</td>
                      <td className={styles.tdCenter}>${totalCurrent.toLocaleString()}</td>
                      <td className={styles.tdCenter}>${totalBcdr.toLocaleString()}</td>
                      <td className={styles.tdCenter} style={{ color: '#dc3545' }}>+${totalDiff.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.costHighlight}>
                BCDR investment adds ${totalDiff.toLocaleString()}/month (+{pctIncrease}%) to improve
                availability from 99.9% to 99.99%
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* ── 10. Metric Comparison (+BCDR) ── */}
          <AccordionItem value="metric-comparison">
            <AccordionHeader>10. Metric Comparison (+BCDR)</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Improved reliability scores after BCDR implementation,
                demonstrating the value of investments made.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th} rowSpan={2}>Component</th>
                      <th className={styles.thCenter} colSpan={2}>Availability</th>
                      <th className={styles.thCenter} colSpan={2}>Reliability</th>
                      <th className={styles.thCenter} colSpan={2}>Security</th>
                    </tr>
                    <tr>
                      <th className={styles.thCenter}>Before</th>
                      <th className={styles.thCenter}>After</th>
                      <th className={styles.thCenter}>Before</th>
                      <th className={styles.thCenter}>After</th>
                      <th className={styles.thCenter}>Before</th>
                      <th className={styles.thCenter}>After</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricComparisonData.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.td} style={{ fontWeight: 600 }}>{row.component}</td>
                        <td className={styles.tdCenter}>{row.beforeAvail}</td>
                        <td className={styles.tdCenter} style={{ color: '#28a745', fontWeight: 600 }}>{row.afterAvail}</td>
                        <td className={styles.tdCenter}>{row.beforeReliability}</td>
                        <td className={styles.tdCenter} style={{ color: '#28a745', fontWeight: 600 }}>{row.afterReliability}</td>
                        <td className={styles.tdCenter}>{row.beforeSecurity}</td>
                        <td className={styles.tdCenter} style={{ color: '#28a745', fontWeight: 600 }}>{row.afterSecurity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* ── 11. Fault Tree Analysis (+BCDR) ── */}
          <AccordionItem value="fta-after">
            <AccordionHeader>11. Fault Tree Analysis (+BCDR)</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Updated fault tree showing reduced failure probability after BCDR
                remediation. Compare with the pre-BCDR analysis to see
                improvements.
              </p>
              <div className={styles.faultTreeRoot} style={{ backgroundColor: '#28a745' }}>
                Top Event: Application Unavailable &mdash; Probability Reduced
              </div>
              <div className={styles.faultTreeBranch}>
                {faultTreeAfter.map((branch, i) => (
                  <div key={i}>
                    <div className={styles.faultTreeNode}>
                      <strong>{branch.category}</strong>
                      <span style={{ marginLeft: '12px' }}>
                        <Badge appearance="filled" style={{ backgroundColor: '#28a745', color: '#ffffff', marginRight: '6px' }}>
                          P: {branch.probability}
                        </Badge>
                        <Badge appearance="filled" style={{ backgroundColor: branch.impact === 'High' ? '#fd7e14' : '#ffc107', color: '#1a1a1a' }}>
                          I: {branch.impact}
                        </Badge>
                      </span>
                    </div>
                    {branch.mitigations.map((mit, j) => (
                      <div key={j} className={styles.faultTreeLeaf}>
                        {'\u2705'} {mit}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* ── 12. Contingency Plan ── */}
          <AccordionItem value="contingency-plan">
            <AccordionHeader>12. Contingency Plan</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Procedure for continuing operations when the system cannot be
                restored within MTD. This plan is activated only when normal
                recovery fails.
              </p>
              <div className={styles.note}>
                <strong>Trigger:</strong> The contingency plan is activated when the
                application cannot be restored within the Maximum Tolerable
                Downtime (MTD) of 24 hours and normal recovery procedures have
                been exhausted.
              </div>
              {contingencySteps.map((step, i) => (
                <div key={i} className={styles.checklistItem}>
                  <div className={styles.checkBox} />
                  <div><strong>Step {i + 1}:</strong> {step}</div>
                </div>
              ))}
            </AccordionPanel>
          </AccordionItem>

          {/* ── 13. Role Assignment ── */}
          <AccordionItem value="role-assignment">
            <AccordionHeader>13. Role Assignment</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Assign specific individuals to BCDR roles. Keep contact details
                current and review quarterly. Roles align with the RACI matrix
                defined in Phase 1.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Role</th>
                      <th className={styles.th}>Assigned To</th>
                      <th className={styles.th}>Team</th>
                      <th className={styles.thWrap}>Responsibility</th>
                      <th className={styles.th}>Escalation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleAssignmentData.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.td} style={{ fontWeight: 600 }}>{row.role}</td>
                        <td className={styles.td}>{row.name}</td>
                        <td className={styles.td}>{row.team}</td>
                        <td className={styles.td}>{row.responsibility}</td>
                        <td className={styles.td}>{row.escalation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ================================================================
          TEST SECTION
          ================================================================ */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Badge appearance="filled" color="warning">Test</Badge>
          Testing Activities
        </h2>

        <Accordion collapsible multiple>
          {/* ── 14. Test Summary ── */}
          <AccordionItem value="test-summary">
            <AccordionHeader>14. Test Summary</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Track all BCDR testing activities, schedules, and outcomes. Update
                after each test execution.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Test Type</th>
                      <th className={styles.thCenter}>Frequency</th>
                      <th className={styles.thCenter}>Last Test</th>
                      <th className={styles.thCenter}>Next Test</th>
                      <th className={styles.thCenter}>Automated</th>
                      <th className={styles.thCenter}>Status</th>
                      <th className={styles.th}>Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testSummaryData.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.td} style={{ fontWeight: 600 }}>{row.type}</td>
                        <td className={styles.tdCenter}>{row.frequency}</td>
                        <td className={styles.tdCenter}>{row.lastTest}</td>
                        <td className={styles.tdCenter}>{row.nextTest}</td>
                        <td className={styles.tdCenter}>{row.automated}</td>
                        <td className={styles.tdCenter}>{row.status}</td>
                        <td className={styles.td}>{row.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* ── 15. Continuity Drill ── */}
          <AccordionItem value="continuity-drill">
            <AccordionHeader>15. Continuity Drill (Failover Test)</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Step-by-step procedure for conducting a failover and failback
                drill. All participants should review this before executing.
              </p>
              <Card className={styles.card}>
                <div className={styles.cardTitle}>Failover Procedure</div>
                <ol className={styles.olList}>
                  {failoverSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </Card>
              <Card className={styles.card}>
                <div className={styles.cardTitle}>Failback Procedure</div>
                <ol className={styles.olList}>
                  {failbackSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </Card>
              <div className={styles.note}>
                <strong>Reference:</strong>{' '}
                <a className={styles.link} href="https://learn.microsoft.com/en-us/azure/architecture/framework/resiliency/testing" target="_blank" rel="noopener noreferrer">Azure Well-Architected Framework &mdash; Reliability testing</a>
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* ── 16. Test Plan (UAT) ── */}
          <AccordionItem value="uat-test-plan">
            <AccordionHeader>16. Test Plan (UAT)</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                User Acceptance Testing procedures to validate that recovered
                systems meet business requirements after a failover or restore
                event.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Business Function</th>
                      <th className={styles.thWrap}>Test Steps</th>
                      <th className={styles.thWrap}>Expected Result</th>
                      <th className={styles.thCenter}>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uatTestCases.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.td} style={{ fontWeight: 600 }}>{row.function_name}</td>
                        <td className={styles.td}>{row.testSteps}</td>
                        <td className={styles.td}>{row.expectedResult}</td>
                        <td className={styles.tdCenter}>
                          <Badge
                            appearance="filled"
                            color={row.priority === 'High' ? 'danger' : row.priority === 'Medium' ? 'warning' : 'success'}
                          >
                            {row.priority}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* ── 17. Outage Communication Plan ── */}
          <AccordionItem value="outage-comm-plan">
            <AccordionHeader>17. Outage Communication Plan</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Communication procedures organized by event scope. Defines
                pre-outage preparation, during-outage actions, and post-outage
                follow-up.
              </p>
              {commPlanData.map((plan, i) => (
                <Card key={i} className={styles.card}>
                  <div className={styles.cardTitle}>{plan.scope}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    <div>
                      <strong>Pre-Outage</strong>
                      <ul className={styles.list}>
                        {plan.preOutage.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>During Outage</strong>
                      <ul className={styles.list}>
                        {plan.duringOutage.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Post-Outage</strong>
                      <ul className={styles.list}>
                        {plan.postOutage.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </AccordionPanel>
          </AccordionItem>

          {/* ── 18. Maintain Application Continuity ── */}
          <AccordionItem value="maintain">
            <AccordionHeader>18. Maintain Application Continuity</AccordionHeader>
            <AccordionPanel>
              <p className={styles.subsectionDesc}>
                Maintenance schedule for all continuity documentation and
                artifacts. Regular reviews ensure documents stay current with
                architecture and organizational changes.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Document</th>
                      <th className={styles.thCenter}>Review Frequency</th>
                      <th className={styles.thCenter}>Next Review</th>
                      <th className={styles.th}>Owner</th>
                      <th className={styles.th}>Approver</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceData.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.td} style={{ fontWeight: 600 }}>{row.document}</td>
                        <td className={styles.tdCenter}>{row.frequency}</td>
                        <td className={styles.tdCenter}>{row.nextReview}</td>
                        <td className={styles.td}>{row.owner}</td>
                        <td className={styles.td}>{row.approver}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.note}>
                <strong>Update triggers:</strong> Documents should also be reviewed after
                any architecture change, test failure, actual outage event, or
                organizational restructuring &mdash; regardless of scheduled
                review dates.
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

export default Phase2ApplicationContinuity
