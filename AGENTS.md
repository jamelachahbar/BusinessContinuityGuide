# AGENTS.md — BoltPlan BCDR Workbench

## Project Overview

**BoltPlan** is an interactive BCDR (Business Continuity & Disaster Recovery) workbench built as a web application. It reimagines the Azure Business Continuity Guide Excel workbook as a modern React app with visual diagrams, editable tables, multi-solution support, and ISO 22301-compliant report generation.

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 8 | Build tool + dev server |
| FluentUI React | v9 | Component library (makeStyles/Griffel) |
| React Flow | 11 | Service Map + Fault Tree diagrams |
| Recharts | 3 | Charts (bar, radar, pie) |
| React Joyride | 3 | Guided tour overlay |
| html-to-image | | Diagram PNG export |
| docx + file-saver | | Word document generation |
| localStorage | | Per-solution data persistence |

## Architecture

```
web-app/src/
├── App.tsx                          # Main shell: collapsible sidebar, toolbar, routing
├── components/
│   ├── Home.tsx                     # Dashboard with Getting Started progress card
│   ├── Phase1Prepare.tsx            # Tabbed: Concepts, Criticality, BCM, Artifacts
│   ├── Phase2ApplicationContinuity.tsx  # Tabbed: Assess, Implement, Test
│   ├── phase2/
│   │   ├── AssessTab.tsx            # 6 sections (Requirements, Service Map, BIA, FTA, Gap, Metrics)
│   │   ├── ImplementTab.tsx         # 7 sections (Response Plan, Architecture, Cost, Metrics, FTA+, Contingency, Roles)
│   │   ├── TestTab.tsx              # 5 sections (Test Summary, Drill, UAT, Comms, Maintenance)
│   │   ├── ServiceMap.tsx           # React Flow: 100+ Azure services, 7 connection types
│   │   └── FaultTree.tsx            # React Flow: IEC 61025 symbols + FMEA scoring
│   ├── Phase3BusinessContinuity.tsx # Tabbed: Planning, MBCO, Operations, Maintenance
│   ├── AppSelector.tsx              # Multi-solution chip switcher
│   ├── GuidedTour.tsx               # Branded Joyride walkthrough (7 steps)
│   ├── HelpIcon.tsx                 # Contextual "?" help popovers
│   ├── Personas.tsx                 # RACI role-task matrix (8 roles x 29 tasks)
│   ├── Glossary.tsx                 # Searchable BCDR terms (29 terms)
│   ├── References.tsx               # Categorized Microsoft docs (24 links)
│   └── Settings.tsx                 # Org, workload, contact, date format, currency
├── context/
│   ├── AppContext.tsx               # Multi-solution registry + switching
│   └── WorkbenchContext.tsx         # Per-solution localStorage persistence
├── hooks/
│   └── useWorkbenchData.ts          # Hook: persistent editable state with reset
└── utils/
    ├── azureCatalog.ts              # 100+ Azure services across 14 categories
    ├── criticality.ts               # Shared criticality → color mapping
    ├── csvExport.ts                 # CSV generation utilities
    ├── exportAllCsv.ts              # Multi-sheet CSV export
    ├── designTokens.ts              # Unified brand color palette
    ├── generateBcpPdf.ts            # ISO 22301 PDF generator (HTML → Print)
    └── generateBcpDocx.ts           # ISO 22301 Word generator (docx library)
```

## Key Conventions

### Styling
- **ALL styling uses FluentUI `makeStyles` (Griffel)** — no CSS modules, no Tailwind, no styled-components
- Use `shorthands` from `@fluentui/react-components` for border, padding, margin, borderRadius
- Brand gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Design tokens defined in `utils/designTokens.ts`

### Data Patterns
- All editable data uses `useWorkbenchData(key, defaultValue)` hook
- Data persists to localStorage with prefix `abcg_{solutionId}_{key}`
- Each solution gets fully isolated data (Phase 1, 2, and 3)
- Default data is always provided so pages are never empty on first load
- Tables use click-to-edit cells, add/delete rows, reset to defaults, CSV export

### Component Patterns
- Function components with TypeScript only
- Module-level data constants for default/example data
- HTML `<table>` with `makeStyles` styling (no DataGrid)
- FluentUI components: Accordion, Badge, Button, Card, Checkbox, Input, Select, TabList, Tab, Dialog
- React Flow for visual diagrams (Service Map, Fault Tree)
- Recharts for charts (BarChart, RadarChart, PieChart)

### Multi-Solution Architecture
- `AppContext` manages solution registry in `abcg_app-registry`
- `WorkbenchContext` prefixes all keys with current solution ID
- Switching solutions uses React `key` prop on content wrapper to force remount
- `AppSelector` chip bar shown on all pages except Home
- Export/import scoped to current solution

### Export Patterns
- **PDF**: Generates full HTML document, opens via Blob URL, triggers `print()`
- **DOCX**: Uses `docx` library with `Packer.toBlob()` + `file-saver`
- **CSV**: Uses custom `csvExport.ts` with BOM for Excel compatibility
- **PNG**: Uses `html-to-image` `toPng()` on React Flow viewport
- **JSON**: Exports all localStorage keys for current solution

### Tour / Onboarding
- React Joyride v3 with custom `tooltipComponent`
- Steps use `skipBeacon: true` to prevent beacon dots
- Event handler catches `STATUS.FINISHED`, `STATUS.SKIPPED`, and `ACTIONS.CLOSE`
- Tour state lifted to App.tsx — single Joyride instance

## Content Source

Based on the Azure Business Continuity Guide Excel workbook (v0.55):
- `getting-started.md` — detailed Excel section descriptions
- `README.md` — project overview with screenshots

## Important Files

| File | Purpose |
|------|---------|
| `web-app/src/App.tsx` | Main app shell — modify to add pages, sidebar items, toolbar buttons |
| `web-app/src/hooks/useWorkbenchData.ts` | THE hook for persistent editable data |
| `web-app/src/context/AppContext.tsx` | Add/rename/delete solutions, get current solution |
| `web-app/src/utils/generateBcpPdf.ts` | ISO 22301 PDF — update when adding new data sections |
| `web-app/src/utils/generateBcpDocx.ts` | ISO 22301 Word — must match PDF section-for-section |
| `web-app/src/utils/azureCatalog.ts` | Azure service list — add new services here |
| `web-app/src/utils/criticality.ts` | Criticality levels and colors — shared across all phases |

## Common Tasks

### Add a new page
1. Create component in `web-app/src/components/NewPage.tsx`
2. Add to `TabValue` type, `PAGE_LABELS`, and `navItems` in `App.tsx`
3. Add to `renderContent()` switch in `App.tsx`
4. Import the component in `App.tsx`

### Add editable data to a section
1. Define interface and default data as module-level constants
2. Use `useWorkbenchData('key', defaultData)` in the component
3. Create edit helpers (e.g. `updateField`, `addRow`, `deleteRow`)
4. Use click-to-edit cells with `editingCell` state pattern
5. Add CSV export button
6. Update `generateBcpPdf.ts` AND `generateBcpDocx.ts` with the new data

### Add a visual diagram
1. Create component using React Flow (`useNodesState`, `useEdgesState`)
2. Define custom node with `Handle` components for connections
3. Add toolbar for adding nodes, connection settings
4. Use `toPng` from `html-to-image` for PNG export
5. Persist data with `useWorkbenchData`
