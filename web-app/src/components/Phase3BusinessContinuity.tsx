import { useState } from 'react'
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Badge,
  TabList,
  Tab,
  type SelectTabData,
  type SelectTabEvent,
} from '@fluentui/react-components'
import {
  Checkmark16Filled,
  Dismiss16Filled,
  Warning16Filled,
} from '@fluentui/react-icons'

/* ═══════════════════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════════════════ */

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
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
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
  highlight: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.padding('20px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    marginBottom: '24px',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    borderLeftColor: tokens.colorBrandBackground,
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
  legendSwatch: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    ...shorthands.borderRadius('3px'),
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
  checkBox: {
    width: '18px',
    height: '18px',
    ...shorthands.borderRadius('4px'),
    ...shorthands.border('2px', 'solid', tokens.colorNeutralStroke1),
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  /* Risk formula */
  riskFormulaBox: {
    ...shorthands.padding('24px'),
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    textAlign: 'center',
    marginBottom: '20px',
  },
  riskFormulaTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '8px',
  },
  riskFormulaDetail: {
    fontSize: '14px',
    color: '#666',
  },
  riskMatrixContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '16px',
  },
  riskYTitle: {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
    ...shorthands.padding('8px', '4px'),
  },
  riskMatrixGrid: {
    display: 'grid',
    gridTemplateColumns: '60px repeat(5, 1fr)',
    gap: '2px',
    marginBottom: '2px',
  },
  riskAxisLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
  },
  riskCell: {
    ...shorthands.padding('12px', '8px'),
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '16px',
    ...shorthands.borderRadius('6px'),
    color: '#ffffff',
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskXLabels: {
    display: 'grid',
    gridTemplateColumns: '60px repeat(5, 1fr)',
    gap: '2px',
    marginBottom: '8px',
  },
  riskXLabel: {
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground3,
  },
  /* Dashboard */
  dashboardRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  metricCard: {
    ...shorthands.padding('20px'),
    ...shorthands.borderRadius('12px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    textAlign: 'center',
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
  },
  metricLabel: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '12px',
    marginTop: '12px',
  },
  summaryCard: {
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('8px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: '28px',
    fontWeight: '700',
  },
  summaryLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
})

/* ═══════════════════════════════════════════════════════
   Data constants
   ═══════════════════════════════════════════════════════ */

const bcpChecklist: { component: string; description: string }[] = [
  { component: 'Executive Summary', description: 'Overview of the BCP, its purpose and scope' },
  { component: 'Plan Scope & Objectives', description: 'Define what is covered and goals' },
  { component: 'Roles & Responsibilities', description: 'RACI and contact information' },
  { component: 'Risk Assessment Summary', description: 'Key risks and mitigation strategies' },
  { component: 'Business Impact Analysis', description: 'Criticality and recovery priorities' },
  { component: 'Recovery Strategies', description: 'Detailed recovery procedures' },
  { component: 'Emergency Response Procedures', description: 'Immediate response actions' },
  { component: 'Communication Plans', description: 'Internal and external communication' },
  { component: 'IT Disaster Recovery Plan', description: 'Technical recovery procedures' },
  { component: 'Training & Awareness', description: 'Staff training programs' },
  { component: 'Plan Testing & Exercises', description: 'Regular testing schedule' },
  { component: 'Plan Maintenance', description: 'Review and update procedures' },
]

/* Risk helpers */
const riskColor = (score: number): string => {
  if (score >= 20) return '#dc3545'
  if (score >= 15) return '#fd7e14'
  if (score >= 8) return '#ffc107'
  return '#28a745'
}
const riskLevel = (score: number): string => {
  if (score >= 20) return 'Critical'
  if (score >= 15) return 'High'
  if (score >= 8) return 'Medium'
  return 'Low'
}
const riskLevelBadgeColor = (level: string): 'danger' | 'warning' | 'success' | 'important' => {
  switch (level) {
    case 'Critical': return 'danger'
    case 'High': return 'important'
    case 'Medium': return 'warning'
    default: return 'success'
  }
}

const riskScenarios: { category: string; description: string; impact: number; probability: number }[] = [
  { category: 'Cyber Attack (DDoS)', description: 'Distributed denial of service', impact: 4, probability: 4 },
  { category: 'Data Breach', description: 'Unauthorized data access', impact: 5, probability: 3 },
  { category: 'Region Outage', description: 'Azure region failure', impact: 5, probability: 1 },
  { category: 'Zone Failure', description: 'Availability zone outage', impact: 3, probability: 2 },
  { category: 'Configuration Error', description: 'Human misconfiguration', impact: 3, probability: 4 },
  { category: 'Power Grid Failure', description: 'Data center power loss', impact: 4, probability: 1 },
  { category: 'Supply Chain Attack', description: 'Compromised dependencies', impact: 4, probability: 2 },
  { category: 'Natural Disaster', description: 'Earthquake, flood affecting DC', impact: 5, probability: 1 },
  { category: 'Network Partition', description: 'Network connectivity loss', impact: 3, probability: 3 },
  { category: 'Service Degradation', description: 'Azure service performance issues', impact: 2, probability: 4 },
]

