/**
 * ISO 22301 BCP — Word (.docx) Generator.
 * Matches the PDF generator section-for-section.
 */

import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType, BorderStyle, ShadingType, PageBreak } from 'docx'
import { saveAs } from 'file-saver'
import type { AppSettings } from '../components/Settings'

function prefix(): string { const id = localStorage.getItem('abcg_current-app') ?? 'default'; return `abcg_${id}_` }
function ld<T>(k: string, d: T): T { const r = localStorage.getItem(`${prefix()}${k}`); if (!r) return d; try { return JSON.parse(r) } catch { return d } }
function appName(): string {
  const id = localStorage.getItem('abcg_current-app') ?? 'default'
  const raw = localStorage.getItem('abcg_app-registry')
  if (!raw) return 'Sample Solution'
  try { return (JSON.parse(raw) as { id: string; name: string }[]).find(a => a.id === id)?.name ?? 'Sample Solution' } catch { return 'Sample Solution' }
}

/* ── Table helpers ── */
function mkRow(cells: string[], bold = false): TableRow {
  return new TableRow({
    children: cells.map(text => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, bold, size: 20, font: 'Segoe UI' })] })],
      width: { size: Math.floor(100 / cells.length), type: WidthType.PERCENTAGE },
      shading: bold ? { type: ShadingType.SOLID, color: 'F1F5F9' } : undefined,
    })),
  })
}
function mkTable(headers: string[], rows: string[][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }, insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } },
    rows: [mkRow(headers, true), ...rows.map(r => mkRow(r))],
  })
}
function h1(t: string) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: t, color: '667EEA', font: 'Segoe UI' })] }) }
function h2(t: string) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: t, font: 'Segoe UI' })] }) }
function p(t: string) { return new Paragraph({ children: [new TextRun({ text: t, size: 22, font: 'Segoe UI' })] }) }
function pBold(t: string) { return new Paragraph({ children: [new TextRun({ text: t, size: 22, font: 'Segoe UI', bold: true })] }) }
function bullet(t: string) { return new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: t, size: 22, font: 'Segoe UI' })] }) }
function blank() { return new Paragraph({ text: '' }) }

