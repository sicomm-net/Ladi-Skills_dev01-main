## 1.12.0 – 2026-11-09
- Owner-approved experimental RAPID_FUNCTIONAL development profile; single HUMAN report; risk-scoped checks and revised reporting precedence.
- No change to formal protocol wire format or protected production-data controls.

## 1.11.0 — 2026-11-04

- Adds Outcome Assurance admission: owner-visible finish line, task feasibility/contradiction scan, explicit owner-approved safe fallback and concrete acceptance gate.
- Separates implementation/deployment from owner acceptance and prohibits contradictory tasks that technically PASS while failing the owner outcome.
- Adds Interruption-Safe Execution: task-intent checkpoint at admission, coherent block boundaries, and abrupt quota recovery without relying on the last Codex response.
- Includes a non-destructive, atomic local Git metadata checkpoint script and isolated interruption/recovery tests. No false claim of automatic scheduling or perfect recovery.
- Adds a controlled master-to-Codex mirror rollout and real recognition/version/hash/takeover verification, preserving in-flight protocol pins and existing formal safety gates.
- Maintains Author Ladislav Goc, private master/deployment separation and all 1.10.1 safety guarantees.

## 1.10.1 — 2026-11-01
- Resolves the Rapid Operational HUMAN-only example conflict with mandatory AI Meta Handoff executor completion output.
- Requires a separate complete copy-ready fenced YAML `CODEX IMPLEMENTATION META REPORT` in the final Codex response even for L1 RAPID_OPERATIONAL; saved META files or links are not substitutes.
- Retains lean risk-proportional Rapid work without falsely claiming an independent formal META-only gate; preserves v1.10.0 foundation/lifecycle and all previous safety and governance requirements.

## 1.10.0 — 2026-11-01
- Makes Design System First a mandatory greenfield Application Foundation stage before the first production UI and binds a versioned global Design Freeze across subsequent screens.
- Adds explicit centrally approved, versioned design evolution with shared tokens/components and targeted regression; prohibits improvised per-page parallel CSS systems.
- Introduces Data Lifecycle by Design / principle of birth and death for persistent, temporary, file, queue, log and copied data with retention, legal and active-operation holds, safe cleanup and storage measurement.
- Adds mandatory Foundation/Change Gate, greenfield/mid-cycle/controlled-change verification and Codex handoff contract.
- Preserves v1.9.0 governance, Git/spec precedence, risk tiers, handoff, UAT and approved pilot modes. No automatic changes to running project deployments.

## 1.9.0 — 2026-10-30
- Adds opt-in Pilot Rapid Delivery operational handoff for narrowly scoped L1 UI changes, genuinely reducing formal handoff overhead only where authorized.
- Adds Design Freeze as a binding pilot UI default and explicit guard against stylistic invention.
- Adds Codex skill-load verification, lean Git continuation, and quota preflight with honest unavailable-value handling.
- Keeps full independent formal gate for persistence/validation, roles, migrations, integrations and L2/L3 work.

## 1.8.0 — 2026-10-30
- Adds opt-in Pilot Rapid UAT mode: minimal risk-proportional predeployment verification and real user UAT as the functional acceptance gate.
- For purely visual L1 changes, avoids synthetic databases and broad synthetic scenarios by default while requiring build, scoped commit and safe app-only deployment.
- Maintains targeted transaction/persistence verification for risky changes and keeps production data, rollback, Git governance and mandatory semantic handoff gates intact.
- Clarifies that synthetic PASS is not evidence of real-workflow UAT PASS.

## 1.7.0 — 2026-10-21
- Adds impact-based L1/L2/L3 classification and risk-proportional verification while preserving all security, Git and semantic-gate invariants.
- Adds Design Master / Design Freeze and shared-component strategy with owner-approved references and targeted visual UAT.
- Requires explicit impact manifests, selective test reuse, honest NOT_RUN/UNVERIFIED evidence and reclassification when actual diff expands scope.
- Keeps old protocol pins for in-flight tasks; new formal behavior-changing handoffs use v0.4-compatible optional risk and design fields with v0.3 structural gate.

## 1.6.0 — 2026-10-21
- Preserves 1.5.0 governance, Git safeguards, multi-session continuity, quota controls, spec precedence and checkpoint optimization.
- Pins new formal behavior-changing tasks to AI Meta Handoff 0.3 with independently reconstructed META-only semantics and recorded manager comparison.
- Introduces required version/source-bound structural preflight, fail-closed semantic blocking and attempt-level research measurements.
- Adds a portable, governance-only deployment template and explicit distinction between procedural and independently enforced CI/launcher gates.
- Does not mandate changing or retroactively revalidating in-flight development tasks.

