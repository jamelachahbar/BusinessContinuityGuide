# PRD: Interactive Workbench with Export Functionality

## Objective
Transform the ABC Guide web app from a static content viewer into an interactive workbench where users can:
1. **Edit and fill in** all templates with their own data (criticality model, BIA, RACI, requirements, etc.)
2. **Persist data** in browser localStorage so work is saved across sessions
3. **Export plans** to downloadable formats (PDF report and JSON data backup)

## Architecture Decisions
- **State Management:** React `useState` + `useReducer` for form state; localStorage for persistence
- **Export PDF:** Use browser `window.print()` with a dedicated print stylesheet for clean PDF output (no heavy dependencies)
- **Export JSON:** Native `JSON.stringify` + `Blob` download for data backup/restore
- **No backend:** All data stays in the browser (localStorage)
- **Editable tables:** Contenteditable cells or controlled inputs in table cells for inline editing
- **Per-page state:** Each phase manages its own editable state; a shared context provides save/load/export utilities

## Tasks

### Task-010: Create workbench infrastructure — state context, save/load, export utilities
**Description:** Build the foundational infrastructure for the interactive workbench:
1. Create a `WorkbenchContext` React context with:
   - `saveData(key, data)` — saves JSON to localStorage under a namespaced key
   - `loadData(key)` — loads JSON from localStorage
   - `exportJSON()` — exports all workbench data as a single JSON file download
   - `importJSON(file)` — imports a previously exported JSON file
   - `clearAll()` — clears all workbench data with confirmation
2. Create a `WorkbenchProvider` component that wraps the app
3. Add an export toolbar/bar to App.tsx — a persistent "Workbench" toolbar at the top or bottom with buttons:
   - "Export PDF" (triggers print with print CSS)
   - "Export Data" (downloads JSON)
   - "Import Data" (file upload)
   - "Clear Data" (with confirmation dialog)
4. Add a print stylesheet that hides sidebar, toolbar, and navigation; shows clean formatted content
5. Add visual indicator when data has unsaved changes

**Acceptance Criteria:**
- WorkbenchContext created with save/load/export/import/clear functions
- Export toolbar visible in app with working buttons
- JSON export downloads a file with all workbench data
- JSON import restores data from a previously exported file
- Print/PDF export shows clean formatted content
- `npm run build` succeeds

### Task-011: Make Phase 1 templates editable — Criticality Model & Business Commitment Model
**Description:** Transform Phase 1 from read-only display to an interactive workbench:
1. **Criticality Model:** Users can edit tier assignments, add/remove rows, edit business view descriptions and financial thresholds. Each row has an edit button that opens inline editing. Add a "Reset to Default" button.
2. **Business Commitment Model:** Make the ✅/❌/➖ indicators clickable to cycle through states (Required → Not Required → As Required → Required). Users click a cell to change the commitment status. Add text inputs for free-text cells (like SLA percentages, support hours). Custom rows can be added.
3. **RACI Matrix:** Make RACI cells clickable to cycle through R/A/C/I/blank. Users can add new task rows and edit role names.
4. **Application Requirements:** Users can add new requirements, mark status (Required/Not Required/N/A), and add notes.
5. **All editable data persists to localStorage** via WorkbenchContext.
6. **Each section has a "Reset to Default" button** to restore original example data.

**Acceptance Criteria:**
- Criticality Model rows can be edited inline (tier, criticality, description, financial, impact columns)
- Business Commitment Model cells are clickable to cycle ✅/❌/➖
- RACI cells are clickable to cycle R/A/C/I/blank
- Application Requirements can be added/edited
- Data persists after page refresh
- Reset to Default works per section
- `npm run build` succeeds

