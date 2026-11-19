# Application Development — governance methodology

## 1. Recommended minimal repository structure

```text
<repo>/
├── AGENTS.md
├── spec/
│   ├── README.md
│   └── current/
│       ├── <authoritative-specification>
│       ├── <approved-supplement-if-any>
│       └── <structural-companion-if-any>
├── dev/
│   └── CODEX_HANDOFF.md   # for multi-session / multi-workspace work
├── src/ or app/ or web/ ...
└── project-specific development files
```

Do not add further history layers automatically. A single current `CODEX_HANDOFF.md` plus Git history is usually enough.

## 2. spec/README.md template

```markdown
# Specification source of truth

## Authoritative requirements
1. `<primary specification>` — primary functional authority.
2. `<approved supplement>` — newer approved changes; within the scope of the change it takes precedence over the primary specification.

## Structural companions
- `<schema/model>` — authoritative only for <defined structural scope>; the functional workflow is determined by the primary specification.

## Not requirements
Existing source code, migrations, prototypes, historical documents, screenshots, README files and test fixtures describe implementation or evidence only. They must not be used to infer functional requirements unless explicitly incorporated into an authoritative document.

## Change rule
A new functional behavior must be either:
- already supported by an authoritative requirement (`BUG_AGAINST_SPEC` when implementation differs), or
- approved and written into the controlled specification before implementation (`APPROVED_SPEC_CHANGE`).

If neither applies, classify as `REQUIREMENT_NOT_FOUND` and stop before coding.
```

## 3. Root AGENTS.md template

```markdown
# Project development rules

## Source of truth
Read `spec/README.md` before making any functional change.
Use only the files identified there as authoritative requirements.

Existing implementation is evidence of current code state, not evidence of intended behavior.
Do not infer requirements from old source code, migrations, prototypes, historical documentation, screenshots or test fixtures.

If implementation conflicts with the authoritative specification, the specification wins.
Do not modify files identified as authoritative specifications unless the user explicitly asks for a specification change.

## Before coding
Classify the task as one of:
- BUG_AGAINST_SPEC
- APPROVED_SPEC_CHANGE
- REQUIREMENT_NOT_FOUND
- IMPLEMENTATION_ONLY

For BUG_AGAINST_SPEC and APPROVED_SPEC_CHANGE, identify the relevant authoritative source and section before changing code.
For REQUIREMENT_NOT_FOUND, stop and report the ambiguity instead of inventing behavior.

## Git safety
Do not discard or overwrite unrelated uncommitted work.
If the working tree is dirty, identify the existing changes before editing.
Keep governance/documentation changes separate from implementation changes unless explicitly instructed otherwise.

## Continuity
If `dev/CODEX_HANDOFF.md` exists, treat it as implementation-status context only, never as a product requirement.
Verify its claims against the actual Git repository before continuing.

## Completion
Run relevant tests/build checks.
Unless instructed otherwise, create one coherent commit for the completed task.
Report classification, authoritative source, files changed, tests/build results, commit hash and remaining ambiguity.
```

## 3a. Executor-local methodology mirror

If the executor (e.g. Codex) has no access to the ChatGPT Skill catalog, place only the relevant methodology skills in the repository as a portable execution context:

```text
ai/skills/
  application-development/
    SKILL.md
    references/
      methodology.md
  ai-meta-handoff/
    SKILL.md
    references/
      protocol.md
      examples.md
```

These files are not a product specification. Recommended text for `AGENTS.md`:

```text
ai/skills/** contains execution methodology / developer context for Coding AI.
It defines HOW Codex performs development work, not WHAT the product must do.
Product requirements come only from spec/current/** according to spec/README.md.
If a methodology file and product requirement appear to conflict, do not infer product behavior from ai/skills/**; stop and surface the conflict.
When a required ChatGPT Skill is unavailable natively, read the approved/versioned local mirror instead. Never claim to have used an unavailable Skill without reading its mirror.
```

Mirror metadata should state the skill/protocol version and source revision. Update mirrors in a dedicated methodology/governance change, not silently inside a business implementation commit.

Minimality rule: mirror only the skills needed for the executor task. For a formal Application Development handoff that requires `ai-meta-handoff`, mirror those two; do not copy unrelated document, spreadsheet, web, or domain skills unless the task actually depends on them.

## 4. Source audit table

