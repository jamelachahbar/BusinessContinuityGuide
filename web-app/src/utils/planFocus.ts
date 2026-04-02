export type PlanFocus = 'bcdr' | 'dr' | 'bc'
export type Relevance = 'dr' | 'bc' | 'bcdr'

/** Check if a section with the given relevance is "in scope" for the current plan focus */
export function isInScope(relevance: Relevance, focus: PlanFocus): boolean {
  if (focus === 'bcdr') return true
  if (relevance === 'bcdr') return true
  return relevance === focus
}

/** Badge label for a relevance tag */
export function relevanceLabel(relevance: Relevance): string {
  switch (relevance) {
    case 'dr': return 'DR'
    case 'bc': return 'BC'
    case 'bcdr': return 'BCDR'
  }
}

/** Map of sidebar nav items to relevance */
export const navRelevance: Record<string, Relevance> = {
  home: 'bcdr',
  phase1: 'bcdr',
  phase2: 'dr',
  phase3: 'bc',
  personas: 'bcdr',
  glossary: 'bcdr',
  references: 'bcdr',
  settings: 'bcdr',
}

/** Map of Phase 1 sub-tabs to relevance */
export const phase1TabRelevance: Record<string, Relevance> = {
  concepts: 'bcdr',
  criticality: 'bcdr',
  bcm: 'bcdr',
  faultModel: 'dr',
  raci: 'bcdr',
  requirements: 'bcdr',
  testPlans: 'bcdr',
}

/** Map of Phase 2 sub-tabs to relevance */
export const phase2TabRelevance: Record<string, Relevance> = {
  assess: 'dr',
  implement: 'dr',
  test: 'dr',
}

/** Map of Phase 3 sub-tabs to relevance */
export const phase3TabRelevance: Record<string, Relevance> = {
  planning: 'bc',
  mbco: 'bc',
  operations: 'bc',
  maintenance: 'bcdr',
}
