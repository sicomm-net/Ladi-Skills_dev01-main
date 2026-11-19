---
name: application-development
description: Spec-driven application development connecting Chat, Git, Codex and UAT. Use for greenfield and controlled-change software work, preparing executable outcome-based Codex tasks, catching contradictory instructions, and preserving multi-session recovery when quotas expire unexpectedly. Also governs design foundations and data lifecycles.
---

# Application Development

## Version and ownership

Current master version: **1.13.0**.

Use SemVer:
- PATCH – a methodology fix without a change in the expected workflow.
- MINOR – a new backward-compatible capability or rule.
- MAJOR – a change of architecture, responsibilities, or methodology compatibility.

Author, master owner, and expert administrator: **Ladislav Goc**.  
Copyright © 2026 Ladislav Goc. All rights reserved.

This skill is a licensable master. The author's own use is an `author-development` deployment. Apply the principles of `master-deployment` at the same time if this skill is used to create a portable product, skill, agent, or customer application.

## Purpose

Create a reliable link between the environment where the assignment is created and approved and the environment where the programming happens. Do not assume that Codex automatically sees the chat, Project Sources, decisions, or context from another part of ChatGPT. Transfer into the Git repository only a controlled and unambiguous implementation context and make it binding for Codex.

Basic model:

```text
CHAT / PROJECT SOURCES
  analysis → decision → specification → user testing
                 │
                 ▼
GIT GOVERNANCE LAYER
  AGENTS.md + spec/ + precedence + source map
                 │
                 ▼
CODEX
  implementation → tests → checkpoint / handoff → commit
                 │
                 ▼
CHAT / USER
  acceptance walkthrough → bug / new requirement / approval
```

## Most important rules

**Existing code is evidence of the current implementation, not evidence of the intended behavior.**

**The Git repository is the durable state of development; a specific Codex session, account, or workspace is a replaceable worker.**

Never derive a functional requirement solely from old code, a migration, a prototype, a README, a screenshot, or a historical implementation unless it is explicitly adopted into the current authoritative assignment.

## 1. First determine the mode

Distinguish:

- **GREENFIELD** – a new project without a significant existing implementation.
- **MID-CYCLE ADOPTION** – the project is already running and the methodology is being introduced after the fact.
- **CONTROLLED CHANGE** – governance already exists and a further change is being handled.

For MID-CYCLE ADOPTION, never start with reorganization or deletion. First map the sources, the current Git state, work in progress, documentation, and how the application is run. Preserve the ability to roll back.

## 2. Audit sources before handing over to Codex

If Project Sources, attachments, documentation, or a repository are available, sort them into categories:

1. **AUTHORITATIVE REQUIREMENTS** – the approved functional assignment and newer approved changes.
2. **STRUCTURAL COMPANION** – an ER model, schema, API contract, or another machine-readable model whose authority is precisely defined.
3. **DEVELOPER CONTEXT** – the current local README, build/test/run procedure, and a safe handoff.
4. **IMPLEMENTATION STATE** – source code, migrations, seed data, compose files; they are not a source of requirements.
5. **TRANSIENT EVIDENCE** – screenshots, one-off printouts, test exports, a Git bundle, temporary handoffs.
6. **LEGACY / EXCLUDE** – old specifications, prototypes, and materials that Codex does not need for the current change.

Do not mechanically copy all Sources into the Codex context layer. Transfer only what Codex needs for a correct implementation. Default principle: **fewer sources, clearer authority**.

For the detailed procedure and recommended structure, load `references/methodology.md`.

## 3. Maintain the Git governance layer

For a project that uses Codex for implementation, prefer in the repository root:

```text
AGENTS.md
spec/
  README.md
  current/
    <authoritative specification>
    <approved supplements>
    <structural companion models>
dev/
  CODEX_HANDOFF.md   # if the project uses multi-session / multi-workspace Codex
```

`spec/README.md` must specify:
- which files are authoritative;
- their order of precedence;
- what is only a technical companion;
- what is not a source of requirements;
- how a new change is approved.

The root `AGENTS.md` must instruct Codex at minimum to:
- read the relevant `spec/` before changing behavior;
- not derive requirements from existing code;
- in a conflict, give precedence to the authoritative specification;
- not change the authoritative specification without an explicit instruction;
- in case of ambiguity or a missing requirement, stop the implementation and report the problem;
- classify the change before implementation;
- after implementation, run the relevant tests and create a coherent commit unless the user specifies otherwise.

