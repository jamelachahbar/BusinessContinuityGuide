/**
 * Azure Service Catalog — comprehensive list of Azure services grouped by category.
 * Used in Service Map for quick selection and in Gap Assessment / Architecture Design.
 *
 * Categories follow the Azure portal's service classification.
 */

export interface AzureService {
  name: string
  category: string
}

export const AZURE_CATEGORIES = [
  'Identity',
  'Networking',
  'Compute',
  'Containers',
  'Databases',
  'Storage',
  'Messaging',
  'Security',
  'Monitoring',
  'AI + Machine Learning',
  'Analytics',
  'Integration',
  'DevOps',
  'Management',
] as const

export type AzureCategory = typeof AZURE_CATEGORIES[number]

export const AZURE_SERVICES: AzureService[] = [
  // Identity
  { name: 'Microsoft Entra ID', category: 'Identity' },
  { name: 'Microsoft Entra External ID', category: 'Identity' },
  { name: 'Azure AD B2C', category: 'Identity' },
  { name: 'Managed Identities', category: 'Identity' },

  // Networking
  { name: 'Azure Front Door', category: 'Networking' },
  { name: 'Azure Traffic Manager', category: 'Networking' },
  { name: 'Azure Application Gateway', category: 'Networking' },
  { name: 'Azure Load Balancer', category: 'Networking' },
  { name: 'Azure DNS', category: 'Networking' },
  { name: 'Azure CDN', category: 'Networking' },
  { name: 'Azure Firewall', category: 'Networking' },
  { name: 'Azure Virtual Network', category: 'Networking' },
  { name: 'Azure VPN Gateway', category: 'Networking' },
  { name: 'Azure ExpressRoute', category: 'Networking' },
  { name: 'Azure Private Link', category: 'Networking' },
  { name: 'Azure DDoS Protection', category: 'Networking' },
  { name: 'Azure Bastion', category: 'Networking' },
  { name: 'Azure NAT Gateway', category: 'Networking' },

  // Compute
  { name: 'Azure App Service', category: 'Compute' },
  { name: 'Azure Functions', category: 'Compute' },
  { name: 'Azure Virtual Machines', category: 'Compute' },
  { name: 'Azure VM Scale Sets', category: 'Compute' },
  { name: 'Azure Static Web Apps', category: 'Compute' },
  { name: 'Azure Batch', category: 'Compute' },
  { name: 'Azure Spring Apps', category: 'Compute' },
  { name: 'Azure Cloud Services', category: 'Compute' },

  // Containers
  { name: 'Azure Kubernetes Service (AKS)', category: 'Containers' },
  { name: 'Azure Container Apps', category: 'Containers' },
  { name: 'Azure Container Instances', category: 'Containers' },
  { name: 'Azure Container Registry', category: 'Containers' },
  { name: 'Azure Red Hat OpenShift', category: 'Containers' },

  // Databases
  { name: 'Azure SQL Database', category: 'Databases' },
  { name: 'Azure SQL Managed Instance', category: 'Databases' },
  { name: 'Azure Cosmos DB', category: 'Databases' },
  { name: 'Azure Database for PostgreSQL', category: 'Databases' },
  { name: 'Azure Database for MySQL', category: 'Databases' },
  { name: 'Azure Cache for Redis', category: 'Databases' },
  { name: 'Azure Database for MariaDB', category: 'Databases' },
  { name: 'Azure Managed Instance for Apache Cassandra', category: 'Databases' },

  // Storage
  { name: 'Azure Blob Storage', category: 'Storage' },
  { name: 'Azure Files', category: 'Storage' },
  { name: 'Azure Queue Storage', category: 'Storage' },
  { name: 'Azure Table Storage', category: 'Storage' },
  { name: 'Azure Data Lake Storage', category: 'Storage' },
  { name: 'Azure Managed Disks', category: 'Storage' },
  { name: 'Azure NetApp Files', category: 'Storage' },

  // Messaging
  { name: 'Azure Service Bus', category: 'Messaging' },
  { name: 'Azure Event Hubs', category: 'Messaging' },
  { name: 'Azure Event Grid', category: 'Messaging' },
  { name: 'Azure Notification Hubs', category: 'Messaging' },
  { name: 'Azure SignalR Service', category: 'Messaging' },
  { name: 'Azure Web PubSub', category: 'Messaging' },

  // Security
  { name: 'Azure Key Vault', category: 'Security' },
  { name: 'Microsoft Defender for Cloud', category: 'Security' },
  { name: 'Azure Sentinel (Microsoft Sentinel)', category: 'Security' },
  { name: 'Azure Web Application Firewall', category: 'Security' },
  { name: 'Azure Information Protection', category: 'Security' },
  { name: 'Azure Confidential Computing', category: 'Security' },

  // Monitoring
  { name: 'Azure Monitor', category: 'Monitoring' },
  { name: 'Application Insights', category: 'Monitoring' },
  { name: 'Log Analytics', category: 'Monitoring' },
  { name: 'Azure Service Health', category: 'Monitoring' },
  { name: 'Azure Advisor', category: 'Monitoring' },
  { name: 'Azure Resource Graph', category: 'Monitoring' },
  { name: 'Azure Network Watcher', category: 'Monitoring' },

  // AI + ML
  { name: 'Azure OpenAI Service', category: 'AI + Machine Learning' },
  { name: 'Azure AI Services', category: 'AI + Machine Learning' },
  { name: 'Azure Machine Learning', category: 'AI + Machine Learning' },
  { name: 'Azure AI Search', category: 'AI + Machine Learning' },
  { name: 'Azure Bot Service', category: 'AI + Machine Learning' },

  // Analytics
  { name: 'Azure Synapse Analytics', category: 'Analytics' },
  { name: 'Azure Data Factory', category: 'Analytics' },
  { name: 'Azure Databricks', category: 'Analytics' },
  { name: 'Azure Stream Analytics', category: 'Analytics' },
  { name: 'Azure Data Explorer', category: 'Analytics' },
  { name: 'Microsoft Fabric', category: 'Analytics' },
  { name: 'Power BI', category: 'Analytics' },

  // Integration
  { name: 'Azure API Management', category: 'Integration' },
  { name: 'Azure Logic Apps', category: 'Integration' },
  { name: 'Azure Service Bus (Integration)', category: 'Integration' },

  // DevOps
  { name: 'Azure DevOps', category: 'DevOps' },
  { name: 'GitHub Actions (Azure)', category: 'DevOps' },
  { name: 'Azure Pipelines', category: 'DevOps' },
  { name: 'Azure Repos', category: 'DevOps' },
  { name: 'Azure Artifacts', category: 'DevOps' },

  // Management
  { name: 'Azure Resource Manager', category: 'Management' },
  { name: 'Azure Policy', category: 'Management' },
  { name: 'Azure Blueprints', category: 'Management' },
  { name: 'Azure Cost Management', category: 'Management' },
  { name: 'Azure Automation', category: 'Management' },
  { name: 'Azure Site Recovery', category: 'Management' },
  { name: 'Azure Backup', category: 'Management' },
  { name: 'Azure Lighthouse', category: 'Management' },
  { name: 'Azure Arc', category: 'Management' },
]

