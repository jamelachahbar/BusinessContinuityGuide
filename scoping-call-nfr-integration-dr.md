# Scoping Call: NFR Integration — DR Process Review

> **Duration:** 45–60 minutes
> **Type:** Discovery / Scoping
> **Customer Context:** NFR Integration Roadmap — Risk for Customer Service
> **Follow-up:** [Deep Dive Meeting Prep](meeting-prep-nfr-integration-dr.md) (scheduled after scoping)

---

## Objective

Understand the customer's integration landscape, current DR maturity, and urgency — then agree on scope and next steps for a structured engagement.

**This is NOT a solutioning call.** We're here to listen, understand, and frame the problem.

---

## Agenda

| Time | Topic |
|------|-------|
| 5 min | Introductions & call objectives |
| 10 min | Customer overview — integration landscape & business context |
| 15 min | Current state & pain points — what's working, what isn't |
| 10 min | Priorities & timeline — what matters most, what's urgent |
| 5 min | Scope agreement — what a deep dive would cover |
| 5 min | Next steps & scheduling |

---

## What We Already Know (From Diagrams)

Before the call, acknowledge what we've seen so we don't waste their time repeating it:

- **External circuit breaker process** exists — 6-step manual recovery (detect → RCA → fix → validate → restart → gradual recovery)
- **Recovery time:** ~4h average, 1 day+ worst case
- **Critical gaps acknowledged:** DLQ, retry mechanism, state management not fully implemented
- **Go-live decision pending:** partial NFR maturity vs. delay for full implementation
- **Key risk:** data loss and inconsistent processing with no automated recovery

> _"We've reviewed the two NFR roadmap diagrams you shared. We'd like to start by understanding the wider context around those."_

---

## Scoping Questions (Pick 10–12 max for the call)

### The Landscape (5 min)

1. **How many integrations are in scope?** Roughly — 5, 50, 500?
2. **What's the architecture?** (Azure-native, hybrid, third-party middleware?)
3. **Which Azure services are involved?** (Service Bus, Event Hubs, Logic Apps, Functions, API Management?)
4. **Are these integrations customer-facing, internal, or both?**

### The Problem (10 min)

5. **What triggered this initiative?** Was there a specific incident, audit finding, or go-live gate?
6. **What's the biggest pain point right now?** (Detection time? Recovery time? Data loss? Manual effort?)
7. **How often do integration failures occur?** (Daily, weekly, monthly?)
8. **When was the last significant outage, and what happened?**
9. **Do you have defined RTO/RPO targets for these integrations?** If so, are you meeting them?

### The Stakes (5 min)

10. **What's the business impact of a 4-hour outage?** (Revenue, customers, reputation, regulatory?)
11. **Is there a go-live date driving urgency?** What's the timeline?
12. **Who are the key stakeholders?** (Business owners, platform team, operations, security?)

### Maturity Check (5 min)

13. **Do you have a formal Business Continuity Plan today?**
14. **Have you ever run a DR drill or failover test for these integrations?**
15. **Is there an existing criticality classification for your applications/integrations?**

---

## What to Listen For

These signals help us scope the engagement correctly:

| Signal | Interpretation | Engagement Scope |
|--------|---------------|-----------------|
| _"We've never classified our integrations by criticality"_ | Start from Phase 1 (Prepare) | Full ABC Guide engagement |
| _"We have SLAs but no formal DR plan"_ | Phase 1 exists informally, jump to Phase 2 | Application Continuity focus |
| _"We have plans but never tested them"_ | Phase 2 partially done, needs Test + Phase 3 | Testing & BCP focus |
| _"We had a major incident and need to fix things fast"_ | Incident-driven, tactical | Targeted gap remediation |
| _"Go-live is in X weeks and we can't delay"_ | Risk acceptance framing needed | Go-live risk assessment + compensating controls |
| _"We need help with DLQ/retry/state management"_ | Technical implementation gap | Architecture design session |

---

## Scope Options to Propose

Based on what we hear, propose one of these engagement shapes:

### Option A: Full BCDR Framework (4–6 weeks)
**When:** Customer has no formal DR structure; needs end-to-end planning.

- Phase 1: Criticality Model + Business Commitment Model workshops
- Phase 2: BIA, Fault Tree Analysis, Gap Assessment, Response Plan per integration
- Phase 3: BCP document, risk assessment, recovery order, DR drill
- **Deliverable:** Completed ABC Guide workbench + documented BCDR plan

### Option B: Targeted Gap Remediation (2–3 weeks)
**When:** Customer knows their gaps (DLQ, retry, state management); needs architecture and implementation guidance.

- Architecture design session: DLQ, retry, circuit breaker, state management patterns
- Gap Assessment: Current vs. target state per integration
- Response Plan: Formalize the 6-step process with automation opportunities
- **Deliverable:** Architecture decision record + implementation roadmap

### Option C: Go-Live Risk Assessment (1 week)
**When:** Go-live is imminent; customer needs a formal risk acceptance decision.

- Risk assessment: Quantify probability and impact of going live with partial NFR maturity
- Compensating controls: Define minimum viable mitigations for go-live
- Decision paper: Formal recommendation with clear criteria
- **Deliverable:** Risk assessment document + go/no-go recommendation

### Option D: DR Drill & Validation (1–2 weeks)
**When:** Customer has plans but has never tested them.

- Tabletop exercise: Walk through failure scenarios with the team
- Live drill: Execute the 6-step recovery process with a controlled failure
- Gap report: Document what worked, what failed, what needs improvement
- **Deliverable:** DR drill report + improvement backlog

---

## Internal Notes (Do Not Share)

### Before the Call
- [ ] Confirm attendees and their roles
- [ ] Review any CRM notes or previous engagement history
- [ ] Have the [deep dive prep](meeting-prep-nfr-integration-dr.md) ready in case the call goes deeper
- [ ] Prepare a quick ABC Guide demo (web app) in case they want to see the framework

### During the Call
- [ ] Take notes on integration names, Azure services mentioned, and team structure
- [ ] Note any specific incidents or outages they reference
- [ ] Capture the go-live timeline and decision-maker(s)
- [ ] Listen for emotional pressure words: "urgent", "worried", "executive pressure", "audit"

### After the Call
- [ ] Send summary email within 24 hours with:
  - What we heard
  - Proposed scope (A, B, C, or D)
  - Suggested next step (deep dive meeting)
  - Required attendees for the deep dive
- [ ] Schedule the deep dive (use [meeting-prep-nfr-integration-dr.md](meeting-prep-nfr-integration-dr.md))
- [ ] Share the ABC Guide web app link for them to explore beforehand

---

## Quick Reference: ABC Guide Framework

```
Phase 1: PREPARE
├── Criticality Model          → "How important is each integration?"
├── Business Commitment Model  → "What level of protection does each tier get?"
├── Fault Model                → "What can go wrong and how do we respond?"
├── RACI                       → "Who does what during an incident?"
└── Application Requirements   → "What does each integration need?"

Phase 2: APPLICATION CONTINUITY
├── Assess: BIA, Service Map, Fault Tree, Gap Assessment
├── Implement: Response Plan, Architecture Design, Role Assignment
└── Test: DR Drill, Test Plan, Communication Plan

Phase 3: BUSINESS CONTINUITY
├── BCP Document
├── Business Risk Assessment
├── Recovery Order (MBCO)
└── Ongoing Management (Dashboard, Calendar, Reviews)
```