`dev/CODEX_HANDOFF.md` is **DEVELOPER CONTEXT / IMPLEMENTATION STATE**, never a source of functional requirements. If used, version it in Git and keep only one current file; history is provided by Git.

Use the templates in `references/methodology.md`, but adapt them to the specific project.

## 3a. Mirroring methodology skills into the executor environment

Do not assume that the Coding AI / Codex automatically sees ChatGPT Skills, their catalog, or their internal files. If the current workflow requires a methodology skill that the executor environment cannot load directly, create in the Git repository a **controlled local mirror of only the necessary methodology skills**.

Preferred structure:

```text
ai/
  skills/
    <skill-name>/
      SKILL.md
      references/
        ...
```

Rules:
- mirror only the skills actually needed for the execution workflow; do not mechanically copy the whole ChatGPT skill catalog;
- the local mirror is **EXECUTION METHODOLOGY / DEVELOPER CONTEXT**, not a source of product requirements;
- product requirements remain only in the authoritative project-spec layer per `spec/README.md`;
- for each mirrored skill, record the name, version/protocol revision, and origin (master skill), so it is clear which methodology is used in the repository;
- when updating the master skill, update the mirror in a controlled and separate way; do not make a silent change during implementation of a business feature;
- if the executor can load the skill natively, prefer the native source; use the local mirror as an explicit fallback / portable context layer;
- secrets, customer data, and deployment-specific sensitive values do not belong in the mirror;
- `AGENTS.md` must clearly distinguish `spec/current/**` (WHAT the product should do) from `ai/skills/**` (HOW the executor should work).

Recommended project invariant:

```text
spec/current/** = authoritative product behavior
ai/skills/**    = execution methodology / developer context
code            = implementation state / evidence
handoff         = current continuation state
```

If a prompt refers to a methodology skill that the executor cannot see, it must not claim to have used it. It must either:
1. load the corresponding local mirror from `ai/skills/`, or
2. mark the task as methodologically blocked and ask for the instructions to be made available.

For formal handoffs between the orchestrator and Codex, also mirror together all directly dependent methodology skills/protocols, for example `ai-meta-handoff`, if the `Application Development` workflow requires it.

## 4. Classify every functional change

Before handing over to Codex, classify the change into exactly one main category:

### BUG_AGAINST_SPEC
The code does not match the already approved assignment.

Require:
- identification of the relevant part of the specification;
- a fix of the implementation, not a rewrite of the specification to match the code;
- a regression test matching the bug.

### APPROVED_SPEC_CHANGE
The user approved a new or changed function and it is first written into the controlled specification or an approved supplement.

Require:
- identification of the newer approved requirement;
- implementation of exactly this scope;
- an update of the tests.

### REQUIREMENT_NOT_FOUND
The required behavior is not sufficiently determined in the authoritative sources.

Do not program a guess. Return the decision to the Chat/specification phase.

### IMPLEMENTATION_ONLY
A refactor, build, tooling, test infrastructure, or another change without a change in functional behavior.

Verify that it really does not change the required behavior, and keep the change separate from functional changes.

## 5. Separate the roles of Chat and Codex

### Chat / Sources
Use for:
- functional analysis and decision-making;
- discussion of options;
- work with the authoritative assignment;
- recording approved changes;
- user acceptance testing;
- preparing a precise handoff for Codex.

### Codex
Use for:
- more extensive code changes;
- refactors;
- migrations;
- tests;
- programming fixes;
- creating commits and the technical handoff.

Do not allow Codex to replace a product decision that is not in the specification.

## 6. Safe Git procedure

Before a larger change:
- verify the repository root, branch, and `git status`;
- if the working tree is dirty, first find out who owns the changes and what they contain;
- never automatically reset/restore/checkout work in progress;
- separate the governance commit from implementation commits;
- do not mix unrelated changes into one commit;
- record the build/test state before and after the change.

When working with a user who wants to proceed command by command, give **one safe Bash command per step** and wait for the result.

## 7. Multi-session / multi-account / multi-workspace Codex continuity

Use this mode if a long implementation may exceed a single Codex session, the user may switch account/workspace, or a quota may interrupt the run.

### 7.1 Persistent handoff

Use a versioned `dev/CODEX_HANDOFF.md`. Keep in it at minimum:

