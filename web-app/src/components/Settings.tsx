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
} from '@fluentui/react-icons'
import { useWorkbenchData } from '../hooks/useWorkbenchData'

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
  dateFormat: string
  currency: string
  notes: string
}

const DEFAULT_SETTINGS: AppSettings = {
  organizationName: '',
  guideName: 'Azure Business Continuity Guide',
  primaryContact: '',
  primaryContactEmail: '',
  dateFormat: 'YYYY-MM-DD',
  currency: 'USD',
  notes: '',
}

function Settings() {
  const styles = useStyles()
  const [settings, setSettings] = useWorkbenchData<AppSettings>('settings', DEFAULT_SETTINGS)

  const updateField = <K extends keyof AppSettings>(field: K, value: AppSettings[K]) => {
    setSettings({ ...settings, [field]: value })
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
