/**
 * ISO 22301 BCP — Word (.docx) Generator.
 * Clean, professional formatting matching the PDF output.
 */

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, HeadingLevel, AlignmentType, BorderStyle, ShadingType,
  PageBreak, Header, Footer, TabStopPosition, TabStopType,
  convertInchesToTwip,
} from 'docx'
import { saveAs } from 'file-saver'
import type { AppSettings } from '../components/Settings'

/* ── Data loading ── */
function pfx(): string { return `abcg_${localStorage.getItem('abcg_current-app') ?? 'default'}_` }
function ld<T>(k: string, d: T): T { const r = localStorage.getItem(`${pfx()}${k}`); if (!r) return d; try { return JSON.parse(r) } catch { return d } }
function getAppName(): string {
  const id = localStorage.getItem('abcg_current-app') ?? 'default'
  const raw = localStorage.getItem('abcg_app-registry')
  if (!raw) return 'Sample Solution'
  try { return (JSON.parse(raw) as { id: string; name: string }[]).find(a => a.id === id)?.name ?? 'Sample Solution' } catch { return 'Sample Solution' }
}

/* ── Formatting helpers ── */
const FONT = 'Segoe UI'
const BRAND = '667EEA'
const GRAY = '718096'
const BORDER_COLOR = 'D1D5DB'
const HEADER_BG = 'F1F5F9'

function h1(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: BRAND, space: 4 } },
    children: [new TextRun({ text, color: BRAND, font: FONT, size: 28 })],
  })
}
function h2(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    children: [new TextRun({ text, font: FONT, size: 24 })],
  })
}
function para(text: string, opts?: { bold?: boolean; color?: string; size?: number; spacing?: { before?: number; after?: number } }): Paragraph {
  return new Paragraph({
    spacing: opts?.spacing ?? { after: 80 },
    children: [new TextRun({ text, font: FONT, size: opts?.size ?? 22, bold: opts?.bold, color: opts?.color })],
  })
}
function bulletItem(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40 },
    children: [new TextRun({ text, font: FONT, size: 22 })],
  })
}
function spacer(): Paragraph { return new Paragraph({ spacing: { after: 120 }, text: '' }) }

function cell(text: string, opts?: { bold?: boolean; shading?: string; alignment?: (typeof AlignmentType)[keyof typeof AlignmentType] }): TableCell {
  return new TableCell({
    children: [new Paragraph({
      alignment: opts?.alignment,
      children: [new TextRun({ text, font: FONT, size: 20, bold: opts?.bold })],
    })],
    margins: { top: convertInchesToTwip(0.04), bottom: convertInchesToTwip(0.04), left: convertInchesToTwip(0.08), right: convertInchesToTwip(0.08) },
    shading: opts?.shading ? { type: ShadingType.SOLID, color: opts.shading } : undefined,
  })
}

function table(headers: string[], rows: string[][]): Table {
  const borderStyle = { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR }
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle, insideHorizontal: borderStyle, insideVertical: borderStyle },
    rows: [
      new TableRow({ children: headers.map(h => cell(h, { bold: true, shading: HEADER_BG })), tableHeader: true }),
      ...rows.map(r => new TableRow({ children: r.map(c => cell(c)) })),
    ],
  })
}