/** Get services filtered by category */
export function getServicesByCategory(category: string): AzureService[] {
  return AZURE_SERVICES.filter(s => s.category === category)
}

/** Search services by name (case-insensitive) */
export function searchServices(query: string): AzureService[] {
  const q = query.toLowerCase()
  return AZURE_SERVICES.filter(s => s.name.toLowerCase().includes(q))
}

/**
 * Category colors used across diagrams — maps Azure categories to
 * the unified design system colors.
 */
export const CATEGORY_COLORS: Record<string, { bg: string; accent: string }> = {
  Identity:                { bg: '#ffffff', accent: '#1a237e' },
  Networking:              { bg: '#ffffff', accent: '#4285F4' },
  Compute:                 { bg: '#ffffff', accent: '#764ba2' },
  Containers:              { bg: '#ffffff', accent: '#6a1b9a' },
  Databases:               { bg: '#ffffff', accent: '#28a745' },
  Storage:                 { bg: '#ffffff', accent: '#20c997' },
  Messaging:               { bg: '#ffffff', accent: '#d6a206' },
  Security:                { bg: '#ffffff', accent: '#dc3545' },
  Monitoring:              { bg: '#ffffff', accent: '#17a2b8' },
  'AI + Machine Learning': { bg: '#ffffff', accent: '#e91e63' },
  Analytics:               { bg: '#ffffff', accent: '#ff5722' },
  Integration:             { bg: '#ffffff', accent: '#607d8b' },
  DevOps:                  { bg: '#ffffff', accent: '#795548' },
  Management:              { bg: '#ffffff', accent: '#455a64' },
  // Fallbacks for custom / on-premises
  'On-Premises':           { bg: '#ffffff', accent: '#6c757d' },
  'Third Party':           { bg: '#ffffff', accent: '#9e9e9e' },
  Custom:                  { bg: '#ffffff', accent: '#667eea' },
}

