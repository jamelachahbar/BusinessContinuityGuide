/**
 * Guided Tour with custom styled tooltip matching our brand.
 */

import { useCallback } from 'react'
import { Joyride, STATUS, type EventData, type TooltipRenderProps } from 'react-joyride'

/* ═══════ Step definitions ═══════ */

const brandStep = {
  primaryColor: '#667eea',
  backgroundColor: '#ffffff',
  textColor: '#1a202c',
  arrowColor: '#ffffff',
  overlayColor: 'rgba(26, 32, 44, 0.55)',
  spotlightRadius: 12,
}

const steps = [
  { ...brandStep, target: '[data-tour="sidebar"]', content: 'Navigate between phases, references, and settings. Click the bolt icon to collapse.', title: 'Navigation', placement: 'right' as const },
  { ...brandStep, target: '[data-tour="toolbar"]', content: 'Export as CSV, PDF (ISO 22301), JSON backup. Import data or start the tour again.', title: 'Export & Import', placement: 'bottom' as const },
  { ...brandStep, target: '[data-tour="phase1"]', content: 'Define your BCDR framework: criticality model, business commitments, RACI matrix, and test plans.', title: 'Phase 1: Prepare', placement: 'right' as const },
  { ...brandStep, target: '[data-tour="phase2"]', content: 'Per-solution continuity: requirements, service map, BIA, gap analysis, cost comparison, and failover testing.', title: 'Phase 2: Solution Continuity', placement: 'right' as const },
  { ...brandStep, target: '[data-tour="phase3"]', content: 'BCP checklist, 5x5 risk matrix, MBCO recovery order, BCDR dashboard, and maintenance schedule.', title: 'Phase 3: Business Continuity', placement: 'right' as const },
  { ...brandStep, target: '[data-tour="settings"]', content: 'Organization, workload description, contact details, date format, and currency for reports.', title: 'Settings', placement: 'right' as const },
]

/* ═══════ Custom Tooltip ═══════ */

function CustomTooltip({ step, index, size, isLastStep, backProps, primaryProps, skipProps, closeProps }: TooltipRenderProps) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(102, 126, 234, 0.25), 0 4px 12px rgba(0,0,0,0.08)',
      maxWidth: '380px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Header with gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700 }}>
          {step.title as string}
        </div>
        <button
          {...closeProps}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '20px', fontSize: '14px', lineHeight: '1.6', color: '#1a202c' }}>
        {step.content as string}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid #f1f5f9',
      }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {Array.from({ length: size }, (_, i) => (
            <div
              key={i}
              style={{
                width: i === index ? '20px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === index ? '#667eea' : i < index ? '#764ba2' : '#e2e8f0',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
          <span style={{ fontSize: '11px', color: '#a0aec0', marginLeft: '8px' }}>
            {index + 1} / {size}
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {index === 0 && (
            <button
              {...skipProps}
              style={{
                background: 'none',
                border: 'none',
                color: '#a0aec0',
                fontSize: '13px',
                cursor: 'pointer',
                padding: '6px 12px',
              }}
            >
              Skip
            </button>
          )}
          {index > 0 && (
            <button
              {...backProps}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#667eea',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          )}
          <button
            {...primaryProps}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
            }}
          >
            {isLastStep ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════ Component ═══════ */

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
      tooltipComponent={CustomTooltip}
      onEvent={onEvent}
    />
  )
}