/* ── Default data (same as PDF) ── */
const defCriticality = [
  { tier: 'Tier 1', criticality: 'Mission Critical', businessView: 'Affects corporate P&L', financial: 'n/a' },
  { tier: 'Tier 1', criticality: 'Business Critical', businessView: 'Financial losses for the organization', financial: '> $250k' },
  { tier: 'Tier 2', criticality: 'High', businessView: 'High-importance processes affected', financial: '< $250k' },
  { tier: 'Tier 3', criticality: 'Medium', businessView: 'Low losses; brand damage likely', financial: '< $100k' },
  { tier: 'Tier 4', criticality: 'Low', businessView: 'Localized impact', financial: '< $50k' },
  { tier: 'Tier 5', criticality: 'Unsupported', businessView: 'No investment justification', financial: '$0' },
]
const defReqs = [
  { category: 'Availability', requirement: 'Multi-region deployment', status: 'required', adr: 'Active-passive with Traffic Manager' },
  { category: 'Recovery', requirement: 'RTO < 4 hours', status: 'required', adr: 'Automated failover ~15 min' },
  { category: 'Recovery', requirement: 'RPO < 1 hour', status: 'required', adr: 'Continuous replication' },
  { category: 'Monitoring', requirement: 'Application Insights APM', status: 'required', adr: 'Full APM configured' },
  { category: 'Security', requirement: 'DDoS Protection', status: 'required', adr: 'Standard tier on VNet' },
]
const defBia = [
  { metric: 'Composite SLO', value: '99.95%', notes: 'Based on service chain' },
  { metric: 'RTO', value: '4 hours', notes: 'Maximum recovery time' },
  { metric: 'RPO', value: '1 hour', notes: 'Maximum data loss' },
  { metric: 'MTD', value: '24 hours', notes: 'Maximum tolerable downtime' },
  { metric: 'Revenue Impact/hr', value: '$50,000', notes: 'Estimated business loss' },
]
const defDeps = [
  { direction: 'Upstream', items: ['Customer Web Portal', 'Mobile Application', 'Partner API Gateway'] },
  { direction: 'Downstream', items: ['Payment Processing', 'Email Service', 'Data Warehouse'] },
]
const defGap = [
  { component: 'Microsoft Entra ID', category: 'Identity', sla: '99.99%', ha: 'Global redundancy', dr: '-', gap: 'Met' },
  { component: 'App Service Plan', category: 'Compute', sla: '99.95%', ha: 'Single region', dr: 'None', gap: 'Gap' },
  { component: 'Azure SQL', category: 'Data', sla: '99.99%', ha: 'Zone redundant', dr: 'No geo-replication', gap: 'Partial' },
]
const defDesign = [
  { component: 'App Service Plan', category: 'Compute', sla: '99.95%', ha: 'Zone-redundant + secondary', dr: 'Active-passive', remediation: 'Deploy to secondary region', status: 'NEW' },
  { component: 'Azure SQL', category: 'Data', sla: '99.995%', ha: 'Zone redundant', dr: 'Active geo-replication', remediation: 'Enable geo-replication', status: 'NEW' },
]
const defMetrics = [
  { component: 'App Service', beforeAvail: '99.95', afterAvail: '99.99', beforeRel: '95', afterRel: '99', beforeSec: '80', afterSec: '92' },
  { component: 'Azure SQL', beforeAvail: '99.99', afterAvail: '99.995', beforeRel: '98', afterRel: '99.5', beforeSec: '90', afterSec: '95' },
]
const defCost = [
  { component: 'App Service Plan', currentCost: 500, bcdrCost: 1000 },
  { component: 'Azure SQL', currentCost: 800, bcdrCost: 1200 },
  { component: 'Azure Cache', currentCost: 300, bcdrCost: 600 },
  { component: 'Storage Account', currentCost: 50, bcdrCost: 75 },
]
const defResponse = [
  { scope: 'Global', availability: 'None', recoverability: 'Redeploy, Restore', resources: 'Service Providers, Authorities', continuity: 'Contingency Plan', preparation: 'Board signoff; Redeploy testing' },
  { scope: 'Azure Region', availability: 'Automated failover', recoverability: 'Restore (manual)', resources: 'IT Support, Vendor', continuity: 'Failover Plan', preparation: 'Failover testing' },
  { scope: 'Data Integrity', availability: 'N/A', recoverability: 'Restore', resources: 'IT Support', continuity: 'Recovery Plan', preparation: 'Recovery testing' },
]
const defContingency = ['Declare contingency event', 'Activate communication plan', 'Switch to manual processes', 'Engage vendors for RCA', 'Establish status updates', 'Validate data integrity before switchback', 'Execute controlled switchback', 'Post-contingency review']
const defRoles = [
  { role: 'Incident Commander', name: '', team: 'Operations', responsibility: 'Overall coordination', escalation: 'CTO' },
  { role: 'Technical Lead', name: '', team: 'Engineering', responsibility: 'Technical response', escalation: 'IC' },
  { role: 'DBA / Data Lead', name: '', team: 'Data Eng', responsibility: 'Database failover', escalation: 'Tech Lead' },
  { role: 'Security Lead', name: '', team: 'Security', responsibility: 'Security assessment', escalation: 'IC' },
]
const defTests = [
  { type: 'Region Failover', frequency: 'Quarterly', lastTest: '2026-01-15', nextTest: '2026-04-15', status: 'Passed', owner: 'Infra Lead' },
  { type: 'Zone Failover', frequency: 'Monthly', lastTest: '2026-03-01', nextTest: '2026-04-01', status: 'Passed', owner: 'Infra Lead' },
  { type: 'Load Test', frequency: 'Monthly', lastTest: '2026-03-10', nextTest: '2026-04-10', status: 'Degraded', owner: 'QA' },
]
const defUat = [
  { function_name: 'User Authentication', testSteps: 'Login via SSO', expectedResult: 'Dashboard loads < 3s', priority: 'High' },
  { function_name: 'Order Processing', testSteps: 'Submit order', expectedResult: 'Confirmed + email', priority: 'High' },
]
const defMaint = [
  { document: 'Business Impact Analysis', frequency: 'Annually', nextReview: '2027-01-15', owner: 'App Owner', approver: 'Business' },
  { document: 'Failover Runbook', frequency: 'Quarterly', nextReview: '2026-07-01', owner: 'Infra Lead', approver: 'Ops Mgr' },
  { document: 'Contingency Plan', frequency: 'Semi-annually', nextReview: '2026-10-01', owner: 'Business', approver: 'App Owner' },
]

/* ═══════ Generate ═══════ */

