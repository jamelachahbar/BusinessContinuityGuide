import { useState, useCallback, useMemo, useRef } from 'react'
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type NodeProps,
  type Node,
  type Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { toPng } from 'html-to-image'
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Input,
  Select,
  Badge,
} from '@fluentui/react-components'
import {
  Add20Regular,
  ArrowReset20Regular,
  Dismiss12Regular,
  ArrowDownload20Regular,
  Image20Regular,
} from '@fluentui/react-icons'
import { downloadCsv, objectsToCsvSheet } from '../../utils/csvExport'

/* ═══════════════════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════════════════ */

const useStyles = makeStyles({
  flowContainer: {
    height: '600px',
    ...shorthands.borderRadius('12px'),
    ...shorthands.border('1px', 'solid', '#e2e8f0'),
    marginBottom: '16px',
    backgroundColor: '#fafbfc',
    overflow: 'hidden',
  },
  toolbar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: tokens.colorNeutralForeground3,
  },
  chipBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '12px',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    ...shorthands.padding('4px', '10px'),
    ...shorthands.borderRadius('20px'),
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transitionProperty: 'opacity',
    transitionDuration: '0.15s',
    ':hover': { opacity: 0.8 },
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '12px',
    ...shorthands.padding('10px', '14px'),
    backgroundColor: '#f1f5f9',
    ...shorthands.borderRadius('8px'),
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
  legendDot: {
    width: '10px',
    height: '10px',
    ...shorthands.borderRadius('3px'),
    display: 'inline-block',
  },
  note: {
    ...shorthands.padding('12px', '16px'),
    backgroundColor: '#f1f5f9',
    ...shorthands.borderRadius('8px'),
    marginTop: '12px',
    fontSize: '13px',
    lineHeight: '1.5',
    color: tokens.colorNeutralForeground3,
  },
  /* Connection config panel */
  connPanel: {
    ...shorthands.padding('14px', '16px'),
    backgroundColor: '#f8f9fa',
    ...shorthands.border('1px', 'solid', '#e2e8f0'),
    ...shorthands.borderRadius('10px'),
    marginBottom: '12px',
  },
  connTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '10px',
  },
  connRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  /* Edge legend */
  edgeLegend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '12px',
    ...shorthands.padding('8px', '14px'),
    backgroundColor: '#fff',
    ...shorthands.border('1px', 'solid', '#e2e8f0'),
    ...shorthands.borderRadius('8px'),
  },
})

/* ═══════════════════════════════════════════════════════
   Connection types
   ═══════════════════════════════════════════════════════ */

const CONNECTION_TYPES = {
  dependency:   { label: 'Dependency',    color: '#764ba2', dash: false,  animated: false },
  'data-flow':  { label: 'Data Flow',     color: '#4285F4', dash: false,  animated: true },
  auth:         { label: 'Auth / Identity', color: '#1a237e', dash: true,  animated: false },
  monitoring:   { label: 'Monitoring',    color: '#17a2b8', dash: false,  animated: true },
  security:     { label: 'Security',      color: '#dc3545', dash: true,   animated: false },
  messaging:    { label: 'Messaging',     color: '#d6a206', dash: false,  animated: true },
  optional:     { label: 'Optional',      color: '#6c757d', dash: true,   animated: false },
} as const

type ConnType = keyof typeof CONNECTION_TYPES
const connTypeKeys = Object.keys(CONNECTION_TYPES) as ConnType[]

const DIRECTIONS = {
  'source-to-target': 'Source \u2192 Target',
  'target-to-source': 'Target \u2192 Source',
  'bidirectional': 'Bidirectional \u2194',
} as const

type Direction = keyof typeof DIRECTIONS

/* ═══════════════════════════════════════════════════════
   Node category colors
   ═══════════════════════════════════════════════════════ */

