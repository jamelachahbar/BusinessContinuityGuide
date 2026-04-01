import { useState, useCallback, useMemo, useRef } from 'react'
import ReactFlow, {
  Controls,
  Background,
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
  Delete20Regular,
  ArrowDownload20Regular,
  Image20Regular,
} from '@fluentui/react-icons'
import { useWorkbenchData } from '../../hooks/useWorkbenchData'
import { downloadCsv, objectsToCsvSheet } from '../../utils/csvExport'

/* ═══════════════════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════════════════ */

const useStyles = makeStyles({
  flowContainer: {
    height: '550px',
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
   Node types and colors
   ═══════════════════════════════════════════════════════ */

const NODE_TYPES_CONFIG = {
  'top-event':     { bg: '#dc3545', text: '#fff', label: 'Top Event' },
  'gate-or':       { bg: '#fd7e14', text: '#fff', label: 'OR Gate (any cause)' },
  'gate-and':      { bg: '#764ba2', text: '#fff', label: 'AND Gate (all causes)' },
  'intermediate':  { bg: '#ffc107', text: '#1a1a1a', label: 'Intermediate Event' },
  'basic-event':   { bg: '#667eea', text: '#fff', label: 'Basic Event (root cause)' },
  'mitigation':    { bg: '#28a745', text: '#fff', label: 'Mitigation' },
} as const

type FtNodeType = keyof typeof NODE_TYPES_CONFIG
const ftNodeTypes = Object.keys(NODE_TYPES_CONFIG) as FtNodeType[]

/* ═══════════════════════════════════════════════════════
   Custom Fault Tree Node
   ═══════════════════════════════════════════════════════ */

function FaultTreeNode({ data }: NodeProps) {
  const cfg = NODE_TYPES_CONFIG[(data.nodeType as FtNodeType)] ?? NODE_TYPES_CONFIG['basic-event']
  const isGate = (data.nodeType as string)?.startsWith('gate-')

  return (
    <div
      style={{
        background: cfg.bg,
        color: cfg.text,
        borderRadius: isGate ? '50%' : '10px',
        padding: isGate ? '14px' : '10px 16px',
        minWidth: isGate ? '60px' : '140px',
        maxWidth: isGate ? '80px' : '220px',
        textAlign: 'center',
        fontSize: isGate ? '11px' : '13px',
        fontWeight: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        lineHeight: '1.3',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {data.label as string}
      {data.probability && (
        <div style={{ fontSize: '10px', opacity: 0.85, marginTop: '4px' }}>
          P: {data.probability as string} | I: {data.impact as string}
        </div>
      )}
      <Handle type="target" position={Position.Top} style={{ background: cfg.bg, width: 8, height: 8, border: '2px solid #fff' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: cfg.bg, width: 8, height: 8, border: '2px solid #fff' }} />
    </div>
  )
}

const nodeTypes = { ftNode: FaultTreeNode }

/* ═══════════════════════════════════════════════════════
   Default fault tree data
   ═══════════════════════════════════════════════════════ */

interface FtNodeData {
  id: string
  label: string
  nodeType: FtNodeType
  probability?: string
  impact?: string
  x: number
  y: number
}

const defaultFtNodes: FtNodeData[] = [
  { id: 'top',  label: 'Application Unavailable', nodeType: 'top-event', x: 400, y: 0 },
  // OR gate
  { id: 'or1',  label: 'OR', nodeType: 'gate-or', x: 410, y: 100 },
  // Categories
  { id: 'infra', label: 'Infrastructure Failure', nodeType: 'intermediate', probability: 'Medium', impact: 'High', x: 100, y: 200 },
  { id: 'app',   label: 'Application Failure',    nodeType: 'intermediate', probability: 'Medium', impact: 'High', x: 350, y: 200 },
  { id: 'data',  label: 'Data Issues',            nodeType: 'intermediate', probability: 'Low',    impact: 'Critical', x: 600, y: 200 },
  { id: 'sec',   label: 'Security Incident',      nodeType: 'intermediate', probability: 'Low',    impact: 'Critical', x: 850, y: 200 },
  // Basic events - Infrastructure
  { id: 'be-az',  label: 'AZ outage',             nodeType: 'basic-event', x: 0,   y: 340 },
  { id: 'be-rg',  label: 'Region outage',         nodeType: 'basic-event', x: 150, y: 340 },
  { id: 'be-net', label: 'Network failure',        nodeType: 'basic-event', x: 0,   y: 420 },
  { id: 'be-dns', label: 'DNS failure',            nodeType: 'basic-event', x: 150, y: 420 },
  // Basic events - Application
  { id: 'be-code', label: 'Code exceptions',      nodeType: 'basic-event', x: 280, y: 340 },
  { id: 'be-cfg',  label: 'Config drift',         nodeType: 'basic-event', x: 410, y: 340 },
  { id: 'be-dep',  label: 'Dependency timeout',   nodeType: 'basic-event', x: 280, y: 420 },
  { id: 'be-mem',  label: 'Resource exhaustion',  nodeType: 'basic-event', x: 410, y: 420 },
  // Basic events - Data
  { id: 'be-corrupt', label: 'Data corruption',   nodeType: 'basic-event', x: 540, y: 340 },
  { id: 'be-del',     label: 'Accidental deletion', nodeType: 'basic-event', x: 670, y: 340 },
  { id: 'be-lag',     label: 'Replication lag',    nodeType: 'basic-event', x: 540, y: 420 },
  // Basic events - Security
  { id: 'be-ddos',  label: 'DDoS attack',         nodeType: 'basic-event', x: 800, y: 340 },
  { id: 'be-cred',  label: 'Credential compromise', nodeType: 'basic-event', x: 930, y: 340 },
  { id: 'be-ransom', label: 'Ransomware',         nodeType: 'basic-event', x: 800, y: 420 },
]

const defaultFtEdges: { source: string; target: string }[] = [
  { source: 'top', target: 'or1' },
  { source: 'or1', target: 'infra' },
  { source: 'or1', target: 'app' },
  { source: 'or1', target: 'data' },
  { source: 'or1', target: 'sec' },
  { source: 'infra', target: 'be-az' },
  { source: 'infra', target: 'be-rg' },
  { source: 'infra', target: 'be-net' },
  { source: 'infra', target: 'be-dns' },
  { source: 'app', target: 'be-code' },
  { source: 'app', target: 'be-cfg' },
  { source: 'app', target: 'be-dep' },
  { source: 'app', target: 'be-mem' },
  { source: 'data', target: 'be-corrupt' },
  { source: 'data', target: 'be-del' },
  { source: 'data', target: 'be-lag' },
  { source: 'sec', target: 'be-ddos' },
  { source: 'sec', target: 'be-cred' },
  { source: 'sec', target: 'be-ransom' },
]

function toRfNodes(data: FtNodeData[]): Node[] {
  return data.map(n => ({
    id: n.id,
    type: 'ftNode',
    data: { label: n.label, nodeType: n.nodeType, probability: n.probability, impact: n.impact },
    position: { x: n.x, y: n.y },
  }))
}

function toRfEdges(data: { source: string; target: string }[]): Edge[] {
  return data.map((e, i) => ({
    id: `ft-e-${i}`,
    source: e.source,
    target: e.target,
    style: { strokeWidth: 2, stroke: '#718096' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#718096' },
  }))
}

/* ═══════════════════════════════════════════════════════
   FaultTree component
   ═══════════════════════════════════════════════════════ */

export default function FaultTree() {
  const styles = useStyles()
  const flowRef = useRef<HTMLDivElement>(null)
  const [ftData, setFtData, resetFt] = useWorkbenchData<FtNodeData[]>('phase2-fault-tree', defaultFtNodes)
  const [ftEdgeData, setFtEdgeData] = useWorkbenchData<{ source: string; target: string }[]>('phase2-fault-tree-edges', defaultFtEdges)

  const rfNodes = useMemo(() => toRfNodes(ftData), [ftData])
  const rfEdges = useMemo(() => toRfEdges(ftEdgeData), [ftEdgeData])

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges)

  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState<FtNodeType>('basic-event')
  const [newProb, setNewProb] = useState('Low')
  const [newImpact, setNewImpact] = useState('Medium')

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, style: { strokeWidth: 2, stroke: '#718096' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#718096' } }, eds))
      if (params.source && params.target) {
        setFtEdgeData([...ftEdgeData, { source: params.source, target: params.target }])
      }
    },
    [setEdges, ftEdgeData, setFtEdgeData],
  )

  const addNode = useCallback(() => {
    if (!newLabel.trim()) return
    const id = `ft-${Date.now()}`
    const x = 200 + Math.random() * 500
    const y = 200 + Math.random() * 200
    const newNodeData: FtNodeData = {
      id, label: newLabel.trim(), nodeType: newType, x, y,
      ...(newType === 'intermediate' || newType === 'basic-event' ? { probability: newProb, impact: newImpact } : {}),
    }
    setFtData([...ftData, newNodeData])
    setNodes((nds) => [...nds, ...toRfNodes([newNodeData])])
    setNewLabel('')
  }, [newLabel, newType, newProb, newImpact, ftData, setFtData, setNodes])

  const removeNode = useCallback((nodeId: string) => {
    setFtData(ftData.filter(n => n.id !== nodeId))
    setFtEdgeData(ftEdgeData.filter(e => e.source !== nodeId && e.target !== nodeId))
    setNodes((nds) => nds.filter(n => n.id !== nodeId))
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId))
  }, [ftData, ftEdgeData, setFtData, setFtEdgeData, setNodes, setEdges])

  const resetAll = useCallback(() => {
    resetFt()
    setFtEdgeData(defaultFtEdges)
    setNodes(toRfNodes(defaultFtNodes))
    setEdges(toRfEdges(defaultFtEdges))
  }, [resetFt, setFtEdgeData, setNodes, setEdges])

  const exportFt = () => {
    const rows = ftData.map(n => ({
      ID: n.id,
      Label: n.label,
      Type: NODE_TYPES_CONFIG[n.nodeType].label,
      Probability: n.probability ?? '',
      Impact: n.impact ?? '',
    }))
    downloadCsv('fault_tree_analysis.csv', objectsToCsvSheet('FaultTree', rows))
  }

  const exportImage = useCallback(() => {
    if (!flowRef.current) return
    const el = flowRef.current.querySelector('.react-flow__viewport') as HTMLElement | null
    if (!el) return
    toPng(el, { backgroundColor: '#fafbfc', pixelRatio: 2 }).then((dataUrl) => {
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `fault_tree_${new Date().toISOString().slice(0, 10)}.png`
      a.click()
    })
  }, [])

  return (
    <div>
      {/* Legend */}
      <div className={styles.legend}>
        {ftNodeTypes.map(t => (
          <div key={t} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: NODE_TYPES_CONFIG[t].bg, borderRadius: t.startsWith('gate-') ? '50%' : '3px' }} />
            {NODE_TYPES_CONFIG[t].label}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Event / Node Label</span>
          <Input size="small" placeholder="e.g. DNS failure" value={newLabel} onChange={(_, d) => setNewLabel(d.value)} onKeyDown={(e) => { if (e.key === 'Enter') addNode() }} style={{ minWidth: '180px' }} />
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Node Type</span>
          <Select size="small" value={newType} onChange={(_, d) => setNewType(d.value as FtNodeType)}>
            {ftNodeTypes.map(t => <option key={t} value={t}>{NODE_TYPES_CONFIG[t].label}</option>)}
          </Select>
        </div>
        {(newType === 'intermediate' || newType === 'basic-event') && (
          <>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Probability</span>
              <Select size="small" value={newProb} onChange={(_, d) => setNewProb(d.value)}>
                <option>Very Low</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
              </Select>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Impact</span>
              <Select size="small" value={newImpact} onChange={(_, d) => setNewImpact(d.value)}>
                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
              </Select>
            </div>
          </>
        )}
        <Button icon={<Add20Regular />} size="small" appearance="primary" onClick={addNode} disabled={!newLabel.trim()}>Add</Button>
        <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={resetAll}>Reset</Button>
        <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportFt}>CSV</Button>
        <Button icon={<Image20Regular />} size="small" appearance="subtle" onClick={exportImage}>PNG</Button>
      </div>

      {/* Node count + quick delete */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
        <Badge appearance="outline" color="brand" size="small">{nodes.length} nodes</Badge>
        <Badge appearance="outline" color="informative" size="small">{edges.length} connections</Badge>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
        {nodes.map(n => {
          const cfg = NODE_TYPES_CONFIG[(n.data.nodeType as FtNodeType)] ?? NODE_TYPES_CONFIG['basic-event']
          return (
            <Badge key={n.id} appearance="outline" size="small" style={{ cursor: 'pointer', borderColor: cfg.bg, color: cfg.bg }} onClick={() => removeNode(n.id)}>
              {n.data.label as string} <Delete20Regular style={{ fontSize: '10px', marginLeft: '2px' }} />
            </Badge>
          )
        })}
      </div>

      {/* React Flow canvas */}
      <div className={styles.flowContainer} ref={flowRef}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          snapToGrid
          snapGrid={[16, 16]}
          defaultEdgeOptions={{ style: { strokeWidth: 2, stroke: '#718096' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#718096' } }}
        >
          <Controls />
          <Background gap={16} size={1} color="#e2e8f0" />
        </ReactFlow>
      </div>

      <div className={styles.note}>
        <strong>How to use:</strong> Add failure events, gates (OR = any cause triggers, AND = all causes needed),
        and mitigations. Connect nodes top-to-bottom by dragging from handles. The top event (red) represents
        system failure. OR/AND gates are shown as circles. Click a badge above to remove a node.
      </div>
    </div>
  )
}
