/**
 * Export dialog — pick format (PDF / DOCX / CSV bundle) and optional sections.
 * Tier-1 sections (ISO 22301 mandatory) are always included.
 */
import { useState } from 'react'
import {
  Dialog, DialogSurface, DialogTitle, DialogBody, DialogContent, DialogActions,
  Button, Checkbox, Divider, makeStyles, shorthands, tokens,
} from '@fluentui/react-components'
import { Print24Regular, ArrowDownload24Regular, TableSimple24Regular, DocumentCheckmark20Regular } from '@fluentui/react-icons'
import { type BcpExportOptions, defaultExportOptions, exportOptionLabels } from '../utils/exportOptions'
import { generateBcpPdf } from '../utils/generateBcpPdf'
import { generateBcpDocx } from '../utils/generateBcpDocx'
import { exportAllPhasesToCsv } from '../utils/exportAllCsv'

const useStyles = makeStyles({
  surface: { maxWidth: '640px' },
  intro: { fontSize: '13px', color: tokens.colorNeutralForeground2, marginBottom: '12px', lineHeight: '1.5' },
  mandatoryBox: {
    ...shorthands.padding('10px', '12px'),
    ...shorthands.borderRadius('6px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground2,
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
    marginBottom: '14px',
    lineHeight: '1.55',
  },
  mandatoryHeader: { display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: tokens.colorBrandForeground1, marginBottom: '4px' },
  groupHeader: { fontWeight: 600, fontSize: '13px', marginTop: '8px', marginBottom: '4px', color: tokens.colorNeutralForeground1 },
  optionRow: { display: 'flex', flexDirection: 'column', marginBottom: '4px' },
  optionDesc: { fontSize: '11px', color: tokens.colorNeutralForeground3, marginLeft: '28px', marginTop: '-2px' },
  formatRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' },
})

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportDialog({ open, onOpenChange }: Props) {
  const s = useStyles()
  const [opts, setOpts] = useState<BcpExportOptions>(defaultExportOptions)

  function update(key: keyof BcpExportOptions, value: boolean) {
    setOpts(prev => ({ ...prev, [key]: value }))
  }

  function run(fn: (o: BcpExportOptions) => void) {
    fn(opts)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(_, d) => onOpenChange(d.open)}>
      <DialogSurface className={s.surface}>
        <DialogBody>
          <DialogTitle>Export Business Continuity Plan</DialogTitle>
          <DialogContent>
            <div className={s.intro}>
              Choose which optional sections to include. Mandatory ISO 22301 content is always exported.
            </div>

            <div className={s.mandatoryBox}>
              <div className={s.mandatoryHeader}>
                <DocumentCheckmark20Regular /> Always included (ISO 22301 + WAF core)
              </div>
              Document Control · Context &amp; Scope · Roles &amp; Responsibilities · Requirements ·
              Dependencies · BIA · Risk Register · Architecture &amp; Gap Assessment · BCDR Design ·
              Response Plan · Failover &amp; Failback Runbooks · Severity Matrix · Communication Plan ·
              Contingency Plan · Testing &amp; UAT · Maintenance · Criticality Model
            </div>

            <Divider />

            <div className={s.groupHeader}>Optional sections</div>
            {exportOptionLabels.map(opt => (
              <div key={opt.key} className={s.optionRow}>
                <Checkbox
                  checked={opts[opt.key]}
                  onChange={(_, d) => update(opt.key, !!d.checked)}
                  label={opt.label}
                />
                <div className={s.optionDesc}>{opt.description}</div>
              </div>
            ))}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button appearance="secondary" icon={<TableSimple24Regular />} onClick={() => run(exportAllPhasesToCsv)}>CSV Bundle</Button>
            <Button appearance="secondary" icon={<ArrowDownload24Regular />} onClick={() => run(generateBcpDocx)}>DOCX</Button>
            <Button appearance="primary" icon={<Print24Regular />} onClick={() => run(generateBcpPdf)}>PDF</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