interface MbcoRow {
  order: number
  application: string
  businessFunction: string
  criticality: string
  criticalityColor: string
  window: string
  env: string
  location: string
  upstreamDeps: string
  downstreamDeps: string
  recovery: string
  originGeo: string
  restoreGeo: string
}

const mbcoData: MbcoRow[] = [
  { order: 1, application: 'Azure Platform Landing Zone', businessFunction: 'Identity (Microsoft Entra ID, AD)', criticality: 'Security Critical', criticalityColor: '#dc3545', window: 'At all times', env: 'Azure', location: 'Global', upstreamDeps: '\u2014', downstreamDeps: 'All services', recovery: 'Redeploy, Availability, Restore', originGeo: 'Global', restoreGeo: 'Global' },
  { order: 2, application: 'Azure Platform Landing Zone', businessFunction: 'DNS', criticality: 'Business Critical', criticalityColor: '#dc3545', window: 'At all times', env: 'Azure', location: 'Global', upstreamDeps: 'Identity', downstreamDeps: 'Mars Travel, Complaints, Order Fulfillment, Warehouse', recovery: 'Redeploy, Availability, Restore', originGeo: 'Global', restoreGeo: 'Global' },
  { order: 2, application: 'Azure Platform Landing Zone', businessFunction: 'Recovery Services (Backup, Snapshot, Replication)', criticality: 'Mission Critical', criticalityColor: '#dc3545', window: 'At all times', env: 'Azure', location: 'Australia East, Australia Southeast', upstreamDeps: 'Identity', downstreamDeps: 'Mars Travel, Complaints, Order Fulfillment, Warehouse', recovery: 'Redeploy, Availability, Restore', originGeo: 'Australia', restoreGeo: 'Australia' },
  { order: 2, application: 'Azure Platform Landing Zone', businessFunction: 'Ingress/Egress (Firewalls, WAF)', criticality: 'Security Critical', criticalityColor: '#dc3545', window: 'At all times', env: 'Azure', location: 'Australia East, Australia Southeast', upstreamDeps: 'Identity', downstreamDeps: 'Complaints Management', recovery: 'Redeploy, Availability, Restore', originGeo: 'Australia', restoreGeo: 'Australia' },
  { order: 2, application: 'Azure Platform Landing Zone', businessFunction: 'Security Services (Key Management, DDoS)', criticality: 'Medium', criticalityColor: '#28a745', window: 'At all times', env: 'Azure', location: 'Australia East, Australia Southeast', upstreamDeps: 'Identity', downstreamDeps: '\u2014', recovery: 'Restore', originGeo: 'Australia', restoreGeo: 'Australia' },
  { order: 2, application: 'Azure Platform Landing Zone', businessFunction: 'Security Information and Event Management', criticality: 'Compliance Critical', criticalityColor: '#dc3545', window: 'At all times', env: 'Azure', location: 'Australia East, Australia Southeast', upstreamDeps: 'Identity', downstreamDeps: '\u2014', recovery: 'Redeploy, Availability, Restore', originGeo: 'Australia', restoreGeo: 'Australia' },
  { order: 3, application: 'Mars Travel Bookings', businessFunction: 'Trip Bookings', criticality: 'Business Critical', criticalityColor: '#dc3545', window: 'At all times', env: 'Azure', location: 'Australia East, Australia Southeast', upstreamDeps: 'Identity, DNS, Recovery Services, Warehouse Inventory', downstreamDeps: 'Order Fulfillment', recovery: 'Redeploy, Availability, Restore', originGeo: 'Australia', restoreGeo: 'Australia' },
  { order: 3, application: 'Mars Travel Bookings', businessFunction: 'Online Payment Processing', criticality: 'Business Critical', criticalityColor: '#dc3545', window: 'At all times', env: 'Azure', location: 'Australia East, Australia Southeast', upstreamDeps: 'Identity, DNS, Recovery Services, Warehouse Inventory', downstreamDeps: 'Order Fulfillment', recovery: 'Redeploy, Availability, Restore', originGeo: 'Australia', restoreGeo: 'Australia' },
  { order: 3, application: 'Warehouse Inventory', businessFunction: 'Warehouse Inventory Management', criticality: 'Business Critical', criticalityColor: '#dc3545', window: 'At all times', env: 'On-premises', location: 'Sydney, Pitt Street Building', upstreamDeps: 'Identity, DNS, Recovery Services', downstreamDeps: 'Mars Travel Bookings', recovery: 'Redeploy, Availability, Restore', originGeo: 'Australia', restoreGeo: 'Australia' },
  { order: 3, application: 'Order Fulfillment', businessFunction: 'Order Fulfillment', criticality: 'Business Critical', criticalityColor: '#dc3545', window: 'At all times', env: 'On-premises', location: 'Brisbane Data Center', upstreamDeps: 'Identity, DNS, Recovery Services, Mars Travel Bookings', downstreamDeps: '\u2014', recovery: 'Redeploy, Availability, Restore', originGeo: 'Australia', restoreGeo: 'Australia' },
  { order: 3, application: 'Lunar Orbit Control', businessFunction: 'Lunar Orbit Control', criticality: 'Safety Critical', criticalityColor: '#dc3545', window: 'Last week of every month', env: 'Azure', location: 'Australia East, Australia Southeast', upstreamDeps: 'Identity, DNS, Recovery Services', downstreamDeps: '\u2014', recovery: 'Redeploy, Availability, Restore', originGeo: 'Australia', restoreGeo: 'Australia' },
  { order: 3, application: 'Complaints Management', businessFunction: 'Public user ability to submit a complaint', criticality: 'High', criticalityColor: '#ffc107', window: 'At all times', env: 'Azure', location: 'Australia East', upstreamDeps: 'Identity, DNS, Services, Ingress/Egress', downstreamDeps: '\u2014', recovery: 'Redeploy, Availability, Restore', originGeo: 'Australia', restoreGeo: 'Australia' },
]