/* ── Default data (compact) ── */
const defCrit = [
  { tier: 'Tier 1', criticality: 'Mission Critical', businessView: 'Affects corporate P&L', financial: 'n/a' },
  { tier: 'Tier 1', criticality: 'Business Critical', businessView: 'Financial losses', financial: '> $250k' },
  { tier: 'Tier 2', criticality: 'High', businessView: 'High-importance processes', financial: '< $250k' },
  { tier: 'Tier 3', criticality: 'Medium', businessView: 'Low losses; brand damage', financial: '< $100k' },
  { tier: 'Tier 4', criticality: 'Low', businessView: 'Localized impact', financial: '< $50k' },
  { tier: 'Tier 5', criticality: 'Unsupported', businessView: 'No investment', financial: '$0' },
]
const defReqs = [
  { category: 'Availability', requirement: 'Multi-region deployment', status: 'required', adr: 'Active-passive with Traffic Manager' },
  { category: 'Recovery', requirement: 'RTO < 4 hours', status: 'required', adr: 'Automated failover ~15 min' },
  { category: 'Recovery', requirement: 'RPO < 1 hour', status: 'required', adr: 'Continuous replication' },
  { category: 'Monitoring', requirement: 'Application Insights', status: 'required', adr: 'Full APM configured' },
  { category: 'Security', requirement: 'DDoS Protection', status: 'required', adr: 'Standard tier on VNet' },
]
const defBia = [
  { metric: 'Composite SLO', value: '99.95%', notes: 'Based on service chain' },
  { metric: 'RTO', value: '4 hours', notes: 'Maximum recovery time' },
  { metric: 'RPO', value: '1 hour', notes: 'Maximum data loss' },
  { metric: 'MTD', value: '24 hours', notes: 'Maximum tolerable downtime' },
  { metric: 'Revenue Impact/hr', value: '$50,000', notes: 'Estimated loss' },
]
const defDeps = [
  { direction: 'Upstream', items: ['Customer Web Portal', 'Mobile Application', 'Partner API Gateway'] },
  { direction: 'Downstream', items: ['Payment Processing', 'Email Service', 'Data Warehouse'] },
]
const defGap = [
  { component: 'Microsoft Entra ID', category: 'Identity', sla: '99.99%', ha: 'Global redundancy', dr: '-', gap: 'Met' },
  { component: 'App Service Plan', category: 'Compute', sla: '99.95%', ha: 'Single region', dr: 'None', gap: 'Gap' },
  { component: 'Azure SQL', category: 'Data', sla: '99.99%', ha: 'Zone redundant', dr: 'No geo-rep', gap: 'Partial' },
]
const defDesign = [
  { component: 'App Service Plan', category: 'Compute', sla: '99.95%', ha: 'Zone + secondary', dr: 'Active-passive', remediation: 'Deploy to secondary region', status: 'NEW' },
  { component: 'Azure SQL', category: 'Data', sla: '99.995%', ha: 'Zone redundant', dr: 'Geo-replication', remediation: 'Enable geo-rep', status: 'NEW' },
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
  { scope: 'Global', availability: 'None', recoverability: 'Redeploy, Restore', resources: 'Service Providers', continuity: 'Contingency Plan', preparation: 'Board signoff' },
  { scope: 'Azure Region', availability: 'Failover (automated)', recoverability: 'Restore (manual)', resources: 'IT Support', continuity: 'Failover Plan', preparation: 'Failover testing' },
  { scope: 'Data Integrity', availability: 'N/A', recoverability: 'Restore', resources: 'IT Support', continuity: 'Recovery Plan', preparation: 'Recovery testing' },
]
const defContingency = ['Declare contingency event', 'Activate communication plan', 'Switch to manual processes', 'Engage vendors for RCA', 'Establish status updates', 'Validate data integrity', 'Execute switchback', 'Post-contingency review']
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

/* ═════════════════════════════════════
   Generate
   ═════════════════════════════════════ */