export function generateBcpDocx(): void {
  const s = ld<AppSettings>('settings', { organizationName: '', guideName: '', primaryContact: '', primaryContactEmail: '', workloadDescription: '', dateFormat: 'YYYY-MM-DD', currency: 'USD', notes: '' })
  const org = s.organizationName || 'Organization'
  const app = appName()
  const date = new Date().toISOString().slice(0, 10)

  const criticality = ld('phase1_criticalityModel', defCriticality)
  const requirements = ld('phase2-requirements', defReqs)
  const biaMetrics = ld('phase2-bia-metrics', defBia)
  const biaDeps = ld('phase2-bia-deps', defDeps)
  const gapData = ld('phase2-gap-assessment', defGap)
  const design = ld('phase2-continuity-design', defDesign)
  const metricComp = ld('phase2-metric-comparison', defMetrics)
  const cost = ld('phase2-cost-comparison', defCost)
  const responsePlan = ld('phase2-response-plan', defResponse)
  const contingency = ld('phase2-contingency-steps', defContingency)
  const roles = ld('phase2-role-assignment', defRoles)
  const tests = ld('phase2-test-summary', defTests)
  const uat = ld('phase2-uat-cases', defUat)
  const maintenance = ld('phase2-maintenance', defMaint)

  const totB = cost.reduce((a: number, r: { currentCost: number }) => a + r.currentCost, 0)
  const totA = cost.reduce((a: number, r: { bcdrCost: number }) => a + r.bcdrCost, 0)

  const c: (Paragraph | Table)[] = []

  // Cover
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 4000 }, children: [new TextRun({ text: 'Business Continuity Plan', size: 56, bold: true, color: '667EEA', font: 'Segoe UI' })] }))
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Business Continuity & Disaster Recovery', size: 28, color: '718096', font: 'Segoe UI' })] }))
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600 }, children: [new TextRun({ text: org, size: 26, bold: true, font: 'Segoe UI' })] }))
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Solution: ${app}`, size: 22, color: '667EEA', font: 'Segoe UI' })] }))
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Date: ${date}`, size: 20, color: '718096', font: 'Segoe UI' })] }))
  c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 800 }, children: [new TextRun({ text: 'ISO 22301:2019 \u2014 Business Continuity Management Systems', size: 18, color: 'A0AEC0', font: 'Segoe UI' })] }))
  c.push(new Paragraph({ children: [new PageBreak()] }))

  // 1. Document Control
  c.push(h1('1. Document Control'))
  c.push(mkTable(['Field', 'Value'], [['Organization', org], ['Solution', app], ['Standard', 'ISO 22301:2019'], ['Primary Contact', s.primaryContact || 'TBD'], ['Contact Email', s.primaryContactEmail || 'TBD'], ['Date', date], ['Classification', 'Confidential']]))

  // 2. Context
  c.push(h1('2. Context of the Organization (ISO 22301 Clause 4)'))
  c.push(p(`This BCP establishes the framework for ${org} to maintain essential functions during and after a disruption.`))
  if (s.workloadDescription) { c.push(h2('2.1 Workload Description')); c.push(p(s.workloadDescription)) }
  c.push(h2(s.workloadDescription ? '2.2 Scope' : '2.1 Scope'))
  c.push(p('All business-critical components and infrastructure as defined in the criticality model and architecture assessment.'))
  if (s.notes) { c.push(pBold('Notes:')); c.push(p(s.notes)) }

  // 3. Leadership
  c.push(h1('3. Leadership & Roles (ISO 22301 Clause 5)'))
  c.push(p(`${org} is committed to continuity of critical business operations.`))
  c.push(h2('3.1 Role Assignment'))
  c.push(mkTable(['Role', 'Assigned To', 'Team', 'Responsibility', 'Escalation'],
    roles.map((r: { role: string; name: string; team: string; responsibility: string; escalation: string }) => [r.role, r.name || 'TBD', r.team, r.responsibility, r.escalation])))

  // 4. Planning / Requirements
  c.push(h1('4. Planning \u2014 Requirements (ISO 22301 Clause 6)'))
  c.push(mkTable(['Category', 'Requirement', 'Status', 'Architecture Decision'],
    requirements.map((r: { category: string; requirement: string; status: string; adr: string }) => [r.category, r.requirement, r.status === 'required' ? 'Required' : r.status === 'not-required' ? 'Not Required' : 'N/A', r.adr])))

  // 5. Support / Dependencies
  c.push(h1('5. Support \u2014 Dependencies (ISO 22301 Clause 7)'))
  biaDeps.forEach((dep: { direction: string; items: string[] }) => {
    c.push(h2(`${dep.direction} Dependencies`))
    dep.items.filter(Boolean).forEach((item: string) => c.push(bullet(item)))
  })

  // 6. BIA
  c.push(h1('6. Operations \u2014 Business Impact Analysis (ISO 22301 Clause 8)'))
  c.push(mkTable(['Metric', 'Value', 'Notes'],
    biaMetrics.map((m: { metric: string; value: string; notes: string }) => [m.metric, m.value, m.notes])))

  // 7. Gap Assessment
  c.push(h1('7. Architecture & Gap Assessment'))
  c.push(mkTable(['Component', 'Category', 'SLA', 'HA Config', 'DR Config', 'Status'],
    gapData.map((r: { component: string; category: string; sla: string; ha: string; dr: string; gap: string }) => [r.component, r.category, r.sla, r.ha, r.dr, r.gap === 'met' ? 'Met' : r.gap === 'partial' ? 'Partial' : 'Gap'])))

  // 8. BCDR Design
  c.push(h1('8. BCDR Implementation Design'))
  c.push(mkTable(['Component', 'Category', 'SLA', 'HA', 'DR', 'Remediation', 'Status'],
    design.map((r: { component: string; category: string; sla: string; ha: string; dr: string; remediation: string; status: string }) => [r.component, r.category, r.sla, r.ha, r.dr, r.remediation, r.status === 'met' ? 'Met' : 'NEW'])))
  if (metricComp.length > 0) {
    c.push(h2('8.1 Metric Comparison (+BCDR)'))
    c.push(mkTable(['Component', 'Before Avail', 'After Avail', 'Before Rel', 'After Rel', 'Before Sec', 'After Sec'],
      metricComp.map((r: { component: string; beforeAvail: string; afterAvail: string; beforeRel: string; afterRel: string; beforeSec: string; afterSec: string }) => [r.component, r.beforeAvail, r.afterAvail, r.beforeRel, r.afterRel, r.beforeSec, r.afterSec])))
  }

  // 9. Cost
  c.push(h1('9. Cost Analysis'))
  c.push(p(`Current: $${totB.toLocaleString()} | +BCDR: $${totA.toLocaleString()} | Investment: +$${(totA - totB).toLocaleString()} (+${totB > 0 ? Math.round((totA - totB) / totB * 100) : 0}%)`))
  c.push(mkTable(['Component', 'Current ($)', '+BCDR ($)', 'Diff ($)'],
    [...cost.map((r: { component: string; currentCost: number; bcdrCost: number }) => [r.component, r.currentCost.toLocaleString(), r.bcdrCost.toLocaleString(), (r.bcdrCost - r.currentCost).toLocaleString()]),
     ['TOTAL', `$${totB.toLocaleString()}`, `$${totA.toLocaleString()}`, `+$${(totA - totB).toLocaleString()}`]]))

  // 10. Response Plan
  c.push(h1('10. Response Plan by Scope'))
  responsePlan.forEach((r: { scope: string; availability: string; recoverability: string; resources: string; continuity: string; preparation: string }) => {
    c.push(pBold(r.scope))
    c.push(mkTable(['Availability', 'Recoverability', 'Resources', 'Continuity', 'Preparation'],
      [[r.availability, r.recoverability, r.resources, r.continuity, r.preparation]]))
    c.push(blank())
  })

  // 11. Contingency
  c.push(h1('11. Contingency Plan'))
  contingency.filter(Boolean).forEach((st: string, i: number) => c.push(bullet(`${i + 1}. ${st}`)))

  // 12. Testing
  c.push(h1('12. Performance Evaluation \u2014 Testing (ISO 22301 Clause 9)'))
  c.push(mkTable(['Test Type', 'Frequency', 'Last Test', 'Next Test', 'Status', 'Owner'],
    tests.map((t: { type: string; frequency: string; lastTest: string; nextTest: string; status: string; owner: string }) => [t.type, t.frequency, t.lastTest, t.nextTest, t.status, t.owner])))
  if (uat.length > 0) {
    c.push(h2('12.1 UAT Test Plan'))
    c.push(mkTable(['Business Function', 'Test Steps', 'Expected Result', 'Priority'],
      uat.map((u: { function_name: string; testSteps: string; expectedResult: string; priority: string }) => [u.function_name, u.testSteps, u.expectedResult, u.priority])))
  }

  // 13. Maintenance
  c.push(h1('13. Improvement \u2014 Maintenance (ISO 22301 Clause 10)'))
  c.push(mkTable(['Document', 'Frequency', 'Next Review', 'Owner', 'Approver'],
    maintenance.map((m: { document: string; frequency: string; nextReview: string; owner: string; approver: string }) => [m.document, m.frequency, m.nextReview, m.owner, m.approver])))

  // Appendix A: Criticality
  c.push(h1('Appendix A: Criticality Model'))
  c.push(mkTable(['Tier', 'Criticality', 'Business View', 'Financial'],
    criticality.map((r: { tier: string; criticality: string; businessView: string; financial: string }) => [r.tier, r.criticality, r.businessView, r.financial])))

  c.push(blank())
  c.push(p('End of Document. This BCP is a living document \u2014 review and update per the maintenance schedule.'))

  const doc = new Document({ sections: [{ children: c }] })
  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `BCP_${org.replace(/\s+/g, '_')}_${app.replace(/\s+/g, '_')}_${date}.docx`)
  })
}
