# PRD: Interactive Web Version of Azure Business Continuity Guide

## Objective
Create a fully interactive web version of the Azure Business Continuity Guide that mirrors the Excel workbook's practical, interactive nature. The web app should not just display static content but provide interactive tables, color-coded indicators, expandable/collapsible sections, filterable views, and practical templates that replicate the workbook experience. All sections from the original Excel worksheet must be incorporated.

## Key Interactive Features to Replicate from Excel
- **Color-coded criticality tiers** — Red (Mission Critical), Orange (High), Yellow (Medium), Green (Low), Gray (Unsupported)
- **Status indicators** — ✅ Required, ❌ Not Required, ➖ As Required (with legend)
- **Collapsible/expandable sections** — Business Commitment Model has 7 expandable sub-sections
- **Interactive data tables** — Criticality Model, MBCO Recovery Order, Architecture Assessment tables
- **RACI matrix** — Color-coded role assignments (Responsible, Accountable, Consulted, Informed)
- **Risk calculation** — RISK = IMPACT × PROBABILITY with 1-5 scale visual and color-coded risk levels
- **Category filters** — Filterable requirement categories
- **Visual workflow** — Impact scope diagram for Response Plan (from Global down to Data Integrity)
- **Before/After comparisons** — Architecture -BCDR vs +BCDR, Metrics -BCDR vs +BCDR

## Tasks

### Task-001: Bootstrap project from feature branch ✅
**Status:** DONE (commit: 4553ff3)

### Task-002: Improve UI layout and responsive design ✅
**Status:** DONE (commit: c6545ad)

### Task-003: Interactive Phase 1 — Criticality Model & Business Commitment Model
**Description:** Transform Phase 1 into an interactive experience matching the Excel workbook:
1. **Criticality Model** — Interactive table with color-coded tiers (Tier 1-5), Criticality labels with colored badges, Business View descriptions, and Business Impact columns (Financial, Brand Reputation, Customer Trust, Customer Experience, Injury/Loss of Life, Employee Productivity) with Yes/No indicators
2. **Business Commitment Model** — Expandable accordion with 7 sub-sections. Each sub-section has an interactive table showing requirements per criticality tier with ✅/❌/➖ status indicators and a legend. Sub-sections: General, Availability, Recoverability, Deployment, Monitoring, Security Control, Validation & Testing
3. **Fault Model** — Table showing failure types and resilience strategies per criticality tier
4. **RACI Matrix** — Interactive table with color-coded RACI roles matching the Excel's visual layout
5. **Application Requirements Template** — Category-filtered requirements list with Required/Not Required/Not Applicable indicators
6. **Test Plans Template** — Table of test types with descriptions and links

**Acceptance Criteria:**
- Criticality Model rendered as interactive table with color-coded badges per tier
- Business Commitment Model has 7 expandable sub-sections, each with data tables using ✅/❌/➖ indicators
- Legend explaining status indicators is shown
- RACI matrix displayed with color-coded roles
- All content matches Excel workbook descriptions from getting-started.md
- `npm run build` succeeds

### Task-004: Interactive Phase 2 — Assessment Templates & Before/After Comparisons
**Description:** Transform Phase 2 into an interactive experience with three sub-sections (Assess, Implement, Test), each containing practical templates:
1. **Assess section:** Requirements & ADR template with categorized filter buttons, Service Map component list, BIA with metrics table (SLA, RTO, RPO, MTD, etc.), Fault Tree Analysis visualization, Architecture Gap Assessment table with per-component requirements and gap indicators, Metric Analysis summary tables
2. **Implement section:** Response Plan by Scope showing the impact scope hierarchy (Global → Geography → Region → Zone → Service → Data Integrity) with response plans and preparation activities for each scope. Architecture +BCDR with changed items highlighted. Cost Comparison table showing before/after costs. Metric Comparison with improved scores. Contingency Plan template. Role Assignment table.
3. **Test section:** Test Summary with test types and tracking fields (frequency, dates, automation, outcomes). Continuity Drill procedure template. UAT Test Plan. Outage Communication Plan template. Maintenance plan table.

