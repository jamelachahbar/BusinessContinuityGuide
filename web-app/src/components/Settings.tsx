import { useState } from 'react'
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Input,
  Label,
  Textarea,
  Button,
  Divider,
  Select,
} from '@fluentui/react-components'
import {
  Save24Regular,
  ArrowReset24Regular,
  ArrowReset20Regular,
  Add20Regular,
  Delete20Regular,
} from '@fluentui/react-icons'
import { useWorkbenchData } from '../hooks/useWorkbenchData'
import { useWorkbenchContext } from '../context/WorkbenchContext'
import { DEFAULT_CRITICALITY_LEVELS, type ConfigurableCriticalityLevel } from '../utils/criticality'

const useStyles = makeStyles({
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    fontSize: '36px',
    fontWeight: '600',
    marginBottom: '8px',
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    marginBottom: '32px',
  },
  card: {
    marginBottom: '24px',
    ...shorthands.padding('28px'),
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '4px',
    color: tokens.colorNeutralForeground1,
  },
  cardDesc: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '20px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fieldFull: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    gridColumn: '1 / -1',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: tokens.colorNeutralForeground1,
  },
  hint: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginTop: '2px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '32px',
  },
  saved: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#28a745',
    fontWeight: '500',
  },
})

export interface AppSettings {
  organizationName: string
  guideName: string
  primaryContact: string
  primaryContactEmail: string
  workloadDescription: string
  dateFormat: string
  currency: string
  notes: string
  planFocus: 'bcdr' | 'dr' | 'bc'
}

const DEFAULT_SETTINGS: AppSettings = {
  organizationName: '',
  guideName: 'Azure Business Continuity Guide',
  primaryContact: '',
  primaryContactEmail: '',
  workloadDescription: '',
  dateFormat: 'YYYY-MM-DD',
  currency: 'USD',
  notes: '',
  planFocus: 'bcdr',
}

