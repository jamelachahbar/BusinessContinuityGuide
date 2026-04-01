import { useState } from 'react'
import {
  makeStyles, shorthands, tokens,
  Button, Input, Badge,
  Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, DialogTrigger,
} from '@fluentui/react-components'
import {
  Add20Regular, Delete20Regular, Edit20Regular, AppsList20Regular,
} from '@fluentui/react-icons'
import { useAppContext } from '../context/AppContext'

const useStyles = makeStyles({
  selector: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    ...shorthands.padding('8px', '12px'),
    backgroundColor: '#f1f5f9',
    ...shorthands.borderRadius('8px'),
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  appChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    ...shorthands.padding('4px', '12px'),
    ...shorthands.borderRadius('20px'),
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: '0.15s',
    ...shorthands.border('1px', 'solid', '#e2e8f0'),
    backgroundColor: '#fff',
    ':hover': { backgroundColor: '#f1f5f9' },
  },
  appChipActive: {
    backgroundColor: '#667eea',
    color: '#fff',
    ...shorthands.border('1px', 'solid', '#667eea'),
    ':hover': { backgroundColor: '#5a6fd6' },
  },
  actions: {
    display: 'flex',
    gap: '4px',
    marginLeft: 'auto',
  },
})

export default function AppSelector() {
  const s = useStyles()
  const { apps, currentApp, selectApp, addApp, renameApp, deleteApp } = useAppContext()
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleAdd = () => {
    if (newName.trim()) {
      addApp(newName.trim())
      setNewName('')
      setAddOpen(false)
    }
  }

  const handleRename = () => {
    if (editId && editName.trim()) {
      renameApp(editId, editName.trim())
      setEditId(null)
    }
  }

  return (
    <div className={s.selector}>
      <AppsList20Regular style={{ color: tokens.colorNeutralForeground3 }} />
      <span className={s.label}>Application:</span>

      {apps.map(app => (
        <span
          key={app.id}
          className={`${s.appChip} ${app.id === currentApp.id ? s.appChipActive : ''}`}
          onClick={() => app.id !== currentApp.id && selectApp(app.id)}
        >
          {app.name}
        </span>
      ))}

      <div className={s.actions}>
        {/* Add */}
        <Dialog open={addOpen} onOpenChange={(_, d) => setAddOpen(d.open)}>
          <DialogTrigger disableButtonEnhancement>
            <Button icon={<Add20Regular />} size="small" appearance="subtle">New App</Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Add Application</DialogTitle>
              <DialogContent>
                <p style={{ marginBottom: '12px' }}>Enter the name of the application you want to create a BCDR plan for.</p>
                <Input
                  value={newName}
                  onChange={(_, d) => setNewName(d.value)}
                  placeholder="e.g. Mars Travel Bookings"
                  style={{ width: '100%' }}
                  onKeyDown={ev => { if (ev.key === 'Enter') handleAdd() }}
                />
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement><Button appearance="secondary">Cancel</Button></DialogTrigger>
                <Button appearance="primary" onClick={handleAdd} disabled={!newName.trim()}>Create</Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>

        {/* Rename */}
        <Dialog open={editId !== null} onOpenChange={(_, d) => { if (!d.open) setEditId(null) }}>
          <DialogTrigger disableButtonEnhancement>
            <Button icon={<Edit20Regular />} size="small" appearance="subtle" onClick={() => { setEditId(currentApp.id); setEditName(currentApp.name) }}>Rename</Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Rename Application</DialogTitle>
              <DialogContent>
                <Input value={editName} onChange={(_, d) => setEditName(d.value)} style={{ width: '100%' }} onKeyDown={ev => { if (ev.key === 'Enter') handleRename() }} />
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement><Button appearance="secondary">Cancel</Button></DialogTrigger>
                <Button appearance="primary" onClick={handleRename}>Save</Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>

        {/* Delete */}
        {apps.length > 1 && (
          <Dialog open={deleteId !== null} onOpenChange={(_, d) => { if (!d.open) setDeleteId(null) }}>
            <DialogTrigger disableButtonEnhancement>
              <Button icon={<Delete20Regular />} size="small" appearance="subtle" onClick={() => setDeleteId(currentApp.id)}>Delete</Button>
            </DialogTrigger>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>Delete Application?</DialogTitle>
                <DialogContent>
                  This will permanently delete <strong>{currentApp.name}</strong> and all its Phase 2 data. Phase 1 and Phase 3 data are shared and will not be affected.
                </DialogContent>
                <DialogActions>
                  <DialogTrigger disableButtonEnhancement><Button appearance="secondary">Cancel</Button></DialogTrigger>
                  <Button appearance="primary" onClick={() => { if (deleteId) deleteApp(deleteId); setDeleteId(null) }}>Delete</Button>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        )}
      </div>

      <Badge appearance="outline" size="small" style={{ marginLeft: '4px' }}>{apps.length} app{apps.length !== 1 ? 's' : ''}</Badge>
    </div>
  )
}
