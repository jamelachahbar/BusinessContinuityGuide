# AGENTS.md - BusinessContinuityGuide Web App

## Project Overview
Web version of the Azure Business Continuity Guide (ABC Guide) Excel workbook, built with React, Vite, and FluentUI v9.

## Tech Stack
- **Framework:** React 19 + TypeScript
- **UI Library:** FluentUI React Components v9 + FluentUI React Icons
- **Build:** Vite 8
- **Styling:** FluentUI `makeStyles` (Griffel)

## Architecture
- `web-app/` — all web application source code
- `web-app/src/App.tsx` — main app shell with sidebar navigation
- `web-app/src/components/` — page components (Home, Phase1, Phase2, Phase3)
- Navigation is tab-based via sidebar, using `useState<TabValue>`

## Key Conventions
- All styling uses FluentUI `makeStyles` — no CSS modules, no Tailwind
- Components are function components with TypeScript
- Use FluentUI components (Card, Accordion, Badge, etc.) for UI elements
- Gradient theme: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` as primary
- All content is static (no backend, no API calls)

## Content Source
The content comes from the original Excel workbook documented in `getting-started.md` and `README.md`. The Excel has these worksheet tabs organized in 3 phases:

### Phase 1: Prepare
- **Concepts:** Shared Responsibility, Design Patterns, Reliability Trade-offs
- **Supporting Artifacts:** Criticality Model, Business Commitment Model (with 7 sub-sections: General, Availability, Recoverability, Deployment, Monitoring, Security Control, Validation & Testing), Fault Model & Resilience Strategies, RACI, Application Requirements Template, Test Plans Template

### Phase 2: Application Continuity
- **Assess:** Requirements & Architecture Decision Record, Service Map, Business Impact Analysis, Fault Tree Analysis (-BCDR), Architecture | Continuity Gap Assessment (-BCDR), Metric Analysis
- **Implement:** Response Plan by Scope, Architecture | Continuity Design (+BCDR), Cost Comparison, Metric Comparison (+BCDR), Fault Tree Analysis (+BCDR), Contingency Plan, Role Assignment
- **Test:** Test Summary, Continuity Drill (Failover Test), Test Plan (UAT), Outage Communication Plan, Maintain Application Continuity

### Phase 3: Business Continuity
- **BCP Document**
- **Business Risk Assessment**
- **MBCO Planning** (Application Recovery Order)
- **Operational Management:** Business Critical Function Calendar, Business Impact Analysis | Portfolio Summary, BCDR Dashboard, Maintain Business Continuity

### Additional Sections (in Excel, missing from current web app)
- **Personas:** BCDR by Role and Task
- **Glossary:** BCDR terminology definitions
- **References:** Links to external resources

## Git Workflow
- Working branch: `feature/ui-improvements`
- Target: merge into `main` when complete
- Commit messages should be clear and descriptive
