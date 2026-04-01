import { useState } from 'react'
import {
  makeStyles,
  shorthands,
  mergeClasses,
  tokens,
  Card,
  Badge,
  Button,
} from '@fluentui/react-components'
import {
  Checkmark16Filled,
  Dismiss16Filled,
  Warning16Filled,
  Add20Regular,
  Delete20Regular,
  ArrowReset20Regular,
  ArrowDownload20Regular,
} from '@fluentui/react-icons'
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
  list: { marginLeft: '24px', marginTop: '12px' },
  stepList: { listStyleType: 'decimal', marginLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  stepItem: { ...shorthands.padding('8px', '12px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('6px'), fontSize: '14px', lineHeight: '1.5' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' },
  summaryCard: { ...shorthands.padding('16px', '20px'), backgroundColor: tokens.colorNeutralBackground3, ...shorthands.borderRadius('8px'), textAlign: 'center' },
  summaryValue: { fontSize: '24px', fontWeight: '700', color: tokens.colorBrandForeground1 },
  summaryLabel: { fontSize: '13px', color: tokens.colorNeutralForeground3, marginTop: '4px' },
})

/* ═══════════════════════════════════════════
   Types & Data
   ═══════════════════════════════════════════ */

interface TestRow { type: string; frequency: string; lastTest: string; nextTest: string; automated: string; status: 'Passed' | 'Degraded' | 'Failed'; owner: string }

const defaultTestSummary: TestRow[] = [
  { type: 'Region Failover',   frequency: 'Quarterly',    lastTest: '2026-01-15', nextTest: '2026-04-15', automated: 'Partial', status: 'Passed', owner: 'Infrastructure Lead' },
  { type: 'Zone Failover',     frequency: 'Monthly',      lastTest: '2026-03-01', nextTest: '2026-04-01', automated: 'Yes',     status: 'Passed', owner: 'Infrastructure Lead' },
  { type: 'Database Recovery',  frequency: 'Quarterly',    lastTest: '2026-02-10', nextTest: '2026-05-10', automated: 'Partial', status: 'Passed', owner: 'DBA / Data Lead' },
  { type: 'Backup Restore',    frequency: 'Monthly',      lastTest: '2026-03-05', nextTest: '2026-04-05', automated: 'Yes',     status: 'Passed', owner: 'Infrastructure Lead' },
  { type: 'Load Test',         frequency: 'Monthly',      lastTest: '2026-03-10', nextTest: '2026-04-10', automated: 'Yes',     status: 'Degraded', owner: 'QA / Validation' },
  { type: 'Chaos Test',        frequency: 'Quarterly',    lastTest: '2026-01-20', nextTest: '2026-04-20', automated: 'Yes',     status: 'Passed', owner: 'SRE Team' },
  { type: 'Penetration Test',  frequency: 'Annually',     lastTest: '2025-11-01', nextTest: '2026-11-01', automated: 'No',      status: 'Passed', owner: 'Security Lead' },
  { type: 'UAT',               frequency: 'Per Release',  lastTest: '2026-03-15', nextTest: 'Next release', automated: 'No',   status: 'Passed', owner: 'QA / Validation' },
  { type: 'Contingency Drill', frequency: 'Semi-annually', lastTest: '2025-12-01', nextTest: '2026-06-01', automated: 'No',    status: 'Passed', owner: 'Business Liaison' },
]

interface UatRow { function_name: string; testSteps: string; expectedResult: string; priority: 'High' | 'Medium' | 'Low' }

const defaultUat: UatRow[] = [
  { function_name: 'User Authentication', testSteps: 'Login with valid credentials via Entra ID SSO', expectedResult: 'Successful authentication, dashboard loads within 3s', priority: 'High' },
  { function_name: 'Order Processing',    testSteps: 'Submit a new order with valid payment details', expectedResult: 'Order confirmed, confirmation email received', priority: 'High' },
  { function_name: 'Data Retrieval',      testSteps: 'Search and retrieve customer records', expectedResult: 'Results returned within 200ms, data accurate', priority: 'High' },
  { function_name: 'Report Generation',   testSteps: 'Generate monthly sales report', expectedResult: 'Report generated with correct data, downloadable', priority: 'Medium' },
  { function_name: 'Notification Service', testSteps: 'Trigger alert notification via Service Bus', expectedResult: 'Notification delivered within 60 seconds', priority: 'Medium' },
  { function_name: 'Cache Performance',   testSteps: 'Verify cached data serves correctly after failover', expectedResult: 'Cache hit ratio > 90%, no stale data', priority: 'Medium' },
  { function_name: 'File Upload',         testSteps: 'Upload document to storage account', expectedResult: 'File stored in target container, accessible via URL', priority: 'Low' },
  { function_name: 'Audit Logging',       testSteps: 'Perform sensitive action and check audit log', expectedResult: 'Action logged with timestamp, user, and details', priority: 'High' },
]