function Settings() {
  const styles = useStyles()
  const { storagePrefix } = useWorkbenchContext()
  const [settings, setSettings] = useWorkbenchData<AppSettings>('settings', DEFAULT_SETTINGS)
  const [critLevels, setCritLevels, resetCritLevels] = useWorkbenchData<ConfigurableCriticalityLevel[]>('criticalityLevels', DEFAULT_CRITICALITY_LEVELS)
  const [focusedLevelName, setFocusedLevelName] = useState<string>('')

  const updateField = <K extends keyof AppSettings>(field: K, value: AppSettings[K]) => {
    setSettings({ ...settings, [field]: value })
  }

  /** Propagate a criticality level rename across all stored data */
  const renameCriticalityInData = (oldName: string, newName: string) => {
    if (oldName === newName || !oldName || !newName) return
    const keysToScan = ['phase1_criticalityModel', 'phase3-mbco', 'phase3-bia-portfolio']
    for (const key of keysToScan) {
      const raw = localStorage.getItem(`${storagePrefix}${key}`)
      if (!raw) continue
      try {
        const data = JSON.parse(raw)
        if (!Array.isArray(data)) continue
        let changed = false
        for (const row of data) {
          if (row.criticality === oldName) {
            row.criticality = newName
            changed = true
          }
        }
        if (changed) localStorage.setItem(`${storagePrefix}${key}`, JSON.stringify(data))
      } catch { /* skip malformed */ }
    }
    window.dispatchEvent(new Event('workbench-data-changed'))
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>
      <p className={styles.subtitle}>
        Configure general settings for your Business Continuity Guide workbench.
        These settings are saved locally in your browser.
      </p>

      <Card className={styles.card}>
        <div className={styles.cardTitle}>Organization Details</div>
        <div className={styles.cardDesc}>
          Set your organization name and primary contact. These are used in exported reports.
        </div>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <Label className={styles.label} htmlFor="org-name">Organization Name</Label>
            <Input
              id="org-name"
              placeholder="e.g., Contoso Ltd."
              value={settings.organizationName}
              onChange={(_, d) => updateField('organizationName', d.value)}
            />
          </div>
          <div className={styles.field}>
            <Label className={styles.label} htmlFor="guide-name">Guide Instance Name</Label>
            <Input
              id="guide-name"
              placeholder="e.g., Azure Business Continuity Guide"
              value={settings.guideName}
              onChange={(_, d) => updateField('guideName', d.value)}
            />
            <span className={styles.hint}>A custom name for this workbench instance</span>
          </div>
          <div className={styles.field}>
            <Label className={styles.label} htmlFor="contact-name">Primary Contact</Label>
            <Input
              id="contact-name"
              placeholder="e.g., Jane Doe"
              value={settings.primaryContact}
              onChange={(_, d) => updateField('primaryContact', d.value)}
            />
          </div>
          <div className={styles.field}>
            <Label className={styles.label} htmlFor="contact-email">Contact Email</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="jane.doe@contoso.com"
              value={settings.primaryContactEmail}
              onChange={(_, d) => updateField('primaryContactEmail', d.value)}
            />
          </div>
          <div className={styles.fieldFull}>
            <Label className={styles.label} htmlFor="workload-desc">Workload / Solution Description</Label>
            <Textarea
              id="workload-desc"
              placeholder="Describe the workload or solution this BCDR plan covers, its purpose, key business functions, and technology stack..."
              value={settings.workloadDescription}
              onChange={(_, d) => updateField('workloadDescription', d.value)}
              rows={3}
              resize="vertical"
            />
            <span className={styles.hint}>Included in the PDF cover page and Context section</span>
          </div>
        </div>
      </Card>

      <Card className={styles.card}>
        <div className={styles.cardTitle}>Display Preferences</div>
        <div className={styles.cardDesc}>
          Configure how data is displayed and exported throughout the guide.
        </div>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <Label className={styles.label} htmlFor="date-format">Date Format</Label>
            <Select
              id="date-format"
              value={settings.dateFormat}
              onChange={(_, d) => updateField('dateFormat', d.value)}
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-04-01)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (01/04/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (04/01/2026)</option>
              <option value="DD-MMM-YYYY">DD-MMM-YYYY (01-Apr-2026)</option>
            </Select>
          </div>
          <div className={styles.field}>
            <Label className={styles.label} htmlFor="currency">Currency</Label>
            <Select
              id="currency"
              value={settings.currency}
              onChange={(_, d) => updateField('currency', d.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (&euro;)</option>
              <option value="GBP">GBP (&pound;)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="JPY">JPY (&yen;)</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card className={styles.card}>
        <div className={styles.cardTitle}>Plan Focus</div>
        <div className={styles.cardDesc}>
          Select which type of plan you are building. Non-relevant sections will be visually dimmed but remain accessible.
        </div>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <Label className={styles.label} htmlFor="plan-focus">Plan Type</Label>
            <Select
              id="plan-focus"
              value={settings.planFocus}
              onChange={(_, d) => updateField('planFocus', d.value as 'bcdr' | 'dr' | 'bc')}
            >
              <option value="bcdr">Full BCDR (Business Continuity & Disaster Recovery)</option>
              <option value="dr">DR Only (Disaster Recovery)</option>
              <option value="bc">BC Only (Business Continuity)</option>
            </Select>
            <span className={styles.hint}>DR-focused plans emphasize Phase 2 (technical recovery). BC-focused plans emphasize Phase 3 (business operations).</span>
          </div>
        </div>
      </Card>

      <Card className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className={styles.cardTitle}>Criticality Levels</div>
            <div className={styles.cardDesc}>
              Define the criticality levels used throughout the workbench. Changes apply to all phases.
            </div>
          </div>
          <Button appearance="subtle" size="small" onClick={resetCritLevels} icon={<ArrowReset20Regular />}>Reset</Button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #e0e0e0', fontSize: '13px', fontWeight: 600 }}>Level Name</th>
              <th style={{ textAlign: 'center', padding: '8px', borderBottom: '2px solid #e0e0e0', fontSize: '13px', fontWeight: 600, width: '80px' }}>Color</th>
              <th style={{ textAlign: 'center', padding: '8px', borderBottom: '2px solid #e0e0e0', fontSize: '13px', fontWeight: 600, width: '80px' }}>Text</th>
              <th style={{ textAlign: 'center', padding: '8px', borderBottom: '2px solid #e0e0e0', width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {critLevels.map((level, i) => (
              <tr key={i}>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0' }}>
                  <Input size="small" value={level.name} onFocus={() => setFocusedLevelName(level.name)} onChange={(_, d) => setCritLevels(critLevels.map((l, j) => j === i ? { ...l, name: d.value } : l))} onBlur={() => { renameCriticalityInData(focusedLevelName, level.name); setFocusedLevelName('') }} style={{ width: '100%' }} />
                </td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
                  <input type="color" value={level.color} onChange={e => setCritLevels(critLevels.map((l, j) => j === i ? { ...l, color: e.target.value } : l))} style={{ width: '32px', height: '28px', border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
                  <input type="color" value={level.textColor} onChange={e => setCritLevels(critLevels.map((l, j) => j === i ? { ...l, textColor: e.target.value } : l))} style={{ width: '32px', height: '28px', border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
                  <Button appearance="subtle" size="small" icon={<Delete20Regular />} onClick={() => setCritLevels(critLevels.filter((_, j) => j !== i))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button appearance="subtle" size="small" icon={<Add20Regular />} onClick={() => setCritLevels([...critLevels, { name: 'New Level', color: '#6c757d', textColor: '#ffffff' }])} style={{ marginTop: '8px' }}>Add Level</Button>
      </Card>

      <Card className={styles.card}>
        <div className={styles.cardTitle}>Notes</div>
        <div className={styles.cardDesc}>General notes or comments for this workbench.</div>
        <div className={styles.fieldFull}>
          <Textarea
            placeholder="Add any general notes about your BCDR planning process..."
            value={settings.notes}
            onChange={(_, d) => updateField('notes', d.value)}
            rows={4}
            resize="vertical"
          />
        </div>
      </Card>

      <Divider />

      <div className={styles.actions}>
        <Button
          appearance="secondary"
          icon={<ArrowReset24Regular />}
          onClick={() => setSettings(DEFAULT_SETTINGS)}
        >
          Reset to Defaults
        </Button>
        <div className={styles.saved}>
          <Save24Regular />
          All changes saved automatically
        </div>
      </div>
    </div>
  )
}

export default Settings
