targetScope = 'subscription'

// =============================================================================
// BoltPlan — Azure deployment
// Provisions a single Azure Static Web App in either Public (Free, anonymous)
// or Private (Standard, Entra ID-authenticated) mode.
// =============================================================================

@minLength(1)
@maxLength(64)
@description('Name of the azd environment (used to derive the resource group + resource names).')
param environmentName string

@description('Azure region for the Static Web App. SWA is region-limited.')
@allowed([
  'eastus2'
  'centralus'
  'westus2'
  'westeurope'
  'eastasia'
])
param location string = 'westeurope'

@description('Deployment mode: "public" (Free SKU, anonymous) or "private" (Standard SKU, Entra ID required).')
@allowed([
  'public'
  'private'
])
param deploymentMode string = 'public'

@description('Tag applied to every resource for cost tracking / lifecycle.')
param resourceTags object = {}

var rgName = 'rg-${environmentName}'
var defaultTags = union(resourceTags, {
  'azd-env-name': environmentName
  workload: 'boltplan'
  mode: deploymentMode
})

resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: rgName
  location: location
  tags: defaultTags
}

module swa 'modules/staticwebapp.bicep' = {
  scope: rg
  name: 'staticwebapp'
  params: {
    name: 'swa-${environmentName}-${uniqueString(rg.id)}'
    location: location
    sku: deploymentMode == 'private' ? 'Standard' : 'Free'
    tags: union(defaultTags, {
      'azd-service-name': 'web'
    })
  }
}

output WEB_URI string = swa.outputs.uri
output AZURE_LOCATION string = location
output AZURE_RESOURCE_GROUP string = rg.name
output DEPLOYMENT_MODE string = deploymentMode