const NODE_CATEGORIES: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  Networking: { bg: '#ffffff', border: '#4285F4', text: '#1a202c', accent: '#4285F4' },
  Compute:    { bg: '#ffffff', border: '#764ba2', text: '#1a202c', accent: '#764ba2' },
  Data:       { bg: '#ffffff', border: '#28a745', text: '#1a202c', accent: '#28a745' },
  Cache:      { bg: '#ffffff', border: '#fd7e14', text: '#1a202c', accent: '#fd7e14' },
  Messaging:  { bg: '#ffffff', border: '#ffc107', text: '#1a202c', accent: '#d6a206' },
  Security:   { bg: '#ffffff', border: '#dc3545', text: '#1a202c', accent: '#dc3545' },
  Monitoring: { bg: '#ffffff', border: '#17a2b8', text: '#1a202c', accent: '#17a2b8' },
  Identity:   { bg: '#ffffff', border: '#1a237e', text: '#1a202c', accent: '#1a237e' },
  Storage:    { bg: '#ffffff', border: '#20c997', text: '#1a202c', accent: '#20c997' },
}

const categoryOptions = Object.keys(NODE_CATEGORIES)

/* ═══════════════════════════════════════════════════════
   Custom Node
   ═══════════════════════════════════════════════════════ */

function ServiceNode({ data }: NodeProps) {
  const cat = NODE_CATEGORIES[data.category as string] ?? NODE_CATEGORIES.Compute
  return (
    <div style={{
      background: cat.bg, border: `2px solid ${cat.border}`, borderRadius: '10px',
      minWidth: '170px', maxWidth: '220px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ background: cat.accent, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {data.category as string}
        </span>
      </div>
      <div style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 600, color: cat.text, lineHeight: '1.3' }}>
        {data.label as string}
      </div>
      <Handle type="target" position={Position.Top} style={{ background: cat.accent, width: 8, height: 8, border: '2px solid #fff' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: cat.accent, width: 8, height: 8, border: '2px solid #fff' }} />
      <Handle type="target" position={Position.Left} id="left" style={{ background: cat.accent, width: 8, height: 8, border: '2px solid #fff' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ background: cat.accent, width: 8, height: 8, border: '2px solid #fff' }} />
    </div>
  )
}

const nodeTypes = { service: ServiceNode }

/* ═══════════════════════════════════════════════════════
   Default data
   ═══════════════════════════════════════════════════════ */

function makeNode(id: string, label: string, category: string, x: number, y: number): Node {
  return { id, type: 'service', data: { label, category }, position: { x, y } }
}

function makeEdge(id: string, source: string, target: string, connType: ConnType, label: string, direction: Direction = 'source-to-target'): Edge {
  const cfg = CONNECTION_TYPES[connType]
  const edge: Edge = {
    id,
    source,
    target,
    label: label || undefined,
    animated: cfg.animated,
    style: { strokeWidth: 2, stroke: cfg.color, ...(cfg.dash ? { strokeDasharray: '6 3' } : {}) },
    data: { connType, direction, connLabel: label },
  }
  if (direction === 'source-to-target' || direction === 'bidirectional') {
    edge.markerEnd = { type: MarkerType.ArrowClosed, color: cfg.color }
  }
  if (direction === 'target-to-source' || direction === 'bidirectional') {
    edge.markerStart = { type: MarkerType.ArrowClosed, color: cfg.color }
  }
  return edge
}

const defaultNodes: Node[] = [
  makeNode('entraId',    'Microsoft Entra ID',     'Identity',   350, 0),
  makeNode('frontDoor',  'Azure Front Door',       'Networking',  20, 160),
  makeNode('appService', 'App Service (Web App)',   'Compute',    280, 160),
  makeNode('azureSql',   'Azure SQL Database',      'Data',       550, 50),
  makeNode('redis',      'Azure Cache for Redis',   'Cache',      550, 180),
  makeNode('serviceBus', 'Azure Service Bus',       'Messaging',  550, 310),
  makeNode('functions',  'Azure Functions',         'Compute',    800, 310),
  makeNode('keyVault',   'Azure Key Vault',         'Security',    60, 350),
  makeNode('storage',    'Storage Account',         'Storage',    800, 440),
  makeNode('appInsights','Application Insights',    'Monitoring',  60, 480),
]

