@description('Static Web App name (globally unique within the SWA service).')
param name string

@description('Region. SWA is region-limited.')
param location string

@description('SKU — Free (anonymous public) or Standard (auth + private endpoint capable).')
@allowed([
  'Free'
  'Standard'
])
param sku string = 'Free'

@description('Resource tags.')
param tags object = {}

resource staticSite 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: sku
    tier: sku
  }
  properties: {
    // azd-managed deploy via deployment token — no GitHub Action generated.
    repositoryUrl: ''
    branch: ''
    buildProperties: {
      skipGithubActionWorkflowGeneration: true
    }
    // Public network on by default; for Standard you can later attach a Private Endpoint.
    publicNetworkAccess: 'Enabled'
  }
}

output uri string = 'https://${staticSite.properties.defaultHostname}'
output name string = staticSite.name
output id string = staticSite.id