- time of the last update;
- repo root, branch, and last verified HEAD;
- active authoritative task / addendum;
- status `IN_PROGRESS` / `READY_FOR_UAT` / `BLOCKED`;
- completed;
- in progress;
- not started;
- untested / tests pending;
- changed files;
- migrations added;
- tests already passed;
- known blockers / decisions;
- working-tree warnings;
- exact next step;
- safe continuation instruction.

Do not store passwords, API keys, account emails, or other secrets in the handoff. The workspace/account identity may be mentioned only as a harmless operational note, if useful.

### 7.2 Quota-aware mode

If Codex knows the remaining percentages of the relevant limits, follow hard thresholds for **each** relevant limit, especially the 5-hour and weekly quota:

- **> 20 %**: normal work;
- **20 % to > 10 %**: `CHECKPOINT_AWARE` – do not start an unnecessarily broad new block, update the handoff after significant progress;
- **<= 10 %**: `MANDATORY_HANDOFF` – do not start a new significant feature block, migration, or broad refactor. The priority is stabilization and handover.

Quota exhaustion is an expected session boundary, not an error.

In `MANDATORY_HANDOFF`:
1. finish only an atomic step that can be safely completed;
2. do not launch a new broad intervention;
3. update `dev/CODEX_HANDOFF.md`;
4. verify the repo root, branch, HEAD, `git status`, and changed files;
5. mark completed / in progress / not started / untested;
6. state the exact next step;
7. create a `NEXT CODEX PROMPT` for the next session/workspace;
8. do not commit merely because the quota is running out; commit only a finished and tested logical unit, if the workflow allows it.

### 7.3 Takeover by another Codex

Before continuing, the new Codex must:
1. read `AGENTS.md`, `spec/README.md`, the relevant `spec/current/`, and `dev/CODEX_HANDOFF.md`;
2. verify the repo root, branch, HEAD, and `git status`;
3. compare the handoff with the actual working tree;
4. report any mismatch before continuing;
5. continue only after verifying the actual state.

**The handoff is a navigation aid, not proof of the repository state. The Git working tree is the truth about the implementation; `spec/current/` is the authority about the intended behavior.**

### 7.4 Mandatory output at the end of a session

At a handoff, return to the user:
- a brief session summary;
- the state of the quota trigger;
- whether `dev/CODEX_HANDOFF.md` was updated;
- the exact `NEXT CODEX PROMPT` that can be pasted into another Codex session, account, or workspace.

### 7.5 Checkpoint-based continuation and context efficiency

After a safely verified checkpoint, use the principle **verify once → work narrowly → verify at a coherent boundary**. Safety must not lead to mechanical repeated reading of the whole project history or to repeating expensive checks without a change of inputs.

When taking over a checkpoint, always verify at minimum the repo root, branch, exact HEAD, `git status`, staging, the active authoritative task/revision, and the consistency of the current handoff with the actual working tree. If the governance or the authoritative task has not changed since the last checkpoint, do not consider full repeated reading of all older specifications the default procedure.

After a successful takeover:
- read the entire current authoritative task and only the relevant parts of other authoritative documents; open an older document in full only for a concrete dependency, conflict, ambiguity, or explicit reference;
- use the handoff and the implementation report as a navigational current-state layer; do not repeatedly read historical checkpoints embedded under the current state if the Git history preserves them;
- do not perform a repository-wide scan again when the current handoff exactly specifies the files/components of the current block; widen the check only on a mismatch or an error;
- do not repeat tests, builds, manifests, and expensive integration checks that already PASSed if the current change does not alter their inputs, dependencies, or security assumptions; always, however, run the tests of the directly affected block and the mandatory final regressions;
- perform expensive preservation/fingerprint/health checks at minimum at takeover, at the end of a coherent block, and before a deployment/destructive step; between these points use a lighter check if the protected state could not have changed;
- for large generated sets, perform automatic validation of the whole corpus and costly visual/manual checks on a deterministic representative matrix covering all layout/scenario families; on an anomaly, widen the visual check to the affected cases;
- if a changed HEAD, an unexpected dirty state, a conflict of specifications, a failed invariant, an invalid checkpoint, a change of a relevant schema, or `REQUIREMENT_NOT_FOUND` appears, switch back to broad verification and do not continue from assumptions.

Keep `dev/CODEX_HANDOFF.md` and the implementation report as **current-state-first** documents. Do not accumulate whole previous handoffs in their active part. History is provided by Git. If older history is left in the same file, the current prefix must unambiguously mark what is active, and the continuation prompt must explicitly forbid repeated reading of the historical part without reason.