const defaultEdges: Edge[] = [
  makeEdge('e-fd-as',  'frontDoor',  'appService', 'data-flow',  'traffic'),
  makeEdge('e-as-sql', 'appService', 'azureSql',   'dependency', 'queries'),
  makeEdge('e-as-rd',  'appService', 'redis',      'dependency', 'cache'),
  makeEdge('e-as-sb',  'appService', 'serviceBus', 'messaging',  'events'),
  makeEdge('e-sb-fn',  'serviceBus', 'functions',  'messaging',  'trigger'),
  makeEdge('e-fn-sql', 'functions',  'azureSql',   'dependency', 'writes'),
  makeEdge('e-fn-st',  'functions',  'storage',    'dependency', 'blobs'),
  makeEdge('e-ei-as',  'entraId',    'appService', 'auth',       'auth'),
  makeEdge('e-ei-kv',  'entraId',    'keyVault',   'auth',       ''),
  makeEdge('e-as-kv',  'appService', 'keyVault',   'security',   'secrets'),
  makeEdge('e-as-ai',  'appService', 'appInsights','monitoring', 'telemetry'),
  makeEdge('e-fn-ai',  'functions',  'appInsights','monitoring', ''),
]

/* ═══════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════ */

export default function ServiceMap() {
  const styles = useStyles()
  const flowRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges)

  /* ── Add node state ── */
  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState('Compute')

  /* ── Connection config (applied to next connection made) ── */
  const [connType, setConnType] = useState<ConnType>('dependency')
  const [connLabel, setConnLabel] = useState('')
  const [connDir, setConnDir] = useState<Direction>('source-to-target')

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return
      const cfg = CONNECTION_TYPES[connType]
      const newEdge: Edge = {
        id: `e-${Date.now()}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle ?? undefined,
        targetHandle: params.targetHandle ?? undefined,
        label: connLabel || undefined,
        animated: cfg.animated,
        style: { strokeWidth: 2, stroke: cfg.color, ...(cfg.dash ? { strokeDasharray: '6 3' } : {}) },
        data: { connType, direction: connDir, connLabel },
        markerEnd: (connDir === 'source-to-target' || connDir === 'bidirectional')
          ? { type: MarkerType.ArrowClosed, color: cfg.color } : undefined,
        markerStart: (connDir === 'target-to-source' || connDir === 'bidirectional')
          ? { type: MarkerType.ArrowClosed, color: cfg.color } : undefined,
      }
      setEdges((eds) => addEdge(newEdge, eds))
      setConnLabel('')
    },
    [setEdges, connType, connLabel, connDir],
  )

  const addNode = useCallback(() => {
    if (!newName.trim()) return
    setNodes((nds) => [...nds, makeNode(`svc-${Date.now()}`, newName.trim(), newCat, 200 + Math.random() * 400, 150 + Math.random() * 200)])
    setNewName('')
  }, [newName, newCat, setNodes])

  const removeNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter(n => n.id !== nodeId))
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId))
  }, [setNodes, setEdges])

  const resetMap = useCallback(() => { setNodes(defaultNodes); setEdges(defaultEdges) }, [setNodes, setEdges])

  /* ── Exports ── */
  const dependencyTable = useMemo(() =>
    edges.map(e => {
      const src = nodes.find(n => n.id === e.source)
      const tgt = nodes.find(n => n.id === e.target)
      return {
        Source: (src?.data.label as string) ?? e.source,
        'Source Category': (src?.data.category as string) ?? '',
        Target: (tgt?.data.label as string) ?? e.target,
        'Target Category': (tgt?.data.category as string) ?? '',
        Label: (e.label as string) ?? '',
        Type: CONNECTION_TYPES[(e.data?.connType as ConnType)]?.label ?? 'Dependency',
        Direction: DIRECTIONS[(e.data?.direction as Direction)] ?? 'Source \u2192 Target',
      }
    }),
  [edges, nodes])

  const exportCsv = () => downloadCsv('service_map_dependencies.csv', objectsToCsvSheet('Dependencies', dependencyTable))

  const exportImage = useCallback(() => {
    if (!flowRef.current) return
    const el = flowRef.current.querySelector('.react-flow__viewport') as HTMLElement | null
    if (!el) return
    toPng(el, { backgroundColor: '#fafbfc', pixelRatio: 2 }).then((dataUrl) => {
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `service_map_${new Date().toISOString().slice(0, 10)}.png`
      a.click()
    })
  }, [])

  return (
    <div>
      {/* Node category legend */}
      <div className={styles.legend}>
        {categoryOptions.map(cat => (
          <div key={cat} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: NODE_CATEGORIES[cat].accent }} />
            {cat}
          </div>
        ))}
      </div>

      {/* Add node toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Service Name</span>
          <Input size="small" placeholder="e.g. Azure Cosmos DB" value={newName} onChange={(_, d) => setNewName(d.value)} onKeyDown={(e) => { if (e.key === 'Enter') addNode() }} style={{ minWidth: '180px' }} />
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Category</span>
          <Select size="small" value={newCat} onChange={(_, d) => setNewCat(d.value)}>
            {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <Button icon={<Add20Regular />} size="small" appearance="primary" onClick={addNode} disabled={!newName.trim()}>Add Service</Button>
        <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetMap}>Reset</Button>
        <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportCsv}>CSV</Button>
        <Button icon={<Image20Regular />} size="small" appearance="subtle" onClick={exportImage}>PNG</Button>
      </div>

      {/* Connection config panel */}
      <div className={styles.connPanel}>
        <div className={styles.connTitle}>Connection Settings (applied to next connection you draw)</div>
        <div className={styles.connRow}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Type</span>
            <Select size="small" value={connType} onChange={(_, d) => setConnType(d.value as ConnType)}>
              {connTypeKeys.map(k => <option key={k} value={k}>{CONNECTION_TYPES[k].label}</option>)}
            </Select>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Label</span>
            <Input size="small" placeholder="e.g. queries, auth" value={connLabel} onChange={(_, d) => setConnLabel(d.value)} style={{ minWidth: '140px' }} />
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Direction</span>
            <Select size="small" value={connDir} onChange={(_, d) => setConnDir(d.value as Direction)}>
              {(Object.keys(DIRECTIONS) as Direction[]).map(k => <option key={k} value={k}>{DIRECTIONS[k]}</option>)}
            </Select>
          </div>
        </div>
      </div>

      {/* Connection type legend */}
      <div className={styles.edgeLegend}>
        {connTypeKeys.map(k => {
          const cfg = CONNECTION_TYPES[k]
          return (
            <div key={k} className={styles.legendItem}>
              <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke={cfg.color} strokeWidth="2" strokeDasharray={cfg.dash ? '4 2' : 'none'} /></svg>
              {cfg.label}
            </div>
          )
        })}
      </div>

      {/* Node chips */}
      {nodes.length > 0 && (
        <div className={styles.chipBar}>
          {nodes.map(n => {
            const cat = NODE_CATEGORIES[(n.data.category as string)] ?? NODE_CATEGORIES.Compute
            return (
              <span key={n.id} className={styles.chip} style={{ backgroundColor: cat.accent + '15', color: cat.accent, border: `1px solid ${cat.accent}40` }} onClick={() => removeNode(n.id)} title={`Remove ${n.data.label as string}`}>
                {n.data.label as string} <Dismiss12Regular style={{ fontSize: '10px' }} />
              </span>
            )
          })}
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        <Badge appearance="outline" color="brand" size="small">{nodes.length} services</Badge>
        <Badge appearance="outline" color="informative" size="small">{edges.length} connections</Badge>
      </div>

      {/* React Flow canvas */}
      <div className={styles.flowContainer} ref={flowRef}>
        <ReactFlow
          nodes={nodes} edges={edges}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView attributionPosition="bottom-left"
          connectionLineStyle={{ strokeWidth: 2, stroke: CONNECTION_TYPES[connType].color }}
          snapToGrid snapGrid={[16, 16]}
        >
          <Controls />
          <Background gap={16} size={1} color="#e2e8f0" />
          <MiniMap
            nodeColor={(n) => (NODE_CATEGORIES[(n.data?.category as string)] ?? NODE_CATEGORIES.Compute).accent}
            maskColor="rgba(248, 249, 250, 0.85)"
            style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
        </ReactFlow>
      </div>

      <div className={styles.note}>
        <strong>How to use:</strong> 1) Add services with the form. 2) Set connection type, label, and direction in the Connection Settings panel.
        3) Drag from any colored handle to another node to create that connection. Arrows show direction.
        Solid/dashed/animated lines distinguish connection types. Export as CSV (data) or PNG (image).
      </div>
    </div>
  )
}
