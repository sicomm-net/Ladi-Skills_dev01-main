# HUMAN + META: precision without bureaucracy (v0.7)

## Two independent decisions

1. **How precisely to communicate**: for AI-to-AI developer handoff, use HUMAN intent plus a compact META mapping even on small changes.
2. **How much to verify**: choose based on real technical/data risk, not presence of META. No automatic extra approvals or workers.

## Rapid request example

```yaml
task_id: UI-ALIGN-001
profile: RAPID_UI
authority: latest approved owner UI decision
goal: Align VAT and Total headings and values to their column right edge
in_scope: [frontend/table-layout]
out_of_scope: [API, backend, persistence]
must_preserve: [currency formatting, other column widths]
acceptance: [VAT heading/value same right axis, Total heading/value same right axis]
```

## Controlled request example

```yaml
task_id: BANK-RERUN-A
profile: FORMAL_CONTROLLED
goal: Reprocess previously failed PDF without valid published movements
in_scope: [queue, extraction, validation, guarded publication, UI]
deferred: [replacement of previously valid and paired movements]
must_preserve: [original, tenant isolation, existing pairings, audit]
acceptance: [end-to-end test, no duplicates, deployed to named Development runtime]
```

Apply formal review to the protected publication boundary, not to the fact this is written as YAML. The project may already mandate independent review for a specific risk; preserve such material safeguards.

## Rapid result

```yaml
task_id: UI-ALIGN-001
result: IMPLEMENTED
commit: <actual Git hash>
tests: [<actual checks>]
deployment: <actual runtime/revision or NOT_DEPLOYED>
uat: WAIT_FOR_UAT
blockers: []
manager_review_status: NOT_REVIEWED
```

The short HUMAN report explains the result. META does not replace evidence, and reported deployment is not itself owner acceptance.