### Task-012: Make Phase 2 templates editable — BIA, Gap Assessment, Cost Comparison
**Description:** Make Phase 2 an interactive workbench:
1. **Requirements & ADR:** Editable requirements list — users can add rows, change status (✅/❌/N/A), edit ADR notes
2. **Service Map:** Users can add/remove service components and define dependencies
3. **BIA:** Editable metrics table — users fill in their own SLO, RTO, RPO, MTD, impact cost values
4. **Architecture Gap Assessment:** Editable per-component rows — users can add components, edit HA/DR config, change gap status (Met/Partial/Gap)
5. **Cost Comparison:** Editable cost table — users input current and +BCDR costs per component, totals auto-calculate
6. **Response Plan by Scope:** Editable response details per impact scope level
7. **Role Assignment:** Editable table for assigning people to roles with contact fields
8. **Test Summary:** Editable test schedule with date fields and status
9. **Outage Communication Plan:** Editable questions/answers template
10. **Maintain App Continuity:** Editable maintenance schedule

All editable data persists via WorkbenchContext.

**Acceptance Criteria:**
- BIA metrics can be edited inline with the values persisting
- Gap Assessment status is clickable to cycle Met/Partial/Gap
- Cost Comparison calculates totals automatically
- Users can add new rows to tables
- Data persists after page refresh
- `npm run build` succeeds

### Task-013: Make Phase 3 templates editable — Risk Matrix, MBCO, Dashboard
**Description:** Make Phase 3 an interactive workbench:
1. **BCP Document:** Interactive checklist — users can check/uncheck items, add custom items, mark status
2. **Business Risk Assessment:** Users can add their own risk scenarios with editable impact (1-5) and probability (1-5) scores. Risk score and level auto-calculate. The 5×5 matrix highlights cells corresponding to user-entered risks.
3. **MBCO Recovery Order:** Editable table — users add applications, set recovery order, define dependencies, select criticality from dropdown
4. **Critical Function Calendar:** Users can add/edit business critical dates and events
5. **BIA Portfolio Summary:** Auto-populated from Phase 2 BIA data if available, otherwise editable
6. **BCDR Dashboard:** Summary cards use live data from other phases where available
7. **Maintain BC:** Editable maintenance schedule with date fields

All editable data persists via WorkbenchContext.

**Acceptance Criteria:**
- Risk scenarios can be added with auto-calculated scores
- MBCO table rows can be added/edited/reordered
- BCP checklist items are checkable
- Dashboard pulls data from other phases where possible
- Data persists after page refresh
- `npm run build` succeeds

### Task-014: Add CSV export buttons to Phase 1 Prepare tabs
**Description:** Add a "Download CSV" button to each editable tab in Phase 1 Prepare so users can export their data. Each tab with data should have a CSV export button next to the Reset button in the section header. Use the existing `downloadCsv` utility from `utils/csvExport.ts`.

Tabs to add export to:
1. **Criticality Model** — export columns: Tier, Criticality, Business View, Financial, Brand, Customer Trust, Customer Exp, Injury Risk, Employee Prod
2. **Business Commitment Model** — each BCM sub-section accordion gets its own export button, exporting the BCM headers + rows
3. **Fault Model** — export columns: Failure Type, Description, Tier 1 Strategy, Tier 2 Strategy, Tier 3–5 Strategy
4. **RACI Matrix** — export columns: Task + all role names as headers, with R/A/C/I values
5. **Requirements** — export columns: Category, Requirement, Priority
6. **Test Plans** — export columns: Test Type, Description, Typical Frequency

Use the `ArrowDownload20Regular` icon from `@fluentui/react-icons`.

**Acceptance Criteria:**
- Each editable tab has a CSV download button in the section header area
- Each BCM sub-section has its own CSV export button
- CSV files open correctly in Excel with proper encoding (BOM)
- Downloaded filenames include the section name (e.g., `phase1-criticality-model.csv`)
- `npm run build` succeeds

### Task-015: Final build, commit, and merge to main

