# BCDR Usage Guideline

> A practitioner's guide for using **BoltPlan** to build, operate, and maintain a Business Continuity and Disaster Recovery (BCDR) program on Microsoft Azure — aligned with **ISO 22301**, the **Microsoft Azure Well-Architected Framework (WAF) — Reliability pillar**, and the **NIST SP 800-34** contingency-planning lifecycle.

---

## Table of Contents

1. [Scope and Audience](#1-scope-and-audience)
2. [Frameworks This Guideline Maps To](#2-frameworks-this-guideline-maps-to)
3. [BCDR Vocabulary](#3-bcdr-vocabulary)
4. [The BoltPlan Operating Model](#4-the-boltplan-operating-model)
5. [Phase 1 — Prepare](#5-phase-1--prepare)
6. [Phase 2 — Application Continuity (Assess → Implement → Test)](#6-phase-2--application-continuity)
7. [Phase 3 — Business Continuity](#7-phase-3--business-continuity)
8. [Roles, RACI, and Governance](#8-roles-raci-and-governance)
9. [Evidence, Export, and Audit](#9-evidence-export-and-audit)
10. [Maintenance Cadence](#10-maintenance-cadence)
11. [Compliance Crosswalk](#11-compliance-crosswalk)
12. [References](#12-references)

---

## 1. Scope and Audience

This guideline is for:

- **Business Continuity Managers** building or refreshing an ISO 22301-aligned BCMS.
- **Cloud Architects & Site Reliability Engineers** designing or auditing Azure workloads against the WAF Reliability pillar.
- **Risk, Audit, and Compliance** teams evidencing BCDR controls (ISO 22301, ISO 27001 A.5.29/A.5.30, NIST 800-34, SOC 2 CC9.1, FFIEC, DORA).
- **Application Owners** running BIA, FTA, runbook drills, and post-incident reviews.

It assumes the reader has access to the BoltPlan web app (`web-app/`) and write access to at least one Azure subscription that hosts a workload in scope.

---

## 2. Frameworks This Guideline Maps To

| Framework | Relevance | Where it appears in BoltPlan |
|-----------|-----------|------------------------------|
| **ISO 22301:2019** — Security and resilience — BCMS | Primary alignment for the generated BCP (sections 1–13). | PDF/DOCX export structure. |
| **ISO/IEC 27001:2022 — A.5.29 / A.5.30** | ICT readiness for business continuity. | Phase 2 (architecture, runbooks, tests). |
| **Microsoft Azure Well-Architected Framework — Reliability** | Design guidance for Azure workloads (targets, failure mode analysis, testing). | Phase 2 Assess + Implement; composite SLA, FTA, runbooks, severity matrix, comms plan. |
| **Microsoft Cloud Adoption Framework — Manage / Resiliency** | Operational model and disciplines. | Phase 3 Operations + Maintenance. |
| **NIST SP 800-34 Rev. 1** | Contingency planning lifecycle (BIA → strategy → plan → test → maintain). | Mapped across Phase 1–3. |
| **ISO 31000:2018** | Risk management principles. | Phase 3 Risk Assessment (5x5 matrix). |
| **SOC 2 — CC9.1** | Risk identification & disruption mitigation. | Phase 3 Risk + Maintenance evidence. |
| **DORA (EU 2022/2554) — Art. 11, 24, 25** | ICT business continuity and digital operational resilience testing (financial services). | Phase 2 Test + Phase 3 Maintenance. |
| **FFIEC BCM Handbook** | Resilience expectations for US financial institutions. | Phase 3 Planning + Operations. |

BoltPlan is **framework-aware**, not a certification tool. It produces evidence (plans, BIAs, FTAs, test records) that auditors and assessors expect — final attestations remain the responsibility of your organization.

---

## 3. BCDR Vocabulary

| Term | Definition | Where used in BoltPlan |
|------|------------|------------------------|
| **RTO** (Recovery Time Objective) | Maximum acceptable downtime for a process or system. | Phase 2 Assess → Requirements / BIA Metrics. |
| **RPO** (Recovery Point Objective) | Maximum acceptable data loss measured in time. | Phase 2 Assess → Requirements / BIA Metrics. |
| **MTPD** (Maximum Tolerable Period of Disruption) | Outer bound after which damage becomes unacceptable. | Phase 1 Business Commitment; Phase 3 MBCO. |
| **MBCO** (Minimum Business Continuity Objective) | Minimum level of products/services acceptable during a disruption. | Phase 3 MBCO tab. |
| **BIA** (Business Impact Analysis) | Quantifies impact of disruption across financial, operational, regulatory dimensions. | Phase 2 Assess → BIA. |
| **FTA** (Fault Tree Analysis, IEC 61025) | Top-down deductive failure analysis using logic gates. | Phase 2 Assess + Implement Fault Tree. |
| **FMEA** (Failure Mode & Effects Analysis) | Risk Priority Number = Severity × Occurrence × Detection. | FTA toolbar (FMEA scoring per leaf node). |
| **Composite SLA** | Product of dependent components' SLAs adjusted for redundancy. | Phase 2 Assess → Metrics. |
| **Run Book / Playbook** | Step-by-step procedure for executing failover or failback. | Phase 2 Implement → DR Runbook. |
| **Drill / Exercise** | Planned test of the plan (tabletop, walkthrough, simulation, full). | Phase 2 Test → Drill. |
| **MBCO vs RTO** | MBCO answers *what* must run; RTO answers *how fast*. | Phase 3 vs Phase 2. |

> See in-app **Glossary** for the full list of 29 terms.

---

## 4. The BoltPlan Operating Model

BoltPlan organizes the lifecycle into three phases that mirror NIST 800-34 and ISO 22301 Clauses 8.2–8.5:

```
Phase 1: PREPARE          Phase 2: APPLICATION CONTINUITY     Phase 3: BUSINESS CONTINUITY
─────────────────         ───────────────────────────────     ────────────────────────────
Context & Scope     →     Assess  →  Implement  →  Test  →    Plan → Operate → Maintain
(ISO 22301 Cl. 4-7)      (ISO Cl. 8.2 – 8.5 / WAF Reliability) (ISO Cl. 8.4 / 9 / 10)
```

### Data model and persistence

- Each **Solution** is an isolated workspace (one workload, one BCP) — chip selector top-right.
- All data is stored in browser `localStorage` under `abcg_{solutionId}_{key}`.
- **Export JSON** captures every key for the current solution (including the Service Map and Fault Tree diagrams).
- **Import JSON** recreates the solution (preserving its id and name) and re-loads all data.
- **PDF / DOCX** generation reads the same store to produce the ISO 22301 BCP.

> Treat the JSON export as the **system of record** for offline backup, peer review, and version control.

---

## 5. Phase 1 — Prepare

> **Maps to:** ISO 22301 Cl. 4 (Context), Cl. 5 (Leadership), Cl. 6 (Planning), Cl. 7 (Support); NIST 800-34 Step 1.

### 5.1 Concepts

Read all three concept cards before starting:

1. **Shared Responsibility Model** — confirms what *you* are responsible for in IaaS / PaaS / SaaS. Source: [Microsoft shared responsibility in the cloud](https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility).
2. **Design Patterns** — cell-based architecture, deployment stamps, geode, active/active vs active/passive.
3. **Reliability Trade-offs** — cost, complexity, performance.

### 5.2 Criticality Model

Define the tiers your organization uses (Mission Critical, Business Critical, Internal, Low). Colors propagate automatically to every other table that references criticality. This becomes the **input to the BIA** in Phase 2.

> Tip: Align the highest tier's RTO/RPO with your published SLA commitments. If the SLA is 99.99% then your downtime budget is ~52 min/year — the runbook must achieve recovery inside that window.

### 5.3 Business Commitment

Capture the public-facing commitments: availability targets, support hours, geographic coverage, regulatory commitments, MTPD per tier. The PDF/DOCX uses this verbatim in Section 2 of the BCP.

### 5.4 Fault Model

Catalogue the failure types you've considered (transient, hardware, region, dependency, human error, malicious). Each fault becomes a candidate **top event** in the Fault Tree later.

### 5.5 RACI Matrix

Pre-populated with 29 BCDR deliverables × 8 roles. Adjust to your org chart — every role here must reappear in Phase 2 Roles and Phase 2 Comms Plan.

### 5.6 Requirements & 5.7 Test Plans

These set the policy floor for the rest of the workbench. Requirements categorize by *availability, security, compliance*; test plans set frequency by exercise type.

**Exit criteria for Phase 1:**

- [ ] Criticality tiers approved by business sponsor.
- [ ] Business Commitment signed off (legal / product).
- [ ] RACI matrix has named individuals (not just role titles).
- [ ] Test cadence agreed.

---

## 6. Phase 2 — Application Continuity

> **Maps to:** ISO 22301 Cl. 8.2 (BIA & risk), 8.3 (Strategy), 8.4 (Procedures), 8.5 (Exercise); WAF Reliability — *Design for failure, Define targets, Run failure-mode analysis, Test for resiliency*.

### 6.1 Assess

| Section | Purpose | Compliance hook |
|---------|---------|-----------------|
| **Requirements** | Per-component RTO / RPO / availability target. | ISO 22301 8.2.2; WAF "Define reliability targets". |
| **Service Map** | Visual dependency model (React Flow). Each node = an Azure service, custom category, or third-party / on-prem component. | WAF "Identify all flows". |
| **BIA** | Quantify impact dimensions × duration. | ISO 22301 8.2.2; NIST 800-34 Step 2. |
| **Fault Tree (−BCDR)** | Top-down failure model **before** mitigations. | WAF "Run failure-mode analysis"; IEC 61025. |
| **Gap Assessment** | Delta between current and target state. | ISO 22301 8.3.1. |
| **Metrics** | Composite SLA from the dependency chain. | WAF "Calculate composite SLAs". |

> **Procedure** — for each component on the Service Map: capture an RTO/RPO in *Requirements*, drag it onto the *Service Map*, then derive a *Composite SLA*. Anything above your committed SLA is a finding for the Gap Assessment.

### 6.2 Implement

| Section | Purpose | Compliance hook |
|---------|---------|-----------------|
| **Response Plan** | Initial detect → triage → declare flow. | ISO 22301 8.4.2; NIST 800-34 Step 4. |
| **Architecture Design** | Target state diagram + decisions (zone redundancy, paired region, ZRS, geo-replication). | WAF Reliability checklists. |
| **Cost & Metrics Comparison** | Before / after BCDR investment vs availability delta. | Internal sign-off; WAF cost-vs-reliability trade-off. |
| **Fault Tree (+BCDR)** | Same fault tree with mitigations applied; RPN should drop. | IEC 61025; ISO 22301 8.3.3. |
| **Contingency Plan** | Step list for "if all else fails". | ISO 22301 8.4.4. |
| **Roles & Responsibilities** | Per-incident named operators + backups (24×7 coverage). | ISO 22301 7.1.2. |
| **DR Runbook — Failover** | Numbered, owner-stamped, time-boxed steps. | WAF "Document and test recovery procedures"; ISO 22301 8.4.3. |
| **DR Runbook — Failback** | Mirrors failover; explicit data-consistency checks. | Same as above. |
| **Severity Matrix** | Sev 1–4 with examples, response SLAs, escalation. | NIST 800-34 Step 4; SOC 2 CC7.3. |
| **Communication Plan** | Who is notified, by which channel, at which milestone. | ISO 22301 8.4.3 d); DORA Art. 14. |

> **Procedure** — write the runbook *before* the drill, not after. The runbook is the artifact under test. Severity Matrix + Comms Plan must agree on triggers — Sev 1 in the matrix must equal "P0 — Major Incident" in comms.

### 6.3 Test

| Section | Purpose | Cadence (default) |
|---------|---------|-------------------|
| **Test Summary** | Catalog of all exercises. | — |
| **Drill** | Tabletop / walkthrough / simulation / full failover. | Quarterly (tabletop), Annual (full). |
| **UAT** | Business sign-off the recovered environment is usable. | After every drill. |
| **Communication Test** | Validate notification trees, status page, customer comms. | Annual. |
| **Maintenance** | Findings → backlog → owners. | After every drill. |

> **Procedure** — every drill *must* close with: (1) finding log, (2) action items with owners and due dates, (3) updated runbook version. Auditors will ask for the diff.

**Exit criteria for Phase 2:**

- [ ] Composite SLA meets committed SLA per criticality tier.
- [ ] FTA shows RPN reduction from −BCDR to +BCDR for every Sev 1 path.
- [ ] Failover and failback runbooks have been executed (not just reviewed) in the last 12 months.
- [ ] Severity Matrix and Comms Plan are cross-consistent.

---

## 7. Phase 3 — Business Continuity

> **Maps to:** ISO 22301 Cl. 8.4 (BCP), Cl. 9 (Performance evaluation), Cl. 10 (Improvement); NIST 800-34 Step 7.

### 7.1 Planning & Risk

- **BCP Checklist** — progress bar tracks plan-completeness. Aim for 100% before annual sign-off.
- **Risk Assessment** — 5×5 matrix (likelihood × impact). Every High/Critical cell must have a treatment in Phase 2 Implement.

### 7.2 MBCO & Portfolio

- **Recovery Order** — sequence of which products/services come back first. Driven by MBCO and tier.
- **BIA Portfolio Summary** — roll-up across solutions (when multiple solutions are loaded).

### 7.3 Operations

- **Calendar** — review and exercise schedule.
- **Dashboard** — auto-populates from the other phases (status, last drill date, open findings).
- **Activity Log** — append-only record of incidents, drills, plan reviews.

### 7.4 Maintenance

| Activity | Frequency | Trigger to expedite |
|----------|-----------|---------------------|
| Plan review | Annual | Major arch change, M&A, regulator change. |
| BIA refresh | Annual | New product launch, criticality change. |
| Risk register review | Quarterly | New threat intel, post-incident. |
| Runbook walkthrough | Quarterly | Owner change, dependency change. |
| Full failover drill | Annual | Per regulation; DORA = annual for critical systems. |
| Training & awareness | Annual + on hire | — |

---

## 8. Roles, RACI, and Governance

| Role | Phase 1 | Phase 2 | Phase 3 |
|------|---------|---------|---------|
| **Executive Sponsor** | Approves criticality + commitments. | Funds investment. | Signs annual BCP. |
| **BCM Manager** | Owns RACI. | Coordinates BIA. | Owns Operations + Maintenance. |
| **Application Owner** | — | Authors BIA, runbook, FTA. | Executes recovery. |
| **Cloud Architect / SRE** | Reviews patterns. | Designs target architecture. | Maintains automation. |
| **Risk & Compliance** | Maps frameworks. | Reviews controls. | Provides audit evidence. |
| **Comms / PR** | — | Co-authors Comms Plan. | Executes external comms. |
| **Legal** | Reviews commitments + regulator obligations. | — | Reviews incident comms. |
| **Internal Audit** | — | Spot-checks runbooks. | Annual audit. |

> The in-app RACI is the source of truth for these mappings. Keep it in sync with HR org changes.

---

## 9. Evidence, Export, and Audit

### What to export, when

| Trigger | Artifact | Format | Retain for |
|---------|----------|--------|------------|
| Quarterly review | BCP | PDF | 3 years rolling. |
| Annual sign-off | BCP | DOCX (for redlining) | Indefinite. |
| Before any major change | JSON | JSON | Until next change. |
| After every drill | Test Summary CSV + updated runbook PDF | CSV + PDF | Per audit policy. |
| Architecture review | Service Map PNG, Fault Tree PNG | PNG | With ADR. |

### Audit talking points

- **ISO 22301 9.1 (monitoring)** — "Show the activity log and last drill outcome." → Phase 3 Operations + Test Summary CSV.
- **ISO 22301 8.5 (exercising)** — "Show the most recent full exercise." → Phase 2 Test Drill + post-drill runbook diff.
- **WAF Reliability — failure-mode analysis** — "Show your FTA." → Phase 2 Implement Fault Tree (+BCDR).
- **DORA Art. 24 (testing)** — "Show your three-year testing schedule." → Phase 3 Maintenance calendar.
- **SOC 2 CC9.1** — "Show your risk register and treatments." → Phase 3 Risk Assessment.

> The PDF/DOCX export is built specifically to map section-for-section to ISO 22301 — auditors can navigate it without translation.

---

## 10. Maintenance Cadence

Adopt a **monthly heartbeat** for the BoltPlan workbench:

| Week | Activity |
|------|----------|
| Week 1 | Review open findings from the last drill. |
| Week 2 | Walk one runbook with the on-call team. |
| Week 3 | Verify Composite SLA still matches deployed architecture. |
| Week 4 | Export PDF + JSON, attach to monthly governance pack. |

Plus annual full-cycle: BIA refresh → architecture review → full failover drill → BCP re-issue.

---

## 11. Compliance Crosswalk

| BoltPlan Artifact | ISO 22301 | ISO 27001 | NIST 800-34 | WAF Reliability | DORA |
|-------------------|-----------|-----------|-------------|-----------------|------|
| Criticality Model | 8.2.2 | A.5.29 | Step 2 | Tier targets | Art. 8 |
| BIA | 8.2.2 | A.5.30 | Step 2 | "Define targets" | Art. 8 |
| Service Map | 8.2.3 | A.5.30 | Step 2 | "Identify flows" | — |
| FTA −BCDR / +BCDR | 8.3.3 | A.5.30 | Step 3 | "Failure-mode analysis" | Art. 25 |
| Composite SLA | 8.3.3 | A.5.30 | Step 3 | "Composite SLA" | Art. 11 |
| DR Runbook | 8.4.3 | A.5.30 | Step 4 | "Document procedures" | Art. 11 |
| Severity Matrix | 8.4.2 | A.5.26 | Step 4 | "Severity model" | Art. 17 |
| Communication Plan | 8.4.3 d) | A.5.29 | Step 4 | — | Art. 14 |
| Drill record | 8.5 | A.5.30 | Step 5 | "Test for resiliency" | Art. 24-26 |
| Risk Assessment | 8.2.3 | Cl. 6.1 | Step 3 | — | Art. 6 |
| MBCO | 8.2.2 | A.5.29 | Step 2 | — | Art. 11 |
| BCP (PDF/DOCX) | 8.4 (whole clause) | A.5.30 | Step 4 | — | Art. 11 |
| Maintenance schedule | 8.6 + 9 + 10 | A.5.30 | Step 7 | — | Art. 25 |

---

## 12. References

### Microsoft

- [Azure Well-Architected Framework — Reliability pillar](https://learn.microsoft.com/azure/well-architected/reliability/)
- [Reliability checklist](https://learn.microsoft.com/azure/well-architected/reliability/checklist)
- [Failure-mode analysis for Azure applications](https://learn.microsoft.com/azure/well-architected/reliability/failure-mode-analysis)
- [Disaster recovery for Azure applications](https://learn.microsoft.com/azure/well-architected/reliability/disaster-recovery)
- [Cross-region replication in Azure (paired regions)](https://learn.microsoft.com/azure/reliability/cross-region-replication-azure)
- [Azure availability zones overview](https://learn.microsoft.com/azure/reliability/availability-zones-overview)
- [Cloud Adoption Framework — Manage / Resiliency](https://learn.microsoft.com/azure/cloud-adoption-framework/manage/considerations/business-continuity)
- [Shared responsibility in the cloud](https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility)
- [Service Level Agreements (SLAs) for Azure services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services)
- [Azure Business Continuity Guide (source workbook)](https://github.com/Azure/BusinessContinuityGuide)

### Standards & Regulations

- **ISO 22301:2019** — Security and resilience — Business continuity management systems — Requirements.
- **ISO/IEC 27001:2022** — Information security management systems (Annex A.5.29, A.5.30).
- **ISO 31000:2018** — Risk management — Guidelines.
- **IEC 61025:2006** — Fault tree analysis.
- **NIST SP 800-34 Rev. 1** — Contingency Planning Guide for Federal Information Systems.
- **NIST SP 800-61 Rev. 2** — Computer Security Incident Handling Guide.
- **EU Regulation 2022/2554 (DORA)** — Digital Operational Resilience Act.
- **FFIEC IT Examination Handbook — Business Continuity Management.**
- **AICPA SOC 2 — Trust Services Criteria (CC7, CC9).**

---

> *This guideline is a practitioner's reference, not legal or audit advice. Final attestations and certifications remain the responsibility of your organization.*
