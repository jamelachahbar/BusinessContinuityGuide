/**
 * Help Icon — "?" button that shows a tooltip/popover with contextual help.
 * Used next to complex sections like Fault Tree, Risk Matrix, FMEA, etc.
 */

import { useState } from 'react'
import {
  makeStyles,
  shorthands,
  tokens,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components'
import { QuestionCircle16Regular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '22px',
    height: '22px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: 'transparent',
    color: '#a0aec0',
    ...shorthands.border('none'),
    cursor: 'pointer',
    transitionProperty: 'color, background-color',
    transitionDuration: '0.15s',
    ':hover': {
      color: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.08)',
    },
  },
  surface: {
    maxWidth: '340px',
    ...shorthands.borderRadius('12px'),
    ...shorthands.padding('16px', '18px'),
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
  },
  title: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  body: {
    fontSize: '13px',
    lineHeight: '1.55',
    color: tokens.colorNeutralForeground2,
  },
  list: {
    marginTop: '8px',
    marginLeft: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
})

interface HelpIconProps {
  title: string
  children: React.ReactNode
}

export default function HelpIcon({ title, children }: HelpIconProps) {
  const s = useStyles()
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={(_, d) => setOpen(d.open)} positioning="above-start">
      <PopoverTrigger>
        <button className={s.trigger} aria-label={`Help: ${title}`}>
          <QuestionCircle16Regular />
        </button>
      </PopoverTrigger>
      <PopoverSurface className={s.surface}>
        <div className={s.title}>{title}</div>
        <div className={s.body}>{children}</div>
      </PopoverSurface>
    </Popover>
  )
}
