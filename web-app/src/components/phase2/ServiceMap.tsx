import { useState, useCallback, useMemo, useRef } from 'react'
import ReactFlow, {
  Controls, Background, MiniMap, Handle, Position, MarkerType,
  useNodesState, useEdgesState, addEdge,
  type Connection, type NodeProps, type Node, type Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { toPng } from 'html-to-image'
import {
  makeStyles, shorthands, tokens, Button, Badge, Select,
} from '@fluentui/react-components'
import {
  Add20Regular, ArrowReset20Regular, Dismiss12Regular,
  ArrowDownload20Regular, Image20Regular,
} from '@fluentui/react-icons'
import { AZURE_SERVICES, AZURE_CATEGORIES, CATEGORY_COLORS, type AzureCategory } from '../../utils/azureCatalog'
import { downloadCsv, objectsToCsvSheet } from '../../utils/csvExport'

/* ═══════ Styles ═══════ */

const useStyles = makeStyles({
  canvas: { height: '600px', ...shorthands.borderRadius('10px'), ...shorthands.border('1px', 'solid', '#e2e8f0'), backgroundColor: '#fafbfc', overflow: 'hidden' },
  row: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '10px' },
  field: { display: 'flex', flexDirection: 'column', gap: '3px' },
  label: { fontSize: '11px', fontWeight: '500', color: tokens.colorNeutralForeground3, textTransform: 'uppercase', letterSpacing: '0.3px' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' },
  chip: { display: 'inline-flex', alignItems: 'center', gap: '4px', ...shorthands.padding('3px', '8px'), ...shorthands.borderRadius('14px'), fontSize: '11px', fontWeight: '500', cursor: 'pointer', ':hover': { opacity: 0.75 } },
  meta: { display: 'flex', gap: '12px', marginBottom: '10px', fontSize: '12px', color: tokens.colorNeutralForeground3 },
  hint: { ...shorthands.padding('10px', '14px'), backgroundColor: '#f8f9fa', ...shorthands.borderRadius('8px'), fontSize: '12px', lineHeight: '1.5', color: tokens.colorNeutralForeground3, marginTop: '10px' },
  connBox: { ...shorthands.padding('10px', '14px'), backgroundColor: '#f8f9fa', ...shorthands.border('1px', 'solid', '#e2e8f0'), ...shorthands.borderRadius('8px'), marginBottom: '10px' },
  connTitle: { fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: tokens.colorNeutralForeground2 },
})

/* ═══════ Connection types ═══════ */

const CONN_TYPES = {
  dependency:  { label: 'Dependency',    color: '#764ba2', dash: false, anim: false },
  'data-flow': { label: 'Data Flow',     color: '#4285F4', dash: false, anim: true },
  auth:        { label: 'Authentication', color: '#1a237e', dash: true,  anim: false },
  monitoring:  { label: 'Monitoring',    color: '#17a2b8', dash: false, anim: true },
  security:    { label: 'Security',      color: '#dc3545', dash: true,  anim: false },
  messaging:   { label: 'Messaging',     color: '#d6a206', dash: false, anim: true },
  optional:    { label: 'Optional',      color: '#6c757d', dash: true,  anim: false },
} as const
type ConnType = keyof typeof CONN_TYPES
const connKeys = Object.keys(CONN_TYPES) as ConnType[]
const DIRS = { forward: '\u2192', reverse: '\u2190', both: '\u2194' } as const
type Dir = keyof typeof DIRS

/* ═══════ Custom node ═══════ */

function ServiceNode({ data }: NodeProps) {
  const c = CATEGORY_COLORS[data.category as string] ?? CATEGORY_COLORS.Custom
  return (
    <div style={{ background: '#fff', border: `2px solid ${c.accent}`, borderRadius: 8, minWidth: 160, maxWidth: 210, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: c.accent, padding: '4px 10px', fontSize: 10, fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.4 }}>{data.category as string}</div>
      <div style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, color: '#1a202c' }}>{data.label as string}</div>
      <Handle type="target" position={Position.Top} style={{ background: c.accent, width: 7, height: 7, border: '2px solid #fff' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: c.accent, width: 7, height: 7, border: '2px solid #fff' }} />
      <Handle type="target" position={Position.Left} id="left" style={{ background: c.accent, width: 7, height: 7, border: '2px solid #fff' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ background: c.accent, width: 7, height: 7, border: '2px solid #fff' }} />
    </div>
  )
}
const nodeTypes = { service: ServiceNode }

/* ═══════ Helpers ═══════ */

