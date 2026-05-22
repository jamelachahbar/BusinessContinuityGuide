/**
 * Export all phase data to CSV files — one file per section.
 * Reads actual user data from the active solution's localStorage.
 * Mandatory ISO 22301 sections are always included; optional sections per BcpExportOptions.
 */

import { downloadMultipleCsvSheets, objectsToCsvSheet, type CsvSheet } from './csvExport'
import { loadFromStorage as ld, type BcpExportOptions, defaultExportOptions } from './exportOptions'

interface AnyRow { [k: string]: unknown }

function sheetIfData(name: string, data: AnyRow[]): CsvSheet | null {
  if (!data || data.length === 0) return null
  return objectsToCsvSheet(name, data as Record<string, unknown>[])
}

/* ── Phase 1 ── */

function buildPhase1Sheets(opts: BcpExportOptions): CsvSheet[] {
  const sheets: CsvSheet[] = []

  const criticality = ld<AnyRow[]>('phase1_criticalityModel', [])
  const impactCols = ld<string[]>('phase1_impactColumns', [])
  if (criticality.length > 0) {
    const flat = criticality.map(r => {
      const out: Record<string, unknown> = {
        Tier: r.tier ?? '',
        Criticality: r.criticality ?? '',
        'Business View': r.businessView ?? '',
        Financial: r.financial ?? '',
      }
      const impacts = (r.impacts as string[] | undefined) ?? []
      impactCols.forEach((col, i) => { out[col] = impacts[i] ?? '' })
      return out
    })
    sheets.push(objectsToCsvSheet('Phase1_Criticality_Model', flat))
  }

  if (opts.raci) {
    const raci = ld<{ roles: string[]; tasks: { task: string; raci: string[] }[] }>('phase1_raci', { roles: [], tasks: [] })
    if (raci.tasks.length > 0) {
      const flat = raci.tasks.map(t => {
        const out: Record<string, unknown> = { Task: t.task }
        raci.roles.forEach((role, i) => { out[role] = t.raci[i] ?? '' })
        return out
      })
      sheets.push(objectsToCsvSheet('Phase1_RACI_Matrix', flat))
    }
  }

  if (opts.appRequirements) {
    const reqs = ld<[string, string, string][]>('phase1_appRequirements', [])
    if (reqs.length > 0) {
      sheets.push(objectsToCsvSheet('Phase1_App_Requirements', reqs.map(r => ({
        Category: r[0], Requirement: r[1],
        Priority: r[2] === 'danger' ? 'High' : r[2] === 'warning' ? 'Medium' : 'Low',
      }))))
    }
  }

  if (opts.testPlansCatalog) {
    const plans = ld<string[][]>('phase1_testPlans', [])
    if (plans.length > 0) {
      sheets.push(objectsToCsvSheet('Phase1_Test_Plans_Catalog', plans.map(r => ({
        'Test Type': r[0] ?? '', Description: r[1] ?? '', Frequency: r[2] ?? '',
      }))))
    }
  }

  if (opts.faultModel) {
    const fm = ld<AnyRow[]>('phase1_faultModel', [])
    if (fm.length > 0) {
      sheets.push(objectsToCsvSheet('Phase1_Fault_Model', fm.map(r => ({
        'Fault Type': r.type ?? '', Description: r.desc ?? '',
        'Tier 1 Strategy': r.t1 ?? '', 'Tier 2 Strategy': r.t2 ?? '', 'Tier 3 Strategy': r.t3 ?? '',
      }))))
    }
  }

  if (opts.bcmTierRequirements) {
    const tierHeaders = (ld<AnyRow[]>('phase1_criticalityModel', []))
      .map(r => `${r.tier ?? ''} ${r.criticality ?? ''}`.trim())
    const sections: { key: string; title: string }[] = [
      { key: 'phase1_bcm_general', title: 'General' },
      { key: 'phase1_bcm_availability', title: 'Availability' },
      { key: 'phase1_bcm_recoverability', title: 'Recoverability' },
      { key: 'phase1_bcm_deployment', title: 'Deployment' },
      { key: 'phase1_bcm_monitoring', title: 'Monitoring' },
      { key: 'phase1_bcm_security', title: 'Security' },
      { key: 'phase1_bcm_testing', title: 'Testing' },
    ]
    sections.forEach(({ key, title }) => {
      const rows = ld<string[][]>(key, [])
      if (rows.length === 0) return
      const flat = rows.map(row => {
        const out: Record<string, unknown> = { Requirement: row[0] ?? '' }
        tierHeaders.forEach((h, i) => {
          const v = row[i + 1] ?? ''
          out[h || `Tier ${i + 1}`] = v === 'required' ? 'Required' : v === 'not-required' ? 'Not Required' : v === 'as-required' ? 'As Required' : v
        })
        return out
      })
      sheets.push(objectsToCsvSheet(`Phase1_BCM_${title}`, flat))
    })
  }

  return sheets
}