### Task-016: Dynamic impact columns for Criticality Model
**Description:** Make the Criticality Model's impact assessment columns (currently hardcoded as Brand, Customer Trust, Customer Exp, Injury Risk, Employee Prod) fully dynamic:
1. Store impact column names in a persisted array via `useWorkbenchData('phase1_impactColumns', defaultImpactColumns)` where defaults are `['Brand', 'Customer Trust', 'Customer Exp', 'Injury Risk', 'Employee Prod']`
2. Change `CriticalityRow` interface: replace the individual boolean fields (`brand`, `trust`, `exp`, `injury`, `prod`) with `impacts: boolean[]` array matching the column order
3. Add UI above the table to manage columns: editable column name headers (click-to-edit), add column button, delete column button on each header
4. When a column is added, extend all existing rows' `impacts` array with `false`
5. When a column is removed, splice all rows' `impacts` array at that index
6. Update the CSV export to use dynamic column names
7. Update default data to use the new `impacts: boolean[]` format
8. The Tier and Criticality names remain editable per-row as they already are

**Acceptance Criteria:**
- Impact column headers are click-to-edit to rename
- Users can add new impact columns and remove existing ones
- All row data stays in sync when columns change
- CSV export reflects dynamic column names
- Data persists after refresh
- `npm run build` succeeds

### Task-017: Excel export for RACI Matrix with cell formatting
**Description:** Add Excel (.xlsx) export for the RACI Matrix that preserves the R/A/C/I cell coloring:
1. Install `exceljs` package
2. Create `utils/excelExport.ts` with a function to generate XLSX with colored cells
3. RACI colors: R=#003366 (white text), A=#336699 (white text), C=#6699CC (white text), I=#99CCFF (dark text)
4. Add "Export Excel" button next to the existing "Export CSV" button in the RACI section header
5. The Excel file should have: bold headers, colored RACI cells, auto-width columns, a title row

**Acceptance Criteria:**
- RACI tab has an "Export Excel" button next to Export CSV and Reset
- Downloaded .xlsx file opens in Excel with colored R/A/C/I cells
- Column widths are reasonable
- `npm run build` succeeds

### Task-018: Plan Focus filter with visual dimming and badges
**Description:** Add a Plan Focus feature that lets users specify whether they're building a DR-only, BC-only, or full BCDR plan. Sections/tabs not relevant to their focus get visually dimmed with an info badge.

Implementation:
1. Add `planFocus` field to `AppSettings` in Settings.tsx with values: `'bcdr'` (default), `'dr'`, `'bc'`
2. Add Plan Focus dropdown to Settings page under a new "Plan Focus" card
3. Create a `planFocusMap` that tags every page and sub-tab with relevance:
   - **Phase 1 tabs**: concepts=bcdr, criticality=bcdr, bcm=bcdr, faultModel=dr, raci=bcdr, requirements=bcdr, testPlans=bcdr
   - **Phase 2** (whole phase): dr
   - **Phase 3** (whole phase): bc
   - **Top-level pages**: home=bcdr, personas=bcdr, glossary=bcdr, references=bcdr, settings=bcdr
4. In the sidebar (App.tsx), add a small badge per nav item showing DR/BC/BCDR and dim non-relevant items with `opacity: 0.45`
5. In Phase 1 TabList, add badges after tab names and dim irrelevant tabs
6. When a dimmed section/tab is opened, show a subtle info bar at the top: "This section is primarily for [Business Continuity/Disaster Recovery] planning"
7. Plan focus persisted via existing `useWorkbenchData('settings', ...)` in Settings

**Acceptance Criteria:**
- Settings page has Plan Focus dropdown (Full BCDR / DR Only / BC Only)
- Sidebar nav items show DR/BC/BCDR badges and dim when not in scope
- Phase 1 tabs show badges and dim when not in scope
- Info banner shown on dimmed sections when visited
- Default is Full BCDR (no dimming)
- `npm run build` succeeds

### Task-019: Final build, commit, and merge to main
**Description:** Final verification and merge of the interactive workbench feature.
**Acceptance Criteria:**
- All editable features work correctly across all phases
- Data persists in localStorage
- JSON export/import works correctly
- PDF print is clean and formatted
- CSV export works for Phase 1 tabs
- Build succeeds with no errors
- Branch merged into main
