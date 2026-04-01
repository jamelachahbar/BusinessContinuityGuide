/**
 * ISO 22301:2019 — Business Continuity Plan PDF Generator.
 *
 * Loads from localStorage OR falls back to the same default data
 * used by the workbench components, so the PDF always shows content.
 */

import type { AppSettings } from '../components/Settings'

function getAppPrefix(): string {
  const currentAppId = localStorage.getItem('abcg_current-app') ?? 'default'
  return `abcg_${currentAppId}_`
}

function getAppName(): string {
  const currentAppId = localStorage.getItem('abcg_current-app') ?? 'default'
  const raw = localStorage.getItem('abcg_app-registry')
  if (!raw) return 'Sample Solution'
  try {
    const apps = JSON.parse(raw) as { id: string; name: string }[]
    return apps.find(a => a.id === currentAppId)?.name ?? 'Sample Solution'
  } catch { return 'Sample Solution' }
}

/**
 * Load from localStorage with current app prefix.
 * Falls back to the provided default data.
 */
function ld<T>(k: string, fallback: T): T {
  const P = getAppPrefix()
  const r = localStorage.getItem(`${P}${k}`)
  if (!r) return fallback
  try { return JSON.parse(r) } catch { return fallback }
}

function dt(): string { return new Date().toISOString().slice(0, 10) }
function e(s: string): string { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, ' ') }