This optimization never reduces the authority of `spec/current/`, Git safety, UAT protection, destructive-operation gates, or mandatory final tests.

## 8. Mid-cycle adoption

If the methodology is deployed in the middle of development:

1. Stop further large changes, but do not delete work in progress.
2. Find out the Git state and the current way of running/testing.
3. Map the available Sources and documents.
4. Select only the current authoritative and necessary technical sources.
5. Create `spec/README.md`, `spec/current/`, and the root `AGENTS.md`.
6. Transfer the selected documents into the repository or create controlled text equivalents of them.
7. Verify that Codex can correctly repeat the precedence without changing code.
8. Commit the governance layer separately.
9. Only then continue programming.

The first Codex handoff after introducing the methodology should be a verification one. Do not limit yourself to a general summary: demand a **complete manifest of all files in `spec/current/`**, confirmation of their readability, and explicit precedence. For each file, Codex must state its role and any conditions under which it may take precedence over another source.

Require the final state:
- `GOVERNANCE STATUS: PASS` only when all required authoritative files are available and the precedence is unambiguous;
- `GOVERNANCE STATUS: BLOCKED` if any file cannot be read completely or reliably or if the precedence is unclear.

If the status is `BLOCKED`, do not start the functional implementation. Codex must not replace an unreadable baseline with existing code, historical documentation, or a partial supplement. If the answer does not match, do not fix the code; fix the governance layer and repeat the check.

## 9. Handoff for Codex

Every assignment to Codex should be short, but must contain:

- the classification of the change;
- the relevant authoritative source/section;
- the required result;
- the boundaries of the change;
- the mandatory tests;
- an instruction not to intervene outside the scope;
- quota-aware continuation rules for longer tasks;
- a requirement for a commit and a brief handoff, if a commit is part of the workflow;
- the obligation of a separate `CODEX IMPLEMENTATION META REPORT` per the `ai-meta-handoff` protocol pinned for the given task (v0.4 for newly started tasks) for manual transfer to the manager process.

For long tasks, add the obligation to create/update `dev/CODEX_HANDOFF.md` and to use the thresholds from §7.

## 9a. Mandatory independent reverse translation before Codex execution

For every formal behavior-changing task, call `ai-meta-handoff` to produce HUMAN + META instructions. A separate reconstruction step receives **META only**, creates `HUMAN_RECONSTRUCTED`, and the manager compares its meaning, restrictions, prohibitions and acceptance tests with the approved HUMAN DEFINITION. Record a per-requirement comparison and a `PASS/BLOCKED` gate according to the `ai-meta-handoff` protocol v0.2. If blocked, do not send the affected task to Codex. The approved HUMAN definition remains authoritative. For purely mechanical low-risk work without a formal handoff, note why this gate is not used.

## 9b. Required Codex completion report and manual return

At the end of each coding task, demand **two separate outputs**:

1. A short, human-readable completion summary.
2. A **standalone, complete, copy-ready** fenced YAML block clearly headed `CODEX IMPLEMENTATION META REPORT`, `EXECUTOR_TO_ORCHESTRATOR`, following the current `ai-meta-handoff` result schema. Include task ID, exact approved source ref and revision, each requirement's implementation status, files/components changed, relevant Git refs, migrations, tests with PASS/FAIL/NOT_RUN and evidence, blockers, deviations and unimplemented work. Use `manager_review_status: NOT_REVIEWED` and `manual_transfer_required: true`.

The user manually copies **the complete META block** from Codex to the Chat / manager/master process. Do not assume Codex and manager share a chat, account, files, or automatic synchronization. Codex must not declare the task accepted or manager-reviewed. If a session ends early, report a clearly labelled partial META handoff and leave task open.

The manager compares received META to the authoritative HUMAN DEFINITION, **reconstructing the claimed implemented behavior from META alone** before comparison. Then check available code/diff/commit/test evidence independently, separating reported results from verified evidence. Record per-requirement MATCH/PARTIAL/DEVIATION/UNVERIFIED/BLOCKED and closure gate CLOSED/WAIT_FOR_UAT/RETURN_TO_CODEX/BLOCKED. No closure solely because Codex states 'done' or automated tests passed: relevant UAT and human acceptance remain required. If META block is incomplete, missing or from the wrong task/revision, request correction; do not guess or silently close.

## 10. Return after implementation