**Acceptance Criteria:**
- Assess/Implement/Test tabs or sections with distinct visual styling (matching badges already in place)
- Response Plan by Scope shows hierarchical impact scope diagram with details per level
- Architecture tables show requirements per component with status indicators
- All 17 sub-sections have detailed interactive content
- Links to Microsoft docs (Application Insights, VM Insights, etc.) included
- `npm run build` succeeds

### Task-005: Interactive Phase 3 — Risk Matrix, MBCO Table & Dashboard
**Description:** Transform Phase 3 with rich interactive content:
1. **BCP Document** — Checklist-style list of BCP components with detailed descriptions
2. **Business Risk Assessment** — Interactive risk matrix with RISK = IMPACT × PROBABILITY visual (1-5 scales), color-coded risk levels (Critical 20-25 Red, High 15-19 Orange, Medium 8-14 Yellow, Low 1-7 Green), example risk scenarios with calculated scores
3. **MBCO Planning** — Interactive recovery order table with columns: Recovery Order, Application Name, Business Function, Criticality (color-coded), Criticality Window, Environment, Location, Dependencies (upstream/downstream), Recovery Options, Recovery Geography. Sample data matching the Excel screenshot.
4. **Business Critical Function Calendar** — Calendar/timeline view of critical business events
5. **BIA Portfolio Summary** — Summary table of all application BIAs with key metrics
6. **BCDR Dashboard** — Dashboard-style layout with metric cards and status indicators
7. **Maintain Business Continuity** — Maintenance plan table with review schedules

**Acceptance Criteria:**
- Risk calculation formula displayed visually with colored scale
- Risk matrix is interactive with 4-quadrant view and color-coded severity
- MBCO table shows detailed recovery order with color-coded criticality
- All 7 sections have detailed interactive content matching Excel
- `npm run build` succeeds

### Task-006: Add Personas page with Role-Task Matrix
**Description:** Create a Personas page showing BCDR by Role and Task. The Excel has a dedicated tab mapping roles to tasks across all phases. Include roles: Application Owner, Solution Architect, Cloud Engineer, Operations, Security, Compliance, Business Stakeholder, QA/Testing. For each role, show which tasks they're Responsible, Accountable, Consulted, or Informed for across all 3 phases. Use a visual table or card-based layout with RACI color coding.
**Acceptance Criteria:**
- New "Personas" nav item in sidebar with People icon
- Role cards showing each persona with their responsibilities
- RACI table mapping roles to specific tasks across phases
- Color-coded RACI indicators matching Phase 1 RACI style
- `npm run build` succeeds

### Task-007: Add searchable Glossary page
**Description:** Add a Glossary page with searchable BCDR terminology. Key terms: RTO, RPO, MTD, MBCO, SLA, BIA, BCP, BCDR, SLO, SLI, RPA, RTA, DRaaS, HA, FTA, WAF, CAF. Each term should have an abbreviation, full name, and clear definition. Include a search/filter input at the top.
**Acceptance Criteria:**
- New "Glossary" nav item in sidebar with Book icon
- Search input that filters terms in real-time
- Terms organized alphabetically with clear abbreviation → full name → definition layout
- Minimum 20 BCDR terms included
- `npm run build` succeeds

### Task-008: Add References page with categorized links
**Description:** Add a References page with categorized external links to Microsoft documentation. Categories: Azure Architecture & Reliability, Business Continuity Planning, Disaster Recovery, Monitoring & Operations, Security, Cloud Adoption Framework, Well-Architected Framework.
**Acceptance Criteria:**
- New "References" nav item in sidebar with Link icon
- Links categorized into meaningful groups
- Each link has title, URL, and brief description
- Minimum 15 reference links included
- `npm run build` succeeds

### Task-009: Final polish, build verification, commit, and merge to main
**Description:** Final pass: ensure consistent styling across all pages, verify build succeeds with no errors, commit all changes with clear messages, and merge `feature/ui-improvements` into `main`.
**Acceptance Criteria:**
- All pages have consistent styling using FluentUI makeStyles
- `npm run build` succeeds with no errors or warnings
- All changes committed with clear, descriptive messages
- Branch merged into main (fast-forward or merge commit)
- App runs correctly with `npm run dev`