interface MaintenanceRow { document: string; frequency: string; nextReview: string; owner: string; approver: string }

const defaultMaintenance: MaintenanceRow[] = [
  { document: 'Business Impact Analysis',    frequency: 'Annually',     nextReview: '2027-01-15',        owner: 'Application Owner',  approver: 'Business Stakeholder' },
  { document: 'Architecture Decision Record', frequency: 'Per change',  nextReview: 'On next arch change', owner: 'Solution Architect', approver: 'Technical Lead' },
  { document: 'Failover Runbook',            frequency: 'Quarterly',    nextReview: '2026-07-01',        owner: 'Infrastructure Lead', approver: 'Operations Manager' },
  { document: 'Recovery Procedures',          frequency: 'Quarterly',   nextReview: '2026-07-01',        owner: 'DBA / Data Lead',    approver: 'Technical Lead' },
  { document: 'Contingency Plan',            frequency: 'Semi-annually', nextReview: '2026-10-01',       owner: 'Business Liaison',   approver: 'Application Owner' },
  { document: 'Communication Plan',          frequency: 'Semi-annually', nextReview: '2026-10-01',       owner: 'Communications Lead', approver: 'Incident Commander' },
  { document: 'Role Assignment',             frequency: 'Quarterly',    nextReview: '2026-07-01',        owner: 'Operations Manager', approver: 'Application Owner' },
  { document: 'Test Plans',                  frequency: 'Annually',     nextReview: '2027-01-15',        owner: 'QA / Validation',    approver: 'Technical Lead' },
  { document: 'Service Map',                 frequency: 'Per change',   nextReview: 'On next topology change', owner: 'Solution Architect', approver: 'Infrastructure Lead' },
  { document: 'Cost Analysis',              frequency: 'Annually',      nextReview: '2027-01-15',        owner: 'Application Owner',  approver: 'Finance' },
]

const failoverSteps = [
  'Pre-flight: Confirm all participants are available and monitoring dashboards are open',
  'Notify stakeholders that a planned failover drill is commencing',
  'Validate current health of primary and secondary regions',
  'Initiate failover: Trigger Traffic Manager / Front Door profile switch to secondary',
  'Monitor: Verify traffic is routing to secondary region endpoints',
  'Validate: Run smoke tests against secondary region (API health, UI, data consistency)',
  'Record: Document failover time, any errors, and user impact metrics',
  'Hold steady state on secondary for observation period (30\u201360 min)',
]

const failbackSteps = [
  'Confirm primary region is healthy and all services are running',
  'Verify data replication has caught up (no replication lag)',
  'Initiate failback: Switch Traffic Manager / Front Door back to primary',
  'Monitor: Verify traffic is routing back to primary region',
  'Validate: Run smoke tests against primary region',
  'Record: Document failback time and any issues encountered',
  'Notify stakeholders that drill is complete',
  'Conduct post-drill review and update runbook with lessons learned',
]

