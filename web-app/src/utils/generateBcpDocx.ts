/**
 * ISO 22301 Business Continuity Plan — Word (.docx) Generator.
 * Uses the `docx` library to generate a proper Word document.
 */

import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType, BorderStyle, ShadingType } from 'docx'
import { saveAs } from 'file-saver'
import type { AppSettings } from '../components/Settings'

const P = () => {
  const id = localStorage.getItem('abcg_current-app') ?? 'default'
  return `abcg_${id}_`
}

function ld<T>(k: string, d: T): T {
  const r = localStorage.getItem(`${P()}${k}`)
  if (!r) return d
  try { return JSON.parse(r) } catch { return d }
}

function appName(): string {
  const id = localStorage.getItem('abcg_current-app') ?? 'default'
  const raw = localStorage.getItem('abcg_app-registry')
  if (!raw) return 'Sample Solution'
  try { const apps = JSON.parse(raw) as { id: string; name: string }[]; return apps.find(a => a.id === id)?.name ?? 'Sample Solution' } catch { return 'Sample Solution' }
}

/** Helper: create a table row */
function row(cells: string[], bold = false): TableRow {
  return new TableRow({
    children: cells.map(text => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, bold, size: 20, font: 'Segoe UI' })] })],
      width: { size: Math.floor(100 / cells.length), type: WidthType.PERCENTAGE },
      shading: bold ? { type: ShadingType.SOLID, color: 'F1F5F9' } : undefined,
    })),
  })
}

/** Helper: create a table from headers + rows */
function tbl(headers: string[], rows: string[][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    },
    rows: [row(headers, true), ...rows.map(r => row(r))],
  })
}

function h1(text: string): Paragraph {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text, color: '667EEA', font: 'Segoe UI' })] })
}
function h2(text: string): Paragraph {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text, font: 'Segoe UI' })] })
}
function p(text: string): Paragraph {
  return new Paragraph({ children: [new TextRun({ text, size: 22, font: 'Segoe UI' })] })
}
function bullet(text: string): Paragraph {
  return new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text, size: 22, font: 'Segoe UI' })] })
}

// Default data (same as PDF generator)
const defBiaMetrics = [
  { metric: 'Composite SLO', value: '99.95%', notes: 'Based on service chain' },
  { metric: 'RTO', value: '4 hours', notes: 'Maximum recovery time' },
  { metric: 'RPO', value: '1 hour', notes: 'Maximum data loss' },
  { metric: 'MTD', value: '24 hours', notes: 'Maximum tolerable downtime' },
  { metric: 'Revenue Impact/hr', value: '$50,000', notes: 'Estimated business loss' },
]

const defRoles = [
  { role: 'Incident Commander', name: '', team: 'Operations', responsibility: 'Overall coordination', escalation: 'CTO' },
  { role: 'Technical Lead', name: '', team: 'Engineering', responsibility: 'Technical response', escalation: 'IC' },
  { role: 'DBA / Data Lead', name: '', team: 'Data Eng', responsibility: 'Database failover', escalation: 'Tech Lead' },
]

const defTests = [
  { type: 'Region Failover', frequency: 'Quarterly', lastTest: '2026-01-15', nextTest: '2026-04-15', status: 'Passed', owner: 'Infra Lead' },
  { type: 'Zone Failover', frequency: 'Monthly', lastTest: '2026-03-01', nextTest: '2026-04-01', status: 'Passed', owner: 'Infra Lead' },
]

