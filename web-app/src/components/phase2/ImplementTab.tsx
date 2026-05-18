import { useState, useMemo, useEffect, useRef } from 'react'
import {
  makeStyles, shorthands, mergeClasses, tokens,
  Badge, Button,
} from '@fluentui/react-components'
import {
  Checkmark16Filled,
  Add20Regular, Delete20Regular, ArrowReset20Regular, ArrowDownload20Regular,
  ArrowUp20Regular, ArrowDown20Regular,
} from '@fluentui/react-icons'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import { useWorkbenchData } from '../../hooks/useWorkbenchData'
import { downloadCsv, objectsToCsvSheet } from '../../utils/csvExport'
import FaultTree from './FaultTree'

/* ═══════ Styles ═══════ */

const useStyles = makeStyles({
  section: { marginBottom: '32px' },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' },
  sectionTitle: { fontSize: '20px', fontWeight: '600', color: tokens.colorNeutralForeground1 },
  desc: { marginBottom: '14px', lineHeight: '1.6', color: tokens.colorNeutralForeground2, fontSize: '14px' },
  tableWrap: { overflowX: 'auto', marginBottom: '12px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', lineHeight: '1.4' },
  th: { backgroundColor: tokens.colorNeutralBackground3, fontWeight: '600', textAlign: 'left', ...shorthands.padding('8px', '10px'), borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: tokens.colorNeutralStroke1, whiteSpace: 'nowrap' },
  thC: { backgroundColor: tokens.colorNeutralBackground3, fontWeight: '600', textAlign: 'center', ...shorthands.padding('8px', '10px'), borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: tokens.colorNeutralStroke1 },
  thW: { backgroundColor: tokens.colorNeutralBackground3, fontWeight: '600', textAlign: 'left', ...shorthands.padding('8px', '10px'), borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: tokens.colorNeutralStroke1, whiteSpace: 'normal' },
  td: { ...shorthands.padding('8px', '10px'), borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: tokens.colorNeutralStroke2, verticalAlign: 'top' },
  tdC: { ...shorthands.padding('8px', '10px'), borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: tokens.colorNeutralStroke2, textAlign: 'center', verticalAlign: 'middle' },
  edit: { cursor: 'pointer', ':hover': { backgroundColor: '#EBF5FF' } },
  editC: { cursor: 'pointer', textAlign: 'center' as const, ':hover': { backgroundColor: '#EBF5FF' } },
  inp: { width: '100%', ...shorthands.borderWidth('0'), ...shorthands.padding('4px'), fontSize: '13px', fontFamily: 'inherit', backgroundColor: '#fff', outlineWidth: '2px', outlineStyle: 'solid', outlineColor: tokens.colorBrandStroke1, ...shorthands.borderRadius('2px') },
  del: { ...shorthands.padding('4px', '6px'), borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: tokens.colorNeutralStroke2, textAlign: 'center', verticalAlign: 'middle', width: '36px' },
  chart: { ...shorthands.padding('16px'), backgroundColor: '#fff', ...shorthands.borderRadius('8px'), ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2), marginBottom: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginBottom: '14px' },
  metric: { ...shorthands.padding('14px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('8px'), textAlign: 'center' },
  metricVal: { fontSize: '22px', fontWeight: '700', color: tokens.colorBrandForeground1 },
  metricLbl: { fontSize: '12px', color: tokens.colorNeutralForeground3, marginTop: '3px' },
  note: { ...shorthands.padding('10px', '14px'), backgroundColor: '#f8f9fa', ...shorthands.borderRadius('8px'), marginBottom: '12px', fontSize: '13px', lineHeight: '1.5', color: tokens.colorNeutralForeground3 },
  step: { display: 'flex', alignItems: 'flex-start', gap: '8px', ...shorthands.padding('8px', '10px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('6px'), marginBottom: '6px', fontSize: '13px' },
  stepActions: { display: 'flex', gap: '2px', marginLeft: 'auto', flexShrink: 0 },
})

/* ═══════ Data types ═══════ */

interface ResponseRow { scope: string; availability: string; recoverability: string; resources: string; continuity: string; preparation: string }
interface DesignRow { component: string; category: string; sla: string; ha: string; dr: string; remediation: string; status: 'met' | 'new' }
interface CostRow { component: string; currentCost: number; bcdrCost: number }
interface MetricRow { component: string; beforeAvail: string; afterAvail: string; beforeRel: string; afterRel: string; beforeSec: string; afterSec: string }
interface RoleRow { role: string; name: string; team: string; responsibility: string; escalation: string }
interface RunbookStep { action: string; owner: string; validation: string }
interface SeverityRow { severity: string; description: string; example: string; declaration: string; stakeholders: string }
interface CommRow { audience: string; channel: string; frequency: string; template: string; owner: string }

/* ═══════ Defaults ═══════ */

const SCOPE_COLORS = ['#1a237e','#283593','#303f9f','#3949ab','#3f51b5','#5c6bc0']

const defaultResponse: ResponseRow[] = [
  { scope: 'Global', availability: 'None', recoverability: 'Redeploy, Restore', resources: 'Service Providers, Authorities, IT Support', continuity: 'Contingency Plan', preparation: 'Board signoff; Communication plan; Contingency plan validation; Redeploy testing' },
  { scope: 'Azure Geography', availability: 'None', recoverability: 'Redeploy, Restore (manual)', resources: 'Service Providers, Authorities, IT Support', continuity: 'Contingency Plan', preparation: 'Board signoff; Communication plan; Contingency plan validation; Redeploy testing' },
  { scope: 'Azure Region', availability: 'Failover to secondary region (automated)', recoverability: 'Restore (manual)', resources: 'IT Support, Vendor', continuity: 'Failover Plan, Recovery Plan', preparation: 'App Business Owner signoff; Communication plan; Failover testing; Recovery testing' },
  { scope: 'Azure Zone', availability: 'Failover between zones (automated)', recoverability: 'Restore (manual)', resources: 'Service Providers, IT Support', continuity: 'Failover Plan, Recovery Plan', preparation: 'App Business Owner signoff; Communication plan; Failover testing; Recovery testing' },
  { scope: 'Azure Service Instance', availability: 'None', recoverability: 'Restore (manual)', resources: 'Service Providers, IT Support', continuity: 'Failover Plan, Recovery Plan', preparation: 'App Business Owner signoff; Communication plan; Failover testing; Recovery testing' },
  { scope: 'Data Integrity Issue', availability: 'N/A', recoverability: 'Restore (manual)', resources: 'Service Providers, IT Support', continuity: 'Recovery Plan', preparation: 'App Business Owner signoff; Communication plan; Recovery testing' },
]

const defaultDesign: DesignRow[] = [
  { component: 'Microsoft Entra ID', category: 'Identity', sla: '99.99%', ha: 'Global redundancy', dr: '\u2014', remediation: 'No change required', status: 'met' },
  { component: 'Azure DNS', category: 'Networking', sla: '100%', ha: 'Global anycast', dr: '\u2014', remediation: 'No change required', status: 'met' },
  { component: 'Azure Front Door', category: 'Networking', sla: '99.99%', ha: 'Global LB', dr: '\u2014', remediation: 'No change required', status: 'met' },
  { component: 'App Service Plan', category: 'Compute', sla: '99.95%', ha: 'Zone-redundant + secondary', dr: 'Active-passive failover', remediation: 'Deploy to secondary region', status: 'new' },
  { component: 'Azure SQL Database', category: 'Data', sla: '99.995%', ha: 'Zone redundant', dr: 'Active geo-replication', remediation: 'Enable geo-replication', status: 'new' },
  { component: 'Azure Service Bus', category: 'Messaging', sla: '99.9%', ha: 'Zone redundant', dr: 'Geo-DR pairing', remediation: 'Configure geo-DR namespace', status: 'new' },
  { component: 'Azure Cache', category: 'Cache', sla: '99.9%', ha: 'Premium + zone', dr: 'Geo-replication', remediation: 'Upgrade to Premium', status: 'new' },
  { component: 'Storage Account', category: 'Storage', sla: '99.99%', ha: 'ZRS', dr: 'GZRS', remediation: 'Migrate LRS to GZRS', status: 'new' },
  { component: 'Azure Key Vault', category: 'Security', sla: '99.99%', ha: 'Zone redundant', dr: 'Managed replication', remediation: 'No change required', status: 'met' },
  { component: 'Application Insights', category: 'Monitoring', sla: '99.9%', ha: 'Regional', dr: '\u2014', remediation: 'No change required', status: 'met' },
]

const defaultCost: CostRow[] = [
  { component: 'App Service Plan', currentCost: 500, bcdrCost: 1000 },
  { component: 'Azure SQL Database', currentCost: 800, bcdrCost: 1200 },
  { component: 'Azure Cache', currentCost: 300, bcdrCost: 600 },
  { component: 'Azure Service Bus', currentCost: 150, bcdrCost: 225 },
  { component: 'Storage Account', currentCost: 50, bcdrCost: 75 },
  { component: 'Azure Front Door', currentCost: 200, bcdrCost: 200 },
  { component: 'Key Vault', currentCost: 10, bcdrCost: 10 },
  { component: 'Application Insights', currentCost: 100, bcdrCost: 100 },
]

const defaultMetrics: MetricRow[] = [
  { component: 'App Service', beforeAvail: '99.95', afterAvail: '99.99', beforeRel: '95', afterRel: '99', beforeSec: '80', afterSec: '92' },
  { component: 'Azure SQL', beforeAvail: '99.99', afterAvail: '99.995', beforeRel: '98', afterRel: '99.5', beforeSec: '90', afterSec: '95' },
  { component: 'Redis Cache', beforeAvail: '99.9', afterAvail: '99.95', beforeRel: '90', afterRel: '97', beforeSec: '75', afterSec: '90' },
  { component: 'Service Bus', beforeAvail: '99.9', afterAvail: '99.95', beforeRel: '92', afterRel: '98', beforeSec: '85', afterSec: '92' },
  { component: 'Storage', beforeAvail: '99.9', afterAvail: '99.99', beforeRel: '95', afterRel: '99', beforeSec: '80', afterSec: '90' },
]

const defaultContingency = [
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

const defaultRoles: RoleRow[] = [
  { role: 'Incident Commander', name: '', team: 'Operations', responsibility: 'Overall coordination and decision-making', escalation: 'CTO' },
  { role: 'Technical Lead', name: '', team: 'Engineering', responsibility: 'Technical response and root cause analysis', escalation: 'Incident Commander' },
  { role: 'Communications Lead', name: '', team: 'Operations', responsibility: 'Stakeholder notifications and status updates', escalation: 'Incident Commander' },
  { role: 'DBA / Data Lead', name: '', team: 'Data Engineering', responsibility: 'Database failover and data integrity', escalation: 'Technical Lead' },
  { role: 'Infrastructure Lead', name: '', team: 'Platform / SRE', responsibility: 'Compute, network, storage failover', escalation: 'Technical Lead' },
  { role: 'Security Lead', name: '', team: 'Security', responsibility: 'Security assessment, credential rotation', escalation: 'Incident Commander' },
  { role: 'Business Liaison', name: '', team: 'Business Ops', responsibility: 'Manual workarounds coordination', escalation: 'Incident Commander' },
  { role: 'QA / Validation', name: '', team: 'QA', responsibility: 'Post-recovery validation and UAT', escalation: 'Technical Lead' },
]

// WAF-aligned: failover runbook (https://learn.microsoft.com/azure/well-architected/design-guides/disaster-recovery#dr-runbook)
const defaultFailoverSteps: RunbookStep[] = [
  { action: 'Detect incident', owner: 'Monitoring / Operations', validation: 'Alert fired by monitoring tool or user report received' },
  { action: 'Assess severity', owner: 'Incident Manager', validation: 'Severity level determined using Incident Classification Table' },
  { action: 'Declare outage (if needed)', owner: 'Senior Ops / BCDR Lead', validation: 'Outage formally declared for High/Critical severity' },
  { action: 'Notify stakeholders', owner: 'Communications Lead', validation: 'Notifications sent per Communication Plan' },
  { action: 'Initiate runbook execution', owner: 'Operations Team', validation: 'Automated runbooks triggered; manual steps in progress' },
  { action: 'Prepare secondary infrastructure', owner: 'Operations Team', validation: 'Secondary region scaled up; configuration validated' },
  { action: 'Ensure data integrity', owner: 'Operations Team', validation: 'Backups restored if needed; RPO adherence confirmed' },
  { action: 'Recover applications', owner: 'Ops / QA Team', validation: 'Applications activated in secondary; dependencies verified' },
  { action: 'Traffic cutover', owner: 'Operations Team', validation: 'DNS / load balancer updated; users on secondary' },
  { action: 'Close incident and document', owner: 'Incident Manager', validation: 'Post-mortem completed; incident record updated' },
]

const defaultFailbackSteps: RunbookStep[] = [
  { action: 'Monitor primary region health', owner: 'Operations / Cloud Team', validation: 'Primary region passes all automated and manual health checks' },
  { action: 'Assess business impact', owner: 'App Owner / Business Continuity', validation: 'Low-traffic window confirmed; approvals obtained' },
  { action: 'Review data synchronization', owner: 'Database / Infra Team', validation: 'Replication lag within RPO; data consistency verified' },
  { action: 'Communicate failback plan', owner: 'Incident Manager', validation: 'Stakeholders notified of timeline and impact' },
  { action: 'Prepare primary region', owner: 'Infra / Cloud Team', validation: 'Pre-failback checklist complete; infrastructure ready' },
  { action: 'Initiate failback', owner: 'Operations / Cloud Team', validation: 'Approved change request executed; traffic shift started' },
  { action: 'Monitor failback progress', owner: 'Operations / Cloud Team', validation: 'No errors, latency spikes, or data loss observed' },
  { action: 'Validate application functionality', owner: 'App Owner / QA', validation: 'Smoke and regression tests pass on primary region' },
  { action: 'Finalize and close incident', owner: 'Incident Manager', validation: 'Systems stable; documentation and lessons learned captured' },
]

// WAF-aligned: incident severity matrix
const defaultSeverity: SeverityRow[] = [
  { severity: 'Low', description: 'Minor service degradation', example: 'Brief latency spike', declaration: 'No formal declaration', stakeholders: 'Operations Team' },
  { severity: 'Medium', description: 'Partial service degradation', example: 'Single service errors', declaration: 'Incident logged, under observation', stakeholders: 'Ops, Business Leads' },
  { severity: 'High', description: 'Major outage, widespread impact', example: 'Multi-service failure', declaration: 'Formal outage declaration', stakeholders: 'All stakeholders, Customers' },
  { severity: 'Critical', description: 'Total loss, business-critical', example: 'Complete regional Azure failure', declaration: 'Immediate declaration, C-level', stakeholders: 'All stakeholders, Exec Team' },
]

// WAF-aligned: communication plan
const defaultComms: CommRow[] = [
  { audience: 'Executive Leadership', channel: 'Email + Teams (priority channel)', frequency: 'On declaration + every 30 min', template: 'Exec status template — business impact, ETA, decisions needed', owner: 'Incident Commander' },
  { audience: 'Internal Business Users', channel: 'Email distribution + intranet banner', frequency: 'On declaration + hourly', template: 'Internal outage notice — affected systems, workarounds, ETA', owner: 'Communications Lead' },
  { audience: 'Operations / Engineering', channel: 'Incident bridge (Teams / Slack)', frequency: 'Continuous', template: 'Technical updates — runbook step, blockers, next action', owner: 'Technical Lead' },
  { audience: 'Customers (external)', channel: 'Status page + email', frequency: 'On declaration + every 2 hours', template: 'Customer notice — symptoms, scope, realistic restoration timeframe', owner: 'Communications Lead' },
  { audience: 'Partners / Vendors', channel: 'Email + phone (named contact)', frequency: 'As needed', template: 'Partner advisory — integration impact, escalation contacts', owner: 'Business Liaison' },
  { audience: 'Regulators / Compliance', channel: 'Formal notification (email + signed)', frequency: 'Per regulatory SLA', template: 'Regulatory notice — incident type, scope, mitigation, timeline', owner: 'Compliance Officer' },
]

/* ═══════ Component ═══════ */

export default function ImplementTab() {
  const s = useStyles()
  const [ec, setEc] = useState<string | null>(null)

  // All editable state
  const [response, setResponse, resetResp] = useWorkbenchData<ResponseRow[]>('phase2-response-plan', defaultResponse)
  const [design, setDesign, resetDesign] = useWorkbenchData<DesignRow[]>('phase2-continuity-design', defaultDesign)
  const [cost, setCost, resetCost] = useWorkbenchData<CostRow[]>('phase2-cost-comparison', defaultCost)
  const [metrics, setMetrics, resetMetrics] = useWorkbenchData<MetricRow[]>('phase2-metric-comparison', defaultMetrics)
  const [steps, setSteps, resetSteps] = useWorkbenchData<string[]>('phase2-contingency-steps', defaultContingency)
  const [roles, setRoles, resetRoles] = useWorkbenchData<RoleRow[]>('phase2-role-assignment', defaultRoles)
  const [failover, setFailover, resetFailover] = useWorkbenchData<RunbookStep[]>('phase2-runbook-failover', defaultFailoverSteps)
  const [failback, setFailback, resetFailback] = useWorkbenchData<RunbookStep[]>('phase2-runbook-failback', defaultFailbackSteps)
  const [severity, setSeverity, resetSeverity] = useWorkbenchData<SeverityRow[]>('phase2-severity-matrix', defaultSeverity)
  const [comms, setComms, resetComms] = useWorkbenchData<CommRow[]>('phase2-comm-plan', defaultComms)

  // Sync: Design components ↔ Cost rows (add new, remove deleted, keep existing costs)
  // Only sync when user explicitly changes design (not on first mount with defaults)
  const costDesignRef = useRef(design)
  useEffect(() => {
    if (costDesignRef.current === design) return
    costDesignRef.current = design
    const designNames = design.map(d => d.component).filter(Boolean)
    const existingCost = cost.filter(c => designNames.includes(c.component))
    const newNames = designNames.filter(n => !cost.some(c => c.component === n))
    const synced = [...existingCost, ...newNames.map(n => ({ component: n, currentCost: 0, bcdrCost: 0 }))]
    if (synced.length !== cost.length || synced.some((s, i) => s.component !== cost[i]?.component)) {
      setCost(synced)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design])

  // Sync: Design components ↔ Metric Comparison rows
  // Only sync when user explicitly changes design (not on first mount with defaults)
  const designRef = useRef(design)
  useEffect(() => {
    // Skip sync on initial mount — only run when design actually changes
    if (designRef.current === design) return
    designRef.current = design
    const designNames = design.map(d => d.component).filter(Boolean)
    const existingMetrics = metrics.filter(m => designNames.includes(m.component))
    const newNames = designNames.filter(n => !metrics.some(m => m.component === n))
    const synced = [...existingMetrics, ...newNames.map(n => ({ component: n, beforeAvail: '', afterAvail: '', beforeRel: '', afterRel: '', beforeSec: '', afterSec: '' }))]
    if (synced.length !== metrics.length || synced.some((s, i) => s.component !== metrics[i]?.component)) {
      setMetrics(synced)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design])

  // Edit cell helper
  const cell = (key: string, val: string, save: (v: string) => void, cls: string, extra?: React.CSSProperties) => {
    const editing = ec === key
    return (
      <td className={mergeClasses(cls, cls === s.tdC ? s.editC : s.edit)} onClick={() => !editing && setEc(key)} style={extra}>
        {editing ? <input autoFocus defaultValue={val} onBlur={e => { save(e.target.value); setEc(null) }} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEc(null) }} className={s.inp} /> : (val || '\u00A0')}
      </td>
    )
  }

  // Row update helpers
  const updResp = <K extends keyof ResponseRow>(i: number, f: K, v: ResponseRow[K]) => setResponse(response.map((r, j) => j === i ? { ...r, [f]: v } : r))
  const updDesign = <K extends keyof DesignRow>(i: number, f: K, v: DesignRow[K]) => setDesign(design.map((r, j) => j === i ? { ...r, [f]: v } : r))
  const updCost = (i: number, f: keyof CostRow, v: string) => setCost(cost.map((r, j) => j === i ? { ...r, [f]: f === 'component' ? v : (parseFloat(v) || 0) } as CostRow : r))
  const updMetric = <K extends keyof MetricRow>(i: number, f: K, v: string) => setMetrics(metrics.map((r, j) => j === i ? { ...r, [f]: v } : r))
  const updRole = <K extends keyof RoleRow>(i: number, f: K, v: string) => setRoles(roles.map((r, j) => j === i ? { ...r, [f]: v } : r))
  const updFailover = <K extends keyof RunbookStep>(i: number, f: K, v: string) => setFailover(failover.map((r, j) => j === i ? { ...r, [f]: v } : r))
  const updFailback = <K extends keyof RunbookStep>(i: number, f: K, v: string) => setFailback(failback.map((r, j) => j === i ? { ...r, [f]: v } : r))
  const updSeverity = <K extends keyof SeverityRow>(i: number, f: K, v: string) => setSeverity(severity.map((r, j) => j === i ? { ...r, [f]: v } : r))
  const updComm = <K extends keyof CommRow>(i: number, f: K, v: string) => setComms(comms.map((r, j) => j === i ? { ...r, [f]: v } : r))
  const moveRunbook = (list: RunbookStep[], setList: (v: RunbookStep[]) => void, i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const arr = [...list]; [arr[i], arr[j]] = [arr[j], arr[i]]
    setList(arr)
  }

  // Cost calculations
  const totB = useMemo(() => cost.reduce((a, r) => a + r.currentCost, 0), [cost])
  const totA = useMemo(() => cost.reduce((a, r) => a + r.bcdrCost, 0), [cost])
  const costChart = useMemo(() => cost.filter(r => r.component).map(r => ({ name: r.component, 'Current': r.currentCost, '+BCDR': r.bcdrCost })), [cost])

  // Metric radar
  const radar = useMemo(() => metrics.map(r => ({ component: r.component, 'Before': parseFloat(r.beforeAvail), 'After': parseFloat(r.afterAvail) })), [metrics])

  // CSV exports
  const expResp = () => downloadCsv('response_plan.csv', objectsToCsvSheet('ResponsePlan', response as unknown as Record<string, unknown>[]))
  const expDesign = () => downloadCsv('continuity_design.csv', objectsToCsvSheet('Design', design as unknown as Record<string, unknown>[]))
  const expCost = () => downloadCsv('cost_comparison.csv', objectsToCsvSheet('Cost', cost.map(r => ({ Component: r.component, 'Current ($)': r.currentCost, '+BCDR ($)': r.bcdrCost, 'Diff ($)': r.bcdrCost - r.currentCost }))))
  const expMetrics = () => downloadCsv('metric_comparison.csv', objectsToCsvSheet('Metrics', metrics as unknown as Record<string, unknown>[]))
  const expSteps = () => downloadCsv('contingency_plan.csv', objectsToCsvSheet('Contingency', steps.map((st, i) => ({ Step: i + 1, Procedure: st }))))
  const expRoles = () => downloadCsv('role_assignment.csv', objectsToCsvSheet('Roles', roles as unknown as Record<string, unknown>[]))
  const expFailover = () => downloadCsv('runbook_failover.csv', objectsToCsvSheet('Failover', failover.map((r, i) => ({ Step: i + 1, Action: r.action, Owner: r.owner, Validation: r.validation }))))
  const expFailback = () => downloadCsv('runbook_failback.csv', objectsToCsvSheet('Failback', failback.map((r, i) => ({ Step: i + 1, Action: r.action, Owner: r.owner, Validation: r.validation }))))
  const expSeverity = () => downloadCsv('severity_matrix.csv', objectsToCsvSheet('Severity', severity as unknown as Record<string, unknown>[]))
  const expComms = () => downloadCsv('communication_plan.csv', objectsToCsvSheet('Comms', comms as unknown as Record<string, unknown>[]))

  // Contingency step helpers
  const moveStep = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= steps.length) return
    const arr = [...steps]; [arr[i], arr[j]] = [arr[j], arr[i]]
    setSteps(arr)
  }

  return (
    <div>
      {/* ──── 7. Response Plan by Scope (INTERACTIVE) ──── */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>7. Response Plan by Scope</h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={() => setResponse([...response, { scope: '', availability: '', recoverability: '', resources: '', continuity: '', preparation: '' }])}>Add Scope</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetResp}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expResp}>CSV</Button>
          </div>
        </div>
        <p className={s.desc}>Define the response and preparation for each impact scope. Click any field to edit.</p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th className={s.th}>Impact Scope</th>
              <th className={s.thW}>Availability Response</th>
              <th className={s.thW}>Recoverability</th>
              <th className={s.thW}>Resources</th>
              <th className={s.thW}>Continuity Plan</th>
              <th className={s.thW}>Preparation</th>
              <th className={s.thC} style={{ width: 36 }}></th>
            </tr></thead>
            <tbody>
              {response.map((r, i) => (
                <tr key={i} style={{ borderLeft: `4px solid ${SCOPE_COLORS[i % SCOPE_COLORS.length]}` }}>
                  {cell(`rp-${i}-s`, r.scope, v => updResp(i, 'scope', v), s.td, { fontWeight: 600 })}
                  {cell(`rp-${i}-a`, r.availability, v => updResp(i, 'availability', v), s.td)}
                  {cell(`rp-${i}-r`, r.recoverability, v => updResp(i, 'recoverability', v), s.td)}
                  {cell(`rp-${i}-res`, r.resources, v => updResp(i, 'resources', v), s.td)}
                  {cell(`rp-${i}-c`, r.continuity, v => updResp(i, 'continuity', v), s.td)}
                  {cell(`rp-${i}-p`, r.preparation, v => updResp(i, 'preparation', v), s.td)}
                  <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setResponse(response.filter((_, j) => j !== i))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ──── 8. Architecture +BCDR (INTERACTIVE) ──── */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>8. Architecture | Continuity Design (+BCDR)</h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={() => setDesign([...design, { component: '', category: '', sla: '', ha: '', dr: '', remediation: '', status: 'new' }])}>Add</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetDesign}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expDesign}>CSV</Button>
          </div>
        </div>
        <p className={s.desc}>Document your BCDR architecture improvements. Click <Badge appearance="filled" style={{ backgroundColor: '#0078d4', color: '#fff' }} size="small">NEW</Badge> / <Badge appearance="filled" style={{ backgroundColor: '#28a745', color: '#fff' }} size="small">MET</Badge> to toggle status.</p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th className={s.th}>Component</th><th className={s.th}>Category</th><th className={s.thC}>SLA</th>
              <th className={s.thW}>HA Config</th><th className={s.thW}>DR Config</th><th className={s.thW}>Remediation</th>
              <th className={s.thC}>Status</th><th className={s.thC} style={{ width: 36 }}></th>
            </tr></thead>
            <tbody>
              {design.map((r, i) => (
                <tr key={i} style={r.status === 'new' ? { backgroundColor: 'rgba(0,120,212,0.03)' } : undefined}>
                  {cell(`d-${i}-c`, r.component, v => updDesign(i, 'component', v), s.td, { fontWeight: 600 })}
                  {cell(`d-${i}-cat`, r.category, v => updDesign(i, 'category', v), s.td)}
                  {cell(`d-${i}-sla`, r.sla, v => updDesign(i, 'sla', v), s.tdC)}
                  {cell(`d-${i}-ha`, r.ha, v => updDesign(i, 'ha', v), s.td)}
                  {cell(`d-${i}-dr`, r.dr, v => updDesign(i, 'dr', v), s.td)}
                  {cell(`d-${i}-rem`, r.remediation, v => updDesign(i, 'remediation', v), s.td)}
                  <td className={s.tdC} style={{ cursor: 'pointer' }} onClick={() => updDesign(i, 'status', r.status === 'met' ? 'new' : 'met')}>
                    {r.status === 'met'
                      ? <Badge appearance="filled" style={{ backgroundColor: '#28a745', color: '#fff', textAlign: 'center', justifyContent: 'center' }}><Checkmark16Filled style={{ fontSize: 11, marginRight: 3 }} />Met</Badge>
                      : <Badge appearance="filled" style={{ backgroundColor: '#0078d4', color: '#fff', textAlign: 'center', justifyContent: 'center' }}>NEW</Badge>}
                  </td>
                  <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setDesign(design.filter((_, j) => j !== i))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ──── 9. Cost Comparison (INTERACTIVE) ──── */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>9. Cost Comparison (&minus;BCDR vs. +BCDR)</h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={() => setCost([...cost, { component: '', currentCost: 0, bcdrCost: 0 }])}>Add</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetCost}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expCost}>CSV</Button>
          </div>
        </div>
        <div className={s.grid}>
          <div className={s.metric}><div className={s.metricVal}>${totB.toLocaleString()}</div><div className={s.metricLbl}>Current Monthly</div></div>
          <div className={s.metric}><div className={s.metricVal}>${totA.toLocaleString()}</div><div className={s.metricLbl}>+BCDR Monthly</div></div>
          <div className={s.metric}><div className={s.metricVal} style={{ color: '#dc3545' }}>+${(totA - totB).toLocaleString()}</div><div className={s.metricLbl}>Investment</div></div>
          <div className={s.metric}><div className={s.metricVal}>+{totB > 0 ? Math.round((totA - totB) / totB * 100) : 0}%</div><div className={s.metricLbl}>Increase</div></div>
        </div>
        <div className={s.chart}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={costChart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={v => `$${Number(v).toLocaleString()}`} /><Legend /><Bar dataKey="Current" fill="#667eea" radius={[4,4,0,0]} /><Bar dataKey="+BCDR" fill="#764ba2" radius={[4,4,0,0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th className={s.th}>Component</th><th className={s.thC}>Current ($)</th><th className={s.thC}>+BCDR ($)</th><th className={s.thC}>Diff ($)</th><th className={s.thC} style={{ width: 36 }}></th></tr></thead>
            <tbody>
              {cost.map((r, i) => (
                <tr key={i}>
                  {cell(`c-${i}-n`, r.component, v => updCost(i, 'component', v), s.td, { fontWeight: 600 })}
                  {cell(`c-${i}-b`, String(r.currentCost), v => updCost(i, 'currentCost', v), s.tdC)}
                  {cell(`c-${i}-a`, String(r.bcdrCost), v => updCost(i, 'bcdrCost', v), s.tdC)}
                  <td className={s.tdC} style={{ color: r.bcdrCost > r.currentCost ? '#dc3545' : '#28a745', fontWeight: 600 }}>{r.bcdrCost > r.currentCost ? '+' : ''}{(r.bcdrCost - r.currentCost).toLocaleString()}</td>
                  <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setCost(cost.filter((_, j) => j !== i))} /></td>
                </tr>
              ))}
              <tr style={{ fontWeight: 700, backgroundColor: tokens.colorNeutralBackground3 }}>
                <td className={s.td}>TOTAL</td><td className={s.tdC}>${totB.toLocaleString()}</td><td className={s.tdC}>${totA.toLocaleString()}</td><td className={s.tdC} style={{ color: '#dc3545' }}>+${(totA - totB).toLocaleString()}</td><td className={s.del}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ──── 10. Metric Comparison (INTERACTIVE) ──── */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>10. Metric Comparison (+BCDR)</h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={() => setMetrics([...metrics, { component: '', beforeAvail: '', afterAvail: '', beforeRel: '', afterRel: '', beforeSec: '', afterSec: '' }])}>Add</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetMetrics}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expMetrics}>CSV</Button>
          </div>
        </div>
        <p className={s.desc}>Enter before/after scores to visualize BCDR improvements. Click cells to edit.</p>
        <div className={s.chart}>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radar}><PolarGrid /><PolarAngleAxis dataKey="component" tick={{ fontSize: 11 }} /><PolarRadiusAxis domain={[90, 100]} /><Radar name="Before" dataKey="Before" stroke="#dc3545" fill="#dc3545" fillOpacity={0.1} /><Radar name="After" dataKey="After" stroke="#28a745" fill="#28a745" fillOpacity={0.15} /><Tooltip /><Legend /></RadarChart>
          </ResponsiveContainer>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th className={s.th}>Component</th><th className={s.thC}>Before Avail</th><th className={s.thC}>After Avail</th><th className={s.thC}>Before Rel</th><th className={s.thC}>After Rel</th><th className={s.thC}>Before Sec</th><th className={s.thC}>After Sec</th><th className={s.thC} style={{ width: 36 }}></th></tr></thead>
            <tbody>
              {metrics.map((r, i) => (
                <tr key={i}>
                  {cell(`m-${i}-n`, r.component, v => updMetric(i, 'component', v), s.td, { fontWeight: 600 })}
                  {cell(`m-${i}-ba`, r.beforeAvail, v => updMetric(i, 'beforeAvail', v), s.tdC)}
                  {cell(`m-${i}-aa`, r.afterAvail, v => updMetric(i, 'afterAvail', v), s.tdC, { color: '#28a745', fontWeight: 600 })}
                  {cell(`m-${i}-br`, r.beforeRel, v => updMetric(i, 'beforeRel', v), s.tdC)}
                  {cell(`m-${i}-ar`, r.afterRel, v => updMetric(i, 'afterRel', v), s.tdC, { color: '#28a745', fontWeight: 600 })}
                  {cell(`m-${i}-bs`, r.beforeSec, v => updMetric(i, 'beforeSec', v), s.tdC)}
                  {cell(`m-${i}-as`, r.afterSec, v => updMetric(i, 'afterSec', v), s.tdC, { color: '#28a745', fontWeight: 600 })}
                  <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setMetrics(metrics.filter((_, j) => j !== i))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ──── 11. Fault Tree +BCDR (INTERACTIVE via FaultTree component) ──── */}
      <div className={s.section}>
        <h3 className={s.sectionTitle}>11. Fault Tree Analysis (+BCDR)</h3>
        <p className={s.desc}>Build the post-remediation fault tree showing reduced failure probability. This uses a separate data set from the Assess fault tree so you can compare before vs. after.</p>
        <FaultTree storageKey="phase2-fta-after" afterBcdr />
      </div>

      {/* ──── 12. Contingency Plan (INTERACTIVE) ──── */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>12. Contingency Plan</h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={() => setSteps([...steps, ''])}>Add Step</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetSteps}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expSteps}>CSV</Button>
          </div>
        </div>
        <p className={s.desc}>Define how operations continue when the system cannot be restored. Reorder steps with arrows. Click text to edit.</p>
        {steps.map((step, i) => (
          <div key={i} className={s.step}>
            <Badge appearance="filled" color="brand" size="small" style={{ flexShrink: 0 }}>{i + 1}</Badge>
            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setEc(`step-${i}`)}>
              {ec === `step-${i}`
                ? <input autoFocus defaultValue={step} className={s.inp} style={{ width: '100%' }} onBlur={e => { setSteps(steps.map((x, j) => j === i ? e.target.value : x)); setEc(null) }} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEc(null) }} />
                : (step || '\u00A0')}
            </div>
            <div className={s.stepActions}>
              <Button icon={<ArrowUp20Regular />} size="small" appearance="subtle" disabled={i === 0} onClick={() => moveStep(i, -1)} />
              <Button icon={<ArrowDown20Regular />} size="small" appearance="subtle" disabled={i === steps.length - 1} onClick={() => moveStep(i, 1)} />
              <Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setSteps(steps.filter((_, j) => j !== i))} />
            </div>
          </div>
        ))}
      </div>

      {/* ──── 13. Role Assignment (INTERACTIVE) ──── */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>13. Role Assignment</h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={() => setRoles([...roles, { role: '', name: '', team: '', responsibility: '', escalation: '' }])}>Add</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetRoles}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expRoles}>CSV</Button>
          </div>
        </div>
        <p className={s.desc}>Assign people to BCDR roles. Click any cell to edit.</p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th className={s.th}>Role</th><th className={s.th}>Assigned To</th><th className={s.th}>Team</th><th className={s.thW}>Responsibility</th><th className={s.th}>Escalation</th><th className={s.thC} style={{ width: 36 }}></th></tr></thead>
            <tbody>
              {roles.map((r, i) => (
                <tr key={i}>
                  {cell(`r-${i}-r`, r.role, v => updRole(i, 'role', v), s.td, { fontWeight: 600 })}
                  {cell(`r-${i}-n`, r.name, v => updRole(i, 'name', v), s.td)}
                  {cell(`r-${i}-t`, r.team, v => updRole(i, 'team', v), s.td)}
                  {cell(`r-${i}-d`, r.responsibility, v => updRole(i, 'responsibility', v), s.td)}
                  {cell(`r-${i}-e`, r.escalation, v => updRole(i, 'escalation', v), s.td)}
                  <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setRoles(roles.filter((_, j) => j !== i))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ──── 14. DR Runbook (Failover + Failback) — WAF aligned ──── */}
      <div className={s.section}>
        <h3 className={s.sectionTitle}>14. DR Runbook</h3>
        <p className={s.desc}>Step-by-step failover and failback procedures aligned to the Azure Well-Architected guidance. Each step has an owner and a validation criterion. Reorder steps with the arrows.</p>

        {/* Failover */}
        <div className={s.sectionHeader} style={{ marginTop: 8 }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>14a. Failover Procedure</h4>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={() => setFailover([...failover, { action: '', owner: '', validation: '' }])}>Add Step</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetFailover}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expFailover}>CSV</Button>
          </div>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th className={s.thC} style={{ width: 48 }}>#</th>
              <th className={s.thW}>Action</th>
              <th className={s.th}>Owner</th>
              <th className={s.thW}>Validation</th>
              <th className={s.thC} style={{ width: 96 }}>Reorder</th>
              <th className={s.thC} style={{ width: 36 }}></th>
            </tr></thead>
            <tbody>
              {failover.map((r, i) => (
                <tr key={i}>
                  <td className={s.tdC} style={{ fontWeight: 700, color: tokens.colorBrandForeground1 }}>{i + 1}</td>
                  {cell(`fo-${i}-a`, r.action, v => updFailover(i, 'action', v), s.td, { fontWeight: 600 })}
                  {cell(`fo-${i}-o`, r.owner, v => updFailover(i, 'owner', v), s.td)}
                  {cell(`fo-${i}-v`, r.validation, v => updFailover(i, 'validation', v), s.td)}
                  <td className={s.tdC}>
                    <Button icon={<ArrowUp20Regular />} size="small" appearance="subtle" disabled={i === 0} onClick={() => moveRunbook(failover, setFailover, i, -1)} />
                    <Button icon={<ArrowDown20Regular />} size="small" appearance="subtle" disabled={i === failover.length - 1} onClick={() => moveRunbook(failover, setFailover, i, 1)} />
                  </td>
                  <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setFailover(failover.filter((_, j) => j !== i))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Failback */}
        <div className={s.sectionHeader} style={{ marginTop: 16 }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>14b. Failback Procedure</h4>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={() => setFailback([...failback, { action: '', owner: '', validation: '' }])}>Add Step</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetFailback}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expFailback}>CSV</Button>
          </div>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th className={s.thC} style={{ width: 48 }}>#</th>
              <th className={s.thW}>Action</th>
              <th className={s.th}>Owner</th>
              <th className={s.thW}>Validation</th>
              <th className={s.thC} style={{ width: 96 }}>Reorder</th>
              <th className={s.thC} style={{ width: 36 }}></th>
            </tr></thead>
            <tbody>
              {failback.map((r, i) => (
                <tr key={i}>
                  <td className={s.tdC} style={{ fontWeight: 700, color: tokens.colorBrandForeground1 }}>{i + 1}</td>
                  {cell(`fb-${i}-a`, r.action, v => updFailback(i, 'action', v), s.td, { fontWeight: 600 })}
                  {cell(`fb-${i}-o`, r.owner, v => updFailback(i, 'owner', v), s.td)}
                  {cell(`fb-${i}-v`, r.validation, v => updFailback(i, 'validation', v), s.td)}
                  <td className={s.tdC}>
                    <Button icon={<ArrowUp20Regular />} size="small" appearance="subtle" disabled={i === 0} onClick={() => moveRunbook(failback, setFailback, i, -1)} />
                    <Button icon={<ArrowDown20Regular />} size="small" appearance="subtle" disabled={i === failback.length - 1} onClick={() => moveRunbook(failback, setFailback, i, 1)} />
                  </td>
                  <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setFailback(failback.filter((_, j) => j !== i))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={s.note}>Tip: treat the runbook like production code — version it in Git and keep an offline copy so it's reachable during an outage.</div>
      </div>

      {/* ──── 15. Escalation & Severity Matrix — WAF aligned ──── */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>15. Escalation &amp; Severity Matrix</h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={() => setSeverity([...severity, { severity: '', description: '', example: '', declaration: '', stakeholders: '' }])}>Add</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetSeverity}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expSeverity}>CSV</Button>
          </div>
        </div>
        <p className={s.desc}>Classify incidents by impact so minor issues don't clog the system and major ones get immediate leadership attention. Aligned with WAF DR escalation guidance.</p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th className={s.th}>Severity</th>
              <th className={s.thW}>Description</th>
              <th className={s.thW}>Example</th>
              <th className={s.thW}>Declaration</th>
              <th className={s.thW}>Stakeholders Notified</th>
              <th className={s.thC} style={{ width: 36 }}></th>
            </tr></thead>
            <tbody>
              {severity.map((r, i) => {
                const sevColor = r.severity.toLowerCase() === 'critical' ? '#dc3545' : r.severity.toLowerCase() === 'high' ? '#fd7e14' : r.severity.toLowerCase() === 'medium' ? '#ffc107' : '#28a745'
                return (
                  <tr key={i} style={{ borderLeft: `4px solid ${sevColor}` }}>
                    {cell(`sv-${i}-s`, r.severity, v => updSeverity(i, 'severity', v), s.td, { fontWeight: 700, color: sevColor })}
                    {cell(`sv-${i}-d`, r.description, v => updSeverity(i, 'description', v), s.td)}
                    {cell(`sv-${i}-e`, r.example, v => updSeverity(i, 'example', v), s.td)}
                    {cell(`sv-${i}-dec`, r.declaration, v => updSeverity(i, 'declaration', v), s.td)}
                    {cell(`sv-${i}-st`, r.stakeholders, v => updSeverity(i, 'stakeholders', v), s.td)}
                    <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setSeverity(severity.filter((_, j) => j !== i))} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ──── 16. Communication Plan — WAF aligned ──── */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h3 className={s.sectionTitle}>16. Communication Plan</h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={() => setComms([...comms, { audience: '', channel: '', frequency: '', template: '', owner: '' }])}>Add</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetComms}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expComms}>CSV</Button>
          </div>
        </div>
        <p className={s.desc}>Define audiences, channels, frequency, message templates, and owners so the right information reaches the right people during a disruption. Covers internal and external stakeholders per WAF guidance.</p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th className={s.th}>Audience</th>
              <th className={s.thW}>Channel</th>
              <th className={s.th}>Frequency</th>
              <th className={s.thW}>Template / Message</th>
              <th className={s.th}>Owner</th>
              <th className={s.thC} style={{ width: 36 }}></th>
            </tr></thead>
            <tbody>
              {comms.map((r, i) => (
                <tr key={i}>
                  {cell(`cm-${i}-a`, r.audience, v => updComm(i, 'audience', v), s.td, { fontWeight: 600 })}
                  {cell(`cm-${i}-c`, r.channel, v => updComm(i, 'channel', v), s.td)}
                  {cell(`cm-${i}-f`, r.frequency, v => updComm(i, 'frequency', v), s.td)}
                  {cell(`cm-${i}-t`, r.template, v => updComm(i, 'template', v), s.td)}
                  {cell(`cm-${i}-o`, r.owner, v => updComm(i, 'owner', v), s.td)}
                  <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setComms(comms.filter((_, j) => j !== i))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
