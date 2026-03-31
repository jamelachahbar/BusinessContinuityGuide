# PRD: UI Improvements & Complete Excel Worksheet Sections

## Objective
Improve the web UI of the Azure Business Continuity Guide and incorporate ALL sections from the original Excel worksheet that are currently missing or incomplete. Start from the existing feature branch code and enhance it.

## Tasks

### Task-001: Bootstrap project from feature branch
**Description:** Create a new branch `feature/ui-improvements` from main, merge in the existing feature branch code, install dependencies, and verify the app builds.
**Acceptance Criteria:**
- New branch `feature/ui-improvements` created from main
- Feature branch code merged in
- `npm install` succeeds
- `npm run build` succeeds
- App runs with `npm run dev`

### Task-002: Improve UI layout and responsive design
**Description:** Enhance the overall UI with better responsive design, improved sidebar (collapsible on mobile), better typography, scroll-to-top behavior, and breadcrumb navigation. Add a sticky header with app title when scrolling.
**Acceptance Criteria:**
- Sidebar collapses on screens < 768px (hamburger menu)
- Main content area scrolls independently
- Smooth page transitions
- Better spacing and visual hierarchy
- `npm run build` succeeds

### Task-003: Enhance Phase 1 with complete Business Commitment Model sub-sections
**Description:** The Business Commitment Model in Phase 1 currently shows a single card. Expand it into 7 detailed expandable sub-sections matching the Excel: General Requirements, Availability Requirements, Recoverability Requirements, Deployment Requirements, Monitoring Requirements, Security Control Requirements, Validation & Testing Requirements. Each sub-section should have detailed content from `getting-started.md`.
**Acceptance Criteria:**
- Business Commitment Model card replaced with expandable accordion containing 7 sub-sections
- Each sub-section has detailed content matching the Excel worksheet descriptions
- Content sourced from getting-started.md descriptions
- `npm run build` succeeds

### Task-004: Enhance Phase 2 with complete detailed content
**Description:** Add richer content to all Phase 2 sections. Add proper descriptions from `getting-started.md` for each card. Include visual indicators for the Assess → Implement → Test workflow. Add helpful notes and links (e.g., mention Application Insights, VM Insights for Service Map). Ensure all sections from the Excel are represented.
**Acceptance Criteria:**
- All 17 sections from Excel Phase 2 are present with detailed descriptions
- Getting-started.md content incorporated
- Links to relevant Microsoft documentation included
- Visual workflow indicators enhanced
- `npm run build` succeeds

### Task-005: Enhance Phase 3 with complete detailed content
**Description:** Add richer content to Phase 3. Ensure all 7 sections are complete: BCP Document, Business Risk, MBCO Planning, Application Recovery Order, Business Critical Function Calendar, BIA Portfolio Summary, BCDR Dashboard, Maintain Business Continuity. Add the risk formula visualization and detailed content.
**Acceptance Criteria:**
- All Phase 3 sections have complete content from getting-started.md
- Risk matrix visualization is detailed
- MBCO planning section is comprehensive
- `npm run build` succeeds

### Task-006: Add Personas page
**Description:** The Excel workbook has a Personas section showing BCDR by Role and Task. Add a new Personas page/tab to the sidebar navigation. Include roles like Application Owner, Architects, Operations, etc. and map them to the tasks they're responsible for across all phases.
**Acceptance Criteria:**
- New "Personas" nav item in sidebar
- Personas page with role-based task mapping
- Visual representation (table or cards) of roles and responsibilities
- Links/references to relevant phase sections
- `npm run build` succeeds

### Task-007: Add Glossary page
**Description:** Add a Glossary page with searchable BCDR terminology. Include key terms like RTO, RPO, MTD, MBCO, SLA, BIA, BCP, etc. with clear definitions.
**Acceptance Criteria:**
- New "Glossary" nav item in sidebar
- Searchable/filterable list of BCDR terms
- Clear definitions for each term
- Alphabetical organization
- `npm run build` succeeds

### Task-008: Add References page
**Description:** Add a References page with links to external Microsoft documentation and resources mentioned throughout the guide.
**Acceptance Criteria:**
- New "References" nav item in sidebar
- Categorized list of external links
- Links to Azure documentation, CAF, WAF resources
- `npm run build` succeeds

### Task-009: Final polish, build verification, and merge
**Description:** Final UI polish pass, ensure consistent styling across all pages, verify build succeeds, commit all changes, and merge into main.
**Acceptance Criteria:**
- All pages have consistent styling
- `npm run build` succeeds with no errors
- All changes committed with clear messages
- Branch merged into main
- No regressions in existing functionality