const criticalFunctionCalendar: { month: string; function_name: string; applications: string; notes: string }[] = [
  { month: 'January', function_name: 'Annual Financial Close', applications: 'All financial apps', notes: 'No BCDR drills' },
  { month: 'March', function_name: 'End of Q1 Reporting', applications: 'ERP, Data Warehouse', notes: 'Reduced change window' },
  { month: 'April', function_name: 'Tax Filing Deadline', applications: 'Financial, Compliance apps', notes: 'Freeze period' },
  { month: 'June', function_name: 'End of H1 Review', applications: 'All business apps', notes: 'Maintenance window' },
  { month: 'September', function_name: 'Peak Travel Season', applications: 'Mars Travel Bookings', notes: 'High availability required' },
  { month: 'October', function_name: 'Azure Ignite Conference', applications: 'Demo environments', notes: 'Enhanced monitoring' },
  { month: 'November', function_name: 'Black Friday / Cyber Monday', applications: 'E-commerce, Payments', notes: 'Freeze period' },
  { month: 'December', function_name: 'Annual Planning & Budgets', applications: 'ERP, HR systems', notes: 'Year-end close' },
]

const azureMaintenanceEvents: { window: string; services: string; impact: string; action: string }[] = [
  { window: 'Q1 2026', services: 'Azure SQL, App Service', impact: 'Brief reconnection required', action: 'Enable auto-failover; schedule off-peak' },
  { window: 'Q2 2026', services: 'Azure Kubernetes Service', impact: 'Node reboot during upgrade', action: 'Use PDBs; rolling upgrade strategy' },
  { window: 'Q3 2026', services: 'Virtual Network, ExpressRoute', impact: 'Possible latency increase', action: 'Monitor network metrics; failover path ready' },
  { window: 'Q4 2026', services: 'Azure Storage, Key Vault', impact: 'Service version upgrade', action: 'Test compatibility; review API changes' },
]

const biaPortfolioData: { application: string; criticality: string; critColor: string; slo: string; rto: string; rpo: string; mtd: string; impactCostPerHour: string; lastBiaReview: string }[] = [
  { application: 'Azure Platform Landing Zone', criticality: 'Mission Critical', critColor: '#dc3545', slo: '99.999%', rto: '1h', rpo: '0h', mtd: '4h', impactCostPerHour: '$500,000', lastBiaReview: '2025-01' },
  { application: 'Mars Travel Bookings', criticality: 'Business Critical', critColor: '#dc3545', slo: '99.99%', rto: '4h', rpo: '1h', mtd: '24h', impactCostPerHour: '$50,000', lastBiaReview: '2025-03' },
  { application: 'Warehouse Inventory', criticality: 'Business Critical', critColor: '#dc3545', slo: '99.9%', rto: '8h', rpo: '4h', mtd: '48h', impactCostPerHour: '$30,000', lastBiaReview: '2025-02' },
  { application: 'Order Fulfillment', criticality: 'Business Critical', critColor: '#dc3545', slo: '99.9%', rto: '8h', rpo: '4h', mtd: '48h', impactCostPerHour: '$25,000', lastBiaReview: '2025-02' },
  { application: 'Lunar Orbit Control', criticality: 'Safety Critical', critColor: '#dc3545', slo: '99.999%', rto: '0.5h', rpo: '0h', mtd: '1h', impactCostPerHour: '$1,000,000', lastBiaReview: '2025-01' },
  { application: 'Complaints Management', criticality: 'High', critColor: '#ffc107', slo: '99.9%', rto: '12h', rpo: '4h', mtd: '72h', impactCostPerHour: '$5,000', lastBiaReview: '2025-03' },
]