After a Codex handoff, do not consider the change verified merely because the build passed.

Distinguish:
- **implemented** – Codex changed the code;
- **technically tested** – automatic/build tests passed;
- **user-tested** – the user performed the scenario;
- **accepted** – the result matches the approved assignment.

In user testing:
- a contradiction with the existing assignment → `BUG_AGAINST_SPEC`;
- a new idea or workflow change → first modify the specification → `APPROVED_SPEC_CHANGE`;
- ambiguity → `REQUIREMENT_NOT_FOUND` and discuss before programming.

## 11. Do not confuse documents with equal authorities

The main specification, a change supplement, an ER model, a README, a handoff, code, and a screenshot are not equivalent. Always explicitly describe their role and precedence. If the project already has its own rules of authority, respect them and record them in the governance layer without changing their meaning.

## Mandatory output when deploying the methodology

Depending on scope, briefly capture:

1. mode: GREENFIELD / MID-CYCLE ADOPTION / CONTROLLED CHANGE;
2. authoritative sources and precedence;
3. what is excluded from the Codex context layer;
4. the Git governance structure;
5. current Git/working-tree risks;
6. classification of the nearest change;
7. testing and acceptance procedure;
8. the nearest concrete step;
9. for long work, the continuity/handoff mode and quota thresholds.

Do not create parallel documentation with no practical role. Update the existing source of truth if one already exists.

## Sebekontrola skillu

When changing this skill:
- use SemVer;
- keep Ladislav Goc as author, master owner, and expert administrator;
- record changes in `CHANGELOG.md`;
- test at minimum a greenfield, mid-cycle, and controlled-change scenario;
- in the mid-cycle test, verify the complete `spec/current/` manifest, the readability of all files, and the correct `PASS/BLOCKED` gate;
- in the continuity test, verify that another session/workspace can continue only from Git + the handoff prompt without the original chat;
- in the checkpoint-efficiency test, verify that continuation after a valid checkpoint does not mechanically read the whole history, but preserves takeover verification, the relevant authority, targeted tests, and the final safety gates;
- verify the separate Codex META completion report, manual transfer, reconstruction from META-only, comparison against the HUMAN DEFINITION, and blocking of closure without evidence/UAT;
- do not add specific customer data to the master;
- use `master-deployment` for the rules of portability, licensing, and deployments.


## 12. Mandatory v0.3 semantic-gate deployment and measurement (since v1.6.0)

Keep all previous rules in §§1–11, including the full manifest, Git precedence, quota-aware continuation, mandatory independent v0.2 round trip, separate executor META report and evidence-based manager closure. The following additions strengthen, not replace, those requirements.

1. For a new formal behavior-changing task use `ai-meta-handoff` v0.4 as a version-pinned methodology dependency. **Do not silently switch protocol versions inside an active task.** Historical v0.2 evidence remains valid for its already-running work; newly admitted tasks must obtain the v0.4 gate (with unchanged v0.3 semantics).
2. Prepare approved HUMAN + canonical META with task ID, source revision, requirement IDs and acceptance criteria. Perform truly independent **META_ONLY** reconstruction with a separate worker; the manager compares it requirement-by-requirement to original HUMAN, including negative requirements. Never confuse independent reconstruction with self-review by the same agent.
3. Record review with `round_trip.gate: PASS/BLOCKED` and one research measurement event per attempt. Any material loss, extra behavior, unavailable independent worker, changed META/source or missing evidence means BLOCKED. If BLOCKED, no affected functional implementation starts. Continue only unrelated approved independent work.
4. Run the deterministic structural validator supplied with the versioned `ai-meta-handoff` mirror, e.g.: `python3 ai/skills/ai-meta-handoff/scripts/validate_handoff.py --bundle ai/handoffs/<TASK>/reviewed-bundle.json --task <TASK> --source-revision <REV>`. It verifies gate-record structure and payload binding only. A `STRUCTURAL_PASS` **does not** replace semantic approval; an AI-generated `PASS` string alone is insufficient proof of independence or correctness.
5. Codex's `AGENTS.md` must require preflight before code changes; optional protected-branch CI must run it again before merge. Preflight in an ordinary Codex instruction is a *procedural* gate; only a guarded launcher or enforced CI/branch policy provides an independent technical barrier. Do not claim local enforcement if these protections are absent.
6. Keep the existing `EXECUTOR_TO_ORCHESTRATOR` completion report and manager-side META-only reconstruction + HUMAN comparison and separate code/test/UAT verification. Never let executor self-close. Return status `WAIT_FOR_UAT`, `RETURN_TO_CODEX`, or `BLOCKED` when appropriate.
7. Store attempt-level measurements and defect taxonomy according to `ai-meta-handoff/references/measurement.md`; keep observed metrics separate from not-available data. Controlled comparison with ordinary handoffs is required before quantitative claims of superiority. Do not optimize for tokens alone or introduce AI-native syntax (phase B) before phase A validation.
8. For a strictly nonbehavioral, low-risk mechanical task, a *documented narrowly scoped* exemption may follow existing §9a, with clear rationale and evidence. It is never allowed for a formal functional feature, destructive action or spec change.
9. Treat this methodology as a portable `master-deployment` product. Maintain version/pin, tests, license, source of truth and anonymous cross-project learnings in the master; actual task content and client secrets stay in their deployments. Change the methodology mirror in a separate governance commit; avoid altering the running MEMALA task during adoption.