function mkNode(id: string, label: string, cat: string, x: number, y: number): Node {
  return { id, type: 'service', data: { label, category: cat }, position: { x, y } }
}
function mkEdge(id: string, src: string, tgt: string, ct: ConnType, lbl: string, dir: Dir = 'forward'): Edge {
  const c = CONN_TYPES[ct]
  return {
    id, source: src, target: tgt, label: lbl || undefined, animated: c.anim,
    style: { strokeWidth: 2, stroke: c.color, ...(c.dash ? { strokeDasharray: '6 3' } : {}) },
    data: { connType: ct, direction: dir, connLabel: lbl },
    markerEnd: dir !== 'reverse' ? { type: MarkerType.ArrowClosed, color: c.color } : undefined,
    markerStart: dir !== 'forward' ? { type: MarkerType.ArrowClosed, color: c.color } : undefined,
  }
}

const defaultNodes: Node[] = [
  mkNode('entraId','Microsoft Entra ID','Identity',350,0), mkNode('frontDoor','Azure Front Door','Networking',20,150),
  mkNode('appService','Azure App Service','Compute',280,150), mkNode('azureSql','Azure SQL Database','Databases',550,50),
  mkNode('redis','Azure Cache for Redis','Databases',550,170), mkNode('serviceBus','Azure Service Bus','Messaging',550,290),
  mkNode('functions','Azure Functions','Compute',790,290), mkNode('keyVault','Azure Key Vault','Security',60,330),
  mkNode('storage','Azure Blob Storage','Storage',790,420), mkNode('appInsights','Application Insights','Monitoring',60,450),
]
const defaultEdges: Edge[] = [
  mkEdge('e1','frontDoor','appService','data-flow','traffic'),
  mkEdge('e2','appService','azureSql','dependency','queries'),
  mkEdge('e3','appService','redis','dependency','cache'),
  mkEdge('e4','appService','serviceBus','messaging','events'),
  mkEdge('e5','serviceBus','functions','messaging','trigger'),
  mkEdge('e6','functions','storage','dependency','blobs'),
  mkEdge('e7','entraId','appService','auth','auth'),
  mkEdge('e8','appService','keyVault','security','secrets'),
  mkEdge('e9','appService','appInsights','monitoring','telemetry'),
  mkEdge('e10','functions','appInsights','monitoring',''),
]

/* ═══════ Component ═══════ */

