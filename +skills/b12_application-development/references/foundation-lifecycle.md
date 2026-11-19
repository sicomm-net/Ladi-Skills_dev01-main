# Foundation Gate: Design System First + Data Lifecycle by Design (v1.10.0)

## Authority and stage boundaries

This contract is a **mandatory methodology**, not a product specification. Functional requirements and legitimate retention obligations are determined by the approved project source (`spec/current/` or equivalent). Do not override the specification with the methodology, old code, or a screenshot. Do not make global changes in a live system without authorization, an appropriate risk tier, and a verified rollback.

**Greenfield order:** approved concept → functional/data concept → Application Foundation → Foundation Gate `PASS` → first functional UI implementation → controlled change. A project without a UI need not create CSS; document the `NOT_APPLICABLE` reason. A technical prototype built before the approved Foundation may be used as disposable exploration, never as an undeclared production design base.

## A. Design System First

Before the first production screen, create and have approved a versioned **Design Foundation Contract** covering:

1. Names and locations of shared sources: design tokens (colors, typography, spacing, radii, borders, state indicators), theme/light-dark as specified, and breakpoints.
2. Basic shared layouts, navigation, typographic hierarchy, tables, forms, buttons, dialogs, inputs, alerts, loading/empty/error states, and accessibility (focus/keyboard/contrast).
3. CSS/style ownership: where global tokens and components may be added; a rule prohibiting page-specific duplication without an approved exception; technology appropriate to the chosen stack (it need not be a single physical CSS file).
4. Owner sign-off, version/revision, Freeze scope, reference views, permitted exceptions, and approved change methods.

**Gate PASS** only with a reachable contract in Git and basic usable components. The UI change preflight must cite the specific shared tokens/components and explain whether it is a reuse, an approved system change, or an approved exception. Make global visual changes centrally, with targeted regression of all affected component/layout families, not through a series of page-level patches. Component tests and representative screenshots are evidence; owner UAT is a separate acceptance step.

## B. Data Lifecycle by Design: principled life and death

For every new table, column accumulating history, object storage, blob, attachment, cache, log, export, file, queue, AI artifact, or copy of any of these, create a **Lifecycle Manifest**:

| Field | Question |
|---|---|
| `object` / `storage` | What is stored and where, including copies / indexes? |
| `purpose` | Which approved function/operational need requires it? |
| `owner_scope` | Who owns the data and what tenant isolation applies? |
| `created_by` / `terminal_state` | When is it created and when does it stop being active? |
| `retention_rule` / `start_event` | How long, counted from which measurable event? |
| `delete_or_anonymize` | How, where, and how often is it cleaned up? |
| `holds_dependencies` | Legal/accounting hold, active operations, integrity, idempotence? |
| `copies_and_backups` | When do copies and backups expire under the approved policy? |
| `evidence_monitoring` | How to verify that cleanup works and track volume growth? |

**Retention rules by kind, not a single constant:** business/accounting sources per approved and legal rules; active configuration for as long as needed; completed diagnostic/operational data briefly, unless protected by a specific reason. An application may have a project-approved 30-day period for closed reminder delivery records; **it must not automatically apply it to other entities without approval**.

**Cleanup safety:** cleanup is idempotent, batched, restartable, tenant-safe, observable, tested at the boundaries, and does not remove data of active/UNCERTAIN/PENDING operations or minimal dedup metadata before their demonstrable protection period ends. Do not create a duplicate archive of mail content unless an approved product purpose requires it; technical records are a different category. A real mail provider may not keep SMTP sends in the Sent folder; verify integration-specific behavior.

Deleting a row does not mean immediate physical release of space; plan DB maintenance, blobs, files, tmp copies, cache, log rotation, indexes, and backup lifecycles according to the platform used. Running cleanup on existing user data is a **destructive operation** requiring separate approval and rollback/recovery, not an automatic consequence of adding this Skill rule.

## C. Verification checklist and handoff to Codex

**GREENFIELD:** existence and owner approval of the Design Foundation before the first production UI; reuse across two different pages; a lifecycle manifest for a typical DB entity, a temporary file, and a job; explicit exceptions for protected records; `FOUNDATION_GATE: PASS/BLOCKED`.

**MID-CYCLE:** audit the existing design token/component contract and existing data categories; list of gaps; a safe supplementary plan without redesign or automatic deletion; the complete `spec/current/` manifest gate remains untouched.

**CONTROLLED CHANGE:** new UI justifies its reuse of existing tokens; a theme change is approved as a project-wide design revision, not a local hack; a new queue/log has a retention + hold + cleanup test; an already running task is not silently re-pinned to the methodology.

**Evidence tests:** automatic check for the existence of the design contract and lifecycle manifest; UI tests of shared components and relevant viewports; TTL boundary, retries, active hold, idempotence, no duplicates, tenant isolation, DB+file cleanup integrity, and monitoring for the specific technologies. Evidence distinguishes `PASS`, `NOT_RUN`, `UNVERIFIED`; owner acceptance is not derived from a build pass.

**Codex handoff fields:** `methodology_revision`, `design_contract_ref + revision + freeze_scope` or `NOT_APPLICABLE`, `lifecycle_manifest_ref + affected_objects` or `NO_NEW_DATA`, `foundation_gate`, `exception_approvals`, `tests`, `owner_uat`. Link to project files; do not introduce a duplicate customer specification into the master.