export function generateBcpDocx(): void {
  const s = ld<AppSettings>('settings', { organizationName: '', guideName: '', primaryContact: '', primaryContactEmail: '', workloadDescription: '', dateFormat: 'YYYY-MM-DD', currency: 'USD', notes: '', planFocus: 'bcdr' })
  const org = s.organizationName || 'Organization'
  const app = getAppName()
  const date = new Date().toISOString().slice(0, 10)

  const criticality = ld('phase1_criticalityModel', defCrit)
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

  const children: (Paragraph | Table)[] = []

  /* ── Cover page ── */
  children.push(new Paragraph({ spacing: { before: 3600 }, text: '' }))
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'Business Continuity Plan', size: 52, bold: true, color: BRAND, font: FONT })] }))
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: 'Business Continuity & Disaster Recovery', size: 26, color: GRAY, font: FONT })] }))
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: org, size: 28, bold: true, font: FONT })] }))
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: `Solution: ${app}`, size: 24, color: BRAND, font: FONT })] }))
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: `Date: ${date}`, size: 20, color: GRAY, font: FONT })] }))
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'ISO 22301:2019 \u2014 Business Continuity Management Systems', size: 18, color: 'A0AEC0', font: FONT })] }))
  children.push(new Paragraph({ children: [new PageBreak()] }))

  /* ── 1. Document Control ── */
  children.push(h1('1. Document Control'))
  children.push(table(['Field', 'Value'], [
    ['Organization', org], ['Solution', app], ['Standard', 'ISO 22301:2019'],
    ['Primary Contact', s.primaryContact || 'TBD'], ['Contact Email', s.primaryContactEmail || 'TBD'],
    ['Date', date], ['Classification', 'Confidential'],
  ]))
  children.push(spacer())

  /* ── 2. Context ── */
  children.push(h1('2. Context of the Organization (ISO 22301 Clause 4)'))
  children.push(para(`This BCP establishes the framework for ${org} to maintain essential functions during and after a disruption.`))
  if (s.workloadDescription) {
    children.push(h2('2.1 Workload Description'))
    children.push(para(s.workloadDescription))
  }
  children.push(h2(s.workloadDescription ? '2.2 Scope' : '2.1 Scope'))
  children.push(para('All business-critical components and infrastructure as defined in the criticality model and architecture assessment.'))
  if (s.notes) { children.push(spacer()); children.push(para(`Notes: ${s.notes}`, { bold: true })) }
  children.push(spacer())

  /* ── 3. Leadership ── */
  children.push(h1('3. Leadership & Roles (ISO 22301 Clause 5)'))
  children.push(para(`${org} is committed to protecting employees, customers, and stakeholders through continuity of critical operations.`))
  children.push(h2('3.1 Role Assignment'))
  children.push(table(['Role', 'Assigned To', 'Team', 'Responsibility', 'Escalation'],
    roles.map((r: { role: string; name: string; team: string; responsibility: string; escalation: string }) => [r.role, r.name || 'TBD', r.team, r.responsibility, r.escalation])))
  children.push(spacer())

  /* ── 4. Planning ── */
  children.push(h1('4. Planning \u2014 Requirements (ISO 22301 Clause 6)'))
  children.push(table(['Category', 'Requirement', 'Status', 'Architecture Decision'],
    requirements.map((r: { category: string; requirement: string; status: string; adr: string }) =>
      [r.category, r.requirement, r.status === 'required' ? 'Required' : r.status === 'not-required' ? 'Not Required' : 'N/A', r.adr])))
  children.push(spacer())

  /* ── 5. Support ── */
  children.push(h1('5. Support \u2014 Dependencies (ISO 22301 Clause 7)'))
  biaDeps.forEach((dep: { direction: string; items: string[] }) => {
    children.push(h2(`${dep.direction} Dependencies`))
    dep.items.filter(Boolean).forEach((item: string) => children.push(bulletItem(item)))
  })
  children.push(spacer())

  /* ── 6. BIA ── */
  children.push(h1('6. Operations \u2014 Business Impact Analysis (ISO 22301 Clause 8)'))
  children.push(table(['Metric', 'Value', 'Notes'],
    biaMetrics.map((m: { metric: string; value: string; notes: string }) => [m.metric, m.value, m.notes])))
  children.push(spacer())

  /* ── 7. Gap Assessment ── */
  children.push(h1('7. Architecture & Gap Assessment'))
  children.push(table(['Component', 'Category', 'SLA', 'HA Config', 'DR Config', 'Status'],
    gapData.map((r: { component: string; category: string; sla: string; ha: string; dr: string; gap: string }) =>
      [r.component, r.category, r.sla, r.ha, r.dr, r.gap === 'met' ? 'Met' : r.gap === 'partial' ? 'Partial' : 'Gap'])))
  children.push(spacer())

  /* ── 8. BCDR Design ── */
  children.push(h1('8. BCDR Implementation Design'))
  children.push(table(['Component', 'Category', 'SLA', 'HA', 'DR', 'Remediation', 'Status'],
    design.map((r: { component: string; category: string; sla: string; ha: string; dr: string; remediation: string; status: string }) =>
      [r.component, r.category, r.sla, r.ha, r.dr, r.remediation, r.status === 'met' ? 'Met' : 'NEW'])))
  if (metricComp.length > 0) {
    children.push(h2('8.1 Metric Comparison (+BCDR)'))
    children.push(table(['Component', 'Before Avail', 'After Avail', 'Before Rel', 'After Rel', 'Before Sec', 'After Sec'],
      metricComp.map((r: { component: string; beforeAvail: string; afterAvail: string; beforeRel: string; afterRel: string; beforeSec: string; afterSec: string }) =>
        [r.component, r.beforeAvail, r.afterAvail, r.beforeRel, r.afterRel, r.beforeSec, r.afterSec])))
  }
  children.push(spacer())

  /* ── 9. Cost ── */
  children.push(h1('9. Cost Analysis'))
  children.push(para(`Current: $${totB.toLocaleString()}  |  +BCDR: $${totA.toLocaleString()}  |  Investment: +$${(totA - totB).toLocaleString()} (+${totB > 0 ? Math.round((totA - totB) / totB * 100) : 0}%)`, { bold: true, size: 24 }))
  children.push(spacer())
  children.push(table(['Component', 'Current ($)', '+BCDR ($)', 'Difference ($)'],
    [...cost.map((r: { component: string; currentCost: number; bcdrCost: number }) =>
      [r.component, r.currentCost.toLocaleString(), r.bcdrCost.toLocaleString(), `${r.bcdrCost > r.currentCost ? '+' : ''}${(r.bcdrCost - r.currentCost).toLocaleString()}`]),
     ['TOTAL', `$${totB.toLocaleString()}`, `$${totA.toLocaleString()}`, `+$${(totA - totB).toLocaleString()}`]]))
  children.push(spacer())

  /* ── 10. Response Plan ── */
  children.push(h1('10. Response Plan by Scope'))
  responsePlan.forEach((r: { scope: string; availability: string; recoverability: string; resources: string; continuity: string; preparation: string }) => {
    children.push(para(r.scope, { bold: true, size: 24, color: BRAND }))
    children.push(table(['Availability', 'Recoverability', 'Resources', 'Continuity', 'Preparation'],
      [[r.availability, r.recoverability, r.resources, r.continuity, r.preparation]]))
    children.push(spacer())
  })

  /* ── 11. Contingency ── */
  children.push(h1('11. Contingency Plan'))
  children.push(para('Procedures when the system cannot be restored within Maximum Tolerable Downtime:'))
  contingency.filter(Boolean).forEach((step: string, i: number) => children.push(bulletItem(`${i + 1}. ${step}`)))
  children.push(spacer())

  /* ── 12. Testing ── */
  children.push(h1('12. Performance Evaluation \u2014 Testing (ISO 22301 Clause 9)'))
  children.push(h2('12.1 Test Summary'))
  children.push(table(['Test Type', 'Frequency', 'Last Test', 'Next Test', 'Status', 'Owner'],
    tests.map((t: { type: string; frequency: string; lastTest: string; nextTest: string; status: string; owner: string }) =>
      [t.type, t.frequency, t.lastTest, t.nextTest, t.status, t.owner])))
  if (uat.length > 0) {
    children.push(h2('12.2 UAT Test Plan'))
    children.push(table(['Business Function', 'Test Steps', 'Expected Result', 'Priority'],
      uat.map((u: { function_name: string; testSteps: string; expectedResult: string; priority: string }) =>
        [u.function_name, u.testSteps, u.expectedResult, u.priority])))
  }
  children.push(spacer())

  /* ── 13. Maintenance ── */
  children.push(h1('13. Improvement \u2014 Maintenance (ISO 22301 Clause 10)'))
  children.push(table(['Document', 'Frequency', 'Next Review', 'Owner', 'Approver'],
    maintenance.map((m: { document: string; frequency: string; nextReview: string; owner: string; approver: string }) =>
      [m.document, m.frequency, m.nextReview, m.owner, m.approver])))
  children.push(spacer())

  /* ── Appendix A ── */
  children.push(h1('Appendix A: Criticality Model'))
  children.push(table(['Tier', 'Criticality', 'Business View', 'Financial'],
    criticality.map((r: { tier: string; criticality: string; businessView: string; financial: string }) =>
      [r.tier, r.criticality, r.businessView, r.financial])))
  children.push(spacer())

  /* ── End ── */
  children.push(para('End of Document. This BCP is a living document \u2014 review and update per the maintenance schedule.', { color: GRAY }))

  /* ── Build document ── */
  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: FONT, size: 22 } },
        heading1: { run: { font: FONT, size: 28, color: BRAND, bold: true } },
        heading2: { run: { font: FONT, size: 24, bold: true } },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: convertInchesToTwip(0.8), bottom: convertInchesToTwip(0.8), left: convertInchesToTwip(0.75), right: convertInchesToTwip(0.75) },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: `BCP \u2014 ${org}`, font: FONT, size: 16, color: GRAY }),
              new TextRun({ text: '\t', font: FONT }),
              new TextRun({ text: `Solution: ${app}`, font: FONT, size: 16, color: BRAND }),
            ],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'ISO 22301:2019 \u2014 Confidential', font: FONT, size: 14, color: 'A0AEC0' })],
          })],
        }),
      },
      children,
    }],
  })

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `BCP_${org.replace(/\s+/g, '_')}_${app.replace(/\s+/g, '_')}_${date}.docx`)
  })
}
