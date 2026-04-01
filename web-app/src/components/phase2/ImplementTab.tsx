import { useState, useMemo } from 'react'
import {
  makeStyles,
  shorthands,
  mergeClasses,
  tokens,
  Badge,
  Button,
} from '@fluentui/react-components'
import {
  Checkmark16Filled,
  Add20Regular,
  Delete20Regular,
  ArrowReset20Regular,
  ArrowDownload20Regular,
} from '@fluentui/react-icons'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import { useWorkbenchData } from '../../hooks/useWorkbenchData'
import { downloadCsv, objectsToCsvSheet } from '../../utils/csvExport'

const useStyles = makeStyles({
  section: { marginBottom: '32px' },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' },
  sectionTitle: { fontSize: '20px', fontWeight: '600', color: tokens.colorNeutralForeground1, marginBottom: '0' },
  subsectionDesc: { marginBottom: '16px', lineHeight: '1.6', color: tokens.colorNeutralForeground2 },
  tableWrap: { overflowX: 'auto', marginBottom: '16px', marginTop: '12px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px', lineHeight: '1.4' },
  th: { backgroundColor: tokens.colorNeutralBackground3, fontWeight: '600', textAlign: 'left', ...shorthands.padding('10px', '12px'), borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: tokens.colorNeutralStroke1, whiteSpace: 'nowrap' },
  thCenter: { backgroundColor: tokens.colorNeutralBackground3, fontWeight: '600', textAlign: 'center', ...shorthands.padding('10px', '12px'), borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: tokens.colorNeutralStroke1 },
  thWrap: { backgroundColor: tokens.colorNeutralBackground3, fontWeight: '600', textAlign: 'left', ...shorthands.padding('10px', '12px'), borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: tokens.colorNeutralStroke1, whiteSpace: 'normal' },
  td: { ...shorthands.padding('10px', '12px'), borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: tokens.colorNeutralStroke2, verticalAlign: 'top' },
  tdCenter: { ...shorthands.padding('10px', '12px'), borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: tokens.colorNeutralStroke2, textAlign: 'center', verticalAlign: 'middle' },
  editableCell: { cursor: 'pointer', transitionProperty: 'background-color', transitionDuration: '0.15s', ':hover': { backgroundColor: '#EBF5FF' } },
  editableCellCenter: { cursor: 'pointer', transitionProperty: 'background-color', transitionDuration: '0.15s', textAlign: 'center' as const, ':hover': { backgroundColor: '#EBF5FF' } },
  cellInput: { width: '100%', ...shorthands.borderWidth('0'), ...shorthands.padding('4px'), fontSize: '14px', fontFamily: 'inherit', lineHeight: '1.4', backgroundColor: '#fff', outlineWidth: '2px', outlineStyle: 'solid', outlineColor: tokens.colorBrandStroke1, ...shorthands.borderRadius('2px') },
  deleteCell: { ...shorthands.padding('4px', '8px'), borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: tokens.colorNeutralStroke2, textAlign: 'center', verticalAlign: 'middle', width: '40px' },
  legend: { display: 'flex', flexWrap: 'wrap', columnGap: '16px', rowGap: '8px', marginBottom: '16px', ...shorthands.padding('12px', '16px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('8px') },
  legendItem: { display: 'flex', alignItems: 'center', columnGap: '6px', fontSize: '14px' },
  note: { ...shorthands.padding('12px', '16px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('8px'), marginBottom: '16px', fontSize: '14px', lineHeight: '1.5', color: tokens.colorNeutralForeground2 },
  card: { marginBottom: '16px', ...shorthands.padding('20px') },
  cardTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: tokens.colorBrandForeground1 },
  chartCard: { ...shorthands.padding('20px'), backgroundColor: '#ffffff', ...shorthands.borderRadius('8px'), ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2), marginBottom: '16px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' },
  summaryCard: { ...shorthands.padding('16px', '20px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('8px'), textAlign: 'center' },
  summaryValue: { fontSize: '24px', fontWeight: '700', color: tokens.colorBrandForeground1 },
  summaryLabel: { fontSize: '13px', color: tokens.colorNeutralForeground3, marginTop: '4px' },
  responsePlanRow: { ...shorthands.padding('16px', '20px'), marginBottom: '4px', ...shorthands.borderRadius('8px'), color: '#ffffff' },
  faultTreeRoot: { ...shorthands.padding('16px', '20px'), backgroundColor: '#28a745', color: '#ffffff', fontWeight: '600', fontSize: '16px', ...shorthands.borderRadius('8px'), marginBottom: '12px', textAlign: 'center' },
  faultTreeBranch: { marginLeft: '24px', ...shorthands.borderLeft('3px', 'solid', tokens.colorNeutralStroke1), ...shorthands.padding('0', '0', '0', '16px') },
  faultTreeNode: { ...shorthands.padding('10px', '16px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('6px'), marginBottom: '8px', fontSize: '14px' },
  faultTreeLeaf: { ...shorthands.padding('8px', '14px'), backgroundColor: tokens.colorNeutralBackground1, ...shorthands.borderRadius('4px'), marginBottom: '6px', fontSize: '13px', ...shorthands.borderLeft('3px', 'solid', '#28a745'), marginLeft: '24px' },
  stepList: { listStyleType: 'decimal', marginLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  stepItem: { ...shorthands.padding('8px', '12px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('6px'), fontSize: '14px', lineHeight: '1.5' },
})

/* ═══════════════════════════════════════════
   Data
   ═══════════════════════════════════════════ */

const responsePlanData = [
  { scope: 'Global',                bgColor: '#1a237e', availability: 'None', recoverability: 'Redeploy, Restore', resources: 'Service Providers, Authorities, IT Support', continuity: 'Contingency Plan', preparation: 'Board signoff; Communication plan; Contingency plan validation; Redeploy testing' },
  { scope: 'Azure Geography',       bgColor: '#283593', availability: 'None', recoverability: 'Redeploy, Restore (manual)', resources: 'Service Providers, Authorities, IT Support', continuity: 'Contingency Plan', preparation: 'Board signoff; Communication plan; Contingency plan validation; Redeploy testing' },
  { scope: 'Azure Region',          bgColor: '#303f9f', availability: 'Failover to secondary region (automated)', recoverability: 'Restore (manual)', resources: 'IT Support, Vendor', continuity: 'Failover Plan, Recovery Plan', preparation: 'App Business Owner signoff; Communication plan; Failover testing; Recovery testing' },
  { scope: 'Azure Zone',            bgColor: '#3949ab', availability: 'Failover between zones (automated)', recoverability: 'Restore (manual)', resources: 'Service Providers, IT Support', continuity: 'Failover Plan, Recovery Plan', preparation: 'App Business Owner signoff; Communication plan; Failover testing; Recovery testing' },
  { scope: 'Azure Service Instance', bgColor: '#3f51b5', availability: 'None', recoverability: 'Restore (manual)', resources: 'Service Providers, IT Support', continuity: 'Failover Plan, Recovery Plan', preparation: 'App Business Owner signoff; Communication plan; Failover testing; Recovery testing' },
  { scope: 'Data Integrity Issue',   bgColor: '#5c6bc0', availability: 'N/A', recoverability: 'Restore (manual)', resources: 'Service Providers, IT Support', continuity: 'Recovery Plan', preparation: 'App Business Owner signoff; Communication plan; Recovery testing' },
]

const continuityDesignData = [
  { component: 'Microsoft Entra ID', category: 'Identity',   sla: '99.99%',  ha: 'Global redundancy',               dr: '\u2014',                   remediation: 'No change required',                          status: 'met' as const },
  { component: 'Azure DNS',          category: 'Networking',  sla: '100%',    ha: 'Global anycast',                  dr: '\u2014',                   remediation: 'No change required',                          status: 'met' as const },
  { component: 'Azure Front Door',   category: 'Networking',  sla: '99.99%',  ha: 'Global load balancing',           dr: '\u2014',                   remediation: 'No change required',                          status: 'met' as const },
  { component: 'App Service Plan',   category: 'Compute',     sla: '99.95%',  ha: 'Zone-redundant + secondary',      dr: 'Active-passive failover',  remediation: 'Deploy to secondary region with Traffic Manager', status: 'new' as const },
  { component: 'Azure SQL Database', category: 'Data',        sla: '99.995%', ha: 'Zone redundant',                  dr: 'Active geo-replication',   remediation: 'Enable geo-replication to paired region',      status: 'new' as const },
  { component: 'Azure Service Bus',  category: 'Messaging',   sla: '99.9%',   ha: 'Zone redundant',                  dr: 'Geo-DR pairing',           remediation: 'Configure geo-disaster recovery namespace',   status: 'new' as const },
  { component: 'Azure Cache',        category: 'Cache',       sla: '99.9%',   ha: 'Premium with zone redundancy',    dr: 'Geo-replication',          remediation: 'Upgrade to Premium; enable geo-replication',   status: 'new' as const },
  { component: 'Storage Account',    category: 'Storage',     sla: '99.99%',  ha: 'ZRS',                             dr: 'GZRS',                     remediation: 'Migrate from LRS to GZRS',                    status: 'new' as const },
  { component: 'Azure Key Vault',    category: 'Security',    sla: '99.99%',  ha: 'Zone redundant',                  dr: 'Managed replication',      remediation: 'No change required',                          status: 'met' as const },
  { component: 'Application Insights', category: 'Monitoring', sla: '99.9%',  ha: 'Regional',                        dr: '\u2014',                   remediation: 'No change required',                          status: 'met' as const },
]

interface CostRow { component: string; currentCost: number; bcdrCost: number }

const defaultCostData: CostRow[] = [
  { component: 'App Service Plan',   currentCost: 500,  bcdrCost: 1000 },
  { component: 'Azure SQL Database', currentCost: 800,  bcdrCost: 1200 },
  { component: 'Azure Cache',        currentCost: 300,  bcdrCost: 600 },
  { component: 'Azure Service Bus',  currentCost: 150,  bcdrCost: 225 },
  { component: 'Storage Account',    currentCost: 50,   bcdrCost: 75 },
  { component: 'Azure Front Door',   currentCost: 200,  bcdrCost: 200 },
  { component: 'Key Vault',          currentCost: 10,   bcdrCost: 10 },
  { component: 'Application Insights', currentCost: 100, bcdrCost: 100 },
]

const metricComparisonData = [
  { component: 'App Service', beforeAvail: '99.95%', afterAvail: '99.99%', beforeReliability: '95%', afterReliability: '99%', beforeSecurity: '80%', afterSecurity: '92%' },
  { component: 'Azure SQL',   beforeAvail: '99.99%', afterAvail: '99.995%', beforeReliability: '98%', afterReliability: '99.5%', beforeSecurity: '90%', afterSecurity: '95%' },
  { component: 'Redis Cache', beforeAvail: '99.9%',  afterAvail: '99.95%', beforeReliability: '90%', afterReliability: '97%', beforeSecurity: '75%', afterSecurity: '90%' },
  { component: 'Service Bus', beforeAvail: '99.9%',  afterAvail: '99.95%', beforeReliability: '92%', afterReliability: '98%', beforeSecurity: '85%', afterSecurity: '92%' },
  { component: 'Storage',     beforeAvail: '99.9%',  afterAvail: '99.99%', beforeReliability: '95%', afterReliability: '99%', beforeSecurity: '80%', afterSecurity: '90%' },
]

const faultTreeAfter = [
  { category: 'Infrastructure Failure', probability: 'Low', impact: 'Medium', mitigations: ['Zone-redundant deployment across 3 AZs', 'Active-passive multi-region failover', 'Redundant ExpressRoute + VPN', 'Azure Traffic Manager with health probes'] },
  { category: 'Application Failure',    probability: 'Low', impact: 'Medium', mitigations: ['Circuit breaker + retry on all dependencies', 'IaC with drift detection', 'Queue-based load leveling', 'Auto-scaling + resource alerts'] },
  { category: 'Data Issues',            probability: 'Very Low', impact: 'Medium', mitigations: ['Point-in-time restore (30-day retention)', 'Soft delete enabled', 'Active geo-replication for SQL', 'Automated backup verification'] },
  { category: 'Security Incident',      probability: 'Very Low', impact: 'High', mitigations: ['DDoS Protection Standard', 'Managed identity + Key Vault rotation', 'Defender for Cloud enabled', 'WAF v2 with OWASP 3.2'] },
]

const contingencySteps = [
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

interface RoleRow { role: string; name: string; team: string; responsibility: string; escalation: string }

const defaultRoleData: RoleRow[] = [
  { role: 'Incident Commander', name: '', team: 'Operations', responsibility: 'Overall incident coordination, communication, and decision-making', escalation: 'CTO / VP Engineering' },
  { role: 'Technical Lead',     name: '', team: 'Engineering', responsibility: 'Lead technical response, failover execution, root cause analysis', escalation: 'Incident Commander' },
  { role: 'Communications Lead', name: '', team: 'Operations', responsibility: 'Stakeholder notifications, status page updates, customer comms', escalation: 'Incident Commander' },
  { role: 'DBA / Data Lead',    name: '', team: 'Data Engineering', responsibility: 'Database failover, data restore, integrity verification', escalation: 'Technical Lead' },
  { role: 'Infrastructure Lead', name: '', team: 'Platform / SRE', responsibility: 'Network, compute, and storage failover; IaC redeployment', escalation: 'Technical Lead' },
  { role: 'Security Lead',      name: '', team: 'Security', responsibility: 'Security assessment during incident, credential rotation if needed', escalation: 'Incident Commander' },
  { role: 'Business Liaison',   name: '', team: 'Business Ops', responsibility: 'Activate contingency procedures, coordinate manual workarounds', escalation: 'Incident Commander' },
  { role: 'QA / Validation',    name: '', team: 'QA', responsibility: 'Post-recovery validation, smoke tests, UAT coordination', escalation: 'Technical Lead' },
]

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export default function ImplementTab() {
  const styles = useStyles()

  const [costData, setCostData, resetCost] = useWorkbenchData<CostRow[]>('phase2-cost-comparison', defaultCostData)
  const [roleData, setRoleData, resetRoles] = useWorkbenchData<RoleRow[]>('phase2-role-assignment', defaultRoleData)
  const [editingCell, setEditingCell] = useState<string | null>(null)

  const editCell = (key: string, value: string, onSave: (v: string) => void, baseClass: string, extraStyle?: React.CSSProperties) => {
    const isEditing = editingCell === key
    const hoverClass = baseClass === styles.tdCenter ? styles.editableCellCenter : styles.editableCell
    return (
      <td className={mergeClasses(baseClass, hoverClass)} onClick={() => !isEditing && setEditingCell(key)} style={extraStyle}>
        {isEditing ? (
          <input autoFocus defaultValue={value} onBlur={(e) => { onSave(e.target.value); setEditingCell(null) }} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditingCell(null) }} className={styles.cellInput} />
        ) : (value || '\u00A0')}
      </td>
    )
  }

  /* Cost helpers */
  const updateCost = (idx: number, field: keyof CostRow, value: string) => {
    const numVal = field === 'component' ? 0 : parseFloat(value) || 0
    setCostData(costData.map((r, i) => i === idx ? { ...r, [field]: field === 'component' ? value : numVal } : r))
  }
  const addCostRow = () => setCostData([...costData, { component: '', currentCost: 0, bcdrCost: 0 }])
  const deleteCostRow = (idx: number) => setCostData(costData.filter((_, i) => i !== idx))
  const totalBefore = useMemo(() => costData.reduce((s, r) => s + r.currentCost, 0), [costData])
  const totalAfter = useMemo(() => costData.reduce((s, r) => s + r.bcdrCost, 0), [costData])
  const costChartData = useMemo(() => costData.filter(r => r.component).map(r => ({ name: r.component, 'Current': r.currentCost, '+BCDR': r.bcdrCost })), [costData])

  /* Role helpers */
  const updateRole = <K extends keyof RoleRow>(idx: number, field: K, value: string) => {
    setRoleData(roleData.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }
  const addRoleRow = () => setRoleData([...roleData, { role: '', name: '', team: '', responsibility: '', escalation: '' }])
  const deleteRoleRow = (idx: number) => setRoleData(roleData.filter((_, i) => i !== idx))

  /* Metric comparison radar */
  const radarData = useMemo(() =>
    metricComparisonData.map(r => ({
      component: r.component,
      'Before Avail': parseFloat(r.beforeAvail),
      'After Avail': parseFloat(r.afterAvail),
      'Before Reliability': parseFloat(r.beforeReliability),
      'After Reliability': parseFloat(r.afterReliability),
    })),
  [])

  /* CSV exports */
  const exportCost = () => downloadCsv('phase2_cost_comparison.csv', objectsToCsvSheet('Cost', costData.map(r => ({ Component: r.component, 'Current ($)': String(r.currentCost), '+BCDR ($)': String(r.bcdrCost), 'Diff ($)': String(r.bcdrCost - r.currentCost) }))))
  const exportRoles = () => downloadCsv('phase2_role_assignment.csv', objectsToCsvSheet('Roles', roleData as unknown as Record<string, unknown>[]))

  return (
    <div>
      {/* ── 7. Response Plan by Scope (STATIC) ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>7. Response Plan by Scope</h3>
        <p className={styles.subsectionDesc}>
          Different disaster events have different scope of impact and therefore a different response.
          This framework defines the response and preparation activities by impact scope.
        </p>
        {responsePlanData.map((row, i) => (
          <div key={i} className={styles.responsePlanRow} style={{ backgroundColor: row.bgColor }}>
            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
              <Badge appearance="filled" size="small" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', marginRight: '8px' }}>{i + 1}</Badge>
              {row.scope}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', fontSize: '13px', opacity: 0.95 }}>
              <div><strong>Availability:</strong> {row.availability}</div>
              <div><strong>Recoverability:</strong> {row.recoverability}</div>
              <div><strong>Resources:</strong> {row.resources}</div>
              <div><strong>Continuity:</strong> {row.continuity}</div>
              <div style={{ gridColumn: '1 / -1' }}><strong>Preparation:</strong> {row.preparation}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 8. Architecture +BCDR (STATIC) ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>8. Architecture | Continuity Design (+BCDR)</h3>
        <p className={styles.subsectionDesc}>
          Updated architecture with BCDR improvements. Items marked <Badge appearance="filled" style={{ backgroundColor: '#0078d4', color: '#fff' }} size="small">NEW</Badge> are remediation additions.
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
              {continuityDesignData.map((row, i) => (
                <tr key={i} style={row.status === 'new' ? { backgroundColor: 'rgba(0,120,212,0.04)' } : undefined}>
                  <td className={styles.td} style={{ fontWeight: 600 }}>{row.component}</td>
                  <td className={styles.td}>{row.category}</td>
                  <td className={styles.tdCenter}>{row.sla}</td>
                  <td className={styles.td}>{row.ha}</td>
                  <td className={styles.td}>{row.dr}</td>
                  <td className={styles.td}>{row.remediation}</td>
                  <td className={styles.tdCenter}>
                    {row.status === 'met' ? (
                      <Badge appearance="filled" style={{ backgroundColor: '#28a745', color: '#fff' }}><Checkmark16Filled style={{ fontSize: '12px', marginRight: '4px' }} />Met</Badge>
                    ) : (
                      <Badge appearance="filled" style={{ backgroundColor: '#0078d4', color: '#fff' }}>NEW</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 9. Cost Comparison (INTERACTIVE) ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>9. Cost Comparison (&minus;BCDR vs. +BCDR)</h3>
        <p className={styles.subsectionDesc}>
          Compare monthly costs before and after BCDR components. Click any cell to edit.
        </p>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>${totalBefore.toLocaleString()}</div>
            <div className={styles.summaryLabel}>Current Monthly</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>${totalAfter.toLocaleString()}</div>
            <div className={styles.summaryLabel}>+BCDR Monthly</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue} style={{ color: '#dc3545' }}>+${(totalAfter - totalBefore).toLocaleString()}</div>
            <div className={styles.summaryLabel}>BCDR Investment</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>+{totalBefore > 0 ? Math.round((totalAfter - totalBefore) / totalBefore * 100) : 0}%</div>
            <div className={styles.summaryLabel}>Cost Increase</div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h4 style={{ marginBottom: '12px' }}>Cost Comparison by Component</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={costChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Legend />
              <Bar dataKey="Current" fill="#667eea" radius={[4, 4, 0, 0]} />
              <Bar dataKey="+BCDR" fill="#764ba2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.sectionHeader}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={addCostRow}>Add Row</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetCost}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportCost}>Export CSV</Button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr>
              <th className={styles.th}>Component</th>
              <th className={styles.thCenter}>Current Cost ($)</th>
              <th className={styles.thCenter}>+BCDR Cost ($)</th>
              <th className={styles.thCenter}>Difference ($)</th>
              <th className={styles.thCenter} style={{ width: '40px' }}></th>
            </tr></thead>
            <tbody>
              {costData.map((row, i) => (
                <tr key={i}>
                  {editCell(`cost-${i}-c`, row.component, (v) => updateCost(i, 'component', v), styles.td, { fontWeight: 600 })}
                  {editCell(`cost-${i}-cur`, String(row.currentCost), (v) => updateCost(i, 'currentCost', v), styles.tdCenter)}
                  {editCell(`cost-${i}-bcdr`, String(row.bcdrCost), (v) => updateCost(i, 'bcdrCost', v), styles.tdCenter)}
                  <td className={styles.tdCenter} style={{ color: row.bcdrCost > row.currentCost ? '#dc3545' : '#28a745', fontWeight: 600 }}>
                    {row.bcdrCost > row.currentCost ? '+' : ''}{(row.bcdrCost - row.currentCost).toLocaleString()}
                  </td>
                  <td className={styles.deleteCell}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => deleteCostRow(i)} /></td>
                </tr>
              ))}
              <tr style={{ fontWeight: 700, backgroundColor: tokens.colorNeutralBackground3 }}>
                <td className={styles.td}>TOTAL</td>
                <td className={styles.tdCenter}>${totalBefore.toLocaleString()}</td>
                <td className={styles.tdCenter}>${totalAfter.toLocaleString()}</td>
                <td className={styles.tdCenter} style={{ color: '#dc3545' }}>+${(totalAfter - totalBefore).toLocaleString()}</td>
                <td className={styles.deleteCell}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 10. Metric Comparison (STATIC OUTPUT) ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>10. Metric Comparison (+BCDR)</h3>
        <p className={styles.subsectionDesc}>Improved reliability scores after BCDR implementation.</p>
        <div className={styles.chartCard}>
          <h4 style={{ marginBottom: '12px' }}>Availability Improvement</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="component" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis domain={[90, 100]} />
              <Radar name="Before" dataKey="Before Avail" stroke="#dc3545" fill="#dc3545" fillOpacity={0.1} />
              <Radar name="After" dataKey="After Avail" stroke="#28a745" fill="#28a745" fillOpacity={0.15} />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr>
              <th className={styles.th}>Component</th>
              <th className={styles.thCenter}>Before Avail</th>
              <th className={styles.thCenter}>After Avail</th>
              <th className={styles.thCenter}>Before Reliability</th>
              <th className={styles.thCenter}>After Reliability</th>
              <th className={styles.thCenter}>Before Security</th>
              <th className={styles.thCenter}>After Security</th>
            </tr></thead>
            <tbody>
              {metricComparisonData.map((r, i) => (
                <tr key={i}>
                  <td className={styles.td} style={{ fontWeight: 600 }}>{r.component}</td>
                  <td className={styles.tdCenter}>{r.beforeAvail}</td>
                  <td className={styles.tdCenter} style={{ color: '#28a745', fontWeight: 600 }}>{r.afterAvail}</td>
                  <td className={styles.tdCenter}>{r.beforeReliability}</td>
                  <td className={styles.tdCenter} style={{ color: '#28a745', fontWeight: 600 }}>{r.afterReliability}</td>
                  <td className={styles.tdCenter}>{r.beforeSecurity}</td>
                  <td className={styles.tdCenter} style={{ color: '#28a745', fontWeight: 600 }}>{r.afterSecurity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 11. Fault Tree +BCDR (STATIC) ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>11. Fault Tree Analysis (+BCDR)</h3>
        <p className={styles.subsectionDesc}>Updated fault tree showing reduced failure probability after BCDR remediation.</p>
        <div className={styles.faultTreeRoot}>Application Protected (with BCDR mitigations)</div>
        <div className={styles.faultTreeBranch}>
          {faultTreeAfter.map((branch, i) => (
            <div key={i}>
              <div className={styles.faultTreeNode}>
                <strong>{branch.category}</strong>
                <span style={{ marginLeft: '12px' }}>
                  <Badge appearance="filled" style={{ backgroundColor: '#28a745', color: '#fff', marginRight: '6px' }} size="small">P: {branch.probability}</Badge>
                  <Badge appearance="filled" style={{ backgroundColor: branch.impact === 'High' ? '#fd7e14' : '#ffc107', color: '#1a1a1a' }} size="small">I: {branch.impact}</Badge>
                </span>
              </div>
              {branch.mitigations.map((m, j) => (
                <div key={j} className={styles.faultTreeLeaf}>
                  <Checkmark16Filled style={{ color: '#28a745', marginRight: '6px', verticalAlign: 'middle' }} />{m}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── 12. Contingency Plan (STATIC REFERENCE) ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>12. Contingency Plan</h3>
        <p className={styles.subsectionDesc}>Procedures for when the system cannot be restored within MTD and operations must continue through alternate means.</p>
        <ol className={styles.stepList}>
          {contingencySteps.map((step, i) => (
            <li key={i} className={styles.stepItem}>
              <Badge appearance="filled" color="brand" size="small" style={{ marginRight: '8px' }}>{i + 1}</Badge>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* ── 13. Role Assignment (INTERACTIVE) ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>13. Role Assignment</h3>
        <p className={styles.subsectionDesc}>
          Assign specific individuals to BCDR roles. Click any cell to edit names and details.
        </p>
        <div className={styles.sectionHeader}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={addRoleRow}>Add Row</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetRoles}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportRoles}>Export CSV</Button>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr>
              <th className={styles.th}>Role</th>
              <th className={styles.th}>Assigned To</th>
              <th className={styles.th}>Team</th>
              <th className={styles.thWrap}>Responsibility</th>
              <th className={styles.th}>Escalation</th>
              <th className={styles.thCenter} style={{ width: '40px' }}></th>
            </tr></thead>
            <tbody>
              {roleData.map((row, i) => (
                <tr key={i}>
                  {editCell(`role-${i}-r`, row.role, (v) => updateRole(i, 'role', v), styles.td, { fontWeight: 600 })}
                  {editCell(`role-${i}-n`, row.name, (v) => updateRole(i, 'name', v), styles.td)}
                  {editCell(`role-${i}-t`, row.team, (v) => updateRole(i, 'team', v), styles.td)}
                  {editCell(`role-${i}-resp`, row.responsibility, (v) => updateRole(i, 'responsibility', v), styles.td)}
                  {editCell(`role-${i}-esc`, row.escalation, (v) => updateRole(i, 'escalation', v), styles.td)}
                  <td className={styles.deleteCell}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => deleteRoleRow(i)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