const criticalityDistribution: { level: string; count: number; color: string }[] = [
  { level: 'Mission Critical', count: 1, color: '#dc3545' },
  { level: 'Business Critical', count: 3, color: '#dc3545' },
  { level: 'Safety Critical', count: 1, color: '#dc3545' },
  { level: 'High', count: 1, color: '#ffc107' },
]

interface TestStatusRow {
  application: string
  lastFailover: string
  lastRecovery: string
  nextScheduled: string
  status: 'on-track' | 'overdue' | 'upcoming'
}

const testStatusData: TestStatusRow[] = [
  { application: 'Azure Platform Landing Zone', lastFailover: '2026-01-15', lastRecovery: '2026-02-10', nextScheduled: '2026-04-15', status: 'on-track' },
  { application: 'Mars Travel Bookings', lastFailover: '2026-01-20', lastRecovery: '2026-02-15', nextScheduled: '2026-04-20', status: 'on-track' },
  { application: 'Warehouse Inventory', lastFailover: '2025-10-01', lastRecovery: '2025-11-05', nextScheduled: '2026-03-15', status: 'overdue' },
  { application: 'Order Fulfillment', lastFailover: '2025-12-01', lastRecovery: '2026-01-10', nextScheduled: '2026-04-01', status: 'upcoming' },
  { application: 'Lunar Orbit Control', lastFailover: '2026-03-01', lastRecovery: '2026-03-05', nextScheduled: '2026-06-01', status: 'on-track' },
  { application: 'Complaints Management', lastFailover: '\u2014', lastRecovery: '\u2014', nextScheduled: '2026-05-01', status: 'upcoming' },
]

const recentActivity: { date: string; event: string; application: string; notes: string }[] = [
  { date: '2026-03-28', event: 'Failover Drill Completed', application: 'Lunar Orbit Control', notes: 'RTO achieved: 18 min (target: 30 min)' },
  { date: '2026-03-15', event: 'BIA Review Updated', application: 'Mars Travel Bookings', notes: 'Revenue impact revised upward' },
  { date: '2026-03-10', event: 'Backup Restore Test', application: 'Azure Platform Landing Zone', notes: 'Full restore validated in 45 min' },
  { date: '2026-03-01', event: 'Risk Assessment Updated', application: 'All', notes: 'Supply chain risk score increased' },
  { date: '2026-02-28', event: 'Dashboard Review', application: 'All', notes: 'Monthly operational review complete' },
]

interface MaintenanceRow {
  document: string
  frequency: string
  lastReview: string
  nextReview: string
  owner: string
  approver: string
  status: 'current' | 'due-soon' | 'overdue'
}

const maintenanceScheduleData: MaintenanceRow[] = [
  { document: 'Business Continuity Plan', frequency: 'Annually', lastReview: '2025-06-15', nextReview: '2026-06-15', owner: 'BC Manager', approver: 'CTO', status: 'current' },
  { document: 'Business Risk Assessment', frequency: 'Semi-annually', lastReview: '2025-09-01', nextReview: '2026-03-01', owner: 'Risk Manager', approver: 'CISO', status: 'due-soon' },
  { document: 'MBCO Recovery Order', frequency: 'Quarterly', lastReview: '2025-12-01', nextReview: '2026-03-01', owner: 'IT Director', approver: 'CTO', status: 'overdue' },
  { document: 'BIA Portfolio Summary', frequency: 'Annually', lastReview: '2025-01-15', nextReview: '2026-01-15', owner: 'BC Manager', approver: 'CFO', status: 'current' },
  { document: 'BCDR Dashboard', frequency: 'Monthly', lastReview: '2026-02-28', nextReview: '2026-03-31', owner: 'Operations', approver: 'IT Director', status: 'current' },
  { document: 'Critical Function Calendar', frequency: 'Quarterly', lastReview: '2025-12-15', nextReview: '2026-03-15', owner: 'BC Manager', approver: 'CTO', status: 'due-soon' },
  { document: 'Training & Awareness', frequency: 'Annually', lastReview: '2025-07-01', nextReview: '2026-07-01', owner: 'HR / BC Manager', approver: 'CTO', status: 'current' },
]

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

