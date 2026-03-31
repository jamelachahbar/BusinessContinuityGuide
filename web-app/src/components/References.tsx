import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Badge,
} from '@fluentui/react-components'
import { Open16Regular } from '@fluentui/react-icons'

interface ReferenceLink {
  title: string
  url: string
  description: string
}

interface ReferenceCategory {
  name: string
  color: string
  links: ReferenceLink[]
}

const REFERENCE_CATEGORIES: ReferenceCategory[] = [
  {
    name: 'Azure Architecture & Reliability',
    color: '#667eea',
    links: [
      {
        title: 'Azure Well-Architected Framework — Reliability Pillar',
        url: 'https://learn.microsoft.com/azure/well-architected/reliability/',
        description:
          'Design principles and best practices for building reliable Azure workloads',
      },
      {
        title: 'Failure mode analysis for Azure applications',
        url: 'https://learn.microsoft.com/azure/architecture/resiliency/failure-mode-analysis',
        description:
          'Guide to analyzing failure modes and designing resilient applications',
      },
      {
        title: 'Azure regions and availability zones',
        url: 'https://learn.microsoft.com/azure/reliability/availability-zones-overview',
        description:
          "Understanding Azure's physical infrastructure for high availability",
      },
      {
        title:
          'Architect Azure applications for resiliency and availability',
        url: 'https://learn.microsoft.com/azure/architecture/reliability/architect',
        description:
          'Architectural guidance for resilient Azure applications',
      },
    ],
  },
  {
    name: 'Business Continuity Planning',
    color: '#764ba2',
    links: [
      {
        title: 'Business criticality in cloud management',
        url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/manage/considerations/criticality',
        description:
          'Framework for classifying application criticality and directing investment',
      },
      {
        title: 'Developing your Enterprise BCDR Plan',
        url: 'https://learn.microsoft.com/compliance/assurance/assurance-developing-your-ebcm-plan',
        description:
          "Microsoft's guidance on developing enterprise business continuity plans",
      },
      {
        title: 'Azure Business Continuity Guide (Excel)',
        url: 'https://github.com/Azure/BusinessContinuityGuide/releases',
        description:
          'Download the latest version of the ABC Guide workbook',
      },
    ],
  },
  {
    name: 'Disaster Recovery',
    color: '#e53e3e',
    links: [
      {
        title: 'Azure to Azure disaster recovery architecture',
        url: 'https://learn.microsoft.com/azure/site-recovery/azure-to-azure-architecture',
        description:
          'Architecture for Azure Site Recovery between regions',
      },
      {
        title: 'About Azure Site Recovery',
        url: 'https://learn.microsoft.com/azure/site-recovery/site-recovery-overview',
        description: "Overview of Azure's disaster recovery service",
      },
      {
        title: 'Azure Backup overview',
        url: 'https://learn.microsoft.com/azure/backup/backup-overview',
        description:
          'Comprehensive backup solutions for Azure and hybrid workloads',
      },
    ],
  },
  {
    name: 'Monitoring & Operations',
    color: '#38a169',
    links: [
      {
        title: 'Application Insights overview',
        url: 'https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview',
        description:
          'Application performance monitoring and dependency tracking',
      },
      {
        title: 'Application Insights Application Map',
        url: 'https://learn.microsoft.com/azure/azure-monitor/app/app-map',
        description: 'Visualize application dependencies and topology',
      },
      {
        title: 'VM Insights Service Map',
        url: 'https://learn.microsoft.com/azure/azure-monitor/vm/vminsights-maps',
        description:
          'Discover network dependencies for virtual machines',
      },
      {
        title: 'Azure Service Health',
        url: 'https://learn.microsoft.com/azure/service-health/overview',
        description:
          'Monitor Azure service health and planned maintenance',
      },
    ],
  },
  {
    name: 'Security',
    color: '#d69e2e',
    links: [
      {
        title: 'Azure DDoS Protection overview',
        url: 'https://learn.microsoft.com/azure/ddos-protection/ddos-protection-overview',
        description:
          'Protection against distributed denial-of-service attacks',
      },
      {
        title: 'Azure Web Application Firewall',
        url: 'https://learn.microsoft.com/azure/web-application-firewall/overview',
        description:
          'Protect web applications from common exploits',
      },
      {
        title: 'Microsoft security best practices',
        url: 'https://learn.microsoft.com/security/compass/compass',
        description:
          'Comprehensive security guidance from Microsoft',
      },
    ],
  },
  {
    name: 'Cloud Adoption Framework',
    color: '#3182ce',
    links: [
      {
        title: 'Microsoft Cloud Adoption Framework',
        url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/',
        description: 'Proven guidance for cloud adoption journey',
      },
      {
        title: 'CAF — Manage methodology',
        url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/manage/',
        description: 'Cloud management and operations guidance',
      },
      {
        title: 'Azure landing zone review',
        url: 'https://aka.ms/review-checklists',
        description:
          'Review checklists for Azure landing zone assessments',
      },
    ],
  },
  {
    name: 'Testing & Validation',
    color: '#dd6b20',
    links: [
      {
        title:
          'Recommendations for designing a reliability testing strategy',
        url: 'https://learn.microsoft.com/azure/well-architected/reliability/testing-strategy',
        description: 'WAF guidance on reliability testing strategies',
      },
      {
        title: 'Azure Chaos Studio',
        url: 'https://learn.microsoft.com/azure/chaos-studio/chaos-studio-overview',
        description:
          'Controlled chaos engineering experiments on Azure',
      },
      {
        title: "Testing your application's availability",
        url: 'https://learn.microsoft.com/azure/architecture/checklist/resiliency-per-service',
        description: 'Per-service resiliency checklist',
      },
    ],
  },
]

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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(520px, 1fr))',
    gap: '24px',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  card: {
    ...shorthands.padding('24px'),
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#f0f0f0',
  },
  categoryName: {
    fontSize: '18px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  linkItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  linkIcon: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '3px',
    color: '#667eea',
    flexShrink: 0,
  },
  linkContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  linkTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
      color: '#764ba2',
    },
  },
  linkDescription: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    lineHeight: '1.5',
  },
  totalCount: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '24px',
  },
})

export default function References() {
  const styles = useStyles()

  const totalLinks = REFERENCE_CATEGORIES.reduce(
    (sum, cat) => sum + cat.links.length,
    0,
  )

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>References</h1>
      <p className={styles.description}>
        Curated links to Microsoft documentation, Azure architecture guidance,
        and industry standards for business continuity and disaster recovery
        planning.
      </p>
      <p className={styles.totalCount}>
        {totalLinks} resources across {REFERENCE_CATEGORIES.length} categories
      </p>

      <div className={styles.grid}>
        {REFERENCE_CATEGORIES.map((category) => (
          <Card key={category.name} className={styles.card}>
            <div className={styles.cardHeader}>
              <Badge
                size="small"
                appearance="filled"
                style={{ backgroundColor: category.color }}
              >
                {category.links.length}
              </Badge>
              <span className={styles.categoryName}>{category.name}</span>
            </div>

            <div className={styles.linkList}>
              {category.links.map((link) => (
                <div key={link.url} className={styles.linkItem}>
                  <span className={styles.linkIcon}>
                    <Open16Regular />
                  </span>
                  <div className={styles.linkContent}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkTitle}
                    >
                      {link.title}
                    </a>
                    <span className={styles.linkDescription}>
                      {link.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