## 1.5.0 — 2026-10-19
- Added executor-local methodology mirroring for environments such as Codex that cannot access ChatGPT Skills directly.
- Defines `ai/skills/**` as versioned execution methodology / developer context, never product requirements.
- Adds a minimal-copy rule: mirror only Skills actually required by the executor workflow and their direct protocol/reference dependencies.
- Requires project governance to distinguish `spec/current/**` (product authority) from `ai/skills/**` (how the executor works).
- Adds explicit fallback behavior when a prompt references a Skill unavailable to the executor: load the Git mirror or stop as methodologically blocked; never pretend the Skill was used.
- Adds controlled update/version provenance for mirrored methodology and keeps secrets/customer data out of the mirror.

## 1.4.0 — 2026-10-19
- Added checkpoint-based continuation: verify once, work narrowly, verify again at coherent boundaries.
- Prevents mechanical rereading of unchanged historical specifications, handoff history, and repository-wide state after a validated checkpoint.
- Adds selective rerun rules for previously PASSed tests/evidence when inputs and dependencies are unchanged.
- Adds bounded cadence for expensive UAT preservation/fingerprint/health checks: takeover, coherent checkpoint, and pre-deploy/destructive boundary.
- Adds full-corpus automated validation plus deterministic representative visual/manual sampling for large generated artifact sets.
- Adds current-state-first handoff/report guidance and explicit escalation triggers back to broad verification.
- Preserves source-of-truth precedence, Git safety, UAT/data protection, destructive-operation gates, and final acceptance requirements.

## 1.3.0 — 2026-10-19
- Added mandatory independent META-only reverse translation and semantic comparison gate for formal implementation tasks.
- Added separate Codex completion META report for manual transfer to project manager AI.
- Defined evidence-backed manager comparison and closure gate, keeping project handoff distinct from implementation-completion report.
- Preserved existing Git governance, quotas, and multi-session continuity rules.

# Changelog

## 1.2.0 — 2026-09-30

- Adds persistent Git-backed `dev/CODEX_HANDOFF.md` for long-running Codex work.
- Adds multi-session, multi-account and multi-workspace continuation rules.
- Adds quota-aware modes for 5-hour and weekly limits: normal, checkpoint-aware and mandatory handoff.
- Requires mandatory handoff at 10% or less remaining quota and checkpoint-aware behavior at 20% or less.
- Requires a reusable `NEXT CODEX PROMPT` at session handoff.
- Distinguishes specification authority, Git implementation reality and handoff navigation context.
- Requires the receiving Codex to verify repo root, branch, HEAD, working tree and handoff consistency before continuing.
- Adds continuity self-test guidance and forbids storing secrets in handoff files.

## 1.1.0 — 2026-09-29

- Adds a mandatory authoritative-spec manifest before functional implementation.
- Requires Codex to confirm complete/reliable readability of every file in `spec/current/`.
- Adds explicit `GOVERNANCE STATUS: PASS` / `GOVERNANCE STATUS: BLOCKED` gating.
- Blocks implementation when any authoritative file is unreadable, omitted, or precedence is ambiguous.
- Generalizes the rule from the first real Memala mid-cycle governance test.

## 1.0.0 — 2026-09-29

Initial master release.

- Defines Chat/Project Sources → Git governance → Codex → user acceptance workflow.
- Supports greenfield, mid-cycle adoption and controlled changes.
- Introduces source audit and minimal Codex context layer.
- Defines `BUG_AGAINST_SPEC`, `APPROVED_SPEC_CHANGE`, `REQUIREMENT_NOT_FOUND` and `IMPLEMENTATION_ONLY`.
- Defines persistent repository governance through `AGENTS.md` and `spec/README.md`.
- Adds safe Git handling, commit discipline, Codex handoff templates and acceptance loop.
- Applies Master–Deployment and SemVer principles.


## 1.13.0 — 2026-11-10
- HUMAN + META becomes the default precise AI-to-AI instruction format, independent of risk tier.
- Rapid retains low process overhead and targeted checks; compact META no longer implies formal gates.
- Formal safety checks remain for genuinely protected operations; no repeated completed reviews absent scope changes.
