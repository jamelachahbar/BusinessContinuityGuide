/**
 * Fault Tree Analysis — IEC 61025 compliant diagram.
 *
 * Node symbols follow the standard:
 *   Rectangle = Event (top event, intermediate event)
 *   Circle    = Basic event (root cause, no further decomposition)
 *   Diamond   = Undeveloped event (needs further analysis)
 *   House     = House event / external condition (expected to occur)
 *   "OR" gate = Output occurs if ANY input occurs
 *   "AND" gate= Output occurs only if ALL inputs occur
 *
 * Also supports FMEA-style Severity / Occurrence / Detection / RPN scoring.
 */

import { useState, useCallback, useMemo, useRef } from 'react'
import ReactFlow, {
  Controls, Background, Handle, Position, MarkerType,
  useNodesState, useEdgesState, addEdge,
  type Connection, type NodeProps, type Node, type Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { toPng } from 'html-to-image'
import {
  makeStyles, shorthands, tokens, Button, Badge, Select,
} from '@fluentui/react-components'
import {
  Add20Regular, ArrowReset20Regular, ArrowDownload20Regular, Image20Regular, Dismiss12Regular,
} from '@fluentui/react-icons'
import { useWorkbenchData } from '../../hooks/useWorkbenchData'
import { downloadCsv, objectsToCsvSheet } from '../../utils/csvExport'

/* ═══════ Styles ═══════ */

const useStyles = makeStyles({
  canvas: { height: '550px', ...shorthands.borderRadius('10px'), ...shorthands.border('1px', 'solid', '#e2e8f0'), backgroundColor: '#fafbfc', overflow: 'hidden' },
  row: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '10px' },
  field: { display: 'flex', flexDirection: 'column', gap: '3px' },
  label: { fontSize: '11px', fontWeight: '500', color: tokens.colorNeutralForeground3, textTransform: 'uppercase', letterSpacing: '0.3px' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' },
  meta: { display: 'flex', gap: '12px', marginBottom: '10px', fontSize: '12px', color: tokens.colorNeutralForeground3 },
  legend: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px', ...shorthands.padding('8px', '12px'), backgroundColor: '#f8f9fa', ...shorthands.borderRadius('8px'), fontSize: '11px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '5px' },
  hint: { ...shorthands.padding('10px', '14px'), backgroundColor: '#f8f9fa', ...shorthands.borderRadius('8px'), fontSize: '12px', lineHeight: '1.5', color: tokens.colorNeutralForeground3, marginTop: '10px' },
})

/* ═══════ FTA Node Types (IEC 61025) ═══════ */

const FTA_TYPES = {
  'top-event':    { label: 'Top Event',      shape: 'rect', color: '#dc3545', textColor: '#fff' },
  'intermediate': { label: 'Intermediate',   shape: 'rect', color: '#fd7e14', textColor: '#fff' },
  'basic':        { label: 'Basic Event',    shape: 'circle', color: '#667eea', textColor: '#fff' },
  'undeveloped':  { label: 'Undeveloped',    shape: 'diamond', color: '#ffc107', textColor: '#1a1a1a' },
  'house':        { label: 'House Event',    shape: 'house', color: '#6c757d', textColor: '#fff' },
  'mitigation':   { label: 'Mitigation',     shape: 'rect', color: '#28a745', textColor: '#fff' },
  'or-gate':      { label: 'OR Gate',        shape: 'or', color: '#764ba2', textColor: '#fff' },
  'and-gate':     { label: 'AND Gate',       shape: 'and', color: '#1a237e', textColor: '#fff' },
} as const

type FtaType = keyof typeof FTA_TYPES
const ftaKeys = Object.keys(FTA_TYPES) as FtaType[]

/* ═══════ Shape renderers ═══════ */

const shapeStyle = (ft: FtaType): React.CSSProperties => {
  const t = FTA_TYPES[ft]
  const base: React.CSSProperties = {
    background: t.color, color: t.textColor, fontFamily: 'system-ui, sans-serif',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', fontSize: 11, fontWeight: 600, lineHeight: '1.2',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)', position: 'relative',
  }
  switch (t.shape) {
    case 'rect':    return { ...base, borderRadius: 6, padding: '8px 14px', minWidth: 120, maxWidth: 180 }
    case 'circle':  return { ...base, borderRadius: '50%', width: 70, height: 70, padding: 6 }
    case 'diamond': return { ...base, width: 64, height: 64, transform: 'rotate(45deg)', padding: 4 }
    case 'house':   return { ...base, borderRadius: '6px 6px 0 0', padding: '8px 14px', minWidth: 100, borderBottom: '4px solid rgba(0,0,0,0.2)' }
    case 'or':      return { ...base, borderRadius: '0 0 50% 50%', width: 56, height: 44, padding: '0 4px 8px' }
    case 'and':     return { ...base, borderRadius: '50% 50% 0 0', width: 56, height: 44, padding: '8px 4px 0' }
    default:        return base
  }
}

function FtaNode({ data }: NodeProps) {
  const ft = (data.ftaType as FtaType) ?? 'basic'
  const isDiamond = FTA_TYPES[ft].shape === 'diamond'
  return (
    <div style={shapeStyle(ft)}>
      <div style={isDiamond ? { transform: 'rotate(-45deg)', fontSize: 10 } : undefined}>
        {data.label as string}
      </div>
      <Handle type="target" position={Position.Top}    style={{ background: FTA_TYPES[ft].color, width: 6, height: 6, border: '2px solid #fff', ...(isDiamond ? { top: -4, left: '50%' } : {}) }} />
      <Handle type="source" position={Position.Bottom} style={{ background: FTA_TYPES[ft].color, width: 6, height: 6, border: '2px solid #fff', ...(isDiamond ? { bottom: -4, left: '50%' } : {}) }} />
    </div>
  )
}

const nodeTypes = { fta: FtaNode }

/* ═══════ Default tree data ═══════ */

interface FtaNodeData { id: string; label: string; ftaType: FtaType; severity?: number; occurrence?: number; detection?: number; x: number; y: number }

const defaultNodes: FtaNodeData[] = [
  { id: 'top', label: 'Application\nUnavailable', ftaType: 'top-event', x: 380, y: 0 },
  { id: 'or1', label: 'OR', ftaType: 'or-gate', x: 395, y: 100 },
  { id: 'infra', label: 'Infrastructure\nFailure', ftaType: 'intermediate', severity: 4, occurrence: 2, detection: 3, x: 80, y: 200 },
  { id: 'app', label: 'Application\nFailure', ftaType: 'intermediate', severity: 4, occurrence: 3, detection: 2, x: 300, y: 200 },
  { id: 'data', label: 'Data\nIssues', ftaType: 'intermediate', severity: 5, occurrence: 1, detection: 3, x: 520, y: 200 },
  { id: 'sec', label: 'Security\nIncident', ftaType: 'intermediate', severity: 5, occurrence: 1, detection: 2, x: 740, y: 200 },
  // Basic events
  { id: 'b1', label: 'AZ Outage', ftaType: 'basic', x: 10, y: 340 },
  { id: 'b2', label: 'Region\nOutage', ftaType: 'basic', x: 110, y: 340 },
  { id: 'b3', label: 'Code\nException', ftaType: 'basic', x: 250, y: 340 },
  { id: 'b4', label: 'Config\nDrift', ftaType: 'basic', x: 350, y: 340 },
  { id: 'b5', label: 'Data\nCorruption', ftaType: 'basic', x: 480, y: 340 },
  { id: 'b6', label: 'Accidental\nDeletion', ftaType: 'basic', x: 580, y: 340 },
  { id: 'b7', label: 'DDoS\nAttack', ftaType: 'basic', x: 700, y: 340 },
  { id: 'b8', label: 'Credential\nCompromise', ftaType: 'basic', x: 800, y: 340 },
]

const defaultEdgesPairs = [
  ['top','or1'],['or1','infra'],['or1','app'],['or1','data'],['or1','sec'],
  ['infra','b1'],['infra','b2'],['app','b3'],['app','b4'],['data','b5'],['data','b6'],['sec','b7'],['sec','b8'],
]

function toNodes(d: FtaNodeData[]): Node[] {
  return d.map(n => ({ id: n.id, type: 'fta', data: { label: n.label, ftaType: n.ftaType, severity: n.severity, occurrence: n.occurrence, detection: n.detection }, position: { x: n.x, y: n.y } }))
}
function toEdges(pairs: string[][]): Edge[] {
  return pairs.map(([s, t], i) => ({ id: `fe${i}`, source: s, target: t, style: { strokeWidth: 2, stroke: '#718096' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#718096' } }))
}

/* ═══════ +BCDR "after" example with mitigations ═══════ */

const afterNodes: FtaNodeData[] = [
  { id: 'top', label: 'Application\nUnavailable', ftaType: 'top-event', x: 380, y: 0 },
  { id: 'or1', label: 'OR', ftaType: 'or-gate', x: 395, y: 90 },
  // Intermediate events with REDUCED occurrence scores (mitigations applied)
  { id: 'infra', label: 'Infrastructure\nFailure', ftaType: 'intermediate', severity: 4, occurrence: 1, detection: 2, x: 80, y: 180 },
  { id: 'app', label: 'Application\nFailure', ftaType: 'intermediate', severity: 4, occurrence: 1, detection: 1, x: 300, y: 180 },
  { id: 'data', label: 'Data\nIssues', ftaType: 'intermediate', severity: 5, occurrence: 1, detection: 1, x: 520, y: 180 },
  { id: 'sec', label: 'Security\nIncident', ftaType: 'intermediate', severity: 5, occurrence: 1, detection: 1, x: 740, y: 180 },
  // Mitigations (green)
  { id: 'm1', label: 'Zone-redundant\n(3 AZs)', ftaType: 'mitigation', x: 0, y: 310 },
  { id: 'm2', label: 'Multi-region\nfailover', ftaType: 'mitigation', x: 130, y: 310 },
  { id: 'm3', label: 'Circuit breaker\n+ retry', ftaType: 'mitigation', x: 250, y: 310 },
  { id: 'm4', label: 'IaC with drift\ndetection', ftaType: 'mitigation', x: 370, y: 310 },
  { id: 'm5', label: 'Point-in-time\nrestore (30d)', ftaType: 'mitigation', x: 480, y: 310 },
  { id: 'm6', label: 'Geo-replication\n+ soft delete', ftaType: 'mitigation', x: 600, y: 310 },
  { id: 'm7', label: 'DDoS Protection\nStandard', ftaType: 'mitigation', x: 700, y: 310 },
  { id: 'm8', label: 'Managed ID +\nKey Vault', ftaType: 'mitigation', x: 820, y: 310 },
  // Basic events still exist but with lower occurrence
  { id: 'b1', label: 'AZ Outage', ftaType: 'basic', severity: 3, occurrence: 1, detection: 1, x: 0, y: 430 },
  { id: 'b2', label: 'Region\nOutage', ftaType: 'basic', severity: 4, occurrence: 1, detection: 1, x: 130, y: 430 },
  { id: 'b3', label: 'Code\nException', ftaType: 'basic', severity: 3, occurrence: 1, detection: 1, x: 250, y: 430 },
  { id: 'b4', label: 'Config\nDrift', ftaType: 'basic', severity: 2, occurrence: 1, detection: 1, x: 370, y: 430 },
  { id: 'b5', label: 'Data\nCorruption', ftaType: 'basic', severity: 4, occurrence: 1, detection: 1, x: 480, y: 430 },
  { id: 'b6', label: 'Accidental\nDeletion', ftaType: 'basic', severity: 3, occurrence: 1, detection: 1, x: 600, y: 430 },
  { id: 'b7', label: 'DDoS\nAttack', ftaType: 'basic', severity: 3, occurrence: 1, detection: 1, x: 700, y: 430 },
  { id: 'b8', label: 'Credential\nCompromise', ftaType: 'basic', severity: 4, occurrence: 1, detection: 1, x: 820, y: 430 },
]

const afterEdges = [
  ['top','or1'],['or1','infra'],['or1','app'],['or1','data'],['or1','sec'],
  // Mitigations connected to intermediate events
  ['infra','m1'],['infra','m2'],['app','m3'],['app','m4'],['data','m5'],['data','m6'],['sec','m7'],['sec','m8'],
  // Basic events still connected through mitigations
  ['m1','b1'],['m2','b2'],['m3','b3'],['m4','b4'],['m5','b5'],['m6','b6'],['m7','b7'],['m8','b8'],
]

/* ═══════ Component ═══════ */

interface FaultTreeProps {
  /** Storage key prefix. Use different keys for -BCDR vs +BCDR instances */
  storageKey?: string
  /** Use the +BCDR example with mitigations as default */
  afterBcdr?: boolean
}

export default function FaultTree({ storageKey = 'phase2-fta', afterBcdr = false }: FaultTreeProps) {
  const st = useStyles()
  const ref = useRef<HTMLDivElement>(null)
  const initNodes = afterBcdr ? afterNodes : defaultNodes
  const initEdges = afterBcdr ? afterEdges : defaultEdgesPairs
  const [ftData, setFtData, resetFtData] = useWorkbenchData<FtaNodeData[]>(`${storageKey}-nodes`, initNodes)
  const [ftEdges, setFtEdges] = useWorkbenchData<string[][]>(`${storageKey}-edges`, initEdges)

  const [nodes, setNodes, onNC] = useNodesState(useMemo(() => toNodes(ftData), [ftData]))
  const [edges, setEdges, onEC] = useEdgesState(useMemo(() => toEdges(ftEdges), [ftEdges]))

  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState<FtaType>('basic')
  const [newSev, setNewSev] = useState(3)
  const [newOcc, setNewOcc] = useState(2)
  const [newDet, setNewDet] = useState(3)

  const onConnect = useCallback((p: Connection) => {
    if (!p.source || !p.target) return
    setEdges(eds => addEdge({ id: `fe-${Date.now()}`, source: p.source!, target: p.target!, style: { strokeWidth: 2, stroke: '#718096' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#718096' } }, eds))
    setFtEdges([...ftEdges, [p.source, p.target]])
  }, [setEdges, ftEdges, setFtEdges])

  const addNode = useCallback(() => {
    if (!newLabel.trim()) return
    const nd: FtaNodeData = { id: `ft-${Date.now()}`, label: newLabel.trim(), ftaType: newType, x: 200 + Math.random() * 400, y: 150 + Math.random() * 200, ...(newType === 'intermediate' || newType === 'basic' ? { severity: newSev, occurrence: newOcc, detection: newDet } : {}) }
    setFtData([...ftData, nd])
    setNodes(nds => [...nds, ...toNodes([nd])])
    setNewLabel('')
  }, [newLabel, newType, newSev, newOcc, newDet, ftData, setFtData, setNodes])

  const rmNode = useCallback((id: string) => {
    setFtData(ftData.filter(n => n.id !== id))
    setFtEdges(ftEdges.filter(e => e[0] !== id && e[1] !== id))
    setNodes(n => n.filter(x => x.id !== id))
    setEdges(e => e.filter(x => x.source !== id && x.target !== id))
  }, [ftData, ftEdges, setFtData, setFtEdges, setNodes, setEdges])

  const reset = useCallback(() => {
    resetFtData(); setFtEdges(initEdges)
    setNodes(toNodes(initNodes)); setEdges(toEdges(initEdges))
  }, [resetFtData, setFtEdges, setNodes, setEdges, initNodes, initEdges])

  // FMEA table
  const fmeaRows = useMemo(() => ftData.filter(n => n.severity != null).map(n => ({
    Event: n.label.replace(/\n/g, ' '), Type: FTA_TYPES[n.ftaType].label,
    Severity: n.severity!, Occurrence: n.occurrence!, Detection: n.detection!,
    RPN: n.severity! * n.occurrence! * n.detection!,
  })), [ftData])

  const exportCsv = () => downloadCsv('fault_tree_fmea.csv', objectsToCsvSheet('FTA_FMEA', fmeaRows as unknown as Record<string, unknown>[]))

  const exportPng = useCallback(() => {
    const el = ref.current?.querySelector('.react-flow__viewport') as HTMLElement | null
    if (!el) return
    toPng(el, { backgroundColor: '#fafbfc', pixelRatio: 2 }).then(url => { const a = document.createElement('a'); a.href = url; a.download = `fault_tree_${new Date().toISOString().slice(0,10)}.png`; a.click() })
  }, [])

  return (
    <div>
      {/* Legend — IEC 61025 symbols */}
      <div className={st.legend}>
        {ftaKeys.map(k => (
          <div key={k} className={st.legendItem}>
            <span style={{ display: 'inline-block', width: 14, height: 14, backgroundColor: FTA_TYPES[k].color, borderRadius: FTA_TYPES[k].shape === 'circle' ? '50%' : FTA_TYPES[k].shape === 'diamond' ? 2 : 3, transform: FTA_TYPES[k].shape === 'diamond' ? 'rotate(45deg) scale(0.85)' : undefined }} />
            {FTA_TYPES[k].label}
          </div>
        ))}
      </div>

      {/* Add node */}
      <div className={st.row}>
        <div className={st.field}><span className={st.label}>Label</span><input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Event name" style={{ fontSize: 13, padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: 4, width: 150 }} onKeyDown={e => { if (e.key === 'Enter') addNode() }} /></div>
        <div className={st.field}><span className={st.label}>Symbol</span><Select size="small" value={newType} onChange={(_, d) => setNewType(d.value as FtaType)}>{ftaKeys.map(k => <option key={k} value={k}>{FTA_TYPES[k].label}</option>)}</Select></div>
        {(newType === 'intermediate' || newType === 'basic') && (
          <>
            <div className={st.field}><span className={st.label}>Severity</span><Select size="small" value={String(newSev)} onChange={(_, d) => setNewSev(Number(d.value))}>{[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}</Select></div>
            <div className={st.field}><span className={st.label}>Occurrence</span><Select size="small" value={String(newOcc)} onChange={(_, d) => setNewOcc(Number(d.value))}>{[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}</Select></div>
            <div className={st.field}><span className={st.label}>Detection</span><Select size="small" value={String(newDet)} onChange={(_, d) => setNewDet(Number(d.value))}>{[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}</Select></div>
          </>
        )}
        <Button icon={<Add20Regular />} size="small" appearance="primary" onClick={addNode} disabled={!newLabel.trim()}>Add</Button>
        <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={reset}>Reset</Button>
        <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportCsv}>CSV</Button>
        <Button icon={<Image20Regular />} size="small" appearance="subtle" onClick={exportPng}>PNG</Button>
      </div>

      <div className={st.chips}>
        {nodes.map(n => {
          const col = FTA_TYPES[(n.data.ftaType as FtaType)]?.color ?? '#667eea'
          return <Badge key={n.id} appearance="outline" size="small" style={{ cursor: 'pointer', borderColor: col, color: col }} onClick={() => rmNode(n.id)}>{(n.data.label as string).replace(/\n/g, ' ')} <Dismiss12Regular style={{ fontSize: 9, marginLeft: 2 }} /></Badge>
        })}
      </div>

      <div className={st.meta}>
        <Badge appearance="outline" size="small">{nodes.length} events</Badge>
        <Badge appearance="outline" size="small">{edges.length} links</Badge>
      </div>

      {/* Canvas */}
      <div className={st.canvas} ref={ref}>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNC} onEdgesChange={onEC} onConnect={onConnect} nodeTypes={nodeTypes} fitView snapToGrid snapGrid={[16, 16]} defaultEdgeOptions={{ style: { strokeWidth: 2, stroke: '#718096' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#718096' } }} attributionPosition="bottom-left">
          <Controls />
          <Background gap={16} size={1} color="#e2e8f0" />
        </ReactFlow>
      </div>

      {/* FMEA Table (Lean Six Sigma) */}
      {fmeaRows.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: tokens.colorNeutralForeground1 }}>FMEA Risk Priority (Severity x Occurrence x Detection)</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8f9fa' }}>Event</th>
                  <th style={{ textAlign: 'center', padding: '6px 10px', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8f9fa' }}>Type</th>
                  <th style={{ textAlign: 'center', padding: '6px 10px', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8f9fa' }}>S</th>
                  <th style={{ textAlign: 'center', padding: '6px 10px', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8f9fa' }}>O</th>
                  <th style={{ textAlign: 'center', padding: '6px 10px', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8f9fa' }}>D</th>
                  <th style={{ textAlign: 'center', padding: '6px 10px', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8f9fa' }}>RPN</th>
                </tr>
              </thead>
              <tbody>
                {fmeaRows.sort((a, b) => b.RPN - a.RPN).map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: '6px 10px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>{r.Event}</td>
                    <td style={{ padding: '6px 10px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>{r.Type}</td>
                    <td style={{ padding: '6px 10px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>{r.Severity}</td>
                    <td style={{ padding: '6px 10px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>{r.Occurrence}</td>
                    <td style={{ padding: '6px 10px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>{r.Detection}</td>
                    <td style={{ padding: '6px 10px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <Badge appearance="filled" size="small" style={{ backgroundColor: r.RPN >= 60 ? '#dc3545' : r.RPN >= 30 ? '#fd7e14' : r.RPN >= 10 ? '#ffc107' : '#28a745', color: r.RPN >= 10 && r.RPN < 60 && r.RPN >= 30 ? '#fff' : r.RPN >= 60 ? '#fff' : r.RPN < 10 ? '#fff' : '#1a1a1a' }}>
                        {r.RPN}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={st.hint}>
        <strong>How to use Fault Tree Analysis (IEC 61025)</strong>
        <ol style={{ marginTop: 6, marginBottom: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li><strong>Define the Top Event</strong> (red rectangle) -- the undesired outcome, e.g. "Application Unavailable". This is already included by default.</li>
          <li><strong>Add logic gates</strong> below the top event:
            <ul style={{ marginTop: 2, paddingLeft: 16 }}>
              <li><strong>OR Gate</strong> (purple circle) -- the output occurs if <em>any one</em> input occurs. Use when multiple independent causes can each trigger the failure.</li>
              <li><strong>AND Gate</strong> (navy circle) -- the output occurs only when <em>all</em> inputs occur simultaneously. Use when multiple conditions must combine.</li>
            </ul>
          </li>
          <li><strong>Add Intermediate Events</strong> (orange rectangle) -- failure categories that contribute to the top event, e.g. "Infrastructure Failure", "Application Failure".</li>
          <li><strong>Add Basic Events</strong> (blue circle) -- root causes that cannot be decomposed further, e.g. "AZ Outage", "DDoS Attack".</li>
          <li><strong>Connect nodes</strong> by dragging from the bottom handle of a parent to the top handle of a child. Arrows show the failure cascade direction (cause flows upward).</li>
          <li><strong>Optional nodes:</strong>
            <ul style={{ marginTop: 2, paddingLeft: 16 }}>
              <li><strong>Undeveloped Event</strong> (yellow diamond) -- a failure mode that needs further analysis in the future.</li>
              <li><strong>House Event</strong> (green) -- an external condition expected to occur (e.g. "Peak traffic period").</li>
              <li><strong>Mitigation</strong> (green) -- a control or countermeasure applied to reduce a failure's probability.</li>
            </ul>
          </li>
          <li><strong>FMEA scoring</strong> (optional): Set Severity (1-5), Occurrence (1-5), and Detection (1-5) for intermediate and basic events. The RPN (Risk Priority Number = S x O x D) auto-calculates in the table below, sorted by highest risk.</li>
          <li><strong>Export:</strong> Use CSV to export the node list with FMEA scores, or PNG to save the diagram as an image.</li>
        </ol>
      </div>
    </div>
  )
}
