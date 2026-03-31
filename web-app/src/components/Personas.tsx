import { Fragment } from 'react'
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Badge,
} from '@fluentui/react-components'

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '36px',
    fontWeight: '600',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
  },
  description: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    marginBottom: '32px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
  },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  card: {
    ...shorthands.padding('20px'),
    height: '100%',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  cardIcon: {
    width: '40px',
    height: '40px',
    ...shorthands.borderRadius('10px'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
    color: '#ffffff',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: tokens.colorBrandForeground1,
  },
  cardDesc: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.5',
    marginBottom: '12px',
  },
  cardList: {
    marginLeft: '20px',
    marginTop: '0',
    marginBottom: '0',
    paddingLeft: '0',
    listStyleType: 'disc',
    fontSize: '13px',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
  },
  tableWrap: {
    overflowX: 'auto',
    marginBottom: '16px',
    marginTop: '12px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  th: {
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: '600',
    textAlign: 'left',
    ...shorthands.padding('10px', '12px'),
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke1,
    whiteSpace: 'nowrap',
  },
  thCenter: {
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: '600',
    textAlign: 'center',
    ...shorthands.padding('10px', '12px'),
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke1,
    whiteSpace: 'nowrap',
  },
  td: {
    ...shorthands.padding('10px', '12px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    verticalAlign: 'top',
  },
  phaseRow: {
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: '600',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '16px',
    rowGap: '8px',
    marginBottom: '16px',
    ...shorthands.padding('12px', '16px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius('8px'),
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '6px',
    fontSize: '14px',
  },
  legendSwatch: {
    width: '20px',
    height: '20px',
    ...shorthands.borderRadius('4px'),
    display: 'inline-block',
  },
  raciR: {
    backgroundColor: '#003366',
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    ...shorthands.padding('8px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  raciA: {
    backgroundColor: '#336699',
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    ...shorthands.padding('8px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  raciC: {
    backgroundColor: '#6699CC',
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    ...shorthands.padding('8px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  raciI: {
    backgroundColor: '#99CCFF',
    color: '#1a1a1a',
    fontWeight: '600',
    textAlign: 'center',
    ...shorthands.padding('8px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  raciEmpty: {
    backgroundColor: tokens.colorNeutralBackground1,
    textAlign: 'center',
    ...shorthands.padding('8px'),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  workflowList: {
    marginLeft: '24px',
    marginTop: '12px',
    fontSize: '15px',
    lineHeight: '2',
    color: tokens.colorNeutralForeground2,
  },
  workflowStep: {
    marginBottom: '4px',
  },
  workflowBold: {
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
})

/* ────────────────────────────────────────────────────
   Role data
   ──────────────────────────────────────────────────── */

interface RoleInfo {
  name: string
  abbr: string
  color: string
  description: string
  activities: string[]
}

const roles: RoleInfo[] = [
  {
    name: 'Application Business Owner',
    abbr: 'AO',
    color: '#003366',
    description: 'Owns the application and business decisions. Accountable for aligning BCDR investments with business value and ensuring continuity requirements are met.',
    activities: [
      'Define application criticality classification',
      'Approve BCDR budget and resource allocation',
      'Sign off on recovery objectives (RTO/RPO)',
      'Own the overall BCDR response plan',
      'Ensure role assignments and accountability',
    ],
  },
  {
    name: 'Solution Architect',
    abbr: 'SA',
    color: '#336699',
    description: 'Designs technical solutions and architecture. Responsible for translating business requirements into resilient system designs and BCDR patterns.',
    activities: [
      'Design high-availability and DR architecture',
      'Create service maps and dependency analysis',
      'Define fault models and resilience strategies',
      'Conduct architecture gap assessments',
      'Lead technical design reviews for BCDR',
    ],
  },
  {
    name: 'Cloud Engineer / DevOps',
    abbr: 'CE',
    color: '#2e7d32',
    description: 'Implements and manages cloud infrastructure. Responsible for deploying, configuring, and maintaining BCDR solutions in the cloud environment.',
    activities: [
      'Implement IaC for DR environments',
      'Configure replication and failover mechanisms',
      'Execute continuity drills and failover tests',
      'Manage CI/CD pipelines for recovery',
      'Maintain infrastructure monitoring',
    ],
  },
  {
    name: 'Operations / SRE',
    abbr: 'OP',
    color: '#e65100',
    description: 'Monitors, maintains, and responds to incidents. Responsible for day-to-day operational continuity, incident response, and maintaining BCDR readiness.',
    activities: [
      'Monitor systems and respond to incidents',
      'Execute response plans during outages',
      'Maintain operational runbooks',
      'Track and report on BCDR metrics',
      'Coordinate outage communications',
    ],
  },
  {
    name: 'Security Engineer',
    abbr: 'SE',
    color: '#c62828',
    description: 'Ensures security controls and compliance. Responsible for maintaining security posture during normal operations and disaster recovery scenarios.',
    activities: [
      'Review security controls for BCDR scenarios',
      'Assess risks and vulnerabilities',
      'Ensure encryption and access controls in DR',
      'Validate security during failover tests',
      'Maintain DDoS and WAF protections',
    ],
  },
  {
    name: 'Compliance / Risk Manager',
    abbr: 'CR',
    color: '#6a1b9a',
    description: 'Manages regulatory compliance and risk. Responsible for ensuring BCDR practices meet regulatory requirements and organizational risk tolerance.',
    activities: [
      'Maintain BCP documentation and compliance',
      'Conduct business risk assessments',
      'Ensure regulatory requirements are met',
      'Review and approve contingency plans',
      'Track compliance audit findings',
    ],
  },
  {
    name: 'Business Stakeholder / Executive',
    abbr: 'BX',
    color: '#4527a0',
    description: 'Strategic decisions and funding. Responsible for approving business continuity strategies, funding BCDR initiatives, and executive-level oversight.',
    activities: [
      'Approve business continuity strategies',
      'Fund BCDR initiatives and programs',
      'Define business criticality priorities',
      'Review business impact analyses',
      'Sponsor enterprise-wide continuity',
    ],
  },
  {
    name: 'QA / Test Engineer',
    abbr: 'QA',
    color: '#00695c',
    description: 'Plans and executes testing. Responsible for validating BCDR solutions through structured test plans, UAT, and continuity drills.',
    activities: [
      'Develop and maintain BCDR test plans',
      'Execute UAT and acceptance testing',
      'Validate recovery procedures',
      'Document test results and findings',
      'Recommend improvements from test outcomes',
    ],
  },
]

/* ────────────────────────────────────────────────────
   RACI matrix columns (abbreviated role headers)
   ──────────────────────────────────────────────────── */

const raciColumns = ['App Owner', 'Architect', 'Cloud Eng', 'Ops/SRE', 'Security', 'Compliance', 'Business', 'QA']

/* ────────────────────────────────────────────────────
   RACI matrix data by phase
   ──────────────────────────────────────────────────── */

interface RaciRow {
  deliverable: string
  raci: string[] // 8 values: R, A, C, I, or ''
}

interface PhaseGroup {
  phase: string
  rows: RaciRow[]
}

const raciMatrix: PhaseGroup[] = [
  {
    phase: 'Phase 1: Prepare',
    rows: [
      { deliverable: 'Criticality Model', raci: ['A', 'C', 'I', 'I', 'C', 'C', 'R', 'I'] },
      { deliverable: 'Business Commitment Model', raci: ['A', 'R', 'C', 'C', 'C', 'C', 'A', 'I'] },
      { deliverable: 'Fault Model & Resilience', raci: ['C', 'R', 'C', 'C', 'C', 'I', 'I', 'I'] },
      { deliverable: 'RACI Matrix', raci: ['A', 'C', 'I', 'I', 'I', 'I', 'A', 'I'] },
      { deliverable: 'Application Requirements', raci: ['A', 'R', 'C', 'C', 'C', 'C', 'I', 'C'] },
      { deliverable: 'Test Plans', raci: ['C', 'C', 'C', 'C', 'I', 'I', 'I', 'R'] },
    ],
  },
  {
    phase: 'Phase 2: Assess',
    rows: [
      { deliverable: 'Requirements & ADR', raci: ['A', 'R', 'C', 'C', 'C', 'C', 'I', 'I'] },
      { deliverable: 'Service Map', raci: ['C', 'R', 'R', 'C', 'I', 'I', 'I', 'I'] },
      { deliverable: 'Business Impact Analysis', raci: ['A', 'C', 'I', 'C', 'I', 'C', 'R', 'I'] },
      { deliverable: 'Fault Tree Analysis', raci: ['C', 'R', 'C', 'C', 'I', 'I', 'I', 'C'] },
      { deliverable: 'Gap Assessment', raci: ['C', 'R', 'R', 'C', 'C', 'I', 'I', 'I'] },
      { deliverable: 'Metric Analysis', raci: ['C', 'R', 'C', 'R', 'C', 'I', 'I', 'I'] },
    ],
  },
  {
    phase: 'Phase 2: Implement',
    rows: [
      { deliverable: 'Response Plan', raci: ['A', 'R', 'C', 'R', 'C', 'I', 'I', 'I'] },
      { deliverable: 'Architecture Design (+BCDR)', raci: ['C', 'R', 'R', 'C', 'C', 'I', 'I', 'I'] },
      { deliverable: 'Cost Comparison', raci: ['A', 'C', 'C', 'I', 'I', 'I', 'R', 'I'] },
      { deliverable: 'Contingency Plan', raci: ['A', 'C', 'I', 'R', 'I', 'C', 'R', 'I'] },
      { deliverable: 'Role Assignment', raci: ['A', 'I', 'I', 'I', 'I', 'I', 'A', 'I'] },
    ],
  },
  {
    phase: 'Phase 2: Test',
    rows: [
      { deliverable: 'Test Summary', raci: ['C', 'I', 'C', 'C', 'I', 'I', 'I', 'R'] },
      { deliverable: 'Continuity Drill', raci: ['A', 'C', 'R', 'R', 'I', 'I', 'I', 'C'] },
      { deliverable: 'UAT Test Plan', raci: ['C', 'I', 'I', 'I', 'I', 'I', 'I', 'R'] },
      { deliverable: 'Outage Communication', raci: ['A', 'I', 'I', 'R', 'I', 'I', 'R', 'I'] },
      { deliverable: 'Maintain App Continuity', raci: ['A', 'C', 'C', 'R', 'I', 'I', 'I', 'I'] },
    ],
  },
  {
    phase: 'Phase 3: Business Continuity',
    rows: [
      { deliverable: 'BCP Document', raci: ['C', 'C', 'I', 'C', 'C', 'R', 'A', 'I'] },
      { deliverable: 'Business Risk Assessment', raci: ['C', 'C', 'I', 'I', 'R', 'R', 'A', 'I'] },
      { deliverable: 'MBCO Planning', raci: ['A', 'R', 'C', 'C', 'I', 'C', 'A', 'I'] },
      { deliverable: 'Critical Function Calendar', raci: ['C', 'I', 'I', 'R', 'I', 'C', 'A', 'I'] },
      { deliverable: 'BIA Portfolio Summary', raci: ['C', 'C', 'I', 'C', 'I', 'R', 'A', 'I'] },
      { deliverable: 'BCDR Dashboard', raci: ['C', 'C', 'C', 'R', 'C', 'I', 'A', 'I'] },
      { deliverable: 'Maintain Business Continuity', raci: ['C', 'I', 'I', 'R', 'I', 'R', 'A', 'I'] },
    ],
  },
]

/* ────────────────────────────────────────────────────
   Helper
   ──────────────────────────────────────────────────── */

const raciStyleMap: Record<string, 'raciR' | 'raciA' | 'raciC' | 'raciI' | 'raciEmpty'> = {
  R: 'raciR',
  A: 'raciA',
  C: 'raciC',
  I: 'raciI',
}

/* ────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────── */

function Personas() {
  const styles = useStyles()

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Personas — BCDR by Role &amp; Task</h1>
      <p className={styles.description}>
        Business continuity and disaster recovery is a cross-functional effort. This page maps eight
        key personas to their responsibilities across all three phases of the ABC Guide, using a RACI
        matrix to clarify accountability for every deliverable.
      </p>

      {/* ── Role Cards ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Key Roles</h2>
        <div className={styles.roleGrid}>
          {roles.map((role) => (
            <Card key={role.abbr} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon} style={{ backgroundColor: role.color }}>
                  {role.abbr}
                </div>
                <span className={styles.cardTitle}>{role.name}</span>
              </div>
              <p className={styles.cardDesc}>{role.description}</p>
              <ul className={styles.cardList}>
                {role.activities.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>

      {/* ── RACI Matrix ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>RACI Task Matrix</h2>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{ backgroundColor: '#003366' }} />
            <span><strong>R</strong> — Responsible (does the work)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{ backgroundColor: '#336699' }} />
            <span><strong>A</strong> — Accountable (owns the outcome)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{ backgroundColor: '#6699CC' }} />
            <span><strong>C</strong> — Consulted (provides input)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{ backgroundColor: '#99CCFF' }} />
            <span><strong>I</strong> — Informed (kept up to date)</span>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Deliverable</th>
                {raciColumns.map((col) => (
                  <th key={col} className={styles.thCenter}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {raciMatrix.map((group) => (
                <Fragment key={group.phase}>
                  <tr>
                    <td className={`${styles.td} ${styles.phaseRow}`} colSpan={9}>
                      {group.phase}
                    </td>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={`${group.phase}-${row.deliverable}`}>
                      <td className={styles.td}>{row.deliverable}</td>
                      {row.raci.map((val, i) => (
                        <td key={i} className={styles[raciStyleMap[val] ?? 'raciEmpty']}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: '13px', color: tokens.colorNeutralForeground3 }}>
          <Badge appearance="filled" color="informative" size="small">
            {raciMatrix.reduce((sum, g) => sum + g.rows.length, 0)}
          </Badge>{' '}
          deliverables across {raciMatrix.length} phase groups &middot;{' '}
          {raciColumns.length} roles
        </p>
      </div>

      {/* ── Workflow Guide ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recommended Workflow</h2>
        <ol className={styles.workflowList}>
          <li className={styles.workflowStep}>
            <span className={styles.workflowBold}>Executives &amp; Business Owners</span> define
            criticality levels and business commitments{' '}
            <Badge appearance="outline" size="small">Phase 1</Badge>
          </li>
          <li className={styles.workflowStep}>
            <span className={styles.workflowBold}>Architects &amp; Engineers</span> assess
            applications — service maps, fault trees, gap analysis{' '}
            <Badge appearance="outline" size="small">Phase 2 Assess</Badge>
          </li>
          <li className={styles.workflowStep}>
            <span className={styles.workflowBold}>Cross-functional teams</span> implement BCDR
            solutions — architecture design, response plans, contingency planning{' '}
            <Badge appearance="outline" size="small">Phase 2 Implement</Badge>
          </li>
          <li className={styles.workflowStep}>
            <span className={styles.workflowBold}>QA &amp; Operations</span> validate through
            continuity drills, UAT, and test summaries{' '}
            <Badge appearance="outline" size="small">Phase 2 Test</Badge>
          </li>
          <li className={styles.workflowStep}>
            <span className={styles.workflowBold}>Business Stakeholders &amp; Compliance</span>{' '}
            coordinate enterprise business continuity — BCP, risk assessments, MBCO planning{' '}
            <Badge appearance="outline" size="small">Phase 3</Badge>
          </li>
        </ol>
      </div>
    </div>
  )
}

export default Personas
