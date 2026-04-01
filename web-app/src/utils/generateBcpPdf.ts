/**
 * ISO 22301:2019 — Business Continuity Plan PDF Generator.
 *
 * Pulls ALL workbench data from localStorage and generates a print-ready
 * HTML document following the ISO 22301 BCMS structure.
 *
 * Data keys mapped:
 *   Phase 1: phase1_criticalityModel, phase1_raci, phase1_faultModel,
 *            phase1_appRequirements, phase1_testPlans
 *   Phase 2 Assess: phase2-requirements, phase2-bia-metrics, phase2-bia-deps,
 *                    phase2-gap-assessment
 *   Phase 2 Implement: phase2-response-plan, phase2-continuity-design,
 *                       phase2-cost-comparison, phase2-metric-comparison,
 *                       phase2-contingency-steps, phase2-role-assignment
 *   Phase 2 Test: phase2-test-summary, phase2-uat-cases, phase2-maintenance
 *   Settings: settings
 */

import type { AppSettings } from '../components/Settings'

const P = 'abcg_'
function ld<T>(k: string, d: T): T { const r = localStorage.getItem(`${P}${k}`); if (!r) return d; try { return JSON.parse(r) } catch { return d } }
function dt(): string { return new Date().toISOString().slice(0, 10) }
function e(s: string): string { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }

function tbl(headers: string[], rows: string[][], opts?: { centerCols?: number[] }): string {
  const cc = new Set(opts?.centerCols ?? [])
  return `<table><thead><tr>${headers.map((h, i) => `<th${cc.has(i) ? ' class="c"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${cc.has(i) ? ' class="c"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`
}

function badge(text: string, color: string, textColor = '#fff'): string {
  return `<span class="badge" style="background:${color};color:${textColor}">${e(text)}</span>`
}

export function generateBcpPdf(): void {
  const s = ld<AppSettings>('settings', { organizationName: '', guideName: 'Azure Business Continuity Guide', primaryContact: '', primaryContactEmail: '', dateFormat: 'YYYY-MM-DD', currency: 'USD', notes: '' })
  const org = s.organizationName || 'Organization'
  const date = dt()

  // ── Load all data ──
  const criticality = ld<{ tier: string; criticality: string; color: string; businessView: string; financial: string }[]>('phase1_criticalityModel', [])
  const raci = ld<{ task: string; values: Record<string, string> }[]>('phase1_raci', [])
  const faultModel = ld<{ failureType: string; description: string; tier1: string; tier2: string; tier3: string }[]>('phase1_faultModel', [])
  const appReqs = ld<{ category: string; requirement: string; priority: string; status: string }[]>('phase1_appRequirements', [])

  const requirements = ld<{ category: string; requirement: string; status: string; adr: string }[]>('phase2-requirements', [])
  const biaMetrics = ld<{ metric: string; value: string; notes: string }[]>('phase2-bia-metrics', [])
  const biaDeps = ld<{ direction: string; items: string[] }[]>('phase2-bia-deps', [])
  const gapData = ld<{ component: string; category: string; sla: string; ha: string; dr: string; gap: string }[]>('phase2-gap-assessment', [])

  const responsePlan = ld<{ scope: string; availability: string; recoverability: string; resources: string; continuity: string; preparation: string }[]>('phase2-response-plan', [])
  const design = ld<{ component: string; category: string; sla: string; ha: string; dr: string; remediation: string; status: string }[]>('phase2-continuity-design', [])
  const cost = ld<{ component: string; currentCost: number; bcdrCost: number }[]>('phase2-cost-comparison', [])
  const metricComp = ld<{ component: string; beforeAvail: string; afterAvail: string; beforeRel: string; afterRel: string; beforeSec: string; afterSec: string }[]>('phase2-metric-comparison', [])
  const contingency = ld<string[]>('phase2-contingency-steps', [])
  const roles = ld<{ role: string; name: string; team: string; responsibility: string; escalation: string }[]>('phase2-role-assignment', [])

  const tests = ld<{ type: string; frequency: string; lastTest: string; nextTest: string; status: string; owner: string }[]>('phase2-test-summary', [])
  const uat = ld<{ function_name: string; testSteps: string; expectedResult: string; priority: string }[]>('phase2-uat-cases', [])
  const maintenance = ld<{ document: string; frequency: string; nextReview: string; owner: string; approver: string }[]>('phase2-maintenance', [])

  const totB = cost.reduce((a, r) => a + r.currentCost, 0)
  const totA = cost.reduce((a, r) => a + r.bcdrCost, 0)

  // ── CSS ──
  const css = `
    @page { size: A4; margin: 18mm 16mm 22mm 16mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 10.5pt; color: #1a202c; line-height: 1.5; }
    .cover { page-break-after: always; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 88vh; text-align: center; }
    .cover-bar { width: 100%; height: 6px; background: linear-gradient(90deg, #667eea, #764ba2); margin-bottom: 60px; }
    .cover h1 { font-size: 26pt; font-weight: 700; color: #667eea; margin-bottom: 6px; }
    .cover h2 { font-size: 14pt; font-weight: 400; color: #718096; margin-bottom: 36px; }
    .cover-org { font-size: 13pt; font-weight: 600; color: #1a202c; }
    .cover-date { font-size: 10pt; color: #718096; margin-top: 4px; }
    .cover-std { margin-top: 40px; font-size: 9pt; color: #a0aec0; border: 1px solid #e2e8f0; padding: 6px 20px; border-radius: 4px; }
    .toc { page-break-after: always; }
    .toc h1 { border-bottom: none; margin-bottom: 16px; }
    .toc-item { padding: 3px 0; border-bottom: 1px dotted #e2e8f0; font-size: 10pt; }
    .toc-s { font-weight: 600; }
    h1 { font-size: 16pt; font-weight: 700; color: #667eea; margin: 28px 0 10px; border-bottom: 2px solid #667eea; padding-bottom: 4px; page-break-after: avoid; }
    h2 { font-size: 13pt; font-weight: 600; color: #1a202c; margin: 16px 0 6px; page-break-after: avoid; }
    h3 { font-size: 11pt; font-weight: 600; color: #764ba2; margin: 12px 0 4px; }
    p, li { margin-bottom: 4px; }
    ul, ol { margin-left: 18px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0 14px; font-size: 9pt; page-break-inside: auto; }
    th { background: #f1f5f9; font-weight: 600; text-align: left; padding: 6px 8px; border-bottom: 2px solid #e2e8f0; }
    td { padding: 5px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    tr { page-break-inside: avoid; }
    th.c, td.c { text-align: center; }
    .badge { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 8pt; font-weight: 600; }
    .info { background: #f1f5f9; border-left: 3px solid #667eea; padding: 8px 12px; margin: 8px 0; border-radius: 0 4px 4px 0; font-size: 9.5pt; }
    .metric-row { display: flex; gap: 10px; flex-wrap: wrap; margin: 8px 0; }
    .metric-box { flex: 1; min-width: 100px; background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px 10px; text-align: center; }
    .metric-val { font-size: 14pt; font-weight: 700; color: #667eea; }
    .metric-lbl { font-size: 8pt; color: #718096; }
    .scope-row { padding: 8px 12px; margin-bottom: 3px; border-radius: 4px; color: #fff; font-size: 9pt; }
    .step { padding: 4px 8px; background: #f8f9fa; border-radius: 3px; margin-bottom: 3px; font-size: 9.5pt; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `

  const scopeColors = ['#1a237e','#283593','#303f9f','#3949ab','#3f51b5','#5c6bc0']

  // ── Build sections ──
  const sections: string[] = []

  // Cover
  sections.push(`<div class="cover"><div class="cover-bar"></div><h1>Business Continuity Plan</h1><h2>Business Continuity &amp; Disaster Recovery</h2><div class="cover-org">${e(org)}</div><div class="cover-date">Date: ${date}</div><div class="cover-std">ISO 22301:2019 &mdash; Business Continuity Management Systems</div></div>`)

  // TOC
  const tocItems = [
    '1. Document Control',
    '2. Context of the Organization (ISO 22301 \u00A74)',
    '3. Leadership &amp; Roles (ISO 22301 \u00A75)',
    '4. Planning &mdash; Risk &amp; Requirements (ISO 22301 \u00A76)',
    '5. Support &mdash; Resources &amp; Competence (ISO 22301 \u00A77)',
    '6. Operations &mdash; BIA, Strategies &amp; Plans (ISO 22301 \u00A78)',
    '7. Architecture &amp; Gap Assessment',
    '8. BCDR Implementation Design',
    '9. Cost Analysis',
    '10. Response Plan by Scope',
    '11. Contingency Plan',
    '12. Performance Evaluation &mdash; Testing (ISO 22301 \u00A79)',
    '13. Improvement &mdash; Maintenance (ISO 22301 \u00A710)',
    'Appendix A: Criticality Model',
    'Appendix B: RACI Matrix',
    'Appendix C: Fault Model',
  ]
  sections.push(`<div class="toc"><h1>Table of Contents</h1>${tocItems.map(t => `<div class="toc-item"><span class="toc-s">${t}</span></div>`).join('')}</div>`)

  // 1. Document Control
  sections.push(`<h1>1. Document Control</h1>`)
  sections.push(tbl(['Field', 'Value'], [
    ['Organization', e(org)], ['Document Title', 'Business Continuity Plan (BCP)'],
    ['Standard', 'ISO 22301:2019'], ['Primary Contact', e(s.primaryContact || 'TBD')],
    ['Contact Email', e(s.primaryContactEmail || 'TBD')], ['Date Created', date],
    ['Classification', 'Confidential'], ['Review Frequency', 'Annually or upon significant change'],
    ['Currency', s.currency],
  ]))

  // 2. Context (ISO \u00A74)
  sections.push(`<h1>2. Context of the Organization</h1>`)
  sections.push(`<p>This BCP establishes the framework for ${e(org)} to maintain essential functions during and after a disruption, aligned with ISO 22301:2019.</p>`)
  sections.push(`<h2>2.1 Scope</h2><p>All business-critical applications and infrastructure as defined in the criticality model.</p>`)
  sections.push(`<h2>2.2 Interested Parties</h2><ul><li>Executive leadership</li><li>Application owners and business stakeholders</li><li>IT operations, engineering, and security teams</li><li>Customers, partners, and regulatory bodies</li><li>Service providers and vendors</li></ul>`)
  if (s.notes) sections.push(`<div class="info"><strong>Notes:</strong> ${e(s.notes)}</div>`)

  // 3. Leadership (ISO \u00A75)
  sections.push(`<h1>3. Leadership &amp; Roles</h1>`)
  sections.push(`<h2>3.1 BC Policy</h2><p>${e(org)} is committed to protecting employees, customers, and stakeholders through continuity of critical business operations, regular testing, and continuous improvement.</p>`)
  sections.push(`<h2>3.2 Role Assignment</h2>`)
  if (roles.length > 0) {
    sections.push(tbl(['Role', 'Assigned To', 'Team', 'Responsibility', 'Escalation'],
      roles.map(r => [e(r.role), e(r.name || 'TBD'), e(r.team), e(r.responsibility), e(r.escalation)])))
  } else { sections.push(`<p><em>Complete Role Assignment in Phase 2 Implement.</em></p>`) }

  // 4. Planning (ISO \u00A76)
  sections.push(`<h1>4. Planning &mdash; Risk &amp; Requirements</h1>`)
  sections.push(`<h2>4.1 BCDR Requirements</h2>`)
  if (requirements.length > 0) {
    sections.push(tbl(['Category', 'Requirement', 'Status', 'Architecture Decision'],
      requirements.map(r => [e(r.category), e(r.requirement), r.status === 'required' ? badge('Required', '#28a745') : r.status === 'not-required' ? badge('Not Required', '#dc3545') : badge('N/A', '#6c757d'), e(r.adr)]), { centerCols: [2] }))
  }
  if (appReqs.length > 0) {
    sections.push(`<h2>4.2 Application Requirements (Phase 1)</h2>`)
    sections.push(tbl(['Category', 'Requirement', 'Priority', 'Status'],
      appReqs.map(r => [e(r.category), e(r.requirement), e(r.priority), e(r.status)]), { centerCols: [2, 3] }))
  }

  // 5. Support (ISO \u00A77)
  sections.push(`<h1>5. Support &mdash; Resources &amp; Competence</h1>`)
  sections.push(`<h2>5.1 Training</h2><ul><li>Annual BCDR training for all role holders</li><li>Semi-annual tabletop exercises</li><li>Quarterly failover drills</li><li>New team members complete BCDR onboarding within 30 days</li></ul>`)
  sections.push(`<h2>5.2 Dependencies</h2>`)
  if (biaDeps.length > 0) {
    biaDeps.forEach(dep => {
      sections.push(`<h3>${e(dep.direction)} Dependencies</h3><ul>${dep.items.filter(Boolean).map(i => `<li>${e(i)}</li>`).join('')}</ul>`)
    })
  }

  // 6. Operations (ISO \u00A78)
  sections.push(`<h1>6. Operations &mdash; BIA, Strategies &amp; Plans</h1>`)
  sections.push(`<h2>6.1 Business Impact Analysis</h2>`)
  if (biaMetrics.length > 0) {
    sections.push(tbl(['Metric', 'Value', 'Notes'],
      biaMetrics.map(m => [`<strong>${e(m.metric)}</strong>`, e(m.value), e(m.notes)]), { centerCols: [1] }))
  } else { sections.push(`<p><em>Complete BIA in Phase 2 Assess.</em></p>`) }
  sections.push(`<h2>6.2 BC Strategies</h2><ul><li>Active-passive multi-region deployment for mission-critical services</li><li>Zone-redundant architecture within primary region</li><li>Geo-redundant data replication for persistent stores</li><li>Automated failover with health probing</li><li>Infrastructure as Code for rapid redeployment</li><li>Contingency procedures for manual operation</li></ul>`)

  // 7. Gap Assessment
  sections.push(`<h1>7. Architecture &amp; Gap Assessment</h1>`)
  if (gapData.length > 0) {
    sections.push(tbl(['Component', 'Category', 'SLA', 'HA Config', 'DR Config', 'Status'],
      gapData.map(r => [e(r.component), e(r.category), r.sla, e(r.ha), e(r.dr),
        r.gap === 'met' ? badge('Met', '#28a745') : r.gap === 'partial' ? badge('Partial', '#ffc107', '#1a1a1a') : badge('Gap', '#dc3545')]),
      { centerCols: [2, 5] }))
  } else { sections.push(`<p><em>Complete Gap Assessment in Phase 2 Assess.</em></p>`) }

  // 8. BCDR Design
  sections.push(`<h1>8. BCDR Implementation Design</h1>`)
  if (design.length > 0) {
    sections.push(tbl(['Component', 'Category', 'SLA', 'HA Config', 'DR Config', 'Remediation', 'Status'],
      design.map(r => [e(r.component), e(r.category), r.sla, e(r.ha), e(r.dr), e(r.remediation),
        r.status === 'met' ? badge('Met', '#28a745') : badge('NEW', '#0078d4')]),
      { centerCols: [2, 6] }))
    // Metric comparison
    if (metricComp.length > 0) {
      sections.push(`<h2>8.1 Metric Comparison (+BCDR)</h2>`)
      sections.push(tbl(['Component', 'Before Avail', 'After Avail', 'Before Rel', 'After Rel', 'Before Sec', 'After Sec'],
        metricComp.map(r => [e(r.component), r.beforeAvail, `<strong style="color:#28a745">${r.afterAvail}</strong>`, r.beforeRel, `<strong style="color:#28a745">${r.afterRel}</strong>`, r.beforeSec, `<strong style="color:#28a745">${r.afterSec}</strong>`]),
        { centerCols: [1, 2, 3, 4, 5, 6] }))
    }
  } else { sections.push(`<p><em>Complete Architecture Design in Phase 2 Implement.</em></p>`) }

  // 9. Cost
  sections.push(`<h1>9. Cost Analysis</h1>`)
  if (cost.length > 0) {
    sections.push(`<div class="metric-row"><div class="metric-box"><div class="metric-val">$${totB.toLocaleString()}</div><div class="metric-lbl">Current Monthly</div></div><div class="metric-box"><div class="metric-val">$${totA.toLocaleString()}</div><div class="metric-lbl">+BCDR Monthly</div></div><div class="metric-box"><div class="metric-val" style="color:#dc3545">+$${(totA - totB).toLocaleString()}</div><div class="metric-lbl">Investment</div></div><div class="metric-box"><div class="metric-val">+${totB > 0 ? Math.round((totA - totB) / totB * 100) : 0}%</div><div class="metric-lbl">Increase</div></div></div>`)
    sections.push(tbl(['Component', 'Current ($)', '+BCDR ($)', 'Diff ($)'],
      [...cost.map(r => [e(r.component), r.currentCost.toLocaleString(), r.bcdrCost.toLocaleString(), `<span style="color:${r.bcdrCost > r.currentCost ? '#dc3545' : '#28a745'}">${r.bcdrCost > r.currentCost ? '+' : ''}${(r.bcdrCost - r.currentCost).toLocaleString()}</span>`]),
       [`<strong>TOTAL</strong>`, `<strong>$${totB.toLocaleString()}</strong>`, `<strong>$${totA.toLocaleString()}</strong>`, `<strong style="color:#dc3545">+$${(totA - totB).toLocaleString()}</strong>`]],
      { centerCols: [1, 2, 3] }))
  }

  // 10. Response Plan
  sections.push(`<h1>10. Response Plan by Scope</h1>`)
  if (responsePlan.length > 0) {
    responsePlan.forEach((r, i) => {
      sections.push(`<div class="scope-row" style="background:${scopeColors[i % scopeColors.length]}"><strong>${e(r.scope)}</strong></div>`)
      sections.push(`<table><tr><td><strong>Availability:</strong> ${e(r.availability)}</td><td><strong>Recoverability:</strong> ${e(r.recoverability)}</td></tr><tr><td><strong>Resources:</strong> ${e(r.resources)}</td><td><strong>Continuity:</strong> ${e(r.continuity)}</td></tr><tr><td colspan="2"><strong>Preparation:</strong> ${e(r.preparation)}</td></tr></table>`)
    })
  }

  // 11. Contingency
  sections.push(`<h1>11. Contingency Plan</h1>`)
  sections.push(`<p>Procedures when the system cannot be restored within MTD:</p>`)
  if (contingency.length > 0) {
    sections.push(`<ol>${contingency.filter(Boolean).map(s => `<li class="step">${e(s)}</li>`).join('')}</ol>`)
  }

  // 12. Testing (ISO \u00A79)
  sections.push(`<h1>12. Performance Evaluation &mdash; Testing</h1>`)
  sections.push(`<h2>12.1 Test Summary</h2>`)
  if (tests.length > 0) {
    sections.push(tbl(['Test Type', 'Frequency', 'Last Test', 'Next Test', 'Status', 'Owner'],
      tests.map(t => [e(t.type), e(t.frequency), e(t.lastTest), e(t.nextTest),
        t.status === 'Passed' ? badge('Passed', '#28a745') : t.status === 'Degraded' ? badge('Degraded', '#ffc107', '#1a1a1a') : badge('Failed', '#dc3545'),
        e(t.owner)]), { centerCols: [1, 2, 3, 4] }))
  }
  if (uat.length > 0) {
    sections.push(`<h2>12.2 UAT Test Plan</h2>`)
    sections.push(tbl(['Business Function', 'Test Steps', 'Expected Result', 'Priority'],
      uat.map(u => [e(u.function_name), e(u.testSteps), e(u.expectedResult),
        u.priority === 'High' ? badge('High', '#dc3545') : u.priority === 'Medium' ? badge('Medium', '#ffc107', '#1a1a1a') : badge('Low', '#28a745')]),
      { centerCols: [3] }))
  }
  sections.push(`<h2>12.3 Management Review</h2><p>Management reviews of the BCMS are conducted at planned intervals per ISO 22301 \u00A79.3.</p>`)

  // 13. Improvement (ISO \u00A710)
  sections.push(`<h1>13. Improvement &mdash; Maintenance</h1>`)
  if (maintenance.length > 0) {
    sections.push(tbl(['Document', 'Frequency', 'Next Review', 'Owner', 'Approver'],
      maintenance.map(m => [e(m.document), e(m.frequency), e(m.nextReview), e(m.owner), e(m.approver)]),
      { centerCols: [1, 2] }))
  }
  sections.push(`<h2>13.1 Corrective Actions</h2><p>Non-conformities from testing, incidents, or audits are documented, tracked, and resolved. Root cause analysis is performed for all significant incidents.</p>`)

  // Appendix A: Criticality
  sections.push(`<h1>Appendix A: Criticality Model</h1>`)
  if (criticality.length > 0) {
    sections.push(tbl(['Tier', 'Criticality', 'Business View', 'Financial'],
      criticality.map(r => [e(r.tier), `${badge(e(r.criticality), r.color)}`, e(r.businessView), e(r.financial)]),
      { centerCols: [0] }))
  } else { sections.push(`<p><em>Complete Criticality Model in Phase 1.</em></p>`) }

  // Appendix B: RACI
  if (raci.length > 0) {
    sections.push(`<h1>Appendix B: RACI Matrix</h1>`)
    const raciRoles = Object.keys(raci[0]?.values ?? {})
    sections.push(tbl(['Task', ...raciRoles],
      raci.map(r => [e(r.task), ...raciRoles.map(role => {
        const v = r.values[role] ?? ''
        const colors: Record<string, string> = { R: '#003366', A: '#336699', C: '#6699CC', I: '#99CCFF' }
        return v ? `<span class="badge" style="background:${colors[v] ?? '#e2e8f0'};color:${v === 'I' ? '#1a202c' : '#fff'}">${v}</span>` : ''
      })]),
      { centerCols: raciRoles.map((_, i) => i + 1) }))
  }

  // Appendix C: Fault Model
  if (faultModel.length > 0) {
    sections.push(`<h1>Appendix C: Fault Model &amp; Resilience Strategies</h1>`)
    sections.push(tbl(['Failure Type', 'Description', 'Tier 1 Strategy', 'Tier 2 Strategy', 'Tier 3 Strategy'],
      faultModel.map(r => [e(r.failureType), e(r.description), e(r.tier1), e(r.tier2), e(r.tier3)])))
  }

  // End
  sections.push(`<div class="info"><strong>End of Document.</strong> This BCP is a living document. Review and update per the maintenance schedule above. All changes require approval from designated approvers.</div>`)

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>BCP - ${e(org)}</title><style>${css}</style></head><body>${sections.join('\n')}</body></html>`

  const w = window.open('', '_blank')
  if (!w) { alert('Allow popups to generate the PDF.'); return }
  w.document.write(html)
  w.document.close()
  setTimeout(() => w.print(), 500)
}
