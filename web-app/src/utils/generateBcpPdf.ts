/**
 * ISO 22301-aligned Business Continuity Plan PDF Generator.
 *
 * Generates a comprehensive BCDR document using the browser's print functionality
 * with a dedicated print-optimised HTML layout. The document follows ISO 22301:2019
 * structure for Business Continuity Management Systems.
 *
 * ISO 22301 required sections covered:
 *  4. Context of the organization
 *  5. Leadership
 *  6. Planning
 *  7. Support
 *  8. Operation (BIA, risk assessment, BC strategies, BC plans)
 *  9. Performance evaluation
 * 10. Improvement
 */

import type { AppSettings } from '../components/Settings'

const STORAGE_PREFIX = 'abcg_'

function load<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
  if (!raw) return fallback
  try { return JSON.parse(raw) as T } catch { return fallback }
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/* ═══════════════════════════════════════════════════════
   Build the full HTML document
   ═══════════════════════════════════════════════════════ */

export function generateBcpPdf(): void {
  const settings = load<AppSettings>('settings', {
    organizationName: 'Organization',
    guideName: 'Azure Business Continuity Guide',
    primaryContact: '',
    primaryContactEmail: '',
    dateFormat: 'YYYY-MM-DD',
    currency: 'USD',
    notes: '',
  })

  const org = settings.organizationName || 'Organization'
  const dateStr = today()

  // Load workbench data
  const criticalityRows = load<{ tier: string; criticality: string; businessView: string }[]>('phase1-criticality', [])
  const biaMetrics = load<{ metric: string; value: string; notes: string }[]>('phase2-bia-metrics', [])
  const gapData = load<{ component: string; category: string; sla: string; ha: string; dr: string; gap: string }[]>('phase2-gap-assessment', [])
  const costData = load<{ component: string; currentCost: number; bcdrCost: number }[]>('phase2-cost-comparison', [])
  const roleData = load<{ role: string; name: string; team: string; responsibility: string; escalation: string }[]>('phase2-role-assignment', [])
  const testSummary = load<{ type: string; frequency: string; lastTest: string; nextTest: string; status: string; owner: string }[]>('phase2-test-summary', [])
  const maintenance = load<{ document: string; frequency: string; nextReview: string; owner: string; approver: string }[]>('phase2-maintenance', [])

  const totalBefore = costData.reduce((s, r) => s + r.currentCost, 0)
  const totalAfter = costData.reduce((s, r) => s + r.bcdrCost, 0)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Business Continuity Plan - ${esc(org)}</title>
<style>
  @page { size: A4; margin: 20mm 18mm 25mm 18mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; font-size: 11pt; color: #1a202c; line-height: 1.55; }
  
  .cover { page-break-after: always; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 90vh; text-align: center; }
  .cover-bar { width: 100%; height: 8px; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); margin-bottom: 80px; }
  .cover h1 { font-size: 28pt; font-weight: 700; color: #667eea; margin-bottom: 8px; }
  .cover h2 { font-size: 16pt; font-weight: 400; color: #718096; margin-bottom: 40px; }
  .cover-org { font-size: 14pt; font-weight: 600; color: #1a202c; margin-bottom: 4px; }
  .cover-date { font-size: 11pt; color: #718096; }
  .cover-standard { margin-top: 48px; font-size: 10pt; color: #a0aec0; border: 1px solid #e2e8f0; padding: 8px 24px; border-radius: 6px; }
  
  h1 { font-size: 18pt; font-weight: 700; color: #667eea; margin: 32px 0 12px; border-bottom: 2px solid #667eea; padding-bottom: 6px; page-break-after: avoid; }
  h2 { font-size: 14pt; font-weight: 600; color: #1a202c; margin: 20px 0 8px; page-break-after: avoid; }
  h3 { font-size: 12pt; font-weight: 600; color: #764ba2; margin: 14px 0 6px; }
  p, li { margin-bottom: 6px; }
  ul, ol { margin-left: 20px; margin-bottom: 10px; }
  
  table { width: 100%; border-collapse: collapse; margin: 10px 0 16px; font-size: 9.5pt; page-break-inside: auto; }
  th { background: #f1f5f9; font-weight: 600; text-align: left; padding: 8px 10px; border-bottom: 2px solid #e2e8f0; }
  td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  tr { page-break-inside: avoid; }
  th.center, td.center { text-align: center; }
  
  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 9pt; font-weight: 600; }
  .badge-red { background: #dc3545; color: #fff; }
  .badge-orange { background: #fd7e14; color: #fff; }
  .badge-yellow { background: #ffc107; color: #1a1a1a; }
  .badge-green { background: #28a745; color: #fff; }
  .badge-blue { background: #667eea; color: #fff; }
  .badge-gray { background: #6c757d; color: #fff; }
  
  .info-box { background: #f1f5f9; border-left: 4px solid #667eea; padding: 12px 16px; margin: 12px 0; border-radius: 0 6px 6px 0; font-size: 10pt; }
  .metric-row { display: flex; gap: 12px; flex-wrap: wrap; margin: 12px 0; }
  .metric-item { flex: 1; min-width: 120px; background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; text-align: center; }
  .metric-value { font-size: 16pt; font-weight: 700; color: #667eea; }
  .metric-label { font-size: 8pt; color: #718096; margin-top: 2px; }
  
  .toc { page-break-after: always; }
  .toc h1 { border-bottom: none; }
  .toc-item { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dotted #e2e8f0; }
  .toc-section { font-weight: 600; }
  
  .footer { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; font-size: 8pt; color: #a0aec0; padding: 8px; border-top: 1px solid #e2e8f0; }
  
  @media print {
    .no-print { display: none !important; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<!-- ══════════ COVER PAGE ══════════ -->
<div class="cover">
  <div class="cover-bar"></div>
  <h1>Business Continuity Plan</h1>
  <h2>Business Continuity &amp; Disaster Recovery</h2>
  <div class="cover-org">${esc(org)}</div>
  <div class="cover-date">Document Date: ${dateStr}</div>
  <div class="cover-standard">Aligned with ISO 22301:2019 — Business Continuity Management Systems</div>
</div>

<!-- ══════════ TABLE OF CONTENTS ══════════ -->
<div class="toc">
  <h1>Table of Contents</h1>
  <div class="toc-item"><span class="toc-section">1. Document Control</span></div>
  <div class="toc-item"><span class="toc-section">2. Context of the Organization (ISO 22301 §4)</span></div>
  <div class="toc-item"><span class="toc-section">3. Leadership &amp; Commitment (ISO 22301 §5)</span></div>
  <div class="toc-item"><span class="toc-section">4. Planning — Risk Assessment (ISO 22301 §6)</span></div>
  <div class="toc-item"><span class="toc-section">5. Support — Resources &amp; Roles (ISO 22301 §7)</span></div>
  <div class="toc-item"><span class="toc-section">6. Operations — BIA &amp; BC Strategies (ISO 22301 §8)</span></div>
  <div class="toc-item"><span class="toc-section">7. Architecture &amp; Gap Assessment</span></div>
  <div class="toc-item"><span class="toc-section">8. Cost Analysis</span></div>
  <div class="toc-item"><span class="toc-section">9. Performance Evaluation — Testing (ISO 22301 §9)</span></div>
  <div class="toc-item"><span class="toc-section">10. Improvement — Maintenance Plan (ISO 22301 §10)</span></div>
  <div class="toc-item"><span class="toc-section">Appendix A: Criticality Model</span></div>
</div>

<!-- ══════════ 1. DOCUMENT CONTROL ══════════ -->
<h1>1. Document Control</h1>
<table>
  <tr><th style="width:180px">Field</th><th>Value</th></tr>
  <tr><td><strong>Organization</strong></td><td>${esc(org)}</td></tr>
  <tr><td><strong>Document Title</strong></td><td>Business Continuity Plan (BCP)</td></tr>
  <tr><td><strong>Standard</strong></td><td>ISO 22301:2019</td></tr>
  <tr><td><strong>Primary Contact</strong></td><td>${esc(settings.primaryContact || 'TBD')}</td></tr>
  <tr><td><strong>Contact Email</strong></td><td>${esc(settings.primaryContactEmail || 'TBD')}</td></tr>
  <tr><td><strong>Date Created</strong></td><td>${dateStr}</td></tr>
  <tr><td><strong>Classification</strong></td><td>Confidential</td></tr>
  <tr><td><strong>Review Frequency</strong></td><td>Annually or upon significant change</td></tr>
</table>

<!-- ══════════ 2. CONTEXT (§4) ══════════ -->
<h1>2. Context of the Organization</h1>
<p>This Business Continuity Plan (BCP) establishes the framework for ${esc(org)} to maintain essential functions during and after a disruption. It defines recovery strategies, roles, and procedures aligned with ISO 22301:2019 requirements.</p>

<h2>2.1 Scope</h2>
<p>This plan covers all business-critical applications and infrastructure hosted on Microsoft Azure and on-premises environments as defined in the criticality model and service architecture documentation.</p>

<h2>2.2 Interested Parties</h2>
<ul>
  <li>Executive leadership and board of directors</li>
  <li>Application owners and business stakeholders</li>
  <li>IT operations, engineering, and security teams</li>
  <li>Customers, partners, and regulatory bodies</li>
  <li>Service providers and vendors</li>
</ul>

${settings.notes ? `<div class="info-box"><strong>Additional Context:</strong> ${esc(settings.notes)}</div>` : ''}

<!-- ══════════ 3. LEADERSHIP (§5) ══════════ -->
<h1>3. Leadership &amp; Commitment</h1>
<p>Senior management demonstrates commitment to business continuity by establishing this policy, defining roles, and ensuring adequate resources for BCDR activities.</p>

<h2>3.1 BC Policy Statement</h2>
<p>${esc(org)} is committed to protecting its employees, customers, and stakeholders by maintaining the continuity of critical business operations. This commitment extends to regular testing, continuous improvement, and compliance with ISO 22301:2019.</p>

<h2>3.2 Roles &amp; Responsibilities</h2>
${roleData.length > 0 ? `
<table>
  <tr><th>Role</th><th>Assigned To</th><th>Team</th><th>Responsibility</th><th>Escalation</th></tr>
  ${roleData.map(r => `<tr><td><strong>${esc(r.role)}</strong></td><td>${esc(r.name || 'TBD')}</td><td>${esc(r.team)}</td><td>${esc(r.responsibility)}</td><td>${esc(r.escalation)}</td></tr>`).join('\n  ')}
</table>` : '<p><em>No roles have been assigned yet. Complete the Role Assignment section in Phase 2.</em></p>'}

<!-- ══════════ 4. PLANNING / RISK (§6) ══════════ -->
<h1>4. Planning — Risk Assessment</h1>
<p>Risk assessment identifies threats that could disrupt business operations and evaluates their likelihood and impact. Risk = Impact × Probability (each scored 1-5).</p>

<h2>4.1 Risk Categories</h2>
<ul>
  <li><strong>Cyber Threats:</strong> DDoS, ransomware, data breaches, supply chain attacks</li>
  <li><strong>Infrastructure:</strong> Region outages, zone failures, network partitions, power grid failures</li>
  <li><strong>Human Factors:</strong> Configuration errors, accidental deletions</li>
  <li><strong>Natural Disasters:</strong> Earthquakes, floods affecting data center locations</li>
  <li><strong>Service Degradation:</strong> Azure service performance issues</li>
</ul>

<h2>4.2 Risk Treatment</h2>
<p>Risks are treated through a combination of avoidance, mitigation, transfer (insurance), and acceptance based on the risk appetite defined by the leadership team.</p>

<!-- ══════════ 5. SUPPORT (§7) ══════════ -->
<h1>5. Support — Resources &amp; Competence</h1>
<h2>5.1 Resources</h2>
<p>Adequate resources are allocated for BCDR activities including personnel, technology, training, and testing budgets as defined in the cost analysis section.</p>

<h2>5.2 Competence &amp; Training</h2>
<ul>
  <li>All BCDR role holders receive annual training on their responsibilities</li>
  <li>Tabletop exercises conducted semi-annually</li>
  <li>Full failover drills conducted at least quarterly</li>
  <li>New team members complete BCDR onboarding within 30 days</li>
</ul>

<h2>5.3 Communication</h2>
<p>Communication procedures are defined for each event scope (Global, Region, Zone, Data Integrity) in the Outage Communication Plan, covering pre-outage, during-outage, and post-outage notifications.</p>

<!-- ══════════ 6. OPERATIONS / BIA (§8) ══════════ -->
<h1>6. Operations — Business Impact Analysis</h1>
<p>The Business Impact Analysis quantifies the effect of disruptions on critical business functions and establishes recovery priorities.</p>

${biaMetrics.length > 0 ? `
<h2>6.1 Key Recovery Metrics</h2>
<table>
  <tr><th>Metric</th><th class="center">Value</th><th>Notes</th></tr>
  ${biaMetrics.map(m => `<tr><td><strong>${esc(m.metric)}</strong></td><td class="center">${esc(m.value)}</td><td>${esc(m.notes)}</td></tr>`).join('\n  ')}
</table>` : ''}

<h2>6.2 BC Strategies</h2>
<p>Based on the BIA results, the following strategies are implemented:</p>
<ul>
  <li><strong>Active-passive multi-region deployment</strong> for mission-critical services</li>
  <li><strong>Zone-redundant architecture</strong> within primary region</li>
  <li><strong>Geo-redundant data replication</strong> for all persistent data stores</li>
  <li><strong>Automated failover</strong> with health probing via Azure Traffic Manager / Front Door</li>
  <li><strong>Infrastructure as Code</strong> for rapid redeployment capability</li>
  <li><strong>Contingency procedures</strong> for manual operation when systems unavailable</li>
</ul>

<!-- ══════════ 7. ARCHITECTURE ══════════ -->
<h1>7. Architecture &amp; Gap Assessment</h1>

${gapData.length > 0 ? `
<h2>7.1 Component Assessment</h2>
<table>
  <tr><th>Component</th><th>Category</th><th class="center">SLA</th><th>HA Configuration</th><th>DR Configuration</th><th class="center">Status</th></tr>
  ${gapData.map(r => {
    const badgeClass = r.gap === 'met' ? 'badge-green' : r.gap === 'partial' ? 'badge-yellow' : 'badge-red'
    const label = r.gap === 'met' ? 'Met' : r.gap === 'partial' ? 'Partial' : 'Gap'
    return `<tr><td><strong>${esc(r.component)}</strong></td><td>${esc(r.category)}</td><td class="center">${esc(r.sla)}</td><td>${esc(r.ha)}</td><td>${esc(r.dr)}</td><td class="center"><span class="badge ${badgeClass}">${label}</span></td></tr>`
  }).join('\n  ')}
</table>` : '<p><em>Complete the Gap Assessment in Phase 2 to populate this section.</em></p>'}

<!-- ══════════ 8. COST ANALYSIS ══════════ -->
<h1>8. Cost Analysis</h1>

${costData.length > 0 ? `
<div class="metric-row">
  <div class="metric-item"><div class="metric-value">$${totalBefore.toLocaleString()}</div><div class="metric-label">Current Monthly</div></div>
  <div class="metric-item"><div class="metric-value">$${totalAfter.toLocaleString()}</div><div class="metric-label">+BCDR Monthly</div></div>
  <div class="metric-item"><div class="metric-value">+$${(totalAfter - totalBefore).toLocaleString()}</div><div class="metric-label">BCDR Investment</div></div>
  <div class="metric-item"><div class="metric-value">+${totalBefore > 0 ? Math.round((totalAfter - totalBefore) / totalBefore * 100) : 0}%</div><div class="metric-label">Cost Increase</div></div>
</div>
<table>
  <tr><th>Component</th><th class="center">Current ($)</th><th class="center">+BCDR ($)</th><th class="center">Difference ($)</th></tr>
  ${costData.map(r => `<tr><td>${esc(r.component)}</td><td class="center">${r.currentCost.toLocaleString()}</td><td class="center">${r.bcdrCost.toLocaleString()}</td><td class="center" style="color:${r.bcdrCost > r.currentCost ? '#dc3545' : '#28a745'}">${r.bcdrCost > r.currentCost ? '+' : ''}${(r.bcdrCost - r.currentCost).toLocaleString()}</td></tr>`).join('\n  ')}
  <tr style="font-weight:700;background:#f1f5f9"><td>TOTAL</td><td class="center">$${totalBefore.toLocaleString()}</td><td class="center">$${totalAfter.toLocaleString()}</td><td class="center" style="color:#dc3545">+$${(totalAfter - totalBefore).toLocaleString()}</td></tr>
</table>` : '<p><em>Complete the Cost Comparison in Phase 2 to populate this section.</em></p>'}

<!-- ══════════ 9. PERFORMANCE EVAL / TEST (§9) ══════════ -->
<h1>9. Performance Evaluation — Testing</h1>
<p>Regular testing validates that recovery procedures achieve defined objectives. All tests are tracked and results inform continuous improvement.</p>

${testSummary.length > 0 ? `
<h2>9.1 Test Summary</h2>
<table>
  <tr><th>Test Type</th><th class="center">Frequency</th><th class="center">Last Test</th><th class="center">Next Test</th><th class="center">Status</th><th>Owner</th></tr>
  ${testSummary.map(t => {
    const badge = t.status === 'Passed' ? 'badge-green' : t.status === 'Degraded' ? 'badge-yellow' : 'badge-red'
    return `<tr><td><strong>${esc(t.type)}</strong></td><td class="center">${esc(t.frequency)}</td><td class="center">${esc(t.lastTest)}</td><td class="center">${esc(t.nextTest)}</td><td class="center"><span class="badge ${badge}">${esc(t.status)}</span></td><td>${esc(t.owner)}</td></tr>`
  }).join('\n  ')}
</table>` : ''}

<h2>9.2 Management Review</h2>
<p>Management reviews of the BCMS are conducted at planned intervals to ensure continuing suitability, adequacy, and effectiveness per ISO 22301 §9.3.</p>

<!-- ══════════ 10. IMPROVEMENT (§10) ══════════ -->
<h1>10. Improvement — Maintenance Plan</h1>
<p>Continual improvement is achieved through regular reviews, incident learnings, and proactive updates to all BCDR documentation.</p>

${maintenance.length > 0 ? `
<table>
  <tr><th>Document / Artifact</th><th class="center">Review Frequency</th><th class="center">Next Review</th><th>Owner</th><th>Approver</th></tr>
  ${maintenance.map(m => `<tr><td><strong>${esc(m.document)}</strong></td><td class="center">${esc(m.frequency)}</td><td class="center">${esc(m.nextReview)}</td><td>${esc(m.owner)}</td><td>${esc(m.approver)}</td></tr>`).join('\n  ')}
</table>` : '<p><em>Complete the Maintenance Plan in Phase 2 to populate this section.</em></p>'}

<h2>10.1 Corrective Actions</h2>
<p>Non-conformities identified during testing, incidents, or audits are documented and tracked until resolution. Root cause analysis is performed for all significant incidents.</p>

<!-- ══════════ APPENDIX A ══════════ -->
<h1>Appendix A: Criticality Model</h1>

${criticalityRows.length > 0 ? `
<table>
  <tr><th>Tier</th><th>Criticality Level</th><th>Business View</th></tr>
  ${criticalityRows.map(r => `<tr><td>${esc(r.tier)}</td><td><strong>${esc(r.criticality)}</strong></td><td>${esc(r.businessView)}</td></tr>`).join('\n  ')}
</table>` : '<p><em>Complete the Criticality Model in Phase 1 to populate this appendix.</em></p>'}

<div class="info-box">
  <strong>Document End.</strong> This Business Continuity Plan is a living document and should be reviewed and updated according to the maintenance schedule above. All changes require approval from designated approvers.
</div>

</body>
</html>`

  // Open in new window for printing
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to generate the PDF.')
    return
  }
  printWindow.document.write(html)
  printWindow.document.close()
  // Delay print to let styles load
  setTimeout(() => {
    printWindow.print()
  }, 500)
}