/**
 * Curated Azure service SLA defaults (financially-backed availability
 * percentages from Microsoft's published SLAs). Values reflect the most
 * common / default SKU for each service — higher-tier or multi-zone
 * deployments may exceed these. Keys are matched case-insensitively
 * against the component name with simple normalization.
 *
 * Source: https://azure.microsoft.com/support/legal/sla/
 * Last reviewed: 2025.
 *
 * For services with significantly different SLAs per tier, an entry is
 * given for each common SKU (e.g. Redis Standard vs Premium).
 */
export const AZURE_SLA_DEFAULTS: Record<string, string> = {
  // Identity
  'microsoft entra id': '99.99%',
  'microsoft entra id premium': '99.99%',
  'azure ad b2c': '99.9%',
  'managed identities': '99.99%',

  // Networking
  'azure front door': '99.99%',
  'azure traffic manager': '99.99%',
  'azure application gateway': '99.95%',
  'azure load balancer': '99.99%',
  'azure dns': '100%',
  'azure cdn': '99.9%',
  'azure firewall': '99.95%',
  'azure virtual network': '99.9%',
  'azure vpn gateway': '99.95%',
  'azure expressroute': '99.95%',
  'azure private link': '99.99%',
  'azure ddos protection': '99.99%',
  'azure bastion': '99.95%',
  'azure nat gateway': '99.9%',

  // Compute
  'azure app service': '99.95%',
  'app service': '99.95%',
  'app service plan': '99.95%',
  'azure functions': '99.95%',
  'azure virtual machines': '99.9%',
  'azure vm scale sets': '99.95%',
  'azure static web apps': '99.95%',
  'azure batch': '99.9%',
  'azure spring apps': '99.95%',

  // Containers
  'azure kubernetes service (aks)': '99.95%',
  'aks': '99.95%',
  'azure container apps': '99.95%',
  'azure container instances': '99.9%',
  'azure container registry': '99.9%',
  'azure red hat openshift': '99.95%',

  // Databases
  'azure sql database': '99.99%',
  'azure sql managed instance': '99.99%',
  'azure cosmos db': '99.99%',
  'cosmos db': '99.99%',
  'azure database for postgresql': '99.99%',
  'azure database for mysql': '99.99%',
  'azure database for mariadb': '99.99%',
  'azure cache for redis': '99.9%',
  'redis cache': '99.9%',
  'azure managed instance for apache cassandra': '99.99%',

  // Storage
  'azure blob storage': '99.9%',
  'blob storage': '99.9%',
  'storage account': '99.9%',
  'azure files': '99.9%',
  'azure queue storage': '99.9%',
  'azure table storage': '99.99%',
  'azure data lake storage': '99.9%',
  'azure managed disks': '99.9%',
  'azure netapp files': '99.99%',

  // Messaging
  'azure service bus': '99.9%',
  'service bus': '99.9%',
  'azure event hubs': '99.95%',
  'event hubs': '99.95%',
  'azure event grid': '99.99%',
  'event grid': '99.99%',
  'azure notification hubs': '99.9%',
  'azure signalr service': '99.9%',
  'azure web pubsub': '99.9%',

  // Security
  'azure key vault': '99.99%',
  'key vault': '99.99%',
  'microsoft defender for cloud': '99.9%',
  'azure sentinel (microsoft sentinel)': '99.9%',
  'azure web application firewall': '99.95%',

  // Monitoring
  'azure monitor': '99.9%',
  'application insights': '99.9%',
  'log analytics': '99.9%',
  'azure service health': '99.9%',

  // AI + ML
  'azure openai service': '99.9%',
  'azure ai services': '99.9%',
  'azure machine learning': '99.9%',
  'azure ai search': '99.9%',
  'azure bot service': '99.9%',

  // Analytics
  'azure synapse analytics': '99.9%',
  'azure data factory': '99.9%',
  'azure databricks': '99.95%',
  'azure stream analytics': '99.9%',
  'azure data explorer': '99.9%',

  // Integration
  'azure api management': '99.95%',
  'api management': '99.95%',
  'azure logic apps': '99.9%',

  // Management
  'azure site recovery': '99.9%',
  'azure backup': '99.9%',
  'azure automation': '99.9%',
}

/**
 * Look up the published default SLA for an Azure service by name.
 * Matching is case-insensitive and ignores leading/trailing whitespace.
 * Returns undefined if no curated value exists.
 */
export function lookupSla(componentName: string): string | undefined {
  if (!componentName) return undefined
  const key = componentName.trim().toLowerCase()
  return AZURE_SLA_DEFAULTS[key]
}