export function generateBcpDocx(): void {
  const s = ld<AppSettings>('settings', { organizationName: '', guideName: '', primaryContact: '', primaryContactEmail: '', workloadDescription: '', dateFormat: 'YYYY-MM-DD', currency: 'USD', notes: '' })
  const org = s.organizationName || 'Organization'
  const app = appName()
  const date = new Date().toISOString().slice(0, 10)

  const biaMetrics = ld('phase2-bia-metrics', defBiaMetrics)
  const roles = ld('phase2-role-assignment', defRoles)
  const tests = ld('phase2-test-summary', defTests)
  const gapData = ld<{ component: string; category: string; sla: string; ha: string; dr: string; gap: string }[]>('phase2-gap-assessment', [])
  const cost = ld<{ component: string; currentCost: number; bcdrCost: number }[]>('phase2-cost-comparison', [])
  const contingency = ld<string[]>('phase2-contingency-steps', ['Declare contingency event', 'Activate communication plan', 'Switch to manual processes'])
  const maintenance = ld<{ document: string; frequency: string; nextReview: string; owner: string; approver: string }[]>('phase2-maintenance', [])

  const children: (Paragraph | Table)[] = []

  // Cover
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 4000 }, children: [new TextRun({ text: 'Business Continuity Plan', size: 56, bold: true, color: '667EEA', font: 'Segoe UI' })] }))
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Business Continuity & Disaster Recovery', size: 28, color: '718096', font: 'Segoe UI' })] }))
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600 }, children: [new TextRun({ text: org, size: 26, bold: true, font: 'Segoe UI' })] }))
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Solution: ${app}`, size: 22, color: '667EEA', font: 'Segoe UI' })] }))
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Date: ${date}`, size: 20, color: '718096', font: 'Segoe UI' })] }))
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 800 }, children: [new TextRun({ text: 'ISO 22301:2019 — Business Continuity Management Systems', size: 18, color: 'A0AEC0', font: 'Segoe UI' })] }))
  children.push(new Paragraph({ pageBreakBefore: true, text: '' }))

  // 1. Document Control
  children.push(h1('1. Document Control'))
  children.push(tbl(['Field', 'Value'], [
    ['Organization', org], ['Solution', app], ['Standard', 'ISO 22301:2019'],
    ['Primary Contact', s.primaryContact || 'TBD'], ['Contact Email', s.primaryContactEmail || 'TBD'],
    ['Date', date], ['Classification', 'Confidential'],
  ]))

  // 2. Context
  children.push(h1('2. Context of the Organization (ISO 22301 Clause 4)'))
  children.push(p(`This BCP establishes the framework for ${org} to maintain essential functions during and after a disruption.`))
  if (s.workloadDescription) {
    children.push(h2('2.1 Workload Description'))
    children.push(p(s.workloadDescription))
  }

  // 3. Leadership
  children.push(h1('3. Leadership & Roles (ISO 22301 Clause 5)'))
  children.push(p(`${org} is committed to continuity of critical business operations.`))
  children.push(h2('3.1 Role Assignment'))
  children.push(tbl(['Role', 'Assigned To', 'Team', 'Responsibility', 'Escalation'],
    roles.map((r: { role: string; name: string; team: string; responsibility: string; escalation: string }) => [r.role, r.name || 'TBD', r.team, r.responsibility, r.escalation])))

  // 6. BIA
  children.push(h1('6. Operations — Business Impact Analysis (ISO 22301 Clause 8)'))
  children.push(tbl(['Metric', 'Value', 'Notes'],
    biaMetrics.map((m: { metric: string; value: string; notes: string }) => [m.metric, m.value, m.notes])))

  // 7. Gap Assessment
  if (gapData.length > 0) {
    children.push(h1('7. Architecture & Gap Assessment'))
    children.push(tbl(['Component', 'Category', 'SLA', 'HA Config', 'DR Config', 'Status'],
      gapData.map(r => [r.component, r.category, r.sla, r.ha, r.dr, r.gap === 'met' ? 'Met' : r.gap === 'partial' ? 'Partial' : 'Gap'])))
  }

  // 9. Cost
  if (cost.length > 0) {
    children.push(h1('9. Cost Analysis'))
    const totB = cost.reduce((a, r) => a + r.currentCost, 0)
    const totA = cost.reduce((a, r) => a + r.bcdrCost, 0)
    children.push(p(`Current: $${totB.toLocaleString()} | +BCDR: $${totA.toLocaleString()} | Investment: +$${(totA - totB).toLocaleString()}`))
    children.push(tbl(['Component', 'Current ($)', '+BCDR ($)', 'Diff ($)'],
      cost.map(r => [r.component, r.currentCost.toLocaleString(), r.bcdrCost.toLocaleString(), (r.bcdrCost - r.currentCost).toLocaleString()])))
  }

  // 11. Contingency
  children.push(h1('11. Contingency Plan'))
  contingency.filter(Boolean).forEach((st: string) => children.push(bullet(st)))

  // 12. Testing
  children.push(h1('12. Performance Evaluation — Testing (ISO 22301 Clause 9)'))
  children.push(tbl(['Test Type', 'Frequency', 'Last Test', 'Next Test', 'Status', 'Owner'],
    tests.map((t: { type: string; frequency: string; lastTest: string; nextTest: string; status: string; owner: string }) => [t.type, t.frequency, t.lastTest, t.nextTest, t.status, t.owner])))

  // 13. Maintenance
  if (maintenance.length > 0) {
    children.push(h1('13. Improvement — Maintenance (ISO 22301 Clause 10)'))
    children.push(tbl(['Document', 'Frequency', 'Next Review', 'Owner', 'Approver'],
      maintenance.map(m => [m.document, m.frequency, m.nextReview, m.owner, m.approver])))
  }

  children.push(p(''))
  children.push(p('End of Document. This BCP is a living document — review and update per the maintenance schedule.'))

  const doc = new Document({
    sections: [{ children }],
  })

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `BCP_${org.replace(/\s+/g, '_')}_${app.replace(/\s+/g, '_')}_${date}.docx`)
  })
}