See `references/semantic-gate-deployment.md` for template, rollout and example safety tests.


## 13. Risk-based proportional delivery and approved UI Design Freeze (since v1.7.0)

Use `references/risk-ux-contract.md` for the binding L1/L2/L3 impact classification, tier-scaled tests, UI Design Master / Design Freeze, and documented L1 mechanical exemption. Keep §12 mandatory semantic gate for every formal behavior-changing task. Do not retroactively reclassify already completed work or silently repin in-flight tasks.


## 14. Pilot Rapid UAT – optional mode (since v1.8.0)

For an explicitly approved pilot project, use the optional **Rapid UAT** mode described in `references/pilot-rapid-uat.md`. The goal is to shorten iterations that the user verifies on the real workflow anyway. For purely visual L1 changes, a separate synthetic database or an extensive synthetic scenario is not the default requirement; usually a build, a scoped commit, a safe app-only deployment, and real UAT suffice. For changes to storage, authorization, destructive operations, or migrations, keep the corresponding isolated checks regardless of the small number of rows. The mode does not reduce the protection of live data, Git/rollback obligations, or the formal semantic gates from §12; never present real UAT as equivalent to a transactional test.


## 15. Pilot Rapid Delivery + UI Freeze + lean handoff (since v1.9.0)

For approved pilots, use the rules in `references/rapid-delivery-handoff.md`. Their purpose is to **really shorten the whole cycle**, not just the synthetic tests:

- Distinguish `RAPID_OPERATIONAL` for mechanical L1 and narrowly bounded L1 presentation/interaction changes without a change of API, persistence, authorization, or work states; `FORMAL_CONTROLLED` for L2/L3 and complex or unclear changes. Never classify solely by the small size of the diff.
- In `RAPID_OPERATIONAL`, use a concise HUMAN contract in the assignment, a change diff, compilation/component smoke, a scoped commit, an app-only deploy, and UAT performed by the owner. Do not run a synthetic database or a formalized independent META-only reconstruction; the mode must be explicitly approved and delimited, and must not be presented as a successfully performed formal gate.
- `FORMAL_CONTROLLED` uses the existing full v0.4 formal gate and targeted checks according to risk. The pilot mode is not an exception for semantic changes to business processes, storage, permissions, the database, or integrated services.
- Every UI intervention must preserve the project's approved Design Freeze: build on existing components and styles, do not add new visual idioms; request approval for any deviation. The default UI must not be considered a source of requirements outside the approved design contract.
- Handoff and report in Rapid mode follow the `ai-meta-handoff` operational profile, if available. **Return two separate parts of the final response as mandatory:** a brief HUMAN report and a separate **complete copy-ready fenced YAML block `CODEX IMPLEMENTATION META REPORT` (`EXECUTOR_TO_ORCHESTRATOR`)**, with at minimum the task ID, impact/profile, actual result, changed files, tests, Git refs, deploy revision, UAT, blockers, `manager_review_status: NOT_REVIEWED`, and `manual_transfer_required: true`. In Rapid mode the META is more concise, **but never optional**, and cannot be replaced merely by a reference to a JSON/YAML file or by the HUMAN summary. Do not require an independent formal META-only round trip for an eligible L1 Rapid; do not state a false gate PASS. Do not copy the original specifications or old reports.
- At the start of every Codex session, verify the availability and versions of the actual files of the methodology skills (native or `ai/skills/` in the repository). `AGENTS.md` should order them to be loaded. If a relevant skill is not available, do not pretend to have loaded it or invent its content; request the full source.
- When quota is available, use the 20 % / 10 % checkpoint thresholds; if quota is unavailable, explicitly mark it `NOT_AVAILABLE` and save a checkpoint before longer work without guessing. Never promise that Codex sees the credit status.