const commPlanData = [
  { scope: 'Global / Geography', preOutage: ['Board and executive team pre-briefed', 'Customer communication templates prepared', 'Media / PR team on standby'], duringOutage: ['Hourly executive updates', 'Customer status page updated every 30 min', 'Media holding statement issued'], postOutage: ['Formal post-incident report to board', 'Customer impact letter with remediation steps', 'Regulatory notifications if applicable'] },
  { scope: 'Region',             preOutage: ['App business owner notified of planned drill', 'Support team briefed on customer impact', 'Status page pre-configured'], duringOutage: ['App business owner updated every 30 min', 'Support team handling queries', 'Status page shows real-time updates'], postOutage: ['Post-incident review within 48 hours', 'RCA shared with stakeholders', 'Runbook updated'] },
  { scope: 'Zone / Service',     preOutage: ['Operations team monitoring dashboards', 'Automated alerts configured', 'On-call engineer assigned'], duringOutage: ['On-call responds within 15 min', 'PagerDuty escalation active', 'Internal channel for coordination'], postOutage: ['Brief post-mortem within 24 hours', 'Monitoring thresholds adjusted', 'Automation improvements identified'] },
  { scope: 'Data Integrity',     preOutage: ['Backup validation automated and recent', 'Data steward aware of restore procedures', 'Point-in-time restore tested'], duringOutage: ['Data team assesses scope', 'Affected systems isolated', 'Restore initiated from last known good backup'], postOutage: ['Data integrity verification report', 'Root cause analysis', 'Prevention controls implemented'] },
]

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

function StatusBadge({ status }: { status: 'Passed' | 'Degraded' | 'Failed' }) {
  if (status === 'Passed') return <Badge appearance="filled" style={{ backgroundColor: '#28a745', color: '#fff' }}><Checkmark16Filled style={{ fontSize: 12, marginRight: 4 }} />Passed</Badge>
  if (status === 'Degraded') return <Badge appearance="filled" style={{ backgroundColor: '#ffc107', color: '#1a1a1a' }}><Warning16Filled style={{ fontSize: 12, marginRight: 4 }} />Degraded</Badge>
  return <Badge appearance="filled" style={{ backgroundColor: '#dc3545', color: '#fff' }}><Dismiss16Filled style={{ fontSize: 12, marginRight: 4 }} />Failed</Badge>
}

const statusValues: TestRow['status'][] = ['Passed', 'Degraded', 'Failed']

