import { useState, useMemo } from 'react'
import {
  makeStyles, shorthands, mergeClasses, tokens,
  Badge, Button, Checkbox, TabList, Tab,
  type SelectTabData, type SelectTabEvent,
} from '@fluentui/react-components'
import {
  Checkmark16Filled, Dismiss16Filled, Warning16Filled,
  Add20Regular, Delete20Regular, ArrowReset20Regular, ArrowDownload20Regular,
} from '@fluentui/react-icons'
import { useWorkbenchData } from '../hooks/useWorkbenchData'
import { downloadCsv, objectsToCsvSheet } from '../utils/csvExport'
import { getCriticalityColor } from '../utils/criticality'
import HelpIcon from './HelpIcon'

/* ═══════ Styles ═══════ */
const useStyles = makeStyles({
  container: { maxWidth: '1200px', margin: '0 auto' },
  title: { fontSize: '36px', fontWeight: '600', marginBottom: '16px', color: tokens.colorNeutralForeground1 },
  desc: { fontSize: '16px', color: tokens.colorNeutralForeground2, lineHeight: '1.6', marginBottom: '24px' },
  tabContent: { paddingTop: '24px' },
  section: { marginBottom: '32px' },
  hdr: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' },
  sTitle: { fontSize: '20px', fontWeight: '600', color: tokens.colorNeutralForeground1 },
  sDesc: { marginBottom: '14px', lineHeight: '1.6', color: tokens.colorNeutralForeground2, fontSize: '14px' },
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginBottom: '14px' },
  metric: { ...shorthands.padding('14px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('8px'), textAlign: 'center' },
  metricVal: { fontSize: '22px', fontWeight: '700', color: tokens.colorBrandForeground1 },
  metricLbl: { fontSize: '12px', color: tokens.colorNeutralForeground3, marginTop: '3px' },
  highlight: { backgroundColor: tokens.colorBrandBackground2, ...shorthands.padding('16px'), ...shorthands.borderRadius(tokens.borderRadiusMedium), marginBottom: '20px', borderLeftWidth: '4px', borderLeftStyle: 'solid', borderLeftColor: tokens.colorBrandBackground },
  riskFormula: { ...shorthands.padding('20px'), ...shorthands.borderRadius('10px'), ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2), textAlign: 'center', marginBottom: '16px' },
  riskMatrix: { display: 'grid', gridTemplateColumns: '50px repeat(5, 1fr)', gap: '2px', marginBottom: '2px' },
  riskCell: { ...shorthands.padding('10px', '6px'), textAlign: 'center', fontWeight: '700', fontSize: '14px', ...shorthands.borderRadius('4px'), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  riskAxis: { display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '12px', color: tokens.colorNeutralForeground3 },
  legend: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px', ...shorthands.padding('8px', '12px'), backgroundColor: '#f8f9fa', ...shorthands.borderRadius('8px'), fontSize: '12px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '5px' },
  legendDot: { width: '10px', height: '10px', ...shorthands.borderRadius('3px'), display: 'inline-block' },
  note: { ...shorthands.padding('10px', '14px'), backgroundColor: '#f8f9fa', ...shorthands.borderRadius('8px'), fontSize: '13px', lineHeight: '1.5', color: tokens.colorNeutralForeground3, marginTop: '10px' },
})

/* ═══════ Types ═══════ */
interface BcpItem { component: string; description: string; done: boolean }
interface RiskRow { category: string; description: string; impact: number; probability: number }
interface MbcoRow { order: number; application: string; businessFunction: string; criticality: string; window: string; env: string; location: string; upstreamDeps: string; downstreamDeps: string; recovery: string }
interface CalendarRow { month: string; function_name: string; applications: string; notes: string }
interface BiaPortRow { application: string; criticality: string; slo: string; rto: string; rpo: string; mtd: string; impactCost: string; lastReview: string }
interface MaintRow { document: string; frequency: string; nextReview: string; owner: string; approver: string; status: 'current' | 'due-soon' | 'overdue' }
interface ActivityRow { date: string; event: string; application: string; notes: string }

/* ═══════ Defaults ═══════ */
const defBcp: BcpItem[] = [
  { component: 'Executive Summary', description: 'Overview of the BCP, its purpose and scope', done: false },
  { component: 'Plan Scope & Objectives', description: 'Define what is covered and goals', done: false },
  { component: 'Roles & Responsibilities', description: 'RACI and contact information', done: false },
  { component: 'Risk Assessment Summary', description: 'Key risks and mitigation strategies', done: false },
  { component: 'Business Impact Analysis', description: 'Criticality and recovery priorities', done: false },
  { component: 'Recovery Strategies', description: 'Detailed recovery procedures', done: false },
  { component: 'Emergency Response Procedures', description: 'Immediate response actions', done: false },
  { component: 'Communication Plans', description: 'Internal and external communication', done: false },
  { component: 'IT Disaster Recovery Plan', description: 'Technical recovery procedures', done: false },
  { component: 'Training & Awareness', description: 'Staff training programs', done: false },
  { component: 'Plan Testing & Exercises', description: 'Regular testing schedule', done: false },
  { component: 'Plan Maintenance', description: 'Review and update procedures', done: false },
]
const riskColor = (s: number) => s >= 20 ? '#dc3545' : s >= 15 ? '#fd7e14' : s >= 8 ? '#ffc107' : '#28a745'
const riskLevel = (s: number) => s >= 20 ? 'Critical' : s >= 15 ? 'High' : s >= 8 ? 'Medium' : 'Low'

const defRisks: RiskRow[] = [
  { category: 'Cyber Attack (DDoS)', description: 'Distributed denial of service', impact: 4, probability: 4 },
  { category: 'Data Breach', description: 'Unauthorized data access', impact: 5, probability: 3 },
  { category: 'Region Outage', description: 'Azure region failure', impact: 5, probability: 1 },
  { category: 'Zone Failure', description: 'Availability zone outage', impact: 3, probability: 2 },
  { category: 'Configuration Error', description: 'Human misconfiguration', impact: 3, probability: 4 },
  { category: 'Power Grid Failure', description: 'Data center power loss', impact: 4, probability: 1 },
  { category: 'Natural Disaster', description: 'Earthquake, flood affecting DC', impact: 5, probability: 1 },
  { category: 'Service Degradation', description: 'Azure service performance', impact: 2, probability: 4 },
]

const defMbco: MbcoRow[] = [
  { order: 1, application: 'Azure Platform Landing Zone', businessFunction: 'Identity (Entra ID)', criticality: 'Security Critical', window: 'At all times', env: 'Azure', location: 'Global', upstreamDeps: '\u2014', downstreamDeps: 'All services', recovery: 'Redeploy, Availability, Restore' },
  { order: 2, application: 'Azure Platform Landing Zone', businessFunction: 'DNS', criticality: 'Business Critical', window: 'At all times', env: 'Azure', location: 'Global', upstreamDeps: 'Identity', downstreamDeps: 'All apps', recovery: 'Redeploy, Availability, Restore' },
  { order: 2, application: 'Azure Platform Landing Zone', businessFunction: 'Recovery Services', criticality: 'Mission Critical', window: 'At all times', env: 'Azure', location: 'Australia East', upstreamDeps: 'Identity', downstreamDeps: 'All apps', recovery: 'Redeploy, Availability, Restore' },
  { order: 3, application: 'Mars Travel Bookings', businessFunction: 'Trip Bookings', criticality: 'Business Critical', window: 'At all times', env: 'Azure', location: 'Australia East', upstreamDeps: 'Identity, DNS, Recovery', downstreamDeps: 'Order Fulfillment', recovery: 'Redeploy, Availability, Restore' },
  { order: 3, application: 'Warehouse Inventory', businessFunction: 'Inventory Management', criticality: 'Business Critical', window: 'At all times', env: 'On-premises', location: 'Sydney', upstreamDeps: 'Identity, DNS', downstreamDeps: 'Mars Travel', recovery: 'Redeploy, Restore' },
  { order: 3, application: 'Lunar Orbit Control', businessFunction: 'Orbit Control', criticality: 'Safety Critical', window: 'Last week/month', env: 'Azure', location: 'Australia East', upstreamDeps: 'Identity, DNS', downstreamDeps: '\u2014', recovery: 'Redeploy, Availability, Restore' },
]

const defCalendar: CalendarRow[] = [
  { month: 'January', function_name: 'Annual Financial Close', applications: 'All financial apps', notes: 'No BCDR drills' },
  { month: 'March', function_name: 'Q1 Reporting', applications: 'ERP, Data Warehouse', notes: 'Reduced change window' },
  { month: 'April', function_name: 'Tax Filing Deadline', applications: 'Financial, Compliance', notes: 'Freeze period' },
  { month: 'September', function_name: 'Peak Travel Season', applications: 'Mars Travel Bookings', notes: 'High availability' },
  { month: 'November', function_name: 'Black Friday', applications: 'E-commerce, Payments', notes: 'Freeze period' },
  { month: 'December', function_name: 'Annual Planning', applications: 'ERP, HR', notes: 'Year-end close' },
]

const defBiaPort: BiaPortRow[] = [
  { application: 'Azure Platform Landing Zone', criticality: 'Mission Critical', slo: '99.999%', rto: '1h', rpo: '0h', mtd: '4h', impactCost: '$500,000', lastReview: '2025-01' },
  { application: 'Mars Travel Bookings', criticality: 'Business Critical', slo: '99.99%', rto: '4h', rpo: '1h', mtd: '24h', impactCost: '$50,000', lastReview: '2025-03' },
  { application: 'Warehouse Inventory', criticality: 'Business Critical', slo: '99.9%', rto: '8h', rpo: '4h', mtd: '48h', impactCost: '$30,000', lastReview: '2025-02' },
  { application: 'Lunar Orbit Control', criticality: 'Safety Critical', slo: '99.999%', rto: '0.5h', rpo: '0h', mtd: '1h', impactCost: '$1,000,000', lastReview: '2025-01' },
  { application: 'Complaints Management', criticality: 'High', slo: '99.9%', rto: '12h', rpo: '4h', mtd: '72h', impactCost: '$5,000', lastReview: '2025-03' },
]

const defMaint: MaintRow[] = [
  { document: 'Business Continuity Plan', frequency: 'Annually', nextReview: '2026-06-15', owner: 'BC Manager', approver: 'CTO', status: 'current' },
  { document: 'Business Risk Assessment', frequency: 'Semi-annually', nextReview: '2026-03-01', owner: 'Risk Manager', approver: 'CISO', status: 'due-soon' },
  { document: 'MBCO Recovery Order', frequency: 'Quarterly', nextReview: '2026-03-01', owner: 'IT Director', approver: 'CTO', status: 'overdue' },
  { document: 'BIA Portfolio Summary', frequency: 'Annually', nextReview: '2026-01-15', owner: 'BC Manager', approver: 'CFO', status: 'current' },
  { document: 'Critical Function Calendar', frequency: 'Quarterly', nextReview: '2026-03-15', owner: 'BC Manager', approver: 'CTO', status: 'due-soon' },
  { document: 'Training & Awareness', frequency: 'Annually', nextReview: '2026-07-01', owner: 'HR / BC Manager', approver: 'CTO', status: 'current' },
]

const defActivity: ActivityRow[] = [
  { date: '2026-03-28', event: 'Failover Drill Completed', application: 'Lunar Orbit Control', notes: 'RTO: 18 min (target: 30 min)' },
  { date: '2026-03-15', event: 'BIA Review Updated', application: 'Mars Travel Bookings', notes: 'Revenue impact revised' },
  { date: '2026-03-10', event: 'Backup Restore Test', application: 'Azure Platform', notes: 'Full restore in 45 min' },
  { date: '2026-03-01', event: 'Risk Assessment Updated', application: 'All', notes: 'Supply chain risk increased' },
  { date: '2026-02-28', event: 'Dashboard Review', application: 'All', notes: 'Monthly review complete' },
]

const statusValues: MaintRow['status'][] = ['current', 'due-soon', 'overdue']

/* ═══════ Helpers ═══════ */
function StatusIcon({ s }: { s: MaintRow['status'] }) {
  if (s === 'current') return <Checkmark16Filled style={{ color: '#28a745' }} />
  if (s === 'overdue') return <Dismiss16Filled style={{ color: '#dc3545' }} />
  return <Warning16Filled style={{ color: '#ffc107' }} />
}
function statusLabel(s: MaintRow['status']): string {
  return s === 'current' ? 'Current' : s === 'due-soon' ? 'Due Soon' : 'Overdue'
}
function statusColor(s: string): string {
  return s === 'current' ? '#28a745' : s === 'overdue' ? '#dc3545' : '#ffc107'
}

/* ═══════ Component ═══════ */
export default function Phase3BusinessContinuity() {
  const s = useStyles()
  const [tab, setTab] = useState<string>('planning')
  const [ec, setEc] = useState<string | null>(null)

  // All editable state with persistence
  const [bcp, setBcp, resetBcp] = useWorkbenchData<BcpItem[]>('phase3-bcp-checklist', defBcp)
  const [risks, setRisks, resetRisks] = useWorkbenchData<RiskRow[]>('phase3-risk-scenarios', defRisks)
  const [mbco, setMbco, resetMbco] = useWorkbenchData<MbcoRow[]>('phase3-mbco', defMbco)
  const [calendar, setCalendar, resetCal] = useWorkbenchData<CalendarRow[]>('phase3-calendar', defCalendar)
  const [biaPort, setBiaPort, resetBia] = useWorkbenchData<BiaPortRow[]>('phase3-bia-portfolio', defBiaPort)
  const [maint, setMaint, resetMaint] = useWorkbenchData<MaintRow[]>('phase3-maintenance', defMaint)
  const [activity, setActivity, resetActivity] = useWorkbenchData<ActivityRow[]>('phase3-activity', defActivity)

  const onTabSelect = (_: SelectTabEvent, d: SelectTabData) => setTab(d.value as string)

  // Edit cell helper
  const cell = (key: string, val: string, save: (v: string) => void, cls: string, extra?: React.CSSProperties) => {
    const editing = ec === key
    return (
      <td className={mergeClasses(cls, cls === s.tdC ? s.editC : s.edit)} onClick={() => !editing && setEc(key)} style={extra}>
        {editing ? <input autoFocus defaultValue={val} onBlur={e => { save(e.target.value); setEc(null) }} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEc(null) }} className={s.inp} /> : (val || '\u00A0')}
      </td>
    )
  }

  // 5x5 risk matrix
  const matrixRows = useMemo(() => {
    const rows: { impact: number; cells: { score: number; color: string }[] }[] = []
    for (let imp = 5; imp >= 1; imp--) {
      const cells: { score: number; color: string }[] = []
      for (let prob = 1; prob <= 5; prob++) { const sc = imp * prob; cells.push({ score: sc, color: riskColor(sc) }) }
      rows.push({ impact: imp, cells })
    }
    return rows
  }, [])

  // BCP completion
  const bcpDone = bcp.filter(b => b.done).length
  const bcpTotal = bcp.length

  // CSV exports
  const expBcp = () => downloadCsv('bcp_checklist.csv', objectsToCsvSheet('BCP', bcp.map(b => ({ Component: b.component, Description: b.description, Status: b.done ? 'Complete' : 'Pending' }))))
  const expRisks = () => downloadCsv('risk_assessment.csv', objectsToCsvSheet('Risks', risks.map(r => ({ ...r, Score: r.impact * r.probability, Level: riskLevel(r.impact * r.probability) })) as unknown as Record<string, unknown>[]))
  const expMbco = () => downloadCsv('mbco_recovery_order.csv', objectsToCsvSheet('MBCO', mbco as unknown as Record<string, unknown>[]))
  const expCal = () => downloadCsv('critical_function_calendar.csv', objectsToCsvSheet('Calendar', calendar as unknown as Record<string, unknown>[]))
  const expBia = () => downloadCsv('bia_portfolio.csv', objectsToCsvSheet('BIA', biaPort as unknown as Record<string, unknown>[]))
  const expMaint = () => downloadCsv('maintain_bc.csv', objectsToCsvSheet('Maintenance', maint.map(m => ({ ...m, status: statusLabel(m.status) })) as unknown as Record<string, unknown>[]))
  const expAct = () => downloadCsv('activity_log.csv', objectsToCsvSheet('Activity', activity as unknown as Record<string, unknown>[]))

  return (
    <div className={s.container}>
      <h1 className={s.title}>Phase 3: Business Continuity</h1>
      <p className={s.desc}>Coordinate application continuity plans into a comprehensive business continuity strategy.</p>

      <div className={s.highlight}>
        <h3>Key Objective</h3>
        <p>Combine and coordinate application continuity plans for all critical applications. Define recovery priorities, manage risks, and establish comprehensive governance.</p>
      </div>

      <TabList selectedValue={tab} onTabSelect={onTabSelect}>
        <Tab value="planning">Planning &amp; Risk</Tab>
        <Tab value="mbco">MBCO &amp; Portfolio</Tab>
        <Tab value="operations">Operations</Tab>
        <Tab value="maintenance">Maintenance</Tab>
      </TabList>

      <div className={s.tabContent}>
        {/* ═══════ TAB 1: PLANNING & RISK ═══════ */}
        {tab === 'planning' && (<>
          {/* 1. BCP Checklist */}
          <div className={s.section}>
            <div className={s.hdr}>
              <h3 className={s.sTitle}>1. BCP Document Checklist</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button icon={<Add20Regular />} size="small" onClick={() => setBcp([...bcp, { component: '', description: '', done: false }])}>Add</Button>
                <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetBcp}>Reset</Button>
                <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expBcp}>CSV</Button>
              </div>
            </div>
            <div className={s.grid}>
              <div className={s.metric}><div className={s.metricVal}>{bcpDone}/{bcpTotal}</div><div className={s.metricLbl}>Completed</div></div>
              <div className={s.metric}><div className={s.metricVal}>{bcpTotal > 0 ? Math.round(bcpDone / bcpTotal * 100) : 0}%</div><div className={s.metricLbl}>Progress</div></div>
            </div>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead><tr><th className={s.thC} style={{ width: 40 }}>Done</th><th className={s.th}>Component</th><th className={s.thW}>Description</th><th className={s.thC} style={{ width: 36 }}></th></tr></thead>
                <tbody>
                  {bcp.map((b, i) => (
                    <tr key={i} style={b.done ? { opacity: 0.6 } : undefined}>
                      <td className={s.tdC}><Checkbox checked={b.done} onChange={(_, d) => setBcp(bcp.map((x, j) => j === i ? { ...x, done: !!d.checked } : x))} /></td>
                      {cell(`bcp-${i}-c`, b.component, v => setBcp(bcp.map((x, j) => j === i ? { ...x, component: v } : x)), s.td, { fontWeight: 600 })}
                      {cell(`bcp-${i}-d`, b.description, v => setBcp(bcp.map((x, j) => j === i ? { ...x, description: v } : x)), s.td)}
                      <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setBcp(bcp.filter((_, j) => j !== i))} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Risk Assessment */}
          <div className={s.section}>
            <div className={s.hdr}>
              <h3 className={s.sTitle}>
                2. Business Risk Assessment
                <HelpIcon title="Risk Assessment">
                  Identify threats and evaluate their likelihood and impact.
                  <ul style={{ margin: '6px 0 0 14px', fontSize: '12px' }}>
                    <li><strong>Impact</strong> (1-5): Severity of the disruption</li>
                    <li><strong>Probability</strong> (1-5): Likelihood of occurrence</li>
                    <li><strong>Score</strong> = Impact x Probability</li>
                    <li>Critical (20-25), High (15-19), Medium (8-14), Low (1-7)</li>
                  </ul>
                </HelpIcon>
              </h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button icon={<Add20Regular />} size="small" onClick={() => setRisks([...risks, { category: '', description: '', impact: 3, probability: 3 }])}>Add</Button>
                <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetRisks}>Reset</Button>
                <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expRisks}>CSV</Button>
              </div>
            </div>
            <div className={s.riskFormula}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>RISK = IMPACT &times; PROBABILITY</div>
              <div style={{ fontSize: '13px', color: '#718096' }}>Impact 1-5 | Probability 1-5</div>
            </div>
            <div className={s.legend}>
              <div className={s.legendItem}><span className={s.legendDot} style={{ backgroundColor: '#dc3545' }} />Critical (20-25)</div>
              <div className={s.legendItem}><span className={s.legendDot} style={{ backgroundColor: '#fd7e14' }} />High (15-19)</div>
              <div className={s.legendItem}><span className={s.legendDot} style={{ backgroundColor: '#ffc107' }} />Medium (8-14)</div>
              <div className={s.legendItem}><span className={s.legendDot} style={{ backgroundColor: '#28a745' }} />Low (1-7)</div>
            </div>
            {/* 5x5 matrix */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontWeight: 700, fontSize: '13px' }}>IMPACT</div>
              <div style={{ flex: 1 }}>
                {matrixRows.map(row => (
                  <div key={row.impact} className={s.riskMatrix}>
                    <div className={s.riskAxis}>{row.impact}</div>
                    {row.cells.map((c, ci) => (
                      <div key={ci} className={s.riskCell} style={{ backgroundColor: c.color, color: c.color === '#ffc107' ? '#1a1a1a' : '#fff' }}>{c.score}</div>
                    ))}
                  </div>
                ))}
                <div className={s.riskMatrix}>
                  <div />{[1,2,3,4,5].map(n => <div key={n} className={s.riskAxis}>{n}</div>)}
                </div>
                <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '13px' }}>PROBABILITY &rarr;</div>
              </div>
            </div>
            {/* Risk table */}
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead><tr><th className={s.th}>Category</th><th className={s.thW}>Description</th><th className={s.thC}>Impact</th><th className={s.thC}>Prob</th><th className={s.thC}>Score</th><th className={s.thC}>Level</th><th className={s.thC} style={{ width: 36 }}></th></tr></thead>
                <tbody>
                  {risks.map((r, i) => {
                    const sc = r.impact * r.probability
                    return (
                      <tr key={i}>
                        {cell(`risk-${i}-c`, r.category, v => setRisks(risks.map((x, j) => j === i ? { ...x, category: v } : x)), s.td, { fontWeight: 600 })}
                        {cell(`risk-${i}-d`, r.description, v => setRisks(risks.map((x, j) => j === i ? { ...x, description: v } : x)), s.td)}
                        <td className={s.tdC}>
                          <select value={r.impact} onChange={ev => setRisks(risks.map((x, j) => j === i ? { ...x, impact: Number(ev.target.value) } : x))} style={{ width: 40, textAlign: 'center' }}>
                            {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </td>
                        <td className={s.tdC}>
                          <select value={r.probability} onChange={ev => setRisks(risks.map((x, j) => j === i ? { ...x, probability: Number(ev.target.value) } : x))} style={{ width: 40, textAlign: 'center' }}>
                            {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </td>
                        <td className={s.tdC}><strong style={{ color: riskColor(sc) }}>{sc}</strong></td>
                        <td className={s.tdC}><Badge appearance="filled" style={{ backgroundColor: riskColor(sc), color: riskColor(sc) === '#ffc107' ? '#1a1a1a' : '#fff' }} size="small">{riskLevel(sc)}</Badge></td>
                        <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setRisks(risks.filter((_, j) => j !== i))} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>)}

        {/* ═══════ TAB 2: MBCO & PORTFOLIO ═══════ */}
        {tab === 'mbco' && (<>
          {/* 3. MBCO Recovery Order */}
          <div className={s.section}>
            <div className={s.hdr}>
              <h3 className={s.sTitle}>3. MBCO &mdash; Application Recovery Order</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button icon={<Add20Regular />} size="small" onClick={() => setMbco([...mbco, { order: mbco.length + 1, application: '', businessFunction: '', criticality: 'High', window: 'At all times', env: 'Azure', location: '', upstreamDeps: '', downstreamDeps: '', recovery: '' }])}>Add</Button>
                <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetMbco}>Reset</Button>
                <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expMbco}>CSV</Button>
              </div>
            </div>
            <p className={s.sDesc}>Define recovery order respecting dependencies. Same order = simultaneous recovery.</p>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead><tr>
                  <th className={s.thC}>Order</th><th className={s.th}>Application</th><th className={s.thW}>Business Function</th><th className={s.thC}>Criticality</th><th className={s.th}>Window</th><th className={s.thC}>Env</th><th className={s.thW}>Location</th><th className={s.thW}>Upstream</th><th className={s.thW}>Downstream</th><th className={s.thW}>Recovery</th><th className={s.thC} style={{ width: 36 }}></th>
                </tr></thead>
                <tbody>
                  {mbco.map((r, i) => {
                    const cc = getCriticalityColor(r.criticality)
                    return (
                      <tr key={i}>
                        <td className={s.tdC}>
                          <select value={r.order} onChange={ev => setMbco(mbco.map((x, j) => j === i ? { ...x, order: Number(ev.target.value) } : x))} style={{ width: 40, textAlign: 'center' }}>
                            {[1,2,3,4,5,6,7,8,9,10].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </td>
                        {cell(`mb-${i}-app`, r.application, v => setMbco(mbco.map((x, j) => j === i ? { ...x, application: v } : x)), s.td, { fontWeight: 600 })}
                        {cell(`mb-${i}-fn`, r.businessFunction, v => setMbco(mbco.map((x, j) => j === i ? { ...x, businessFunction: v } : x)), s.td)}
                        <td className={s.tdC}><Badge appearance="filled" style={{ backgroundColor: cc.color, color: cc.textColor }} size="small">{r.criticality}</Badge></td>
                        {cell(`mb-${i}-w`, r.window, v => setMbco(mbco.map((x, j) => j === i ? { ...x, window: v } : x)), s.td)}
                        <td className={s.tdC}><Badge appearance="outline" color={r.env === 'Azure' ? 'brand' : 'warning'} size="small">{r.env}</Badge></td>
                        {cell(`mb-${i}-loc`, r.location, v => setMbco(mbco.map((x, j) => j === i ? { ...x, location: v } : x)), s.td)}
                        {cell(`mb-${i}-up`, r.upstreamDeps, v => setMbco(mbco.map((x, j) => j === i ? { ...x, upstreamDeps: v } : x)), s.td)}
                        {cell(`mb-${i}-dn`, r.downstreamDeps, v => setMbco(mbco.map((x, j) => j === i ? { ...x, downstreamDeps: v } : x)), s.td)}
                        {cell(`mb-${i}-rec`, r.recovery, v => setMbco(mbco.map((x, j) => j === i ? { ...x, recovery: v } : x)), s.td)}
                        <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setMbco(mbco.filter((_, j) => j !== i))} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. BIA Portfolio */}
          <div className={s.section}>
            <div className={s.hdr}>
              <h3 className={s.sTitle}>4. BIA Portfolio Summary</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button icon={<Add20Regular />} size="small" onClick={() => setBiaPort([...biaPort, { application: '', criticality: 'High', slo: '', rto: '', rpo: '', mtd: '', impactCost: '', lastReview: '' }])}>Add</Button>
                <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetBia}>Reset</Button>
                <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expBia}>CSV</Button>
              </div>
            </div>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead><tr><th className={s.th}>Application</th><th className={s.thC}>Criticality</th><th className={s.thC}>SLO</th><th className={s.thC}>RTO</th><th className={s.thC}>RPO</th><th className={s.thC}>MTD</th><th className={s.thC}>Impact/hr</th><th className={s.thC}>Last Review</th><th className={s.thC} style={{ width: 36 }}></th></tr></thead>
                <tbody>
                  {biaPort.map((r, i) => {
                    const cc = getCriticalityColor(r.criticality)
                    return (
                      <tr key={i}>
                        {cell(`bp-${i}-app`, r.application, v => setBiaPort(biaPort.map((x, j) => j === i ? { ...x, application: v } : x)), s.td, { fontWeight: 600 })}
                        <td className={s.tdC}><Badge appearance="filled" style={{ backgroundColor: cc.color, color: cc.textColor }} size="small">{r.criticality}</Badge></td>
                        {cell(`bp-${i}-slo`, r.slo, v => setBiaPort(biaPort.map((x, j) => j === i ? { ...x, slo: v } : x)), s.tdC)}
                        {cell(`bp-${i}-rto`, r.rto, v => setBiaPort(biaPort.map((x, j) => j === i ? { ...x, rto: v } : x)), s.tdC)}
                        {cell(`bp-${i}-rpo`, r.rpo, v => setBiaPort(biaPort.map((x, j) => j === i ? { ...x, rpo: v } : x)), s.tdC)}
                        {cell(`bp-${i}-mtd`, r.mtd, v => setBiaPort(biaPort.map((x, j) => j === i ? { ...x, mtd: v } : x)), s.tdC)}
                        {cell(`bp-${i}-cost`, r.impactCost, v => setBiaPort(biaPort.map((x, j) => j === i ? { ...x, impactCost: v } : x)), s.tdC, { fontWeight: 600 })}
                        {cell(`bp-${i}-rev`, r.lastReview, v => setBiaPort(biaPort.map((x, j) => j === i ? { ...x, lastReview: v } : x)), s.tdC)}
                        <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setBiaPort(biaPort.filter((_, j) => j !== i))} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>)}

        {/* ═══════ TAB 3: OPERATIONS ═══════ */}
        {tab === 'operations' && (<>
          {/* 5. Critical Function Calendar */}
          <div className={s.section}>
            <div className={s.hdr}>
              <h3 className={s.sTitle}>5. Business Critical Function Calendar</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button icon={<Add20Regular />} size="small" onClick={() => setCalendar([...calendar, { month: '', function_name: '', applications: '', notes: '' }])}>Add</Button>
                <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetCal}>Reset</Button>
                <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expCal}>CSV</Button>
              </div>
            </div>
            <p className={s.sDesc}>Critical business dates to avoid BCDR drills during. Click any cell to edit.</p>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead><tr><th className={s.th}>Month</th><th className={s.th}>Critical Function</th><th className={s.thW}>Applications</th><th className={s.thW}>Notes</th><th className={s.thC} style={{ width: 36 }}></th></tr></thead>
                <tbody>
                  {calendar.map((r, i) => (
                    <tr key={i}>
                      {cell(`cal-${i}-m`, r.month, v => setCalendar(calendar.map((x, j) => j === i ? { ...x, month: v } : x)), s.td, { fontWeight: 600 })}
                      {cell(`cal-${i}-fn`, r.function_name, v => setCalendar(calendar.map((x, j) => j === i ? { ...x, function_name: v } : x)), s.td)}
                      {cell(`cal-${i}-app`, r.applications, v => setCalendar(calendar.map((x, j) => j === i ? { ...x, applications: v } : x)), s.td)}
                      {cell(`cal-${i}-n`, r.notes, v => setCalendar(calendar.map((x, j) => j === i ? { ...x, notes: v } : x)), s.td)}
                      <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setCalendar(calendar.filter((_, j) => j !== i))} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. BCDR Dashboard */}
          <div className={s.section}>
            <div className={s.hdr}>
              <h3 className={s.sTitle}>6. BCDR Dashboard</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expAct}>CSV</Button>
              </div>
            </div>
            <div className={s.grid}>
              <div className={s.metric}><div className={s.metricVal}>{biaPort.length}</div><div className={s.metricLbl}>Applications</div></div>
              <div className={s.metric}><div className={s.metricVal}>{bcpDone}/{bcpTotal}</div><div className={s.metricLbl}>BCP Complete</div></div>
              <div className={s.metric}><div className={s.metricVal}>{risks.filter(r => r.impact * r.probability >= 15).length}</div><div className={s.metricLbl}>High/Critical Risks</div></div>
              <div className={s.metric}><div className={s.metricVal}>{maint.filter(m => m.status === 'overdue').length}</div><div className={s.metricLbl}>Overdue Reviews</div></div>
            </div>

            <h4 style={{ marginBottom: '10px' }}>Activity Log</h4>
            <div className={s.hdr}>
              <div />
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button icon={<Add20Regular />} size="small" onClick={() => setActivity([{ date: new Date().toISOString().slice(0, 10), event: '', application: '', notes: '' }, ...activity])}>Add</Button>
                <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetActivity}>Reset</Button>
              </div>
            </div>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead><tr><th className={s.th}>Date</th><th className={s.th}>Event</th><th className={s.th}>Application</th><th className={s.thW}>Notes</th><th className={s.thC} style={{ width: 36 }}></th></tr></thead>
                <tbody>
                  {activity.map((r, i) => (
                    <tr key={i}>
                      {cell(`act-${i}-d`, r.date, v => setActivity(activity.map((x, j) => j === i ? { ...x, date: v } : x)), s.td, { fontWeight: 600 })}
                      {cell(`act-${i}-e`, r.event, v => setActivity(activity.map((x, j) => j === i ? { ...x, event: v } : x)), s.td)}
                      {cell(`act-${i}-a`, r.application, v => setActivity(activity.map((x, j) => j === i ? { ...x, application: v } : x)), s.td)}
                      {cell(`act-${i}-n`, r.notes, v => setActivity(activity.map((x, j) => j === i ? { ...x, notes: v } : x)), s.td)}
                      <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setActivity(activity.filter((_, j) => j !== i))} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>)}

        {/* ═══════ TAB 4: MAINTENANCE ═══════ */}
        {tab === 'maintenance' && (
          <div className={s.section}>
            <div className={s.hdr}>
              <h3 className={s.sTitle}>7. Maintain Business Continuity</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button icon={<Add20Regular />} size="small" onClick={() => setMaint([...maint, { document: '', frequency: '', nextReview: '', owner: '', approver: '', status: 'current' }])}>Add</Button>
                <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetMaint}>Reset</Button>
                <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={expMaint}>CSV</Button>
              </div>
            </div>
            <p className={s.sDesc}>Review schedule for all BC documentation. Click status badges to cycle. Click cells to edit.</p>
            <div className={s.legend}>
              <div className={s.legendItem}><Checkmark16Filled style={{ color: '#28a745' }} /> Current</div>
              <div className={s.legendItem}><Warning16Filled style={{ color: '#ffc107' }} /> Due Soon</div>
              <div className={s.legendItem}><Dismiss16Filled style={{ color: '#dc3545' }} /> Overdue</div>
            </div>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead><tr><th className={s.thW}>Document</th><th className={s.thC}>Frequency</th><th className={s.thC}>Next Review</th><th className={s.th}>Owner</th><th className={s.th}>Approver</th><th className={s.thC}>Status</th><th className={s.thC} style={{ width: 36 }}></th></tr></thead>
                <tbody>
                  {maint.map((r, i) => (
                    <tr key={i}>
                      {cell(`mt-${i}-doc`, r.document, v => setMaint(maint.map((x, j) => j === i ? { ...x, document: v } : x)), s.td, { fontWeight: 600 })}
                      {cell(`mt-${i}-freq`, r.frequency, v => setMaint(maint.map((x, j) => j === i ? { ...x, frequency: v } : x)), s.tdC)}
                      {cell(`mt-${i}-next`, r.nextReview, v => setMaint(maint.map((x, j) => j === i ? { ...x, nextReview: v } : x)), s.tdC)}
                      {cell(`mt-${i}-own`, r.owner, v => setMaint(maint.map((x, j) => j === i ? { ...x, owner: v } : x)), s.td)}
                      {cell(`mt-${i}-app`, r.approver, v => setMaint(maint.map((x, j) => j === i ? { ...x, approver: v } : x)), s.td)}
                      <td className={s.tdC} style={{ cursor: 'pointer' }} onClick={() => setMaint(maint.map((x, j) => j === i ? { ...x, status: statusValues[(statusValues.indexOf(x.status) + 1) % statusValues.length] } : x))}>
                        <Badge appearance="filled" style={{ backgroundColor: statusColor(r.status), color: r.status === 'due-soon' ? '#1a1a1a' : '#fff' }}>
                          <StatusIcon s={r.status} />&nbsp;{statusLabel(r.status)}
                        </Badge>
                      </td>
                      <td className={s.del}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setMaint(maint.filter((_, j) => j !== i))} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={s.note}>
              <strong>Best Practice:</strong> Trigger ad-hoc reviews for organizational changes, new threats, or major incidents.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
