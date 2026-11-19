# Risk-tiered execution and frozen-UX reference (v1.7)

## Scope and precedence

These are portable **implementation-method rules**, not product requirements. Product authority remains with `spec/current` and approved user decisions. The classification is **impact-based**, never assigned from apparent code size, effort estimate, or the word "UI". If any criterion falls in a higher tier, use the highest tier. A task may be split into separately approved, genuinely isolated subtasks with different tiers; do not split to evade controls. Identify affected domains and justify exclusions. Classify before work, reassess when the actual diff changes the risk surface.

## Mandatory tiers

| Tier | Typical scope | Minimum analysis | Tests and evidence | Human acceptance |
|---|---|---|---|---|
| **L1 low** | Pure presentation/CSS; narrow navigation or component reuse with no functional or persisted change | Relevant components + Git/diff and preserved design contracts | Targeted frontend build/lint if applicable, focused UI/route checks; visual screenshot comparison when relevant; confirm no unintended API/DB/auth diff | Focused visual UAT for visible UX |
| **L2 medium** | Behavioral workflow, validation, data transformations within existing schema, state transition, or integration changes without new security boundary | End-to-end affected path, dependencies, error/retry paths, authorization touchpoints | Unit + targeted integration + representative edge/negative tests + regression of directly affected paths; workflow UAT | Scenario-based UAT covering normal/failure cases |
| **L3 high** | Database migrations; destructive operations; access-control/identity/tenant boundaries; sensitive data; production deployment with substantial persistence or cross-customer risks | Architecture, security and data-flow review, migration/recovery/backout, impact inventory | Relevant migration/rollback, auth/tenant isolation, end-to-end and failure-path tests, preservation checks, focused security regressions, independent review where available; verify restore if claimed | Formal UAT and explicit authorization for irreversible operations |

**Escalation rules:** role visibility edits affecting only text may be L1, but actual permission semantics are L3. Moving an ON/OFF control is L1 only if it reuses an unchanged backend/configuration contract and existing behavior; new persistence or changed reminder execution is L2+, auth/security is L3. An API `PUT` or form that can mutate data is never considered proven by screenshot alone. Any uncertainty about boundary effects => raise tier or stop and report.

## Gates remain mandatory

For **formal behavior-changing** work of any tier, keep the pinned v0.3 independent META-only semantic gate, validator, evidence, and fail-closed rule from §12. No 'L1' exemption for behavior change, no permission to relabel behavioral work as mechanical. A documented L1 exemption may cover only provably nonbehavioral mechanical presentation/refactor changes; record rationale, unchanged behavioral contracts, and scope. Git safety, specification precedence, no unauthorized real-data writes, API/DB preservation, required UAT and explicit approval for destructive actions apply at every tier.

## Risk-proportional test selection

Write a short **change impact manifest**: changed surfaces, reachable dependencies, protected surfaces, expected side effects, tests to run and tests intentionally not rerun with reasons. Do not rerun repository-wide suites solely because they exist. Reuse PASS results only with valid matching HEAD/input/dependencies and recorded evidence; rerun when inputs/invariants changed. Prefer cheap verification at takeover, after the coherent change, and at final handoff. Use `PASS`, `FAIL`, `NOT_RUN`, `UNVERIFIED` accurately. An in-memory adapter proves UI behavior but not real persistence. Screenshot proves appearance but not API side effects. Never claim quantified savings without observed telemetry.

## Design Master and Design Freeze

A **Design Master** is the *approved reusable design contract* (typography, spacing, header, rows, controls, state affordances, breakpoints and accessibility); it is not an outdated screenshot or code as product authority. A **Design Freeze** is the approved reference for a specific view or shared component, protected until a new authorized design decision. Freeze state must identify owner/approval, date or revision, reference location, scope, permitted variance (including responsive behavior), and explicitly protected elements. A screenshot is *visual acceptance evidence*, not a source for new functions and cannot override the product specification.

For affected UI changes:
1. Resolve the approved master and frozen references and list impacted routes/components.
2. Prefer a shared component and shared CSS tokens over per-page imitations; keep local content and semantics appropriate to each page.
3. Compare relevant UI at agreed consistent viewports against approved reference; use explicit assertions for key invariants (e.g., one item per row, header sizes, no forbidden extra sections, accessible edit controls).
4. Cover every directly affected distinct layout family; where many pages share an unchanged component, do not demand exhaustive manual screenshot comparison—use component checks and representative route sampling, escalating on anomaly.
5. Report deviations, missing references and user-requested changes as decisions to approve, not design freedoms Codex may silently exercise.
6. Do not call a design accepted until human UAT. If a shared-style modification changes an already frozen screen, approval and relevant regression are required even if the new screen looks better.

## Efficient handoff delta

HUMAN/META or narrow Codex prompt must identify `risk_tier`, why assigned, protected design contract/freeze references, changed and excluded surfaces, risk-scaled tests, acceptance owner, and any intentionally untested integration. Handoff should point to Git facts rather than reproduce multi-session chat histories. Record tier changes in the completion META and explain why.

See `references/risk-ux-contract.md` for examples and a practical acceptance matrix.