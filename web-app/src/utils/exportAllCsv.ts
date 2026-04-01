/**
 * Export all phase data to CSV files.
 * Each phase gets its own CSV file, downloaded separately.
 */

import { downloadMultipleCsvSheets, objectsToCsvSheet, type CsvSheet } from './csvExport'

// ─── Re-declare the data inline so the export is self-contained ───

function buildPhase1Sheets(): CsvSheet[] {
  const criticalityData = [
    { Tier: 'Tier 1', Criticality: 'Mission Critical', 'Business View': 'Affects the company\'s mission and might noticeably affect corporate profit-and-loss statements', Financial: 'n/a', 'Brand Reputation': 'Yes', 'Customer Trust': 'Yes', 'Customer Experience': 'Yes', 'Injury / Loss of Life': 'No', 'Employee Productivity': 'Yes' },
    { Tier: 'Tier 1', Criticality: 'Business Critical', 'Business View': 'Can lead to financial losses for the organization', Financial: '> $250k', 'Brand Reputation': 'Yes', 'Customer Trust': 'Yes', 'Customer Experience': 'Yes', 'Injury / Loss of Life': 'No', 'Employee Productivity': 'Yes' },
    { Tier: 'Tier 1', Criticality: 'Compliance Critical', 'Business View': 'In heavily regulated industries, critical to maintain compliance', Financial: 'n/a', 'Brand Reputation': 'Yes', 'Customer Trust': 'Yes', 'Customer Experience': 'Yes', 'Injury / Loss of Life': 'No', 'Employee Productivity': 'Yes' },
    { Tier: 'Tier 1', Criticality: 'Safety Critical', 'Business View': 'Physical safety of employees and customers at risk', Financial: 'n/a', 'Brand Reputation': 'Yes', 'Customer Trust': 'Yes', 'Customer Experience': 'Yes', 'Injury / Loss of Life': 'Yes', 'Employee Productivity': 'Yes' },
    { Tier: 'Tier 1', Criticality: 'Security Critical', 'Business View': 'Outages could result in loss of data or unintended access', Financial: 'n/a', 'Brand Reputation': 'Yes', 'Customer Trust': 'Yes', 'Customer Experience': 'Yes', 'Injury / Loss of Life': 'No', 'Employee Productivity': 'Yes' },
    { Tier: 'Tier 2', Criticality: 'High', 'Business View': 'Affects high-importance processes; measurable losses', Financial: '< $250k', 'Brand Reputation': 'No', 'Customer Trust': 'Yes', 'Customer Experience': 'Yes', 'Injury / Loss of Life': 'No', 'Employee Productivity': 'Yes' },
    { Tier: 'Tier 3', Criticality: 'Medium', 'Business View': 'Low losses; brand damage or upstream losses likely', Financial: '< $100k', 'Brand Reputation': 'No', 'Customer Trust': 'Yes', 'Customer Experience': 'Yes', 'Injury / Loss of Life': 'No', 'Employee Productivity': 'No' },
    { Tier: 'Tier 4', Criticality: 'Low', 'Business View': 'Impact not measurable; localized to single team', Financial: '< $50k', 'Brand Reputation': 'No', 'Customer Trust': 'Yes', 'Customer Experience': 'Yes', 'Injury / Loss of Life': 'No', 'Employee Productivity': 'Yes' },
    { Tier: 'Tier 5', Criticality: 'Unsupported', 'Business View': 'No investment justification', Financial: '$0', 'Brand Reputation': 'No', 'Customer Trust': 'No', 'Customer Experience': 'No', 'Injury / Loss of Life': 'No', 'Employee Productivity': 'Yes' },
  ]

  return [objectsToCsvSheet('Phase1_Criticality_Model', criticalityData)]
}

