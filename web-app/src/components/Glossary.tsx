import { useState, useMemo } from 'react'
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Badge,
  Input,
} from '@fluentui/react-components'
import { Search20Regular, Dismiss20Regular } from '@fluentui/react-icons'

interface GlossaryTerm {
  abbreviation: string
  fullName: string
  definition: string
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    abbreviation: 'ADR',
    fullName: 'Architecture Decision Record',
    definition:
      'A document that captures an important architectural decision made along with its context and consequences. Used to track and communicate design choices.',
  },
  {
    abbreviation: 'AZ',
    fullName: 'Availability Zone',
    definition:
      'Physically separate locations within an Azure region, each with independent power, cooling, and networking, designed to protect against datacenter-level failures.',
  },
  {
    abbreviation: 'BCDR',
    fullName: 'Business Continuity and Disaster Recovery',
    definition:
      'A comprehensive strategy that combines business continuity planning with disaster recovery procedures to ensure an organization can maintain operations and recover from disruptions.',
  },
  {
    abbreviation: 'BCP',
    fullName: 'Business Continuity Plan',
    definition:
      'A documented plan that outlines how a business will continue operating during and after a disruptive event. It includes procedures, resources, and responsibilities needed to maintain critical business functions.',
  },
  {
    abbreviation: 'BIA',
    fullName: 'Business Impact Analysis',
    definition:
      'A systematic process for evaluating the potential effects of disruption to critical business operations. It identifies critical functions, quantifies potential losses, and establishes recovery priorities.',
  },
  {
    abbreviation: 'CAF',
    fullName: 'Cloud Adoption Framework',
    definition:
      "Microsoft's proven guidance designed to help organizations create and implement strategies for cloud adoption, providing best practices, documentation, and tools.",
  },
  {
    abbreviation: 'CSLO',
    fullName: 'Composite Service Level Objective',
    definition:
      "An overall availability target calculated from the individual SLOs of all services in an application's dependency chain.",
  },
  {
    abbreviation: 'DDoS',
    fullName: 'Distributed Denial of Service',
    definition:
      'A cyber attack where multiple compromised systems flood a target with traffic, making it unavailable to legitimate users. DDoS protection is a key security control in BCDR planning.',
  },
  {
    abbreviation: 'DR',
    fullName: 'Disaster Recovery',
    definition:
      'The process, policies, and procedures related to preparing for recovery or continuation of technology infrastructure critical to an organization after a natural or human-induced disaster.',
  },
  {
    abbreviation: 'DRaaS',
    fullName: 'Disaster Recovery as a Service',
    definition:
      'A cloud-based service model that enables organizations to back up data and IT infrastructure in a third-party cloud environment and provide disaster recovery orchestration.',
  },
  {
    abbreviation: 'FTA',
    fullName: 'Fault Tree Analysis',
    definition:
      'A top-down, deductive analysis method used to identify potential causes of system failures. It uses a graphical model (fault tree) to map relationships between events and their contributing factors.',
  },
  {
    abbreviation: 'HA',
    fullName: 'High Availability',
    definition:
      'A characteristic of a system that aims to ensure an agreed level of operational performance, usually uptime, for a higher than normal period.',
  },
  {
    abbreviation: 'IaC',
    fullName: 'Infrastructure as Code',
    definition:
      'The practice of managing and provisioning computing infrastructure through machine-readable definition files, rather than manual configuration or interactive tools.',
  },
  {
    abbreviation: 'ISO 22301',
    fullName: 'Business Continuity Management Systems',
    definition:
      'An international standard for business continuity management systems, specifying requirements to plan, establish, implement, operate, monitor, review, maintain, and continually improve a management system to protect against, reduce the likelihood of, and ensure recovery from disruptive incidents.',
  },
  {
    abbreviation: 'MBCO',
    fullName: 'Minimum Business Continuity Objective',
    definition:
      'The minimum number of applications and business functions that must be available before maximum tolerable downtime is reached for the business to achieve its objectives during a disruption.',
  },
  {
    abbreviation: 'MTD',
    fullName: 'Maximum Tolerable Downtime',
    definition:
      'The maximum period of time that a business function or process can be disrupted before the impact becomes unacceptable to the organization.',
  },
  {
    abbreviation: 'NIST',
    fullName: 'National Institute of Standards and Technology',
    definition:
      'A U.S. federal agency that develops standards and guidelines for various industries, including cybersecurity and disaster recovery frameworks.',
  },
  {
    abbreviation: 'RACI',
    fullName: 'Responsible, Accountable, Consulted, Informed',
    definition:
      'A matrix used in project management to clarify roles and responsibilities for tasks. Responsible does the work, Accountable owns it, Consulted provides input, Informed is kept updated.',
  },
  {
    abbreviation: 'RPA',
    fullName: 'Recovery Point Actual',
    definition:
      'The actual point in time to which data was recovered after a disaster, measured against the RPO to assess recovery effectiveness.',
  },
  {
    abbreviation: 'RPO',
    fullName: 'Recovery Point Objective',
    definition:
      'The maximum acceptable amount of data loss measured in time. It defines the point in time to which data must be recovered after a disruption.',
  },
  {
    abbreviation: 'RTA',
    fullName: 'Recovery Time Actual',
    definition:
      'The actual time taken to recover systems and resume operations after a disaster, measured against the RTO to assess recovery performance.',
  },
  {
    abbreviation: 'RTO',
    fullName: 'Recovery Time Objective',
    definition:
      'The maximum acceptable length of time that a system, application, or function can be down after a failure or disaster occurs before the impact is unacceptable.',
  },
  {
    abbreviation: 'SLA',
    fullName: 'Service Level Agreement',
    definition:
      'A formal agreement between a service provider and customer that defines the level of service expected, including availability, performance, and support commitments.',
  },
  {
    abbreviation: 'SLI',
    fullName: 'Service Level Indicator',
    definition:
      'A quantitative measure of some aspect of the level of service being provided, such as request latency, error rate, or throughput.',
  },
  {
    abbreviation: 'SLO',
    fullName: 'Service Level Objective',
    definition:
      'A target value or range of values for a service level measured by an SLI. It represents the reliability target that a service aims to achieve.',
  },
  {
    abbreviation: 'SRE',
    fullName: 'Site Reliability Engineering',
    definition:
      'A discipline that applies software engineering principles to IT operations, focused on building and running reliable, scalable systems.',
  },
  {
    abbreviation: 'TCO',
    fullName: 'Total Cost of Ownership',
    definition:
      'A comprehensive assessment of all direct and indirect costs associated with owning and operating a system or service over its entire lifecycle.',
  },
  {
    abbreviation: 'UAT',
    fullName: 'User Acceptance Testing',
    definition:
      'A phase of testing where end users validate that a system meets their requirements and functions correctly in real-world scenarios before final acceptance.',
  },
  {
    abbreviation: 'WAF',
    fullName: 'Well-Architected Framework',
    definition:
      "Microsoft Azure's framework providing architectural best practices across five pillars: reliability, security, cost optimization, operational excellence, and performance efficiency.",
  },
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

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
    marginBottom: '24px',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  searchInput: {
    minWidth: '280px',
    maxWidth: '480px',
    flex: 1,
  },
  countText: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '16px',
  },
  letterNav: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '24px',
  },
  letterButton: {
    width: '34px',
    height: '34px',
    ...shorthands.borderRadius('8px'),
    ...shorthands.border('1px', 'solid', '#e2e8f0'),
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'all',
    transitionDuration: '0.15s',
    ':hover': {
      backgroundColor: '#667eea',
      color: '#ffffff',
      ...shorthands.borderColor('#667eea'),
    },
  },
  letterButtonActive: {
    backgroundColor: '#667eea',
    color: '#ffffff',
    ...shorthands.borderColor('#667eea'),
  },
  letterButtonDisabled: {
    opacity: 0.35,
    cursor: 'default',
    ':hover': {
      backgroundColor: '#ffffff',
      color: tokens.colorNeutralForeground2,
      ...shorthands.borderColor('#e2e8f0'),
    },
  },
  letterSection: {
    marginBottom: '24px',
  },
  letterHeader: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#667eea',
    marginBottom: '12px',
    ...shorthands.padding('4px', '0'),
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#667eea20',
  },
  termGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '12px',
  },
  card: {
    ...shorthands.padding('20px'),
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  cardFullName: {
    fontSize: '16px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  cardDefinition: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
  },
  noResults: {
    textAlign: 'center' as const,
    ...shorthands.padding('48px', '24px'),
    color: tokens.colorNeutralForeground3,
    fontSize: '16px',
  },
})

