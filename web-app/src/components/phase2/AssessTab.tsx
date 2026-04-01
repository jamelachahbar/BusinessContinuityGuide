import { useState, useMemo } from 'react'
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
} from '@fluentui/react-components'
import {
  Checkmark16Filled,
  Dismiss16Filled,
  Subtract16Filled,
  Add20Regular,
  Delete20Regular,
  ArrowReset20Regular,
  ArrowDownload20Regular,
} from '@fluentui/react-icons'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import { useWorkbenchData } from '../../hooks/useWorkbenchData'
import { downloadCsv, objectsToCsvSheet } from '../../utils/csvExport'
import ServiceMap from './ServiceMap'

/* ────────────────────────────────────────────────────
   Styles
   ──────────────────────────────────────────────────── */

const useStyles = makeStyles({
  section: { marginBottom: '32px' },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' },
  sectionHeaderTitle: { fontSize: '24px', fontWeight: '600', color: tokens.colorNeutralForeground1, marginBottom: '0' },
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
  addRowButton: { marginTop: '8px', marginBottom: '8px' },
  legend: { display: 'flex', flexWrap: 'wrap', columnGap: '16px', rowGap: '8px', marginBottom: '16px', ...shorthands.padding('12px', '16px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('8px') },
  legendItem: { display: 'flex', alignItems: 'center', columnGap: '6px', fontSize: '14px' },
  note: { ...shorthands.padding('12px', '16px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('8px'), marginBottom: '16px', fontSize: '14px', lineHeight: '1.5', color: tokens.colorNeutralForeground2 },
  link: { color: tokens.colorBrandForeground1, textDecoration: 'none', ':hover': { textDecoration: 'underline' } },
  card: { marginBottom: '16px', ...shorthands.padding('20px') },
  cardTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: tokens.colorBrandForeground1 },
  list: { marginLeft: '24px', marginTop: '12px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' },
  summaryCard: { ...shorthands.padding('16px', '20px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('8px'), textAlign: 'center' },
  summaryValue: { fontSize: '24px', fontWeight: '700', color: tokens.colorBrandForeground1 },
  summaryLabel: { fontSize: '13px', color: tokens.colorNeutralForeground3, marginTop: '4px' },
  faultTreeRoot: { ...shorthands.padding('16px', '20px'), backgroundColor: '#dc3545', color: '#ffffff', fontWeight: '600', fontSize: '16px', ...shorthands.borderRadius('8px'), marginBottom: '12px', textAlign: 'center' },
  faultTreeBranch: { marginLeft: '24px', ...shorthands.borderLeft('3px', 'solid', tokens.colorNeutralStroke1), ...shorthands.padding('0', '0', '0', '16px') },
  faultTreeNode: { ...shorthands.padding('10px', '16px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('6px'), marginBottom: '8px', fontSize: '14px' },
  faultTreeLeaf: { ...shorthands.padding('8px', '14px'), backgroundColor: tokens.colorNeutralBackground1, ...shorthands.borderRadius('4px'), marginBottom: '6px', fontSize: '13px', ...shorthands.borderLeft('3px', 'solid', tokens.colorNeutralStroke2), marginLeft: '24px' },
  flowContainer: { height: '520px', ...shorthands.borderRadius('8px'), ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2), marginBottom: '16px', backgroundColor: '#ffffff' },
  chartCard: { ...shorthands.padding('20px'), backgroundColor: '#ffffff', ...shorthands.borderRadius('8px'), ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2), marginBottom: '16px' },
  filterBar: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' },
  statusIcon: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
})

/* ────────────────────────────────────────────────────
   Types & Default Data
   ──────────────────────────────────────────────────── */

type RequirementStatus = 'required' | 'not-required' | 'na'

interface RequirementRow {
  category: string
  requirement: string
  status: RequirementStatus
  adr: string
}

const defaultRequirements: RequirementRow[] = [
  { category: 'Availability', requirement: 'Multi-region deployment', status: 'required', adr: 'Active-passive with Azure Traffic Manager' },
  { category: 'Availability', requirement: 'Zone redundancy', status: 'required', adr: 'All services deployed across 3 AZs' },
  { category: 'Availability', requirement: 'Load balancing', status: 'required', adr: 'Azure Application Gateway with WAF v2' },
  { category: 'Recovery', requirement: 'RTO < 4 hours', status: 'required', adr: 'Automated failover achieves ~15 min RTO' },
  { category: 'Recovery', requirement: 'RPO < 1 hour', status: 'required', adr: 'Continuous replication configured' },
  { category: 'Recovery', requirement: 'Geo-redundant backups', status: 'required', adr: 'GRS storage with 30-day retention' },
  { category: 'Deployment', requirement: 'Infrastructure as Code', status: 'required', adr: 'Bicep templates in source control' },
  { category: 'Deployment', requirement: 'Blue-green deployments', status: 'not-required', adr: 'Not required \u2014 canary rollout sufficient' },
  { category: 'Monitoring', requirement: 'Application Insights APM', status: 'required', adr: 'Full APM configured with custom dashboards' },
  { category: 'Monitoring', requirement: 'Centralized logging', status: 'required', adr: 'Log Analytics workspace with 90-day retention' },
  { category: 'Security', requirement: 'DDoS Protection', status: 'required', adr: 'Standard tier enabled on VNet' },
  { category: 'Security', requirement: 'WAF policy', status: 'required', adr: 'OWASP 3.2 rule set on Application Gateway' },
  { category: 'Compliance', requirement: 'Data residency', status: 'required', adr: 'Australia East + Australia Southeast' },
  { category: 'Compliance', requirement: 'SOC 2 Type II', status: 'na', adr: 'N/A \u2014 not in regulatory scope' },
  { category: 'Testing', requirement: 'Quarterly failover drills', status: 'required', adr: 'Automated failover test pipeline configured' },
]

interface BiaMetricRow {
  metric: string
  value: string
  notes: string
}

const defaultBiaMetrics: BiaMetricRow[] = [
  { metric: 'Composite SLO', value: '99.95%', notes: 'Based on service chain calculation' },
  { metric: 'RTO', value: '4 hours', notes: 'Maximum acceptable recovery time' },
  { metric: 'RPO', value: '1 hour', notes: 'Maximum acceptable data loss' },
  { metric: 'MTD', value: '24 hours', notes: 'Maximum tolerable downtime before severe impact' },
  { metric: 'Throughput Objective', value: '1,000 TPS', notes: 'Minimum transactions per second during recovery' },
  { metric: 'Response Objective', value: '200 ms', notes: 'Maximum acceptable response time (p95)' },
  { metric: 'Revenue Impact (per hour)', value: '$50,000', notes: 'Estimated direct business loss during outage' },
  { metric: 'Daily Active Users', value: '10,000', notes: 'Average daily usage' },
]

interface BiaDependencyGroup {
  direction: string
  items: string[]
}

const defaultBiaDeps: BiaDependencyGroup[] = [
  { direction: 'Upstream', items: ['Customer Web Portal', 'Mobile Application', 'Partner API Gateway', 'CDN (static assets)'] },
  { direction: 'Downstream', items: ['Payment Processing Service', 'Email / Notification Service', 'Reporting Data Warehouse', 'Third-party CRM Integration'] },
]

const faultTreeBefore = [
  { category: 'Infrastructure Failure', probability: 'Medium', impact: 'High', causes: ['Availability zone outage', 'Region-wide outage', 'Network connectivity failure', 'DNS resolution failure'] },
  { category: 'Application Failure', probability: 'Medium', impact: 'High', causes: ['Unhandled code exceptions', 'Configuration drift / error', 'Dependency service timeout', 'Memory leak / resource exhaustion'] },
  { category: 'Data Issues', probability: 'Low', impact: 'Critical', causes: ['Data corruption (application bug)', 'Accidental deletion', 'Replication lag / inconsistency', 'Schema migration failure'] },
  { category: 'Security Incident', probability: 'Low', impact: 'Critical', causes: ['DDoS attack', 'Credential compromise', 'Ransomware / malware', 'Supply chain vulnerability'] },
]

type GapStatus = 'met' | 'partial' | 'gap'

interface GapRow {
  component: string
  category: string
  sla: string
  ha: string
  dr: string
  gap: GapStatus
}

const defaultGapData: GapRow[] = [
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

interface MetricRow {
  component: string
  availability: string
  reliability: string
  security: string
  composite: string
}

const defaultMetricAnalysis: MetricRow[] = [
  { component: 'App Service', availability: '99.95%', reliability: '95%', security: '80%', composite: '91.7%' },
  { component: 'Azure SQL', availability: '99.99%', reliability: '98%', security: '90%', composite: '96.0%' },
  { component: 'Redis Cache', availability: '99.9%', reliability: '90%', security: '75%', composite: '88.3%' },
  { component: 'Service Bus', availability: '99.9%', reliability: '92%', security: '85%', composite: '92.3%' },
  { component: 'Storage Account', availability: '99.9%', reliability: '95%', security: '80%', composite: '91.6%' },
  { component: 'Azure Functions', availability: '99.95%', reliability: '93%', security: '82%', composite: '91.7%' },
]

/* ────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────── */

const reqStatusValues: RequirementStatus[] = ['required', 'not-required', 'na']
const gapStatusValues: GapStatus[] = ['met', 'partial', 'gap']

function cycleReqStatus(current: RequirementStatus): RequirementStatus {
  return reqStatusValues[(reqStatusValues.indexOf(current) + 1) % reqStatusValues.length]
}

function cycleGapStatus(current: GapStatus): GapStatus {
  return gapStatusValues[(gapStatusValues.indexOf(current) + 1) % gapStatusValues.length]
}

function GapStatusBadge({ gap, onClick }: { gap: GapStatus; onClick?: () => void }) {
  const cfg = gap === 'met'
    ? { label: 'Met', color: '#28a745', Icon: Checkmark16Filled }
    : gap === 'partial'
      ? { label: 'Partial', color: '#ffc107', Icon: Subtract16Filled }
      : { label: 'Gap', color: '#dc3545', Icon: Dismiss16Filled }
  return (
    <Badge
      appearance="filled"
      style={{ backgroundColor: cfg.color, color: cfg.color === '#ffc107' ? '#1a1a1a' : '#ffffff', cursor: onClick ? 'pointer' : undefined }}
      onClick={onClick}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <cfg.Icon style={{ fontSize: '12px' }} /> {cfg.label}
      </span>
    </Badge>
  )
}

const CHART_COLORS = { met: '#28a745', partial: '#ffc107', gap: '#dc3545' }

/* ────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────── */

export default function AssessTab() {
  const styles = useStyles()

  /* ── Editable state ── */
  const [requirements, setRequirements, resetReqs] = useWorkbenchData<RequirementRow[]>('phase2-requirements', defaultRequirements)
  const [biaMetrics, setBiaMetrics, resetBia] = useWorkbenchData<BiaMetricRow[]>('phase2-bia-metrics', defaultBiaMetrics)
  const [biaDeps, setBiaDeps] = useWorkbenchData<BiaDependencyGroup[]>('phase2-bia-deps', defaultBiaDeps)
  const [gapData, setGapData, resetGap] = useWorkbenchData<GapRow[]>('phase2-gap-assessment', defaultGapData)
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('All')

  /* ── Helpers ── */
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

  /* ── Requirements helpers ── */
  const categories = useMemo(() => ['All', ...Array.from(new Set(requirements.map(r => r.category)))], [requirements])
  const filteredReqs = categoryFilter === 'All' ? requirements : requirements.filter(r => r.category === categoryFilter)
  const updateReq = <K extends keyof RequirementRow>(idx: number, field: K, value: RequirementRow[K]) => {
    const realIdx = categoryFilter === 'All' ? idx : requirements.indexOf(filteredReqs[idx])
    setRequirements(requirements.map((r, i) => i === realIdx ? { ...r, [field]: value } : r))
  }
  const addReq = () => setRequirements([...requirements, { category: '', requirement: '', status: 'required', adr: '' }])
  const deleteReq = (idx: number) => {
    const realIdx = categoryFilter === 'All' ? idx : requirements.indexOf(filteredReqs[idx])
    setRequirements(requirements.filter((_, i) => i !== realIdx))
  }

  /* ── BIA helpers ── */
  const updateBia = <K extends keyof BiaMetricRow>(idx: number, field: K, value: BiaMetricRow[K]) => {
    setBiaMetrics(biaMetrics.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }
  const addBiaRow = () => setBiaMetrics([...biaMetrics, { metric: '', value: '', notes: '' }])
  const deleteBiaRow = (idx: number) => setBiaMetrics(biaMetrics.filter((_, i) => i !== idx))
  const updateDepItem = (gi: number, ii: number, value: string) => {
    setBiaDeps(biaDeps.map((g, i) => i === gi ? { ...g, items: g.items.map((item, j) => j === ii ? value : item) } : g))
  }
  const addDepItem = (gi: number) => setBiaDeps(biaDeps.map((g, i) => i === gi ? { ...g, items: [...g.items, ''] } : g))

  /* ── Gap helpers ── */
  const updateGap = <K extends keyof GapRow>(idx: number, field: K, value: GapRow[K]) => {
    setGapData(gapData.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }
  const gapChartData = useMemo(() => {
    const counts = { met: 0, partial: 0, gap: 0 }
    gapData.forEach(r => counts[r.gap]++)
    return [
      { name: 'Met', value: counts.met },
      { name: 'Partial', value: counts.partial },
      { name: 'Gap', value: counts.gap },
    ].filter(d => d.value > 0)
  }, [gapData])

  /* ── Metric Analysis radar data ── */
  const radarData = useMemo(() =>
    defaultMetricAnalysis.map(r => ({
      component: r.component,
      availability: parseFloat(r.availability),
      reliability: parseFloat(r.reliability),
      security: parseFloat(r.security),
    })),
  [])

  /* ── CSV exports ── */
  const exportReqs = () => downloadCsv('phase2_requirements.csv', objectsToCsvSheet('Requirements', requirements as unknown as Record<string, unknown>[]))
  const exportBia = () => downloadCsv('phase2_bia_metrics.csv', objectsToCsvSheet('BIA', biaMetrics as unknown as Record<string, unknown>[]))
  const exportGap = () => downloadCsv('phase2_gap_assessment.csv', objectsToCsvSheet('GapAssessment', gapData as unknown as Record<string, unknown>[]))
  const exportMetrics = () => downloadCsv('phase2_metric_analysis.csv', objectsToCsvSheet('MetricAnalysis', defaultMetricAnalysis as unknown as Record<string, unknown>[]))

  return (
    <Accordion collapsible multiple>
      {/* ── 1. Requirements & ADR ── */}
      <AccordionItem value="requirements-adr">
        <AccordionHeader>1. Requirements &amp; Architecture Decision Record</AccordionHeader>
        <AccordionPanel>
          <p className={styles.subsectionDesc}>
            Document BCDR requirements for each application and capture architecture decisions with rationale.
          </p>
          <div className={styles.legend}>
            <div className={styles.legendItem}><Checkmark16Filled style={{ color: '#28a745' }} /> Required</div>
            <div className={styles.legendItem}><Dismiss16Filled style={{ color: '#dc3545' }} /> Not Required</div>
            <div className={styles.legendItem}><Subtract16Filled style={{ color: '#6c757d' }} /> N/A</div>
          </div>

          {/* Category filter */}
          <div className={styles.filterBar}>
            {categories.map(cat => (
              <Button
                key={cat}
                appearance={categoryFilter === cat ? 'primary' : 'outline'}
                size="small"
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button icon={<Add20Regular />} size="small" onClick={addReq}>Add Row</Button>
              <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetReqs}>Reset</Button>
              <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportReqs}>Export CSV</Button>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Requirement</th>
                  <th className={styles.thCenter}>Status</th>
                  <th className={styles.thWrap}>Architecture Decision Record</th>
                  <th className={styles.thCenter} style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredReqs.map((row, i) => (
                  <tr key={i}>
                    {editCell(`req-${i}-cat`, row.category, (v) => updateReq(i, 'category', v), styles.td, { fontWeight: 600 })}
                    {editCell(`req-${i}-req`, row.requirement, (v) => updateReq(i, 'requirement', v), styles.td)}
                    <td className={styles.tdCenter}>
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => updateReq(i, 'status', cycleReqStatus(row.status))}
                        role="button"
                      >
                        {row.status === 'required' && <Checkmark16Filled style={{ color: '#28a745' }} />}
                        {row.status === 'not-required' && <Dismiss16Filled style={{ color: '#dc3545' }} />}
                        {row.status === 'na' && <Badge appearance="outline" color="informative" size="small">N/A</Badge>}
                      </span>
                    </td>
                    {editCell(`req-${i}-adr`, row.adr, (v) => updateReq(i, 'adr', v), styles.td)}
                    <td className={styles.deleteCell}>
                      <Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => deleteReq(i)} />
                    </td>
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
            Build your application's dependency diagram. Add services, drag to arrange, and connect them to map dependencies.
            Each node has handles (top, bottom, left, right) for creating directional connections with arrow markers.
          </p>
          <ServiceMap />
        </AccordionPanel>
      </AccordionItem>

      {/* ── 3. Business Impact Analysis ── */}
      <AccordionItem value="bia">
        <AccordionHeader>3. Business Impact Analysis (BIA)</AccordionHeader>
        <AccordionPanel>
          <p className={styles.subsectionDesc}>
            Quantify the impact of application downtime to prioritize recovery investments and set objectives.
          </p>

          {/* Summary cards */}
          <div className={styles.summaryGrid}>
            {biaMetrics.slice(0, 4).map((m, i) => (
              <div key={i} className={styles.summaryCard}>
                <div className={styles.summaryValue}>{m.value}</div>
                <div className={styles.summaryLabel}>{m.metric}</div>
              </div>
            ))}
          </div>

          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button icon={<Add20Regular />} size="small" onClick={addBiaRow}>Add Row</Button>
              <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetBia}>Reset</Button>
              <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportBia}>Export CSV</Button>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Metric</th>
                  <th className={styles.thCenter}>Value</th>
                  <th className={styles.thWrap}>Notes</th>
                  <th className={styles.thCenter} style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {biaMetrics.map((row, i) => (
                  <tr key={i}>
                    {editCell(`bia-${i}-m`, row.metric, (v) => updateBia(i, 'metric', v), styles.td, { fontWeight: 600 })}
                    {editCell(`bia-${i}-v`, row.value, (v) => updateBia(i, 'value', v), styles.tdCenter)}
                    {editCell(`bia-${i}-n`, row.notes, (v) => updateBia(i, 'notes', v), styles.td)}
                    <td className={styles.deleteCell}>
                      <Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => deleteBiaRow(i)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 style={{ marginTop: '20px', marginBottom: '12px' }}>Dependency Analysis</h4>
          {biaDeps.map((dep, gi) => (
            <Card key={gi} className={styles.card}>
              <div className={styles.cardTitle}>{dep.direction} Dependencies</div>
              <ul className={styles.list}>
                {dep.items.map((item, ii) => (
                  <li key={ii} style={{ cursor: 'pointer' }} onClick={() => setEditingCell(`dep-${gi}-${ii}`)}>
                    {editingCell === `dep-${gi}-${ii}` ? (
                      <input
                        autoFocus
                        defaultValue={item}
                        onBlur={(e) => { updateDepItem(gi, ii, e.target.value); setEditingCell(null) }}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditingCell(null) }}
                        className={styles.cellInput}
                        style={{ width: '80%' }}
                      />
                    ) : item || '\u00A0'}
                  </li>
                ))}
              </ul>
              <Button icon={<Add20Regular />} size="small" appearance="subtle" onClick={() => addDepItem(gi)}>Add</Button>
            </Card>
          ))}
        </AccordionPanel>
      </AccordionItem>

      {/* ── 4. Fault Tree Analysis (-BCDR) ── */}
      <AccordionItem value="fta-before">
        <AccordionHeader>4. Fault Tree Analysis (&minus;BCDR)</AccordionHeader>
        <AccordionPanel>
          <p className={styles.subsectionDesc}>
            Top-down failure analysis before BCDR improvements. Identifies how component failures contribute to application unavailability.
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

      {/* ── 5. Gap Assessment (-BCDR) ── */}
      <AccordionItem value="gap-assessment">
        <AccordionHeader>5. Architecture | Continuity Gap Assessment (&minus;BCDR)</AccordionHeader>
        <AccordionPanel>
          <p className={styles.subsectionDesc}>
            Assess each component&apos;s current HA and DR configuration against requirements. Gaps indicate where BCDR improvements are needed.
          </p>
          <div className={styles.legend}>
            <div className={styles.legendItem}><Checkmark16Filled style={{ color: '#28a745' }} /> Met &mdash; requirement satisfied</div>
            <div className={styles.legendItem}><Subtract16Filled style={{ color: '#ffc107' }} /> Partial &mdash; partially addressed</div>
            <div className={styles.legendItem}><Dismiss16Filled style={{ color: '#dc3545' }} /> Gap &mdash; not addressed</div>
          </div>

          {/* Donut chart */}
          <div className={styles.chartCard}>
            <h4 style={{ marginBottom: '12px' }}>Gap Status Distribution</h4>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={gapChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {gapChartData.map((entry) => (
                    <Cell key={entry.name} fill={CHART_COLORS[entry.name.toLowerCase() as keyof typeof CHART_COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetGap}>Reset</Button>
              <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportGap}>Export CSV</Button>
            </div>
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
                {gapData.map((row, i) => (
                  <tr key={i}>
                    {editCell(`gap-${i}-comp`, row.component, (v) => updateGap(i, 'component', v), styles.td, { fontWeight: 600 })}
                    {editCell(`gap-${i}-cat`, row.category, (v) => updateGap(i, 'category', v), styles.td)}
                    {editCell(`gap-${i}-sla`, row.sla, (v) => updateGap(i, 'sla', v), styles.tdCenter)}
                    {editCell(`gap-${i}-ha`, row.ha, (v) => updateGap(i, 'ha', v), styles.td)}
                    {editCell(`gap-${i}-dr`, row.dr, (v) => updateGap(i, 'dr', v), styles.td)}
                    <td className={styles.tdCenter}>
                      <GapStatusBadge gap={row.gap} onClick={() => updateGap(i, 'gap', cycleGapStatus(row.gap))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionPanel>
      </AccordionItem>

      {/* ── 6. Metric Analysis ── */}
      <AccordionItem value="metric-analysis">
        <AccordionHeader>6. Metric Analysis (&minus;BCDR)</AccordionHeader>
        <AccordionPanel>
          <p className={styles.subsectionDesc}>
            Baseline reliability and security scores per component before BCDR implementation.
          </p>

          {/* Radar chart */}
          <div className={styles.chartCard}>
            <h4 style={{ marginBottom: '12px' }}>Composite Score Visualization</h4>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="component" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Availability" dataKey="availability" stroke="#667eea" fill="#667eea" fillOpacity={0.15} />
                <Radar name="Reliability" dataKey="reliability" stroke="#764ba2" fill="#764ba2" fillOpacity={0.15} />
                <Radar name="Security" dataKey="security" stroke="#28a745" fill="#28a745" fillOpacity={0.15} />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportMetrics}>Export CSV</Button>
            </div>
          </div>

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
                {defaultMetricAnalysis.map((row, i) => (
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
  )
}