This optional operating path **does not change** the wire protocol of formal handoffs and does not exempt formal tasks from the safety gates. The decision why a task met the conditions for the light mode must be traceable.


## 16. Foundation Gate, unified design, and data lifecycle (since v1.10.0)

Use `references/foundation-lifecycle.md` as binding for **every** GREENFIELD start of an application and for subsequent CONTROLLED CHANGE/MID-CYCLE tasks that add UI, persistent or temporary data objects, queues, exports, logs, or files. These are rules of the **methodology**, not a new authority over the approved product specification.

- **Design System First:** After approval of the concept and before the first production functional screen, establish an approved, versioned application-wide Design Foundation: design tokens/colors/typography/spacing/breakpoints, shared components, styles, layout and navigation contract, accessibility, and responsiveness. The owner approves the visual decisions and scope. No new pages may spontaneously create a parallel CSS system, colors, or components.
- **Frozen Design by default:** The approved foundation is binding even without being repeated in every prompt. Local UI changes only reuse the shared system. Global design changes require explicit consent, an update of the versioned design contract, and appropriate regression of the affected screens; document permitted local exceptions. Freeze does not mean a ban on approved design evolution.
- **Data Lifecycle by Design (the principle of life and death):** Before adding any data, define the purpose, owner/tenant, scope and type, retention period or expiry event, relationships and protections, cleanup mechanism, and proof of function. Without an explicitly justified exception, do not allow unbounded accumulation of technical data, logs, caches, blobs, files, exports, queues, audits, and their copies. Take into account backups, replicas, actual release of space, and data minimization principles.
- **Retention is not a guess:** Derive specific periods from the approved specification, operational need, and applicable obligations; **30 days is not a project-wide universal period**. Do not remove accounting or legally protected records, unresolved operations, necessary anti-duplicate identifiers, or data under a retention hold; however, do not require a long-term archive without a defined value.
- **Foundation/Change Gate:** Without an approved design foundation (for a UI application) or a completed lifecycle classification of the relevant new data, mark the affected implementation `BLOCKED / FOUNDATION_INCOMPLETE`. For a mid-cycle project, first perform an audit and introduce the missing foundations without automatic redesign, destructive cleanup, or migration.
- **Handoff and testing:** Every assignment to Codex carries references to the versioned design contract and the lifecycle manifest for the affected entities; acceptance checks visual consistency, retention boundaries, safe exceptions, and cleanup that actually works. Keep all earlier rules of Git/spec precedence, security, risk tier, semantic gate, UAT, pilot exceptions, and independent approval.


## 17. Outcome Assurance + Interruption-Safe Execution (v1.11.0)

Read `references/outcome-and-recoverability.md` whenever preparing an executor task, performing a Codex handoff, planning a destructive/deployment operation, or resuming work after an unexpected quota/tool interruption. This section strengthens, not replaces, §§1–16, the current source-of-truth rules, AI Meta Handoff gates, protection of data and owner UAT. Do not retroactively reinterpret task-pinned protocols.

**A. Before execution: outcome admission.** Record a concise HUMAN outcome contract: user-observable finish line, authoritative source and verified target, acceptance tests, protected invariants, primary path, any explicitly owner-approved safe fallback, and stop conditions. Check *feasibility and contradictions before spending an execution cycle*. The executor must not be tasked with an impossible combination such as deleting all records while preserving some legally protected originals. When a fallback is not approved, mark `BLOCKED` rather than granting implicit permission. Distinguish implementation, deployment and owner acceptance. An executor report cannot substitute for the owner's requested result.

**B. Before work: continuity contract.** At task admission put the task/revision, current phase, verified Git state and next safe action in the existing `dev/CODEX_HANDOFF.md`; keep it current-state-first. Save a recoverable pre-operation checkpoint before each significant long-running, costly or irreversible block and refresh after each coherent block. Continue honoring known 20%/10% quota thresholds, but when quota is `NOT_AVAILABLE`, assume an abrupt stop can occur at any call. Never leave continuity dependent on a *final* assistant response.