function StatusIcon({ status }: { status: 'on-track' | 'overdue' | 'upcoming' | 'current' | 'due-soon' }) {
  switch (status) {
    case 'on-track':
    case 'current':
      return <Checkmark16Filled style={{ color: '#28a745' }} />
    case 'overdue':
      return <Dismiss16Filled style={{ color: '#dc3545' }} />
    case 'upcoming':
    case 'due-soon':
      return <Warning16Filled style={{ color: '#ffc107' }} />
  }
}

function statusLabel(status: 'on-track' | 'overdue' | 'upcoming' | 'current' | 'due-soon'): string {
  switch (status) {
    case 'on-track': return 'On Track'
    case 'current': return 'Current'
    case 'overdue': return 'Overdue'
    case 'upcoming': return 'Upcoming'
    case 'due-soon': return 'Due Soon'
  }
}

function statusBadgeColor(status: string): string {
  switch (status) {
    case 'on-track':
    case 'current':
      return '#28a745'
    case 'overdue':
      return '#dc3545'
    default:
      return '#ffc107'
  }
}

/* ═══════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════ */

function Phase3BusinessContinuity() {
  const styles = useStyles()
  const [selectedTab, setSelectedTab] = useState<string>('planning')
  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value as string)
  }

  /* Build 5x5 risk matrix (impact rows top-to-bottom = 5..1) */
  const matrixRows: { impact: number; cells: { score: number; color: string }[] }[] = []
  for (let impact = 5; impact >= 1; impact--) {
    const cells: { score: number; color: string }[] = []
    for (let prob = 1; prob <= 5; prob++) {
      const score = impact * prob
      cells.push({ score, color: riskColor(score) })
    }
    matrixRows.push({ impact, cells })
  }

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

      <TabList selectedValue={selectedTab} onTabSelect={onTabSelect}>
        <Tab value="planning">Planning &amp; Risk</Tab>
        <Tab value="mbco">MBCO &amp; Portfolio</Tab>
        <Tab value="operations">Operations</Tab>
        <Tab value="maintenance">Maintenance</Tab>
      </TabList>

      <div className={styles.tabContent}>

        {/* ================================================================
            TAB 1: PLANNING & RISK
            ================================================================ */}
        {selectedTab === 'planning' && (
          <>
            {/* 1. BCP Document */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Business Continuity Plan (BCP) Document</h2>
              <p className={styles.subsectionDesc}>
                A comprehensive document outlining how the business will continue
                operations during unplanned disruptions. Review each component
                below and confirm its inclusion in your BCP.
              </p>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.thCenter} style={{ width: '50px' }}>Status</th>
                      <th className={styles.th}>BCP Component</th>
                      <th className={styles.thWrap}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bcpChecklist.map((item, i) => (
                      <tr key={i}>
                        <td className={styles.tdCenter}>
                          <div className={styles.checkBox} />
                        </td>
                        <td className={styles.td} style={{ fontWeight: 600 }}>{item.component}</td>
                        <td className={styles.td}>{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.note}>
                <strong>References:</strong> Consider industry-standard BCP
                templates such as ISO 22301 (Business Continuity Management),
                NIST SP 800-34 (Contingency Planning Guide), and the Business
                Continuity Institute Good Practice Guidelines when developing your
                organization&apos;s plan.
              </div>
            </div>

            {/* 2. Business Risk Assessment */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Business Risk Assessment</h2>
              <p className={styles.subsectionDesc}>
                Define risks most likely to impact your business. Risk is
                calculated using impact and probability assessments.
              </p>

              <div className={styles.riskFormulaBox}>
                <div className={styles.riskFormulaTitle}>
                  RISK = IMPACT &times; PROBABILITY
                </div>
                <div className={styles.riskFormulaDetail}>
                  Impact: 1&ndash;5 (1 = Least impact, 5 = Highest impact)
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  Probability: 1&ndash;5 (1 = Least likely, 5 = Most likely)
                </div>
              </div>

              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: '#dc3545' }} />
                  Critical Risk (20&ndash;25)
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: '#fd7e14' }} />
                  High Risk (15&ndash;19)
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: '#ffc107' }} />
                  Medium Risk (8&ndash;14)
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: '#28a745' }} />
                  Low Risk (1&ndash;7)
                </div>
              </div>

              <Card className={styles.card}>
                <div className={styles.cardTitle}>5&times;5 Risk Matrix</div>
                <div className={styles.riskMatrixContainer}>
                  <div className={styles.riskYTitle}>IMPACT &uarr;</div>
                  <div style={{ flex: 1 }}>
                    {matrixRows.map((row) => (
                      <div key={row.impact} className={styles.riskMatrixGrid}>
                        <div className={styles.riskAxisLabel}>{row.impact}</div>
                        {row.cells.map((cell, ci) => (
                          <div
                            key={ci}
                            className={styles.riskCell}
                            style={{ backgroundColor: cell.color, color: cell.color === '#ffc107' ? '#1a1a1a' : '#ffffff' }}
                          >
                            {cell.score}
                          </div>
                        ))}
                      </div>
                    ))}
                    <div className={styles.riskXLabels}>
                      <div />
                      <div className={styles.riskXLabel}>1</div>
                      <div className={styles.riskXLabel}>2</div>
                      <div className={styles.riskXLabel}>3</div>
                      <div className={styles.riskXLabel}>4</div>
                      <div className={styles.riskXLabel}>5</div>
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '14px', color: tokens.colorNeutralForeground1 }}>
                      PROBABILITY &rarr;
                    </div>
                  </div>
                </div>
              </Card>

              <Card className={styles.card}>
                <div className={styles.cardTitle}>Example Risk Scenarios</div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Risk Category</th>
                        <th className={styles.thWrap}>Description</th>
                        <th className={styles.thCenter}>Impact</th>
                        <th className={styles.thCenter}>Probability</th>
                        <th className={styles.thCenter}>Score</th>
                        <th className={styles.thCenter}>Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskScenarios.map((r, i) => {
                        const score = r.impact * r.probability
                        const level = riskLevel(score)
                        return (
                          <tr key={i}>
                            <td className={styles.td} style={{ fontWeight: 600 }}>{r.category}</td>
                            <td className={styles.td}>{r.description}</td>
                            <td className={styles.tdCenter}>{r.impact}</td>
                            <td className={styles.tdCenter}>{r.probability}</td>
                            <td className={styles.tdCenter}>
                              <strong style={{ color: riskColor(score) }}>{score}</strong>
                            </td>
                            <td className={styles.tdCenter}>
                              <Badge appearance="filled" color={riskLevelBadgeColor(level)}>{level}</Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* ================================================================
            TAB 2: MBCO & PORTFOLIO
            ================================================================ */}
        {selectedTab === 'mbco' && (
          <>
            {/* 3. MBCO Planning */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>3. MBCO Planning &mdash; Application Recovery Order</h2>
              <p className={styles.subsectionDesc}>
                The Minimum Business Continuity Objective (MBCO) defines the
                minimum number of applications and business functions that must
                be available before Maximum Tolerable Downtime (MTD) is reached.
                Applications with the same recovery order can be recovered
                simultaneously if resources permit.
              </p>

              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: '#dc3545' }} />
                  Tier 1 Critical
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: '#ffc107' }} />
                  Tier 2 High
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendSwatch} style={{ backgroundColor: '#28a745' }} />
                  Tier 3 Medium
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.thCenter}>Order</th>
                      <th className={styles.th}>Application</th>
                      <th className={styles.thWrap}>Business Function</th>
                      <th className={styles.thCenter}>Criticality</th>
                      <th className={styles.th}>Window</th>
                      <th className={styles.thCenter}>Env</th>
                      <th className={styles.thWrap}>Location</th>
                      <th className={styles.thWrap}>Upstream Deps</th>
                      <th className={styles.thWrap}>Downstream Deps</th>
                      <th className={styles.thWrap}>Recovery Options</th>
                      <th className={styles.th}>Origin Geo</th>
                      <th className={styles.th}>Restore Geo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mbcoData.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.tdCenter} style={{ fontWeight: 700 }}>{row.order}</td>
                        <td className={styles.td} style={{ fontWeight: 600 }}>{row.application}</td>
                        <td className={styles.td}>{row.businessFunction}</td>
                        <td className={styles.tdCenter}>
                          <Badge appearance="filled" style={{ backgroundColor: row.criticalityColor, color: row.criticalityColor === '#ffc107' ? '#1a1a1a' : '#ffffff' }}>
                            {row.criticality}
                          </Badge>
                        </td>
                        <td className={styles.td}>{row.window}</td>
                        <td className={styles.tdCenter}>
                          <Badge appearance="outline" color={row.env === 'Azure' ? 'brand' : 'warning'} size="small">
                            {row.env}
                          </Badge>
                        </td>
                        <td className={styles.td}>{row.location}</td>
                        <td className={styles.td}>{row.upstreamDeps}</td>
                        <td className={styles.td}>{row.downstreamDeps}</td>
                        <td className={styles.td}>{row.recovery}</td>
                        <td className={styles.td}>{row.originGeo}</td>
                        <td className={styles.td}>{row.restoreGeo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.note}>
                <strong>Note:</strong> Recovery order determines the sequence in
                which applications are restored during a business disruption.
                Order 1 (foundational platform services) must be restored first
                before dependent applications in orders 2 and 3 can begin recovery.
              </div>
            </div>

            {/* 5. BIA Portfolio Summary */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Business Impact Analysis &mdash; Portfolio Summary</h2>
              <p className={styles.subsectionDesc}>
                Consolidated view of Business Impact Analysis data across all
                applications in the portfolio. Provides executive visibility into
                overall business continuity posture.
              </p>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Application</th>
                      <th className={styles.thCenter}>Criticality</th>
                      <th className={styles.thCenter}>SLO</th>
                      <th className={styles.thCenter}>RTO</th>
                      <th className={styles.thCenter}>RPO</th>
                      <th className={styles.thCenter}>MTD</th>
                      <th className={styles.thCenter}>Impact Cost / hr</th>
                      <th className={styles.thCenter}>Last BIA Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {biaPortfolioData.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.td} style={{ fontWeight: 600 }}>{row.application}</td>
                        <td className={styles.tdCenter}>
                          <Badge appearance="filled" style={{ backgroundColor: row.critColor, color: row.critColor === '#ffc107' ? '#1a1a1a' : '#ffffff' }}>
                            {row.criticality}
                          </Badge>
                        </td>
                        <td className={styles.tdCenter}>{row.slo}</td>
                        <td className={styles.tdCenter}>{row.rto}</td>
                        <td className={styles.tdCenter}>{row.rpo}</td>
                        <td className={styles.tdCenter}>{row.mtd}</td>
                        <td className={styles.tdCenter} style={{ fontWeight: 600 }}>{row.impactCostPerHour}</td>
                        <td className={styles.tdCenter}>{row.lastBiaReview}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.note}>
                <strong>Key Insight:</strong> Lunar Orbit Control has the highest
                per-hour impact cost ($1,000,000) and tightest recovery targets
                (RTO: 0.5h, RPO: 0h). Azure Platform Landing Zone is the
                foundational dependency for all other applications.
              </div>
            </div>
          </>
        )}

        {/* ================================================================
            TAB 3: OPERATIONS
            ================================================================ */}
        {selectedTab === 'operations' && (
          <>
            {/* 4. Critical Function Calendar */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Business Critical Function Calendar</h2>
              <p className={styles.subsectionDesc}>
                Track critical business events and activities to coordinate
                testing schedules and avoid disruption during critical periods.
              </p>

              <Card className={styles.card}>
                <div className={styles.cardTitle}>Critical Business Periods</div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Month</th>
                        <th className={styles.th}>Critical Business Function</th>
                        <th className={styles.thWrap}>Applications Affected</th>
                        <th className={styles.thWrap}>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {criticalFunctionCalendar.map((row, i) => (
                        <tr key={i}>
                          <td className={styles.td} style={{ fontWeight: 600 }}>{row.month}</td>
                          <td className={styles.td}>{row.function_name}</td>
                          <td className={styles.td}>{row.applications}</td>
                          <td className={styles.td}>
                            <Badge
                              appearance="filled"
                              color={row.notes.includes('Freeze') ? 'danger' : row.notes.includes('High availability') ? 'important' : 'informative'}
                              size="small"
                            >
                              {row.notes}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card className={styles.card}>
                <div className={styles.cardTitle}>Azure Planned Maintenance Windows</div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Window</th>
                        <th className={styles.thWrap}>Affected Services</th>
                        <th className={styles.thWrap}>Expected Impact</th>
                        <th className={styles.thWrap}>Recommended Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {azureMaintenanceEvents.map((row, i) => (
                        <tr key={i}>
                          <td className={styles.td} style={{ fontWeight: 600 }}>{row.window}</td>
                          <td className={styles.td}>{row.services}</td>
                          <td className={styles.td}>{row.impact}</td>
                          <td className={styles.td}>{row.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* 6. BCDR Dashboard */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>6. BCDR Dashboard</h2>
              <p className={styles.subsectionDesc}>
                Centralized dashboard providing real-time visibility into BCDR
                posture across the application portfolio.
              </p>

              <div className={styles.dashboardRow}>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>6</div>
                  <div className={styles.metricLabel}>Total Applications</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>5</div>
                  <div className={styles.metricLabel}>Applications with BCDR</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>99.96%</div>
                  <div className={styles.metricLabel}>Average SLO</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>2026-04-15</div>
                  <div className={styles.metricLabel}>Next Scheduled Drill</div>
                </div>
              </div>

              <Card className={styles.card}>
                <div className={styles.cardTitle}>Criticality Distribution</div>
                <div className={styles.summaryGrid}>
                  {criticalityDistribution.map((item, i) => (
                    <div key={i} className={styles.summaryCard}>
                      <div className={styles.summaryValue} style={{ color: item.color }}>{item.count}</div>
                      <div className={styles.summaryLabel}>{item.level}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className={styles.card}>
                <div className={styles.cardTitle}>Test Status</div>
                <div className={styles.legend}>
                  <div className={styles.legendItem}>
                    <Checkmark16Filled style={{ color: '#28a745' }} /> On Track
                  </div>
                  <div className={styles.legendItem}>
                    <Warning16Filled style={{ color: '#ffc107' }} /> Upcoming
                  </div>
                  <div className={styles.legendItem}>
                    <Dismiss16Filled style={{ color: '#dc3545' }} /> Overdue
                  </div>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Application</th>
                        <th className={styles.thCenter}>Last Failover Test</th>
                        <th className={styles.thCenter}>Last Recovery Test</th>
                        <th className={styles.thCenter}>Next Scheduled</th>
                        <th className={styles.thCenter}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testStatusData.map((row, i) => (
                        <tr key={i}>
                          <td className={styles.td} style={{ fontWeight: 600 }}>{row.application}</td>
                          <td className={styles.tdCenter}>{row.lastFailover}</td>
                          <td className={styles.tdCenter}>{row.lastRecovery}</td>
                          <td className={styles.tdCenter}>{row.nextScheduled}</td>
                          <td className={styles.tdCenter}>
                            <Badge
                              appearance="filled"
                              style={{
                                backgroundColor: statusBadgeColor(row.status),
                                color: row.status === 'upcoming' ? '#1a1a1a' : '#ffffff',
                              }}
                            >
                              <StatusIcon status={row.status} />&nbsp;{statusLabel(row.status)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card className={styles.card}>
                <div className={styles.cardTitle}>Recent Activity Log</div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Date</th>
                        <th className={styles.th}>Event</th>
                        <th className={styles.th}>Application</th>
                        <th className={styles.thWrap}>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((row, i) => (
                        <tr key={i}>
                          <td className={styles.td} style={{ fontWeight: 600 }}>{row.date}</td>
                          <td className={styles.td}>{row.event}</td>
                          <td className={styles.td}>{row.application}</td>
                          <td className={styles.td}>{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* ================================================================
            TAB 4: MAINTENANCE
            ================================================================ */}
        {selectedTab === 'maintenance' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Maintain Business Continuity</h2>
            <p className={styles.subsectionDesc}>
              Establish and maintain a regular review schedule for all
              business continuity documentation. Business continuity is not a
              one-time effort&mdash;it requires ongoing attention and
              refinement.
            </p>

            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <Checkmark16Filled style={{ color: '#28a745' }} /> Current
              </div>
              <div className={styles.legendItem}>
                <Warning16Filled style={{ color: '#ffc107' }} /> Due Soon
              </div>
              <div className={styles.legendItem}>
                <Dismiss16Filled style={{ color: '#dc3545' }} /> Overdue
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.thWrap}>Document / Artifact</th>
                    <th className={styles.thCenter}>Review Frequency</th>
                    <th className={styles.thCenter}>Last Review</th>
                    <th className={styles.thCenter}>Next Review</th>
                    <th className={styles.th}>Owner</th>
                    <th className={styles.th}>Approver</th>
                    <th className={styles.thCenter}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceScheduleData.map((row, i) => (
                    <tr key={i}>
                      <td className={styles.td} style={{ fontWeight: 600 }}>{row.document}</td>
                      <td className={styles.tdCenter}>{row.frequency}</td>
                      <td className={styles.tdCenter}>{row.lastReview}</td>
                      <td className={styles.tdCenter}>{row.nextReview}</td>
                      <td className={styles.td}>{row.owner}</td>
                      <td className={styles.td}>{row.approver}</td>
                      <td className={styles.tdCenter}>
                        <Badge
                          appearance="filled"
                          style={{
                            backgroundColor: statusBadgeColor(row.status),
                            color: row.status === 'due-soon' ? '#1a1a1a' : '#ffffff',
                          }}
                        >
                          <StatusIcon status={row.status} />&nbsp;{statusLabel(row.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.note}>
              <strong>Best Practice:</strong> Trigger ad-hoc reviews whenever
              there are significant organizational changes, new threat
              intelligence, major incidents, or regulatory updates. Maintain a
              continuous improvement process informed by post-incident reviews
              and drill lessons learned.
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Phase3BusinessContinuity