function PriorityBadge({ priority }: { priority: 'High' | 'Medium' | 'Low' }) {
  const colors = { High: '#dc3545', Medium: '#ffc107', Low: '#28a745' }
  return <Badge appearance="filled" size="small" style={{ backgroundColor: colors[priority], color: priority === 'Medium' ? '#1a1a1a' : '#fff' }}>{priority}</Badge>
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export default function TestTab() {
  const styles = useStyles()

  const [testSummary, setTestSummary, resetTests] = useWorkbenchData<TestRow[]>('phase2-test-summary', defaultTestSummary)
  const [uatCases, setUatCases, resetUat] = useWorkbenchData<UatRow[]>('phase2-uat-cases', defaultUat)
  const [maintenance, setMaintenance, resetMaint] = useWorkbenchData<MaintenanceRow[]>('phase2-maintenance', defaultMaintenance)
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

  /* Test summary helpers */
  const updateTest = <K extends keyof TestRow>(idx: number, field: K, value: TestRow[K]) => {
    setTestSummary(testSummary.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }
  const addTestRow = () => setTestSummary([...testSummary, { type: '', frequency: '', lastTest: '', nextTest: '', automated: 'No', status: 'Passed', owner: '' }])
  const deleteTestRow = (idx: number) => setTestSummary(testSummary.filter((_, i) => i !== idx))

  /* UAT helpers */
  const updateUat = <K extends keyof UatRow>(idx: number, field: K, value: UatRow[K]) => {
    setUatCases(uatCases.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }
  const addUatRow = () => setUatCases([...uatCases, { function_name: '', testSteps: '', expectedResult: '', priority: 'Medium' }])
  const deleteUatRow = (idx: number) => setUatCases(uatCases.filter((_, i) => i !== idx))

  /* Maintenance helpers */
  const updateMaint = <K extends keyof MaintenanceRow>(idx: number, field: K, value: MaintenanceRow[K]) => {
    setMaintenance(maintenance.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }
  const addMaintRow = () => setMaintenance([...maintenance, { document: '', frequency: '', nextReview: '', owner: '', approver: '' }])
  const deleteMaintRow = (idx: number) => setMaintenance(maintenance.filter((_, i) => i !== idx))

  const passed = testSummary.filter(t => t.status === 'Passed').length
  const total = testSummary.length

  /* CSV export */
  const exportTests = () => downloadCsv('phase2_test_summary.csv', objectsToCsvSheet('Tests', testSummary as unknown as Record<string, unknown>[]))
  const exportUat = () => downloadCsv('phase2_uat_test_plan.csv', objectsToCsvSheet('UAT', uatCases as unknown as Record<string, unknown>[]))
  const exportMaint = () => downloadCsv('phase2_maintenance.csv', objectsToCsvSheet('Maintenance', maintenance as unknown as Record<string, unknown>[]))

  return (
    <div>
      {/* ── 14. Test Summary (INTERACTIVE) ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>14. Test Summary</h3>
        <p className={styles.subsectionDesc}>Track all testing activities and results. Click cells to edit, click status badges to cycle through Passed/Degraded/Failed.</p>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>{total}</div>
            <div className={styles.summaryLabel}>Total Tests</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue} style={{ color: '#28a745' }}>{passed}</div>
            <div className={styles.summaryLabel}>Passed</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue} style={{ color: '#ffc107' }}>{testSummary.filter(t => t.status === 'Degraded').length}</div>
            <div className={styles.summaryLabel}>Degraded</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>{total > 0 ? Math.round(passed / total * 100) : 0}%</div>
            <div className={styles.summaryLabel}>Pass Rate</div>
          </div>
        </div>

        <div className={styles.sectionHeader}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={addTestRow}>Add Row</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetTests}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportTests}>Export CSV</Button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr>
              <th className={styles.th}>Test Type</th>
              <th className={styles.thCenter}>Frequency</th>
              <th className={styles.thCenter}>Last Test</th>
              <th className={styles.thCenter}>Next Test</th>
              <th className={styles.thCenter}>Automated</th>
              <th className={styles.thCenter}>Status</th>
              <th className={styles.th}>Owner</th>
              <th className={styles.thCenter} style={{ width: '40px' }}></th>
            </tr></thead>
            <tbody>
              {testSummary.map((row, i) => (
                <tr key={i}>
                  {editCell(`test-${i}-type`, row.type, (v) => updateTest(i, 'type', v), styles.td, { fontWeight: 600 })}
                  {editCell(`test-${i}-freq`, row.frequency, (v) => updateTest(i, 'frequency', v), styles.tdCenter)}
                  {editCell(`test-${i}-last`, row.lastTest, (v) => updateTest(i, 'lastTest', v), styles.tdCenter)}
                  {editCell(`test-${i}-next`, row.nextTest, (v) => updateTest(i, 'nextTest', v), styles.tdCenter)}
                  {editCell(`test-${i}-auto`, row.automated, (v) => updateTest(i, 'automated', v), styles.tdCenter)}
                  <td className={styles.tdCenter} style={{ cursor: 'pointer' }} onClick={() => updateTest(i, 'status', statusValues[(statusValues.indexOf(row.status) + 1) % statusValues.length])}>
                    <StatusBadge status={row.status} />
                  </td>
                  {editCell(`test-${i}-own`, row.owner, (v) => updateTest(i, 'owner', v), styles.td)}
                  <td className={styles.deleteCell}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => deleteTestRow(i)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 15. Continuity Drill (STATIC REFERENCE) ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>15. Continuity Drill (Failover Test)</h3>
        <p className={styles.subsectionDesc}>Documented failover and failback procedures.</p>
        <Card className={styles.card}>
          <div className={styles.cardTitle}>Failover Procedure</div>
          <ol className={styles.stepList}>
            {failoverSteps.map((step, i) => (
              <li key={i} className={styles.stepItem}>
                <Badge appearance="filled" color="brand" size="small" style={{ marginRight: '8px' }}>{i + 1}</Badge>
                {step}
              </li>
            ))}
          </ol>
        </Card>
        <Card className={styles.card}>
          <div className={styles.cardTitle}>Failback Procedure</div>
          <ol className={styles.stepList}>
            {failbackSteps.map((step, i) => (
              <li key={i} className={styles.stepItem}>
                <Badge appearance="filled" color="informative" size="small" style={{ marginRight: '8px' }}>{i + 1}</Badge>
                {step}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* ── 16. UAT Test Plan (INTERACTIVE) ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>16. Test Plan (UAT)</h3>
        <p className={styles.subsectionDesc}>User Acceptance Testing cases. Click cells to edit, click priority to cycle.</p>
        <div className={styles.sectionHeader}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={addUatRow}>Add Row</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetUat}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportUat}>Export CSV</Button>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr>
              <th className={styles.th}>Business Function</th>
              <th className={styles.thWrap}>Test Steps</th>
              <th className={styles.thWrap}>Expected Result</th>
              <th className={styles.thCenter}>Priority</th>
              <th className={styles.thCenter} style={{ width: '40px' }}></th>
            </tr></thead>
            <tbody>
              {uatCases.map((row, i) => {
                const priorities: UatRow['priority'][] = ['High', 'Medium', 'Low']
                return (
                  <tr key={i}>
                    {editCell(`uat-${i}-fn`, row.function_name, (v) => updateUat(i, 'function_name', v), styles.td, { fontWeight: 600 })}
                    {editCell(`uat-${i}-ts`, row.testSteps, (v) => updateUat(i, 'testSteps', v), styles.td)}
                    {editCell(`uat-${i}-er`, row.expectedResult, (v) => updateUat(i, 'expectedResult', v), styles.td)}
                    <td className={styles.tdCenter} style={{ cursor: 'pointer' }} onClick={() => updateUat(i, 'priority', priorities[(priorities.indexOf(row.priority) + 1) % priorities.length])}>
                      <PriorityBadge priority={row.priority} />
                    </td>
                    <td className={styles.deleteCell}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => deleteUatRow(i)} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 17. Outage Communication Plan (STATIC REFERENCE) ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>17. Outage Communication Plan</h3>
        <p className={styles.subsectionDesc}>Communication procedures organized by event scope for before, during, and after outages.</p>
        {commPlanData.map((plan, i) => (
          <Card key={i} className={styles.card}>
            <div className={styles.cardTitle}>{plan.scope}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: tokens.colorNeutralForeground3 }}>Before Outage</strong>
                <ul className={styles.list}>
                  {plan.preOutage.map((item, j) => <li key={j} style={{ fontSize: '13px', marginBottom: '4px' }}>{item}</li>)}
                </ul>
              </div>
              <div>
                <strong style={{ fontSize: '13px', color: '#fd7e14' }}>During Outage</strong>
                <ul className={styles.list}>
                  {plan.duringOutage.map((item, j) => <li key={j} style={{ fontSize: '13px', marginBottom: '4px' }}>{item}</li>)}
                </ul>
              </div>
              <div>
                <strong style={{ fontSize: '13px', color: '#28a745' }}>After Outage</strong>
                <ul className={styles.list}>
                  {plan.postOutage.map((item, j) => <li key={j} style={{ fontSize: '13px', marginBottom: '4px' }}>{item}</li>)}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── 18. Maintain Application Continuity (INTERACTIVE) ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>18. Maintain Application Continuity</h3>
        <p className={styles.subsectionDesc}>Maintenance schedule for all continuity documentation and artifacts. Click cells to edit.</p>
        <div className={styles.sectionHeader}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button icon={<Add20Regular />} size="small" onClick={addMaintRow}>Add Row</Button>
            <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetMaint}>Reset</Button>
            <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportMaint}>Export CSV</Button>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr>
              <th className={styles.thWrap}>Document / Artifact</th>
              <th className={styles.thCenter}>Frequency</th>
              <th className={styles.thCenter}>Next Review</th>
              <th className={styles.th}>Owner</th>
              <th className={styles.th}>Approver</th>
              <th className={styles.thCenter} style={{ width: '40px' }}></th>
            </tr></thead>
            <tbody>
              {maintenance.map((row, i) => (
                <tr key={i}>
                  {editCell(`maint-${i}-doc`, row.document, (v) => updateMaint(i, 'document', v), styles.td, { fontWeight: 600 })}
                  {editCell(`maint-${i}-freq`, row.frequency, (v) => updateMaint(i, 'frequency', v), styles.tdCenter)}
                  {editCell(`maint-${i}-next`, row.nextReview, (v) => updateMaint(i, 'nextReview', v), styles.tdCenter)}
                  {editCell(`maint-${i}-own`, row.owner, (v) => updateMaint(i, 'owner', v), styles.td)}
                  {editCell(`maint-${i}-app`, row.approver, (v) => updateMaint(i, 'approver', v), styles.td)}
                  <td className={styles.deleteCell}><Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => deleteMaintRow(i)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
