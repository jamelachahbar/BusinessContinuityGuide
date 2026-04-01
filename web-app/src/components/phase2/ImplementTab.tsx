import { useState, useMemo, useEffect } from 'react'
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

  // Sync: Design components ↔ Cost rows (add new, remove deleted, keep existing costs)
  useEffect(() => {
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
  useEffect(() => {
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
                      ? <Badge appearance="filled" style={{ backgroundColor: '#28a745', color: '#fff' }}><Checkmark16Filled style={{ fontSize: 11, marginRight: 3 }} />Met</Badge>
                      : <Badge appearance="filled" style={{ backgroundColor: '#0078d4', color: '#fff' }}>NEW</Badge>}
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
    </div>
  )
}
