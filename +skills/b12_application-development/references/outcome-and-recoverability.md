# Outcome assurance and interruption-safe execution (v1.11.0)

## 1. Admission: verify that a task can succeed

For every implementation instruction, write a short **outcome contract** before execution:

- **User-visible finish line:** state what the owner can actually observe/do, not merely what was coded or reported.
- **Scope and current state:** authoritative specification revision, verified repository/runtime/data target and dependencies, with `UNKNOWN` for anything not established.
- **Acceptance checks:** observable steps and evidence; mark executor tests separate from owner UAT.
- **Protected invariants:** authorization, preservation, tenancy, audit, legal retention, design freeze, accounting semantics, costs and forbidden actions.
- **Primary execution path and approved safe fallback:** if the primary path is blocked, identify an *already approved* alternative that achieves the same outcome without relaxing invariants. An unapproved alternative is a proposal, not implicit permission.
- **Stop conditions:** explicit point at which to return to owner because neither path is safe or authorized.

### Conflict scan, required before sending instructions to executor

Ask, then record a PASS/BLOCKED result:

1. Does the outcome contradict any active requirement, retention rule, permission, or approved design contract?
2. Do the forbidden actions make the chosen procedure impossible? For example: 'delete every record' versus 'never delete legally protected originals'.
3. Can a protected, non-destructive replacement meet the *same* owner outcome? Example: new isolated main-development DB with identity/settings transferred, original DB sealed and disconnected; do not misrepresent it as physical deletion.
4. Does the actor actually have the necessary repository, runtime, API and deployment permissions?
5. Is there a credible verification path and compatible rollback/recovery plan, especially after writes?
6. Are there unresolved questions that materially affect the result? If yes, return them before a paid execution cycle. Do not bury them in a long implementation prompt.

**PASS** is permitted only when the outcome, authority, allowed paths and acceptance checks are mutually consistent. A 'safety BLOCKED' is not a success. The manager must not promise full implementation when the gate says BLOCKED. Codex may continue unrelated approved work, but the blocked outcome remains open.

If the owner has approved a safe fallback, executor may switch to it at a documented checkpoint after verifying its prerequisites. A fallback is **not** permission to delete protected data, change legal retention, bypass governance or use additional paid services.

### Avoid specification theater

- An instruction 'do it now' never overrides higher-priority project governance or technical impossibility.
- Distinguish `IMPLEMENTED`, `DEPLOYED`, `OWNER_UAT_PASS` and `ACCEPTED`. Task outcome is not CLOSED by test pass alone.
- Reuse already verified Git evidence when inputs are unchanged; avoid full history rereads and repetitive reports.
- Keep HUMAN outcome contract authoritative; AI Meta Handoff gate requirements still apply where mandated.

## 2. Continuity is an invariant, not an end-of-session event

At task admission, **before code modifications**, persist in the repository's existing `dev/CODEX_HANDOFF.md` a minimal current-state-first contract: task ID, spec revision, user-visible outcome, immutable exclusions, verified HEAD, active phase, next safe action, and names of protected worktrees.

At each coherent block boundary, record `completed / in-progress / not-started / untested` and exact next action. The latest coherent Git commit is the recoverable implementation checkpoint. Do not commit unfinished/untested changes merely because quota is low.

Before a long edit, migration, data cleanup, expensive test, or deployment, leave a recoverable **pre-operation** checkpoint and an explicit abort/rollback boundary. If relevant quota values are visible, continue honoring <=20% `CHECKPOINT_AWARE` and <=10% `MANDATORY_HANDOFF` **for every quota**. If quota is unavailable, set `NOT_AVAILABLE` and treat interruption as possible after any tool call. Never claim access to quota that the environment does not expose.

### Independent local checkpoint (optional implementation, strongly recommended)

The bundled `scripts/recovery_checkpoint.py` saves an atomic, private Git state manifest in `.git/application-development/checkpoint.json`. The command does not consume AI tokens once called. It tracks branch, HEAD, staged/unstaged/untracked paths, task ID, contract hash, observed timestamp and local phase. It **does not** include file contents, stage/commit/reset work, or certify that an uncommitted edit is complete. A local scheduler/launcher can call it periodically without waiting for Codex to decide to write a handoff.

