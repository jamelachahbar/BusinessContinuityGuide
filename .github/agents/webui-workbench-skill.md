# SKILL.md — Interactive Workbench Web UI

## Description

Build interactive web-based workbenches that transform Excel workbooks, templates, or structured content into modern React applications with editable tables, visual diagrams, multi-instance data isolation, guided tours, and professional document exports.

## When to Use

- Converting an Excel workbook into a web application
- Building a planning/assessment tool with editable templates
- Creating a dashboard with interactive data tables and charts
- Building a workbench that needs PDF/Word/CSV export
- Any project needing multi-instance data isolation (e.g., per-client, per-project)

## Architecture Pattern

```
src/
├── App.tsx                    # Shell: collapsible sidebar, toolbar, routing
├── components/
│   ├── Home.tsx               # Dashboard with progress tracking
│   ├── [Phase]Page.tsx        # Tabbed content pages
│   ├── [Feature]/
│   │   ├── [Section]Tab.tsx   # Sub-tab content with editable tables
│   │   ├── [Diagram].tsx      # React Flow visual diagrams
│   │   └── [Chart].tsx        # Recharts visualizations
│   ├── AppSelector.tsx        # Multi-instance switcher
│   ├── GuidedTour.tsx         # Onboarding walkthrough
│   ├── HelpIcon.tsx           # Contextual help popovers
│   └── Settings.tsx           # Configuration page
├── context/
│   ├── AppContext.tsx          # Instance registry + switching
│   └── WorkbenchContext.tsx    # Per-instance localStorage
├── hooks/
│   └── useWorkbenchData.ts    # Persistent state hook
└── utils/
    ├── catalog.ts             # Domain-specific catalog data
    ├── csvExport.ts           # CSV generation
    ├── designTokens.ts        # Color palette
    ├── generatePdf.ts         # HTML → Print PDF
    └── generateDocx.ts        # docx library → Word
```

## Tech Stack

| Library | Purpose | Install |
|---------|---------|---------|
| React 19 | UI framework | `npm create vite@latest -- --template react-ts` |
| FluentUI v9 | Components + styling | `npm i @fluentui/react-components @fluentui/react-icons` |
| React Flow 11 | Diagrams | `npm i reactflow` |
| Recharts 3 | Charts | `npm i recharts` |
| React Joyride 3 | Tour | `npm i react-joyride` |
| html-to-image | PNG export | `npm i html-to-image` |
| docx + file-saver | Word export | `npm i docx file-saver @types/file-saver` |

## Key Patterns

### 1. Persistent Editable Data

```tsx
// Hook: useWorkbenchData.ts
export function useWorkbenchData<T>(key: string, defaultValue: T) {
  const { saveData, loadData, storagePrefix } = useWorkbenchContext()
  const [value, setValue] = useState<T>(() => loadData(key, defaultValue))
  const setData = useCallback((v: T) => { setValue(v); saveData(key, v) }, [key])
  const reset = useCallback(() => { setValue(defaultValue); localStorage.removeItem(`${storagePrefix}${key}`) }, [key])
  return [value, setData, reset] as const
}

// Usage in component:
const [rows, setRows, resetRows] = useWorkbenchData('my-data', defaultRows)
```

### 2. Click-to-Edit Table Cells

```tsx
const [editingCell, setEditingCell] = useState<string | null>(null)

function editCell(key: string, value: string, onSave: (v: string) => void) {
  const isEditing = editingCell === key
  return (
    <td onClick={() => !isEditing && setEditingCell(key)} style={{ cursor: 'pointer' }}>
      {isEditing ? (
        <input autoFocus defaultValue={value}
          onBlur={(e) => { onSave(e.target.value); setEditingCell(null) }}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
        />
      ) : (value || '\u00A0')}
    </td>
  )
}
```

### 3. Multi-Instance Isolation

```tsx
// All localStorage keys prefixed with instance ID:
// abcg_{instanceId}_{key}

// Switching instances: use React key to force remount
<div key={currentInstance.id}>{renderContent()}</div>
```

### 4. React Flow Diagrams

```tsx
const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes)
const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges)

// Custom node with connection handles:
function CustomNode({ data }: NodeProps) {
  return (
    <div style={{ ... }}>
      {data.label}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
```

### 5. Collapsible Sidebar

- Expanded: 240px with icon + label + section headers
- Collapsed: 68px with icon only + tooltips
- Toggle button in header; bolt icon acts as expand trigger when collapsed

### 6. Guided Tour (React Joyride v3)

```tsx
// Custom tooltipComponent for branded look
// skipBeacon: true on all steps
// Handle: STATUS.FINISHED, STATUS.SKIPPED, ACTIONS.CLOSE
// State lifted to parent — single Joyride instance
```

### 7. PDF Export (HTML → Print)

```tsx
// Generate full HTML doc with embedded CSS
const html = `<!DOCTYPE html><html>...<style>${css}</style>...<body>${sections}</body></html>`
const blob = new Blob([html], { type: 'text/html' })
const url = URL.createObjectURL(blob)
window.open(url, '_blank')  // User prints to PDF
```

### 8. Word Export (docx library)

```tsx
import { Document, Packer, Paragraph, Table, ... } from 'docx'
import { saveAs } from 'file-saver'

const doc = new Document({
  styles: { default: { document: { run: { font: 'Segoe UI' } } } },
  sections: [{ properties: { page: { margin: { ... } } }, headers, footers, children }]
})
Packer.toBlob(doc).then(blob => saveAs(blob, 'report.docx'))
```

## Styling Rules

1. **ALL styling via FluentUI `makeStyles` (Griffel)** — never CSS modules or Tailwind
2. Use `shorthands` for border, padding, margin, borderRadius
3. Define brand colors in `designTokens.ts`
4. Responsive: use `@media (max-width: 768px)` in makeStyles
5. Tables: HTML `<table>` with makeStyles — no DataGrid component

## Checklist for New Workbench

- [ ] Set up Vite + React + TypeScript + FluentUI
- [ ] Create `AppContext` + `WorkbenchContext` + `useWorkbenchData`
- [ ] Build collapsible sidebar with navigation
- [ ] Create Home page with progress card
- [ ] Build content pages with tabbed sections
- [ ] Add editable tables with click-to-edit pattern
- [ ] Add React Flow diagrams (if applicable)
- [ ] Add Recharts visualizations (if applicable)
- [ ] Create Settings page
- [ ] Add multi-instance support via AppSelector
- [ ] Add PDF export (HTML → Print)
- [ ] Add Word export (docx library)
- [ ] Add CSV export per section + bulk
- [ ] Add guided tour (React Joyride)
- [ ] Add contextual help icons (HelpIcon component)
- [ ] Create professional README with screenshots