function buildPhase2Sheets(): CsvSheet[] {
  const gapAssessment = [
    { Component: 'Microsoft Entra ID', Category: 'Identity', SLA: '99.99%', 'HA Config': 'Global redundancy', 'DR Config': '-', 'Gap Status': 'Met' },
    { Component: 'Azure DNS', Category: 'Networking', SLA: '100%', 'HA Config': 'Global anycast', 'DR Config': '-', 'Gap Status': 'Met' },
    { Component: 'App Service Plan', Category: 'Compute', SLA: '99.95%', 'HA Config': 'Single region', 'DR Config': 'None', 'Gap Status': 'Gap' },
    { Component: 'Azure SQL', Category: 'Data', SLA: '99.99%', 'HA Config': 'Zone redundant', 'DR Config': 'No geo-replication', 'Gap Status': 'Partial' },
    { Component: 'Azure Service Bus', Category: 'Messaging', SLA: '99.9%', 'HA Config': 'Zone redundant', 'DR Config': 'No geo DR', 'Gap Status': 'Partial' },
    { Component: 'Azure Cache for Redis', Category: 'Cache', SLA: '99.9%', 'HA Config': 'Standard tier', 'DR Config': 'No geo-replication', 'Gap Status': 'Gap' },
  ]

  const costComparison = [
    { Component: 'App Service Plan', 'Current Cost (Monthly)': '$500', '+BCDR Cost (Monthly)': '$1,000', Difference: '+$500' },
    { Component: 'Azure SQL', 'Current Cost (Monthly)': '$800', '+BCDR Cost (Monthly)': '$1,200', Difference: '+$400' },
    { Component: 'Azure Cache for Redis', 'Current Cost (Monthly)': '$300', '+BCDR Cost (Monthly)': '$600', Difference: '+$300' },
    { Component: 'Storage Account', 'Current Cost (Monthly)': '$50', '+BCDR Cost (Monthly)': '$75', Difference: '+$25' },
    { Component: 'TOTAL', 'Current Cost (Monthly)': '$1,650', '+BCDR Cost (Monthly)': '$2,875', Difference: '+$1,225' },
  ]

  return [
    objectsToCsvSheet('Phase2_Gap_Assessment', gapAssessment),
    objectsToCsvSheet('Phase2_Cost_Comparison', costComparison),
  ]
}

