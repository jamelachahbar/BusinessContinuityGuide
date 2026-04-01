import { useState, useCallback } from 'react'
import { Joyride, STATUS, type EventData } from 'react-joyride'
import { Button } from '@fluentui/react-components'
import { Lightbulb20Regular } from '@fluentui/react-icons'

const steps = [
  {
    target: '[data-tour="sidebar"]',
    content: 'Navigate between phases, references, and settings. Click the bolt icon to collapse the sidebar.',
    title: 'Navigation',
    placement: 'right' as const,
  },
  {
    target: '[data-tour="toolbar"]',
    content: 'Export as CSV, PDF (ISO 22301 BCP), JSON backup. Import previous data or clear everything.',
    title: 'Export & Import',
    placement: 'bottom' as const,
  },
  {
    target: '[data-tour="phase1"]',
    content: 'Define your organizational BCDR framework: criticality model, business commitments, RACI, and test plans. Shared across all applications.',
    title: 'Phase 1: Prepare',
    placement: 'right' as const,
  },
  {
    target: '[data-tour="phase2"]',
    content: 'Per-application continuity: requirements, service map, BIA, gap analysis, cost comparison, failover testing. Use the App Selector to switch between applications.',
    title: 'Phase 2: Application Continuity',
    placement: 'right' as const,
  },
  {
    target: '[data-tour="phase3"]',
    content: 'Portfolio-wide: BCP checklist, risk matrix, MBCO recovery order, dashboard. Shared across all applications.',
    title: 'Phase 3: Business Continuity',
    placement: 'right' as const,
  },
  {
    target: '[data-tour="settings"]',
    content: 'Organization name, contact, date format, currency. Used in exports and the PDF report.',
    title: 'Settings',
    placement: 'right' as const,
  },
]

interface Props {
  buttonOnly?: boolean
}

export default function GuidedTour({ buttonOnly }: Props) {
  const [run, setRun] = useState(false)

  const onEvent = useCallback((data: EventData) => {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      setRun(false)
      localStorage.setItem('abcg_tour-seen', '1')
    }
  }, [])

  const hasSeenTour = localStorage.getItem('abcg_tour-seen') === '1'

  if (buttonOnly) {
    return <Button icon={<Lightbulb20Regular />} size="small" appearance="subtle" onClick={() => setRun(true)}>Tour</Button>
  }

  return (
    <>
      {!hasSeenTour && !run && (
        <Button
          icon={<Lightbulb20Regular />}
          appearance="primary"
          size="small"
          onClick={() => setRun(true)}
          style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, borderRadius: 20, boxShadow: '0 4px 12px rgba(102,126,234,0.3)' }}
        >
          Take a Tour
        </Button>
      )}
      <Joyride
        steps={steps}
        run={run}
        continuous
        scrollToFirstStep
        onEvent={onEvent}
      />
    </>
  )
}
