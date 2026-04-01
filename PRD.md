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

### Task-014: Final build, commit, and merge to main
**Description:** Final verification and merge of the interactive workbench feature.
**Acceptance Criteria:**
- All editable features work correctly across all phases
- Data persists in localStorage
- JSON export/import works correctly
- PDF print is clean and formatted
- Build succeeds with no errors
- Branch merged into main
