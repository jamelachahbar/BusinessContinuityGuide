/**
 * Guided Tour using react-joyride v3.
 * Single instance approach: the parent passes `run` state via props.
 */

import { useCallback } from 'react'
import { Joyride, STATUS, type EventData } from 'react-joyride'

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
    content: 'Define your BCDR framework: criticality model, business commitments, RACI, and test plans.',
    title: 'Phase 1: Prepare',
    placement: 'right' as const,
  },
  {
    target: '[data-tour="phase2"]',
    content: 'Per-solution continuity: requirements, service map, BIA, gap analysis, cost comparison, failover testing.',
    title: 'Phase 2: Solution Continuity',
    placement: 'right' as const,
  },
  {
    target: '[data-tour="phase3"]',
    content: 'BCP checklist, risk matrix, MBCO recovery order, and BCDR dashboard.',
    title: 'Phase 3: Business Continuity',
    placement: 'right' as const,
  },
  {
    target: '[data-tour="settings"]',
    content: 'Organization, workload description, contact, date format, currency. All used in the PDF report.',
    title: 'Settings',
    placement: 'right' as const,
  },
]

interface Props {
  run: boolean
  onFinish: () => void
}

export default function GuidedTour({ run, onFinish }: Props) {
  const onEvent = useCallback((data: EventData) => {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      onFinish()
      localStorage.setItem('abcg_tour-seen', '1')
    }
  }, [onFinish])

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={onEvent}
    />
  )
}