**C. Independent checkpoint mechanism.** The portable `scripts/recovery_checkpoint.py` can atomically save private Git-state manifests under `.git/application-development/`. It does not stage/commit/modify work or capture business file contents. This is an optional local tool, not an installed watchdog. A separately approved and tested local scheduler/launcher must invoke it independently of Codex for a claim of `EXTERNAL_CHECKPOINT_ACTIVE`. A script present on disk is **not** evidence of active protection. A Git manifest and `dev/CODEX_HANDOFF.md` carry complementary roles: machine-observable state versus semantic task intent. Neither alone proves external side effects were completed.

**D. Receiving-session protocol.** When Codex stops without a handoff, a new Codex must verify the active spec, task intent, Git HEAD/dirty/staging/untracked and running operations. Inspect saved checkpoint if available; stale/missing checkpoint requires recovery, not reset. Reconcile in-flight edits and external operations safely, preserve unrelated work, update the handoff and continue from the smallest safe action. The owner must not need access to the exhausted session to generate a new prompt. Do not claim zero-loss or guaranteed exactly-once behavior for abruptly stopped external operations.

**E. Tests and installation.** Run `scripts/test_recovery_checkpoint.py`, an interruption simulation with a new Codex session, an outcome-conflict test and a separately verified local scheduler trial. Use `references/rollout-verification.md` to update the author deployment and Codex mirror, prove real Skill loading/version/hash and mark `VERIFIED` only after evidence. Preserve 1.10.1 as rollback and keep in-flight project work pinned to its existing method until a controlled upgrade.

**F. Minimal overhead.** Do not build another report bureaucracy: reuse the one active handoff, existing Git and meaningful test evidence. Use local deterministic snapshots instead of repeated AI summaries; preserve all formal L2/L3/retention and semantic gates where applicable.


## 18. Pilot RAPID_FUNCTIONAL – binding clarification since v1.12.0

For projects with an explicitly approved development mode (MEMALA is a candidate once reflected in Git governance), allow the new profile **RAPID_FUNCTIONAL**. Before accepting a task, read `references/rapid-functional-development.md`. This profile is an alternative branch to the rules in §§9–17, not an administrative superstructure over them. For its narrowly bounded low-risk fixes, the following are explicitly **not** required: a mandatory independent META-only reconstruction, a structural validator, a double HUMAN/META report, a full-manifest scan in every session, new formal approval after every build/deploy, or repeated checkpointing without a change in risk. One human outcome contract and a short Git/UAT report suffice. Formal checks continue for `FORMAL_CONTROLLED` tasks; protected data, spec precedence, and authentication are never considered switched off. Conflicting older unconditional wording in §§9a, 9b, 12–17 is superseded in this explicitly chosen profile only within the stated process scope.


## 19. HUMAN + META without automatic bureaucracy (v1.13.0)

This section takes precedence over older unconditional wording in §§9–18 where it ties the mere presence of META to approval or, conversely, forbids META for Rapid. **Precision of handoff and the degree of checks are two independent dimensions.**

- For assignments between the managing AI and Codex, use **a single shared HUMAN + META handoff** also in `RAPID_UI`/`RAPID_OPERATIONAL` and `RAPID_FUNCTIONAL`. META is a concise refinement of goals, scope, prohibitions, preserved invariants, and acceptance, not a new permission or an additional process.
- Do not automatically require an independent META-only reconstruction, a structural validator, new approval, a full manifest audit, or multiple reports merely because a META YAML was attached.
- `RAPID_*`: a targeted test according to the changed function, a commit/deploy, and **one concise HUMAN + META result** (status, relevant checks, commit, runtime, UAT, blocker). It explicitly replaces in Rapid the old rule "HUMAN report only", without restoring the formal gate.
- `FORMAL_CONTROLLED`: keep the necessary independent safety checks for genuinely risky boundaries (protected data, identity, tenant, destructive DB, production). Apply the formal gate and audit to the extent of the real risk and the active protocol pin, not automatically to all unthreatened parts of the work. Do not repeat valid completed steps without a change of inputs.
- **HUMAN remains authoritative; META only refines it in machine-readable form.** Correct a META/HUMAN mismatch in the draft, but do not create another product approval round from it if the owner's intent is unambiguous.
- Use `ai-meta-handoff` v0.7.0 and its `references/precision-without-bureaucracy.md`. Do not change the record of currently running tasks retroactively without the owner's consent; a new assignment may explicitly adopt the updated communication standard, while the safety invariants remain.