/* ── Phase 2 ── */

function buildPhase2Sheets(opts: BcpExportOptions): CsvSheet[] {
  const sheets: CsvSheet[] = []

  const reqs = ld<AnyRow[]>('phase2-requirements', [])
  const reqsSheet = sheetIfData('Phase2_Requirements', reqs.map(r => ({
    Category: r.category, Requirement: r.requirement,
    Status: r.status === 'required' ? 'Required' : r.status === 'not-required' ? 'Not Required' : 'N/A',
    'Architecture Decision': r.adr,
  })))
  if (reqsSheet) sheets.push(reqsSheet)

  const biaMetrics = ld<AnyRow[]>('phase2-bia-metrics', [])
  const biaSheet = sheetIfData('Phase2_BIA_Metrics', biaMetrics)
  if (biaSheet) sheets.push(biaSheet)

  const biaDeps = ld<{ direction: string; items: string[] }[]>('phase2-bia-deps', [])
  if (biaDeps.length > 0) {
    const flat: AnyRow[] = []
    biaDeps.forEach(d => d.items.filter(Boolean).forEach(i => flat.push({ Direction: d.direction, Dependency: i })))
    if (flat.length > 0) sheets.push(objectsToCsvSheet('Phase2_BIA_Dependencies', flat))
  }

  const gap = ld<AnyRow[]>('phase2-gap-assessment', [])
  const gapSheet = sheetIfData('Phase2_Gap_Assessment', gap.map(r => ({
    Component: r.component, Category: r.category, SLA: r.sla,
    'HA Config': r.ha, 'DR Config': r.dr,
    'Gap Status': r.gap === 'met' ? 'Met' : r.gap === 'partial' ? 'Partial' : 'Gap',
  })))
  if (gapSheet) sheets.push(gapSheet)

  const design = ld<AnyRow[]>('phase2-continuity-design', [])
  const designSheet = sheetIfData('Phase2_BCDR_Design', design.map(r => ({
    Component: r.component, Category: r.category, SLA: r.sla,
    HA: r.ha, DR: r.dr, Remediation: r.remediation,
    Status: r.status === 'met' ? 'Met' : 'NEW',
  })))
  if (designSheet) sheets.push(designSheet)

  if (opts.costAnalysis) {
    const cost = ld<{ component: string; currentCost: number; bcdrCost: number }[]>('phase2-cost-comparison', [])
    if (cost.length > 0) {
      const totB = cost.reduce((a, r) => a + r.currentCost, 0)
      const totA = cost.reduce((a, r) => a + r.bcdrCost, 0)
      const rows: AnyRow[] = cost.map(r => ({
        Component: r.component, 'Current Cost': r.currentCost, '+BCDR Cost': r.bcdrCost,
        Difference: r.bcdrCost - r.currentCost,
      }))
      rows.push({ Component: 'TOTAL', 'Current Cost': totB, '+BCDR Cost': totA, Difference: totA - totB })
      sheets.push(objectsToCsvSheet('Phase2_Cost_Comparison', rows))
    }
  }

  if (opts.metricComparison) {
    const metrics = ld<AnyRow[]>('phase2-metric-comparison', [])
    const ms = sheetIfData('Phase2_Metric_Comparison', metrics)
    if (ms) sheets.push(ms)
  }

  const response = ld<AnyRow[]>('phase2-response-plan', [])
  const respSheet = sheetIfData('Phase2_Response_Plan', response)
  if (respSheet) sheets.push(respSheet)

  const roles = ld<AnyRow[]>('phase2-role-assignment', [])
  const rolesSheet = sheetIfData('Phase2_Role_Assignment', roles)
  if (rolesSheet) sheets.push(rolesSheet)

  const failover = ld<{ action: string; owner: string; validation: string }[]>('phase2-runbook-failover', [])
  if (failover.length > 0) {
    sheets.push(objectsToCsvSheet('Phase2_Runbook_Failover',
      failover.map((r, i) => ({ Step: i + 1, Action: r.action, Owner: r.owner, Validation: r.validation }))))
  }
  const failback = ld<{ action: string; owner: string; validation: string }[]>('phase2-runbook-failback', [])
  if (failback.length > 0) {
    sheets.push(objectsToCsvSheet('Phase2_Runbook_Failback',
      failback.map((r, i) => ({ Step: i + 1, Action: r.action, Owner: r.owner, Validation: r.validation }))))
  }

  const sev = ld<AnyRow[]>('phase2-severity-matrix', [])
  const sevSheet = sheetIfData('Phase2_Severity_Matrix', sev)
  if (sevSheet) sheets.push(sevSheet)

  const comms = ld<AnyRow[]>('phase2-comm-plan', [])
  const commSheet = sheetIfData('Phase2_Communication_Plan', comms)
  if (commSheet) sheets.push(commSheet)

  const cont = ld<string[]>('phase2-contingency-steps', [])
  if (cont.length > 0) {
    sheets.push(objectsToCsvSheet('Phase2_Contingency_Steps',
      cont.filter(Boolean).map((step, i) => ({ Step: i + 1, Action: step }))))
  }

  const tests = ld<AnyRow[]>('phase2-test-summary', [])
  const testSheet = sheetIfData('Phase2_Test_Summary', tests)
  if (testSheet) sheets.push(testSheet)

  const uat = ld<AnyRow[]>('phase2-uat-cases', [])
  const uatSheet = sheetIfData('Phase2_UAT_Cases', uat)
  if (uatSheet) sheets.push(uatSheet)

  const maint = ld<AnyRow[]>('phase2-maintenance', [])
  const maintSheet = sheetIfData('Phase2_Maintenance', maint)
  if (maintSheet) sheets.push(maintSheet)

  return sheets
}

