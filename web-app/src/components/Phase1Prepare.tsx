import { useState } from 'react'
import {
  makeStyles,
  shorthands,
  mergeClasses,
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  tokens,
  Card,
  Badge,
  Button,
  Checkbox,
  TabList,
  Tab,
  type SelectTabData,
  type SelectTabEvent,
} from '@fluentui/react-components'
import {
  Checkmark16Filled,
  Dismiss16Filled,
  Subtract16Filled,
  ArrowReset20Regular,
  Add20Regular,
  Delete20Regular,
  ArrowDownload20Regular,
} from '@fluentui/react-icons'
import { downloadCsv } from '../utils/csvExport'
import { downloadRaciExcel, downloadExcel } from '../utils/excelExport'
import { useWorkbenchData } from '../hooks/useWorkbenchData'
import { getCriticalityColor, getCriticalityOptions } from '../utils/criticality'
import { isInScope, relevanceLabel, phase1TabRelevance } from '../utils/planFocus'
import type { PlanFocus } from '../utils/planFocus'

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
    width: '20px',
    height: '20px',
    ...shorthands.borderRadius('4px'),
    display: 'inline-block',
  },
  raciR: {
    backgroundColor: '#003366',
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    ...shorthands.padding('8px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  raciA: {
    backgroundColor: '#336699',
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    ...shorthands.padding('8px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  raciC: {
    backgroundColor: '#6699CC',
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    ...shorthands.padding('8px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  raciI: {
    backgroundColor: '#99CCFF',
    color: '#1a1a1a',
    fontWeight: '600',
    textAlign: 'center',
    ...shorthands.padding('8px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  raciEmpty: {
    backgroundColor: tokens.colorNeutralBackground1,
    textAlign: 'center',
    ...shorthands.padding('8px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  editableCell: {
    cursor: 'pointer',
    transitionProperty: 'background-color',
    transitionDuration: '0.15s',
    ':hover': {
      backgroundColor: '#EBF5FF',
    },
  },
  editableCellCenter: {
    cursor: 'pointer',
    transitionProperty: 'background-color',
    transitionDuration: '0.15s',
    textAlign: 'center' as const,
    ':hover': {
      backgroundColor: '#EBF5FF',
    },
  },
  cellInput: {
    width: '100%',
    ...shorthands.borderWidth('0'),
    ...shorthands.padding('4px'),
    fontSize: '14px',
    fontFamily: 'inherit',
    lineHeight: '1.4',
    backgroundColor: '#fff',
    outlineWidth: '2px',
    outlineStyle: 'solid',
    outlineColor: tokens.colorBrandStroke1,
    ...shorthands.borderRadius('2px'),
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  sectionHeaderTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '0',
  },
  addRowButton: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  deleteCell: {
    ...shorthands.padding('4px', '8px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    textAlign: 'center',
    verticalAlign: 'middle',
    width: '40px',
  },
  statusIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRequired: {
    color: '#28a745',
  },
  statusNotRequired: {
    color: '#dc3545',
  },
  statusAsRequired: {
    color: '#fd7e14',
  },
})

/* ────────────────────────────────────────────────────
   Status value types & renderer
   ──────────────────────────────────────────────────── */

type StatusValue = 'required' | 'not-required' | 'as-required'

const statusValues: StatusValue[] = ['required', 'not-required', 'as-required']

function isStatusValue(val: string): val is StatusValue {
  return (statusValues as string[]).includes(val)
}

function cycleStatus(current: string): string {
  const idx = (statusValues as string[]).indexOf(current)
  if (idx === -1) return current
  return statusValues[(idx + 1) % statusValues.length]
}

function StatusIcon({ value, onClick }: { value: StatusValue; onClick?: () => void }) {
  const styles = useStyles()
  const config: Record<StatusValue, { icon: React.ReactNode; className: string }> = {
    'required': { icon: <Checkmark16Filled />, className: styles.statusRequired },
    'not-required': { icon: <Dismiss16Filled />, className: styles.statusNotRequired },
    'as-required': { icon: <Subtract16Filled />, className: styles.statusAsRequired },
  }
  const c = config[value]
  return (
    <span
      className={mergeClasses(styles.statusIcon, c.className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {c.icon}
    </span>
  )
}

/* ────────────────────────────────────────────────────
   Criticality Model data
   ──────────────────────────────────────────────────── */

interface CriticalityRow {
  tier: string
  criticality: string
  color: string
  businessView: string
  financial: string
  impacts: boolean[]
}

const defaultImpactColumns = ['Brand', 'Customer Trust', 'Customer Exp', 'Injury Risk', 'Employee Prod']

const defaultCriticalityData: CriticalityRow[] = [
  { tier: 'Tier 1', criticality: 'Mission Critical', color: '#dc3545', businessView: "Affects the company\u2019s mission and might noticeably affect corporate profit-and-loss statements", financial: 'n/a', impacts: [true, true, true, false, true] },
  { tier: 'Tier 1', criticality: 'Business Critical', color: '#dc3545', businessView: 'Can lead to financial losses for the organization', financial: '> $250k', impacts: [true, true, true, false, true] },
  { tier: 'Tier 1', criticality: 'Compliance Critical', color: '#dc3545', businessView: 'In heavily regulated industries, some applications might be critical as part of an effort to maintain compliance requirements', financial: 'n/a', impacts: [true, true, true, false, true] },
  { tier: 'Tier 1', criticality: 'Safety Critical', color: '#dc3545', businessView: 'When lives or the physical safety of employees and customers is at risk during an outage', financial: 'n/a', impacts: [true, true, true, true, true] },
  { tier: 'Tier 1', criticality: 'Security Critical', color: '#fd7e14', businessView: 'Some applications might not be mission critical, but outages could result in loss of data or unintended access', financial: 'n/a', impacts: [true, true, true, false, true] },
  { tier: 'Tier 1', criticality: 'Unit Critical', color: '#fd7e14', businessView: 'Affects the mission of a specific business unit and its profit-and-loss statements', financial: '> $250k', impacts: [true, true, true, false, true] },
  { tier: 'Tier 2', criticality: 'High', color: '#ffc107', businessView: 'Might not hinder the mission, but affects high-importance processes. Measurable losses can be quantified', financial: '< $250k', impacts: [false, true, true, false, true] },
  { tier: 'Tier 3', criticality: 'Medium', color: '#28a745', businessView: 'Impact on processes is likely. Losses are low or immeasurable, but brand damage or upstream losses are likely', financial: '< $100k', impacts: [false, true, true, false, false] },
  { tier: 'Tier 4', criticality: 'Low', color: '#28a745', businessView: "Impact on business processes isn\u2019t measurable. Neither brand damage nor upstream losses are likely. Localized impact on a single team", financial: '< $50k', impacts: [false, true, true, false, true] },
  { tier: 'Tier 5', criticality: 'Unsupported', color: '#6c757d', businessView: "No business owner, team, or process that\u2019s associated with this application can justify any investment", financial: '$0', impacts: [false, false, false, false, true] },
]

/* ────────────────────────────────────────────────────
   Business Commitment Model data (7 sub-sections)
   ──────────────────────────────────────────────────── */

const bcmHeaders = ['Requirement', 'Tier 1 Enhanced', 'Tier 2 Standard', 'Tier 3 Base', 'Tier 4 Base', 'Tier 5 None']

const defaultGeneralRows: string[][] = [
  ['SLA', '99.999%', '99.99%', '99.9%', '99.9%', 'not-required'],
  ['MTD', 'as-required', 'as-required', 'not-required', 'not-required', 'not-required'],
  ['RTO', 'as-required', 'as-required', 'not-required', 'not-required', 'not-required'],
  ['RPO', 'as-required', 'as-required', 'not-required', 'not-required', 'not-required'],
  ['Test Environment', 'required', 'required', 'required', 'as-required', 'not-required'],
  ['BCDR Response Plan', 'required', 'required', 'as-required', 'as-required', 'not-required'],
  ['BIA', 'required', 'required', 'as-required', 'not-required', 'not-required'],
  ['Contingency Plan', 'required', 'as-required', 'not-required', 'not-required', 'not-required'],
  ['Fault Tree Analysis', 'required', 'as-required', 'not-required', 'not-required', 'not-required'],
  ['Outage Communication Plan', 'required', 'required', 'as-required', 'not-required', 'not-required'],
  ['Support Hours', '24\u00D77', '16\u00D75', '8\u00D75', '8\u00D75', 'not-required'],
  ['Cyber Liability Insurance', 'required', 'as-required', 'not-required', 'not-required', 'not-required'],
  ['BCP', 'required', 'required', 'as-required', 'not-required', 'not-required'],
]

const defaultAvailabilityRows: string[][] = [
  ['Hybrid Connectivity', 'ExpressRoute (redundant)', 'ExpressRoute', 'VPN Gateway', 'VPN Gateway', 'not-required'],
  ['Network', 'Zone + Geographic redundant', 'Zone redundant', 'Locally redundant', 'Locally redundant', 'not-required'],
  ['Availability Architecture', 'Active-Active-Active', 'Active-Active', 'Active-Passive', 'Single instance', 'not-required'],
  ['Application Logic', 'Timeouts, Retry, Circuit Breaker', 'Timeouts, Retry Logic', 'Request Timeouts', 'Best effort', 'not-required'],
]

const defaultRecoverabilityRows: string[][] = [
  ['Backup Retention', '30+ days, Geo-redundant', '30 days, Zone-redundant', '14 days, Locally redundant', '7 days, Locally redundant', 'not-required'],
  ['Recovery Architecture', 'Automated failover, Multi-region', 'Automated failover, Single region', 'Manual failover', 'Restore from backup', 'not-required'],
  ['Cross-Region Replication', 'required', 'required', 'as-required', 'not-required', 'not-required'],
]

const defaultDeploymentRows: string[][] = [
  ['Infrastructure as Code', 'required', 'required', 'required', 'as-required', 'not-required'],
  ['CI/CD Pipeline', 'required', 'required', 'as-required', 'as-required', 'not-required'],
  ['Blue-Green / Canary', 'required', 'as-required', 'not-required', 'not-required', 'not-required'],
]

const defaultMonitoringRows: string[][] = [
  ['Metrics Collection', 'required', 'required', 'required', 'as-required', 'not-required'],
  ['Alerting', 'P1 Auto-page', 'P1/P2 Alerts', 'Basic alerts', 'as-required', 'not-required'],
  ['Dashboards', 'required', 'required', 'as-required', 'not-required', 'not-required'],
  ['Log Analytics', 'Full telemetry', 'Key metrics', 'as-required', 'not-required', 'not-required'],
]

const defaultSecurityRows: string[][] = [
  ['DDoS Protection', 'Standard', 'Standard', 'Basic (optional)', 'not-required', 'not-required'],
  ['WAF', 'required', 'required', 'as-required', 'not-required', 'not-required'],
  ['Encryption (at rest & transit)', 'CMK', 'PMK', 'PMK', 'PMK', 'not-required'],
  ['Access Controls', 'RBAC + Conditional Access', 'RBAC', 'RBAC', 'as-required', 'not-required'],
]

const defaultTestingRows: string[][] = [
  ['Failover Test', 'Quarterly', 'Semi-annually', 'Annually (optional)', 'not-required', 'not-required'],
  ['Recovery Test', 'Quarterly', 'Semi-annually', 'Annually (optional)', 'not-required', 'not-required'],
  ['Load Test', 'Monthly', 'Quarterly', 'as-required', 'not-required', 'not-required'],
  ['Chaos Test', 'Monthly', 'Semi-annually (optional)', 'not-required', 'not-required', 'not-required'],
  ['Penetration Test', 'Annually', 'Annually', 'as-required', 'not-required', 'not-required'],
  ['UAT', 'Per release', 'Per release', 'Per release', 'as-required', 'not-required'],
  ['Contingency Test', 'Semi-annually', 'Annually (optional)', 'not-required', 'not-required', 'not-required'],
]

const bcmSections = [
  { key: 'general', storageKey: 'phase1_bcm_general', title: 'General Requirements', description: 'Core BCDR commitments including SLAs, recovery objectives, testing requirements, and planning documentation needed for each criticality tier.', defaultRows: defaultGeneralRows },
  { key: 'availability', storageKey: 'phase1_bcm_availability', title: 'Availability Requirements', description: 'Connectivity, network redundancy, availability architecture patterns, and application logic strategies to maintain uptime.', defaultRows: defaultAvailabilityRows },
  { key: 'recoverability', storageKey: 'phase1_bcm_recoverability', title: 'Recoverability Requirements', description: 'Backup retention policies, recovery architecture patterns, and cross-region replication strategies.', defaultRows: defaultRecoverabilityRows },
  { key: 'deployment', storageKey: 'phase1_bcm_deployment', title: 'Deployment Requirements', description: 'Infrastructure as Code, CI/CD pipelines, and advanced deployment strategies for consistent and rapid recovery.', defaultRows: defaultDeploymentRows },
  { key: 'monitoring', storageKey: 'phase1_bcm_monitoring', title: 'Monitoring Requirements', description: 'Metrics collection, alerting, dashboards, and log analytics for proactive issue detection and resolution.', defaultRows: defaultMonitoringRows },
  { key: 'security', storageKey: 'phase1_bcm_security', title: 'Security Control Requirements', description: 'DDoS protection, WAF, encryption standards, and access control policies to safeguard systems during and after disruptions.', defaultRows: defaultSecurityRows },
  { key: 'testing', storageKey: 'phase1_bcm_testing', title: 'Validation & Testing Requirements', description: 'Test types and frequencies per criticality tier to validate continuity readiness.', defaultRows: defaultTestingRows },
]

/* ────────────────────────────────────────────────────
   Fault Model data
   ──────────────────────────────────────────────────── */

interface FaultModelRow {
  type: string
  desc: string
  t1: string
  t2: string
  t3: string
}

const defaultFaultModelData: FaultModelRow[] = [
  { type: 'Zone Failure', desc: 'An Azure availability zone becomes unavailable', t1: 'Automatic failover to another zone; zone-redundant services', t2: 'Zone-redundant deployment; automatic failover', t3: 'Manual failover; restore from backup' },
  { type: 'Region Outage', desc: 'An entire Azure region becomes unavailable', t1: 'Active-Active multi-region; automatic traffic rerouting', t2: 'Active-Passive with automated failover to paired region', t3: 'Manual restore from geo-redundant backups' },
  { type: 'Service Degradation', desc: 'An Azure service is degraded but not unavailable', t1: 'Circuit breakers; automatic fallback to alternative services', t2: 'Retry logic with exponential backoff', t3: 'Manual monitoring and response' },
  { type: 'Data Corruption', desc: 'Application data is corrupted or accidentally deleted', t1: 'Point-in-time restore; cross-region replicated backups', t2: 'Automated backups with 30-day retention', t3: 'Daily backups with 14-day retention' },
  { type: 'Network Partition', desc: 'Network connectivity between components is disrupted', t1: 'ExpressRoute with redundant paths; automatic rerouting', t2: 'VPN with failover path', t3: 'Single VPN connection; manual intervention' },
  { type: 'DNS Failure', desc: 'DNS resolution fails or returns incorrect results', t1: 'Azure Traffic Manager with health probes; low TTL', t2: 'Azure DNS with failover configured', t3: 'Standard DNS; manual update on failure' },
  { type: 'Configuration Error', desc: 'Misconfiguration causes service disruption', t1: 'IaC with automated rollback; blue-green deployments', t2: 'IaC with CI/CD pipeline validation', t3: 'Manual configuration management' },
  { type: 'Dependency Failure', desc: 'A downstream service or third-party dependency fails', t1: 'Circuit breaker pattern; fallback services; queue-based load leveling', t2: 'Retry logic; graceful degradation', t3: 'Manual workaround procedures' },
]

/* ────────────────────────────────────────────────────
   RACI data
   ──────────────────────────────────────────────────── */

interface RaciState {
  roles: string[]
  tasks: { task: string; raci: string[] }[]
}

const defaultRaciData: RaciState = {
  roles: ['App Owner', 'Solution Architect', 'Cloud Engineer', 'Operations', 'Security', 'Compliance'],
  tasks: [
    { task: 'Define Criticality Model', raci: ['A', 'R', 'C', 'C', 'I', 'C'] },
    { task: 'Business Impact Analysis', raci: ['A', 'R', 'C', 'C', 'I', 'C'] },
    { task: 'Design BCDR Architecture', raci: ['I', 'A', 'R', 'C', 'C', 'I'] },
    { task: 'Implement DR Solution', raci: ['I', 'C', 'R', 'A', 'C', 'I'] },
    { task: 'Failover Testing', raci: ['I', 'C', 'R', 'A', 'I', 'I'] },
    { task: 'Monitoring & Alerting Setup', raci: ['I', 'C', 'R', 'A', 'I', 'I'] },
    { task: 'Security Controls Review', raci: ['I', 'C', 'C', 'I', 'A', 'R'] },
    { task: 'BCP Document', raci: ['A', 'C', 'I', 'C', 'C', 'R'] },
    { task: 'Outage Communication Plan', raci: ['A', 'C', 'I', 'R', 'I', 'I'] },
    { task: 'Contingency Planning', raci: ['A', 'R', 'C', 'C', 'I', 'C'] },
  ],
}

/* ────────────────────────────────────────────────────
   Application Requirements data
   ──────────────────────────────────────────────────── */

const defaultAppRequirementsData: [string, string, 'danger' | 'warning' | 'success'][] = [
  ['Availability', 'Target SLA / uptime percentage', 'danger'],
  ['Availability', 'Maximum tolerable downtime (MTD)', 'danger'],
  ['Availability', 'Required availability architecture pattern', 'danger'],
  ['Recovery', 'Recovery Time Objective (RTO)', 'danger'],
  ['Recovery', 'Recovery Point Objective (RPO)', 'danger'],
  ['Recovery', 'Backup retention period and frequency', 'warning'],
  ['Recovery', 'Cross-region replication requirements', 'warning'],
  ['Deployment', 'Infrastructure as Code requirements', 'warning'],
  ['Deployment', 'CI/CD pipeline requirements', 'warning'],
  ['Deployment', 'Deployment strategy (blue-green, canary)', 'success'],
  ['Monitoring', 'Key metrics to collect and monitor', 'danger'],
  ['Monitoring', 'Alerting thresholds and escalation paths', 'danger'],
  ['Monitoring', 'Dashboard requirements', 'warning'],
  ['Security', 'DDoS protection requirements', 'danger'],
  ['Security', 'Encryption requirements (at rest / in transit)', 'danger'],
  ['Security', 'Access control and authentication requirements', 'danger'],
  ['Compliance', 'Regulatory and compliance requirements', 'danger'],
  ['Compliance', 'Data residency and sovereignty constraints', 'warning'],
  ['Testing', 'Required test types and frequencies', 'warning'],
  ['Testing', 'Chaos engineering requirements', 'success'],
]

/* ────────────────────────────────────────────────────
   Test Plans data
   ──────────────────────────────────────────────────── */

const defaultTestPlansData: string[][] = [
  ['Production Redeployment', 'Full redeployment of production environment from IaC to validate infrastructure recovery', 'Quarterly'],
  ['Failover + Failback', 'Simulate primary region failure and verify automatic or manual failover, then failback to primary', 'Quarterly / Semi-annually'],
  ['Recovery Test', 'Restore application and data from backups to validate recovery procedures and time', 'Quarterly / Semi-annually'],
  ['Load Test', 'Simulate expected and peak traffic loads to verify performance under stress', 'Monthly / Quarterly'],
  ['Chaos Test', 'Introduce controlled failures (kill processes, network latency, disk fill) to test resilience', 'Monthly / Semi-annually'],
  ['Penetration Test', 'Authorized simulated attack to identify security vulnerabilities', 'Annually'],
  ['Smoke Test', 'Basic functional tests after deployment to confirm core features work', 'Per deployment'],
  ['UAT', 'User acceptance testing to validate business functionality meets requirements', 'Per release'],
  ['Contingency Test', 'Validate contingency plan procedures with stakeholders and operations team', 'Semi-annually / Annually'],
]

/* ────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────── */

const raciValues = ['R', 'A', 'C', 'I', '']
function cycleRaci(current: string): string {
  const idx = raciValues.indexOf(current)
  if (idx === -1) return 'R'
  return raciValues[(idx + 1) % raciValues.length]
}

const priorityValues: ('danger' | 'warning' | 'success')[] = ['danger', 'warning', 'success']
function cyclePriority(current: 'danger' | 'warning' | 'success'): 'danger' | 'warning' | 'success' {
  const idx = priorityValues.indexOf(current)
  return priorityValues[(idx + 1) % priorityValues.length]
}

/* ────────────────────────────────────────────────────
   BCM Sub-section component
   ──────────────────────────────────────────────────── */

function BcmSection({ storageKey, defaultRows, description, sectionKey }: { storageKey: string; defaultRows: string[][]; description: string; sectionKey: string }) {
  const styles = useStyles()
  const [rows, setRows, resetRows] = useWorkbenchData(storageKey, defaultRows)
  const [editingCell, setEditingCell] = useState<string | null>(null)

  const updateCell = (ri: number, ci: number, value: string) => {
    const updated = rows.map((row, r) => r === ri ? row.map((cell, c) => c === ci ? value : cell) : row)
    setRows(updated)
  }

  const addRow = () => {
    setRows([...rows, ['', 'as-required', 'as-required', 'as-required', 'as-required', 'as-required']])
  }

  const deleteRow = (ri: number) => {
    setRows(rows.filter((_, r) => r !== ri))
  }

  const handleCellClick = (ri: number, ci: number, value: string) => {
    if (ci === 0) {
      setEditingCell(`${storageKey}-${ri}-${ci}`)
    } else if (isStatusValue(value)) {
      updateCell(ri, ci, cycleStatus(value))
    } else {
      setEditingCell(`${storageKey}-${ri}-${ci}`)
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className={styles.subsectionDesc}>{description}</p>
        <div className={styles.headerActions}>
          <Button appearance="subtle" size="small" onClick={() => downloadCsv(`phase1-bcm-${sectionKey}.csv`, { name: 'BCM', headers: bcmHeaders, rows: rows.map(row => [row[0], ...row.slice(1).map(v => v === 'required' ? 'Required' : v === 'not-required' ? 'Not Required' : v === 'as-required' ? 'As Required' : v)]) })} icon={<ArrowDownload20Regular />}>Export CSV</Button>
          <Button appearance="subtle" size="small" onClick={() => downloadExcel({ name: `BCM - ${sectionKey}`, headers: bcmHeaders, rows: rows.map(row => [row[0], ...row.slice(1).map(v => v === 'required' ? 'Required' : v === 'not-required' ? 'Not Required' : v === 'as-required' ? 'As Required' : v)]) }, `phase1-bcm-${sectionKey}.xlsx`)} icon={<ArrowDownload20Regular />}>Export Excel</Button>
          <Button appearance="subtle" size="small" onClick={resetRows} icon={<ArrowReset20Regular />}>Reset</Button>
        </div>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {bcmHeaders.map((h, i) => (
                <th key={i} className={i === 0 ? styles.th : styles.thCenter}>{h}</th>
              ))}
              <th className={styles.thCenter} style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  const key = `${storageKey}-${ri}-${ci}`
                  const isEditing = editingCell === key
                  const baseClass = ci === 0 ? styles.td : styles.tdCenter
                  const hoverClass = ci === 0 ? styles.editableCell : styles.editableCellCenter
                  return (
                    <td key={ci} className={mergeClasses(baseClass, hoverClass)} onClick={() => !isEditing && handleCellClick(ri, ci, cell)}>
                      {isEditing ? (
                        <input
                          autoFocus
                          defaultValue={cell}
                          onBlur={(e) => { updateCell(ri, ci, e.target.value); setEditingCell(null) }}
                          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditingCell(null) }}
                          className={styles.cellInput}
                        />
                      ) : isStatusValue(cell) ? (
                        <StatusIcon value={cell} />
                      ) : (cell || '\u00A0')}
                    </td>
                  )
                })}
                <td className={styles.deleteCell}>
                  <Button appearance="subtle" size="small" icon={<Delete20Regular />} onClick={() => deleteRow(ri)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button appearance="subtle" size="small" className={styles.addRowButton} onClick={addRow} icon={<Add20Regular />}>Add Row</Button>
    </>
  )
}

/* ────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────── */

function Phase1Prepare() {
  const styles = useStyles()

  const [selectedTab, setSelectedTab] = useState<string>('concepts')

  const [criticalityRows, setCriticalityRows, resetCriticality] = useWorkbenchData('phase1_criticalityModel', defaultCriticalityData)
  const [impactColumns, setImpactColumns, resetImpactColumns] = useWorkbenchData('phase1_impactColumns', defaultImpactColumns)
  const [raciState, setRaciState, resetRaci] = useWorkbenchData('phase1_raci', defaultRaciData)
  const [appReqs, setAppReqs, resetAppReqs] = useWorkbenchData('phase1_appRequirements', defaultAppRequirementsData)
  const [testPlans, setTestPlans, resetTestPlans] = useWorkbenchData('phase1_testPlans', defaultTestPlansData)
  const [faultRows, setFaultRows, resetFault] = useWorkbenchData('phase1_faultModel', defaultFaultModelData)
  const [settings] = useWorkbenchData<{ planFocus?: PlanFocus }>('settings', { planFocus: 'bcdr' })

  const [editingCell, setEditingCell] = useState<string | null>(null)

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value as string)
  }

  const raciCellClass = (v: string) => {
    switch (v) {
      case 'R': return styles.raciR
      case 'A': return styles.raciA
      case 'C': return styles.raciC
      case 'I': return styles.raciI
      default: return styles.raciEmpty
    }
  }

  /* ── Criticality helpers ── */
  const updateCritField = (idx: number, field: 'tier' | 'criticality' | 'businessView' | 'financial' | 'color', value: string) => {
    setCriticalityRows(criticalityRows.map((row, i) => {
      if (i !== idx) return row
      const updated = { ...row, [field]: value }
      if (field === 'criticality') {
        updated.color = getCriticalityColor(value).color
      }
      return updated
    }))
  }
  const updateCritImpact = (rowIdx: number, colIdx: number, value: boolean) => {
    setCriticalityRows(criticalityRows.map((row, i) => i === rowIdx ? { ...row, impacts: row.impacts.map((v, j) => j === colIdx ? value : v) } : row))
  }
  const addCritRow = () => {
    setCriticalityRows([...criticalityRows, { tier: '', criticality: '', color: '#6c757d', businessView: '', financial: '', impacts: impactColumns.map(() => false) }])
  }
  const deleteCritRow = (idx: number) => {
    setCriticalityRows(criticalityRows.filter((_, i) => i !== idx))
  }
  const updateImpactColumnName = (idx: number, name: string) => {
    setImpactColumns(impactColumns.map((c: string, i: number) => i === idx ? name : c))
  }
  const addImpactColumn = () => {
    setImpactColumns([...impactColumns, 'New Column'])
    setCriticalityRows(criticalityRows.map(row => ({ ...row, impacts: [...row.impacts, false] })))
  }
  const removeImpactColumn = (idx: number) => {
    setImpactColumns(impactColumns.filter((_: string, i: number) => i !== idx))
    setCriticalityRows(criticalityRows.map(row => ({ ...row, impacts: row.impacts.filter((_: boolean, i: number) => i !== idx) })))
  }

  /* ── Fault model helpers ── */
  const updateFaultField = (idx: number, field: keyof FaultModelRow, value: string) => {
    setFaultRows(faultRows.map((row, i) => i === idx ? { ...row, [field]: value } : row))
  }
  const addFaultRow = () => {
    setFaultRows([...faultRows, { type: '', desc: '', t1: '', t2: '', t3: '' }])
  }
  const deleteFaultRow = (idx: number) => {
    setFaultRows(faultRows.filter((_, i) => i !== idx))
  }

  /* ── RACI helpers ── */
  const updateRaciRole = (idx: number, value: string) => {
    setRaciState({ ...raciState, roles: raciState.roles.map((r, i) => i === idx ? value : r) })
  }
  const updateRaciTask = (idx: number, value: string) => {
    setRaciState({ ...raciState, tasks: raciState.tasks.map((t, i) => i === idx ? { ...t, task: value } : t) })
  }
  const cycleRaciCell = (taskIdx: number, roleIdx: number) => {
    setRaciState({
      ...raciState,
      tasks: raciState.tasks.map((t, i) => i === taskIdx ? { ...t, raci: t.raci.map((v, j) => j === roleIdx ? cycleRaci(v) : v) } : t),
    })
  }
  const addRaciTask = () => {
    setRaciState({ ...raciState, tasks: [...raciState.tasks, { task: 'New Task', raci: raciState.roles.map(() => '') }] })
  }
  const deleteRaciTask = (idx: number) => {
    setRaciState({ ...raciState, tasks: raciState.tasks.filter((_, i) => i !== idx) })
  }

  /* ── App requirements helpers ── */
  const updateAppReq = (idx: number, colIdx: number, value: string) => {
    setAppReqs(appReqs.map((row, i) => {
      if (i !== idx) return row
      const newRow = [...row] as [string, string, 'danger' | 'warning' | 'success']
      if (colIdx === 2) newRow[2] = value as 'danger' | 'warning' | 'success'
      else if (colIdx === 0) newRow[0] = value
      else newRow[1] = value
      return newRow
    }))
  }
  const addAppReq = () => {
    setAppReqs([...appReqs, ['', '', 'warning']])
  }
  const deleteAppReq = (idx: number) => {
    setAppReqs(appReqs.filter((_, i) => i !== idx))
  }

  /* ── Test plans helpers ── */
  const updateTestPlan = (idx: number, colIdx: number, value: string) => {
    setTestPlans(testPlans.map((row, i) => i === idx ? row.map((c, ci) => ci === colIdx ? value : c) : row))
  }
  const addTestPlan = () => {
    setTestPlans([...testPlans, ['', '', '']])
  }
  const deleteTestPlan = (idx: number) => {
    setTestPlans(testPlans.filter((_, i) => i !== idx))
  }

  /* ── Editable cell helper ── */
  const editCell = (key: string, value: string, onSave: (v: string) => void, baseClass: string, extraStyle?: React.CSSProperties) => {
    const isEditing = editingCell === key
    const hoverClass = baseClass === styles.tdCenter ? styles.editableCellCenter : styles.editableCell
    return (
      <td className={mergeClasses(baseClass, hoverClass)} onClick={() => !isEditing && setEditingCell(key)} style={extraStyle}>
        {isEditing ? (
          <input
            autoFocus
            defaultValue={value}
            onBlur={(e) => { onSave(e.target.value); setEditingCell(null) }}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditingCell(null) }}
            className={styles.cellInput}
          />
        ) : (value || '\u00A0')}
      </td>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Phase 1: Prepare</h1>
      <p className={styles.description}>
        This phase covers fundamental BCDR concepts and provides structured
        templates for assessing business continuity. Build your foundation with
        criticality models, business commitment frameworks, and essential
        planning artifacts.
      </p>

      <TabList selectedValue={selectedTab} onTabSelect={onTabSelect} appearance="subtle" size="large">
        <Tab value="concepts" style={{ opacity: isInScope(phase1TabRelevance['concepts'] || 'bcdr', settings.planFocus || 'bcdr') ? 1 : 0.45 }}>
          Concepts
          {(settings.planFocus || 'bcdr') !== 'bcdr' && (
            <Badge size="small" appearance="outline" color={isInScope(phase1TabRelevance['concepts'] || 'bcdr', settings.planFocus || 'bcdr') ? 'brand' : 'informative'} style={{ marginLeft: '6px', fontSize: '10px' }}>
              {relevanceLabel(phase1TabRelevance['concepts'] || 'bcdr')}
            </Badge>
          )}
        </Tab>
        <Tab value="criticality" style={{ opacity: isInScope(phase1TabRelevance['criticality'] || 'bcdr', settings.planFocus || 'bcdr') ? 1 : 0.45 }}>
          Criticality Model
          {(settings.planFocus || 'bcdr') !== 'bcdr' && (
            <Badge size="small" appearance="outline" color={isInScope(phase1TabRelevance['criticality'] || 'bcdr', settings.planFocus || 'bcdr') ? 'brand' : 'informative'} style={{ marginLeft: '6px', fontSize: '10px' }}>
              {relevanceLabel(phase1TabRelevance['criticality'] || 'bcdr')}
            </Badge>
          )}
        </Tab>
        <Tab value="bcm" style={{ opacity: isInScope(phase1TabRelevance['bcm'] || 'bcdr', settings.planFocus || 'bcdr') ? 1 : 0.45 }}>
          Business Commitment
          {(settings.planFocus || 'bcdr') !== 'bcdr' && (
            <Badge size="small" appearance="outline" color={isInScope(phase1TabRelevance['bcm'] || 'bcdr', settings.planFocus || 'bcdr') ? 'brand' : 'informative'} style={{ marginLeft: '6px', fontSize: '10px' }}>
              {relevanceLabel(phase1TabRelevance['bcm'] || 'bcdr')}
            </Badge>
          )}
        </Tab>
        <Tab value="faultModel" style={{ opacity: isInScope(phase1TabRelevance['faultModel'] || 'bcdr', settings.planFocus || 'bcdr') ? 1 : 0.45 }}>
          Fault Model
          {(settings.planFocus || 'bcdr') !== 'bcdr' && (
            <Badge size="small" appearance="outline" color={isInScope(phase1TabRelevance['faultModel'] || 'bcdr', settings.planFocus || 'bcdr') ? 'brand' : 'informative'} style={{ marginLeft: '6px', fontSize: '10px' }}>
              {relevanceLabel(phase1TabRelevance['faultModel'] || 'bcdr')}
            </Badge>
          )}
        </Tab>
        <Tab value="raci" style={{ opacity: isInScope(phase1TabRelevance['raci'] || 'bcdr', settings.planFocus || 'bcdr') ? 1 : 0.45 }}>
          RACI Matrix
          {(settings.planFocus || 'bcdr') !== 'bcdr' && (
            <Badge size="small" appearance="outline" color={isInScope(phase1TabRelevance['raci'] || 'bcdr', settings.planFocus || 'bcdr') ? 'brand' : 'informative'} style={{ marginLeft: '6px', fontSize: '10px' }}>
              {relevanceLabel(phase1TabRelevance['raci'] || 'bcdr')}
            </Badge>
          )}
        </Tab>
        <Tab value="requirements" style={{ opacity: isInScope(phase1TabRelevance['requirements'] || 'bcdr', settings.planFocus || 'bcdr') ? 1 : 0.45 }}>
          Requirements
          {(settings.planFocus || 'bcdr') !== 'bcdr' && (
            <Badge size="small" appearance="outline" color={isInScope(phase1TabRelevance['requirements'] || 'bcdr', settings.planFocus || 'bcdr') ? 'brand' : 'informative'} style={{ marginLeft: '6px', fontSize: '10px' }}>
              {relevanceLabel(phase1TabRelevance['requirements'] || 'bcdr')}
            </Badge>
          )}
        </Tab>
        <Tab value="testPlans" style={{ opacity: isInScope(phase1TabRelevance['testPlans'] || 'bcdr', settings.planFocus || 'bcdr') ? 1 : 0.45 }}>
          Test Plans
          {(settings.planFocus || 'bcdr') !== 'bcdr' && (
            <Badge size="small" appearance="outline" color={isInScope(phase1TabRelevance['testPlans'] || 'bcdr', settings.planFocus || 'bcdr') ? 'brand' : 'informative'} style={{ marginLeft: '6px', fontSize: '10px' }}>
              {relevanceLabel(phase1TabRelevance['testPlans'] || 'bcdr')}
            </Badge>
          )}
        </Tab>
      </TabList>

      {(settings.planFocus || 'bcdr') !== 'bcdr' && !isInScope(phase1TabRelevance[selectedTab] || 'bcdr', settings.planFocus || 'bcdr') && (
        <div style={{ backgroundColor: '#FFF4CE', border: '1px solid #FFD700', borderRadius: '4px', padding: '8px 16px', marginTop: '12px', fontSize: '14px', color: '#6B5900' }}>
          This section is primarily for {phase1TabRelevance[selectedTab] === 'dr' ? 'Disaster Recovery' : phase1TabRelevance[selectedTab] === 'bc' ? 'Business Continuity' : 'BCDR'} planning and may not be required for your current plan focus.
        </div>
      )}

      <div className={styles.tabContent}>
        {/* ── Concepts (read-only) ── */}
        {selectedTab === 'concepts' && (
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
                    <ul className={styles.list}>
                      <li><strong>Microsoft&apos;s responsibility:</strong> Physical infrastructure, host OS, network controls, datacenter physical security</li>
                      <li><strong>Customer&apos;s responsibility:</strong> Data, endpoints, account &amp; access management, application-level resilience</li>
                      <li><strong>Shared:</strong> Identity &amp; directory infrastructure, application-level controls, network controls (varies by service model)</li>
                    </ul>
                  </div>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem value="design-patterns">
                <AccordionHeader>Design Patterns</AccordionHeader>
                <AccordionPanel>
                  <div className={styles.content}>
                    Common architectural patterns for achieving high availability
                    and disaster recovery in Azure:
                    <ul className={styles.list}>
                      <li><strong>Active-Active:</strong> Multiple instances serve traffic simultaneously across regions or zones</li>
                      <li><strong>Active-Passive:</strong> Standby instance ready to take over when the primary fails</li>
                      <li><strong>Multi-region deployment:</strong> Services deployed across Azure region pairs for geographic resilience</li>
                      <li><strong>Availability zones:</strong> Physically separate locations within a region for zone-level fault isolation</li>
                      <li><strong>Backup and restore:</strong> Regular backups with tested recovery procedures for data protection</li>
                    </ul>
                  </div>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem value="reliability-tradeoffs">
                <AccordionHeader>Reliability Trade-offs</AccordionHeader>
                <AccordionPanel>
                  <div className={styles.content}>
                    Balance business requirements with technical and financial
                    constraints. Every increase in reliability comes with cost and
                    complexity trade-offs:
                    <ul className={styles.list}>
                      <li><strong>Cost vs. availability:</strong> Moving from 99.9% to 99.999% can increase costs significantly</li>
                      <li><strong>Performance vs. resilience:</strong> Synchronous replication provides better RPO but adds latency</li>
                      <li><strong>Complexity vs. recoverability:</strong> Multi-region architectures improve DR but increase operational complexity</li>
                      <li><strong>RTO/RPO vs. implementation effort:</strong> Near-zero RTO/RPO requires Active-Active patterns and continuous replication</li>
                    </ul>
                  </div>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* ── Criticality Model ── */}
        {selectedTab === 'criticality' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionHeaderTitle}>Criticality Model</h2>
              <div className={styles.headerActions}>
                <Button appearance="subtle" size="small" onClick={() => downloadCsv('phase1-criticality-model.csv', { name: 'Criticality Model', headers: ['Tier', 'Criticality', 'Business View', 'Financial', ...impactColumns], rows: criticalityRows.map(row => [row.tier, row.criticality, row.businessView, row.financial, ...row.impacts.map(v => v ? 'Yes' : 'No')]) })} icon={<ArrowDownload20Regular />}>Export CSV</Button>
                <Button appearance="subtle" size="small" onClick={() => downloadExcel({ name: 'Criticality Model', headers: ['Tier', 'Criticality', 'Business View', 'Financial', ...impactColumns], rows: criticalityRows.map(row => [row.tier, row.criticality, row.businessView, row.financial, ...row.impacts.map(v => v ? 'Yes' : 'No')]) }, 'phase1-criticality-model.xlsx')} icon={<ArrowDownload20Regular />}>Export Excel</Button>
                <Button appearance="subtle" size="small" onClick={() => { resetCriticality(); resetImpactColumns() }} icon={<ArrowReset20Regular />}>Reset</Button>
              </div>
            </div>
            <p className={styles.subsectionDesc}>
              Classify applications based on business impact using a criticality
              scale. This model helps prioritize investment in BCDR capabilities by
              directing resources to the most critical systems first.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Tier</th>
                    <th className={styles.th}>Criticality</th>
                    <th className={styles.th} style={{ whiteSpace: 'normal' }}>Business View</th>
                    <th className={styles.thCenter}>Financial</th>
                    {impactColumns.map((col: string, ci: number) => {
                      const key = `impact-col-${ci}`
                      const isEditing = editingCell === key
                      return (
                        <th key={ci} className={mergeClasses(styles.thCenter, styles.editableCellCenter)} onClick={() => !isEditing && setEditingCell(key)}>
                          {isEditing ? (
                            <input autoFocus defaultValue={col}
                              onBlur={(e) => { updateImpactColumnName(ci, e.target.value); setEditingCell(null) }}
                              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditingCell(null) }}
                              className={styles.cellInput} />
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                              {col}
                              <Button appearance="subtle" size="small" icon={<Delete20Regular />}
                                onClick={(e) => { e.stopPropagation(); removeImpactColumn(ci) }}
                                style={{ minWidth: 'auto', padding: '0' }} />
                            </span>
                          )}
                        </th>
                      )
                    })}
                    <th className={styles.thCenter} style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {criticalityRows.map((row, i) => {
                    const badgeKey = `crit-${i}-badge`
                    const isBadgeEditing = editingCell === badgeKey
                    return (
                      <tr key={i}>
                        {editCell(`crit-${i}-tier`, row.tier, (v) => updateCritField(i, 'tier', v), styles.td)}
                        <td
                          className={mergeClasses(styles.td, styles.editableCell)}
                          onClick={() => !isBadgeEditing && setEditingCell(badgeKey)}
                        >
                          {isBadgeEditing ? (
                            <select
                              autoFocus
                              value={row.criticality}
                              onChange={(e) => { updateCritField(i, 'criticality', e.target.value); setEditingCell(null) }}
                              onBlur={() => setEditingCell(null)}
                              className={styles.cellInput}
                              style={{ minWidth: '160px' }}
                            >
                              <option value="">-- Select --</option>
                              {getCriticalityOptions().map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          ) : (
                            <Badge
                              appearance="filled"
                              style={{
                                backgroundColor: row.color,
                                color: row.color === '#ffc107' ? '#1a1a1a' : '#fff',
                              }}
                            >
                              {row.criticality || '\u00A0'}
                            </Badge>
                          )}
                        </td>
                        {editCell(`crit-${i}-bv`, row.businessView, (v) => updateCritField(i, 'businessView', v), styles.td)}
                        {editCell(`crit-${i}-fin`, row.financial, (v) => updateCritField(i, 'financial', v), styles.tdCenter)}
                        {row.impacts.map((val, ci) => (
                          <td key={ci} className={styles.tdCenter}>
                            <Checkbox checked={val} onChange={(_, data) => updateCritImpact(i, ci, !!data.checked)} />
                          </td>
                        ))}
                        <td className={styles.deleteCell}>
                          <Button appearance="subtle" size="small" icon={<Delete20Regular />} onClick={() => deleteCritRow(i)} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Button appearance="subtle" size="small" className={styles.addRowButton} onClick={addCritRow} icon={<Add20Regular />}>Add Row</Button>
            <Button appearance="subtle" size="small" onClick={addImpactColumn} icon={<Add20Regular />}>Add Column</Button>
          </div>
        )}

        {/* ── Business Commitment Model ── */}
        {selectedTab === 'bcm' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Business Commitment Model</h2>
            <p className={styles.subsectionDesc}>
              Define commitments for each criticality level across multiple
              dimensions to ensure comprehensive, tailored BCDR planning. Each
              sub-section maps requirements per criticality tier.
            </p>
            <div className={styles.legend}>
              <div className={styles.legendItem}><Checkmark16Filled style={{ color: '#28a745' }} /> Required</div>
              <div className={styles.legendItem}><Dismiss16Filled style={{ color: '#dc3545' }} /> Not Required</div>
              <div className={styles.legendItem}><Subtract16Filled style={{ color: '#fd7e14' }} /> As Required</div>
            </div>
            <Accordion collapsible multiple>
              {bcmSections.map((section) => (
                <AccordionItem key={section.key} value={section.key}>
                  <AccordionHeader>{section.title}</AccordionHeader>
                  <AccordionPanel>
                    <BcmSection storageKey={section.storageKey} defaultRows={section.defaultRows} description={section.description} sectionKey={section.key} />
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* ── Fault Model & Resilience Strategies ── */}
        {selectedTab === 'faultModel' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionHeaderTitle}>Fault Model &amp; Resilience Strategies</h2>
              <div className={styles.headerActions}>
                <Button appearance="subtle" size="small" onClick={() => downloadCsv('phase1-fault-model.csv', { name: 'Fault Model', headers: ['Failure Type', 'Description', 'Tier 1 Strategy', 'Tier 2 Strategy', 'Tier 3-5 Strategy'], rows: faultRows.map(row => [row.type, row.desc, row.t1, row.t2, row.t3]) })} icon={<ArrowDownload20Regular />}>Export CSV</Button>
                <Button appearance="subtle" size="small" onClick={() => downloadExcel({ name: 'Fault Model', headers: ['Failure Type', 'Description', 'Tier 1 Strategy', 'Tier 2 Strategy', 'Tier 3-5 Strategy'], rows: faultRows.map(row => [row.type, row.desc, row.t1, row.t2, row.t3]) }, 'phase1-fault-model.xlsx')} icon={<ArrowDownload20Regular />}>Export Excel</Button>
                <Button appearance="subtle" size="small" onClick={resetFault} icon={<ArrowReset20Regular />}>Reset</Button>
              </div>
            </div>
            <p className={styles.subsectionDesc}>
              Define common failure types with pre-approved mitigation strategies
              for each criticality tier. This simplifies business commitment models
              and BCDR solution design.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Failure Type</th>
                    <th className={styles.th} style={{ whiteSpace: 'normal' }}>Description</th>
                    <th className={styles.th} style={{ whiteSpace: 'normal' }}>Tier 1 Strategy</th>
                    <th className={styles.th} style={{ whiteSpace: 'normal' }}>Tier 2 Strategy</th>
                    <th className={styles.th} style={{ whiteSpace: 'normal' }}>Tier 3{'\u2013'}5 Strategy</th>
                    <th className={styles.thCenter} style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {faultRows.map((row, i) => (
                    <tr key={i}>
                      {editCell(`fault-${i}-type`, row.type, (v) => updateFaultField(i, 'type', v), styles.td, { fontWeight: 600 })}
                      {editCell(`fault-${i}-desc`, row.desc, (v) => updateFaultField(i, 'desc', v), styles.td)}
                      {editCell(`fault-${i}-t1`, row.t1, (v) => updateFaultField(i, 't1', v), styles.td)}
                      {editCell(`fault-${i}-t2`, row.t2, (v) => updateFaultField(i, 't2', v), styles.td)}
                      {editCell(`fault-${i}-t3`, row.t3, (v) => updateFaultField(i, 't3', v), styles.td)}
                      <td className={styles.deleteCell}>
                        <Button appearance="subtle" size="small" icon={<Delete20Regular />} onClick={() => deleteFaultRow(i)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button appearance="subtle" size="small" className={styles.addRowButton} onClick={addFaultRow} icon={<Add20Regular />}>Add Row</Button>
          </div>
        )}

        {/* ── RACI Matrix ── */}
        {selectedTab === 'raci' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionHeaderTitle}>RACI Matrix</h2>
              <div className={styles.headerActions}>
                <Button appearance="subtle" size="small" onClick={() => downloadCsv('phase1-raci-matrix.csv', { name: 'RACI Matrix', headers: ['Task', ...raciState.roles], rows: raciState.tasks.map(t => [t.task, ...t.raci]) })} icon={<ArrowDownload20Regular />}>Export CSV</Button>
                <Button appearance="subtle" size="small" onClick={() => downloadRaciExcel({ roles: raciState.roles, tasks: raciState.tasks })} icon={<ArrowDownload20Regular />}>Export Excel</Button>
                <Button appearance="subtle" size="small" onClick={resetRaci} icon={<ArrowReset20Regular />}>Reset</Button>
              </div>
            </div>
            <p className={styles.subsectionDesc}>
              Clarify roles and responsibilities for BCDR tasks. Use this template
              to define both application and organization-level roles.
            </p>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: '#003366' }} />
                <strong>R</strong> &mdash; Responsible
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: '#336699' }} />
                <strong>A</strong> &mdash; Accountable
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: '#6699CC' }} />
                <strong>C</strong> &mdash; Consulted
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: '#99CCFF' }} />
                <strong>I</strong> &mdash; Informed
              </div>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Task</th>
                    {raciState.roles.map((role, ri) => {
                      const key = `raci-role-${ri}`
                      const isEditing = editingCell === key
                      return (
                        <th key={ri} className={mergeClasses(styles.thCenter, styles.editableCellCenter)} onClick={() => !isEditing && setEditingCell(key)}>
                          {isEditing ? (
                            <input
                              autoFocus
                              defaultValue={role}
                              onBlur={(e) => { updateRaciRole(ri, e.target.value); setEditingCell(null) }}
                              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditingCell(null) }}
                              className={styles.cellInput}
                            />
                          ) : role}
                        </th>
                      )
                    })}
                    <th className={styles.thCenter} style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {raciState.tasks.map((row, ti) => (
                    <tr key={ti}>
                      {editCell(`raci-task-${ti}`, row.task, (v) => updateRaciTask(ti, v), styles.td, { fontWeight: 600 })}
                      {row.raci.map((val, ri) => (
                        <td key={ri} className={mergeClasses(raciCellClass(val), styles.editableCellCenter)} onClick={() => cycleRaciCell(ti, ri)} style={{ cursor: 'pointer' }}>
                          {val}
                        </td>
                      ))}
                      <td className={styles.deleteCell}>
                        <Button appearance="subtle" size="small" icon={<Delete20Regular />} onClick={() => deleteRaciTask(ti)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button appearance="subtle" size="small" className={styles.addRowButton} onClick={addRaciTask} icon={<Add20Regular />}>Add Task</Button>
          </div>
        )}

        {/* ── Application Requirements Template ── */}
        {selectedTab === 'requirements' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionHeaderTitle}>Application Requirements Template</h2>
              <div className={styles.headerActions}>
                <Button appearance="subtle" size="small" onClick={() => downloadCsv('phase1-requirements.csv', { name: 'Requirements', headers: ['Category', 'Requirement', 'Priority'], rows: appReqs.map(([cat, req, pri]) => [cat, req, pri === 'danger' ? 'High' : pri === 'warning' ? 'Medium' : 'Low']) })} icon={<ArrowDownload20Regular />}>Export CSV</Button>
                <Button appearance="subtle" size="small" onClick={() => downloadExcel({ name: 'Requirements', headers: ['Category', 'Requirement', 'Priority'], rows: appReqs.map(([cat, req, pri]) => [cat, req, pri === 'danger' ? 'High' : pri === 'warning' ? 'Medium' : 'Low']) }, 'phase1-requirements.xlsx')} icon={<ArrowDownload20Regular />}>Export Excel</Button>
                <Button appearance="subtle" size="small" onClick={resetAppReqs} icon={<ArrowReset20Regular />}>Reset</Button>
              </div>
            </div>
            <Card className={styles.card}>
              <div className={styles.cardTitle}>BCDR Requirements Gathering</div>
              <div className={styles.content}>
                Use this template during stakeholder workshops to gather BCDR
                requirements for each application. Responses feed into the Business
                Commitment Model and downstream planning templates.
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Category</th>
                      <th className={styles.th}>Requirement</th>
                      <th className={styles.thCenter}>Priority</th>
                      <th className={styles.thCenter} style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {appReqs.map(([cat, req, pri], i) => (
                      <tr key={i}>
                        {editCell(`req-${i}-cat`, cat, (v) => updateAppReq(i, 0, v), styles.td, { fontWeight: 600 })}
                        {editCell(`req-${i}-req`, req, (v) => updateAppReq(i, 1, v), styles.td)}
                        <td className={mergeClasses(styles.tdCenter, styles.editableCellCenter)} onClick={() => updateAppReq(i, 2, cyclePriority(pri))}>
                          <Badge appearance="filled" color={pri}>
                            {pri === 'danger' ? 'High' : pri === 'warning' ? 'Medium' : 'Low'}
                          </Badge>
                        </td>
                        <td className={styles.deleteCell}>
                          <Button appearance="subtle" size="small" icon={<Delete20Regular />} onClick={() => deleteAppReq(i)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button appearance="subtle" size="small" className={styles.addRowButton} onClick={addAppReq} icon={<Add20Regular />}>Add Requirement</Button>
            </Card>
          </div>
        )}

        {/* ── Test Plans Template ── */}
        {selectedTab === 'testPlans' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionHeaderTitle}>Test Plans Template</h2>
              <div className={styles.headerActions}>
                <Button appearance="subtle" size="small" onClick={() => downloadCsv('phase1-test-plans.csv', { name: 'Test Plans', headers: ['Test Type', 'Description', 'Typical Frequency'], rows: testPlans.map(row => [row[0], row[1], row[2]]) })} icon={<ArrowDownload20Regular />}>Export CSV</Button>
                <Button appearance="subtle" size="small" onClick={() => downloadExcel({ name: 'Test Plans', headers: ['Test Type', 'Description', 'Typical Frequency'], rows: testPlans.map(row => [row[0], row[1], row[2]]) }, 'phase1-test-plans.xlsx')} icon={<ArrowDownload20Regular />}>Export Excel</Button>
                <Button appearance="subtle" size="small" onClick={resetTestPlans} icon={<ArrowReset20Regular />}>Reset</Button>
              </div>
            </div>
            <Card className={styles.card}>
              <div className={styles.cardTitle}>BCDR Test Planning</div>
              <div className={styles.content}>
                Define testing strategies for each application based on criticality
                level and business commitment.
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Test Type</th>
                      <th className={styles.th} style={{ whiteSpace: 'normal' }}>Description</th>
                      <th className={styles.thCenter}>Typical Frequency</th>
                      <th className={styles.thCenter} style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {testPlans.map((row, i) => (
                      <tr key={i}>
                        {editCell(`test-${i}-type`, row[0], (v) => updateTestPlan(i, 0, v), styles.td, { fontWeight: 600 })}
                        {editCell(`test-${i}-desc`, row[1], (v) => updateTestPlan(i, 1, v), styles.td)}
                        {editCell(`test-${i}-freq`, row[2], (v) => updateTestPlan(i, 2, v), styles.tdCenter)}
                        <td className={styles.deleteCell}>
                          <Button appearance="subtle" size="small" icon={<Delete20Regular />} onClick={() => deleteTestPlan(i)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button appearance="subtle" size="small" className={styles.addRowButton} onClick={addTestPlan} icon={<Add20Regular />}>Add Test</Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Phase1Prepare