function buildPhase3Sheets(): CsvSheet[] {
  const mbcoData = [
    { 'Recovery Order': '1', Application: 'Azure Platform Landing Zone', 'Business Function': 'Identity (Microsoft Entra ID, AD)', Criticality: 'Security Critical', Window: 'At all times', Environment: 'Azure', Location: 'Global', 'Upstream Dependencies': '-', 'Downstream Dependencies': 'All services', 'Recovery Options': 'Redeploy, Availability, Restore', 'Origin Geography': 'Global', 'Restore Geography': 'Global' },
    { 'Recovery Order': '2', Application: 'Azure Platform Landing Zone', 'Business Function': 'DNS', Criticality: 'Business Critical', Window: 'At all times', Environment: 'Azure', Location: 'Global', 'Upstream Dependencies': 'Identity', 'Downstream Dependencies': 'Mars Travel, Complaints, Order Fulfillment, Warehouse', 'Recovery Options': 'Redeploy, Availability, Restore', 'Origin Geography': 'Global', 'Restore Geography': 'Global' },
    { 'Recovery Order': '2', Application: 'Azure Platform Landing Zone', 'Business Function': 'Recovery Services', Criticality: 'Mission Critical', Window: 'At all times', Environment: 'Azure', Location: 'Australia East, Australia Southeast', 'Upstream Dependencies': 'Identity', 'Downstream Dependencies': 'Mars Travel, Complaints, Order Fulfillment, Warehouse', 'Recovery Options': 'Redeploy, Availability, Restore', 'Origin Geography': 'Australia', 'Restore Geography': 'Australia' },
    { 'Recovery Order': '3', Application: 'Mars Travel Bookings', 'Business Function': 'Trip Bookings', Criticality: 'Business Critical', Window: 'At all times', Environment: 'Azure', Location: 'Australia East, Australia Southeast', 'Upstream Dependencies': 'Identity, DNS, Recovery Services, Warehouse Inventory', 'Downstream Dependencies': 'Order Fulfillment', 'Recovery Options': 'Redeploy, Availability, Restore', 'Origin Geography': 'Australia', 'Restore Geography': 'Australia' },
    { 'Recovery Order': '3', Application: 'Warehouse Inventory', 'Business Function': 'Warehouse Inventory Management', Criticality: 'Business Critical', Window: 'At all times', Environment: 'On-premises', Location: 'Sydney, Pitt Street Building', 'Upstream Dependencies': 'Identity, DNS, Recovery Services', 'Downstream Dependencies': 'Mars Travel Bookings', 'Recovery Options': 'Redeploy, Availability, Restore', 'Origin Geography': 'Australia', 'Restore Geography': 'Australia' },
    { 'Recovery Order': '3', Application: 'Lunar Orbit Control', 'Business Function': 'Lunar Orbit Control', Criticality: 'Safety Critical', Window: 'Last week of every month', Environment: 'Azure', Location: 'Australia East, Australia Southeast', 'Upstream Dependencies': 'Identity, DNS, Recovery Services', 'Downstream Dependencies': '-', 'Recovery Options': 'Redeploy, Availability, Restore', 'Origin Geography': 'Australia', 'Restore Geography': 'Australia' },
  ]

  const biaPortfolio = [
    { Application: 'Azure Platform Landing Zone', Criticality: 'Mission Critical', SLO: '99.999%', RTO: '1h', RPO: '0h', MTD: '4h', 'Impact Cost/hr': '$500,000', 'Last BIA Review': '2025-01' },
    { Application: 'Mars Travel Bookings', Criticality: 'Business Critical', SLO: '99.99%', RTO: '4h', RPO: '1h', MTD: '24h', 'Impact Cost/hr': '$50,000', 'Last BIA Review': '2025-03' },
    { Application: 'Warehouse Inventory', Criticality: 'Business Critical', SLO: '99.9%', RTO: '8h', RPO: '4h', MTD: '48h', 'Impact Cost/hr': '$30,000', 'Last BIA Review': '2025-02' },
    { Application: 'Order Fulfillment', Criticality: 'Business Critical', SLO: '99.9%', RTO: '8h', RPO: '4h', MTD: '48h', 'Impact Cost/hr': '$25,000', 'Last BIA Review': '2025-02' },
    { Application: 'Lunar Orbit Control', Criticality: 'Safety Critical', SLO: '99.999%', RTO: '0.5h', RPO: '0h', MTD: '1h', 'Impact Cost/hr': '$1,000,000', 'Last BIA Review': '2025-01' },
    { Application: 'Complaints Management', Criticality: 'High', SLO: '99.9%', RTO: '12h', RPO: '4h', MTD: '72h', 'Impact Cost/hr': '$5,000', 'Last BIA Review': '2025-03' },
  ]

  const riskScenarios = [
    { 'Risk Category': 'Cyber Attack (DDoS)', Description: 'Distributed denial of service', Impact: '4', Probability: '4', Score: '16', Level: 'High' },
    { 'Risk Category': 'Data Breach', Description: 'Unauthorized data access', Impact: '5', Probability: '3', Score: '15', Level: 'High' },
    { 'Risk Category': 'Region Outage', Description: 'Azure region failure', Impact: '5', Probability: '1', Score: '5', Level: 'Low' },
    { 'Risk Category': 'Zone Failure', Description: 'Availability zone outage', Impact: '3', Probability: '2', Score: '6', Level: 'Low' },
    { 'Risk Category': 'Configuration Error', Description: 'Human misconfiguration', Impact: '3', Probability: '4', Score: '12', Level: 'Medium' },
    { 'Risk Category': 'Power Grid Failure', Description: 'Data center power loss', Impact: '4', Probability: '1', Score: '4', Level: 'Low' },
    { 'Risk Category': 'Natural Disaster', Description: 'Earthquake, flood affecting DC', Impact: '5', Probability: '1', Score: '5', Level: 'Low' },
    { 'Risk Category': 'Service Degradation', Description: 'Azure service performance issues', Impact: '2', Probability: '4', Score: '8', Level: 'Medium' },
  ]

  return [
    objectsToCsvSheet('Phase3_MBCO_Recovery_Order', mbcoData),
    objectsToCsvSheet('Phase3_BIA_Portfolio', biaPortfolio),
    objectsToCsvSheet('Phase3_Risk_Scenarios', riskScenarios),
  ]
}

export function exportAllPhasesToCsv(): void {
  const sheets = [
    ...buildPhase1Sheets(),
    ...buildPhase2Sheets(),
    ...buildPhase3Sheets(),
  ]

  downloadMultipleCsvSheets(sheets, 'ABC_Guide')
}