/* ── Phase 3 ── */

function buildPhase3Sheets(opts: BcpExportOptions): CsvSheet[] {
  const sheets: CsvSheet[] = []

  const risks = ld<{ category: string; description: string; impact: number; probability: number }[]>('phase3-risk-scenarios', [])
  if (risks.length > 0) {
    const flat = risks.map(r => {
      const score = r.impact * r.probability
      const level = score >= 20 ? 'Critical' : score >= 15 ? 'High' : score >= 8 ? 'Medium' : 'Low'
      return { 'Risk Category': r.category, Description: r.description, Impact: r.impact, Probability: r.probability, Score: score, Level: level }
    })
    sheets.push(objectsToCsvSheet('Phase3_Risk_Register', flat))
  }

  if (opts.programmeLevel) {
    const mbco = ld<AnyRow[]>('phase3-mbco', [])
    const mbcoSheet = sheetIfData('Phase3_MBCO_Recovery_Order', mbco.map(r => ({
      'Recovery Order': r.order, Application: r.application, 'Business Function': r.businessFunction,
      Criticality: r.criticality, Window: r.window, Environment: r.env, Location: r.location,
      'Upstream Dependencies': r.upstreamDeps, 'Downstream Dependencies': r.downstreamDeps,
      'Recovery Options': r.recovery,
    })))
    if (mbcoSheet) sheets.push(mbcoSheet)

    const bia = ld<AnyRow[]>('phase3-bia-portfolio', [])
    const biaSheet = sheetIfData('Phase3_BIA_Portfolio', bia.map(r => ({
      Application: r.application, Criticality: r.criticality, SLO: r.slo,
      RTO: r.rto, RPO: r.rpo, MTD: r.mtd, 'Impact Cost/hr': r.impactCost, 'Last BIA Review': r.lastReview,
    })))
    if (biaSheet) sheets.push(biaSheet)

    const cal = ld<AnyRow[]>('phase3-calendar', [])
    const calSheet = sheetIfData('Phase3_Critical_Function_Calendar', cal.map(r => ({
      Month: r.month, 'Business Function': r.function_name, Applications: r.applications, Notes: r.notes,
    })))
    if (calSheet) sheets.push(calSheet)

    const maint3 = ld<AnyRow[]>('phase3-maintenance', [])
    const maint3Sheet = sheetIfData('Phase3_Maintenance', maint3.map(r => ({
      Document: r.document, Frequency: r.frequency, 'Next Review': r.nextReview,
      Owner: r.owner, Approver: r.approver,
      Status: r.status === 'current' ? 'Current' : r.status === 'overdue' ? 'Overdue' : 'Due Soon',
    })))
    if (maint3Sheet) sheets.push(maint3Sheet)

    const act = ld<AnyRow[]>('phase3-activity', [])
    const actSheet = sheetIfData('Phase3_Activity_Log', act)
    if (actSheet) sheets.push(actSheet)
  }

  return sheets
}

export function exportAllPhasesToCsv(options: BcpExportOptions = defaultExportOptions): void {
  const sheets = [
    ...buildPhase1Sheets(options),
    ...buildPhase2Sheets(options),
    ...buildPhase3Sheets(options),
  ]
  if (sheets.length === 0) {
    alert('No data to export. Open a solution and add data first.')
    return
  }
  downloadMultipleCsvSheets(sheets, 'BoltPlan')
}