**Important:** Merely bundling the script is not automatic protection. Until a verified independent scheduler/launcher is installed and tested on the target Mac, the protection is only manual/on-demand. Do not claim `EXTERNAL_CHECKPOINT_ACTIVE` from the presence of a script. The host must prove that snapshots continue while Codex is not responding. Never silently create a system service or alter user login items.

Example (in a Git working tree, after copying the skill's script to a stable local path):

```bash
python3 scripts/recovery_checkpoint.py snapshot --repo . --task MEMALA-XXX --phase BEFORE_EDIT --contract spec/current/task.md
python3 scripts/recovery_checkpoint.py inspect --repo .
```

Optional interval scheduler should be reviewed separately for privacy, permissions and ownership. If checkpoint file is missing, stale, or HEAD/working tree changed, the receiver performs `RECOVERY_REQUIRED`, not 'all clear'.

### New session takeover after abrupt quota exhaustion

1. Start a fresh Codex account/session; do **not** wait for the old session to return.
2. Load `AGENTS.md`, `spec/README.md`, the active approved task, `dev/CODEX_HANDOFF.md`, and the mirrored versioned methodology. Validate Git root/branch/HEAD/status and staged/untracked files.
3. Use `recovery_checkpoint.py inspect` if installed. Compare manifest time, task, contract hash, HEAD and worktree to current state. Stale or missing file is a signal to reconstruct from Git and files, **not** to discard work.
4. Reconcile uncommitted diffs manually/read-only; determine whether a tool command or process is still active, and preserve all unrelated work. Do not run restore/reset/clean or automatically replay migrations, uploads, paid calls or deployments.
5. Classify each work block: completed with evidence / in-progress / not started / untested. Identify the smallest safe next step, and refresh the handoff **before continuing**.
6. Never infer that a recent commit proves deployment or a clean working tree proves feature completion. Confirm actual runtime receipts when relevant.

An unexpected abort may lose the last unsaved semantic decision; the recovery promise is **safe reconstructability from persistent artifacts**, not zero data loss or exactly-once external effects. For irreversible effects, use transaction IDs/operation receipts and existing idempotency safeguards.

## 3. Measurement / acceptance tests

At minimum, test in an expendable Git repository with two simulated independent workers:

- Quota unknown (`NOT_AVAILABLE`): snapshot exists before a work block.
- Abrupt termination with dirty tracked **and untracked** files and no final assistant message: a second worker detects divergence without overwriting any file and produces a safe continuation plan.
- Abrupt termination immediately before a destructive command: receiver does not run it solely from the last prompt; rechecks target/permission/preconditions.
- Stale checkpoint after a new commit or changed task/spec: receiver flags re-verification.
- A normal coherent checkpoint: receiver recognizes matching branch/HEAD/worktree.
- Contradictory user outcome and protected-data deletion: admission gate blocks primary plan and prefers only an explicitly approved safe alternative.
- A live Mac pilot: independently scheduled snapshots continue after Codex is stopped; same repo is resumed by another account, while original account is unavailable. This is an **installation/UAT requirement** and cannot be marked PASS by local unit tests alone.

Keep measured reliability separate from untested claims; unknown quota/cost values are `NOT_AVAILABLE`.

## 4. Suggested concise contract and outcome report

```text
TASK / SPEC / SHA:
OWNER-VISIBLE OUTCOME:
ADMISSION: PASS | BLOCKED (why)
PRIMARY PATH / OWNER-APPROVED FALLBACK:
PROTECTED DATA / EXCLUSIONS:
PHASE / LAST VERIFIED GIT HEAD / DIRTY:
ACTUAL RUNNING RUNTIME (if relevant):
COMPLETED / IN_PROGRESS / NOT_STARTED / UNTESTED:
NEXT SAFE COMMAND OR ACTION:
OWNER UAT: WAIT_FOR_UAT | PASS | FAIL
EXTERNAL CHECKPOINT: ACTIVE_VERIFIED | MANUAL_ONLY | NOT_INSTALLED | UNKNOWN
```

When this contract and formal protocol both apply, include it in the HUMAN layer, preserve semantics in the META layer and maintain the protocol's required independent gate. This reference does not waive v0.4, L2/L3 approval, retention or `EXECUTOR_TO_ORCHESTRATOR` completion reporting.