| Source | Category | Does Codex need it? | Authority | Action |
|---|---|---:|---|---|
| primary assignment | AUTHORITATIVE REQUIREMENTS | yes | functional | mirror into `spec/current/` |
| approved supplement | AUTHORITATIVE REQUIREMENTS | yes | newer changes | mirror |
| ER/schema | STRUCTURAL COMPANION | as needed | structural only | mirror + define its role |
| local README | DEVELOPER CONTEXT | usually yes | operational | keep |
| `dev/CODEX_HANDOFF.md` | DEVELOPER CONTEXT | yes, on continuation | no functional authority | version it, update continuously |
| source code | IMPLEMENTATION STATE | yes | no functional authority | keep in code |
| migrations/seed | IMPLEMENTATION STATE | yes | no functional authority | keep in code |
| screenshots | TRANSIENT EVIDENCE | usually no | none | do not carry over permanently |
| old specs/prototypes | LEGACY / EXCLUDE | no | none | omit |

## 5. Governance verification prompt

Use after the governance layer is introduced and when Codex first enters an existing project:

```text
Before implementation, verify specification governance.
Work only in the confirmed repository root.
Do not modify, stage, restore, reset, commit, or delete files.

Read AGENTS.md and spec/README.md, then enumerate EVERY file in spec/current/.
For each file state filename, complete readability, role, and precedence.

Finally output exactly one gate:
GOVERNANCE STATUS: PASS
or
GOVERNANCE STATUS: BLOCKED
```

Continue only after `PASS`.

## 6. `dev/CODEX_HANDOFF.md` template

```markdown
# Codex Handoff

Updated: <timestamp>
Repository: <absolute path>
Branch: <branch>
Last verified HEAD: <hash>
Working tree intentionally dirty: YES/NO

## Active authoritative task
<spec/addendum/task>

## Status
IN_PROGRESS | READY_FOR_UAT | BLOCKED

## Completed
- ...

## In progress
- ...

## Not started
- ...

## Untested / tests pending
- ...

## Changed files
- ...

## Migrations added
- ...

## Tests already passed
- ...

## Known blockers / decisions
- ...

## Working-tree warnings
- ...

## Exact next step
<single concrete continuation point>

## Safe continuation instruction
Continue from the exact current working tree. Do not reset, restore, clean, discard or recreate completed work. Verify the active authoritative task and read the current task in full. Read older authoritative material only when the current block depends on it, a conflict/ambiguity appears, or the current task explicitly requires it. Do not repeatedly reread historical checkpoint text that Git already preserves.
```

## 7. Quota-aware Codex protocol

If Codex knows the percentage of remaining quota, track each relevant limit separately, especially the 5-hour and weekly limits.

- >20%: NORMAL
- <=20% and >10%: CHECKPOINT_AWARE
- <=10%: MANDATORY_HANDOFF

In `CHECKPOINT_AWARE`, do not start an unnecessarily broad new block, and update the handoff after significant progress.

V `MANDATORY_HANDOFF`:
1. finish only an atomic step that can be safely completed;
2. do not start a new migration/feature/refactor block;
3. aktualizuj `dev/CODEX_HANDOFF.md`;
4. verify root, branch, HEAD, `git status`, changed files;
5. write down completed / in progress / not started / untested;
6. create the `NEXT CODEX PROMPT`;
7. do not commit just because of the quota boundary.

Quota exhaustion is an expected session boundary, not an error.

## 8. `NEXT CODEX PROMPT` template

```text
Work only in:
<repo-root>

This is a continuation of an in-progress implementation from another Codex session/account/workspace.

First read:
- AGENTS.md
- spec/README.md
- all relevant files in spec/current/
- dev/CODEX_HANDOFF.md

Then verify:
- repository root
- branch
- HEAD
- git status
- actual changed files against CODEX_HANDOFF.md

Treat dev/CODEX_HANDOFF.md as navigation/context only, never as a source of product requirements.
Do not reset, restore, clean, discard or recreate existing work.
Do not modify spec/current/ unless explicitly authorized.

Before coding, report:
1. what is already complete;
2. what is in progress;
3. what remains untested;
4. exact next implementation step;
5. any discrepancy between handoff and repository state.

Then continue from the verified current state.
Apply quota-aware continuation rules: <=20% CHECKPOINT_AWARE, <=10% MANDATORY_HANDOFF.
If handing off again, update dev/CODEX_HANDOFF.md and produce a new NEXT CODEX PROMPT.
```

## 8a. Checkpoint-based continuation / context-efficiency template

After a valid checkpoint, prefer this mode:

```text
CHECKPOINT CONTINUATION — CONTEXT EFFICIENCY

First verify once:
- repository root, branch, exact HEAD
- git status and staging
- active authoritative task/revision/hash
- current handoff/report against the actual working tree
- required protected-state baseline for this task

Then work narrowly:
- read the current authoritative task in full
- read older authoritative documents only for a concrete dependency/conflict/ambiguity
- use only the current-state prefix of handoff/report; historical checkpoint text is history
- inspect exact files/components for the current coherent block before doing repository-wide searches
- reuse already PASSed evidence when its inputs/dependencies did not change

Verification cadence:
- expensive preservation/fingerprint/health checks at takeover
- again at coherent-block checkpoint
- again before deploy/destructive action
- lightweight checks between boundaries when protected state could not change

Large visual/generated corpora:
- automated validation for the complete corpus
- deterministic representative visual/manual matrix covering every layout/scenario family
- expand inspection only for anomalies/failures

Escalate back to broad verification if:
- HEAD/working tree differs from handoff
- governance/task revision changed
- relevant schema/invariant changed
- a test invalidates prior evidence
- requirements conflict or REQUIREMENT_NOT_FOUND appears

Never relax source-of-truth precedence, Git safety, UAT/data protection, destructive-operation gates, or final acceptance tests.
```

### Current-state-first handoff rule

The active `dev/CODEX_HANDOFF.md` and the implementation report should not grow endlessly by copying the entire history. Keep only the current state, the exact next step, and current warnings/evidence at the top. Leave history to Git. If, for operational reasons, a project keeps older checkpoints in the same file, the continuation prompt must say that their historical part is not re-read without a concrete need.

## 9. Handoff templates by classification

### BUG_AGAINST_SPEC

```text
BUG_AGAINST_SPEC
Read AGENTS.md first.
Authoritative source: <file>, <section>.
Observed behavior: <current behavior>.
Required behavior: <spec behavior>.
Fix implementation only. Do not edit authoritative specification.
Scope: <boundaries>.
Tests: <required checks>.
```

### APPROVED_SPEC_CHANGE

```text
APPROVED_SPEC_CHANGE
Read AGENTS.md first.
Approved source: <new/updated spec file>, <section>.
Implement only the approved change: <summary>.
Preserve unrelated behavior.
Tests: <required checks>.
```

### IMPLEMENTATION_ONLY

```text
IMPLEMENTATION_ONLY
Read AGENTS.md first.
This task must not change functional behavior.
Goal: <refactor/build/test/tooling change>.
Preserve all behavior defined by spec/current/.
```

### REQUIREMENT_NOT_FOUND

Do not assign coding. Return the problem to the Chat/specification phase.

## 10. Acceptance loop

```text
Codex implemented
      ↓
technical tests passed?
  no → Codex fix
  yes
      ↓
user scenario test
      ↓
┌─────────────────────┬──────────────────────┬───────────────────────┐
│ differs from spec   │ new desired behavior │ requirement ambiguous │
│ BUG_AGAINST_SPEC    │ update spec first    │ REQUIREMENT_NOT_FOUND │
│                     │ APPROVED_SPEC_CHANGE │                       │
└─────────────────────┴──────────────────────┴───────────────────────┘
```

## 11. Versioning and master/deployment alignment

Application-development is a reusable master methodology. For each real project, repository governance and handoff files are deployment/configuration. Do not copy project-specific names, secrets, credentials, customer data or internal documents back into the skill master. General improvements learned from a deployment must be anonymized, generalized, versioned and tested before becoming a new skill version.


## V1.3: End-of-coding return contract

Whenever Codex completes a coding task, it must return separate HUMAN summary and a full `CODEX IMPLEMENTATION META REPORT` in YAML per `ai-meta-handoff` v0.2. The report must be copyable without editing across accounts. The human manually pastes the META into the manager Chat. The manager alone performs reconstruction from META-only, comparison with approved HUMAN DEFINITION, independent evidence checks, and closure gate. Do not conflate this formal task-completion report with `dev/CODEX_HANDOFF.md` (which remains the operational continuation record).

Suggested addition to project `AGENTS.md` (only after project governance approval):

> On every coding-task completion, output a concise HUMAN summary followed by a fenced YAML section titled CODEX IMPLEMENTATION META REPORT, using AI_META_HANDOFF v0.2, direction EXECUTOR_TO_ORCHESTRATOR. Enumerate all task requirements and criteria, implementation details, missing work, test evidence, Git commits and deviations. Mark manager_review_status NOT_REVIEWED and manual_transfer_required true. Do not claim user acceptance. Await manual transfer to the separate manager process.

Manager comparison is not automatic unless the deployment explicitly provides an authenticated communication path. Require UAT whenever stipulated by approved project rules.
