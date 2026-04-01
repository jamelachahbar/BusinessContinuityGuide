import { useState, useCallback, useMemo } from 'react'
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
})

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
   Custom Node component — modern card with handles
   ═══════════════════════════════════════════════════════ */

function ServiceNode({ data }: NodeProps) {
  const cat = NODE_CATEGORIES[data.category as string] ?? NODE_CATEGORIES.Compute
  return (
    <div
      style={{
        background: cat.bg,
        border: `2px solid ${cat.border}`,
        borderRadius: '10px',
        minWidth: '170px',
        maxWidth: '220px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Colored header bar */}
      <div
        style={{
          background: cat.accent,
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {data.category as string}
        </span>
      </div>
      {/* Label */}
      <div style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 600, color: cat.text, lineHeight: '1.3' }}>
        {data.label as string}
      </div>
      {/* Handles */}
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
  return {
    id,
    type: 'service',
    data: { label, category },
    position: { x, y },
  }
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
  { id: 'e-fd-as',  source: 'frontDoor',  target: 'appService', animated: true, style: { stroke: '#4285F4' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#4285F4' } },
  { id: 'e-as-sql', source: 'appService', target: 'azureSql', label: 'queries', style: { stroke: '#764ba2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#764ba2' } },
  { id: 'e-as-rd',  source: 'appService', target: 'redis', label: 'cache', style: { stroke: '#764ba2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#764ba2' } },
  { id: 'e-as-sb',  source: 'appService', target: 'serviceBus', label: 'events', style: { stroke: '#764ba2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#764ba2' } },
  { id: 'e-sb-fn',  source: 'serviceBus', target: 'functions', animated: true, style: { stroke: '#d6a206' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#d6a206' } },
  { id: 'e-fn-sql', source: 'functions',  target: 'azureSql',  style: { stroke: '#764ba2', strokeDasharray: '5 5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#764ba2' } },
  { id: 'e-fn-st',  source: 'functions',  target: 'storage', label: 'blobs', style: { stroke: '#764ba2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#764ba2' } },
  { id: 'e-ei-as',  source: 'entraId',    target: 'appService', label: 'auth', style: { stroke: '#1a237e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#1a237e' } },
  { id: 'e-ei-kv',  source: 'entraId',    target: 'keyVault', style: { stroke: '#1a237e', strokeDasharray: '5 5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#1a237e' } },
  { id: 'e-as-kv',  source: 'appService', target: 'keyVault', label: 'secrets', style: { stroke: '#dc3545', strokeDasharray: '5 5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#dc3545' } },
  { id: 'e-as-ai',  source: 'appService', target: 'appInsights', label: 'telemetry', animated: true, style: { stroke: '#17a2b8' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#17a2b8' } },
  { id: 'e-fn-ai',  source: 'functions',  target: 'appInsights', animated: true, style: { stroke: '#17a2b8' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#17a2b8' } },
]

const defaultEdgeOptions = {
  style: { strokeWidth: 2, stroke: '#667eea' },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#667eea' },
}

/* ═══════════════════════════════════════════════════════
   ServiceMap component
   ═══════════════════════════════════════════════════════ */

export default function ServiceMap() {
  const styles = useStyles()
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges)
  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState('Compute')

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  )

  const addNode = useCallback(() => {
    if (!newName.trim()) return
    const id = `svc-${Date.now()}`
    const x = 200 + Math.random() * 400
    const y = 150 + Math.random() * 200
    setNodes((nds) => [...nds, makeNode(id, newName.trim(), newCat, x, y)])
    setNewName('')
  }, [newName, newCat, setNodes])

  const removeNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter(n => n.id !== nodeId))
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId))
  }, [setNodes, setEdges])

  const resetMap = useCallback(() => {
    setNodes(defaultNodes)
    setEdges(defaultEdges)
  }, [setNodes, setEdges])

  // Build dependency table from edges for CSV export
  const dependencyTable = useMemo(() => {
    return edges.map(e => {
      const src = nodes.find(n => n.id === e.source)
      const tgt = nodes.find(n => n.id === e.target)
      return {
        Source: (src?.data.label as string) ?? e.source,
        'Source Category': (src?.data.category as string) ?? '',
        Target: (tgt?.data.label as string) ?? e.target,
        'Target Category': (tgt?.data.category as string) ?? '',
        'Connection Type': (e.label as string) ?? 'dependency',
      }
    })
  }, [edges, nodes])

  const exportDeps = () => downloadCsv('service_map_dependencies.csv', objectsToCsvSheet('Dependencies', dependencyTable))

  return (
    <div>
      {/* Legend */}
      <div className={styles.legend}>
        {categoryOptions.map(cat => (
          <div key={cat} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: NODE_CATEGORIES[cat].accent }} />
            {cat}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Service Name</span>
          <Input
            size="small"
            placeholder="e.g. Azure Cosmos DB"
            value={newName}
            onChange={(_, d) => setNewName(d.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addNode() }}
            style={{ minWidth: '200px' }}
          />
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Category</span>
          <Select size="small" value={newCat} onChange={(_, d) => setNewCat(d.value)}>
            {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <Button icon={<Add20Regular />} size="small" appearance="primary" onClick={addNode} disabled={!newName.trim()}>
          Add Service
        </Button>
        <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetMap}>
          Reset
        </Button>
        <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportDeps}>
          Export Dependencies
        </Button>
      </div>

      {/* Node chips for quick removal */}
      {nodes.length > 0 && (
        <div className={styles.chipBar}>
          {nodes.map(n => {
            const cat = NODE_CATEGORIES[(n.data.category as string)] ?? NODE_CATEGORIES.Compute
            return (
              <span
                key={n.id}
                className={styles.chip}
                style={{ backgroundColor: cat.accent + '15', color: cat.accent, border: `1px solid ${cat.accent}40` }}
                onClick={() => removeNode(n.id)}
                title={`Click to remove ${n.data.label as string}`}
              >
                {n.data.label as string}
                <Dismiss12Regular style={{ fontSize: '10px' }} />
              </span>
            )
          })}
        </div>
      )}

      {/* Dependency count */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        <Badge appearance="outline" color="brand" size="small">{nodes.length} services</Badge>
        <Badge appearance="outline" color="informative" size="small">{edges.length} connections</Badge>
      </div>

      {/* React Flow canvas */}
      <div className={styles.flowContainer}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          attributionPosition="bottom-left"
          connectionLineStyle={{ strokeWidth: 2, stroke: '#667eea' }}
          snapToGrid
          snapGrid={[16, 16]}
        >
          <Controls />
          <Background gap={16} size={1} color="#e2e8f0" />
          <MiniMap
            nodeColor={(n) => {
              const cat = NODE_CATEGORIES[(n.data?.category as string)] ?? NODE_CATEGORIES.Compute
              return cat.accent
            }}
            maskColor="rgba(248, 249, 250, 0.85)"
            style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
        </ReactFlow>
      </div>

      <div className={styles.note}>
        <strong>How to use:</strong> Add services with the form above. Drag nodes to arrange your architecture.
        Connect services by dragging from any colored handle (top/bottom/left/right) to another node's handle —
        arrows show dependency direction. Click a chip above to remove a service. The mini-map in the bottom-right
        shows an overview. Use Export Dependencies to download the connection table as CSV.
      </div>
    </div>
  )
}