export default function ServiceMap() {
  const s = useStyles()
  const ref = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNC] = useNodesState(defaultNodes)
  const [edges, setEdges, onEC] = useEdgesState(defaultEdges)

  // Add service
  const [selCat, setSelCat] = useState<AzureCategory>('Compute')
  const [selSvc, setSelSvc] = useState('')
  const svcsInCat = useMemo(() => AZURE_SERVICES.filter(s => s.category === selCat), [selCat])

  // Connection config
  const [ct, setCt] = useState<ConnType>('dependency')
  const [cl, setCl] = useState('')
  const [cd, setCd] = useState<Dir>('forward')

  const onConnect = useCallback((p: Connection) => {
    if (!p.source || !p.target) return
    const c = CONN_TYPES[ct]
    setEdges(eds => addEdge({
      id: `e-${Date.now()}`, source: p.source!, target: p.target!,
      sourceHandle: p.sourceHandle ?? undefined, targetHandle: p.targetHandle ?? undefined,
      label: cl || undefined, animated: c.anim,
      style: { strokeWidth: 2, stroke: c.color, ...(c.dash ? { strokeDasharray: '6 3' } : {}) },
      data: { connType: ct, direction: cd, connLabel: cl },
      markerEnd: cd !== 'reverse' ? { type: MarkerType.ArrowClosed, color: c.color } : undefined,
      markerStart: cd !== 'forward' ? { type: MarkerType.ArrowClosed, color: c.color } : undefined,
    }, eds))
    setCl('')
  }, [setEdges, ct, cl, cd])

  const addSvc = useCallback(() => {
    if (!selSvc) return
    const cat = AZURE_SERVICES.find(s => s.name === selSvc)?.category ?? selCat
    setNodes(nds => [...nds, mkNode(`svc-${Date.now()}`, selSvc, cat, 200 + Math.random() * 400, 100 + Math.random() * 300)])
    setSelSvc('')
  }, [selSvc, selCat, setNodes])

  const rmNode = useCallback((id: string) => { setNodes(n => n.filter(x => x.id !== id)); setEdges(e => e.filter(x => x.source !== id && x.target !== id)) }, [setNodes, setEdges])
  const reset = useCallback(() => { setNodes(defaultNodes); setEdges(defaultEdges) }, [setNodes, setEdges])

  const exportCsv = () => downloadCsv('service_map.csv', objectsToCsvSheet('Dependencies', edges.map(e => {
    const sn = nodes.find(n => n.id === e.source); const tn = nodes.find(n => n.id === e.target)
    return { Source: (sn?.data.label as string) ?? '', 'Source Cat': (sn?.data.category as string) ?? '', Target: (tn?.data.label as string) ?? '', 'Target Cat': (tn?.data.category as string) ?? '', Label: (e.label as string) ?? '', Type: CONN_TYPES[(e.data?.connType as ConnType)]?.label ?? '', Direction: DIRS[(e.data?.direction as Dir)] ?? '\u2192' }
  })))

  const exportPng = useCallback(() => {
    const el = ref.current?.querySelector('.react-flow__viewport') as HTMLElement | null
    if (!el) return
    toPng(el, { backgroundColor: '#fafbfc', pixelRatio: 2 }).then(url => { const a = document.createElement('a'); a.href = url; a.download = `service_map_${new Date().toISOString().slice(0, 10)}.png`; a.click() })
  }, [])

  return (
    <div>
      {/* 1. Add service */}
      <div className={s.row}>
        <div className={s.field}>
          <span className={s.label}>Category</span>
          <Select size="small" value={selCat} onChange={(_, d) => { setSelCat(d.value as AzureCategory); setSelSvc('') }}>
            {AZURE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="On-Premises">On-Premises</option>
            <option value="Third Party">Third Party</option>
          </Select>
        </div>
        <div className={s.field}>
          <span className={s.label}>Service</span>
          <Select size="small" value={selSvc} onChange={(_, d) => setSelSvc(d.value)} style={{ minWidth: 200 }}>
            <option value="">-- select --</option>
            {svcsInCat.map(svc => <option key={svc.name} value={svc.name}>{svc.name}</option>)}
          </Select>
        </div>
        <Button icon={<Add20Regular />} size="small" appearance="primary" onClick={addSvc} disabled={!selSvc}>Add</Button>
        <Button icon={<ArrowReset20Regular />} size="small" appearance="subtle" onClick={reset}>Reset</Button>
        <Button icon={<ArrowDownload20Regular />} size="small" appearance="subtle" onClick={exportCsv}>CSV</Button>
        <Button icon={<Image20Regular />} size="small" appearance="subtle" onClick={exportPng}>PNG</Button>
      </div>

      {/* 2. Connection settings */}
      <div className={s.connBox}>
        <div className={s.connTitle}>Next Connection Settings</div>
        <div className={s.row}>
          <div className={s.field}><span className={s.label}>Type</span><Select size="small" value={ct} onChange={(_, d) => setCt(d.value as ConnType)}>{connKeys.map(k => <option key={k} value={k}>{CONN_TYPES[k].label}</option>)}</Select></div>
          <div className={s.field}><span className={s.label}>Label</span><input value={cl} onChange={e => setCl(e.target.value)} placeholder="e.g. queries" style={{ fontSize: 13, padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: 4, width: 140 }} /></div>
          <div className={s.field}><span className={s.label}>Direction</span><Select size="small" value={cd} onChange={(_, d) => setCd(d.value as Dir)}><option value="forward">{DIRS.forward} Forward</option><option value="reverse">{DIRS.reverse} Reverse</option><option value="both">{DIRS.both} Both</option></Select></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: tokens.colorNeutralForeground3, marginLeft: 8 }}>
            {connKeys.map(k => <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><svg width="16" height="6"><line x1="0" y1="3" x2="16" y2="3" stroke={CONN_TYPES[k].color} strokeWidth="2" strokeDasharray={CONN_TYPES[k].dash ? '3 2' : 'none'} /></svg>{CONN_TYPES[k].label}</span>)}
          </div>
        </div>
      </div>

      {/* 3. Node chips */}
      <div className={s.chips}>
        {nodes.map(n => {
          const col = CATEGORY_COLORS[(n.data.category as string)]?.accent ?? '#667eea'
          return <span key={n.id} className={s.chip} style={{ backgroundColor: col + '12', color: col, border: `1px solid ${col}30` }} onClick={() => rmNode(n.id)}>{n.data.label as string} <Dismiss12Regular style={{ fontSize: 9 }} /></span>
        })}
      </div>

      <div className={s.meta}>
        <Badge appearance="outline" size="small">{nodes.length} services</Badge>
        <Badge appearance="outline" size="small">{edges.length} connections</Badge>
      </div>

      {/* 4. Canvas */}
      <div className={s.canvas} ref={ref}>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNC} onEdgesChange={onEC} onConnect={onConnect} nodeTypes={nodeTypes} fitView snapToGrid snapGrid={[16, 16]} connectionLineStyle={{ strokeWidth: 2, stroke: CONN_TYPES[ct].color }} attributionPosition="bottom-left">
          <Controls />
          <Background gap={16} size={1} color="#e2e8f0" />
          <MiniMap nodeColor={n => CATEGORY_COLORS[(n.data?.category as string)]?.accent ?? '#667eea'} maskColor="rgba(248,249,250,0.85)" style={{ borderRadius: 6, border: '1px solid #e2e8f0' }} />
        </ReactFlow>
      </div>

      <div className={s.hint}>
        Select a category and Azure service to add nodes. Configure connection type, label, and direction before drawing. Drag between node handles to connect.
      </div>
    </div>
  )
}