export default function Glossary() {
  const styles = useStyles()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return GLOSSARY_TERMS
    const q = searchQuery.toLowerCase()
    return GLOSSARY_TERMS.filter(
      (t) =>
        t.abbreviation.toLowerCase().includes(q) ||
        t.fullName.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q),
    )
  }, [searchQuery])

  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>()
    for (const term of filteredTerms) {
      const letter = term.abbreviation[0].toUpperCase()
      if (!map.has(letter)) map.set(letter, [])
      map.get(letter)!.push(term)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredTerms])

  const activeLetters = useMemo(
    () => new Set(grouped.map(([letter]) => letter)),
    [grouped],
  )

  const scrollToLetter = (letter: string) => {
    document.getElementById(`glossary-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Glossary</h1>
      <p className={styles.description}>
        A comprehensive glossary of Business Continuity and Disaster Recovery (BCDR)
        terminology. Use the search bar to find specific terms or browse alphabetically.
      </p>

      <div className={styles.searchRow}>
        <Input
          className={styles.searchInput}
          placeholder="Search terms, definitions..."
          value={searchQuery}
          onChange={(_e, data) => setSearchQuery(data.value)}
          contentBefore={<Search20Regular />}
          contentAfter={
            searchQuery ? (
              <Dismiss20Regular
                style={{ cursor: 'pointer' }}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              />
            ) : undefined
          }
        />
      </div>

      <div className={styles.countText}>
        Showing {filteredTerms.length} of {GLOSSARY_TERMS.length} terms
      </div>

      <div className={styles.letterNav}>
        {ALPHABET.map((letter) => {
          const isActive = activeLetters.has(letter)
          return (
            <button
              key={letter}
              className={`${styles.letterButton} ${isActive ? '' : styles.letterButtonDisabled}`}
              onClick={() => isActive && scrollToLetter(letter)}
              aria-label={`Jump to ${letter}`}
              disabled={!isActive}
            >
              {letter}
            </button>
          )
        })}
      </div>

      {grouped.length === 0 ? (
        <div className={styles.noResults}>
          No terms match &ldquo;{searchQuery}&rdquo;. Try a different search.
        </div>
      ) : (
        grouped.map(([letter, terms]) => (
          <div key={letter} id={`glossary-${letter}`} className={styles.letterSection}>
            <div className={styles.letterHeader}>{letter}</div>
            <div className={styles.termGrid}>
              {terms.map((term) => (
                <Card key={term.abbreviation} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <Badge appearance="filled" color="brand">
                      {term.abbreviation}
                    </Badge>
                    <span className={styles.cardFullName}>{term.fullName}</span>
                  </div>
                  <div className={styles.cardDefinition}>{term.definition}</div>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