function tbl(headers: string[], rows: string[][], opts?: { centerCols?: number[] }): string {
  const cc = new Set(opts?.centerCols ?? [])
  if (rows.length === 0) return '<p><em>No data entered yet.</em></p>'
  return `<table><thead><tr>${headers.map((h, i) => `<th${cc.has(i) ? ' class="c"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${cc.has(i) ? ' class="c"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`
}

function badge(text: string, color: string, textColor = '#fff'): string {
  return `<span class="badge" style="background:${color};color:${textColor}">${e(text)}</span>`
}

/* ═══════════════════════════════════════════════════════
   Default data (same as what the components use)
   — so the PDF is populated even if user hasn't edited anything
   ═══════════════════════════════════════════════════════ */

const defCriticality = [
  { tier: 'Tier 1', criticality: 'Mission Critical', color: '#dc3545', businessView: 'Affects the company\'s mission and might noticeably affect corporate profit-and-loss statements', financial: 'n/a' },
  { tier: 'Tier 1', criticality: 'Business Critical', color: '#dc3545', businessView: 'Can lead to financial losses for the organization', financial: '> $250k' },
  { tier: 'Tier 1', criticality: 'Safety Critical', color: '#dc3545', businessView: 'Physical safety of employees and customers at risk', financial: 'n/a' },
  { tier: 'Tier 2', criticality: 'High', color: '#ffc107', businessView: 'Affects high-importance processes; measurable losses', financial: '< $250k' },
  { tier: 'Tier 3', criticality: 'Medium', color: '#28a745', businessView: 'Low losses; brand damage likely', financial: '< $100k' },
  { tier: 'Tier 4', criticality: 'Low', color: '#28a745', businessView: 'Impact not measurable; localized', financial: '< $50k' },
  { tier: 'Tier 5', criticality: 'Unsupported', color: '#6c757d', businessView: 'No investment justification', financial: '$0' },
]

const defRequirements = [
  { category: 'Availability', requirement: 'Multi-region deployment', status: 'required', adr: 'Active-passive with Azure Traffic Manager' },
  { category: 'Availability', requirement: 'Zone redundancy', status: 'required', adr: 'All services deployed across 3 AZs' },
  { category: 'Recovery', requirement: 'RTO < 4 hours', status: 'required', adr: 'Automated failover achieves ~15 min RTO' },
  { category: 'Recovery', requirement: 'RPO < 1 hour', status: 'required', adr: 'Continuous replication configured' },
  { category: 'Monitoring', requirement: 'Application Insights APM', status: 'required', adr: 'Full APM configured' },
  { category: 'Security', requirement: 'DDoS Protection', status: 'required', adr: 'Standard tier enabled on VNet' },
  { category: 'Compliance', requirement: 'Data residency', status: 'required', adr: 'Australia East + Australia Southeast' },
  { category: 'Testing', requirement: 'Quarterly failover drills', status: 'required', adr: 'Automated failover test pipeline' },
]

const defBiaMetrics = [
  { metric: 'Composite SLO', value: '99.95%', notes: 'Based on service chain calculation' },
  { metric: 'RTO', value: '4 hours', notes: 'Maximum acceptable recovery time' },
  { metric: 'RPO', value: '1 hour', notes: 'Maximum acceptable data loss' },
  { metric: 'MTD', value: '24 hours', notes: 'Maximum tolerable downtime' },
  { metric: 'Revenue Impact (per hour)', value: '$50,000', notes: 'Estimated business loss during outage' },
]

const defBiaDeps = [
  { direction: 'Upstream', items: ['Customer Web Portal', 'Mobile Application', 'Partner API Gateway', 'CDN (static assets)'] },
  { direction: 'Downstream', items: ['Payment Processing Service', 'Email / Notification Service', 'Reporting Data Warehouse', 'Third-party CRM Integration'] },
]

const defGapData = [
  { component: 'Microsoft Entra ID', category: 'Identity', sla: '99.99%', ha: 'Global redundancy', dr: '\u2014', gap: 'met' },
  { component: 'Azure DNS', category: 'Networking', sla: '100%', ha: 'Global anycast', dr: '\u2014', gap: 'met' },
  { component: 'App Service Plan', category: 'Compute', sla: '99.95%', ha: 'Single region', dr: 'None', gap: 'gap' },
  { component: 'Azure SQL Database', category: 'Data', sla: '99.99%', ha: 'Zone redundant', dr: 'No geo-replication', gap: 'partial' },
  { component: 'Azure Cache for Redis', category: 'Cache', sla: '99.9%', ha: 'Standard tier', dr: 'No geo-replication', gap: 'gap' },
]

const defResponsePlan = [
  { scope: 'Global', availability: 'None', recoverability: 'Redeploy, Restore', resources: 'Service Providers, Authorities, IT Support', continuity: 'Contingency Plan', preparation: 'Board signoff; Communication plan; Redeploy testing' },
  { scope: 'Azure Region', availability: 'Failover to secondary (automated)', recoverability: 'Restore (manual)', resources: 'IT Support, Vendor', continuity: 'Failover Plan', preparation: 'App Owner signoff; Failover testing' },
  { scope: 'Azure Zone', availability: 'Failover between zones (automated)', recoverability: 'Restore (manual)', resources: 'IT Support', continuity: 'Failover Plan', preparation: 'Failover testing; Recovery testing' },
  { scope: 'Data Integrity Issue', availability: 'N/A', recoverability: 'Restore (manual)', resources: 'IT Support', continuity: 'Recovery Plan', preparation: 'Recovery testing' },
]

const defDesign = [
  { component: 'App Service Plan', category: 'Compute', sla: '99.95%', ha: 'Zone-redundant + secondary', dr: 'Active-passive failover', remediation: 'Deploy to secondary region', status: 'new' },
  { component: 'Azure SQL Database', category: 'Data', sla: '99.995%', ha: 'Zone redundant', dr: 'Active geo-replication', remediation: 'Enable geo-replication', status: 'new' },
  { component: 'Azure Cache', category: 'Cache', sla: '99.9%', ha: 'Premium + zone', dr: 'Geo-replication', remediation: 'Upgrade to Premium', status: 'new' },
  { component: 'Azure Key Vault', category: 'Security', sla: '99.99%', ha: 'Zone redundant', dr: 'Managed replication', remediation: 'No change required', status: 'met' },
]

const defCost = [
  { component: 'App Service Plan', currentCost: 500, bcdrCost: 1000 },
  { component: 'Azure SQL Database', currentCost: 800, bcdrCost: 1200 },
  { component: 'Azure Cache', currentCost: 300, bcdrCost: 600 },
  { component: 'Storage Account', currentCost: 50, bcdrCost: 75 },
]

const defMetrics = [
  { component: 'App Service', beforeAvail: '99.95', afterAvail: '99.99', beforeRel: '95', afterRel: '99', beforeSec: '80', afterSec: '92' },
  { component: 'Azure SQL', beforeAvail: '99.99', afterAvail: '99.995', beforeRel: '98', afterRel: '99.5', beforeSec: '90', afterSec: '95' },
]

const defContingency = [
  'Declare contingency event \u2014 confirm system cannot be restored within MTD',
  'Activate contingency communication plan \u2014 notify stakeholders',
  'Switch to manual / offline processes per business function',
  'Engage service providers for root cause analysis',
  'Establish regular status updates',
  'Prepare for restoration \u2014 validate data integrity',
  'Execute controlled switchback',
  'Conduct post-contingency review',
]

const defRoles = [
  { role: 'Incident Commander', name: '', team: 'Operations', responsibility: 'Overall coordination and decision-making', escalation: 'CTO' },
  { role: 'Technical Lead', name: '', team: 'Engineering', responsibility: 'Technical response and root cause analysis', escalation: 'Incident Commander' },
  { role: 'Communications Lead', name: '', team: 'Operations', responsibility: 'Stakeholder notifications', escalation: 'Incident Commander' },
  { role: 'DBA / Data Lead', name: '', team: 'Data Engineering', responsibility: 'Database failover and data integrity', escalation: 'Technical Lead' },
  { role: 'Infrastructure Lead', name: '', team: 'Platform / SRE', responsibility: 'Compute, network, storage failover', escalation: 'Technical Lead' },
  { role: 'Security Lead', name: '', team: 'Security', responsibility: 'Security assessment', escalation: 'Incident Commander' },
]

const defTests = [
  { type: 'Region Failover', frequency: 'Quarterly', lastTest: '2026-01-15', nextTest: '2026-04-15', status: 'Passed', owner: 'Infrastructure Lead' },
  { type: 'Zone Failover', frequency: 'Monthly', lastTest: '2026-03-01', nextTest: '2026-04-01', status: 'Passed', owner: 'Infrastructure Lead' },
  { type: 'Database Recovery', frequency: 'Quarterly', lastTest: '2026-02-10', nextTest: '2026-05-10', status: 'Passed', owner: 'DBA / Data Lead' },
  { type: 'Load Test', frequency: 'Monthly', lastTest: '2026-03-10', nextTest: '2026-04-10', status: 'Degraded', owner: 'QA / Validation' },
  { type: 'Penetration Test', frequency: 'Annually', lastTest: '2025-11-01', nextTest: '2026-11-01', status: 'Passed', owner: 'Security Lead' },
]

const defUat = [
  { function_name: 'User Authentication', testSteps: 'Login via Entra ID SSO', expectedResult: 'Dashboard loads within 3s', priority: 'High' },
  { function_name: 'Order Processing', testSteps: 'Submit order with valid payment', expectedResult: 'Order confirmed, email received', priority: 'High' },
  { function_name: 'Data Retrieval', testSteps: 'Search and retrieve records', expectedResult: 'Results within 200ms', priority: 'High' },
]

const defMaintenance = [
  { document: 'Business Impact Analysis', frequency: 'Annually', nextReview: '2027-01-15', owner: 'Application Owner', approver: 'Business Stakeholder' },
  { document: 'Failover Runbook', frequency: 'Quarterly', nextReview: '2026-07-01', owner: 'Infrastructure Lead', approver: 'Operations Manager' },
  { document: 'Contingency Plan', frequency: 'Semi-annually', nextReview: '2026-10-01', owner: 'Business Liaison', approver: 'Application Owner' },
  { document: 'Role Assignment', frequency: 'Quarterly', nextReview: '2026-07-01', owner: 'Operations Manager', approver: 'Application Owner' },
  { document: 'Test Plans', frequency: 'Annually', nextReview: '2027-01-15', owner: 'QA / Validation', approver: 'Technical Lead' },
]

/* ═══════════════════════════════════════════════════════
   Generate
   ═══════════════════════════════════════════════════════ */

export function generateBcpPdf(): void {
  const s = ld<AppSettings>('settings', { organizationName: '', guideName: 'Azure Business Continuity Guide', primaryContact: '', primaryContactEmail: '', workloadDescription: '', dateFormat: 'YYYY-MM-DD', currency: 'USD', notes: '' })
  const org = s.organizationName || 'Organization'
  const appName = getAppName()
  const date = dt()

  // Load with REAL defaults as fallback
  const criticality = ld('phase1_criticalityModel', defCriticality)
  const requirements = ld('phase2-requirements', defRequirements)
  const biaMetrics = ld('phase2-bia-metrics', defBiaMetrics)
  const biaDeps = ld('phase2-bia-deps', defBiaDeps)
  const gapData = ld('phase2-gap-assessment', defGapData)
  const responsePlan = ld('phase2-response-plan', defResponsePlan)
  const design = ld('phase2-continuity-design', defDesign)
  const cost = ld('phase2-cost-comparison', defCost)
  const metricComp = ld('phase2-metric-comparison', defMetrics)
  const contingency = ld('phase2-contingency-steps', defContingency)
  const roles = ld('phase2-role-assignment', defRoles)
  const tests = ld('phase2-test-summary', defTests)
  const uat = ld('phase2-uat-cases', defUat)
  const maintenance = ld('phase2-maintenance', defMaintenance)

  const totB = cost.reduce((a: number, r: { currentCost: number }) => a + r.currentCost, 0)
  const totA = cost.reduce((a: number, r: { bcdrCost: number }) => a + r.bcdrCost, 0)

  const scopeColors = ['#1a237e','#283593','#303f9f','#3949ab','#3f51b5','#5c6bc0']

  const css = `
    @page { size: A4; margin: 18mm 16mm 22mm 16mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 10.5pt; color: #1a202c; line-height: 1.5; }
    .cover { page-break-after: always; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 88vh; text-align: center; }
    .cover-bar { width: 100%; height: 6px; background: linear-gradient(90deg, #667eea, #764ba2); margin-bottom: 60px; }
    .cover h1 { font-size: 26pt; font-weight: 700; color: #667eea; margin-bottom: 6px; }
    .cover h2 { font-size: 14pt; font-weight: 400; color: #718096; margin-bottom: 36px; }
    .cover-org { font-size: 13pt; font-weight: 600; color: #1a202c; }
    .cover-app { font-size: 11pt; font-weight: 500; color: #667eea; margin-top: 4px; }
    .cover-date { font-size: 10pt; color: #718096; margin-top: 4px; }
    .cover-std { margin-top: 40px; font-size: 9pt; color: #a0aec0; border: 1px solid #e2e8f0; padding: 6px 20px; border-radius: 4px; }
    h1 { font-size: 16pt; font-weight: 700; color: #667eea; margin: 28px 0 10px; border-bottom: 2px solid #667eea; padding-bottom: 4px; page-break-after: avoid; }
    h2 { font-size: 13pt; font-weight: 600; color: #1a202c; margin: 16px 0 6px; page-break-after: avoid; }
    h3 { font-size: 11pt; font-weight: 600; color: #764ba2; margin: 12px 0 4px; }
    p, li { margin-bottom: 4px; } ul, ol { margin-left: 18px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0 14px; font-size: 9pt; page-break-inside: auto; }
    th { background: #f1f5f9; font-weight: 600; text-align: left; padding: 6px 8px; border-bottom: 2px solid #e2e8f0; }
    td { padding: 5px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    tr { page-break-inside: avoid; } th.c, td.c { text-align: center; }
    .badge { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 8pt; font-weight: 600; }
    .info { background: #f1f5f9; border-left: 3px solid #667eea; padding: 8px 12px; margin: 8px 0; border-radius: 0 4px 4px 0; font-size: 9.5pt; }
    .metric-row { display: flex; gap: 10px; flex-wrap: wrap; margin: 8px 0; }
    .metric-box { flex: 1; min-width: 100px; background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px 10px; text-align: center; }
    .metric-val { font-size: 14pt; font-weight: 700; color: #667eea; }
    .metric-lbl { font-size: 8pt; color: #718096; }
    .scope-row { padding: 8px 12px; margin-bottom: 3px; border-radius: 4px; color: #fff; font-size: 9pt; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `

  const sec: string[] = []

  // Cover
  sec.push(`<div class="cover"><div class="cover-bar"></div><h1>Business Continuity Plan</h1><h2>Business Continuity &amp; Disaster Recovery</h2><div class="cover-org">${e(org)}</div><div class="cover-app">Solution: ${e(appName)}</div><div class="cover-date">Date: ${date}</div><div class="cover-std">ISO 22301:2019 &mdash; Business Continuity Management Systems</div></div>`)

  // 1. Document Control
  sec.push(`<h1>1. Document Control</h1>`)
  sec.push(tbl(['Field', 'Value'], [['Organization', e(org)], ['Solution', e(appName)], ['Standard', 'ISO 22301:2019'], ['Primary Contact', e(s.primaryContact || 'TBD')], ['Contact Email', e(s.primaryContactEmail || 'TBD')], ['Date', date], ['Classification', 'Confidential']]))

  // 2. Context (ISO §4)
  sec.push(`<h1>2. Context of the Organization (ISO 22301 Clause 4)</h1>`)
  sec.push(`<p>This BCP establishes the framework for ${e(org)} to maintain essential functions during and after a disruption.</p>`)
  if (s.workloadDescription) {
    sec.push(`<h2>2.1 Workload Description</h2>`)
    sec.push(`<p>${e(s.workloadDescription)}</p>`)
  }
  sec.push(`<h2>${s.workloadDescription ? '2.2' : '2.1'} Scope</h2><p>All business-critical components and infrastructure as defined in the criticality model and architecture assessment.</p>`)
  if (s.notes) sec.push(`<div class="info"><strong>Notes:</strong> ${e(s.notes)}</div>`)

  // 3. Leadership (ISO §5)
  sec.push(`<h1>3. Leadership &amp; Roles (ISO 22301 Clause 5)</h1>`)
  sec.push(`<p>${e(org)} is committed to protecting employees, customers, and stakeholders through continuity of critical business operations.</p>`)
  sec.push(`<h2>3.1 Role Assignment</h2>`)
  sec.push(tbl(['Role', 'Assigned To', 'Team', 'Responsibility', 'Escalation'],
    roles.map((r: { role: string; name: string; team: string; responsibility: string; escalation: string }) => [e(r.role), e(r.name || 'TBD'), e(r.team), e(r.responsibility), e(r.escalation)])))

  // 4. Planning (ISO §6)
  sec.push(`<h1>4. Planning &mdash; Requirements (ISO 22301 Clause 6)</h1>`)
  sec.push(tbl(['Category', 'Requirement', 'Status', 'Architecture Decision'],
    requirements.map((r: { category: string; requirement: string; status: string; adr: string }) => [e(r.category), e(r.requirement), r.status === 'required' ? badge('Required', '#28a745') : r.status === 'not-required' ? badge('Not Req', '#dc3545') : badge('N/A', '#6c757d'), e(r.adr)]), { centerCols: [2] }))

  // 5. Support (ISO §7)
  sec.push(`<h1>5. Support &mdash; Dependencies (ISO 22301 Clause 7)</h1>`)
  biaDeps.forEach((dep: { direction: string; items: string[] }) => {
    sec.push(`<h3>${e(dep.direction)} Dependencies</h3><ul>${dep.items.filter(Boolean).map((i: string) => `<li>${e(i)}</li>`).join('')}</ul>`)
  })

  // 6. Operations / BIA (ISO §8)
  sec.push(`<h1>6. Operations &mdash; Business Impact Analysis (ISO 22301 Clause 8)</h1>`)
  sec.push(tbl(['Metric', 'Value', 'Notes'],
    biaMetrics.map((m: { metric: string; value: string; notes: string }) => [`<strong>${e(m.metric)}</strong>`, e(m.value), e(m.notes)]), { centerCols: [1] }))

  // 7. Gap Assessment
  sec.push(`<h1>7. Architecture &amp; Gap Assessment</h1>`)
  sec.push(tbl(['Component', 'Category', 'SLA', 'HA Config', 'DR Config', 'Status'],
    gapData.map((r: { component: string; category: string; sla: string; ha: string; dr: string; gap: string }) => [e(r.component), e(r.category), r.sla, e(r.ha), e(r.dr),
      r.gap === 'met' ? badge('Met', '#28a745') : r.gap === 'partial' ? badge('Partial', '#ffc107', '#1a1a1a') : badge('Gap', '#dc3545')]),
    { centerCols: [2, 5] }))

  // 8. BCDR Design
  sec.push(`<h1>8. BCDR Implementation Design</h1>`)
  sec.push(tbl(['Component', 'Category', 'SLA', 'HA', 'DR', 'Remediation', 'Status'],
    design.map((r: { component: string; category: string; sla: string; ha: string; dr: string; remediation: string; status: string }) => [e(r.component), e(r.category), r.sla, e(r.ha), e(r.dr), e(r.remediation),
      r.status === 'met' ? badge('Met', '#28a745') : badge('NEW', '#0078d4')]),
    { centerCols: [2, 6] }))
  // Metric comparison
  if (metricComp.length > 0) {
    sec.push(`<h2>8.1 Metric Comparison (+BCDR)</h2>`)
    sec.push(tbl(['Component', 'Before Avail', 'After Avail', 'Before Rel', 'After Rel', 'Before Sec', 'After Sec'],
      metricComp.map((r: { component: string; beforeAvail: string; afterAvail: string; beforeRel: string; afterRel: string; beforeSec: string; afterSec: string }) => [e(r.component), r.beforeAvail, `<strong style="color:#28a745">${r.afterAvail}</strong>`, r.beforeRel, `<strong style="color:#28a745">${r.afterRel}</strong>`, r.beforeSec, `<strong style="color:#28a745">${r.afterSec}</strong>`]),
      { centerCols: [1, 2, 3, 4, 5, 6] }))
  }

  // 9. Cost
  sec.push(`<h1>9. Cost Analysis</h1>`)
  sec.push(`<div class="metric-row"><div class="metric-box"><div class="metric-val">$${totB.toLocaleString()}</div><div class="metric-lbl">Current</div></div><div class="metric-box"><div class="metric-val">$${totA.toLocaleString()}</div><div class="metric-lbl">+BCDR</div></div><div class="metric-box"><div class="metric-val" style="color:#dc3545">+$${(totA - totB).toLocaleString()}</div><div class="metric-lbl">Investment</div></div></div>`)
  sec.push(tbl(['Component', 'Current ($)', '+BCDR ($)', 'Diff ($)'],
    [...cost.map((r: { component: string; currentCost: number; bcdrCost: number }) => [e(r.component), r.currentCost.toLocaleString(), r.bcdrCost.toLocaleString(), `${r.bcdrCost > r.currentCost ? '+' : ''}${(r.bcdrCost - r.currentCost).toLocaleString()}`]),
     [`<strong>TOTAL</strong>`, `$${totB.toLocaleString()}`, `$${totA.toLocaleString()}`, `<strong>+$${(totA - totB).toLocaleString()}</strong>`]],
    { centerCols: [1, 2, 3] }))

  // 10. Response Plan
  sec.push(`<h1>10. Response Plan by Scope</h1>`)
  responsePlan.forEach((r: { scope: string; availability: string; recoverability: string; resources: string; continuity: string; preparation: string }, i: number) => {
    sec.push(`<div class="scope-row" style="background:${scopeColors[i % scopeColors.length]}"><strong>${e(r.scope)}</strong></div>`)
    sec.push(`<table><tr><td><strong>Availability:</strong> ${e(r.availability)}</td><td><strong>Recoverability:</strong> ${e(r.recoverability)}</td></tr><tr><td><strong>Resources:</strong> ${e(r.resources)}</td><td><strong>Continuity:</strong> ${e(r.continuity)}</td></tr><tr><td colspan="2"><strong>Preparation:</strong> ${e(r.preparation)}</td></tr></table>`)
  })

  // 11. Contingency
  sec.push(`<h1>11. Contingency Plan</h1>`)
  sec.push(`<ol>${contingency.filter(Boolean).map((st: string) => `<li>${e(st)}</li>`).join('')}</ol>`)

  // 12. Testing (ISO §9)
  sec.push(`<h1>12. Performance Evaluation &mdash; Testing (ISO 22301 Clause 9)</h1>`)
  sec.push(tbl(['Test Type', 'Frequency', 'Last Test', 'Next Test', 'Status', 'Owner'],
    tests.map((t: { type: string; frequency: string; lastTest: string; nextTest: string; status: string; owner: string }) => [e(t.type), e(t.frequency), t.lastTest, t.nextTest,
      t.status === 'Passed' ? badge('Passed', '#28a745') : t.status === 'Degraded' ? badge('Degraded', '#ffc107', '#1a1a1a') : badge('Failed', '#dc3545'),
      e(t.owner)]), { centerCols: [1, 2, 3, 4] }))
  if (uat.length > 0) {
    sec.push(`<h2>12.1 UAT Test Plan</h2>`)
    sec.push(tbl(['Business Function', 'Test Steps', 'Expected Result', 'Priority'],
      uat.map((u: { function_name: string; testSteps: string; expectedResult: string; priority: string }) => [e(u.function_name), e(u.testSteps), e(u.expectedResult),
        u.priority === 'High' ? badge('High', '#dc3545') : u.priority === 'Medium' ? badge('Medium', '#ffc107', '#1a1a1a') : badge('Low', '#28a745')]),
      { centerCols: [3] }))
  }

  // 13. Maintenance (ISO §10)
  sec.push(`<h1>13. Improvement &mdash; Maintenance (ISO 22301 Clause 10)</h1>`)
  sec.push(tbl(['Document', 'Frequency', 'Next Review', 'Owner', 'Approver'],
    maintenance.map((m: { document: string; frequency: string; nextReview: string; owner: string; approver: string }) => [e(m.document), e(m.frequency), e(m.nextReview), e(m.owner), e(m.approver)]),
    { centerCols: [1, 2] }))

  // Appendix: Criticality
  sec.push(`<h1>Appendix A: Criticality Model</h1>`)
  sec.push(tbl(['Tier', 'Criticality', 'Business View', 'Financial'],
    criticality.map((r: { tier: string; criticality: string; color: string; businessView: string; financial: string }) => [e(r.tier), badge(e(r.criticality), r.color), e(r.businessView), e(r.financial)])))

  sec.push(`<div class="info"><strong>End of Document.</strong> This BCP is a living document. Review and update per the maintenance schedule.</div>`)

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>BCP - ${e(org)} - ${e(appName)}</title><style>${css}</style></head><body>${sec.join('\n')}</body></html>`

  // Use Blob URL to avoid about:blank in title bar
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const w = window.open(url, '_blank')
  if (!w) { alert('Please allow popups to generate the PDF.'); URL.revokeObjectURL(url); return }
  w.addEventListener('afterprint', () => URL.revokeObjectURL(url))
  setTimeout(() => w.print(), 600)
}
