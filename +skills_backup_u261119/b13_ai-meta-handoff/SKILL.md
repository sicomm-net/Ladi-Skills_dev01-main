---
name: ai-meta-handoff
description: Create, validate, and interpret bidirectional AI-to-AI development handoffs using a complete human-readable layer plus a structured meta layer. Use when requirements, implementation instructions, implementation results, test evidence, UAT findings, or project state must pass between a project/orchestrator AI and coding, testing, review, or other execution AIs with minimal semantic loss. Also use when converting a human-approved specification into machine-oriented handoff data, or when converting structured executor results back into project state. Human meaning is always authoritative; the meta layer is a machine-optimized projection and fallback never overrides the human layer.
---

# AI Meta Handoff

Skill version: **0.7.0**. Formal protocol version: **0.4.1** (wire/evidence compatibility preserved).

For **FORMAL_CONTROLLED** work use the following two-layer contract for communication between humans and AI agents:

1. **HUMAN LAYER** — complete enough for a human to understand, review, correct, and approve the intended meaning.
2. **META LAYER** — structured, explicit, machine-oriented representation for precise AI-to-AI transfer.

The human layer is authoritative. The meta layer may be more detailed, but it must never change the human meaning.

## Core workflow

### A. Specification / instruction handoff

When a human or project AI sends work to an executor AI:

1. Preserve the approved human specification without material shortening.
2. Identify authoritative sources, precedence, scope, and explicit decisions.
3. Convert those decisions into the protocol in `references/protocol.md`.
4. Separate facts, requirements, constraints, implementation freedom, acceptance criteria, and unresolved questions.
5. Perform an independent semantic round-trip check: give a reconstruction worker only the META layer (no original HUMAN text), reconstruct `HUMAN_RECONSTRUCTED`, and compare requirement-by-requirement with the authoritative HUMAN DEFINITION. Record omissions, contradictions, additions, and preservation of prohibitions and acceptance criteria. See `references/protocol.md`.
6. If the meta layer cannot represent a requirement without guessing, keep the human text and mark the affected structured field as unresolved.
7. Use `REQUIREMENT_NOT_FOUND` when a required decision is absent. Never infer missing product requirements from existing code, prototypes, or historical behavior unless the human layer explicitly authorizes that source.
8. Deliver both layers together. An implementation-ready handoff requires `round_trip.gate: PASS`; `PARTIAL`, `CONFLICT`, `NOT_CHECKED`, or missing evidence block affected implementation. The human source remains authoritative; never edit it merely to match META.

### B. Executor / implementation-result handoff

When a coding, testing, review, or other execution AI reports results:

1. Produce a concise human summary focused on what changed, what did not, risks, blockers, evidence, and readiness.
2. Produce a more detailed META layer using `references/protocol.md`.
3. Map each requirement or acceptance criterion to an explicit status.
4. Record affected layers, implementation components, persistence/API impact, tests, evidence, deviations in interpretation, commits/artifacts, deployment state, and relevant counters.
5. Distinguish observed facts from hypotheses. For example, use `root_cause.status: UNPROVEN` rather than implying a cause from correlation.
6. If the implementation differs from the approved human meaning, report the variance. Do not silently normalize it.
7. Preserve enough structured state that another AI can continue the project without re-deriving technical details from prose.
8. At the end of a coding task, Codex must emit a **separate, complete, copy-paste-ready `EXECUTOR_TO_ORCHESTRATOR` META result block** labelled `CODEX IMPLEMENTATION META REPORT` (in addition to the concise HUMAN summary). The human operator manually transfers the entire META block into the manager/master-process conversation. Do not claim the transfer happened or that the manager accepted the result.
9. On receipt, the manager checks the report's task IDs and authoritative source revisions, reconstructs `IMPLEMENTATION_RECONSTRUCTED` from the META result alone, then compares each claimed result to the approved HUMAN DEFINITION and acceptance criteria. Classify `MATCH`, `PARTIAL`, `DEVIATION`, `UNVERIFIED`, or `BLOCKED`, with per-requirement evidence. Distinguish **self-reported implementation**, independently inspected code/tests, and human UAT. The manager, not Codex, determines `CLOSED` versus `RETURN_TO_CODEX` / `WAIT_FOR_UAT`.
10. The result META is a claim about work performed, not a new requirement source. Never silently change the HUMAN DEFINITION or set `VERIFIED` solely from a Codex assertion.

## Human-layer rules

- Keep it readable by a non-coding project owner who understands the system conceptually.
- Do not compress away product meaning merely because the meta layer is detailed.
- State important trade-offs, behavioral changes, and unresolved decisions explicitly.
- A human correction always overrides the meta interpretation.
- When the human layer and meta layer conflict, stop and surface the conflict instead of choosing the meta layer.

## Meta-layer rules

- Prefer explicit fields and enums over interpretive prose.
- Prefer atomic values over sentences when the concept is stable enough to model.
- Keep free-text fields only where nuance is genuinely needed.
- Use stable IDs for requirements, acceptance criteria, experiments, handoffs, and artifacts when available.
- Keep source references and precedence explicit.
- Mark uncertainty explicitly (`CONFIRMED`, `UNPROVEN`, `UNKNOWN`, `BLOCKED`).
- Do not claim test evidence that was not actually produced.
- Do not turn hypotheses into facts.
- Preserve project-specific terminology via a project vocabulary extension rather than redefining core protocol terms.

## Protocol evolution

Treat the protocol as versioned and evolutionary.

- Start from the bundled protocol version in `references/protocol.md`.
- Keep existing field meanings stable within a minor version.
- Add new optional fields when recurring handoffs reveal missing semantics.
- Change or remove meanings only in a new protocol version.
- Record protocol feedback when an agent repeatedly needs the human layer because the structured representation is insufficient.
- Never let protocol evolution rewrite already-approved human specifications.

## Project vocabulary

Use the protocol core for generic concepts such as requirement, affected layer, status, evidence, artifact, assumption, and blocker.

Use project-specific extensions for domain entities and states, for example:

```yaml
project_vocabulary:
  Document: "A project's authoritative definition here"
  PostingGroup: "A project's authoritative definition here"
```

Do not embed one project's domain vocabulary into the core protocol.

## Output

Default to one paired handoff with:

1. `HUMAN LAYER`
2. `META LAYER`

For executor completion, explicitly output the standalone fenced YAML `CODEX IMPLEMENTATION META REPORT` as a distinct section that can be copied verbatim to another account. Do not mix explanations or Markdown comments inside its YAML.

Use YAML by default for the META layer because it is readable by humans and structured enough for AI. Use JSON when the receiving system requires strict JSON.

For exact field definitions, enums, and templates, read `references/protocol.md`.
For concrete examples in both directions, read `references/examples.md`.


## V0.3 mandatory auditable semantic gates and quantitative research

Follow `references/measurement.md` for required observations and research method.

### Pre-execution gate for formal behavior-changing tasks

- The *independent reconstruction worker* receives only META, with no original HUMAN or concealed paraphrase. It outputs a complete `HUMAN_RECONSTRUCTED` and discloses its input scope and identity. A separate manager compares against authoritative HUMAN, requirement by requirement, including constraints, prohibitions, acceptance tests, and unapproved additions. Record **every attempt**, including BLOCKED revisions.
- Any missing, unresolved, material mismatch or unverified requirement means `round_trip.gate: BLOCKED`. Never convert `NOT_CHECKED`, `PARTIAL` or manager uncertainty to PASS for convenience, quotas or deadlines. Change META and redo reconstruction independently after material changes; HUMAN authority cannot be edited merely to pass validation.
- Before Codex executes, record the review and a structurally valid, source-bound evidence package using `scripts/validate_handoff.py`. Validator output `STRUCTURAL_PASS` confirms only shape, coverage and META binding; it **never** establishes actual independence, authenticated approval or semantic truth. The manager remains accountable for semantic PASS.
- When no independent worker, executable validator, or trustworthy evidence storage is available, stop as `BLOCKED`. Do not claim the gate has run. Only an explicitly classified, strictly mechanical non-behavioral operation may receive a documented narrow exemption, never a behavior-changing task.

### Return gate

- Executor retains existing standalone full `CODEX IMPLEMENTATION META REPORT` and `manager_review_status: NOT_REVIEWED`. After manual transfer, another META-only reconstruction reports what the executor *claims*, then manager compares it with authoritative HUMAN and independently verifies available Git/test/UAT evidence.
- No closure from the executor's self-report, validator PASS or test green alone. Missing evidence is `UNVERIFIED`; pending UAT means `WAIT_FOR_UAT`. Record outcomes and discrepancies, including failures and escaped defects.

### Measurements and protocol evolution

- For each gate iteration store task ID, protocol version, source revision, model/worker provenance if known, item coverage, discrepancies with severity, iteration count, outcome and evidence. Store actually available tokens, elapsed time, cost, observed false alarms and escaped defects; use `NOT_AVAILABLE` for unknown metrics, never 0.
- Observational detection of defects demonstrates utility of detection, **not** causal superiority. Compare standard natural-language, structured JSON/YAML and META+reverse-translation on controlled comparable tasks before drawing quantitative conclusions. Keep product/customer private data out of the shared research master.
- Future AI-native encoding (B) remains a research hypothesis until phase A has demonstrated a measurable net benefit. Avoid optimizing away reliability.


## V0.4 optional risk and design contract extension

Protocol v0.4 is backward compatible with v0.3 envelope and validator contract. Do **not** make these optional fields mandatory for historical v0.2/v0.3 reports or change task IDs, SHA binding, existing statuses, structural validator semantics, or the meaning of PASS/BLOCKED. Each task pins one protocol version at admission; never silently reinterpret in-flight attempts.

For new tasks, record the following optional extension, when information is available:

```yaml
execution_contract:
  risk_tier: L1 | L2 | L3
  tier_rationale: <impact explanation, not task size>
  affected_surfaces: []
  excluded_surfaces: []
  behavior_change: true | false
  change_impact_ref: <Git-relative evidence path or NOT_AVAILABLE>
  design:
    master_ref: <approved reference or NOT_APPLICABLE>
    freeze_refs: []
    protected_invariants: []
    permitted_variance: []
    approval_ref: <human approval/revision or NOT_AVAILABLE>
  verification:
    required_tests: []
    explicitly_skipped_tests:
      - {test: <name>, reason: <why inputs/dependencies unchanged>}
    user_acceptance: VISUAL | SCENARIO | FORMAL
```

A completion report may include `execution_assessment` with the same `risk_tier`, `actual_affected_surfaces`, `reclassified_from`, `design_diff_evidence`, `tests_not_run` and `uat_status`. A tier cannot self-authorize a deviation from HUMAN, a frozen UI, security safeguards, or a new behavior. When tier escalates, reassess verification and authorization. Product-specific CSS values or screenshots stay deployment-local, not in this master.

### Interaction with semantic gates

- **Any formal behavior-changing task, including L1**: full independent META-only reconstruction + manager per-requirement comparison, recorded PASS/BLOCKED and structural validator before Codex implementation.
- **Strictly mechanical, provably nonbehavioral L1**: retain v0.3 narrow documented exemption; include `mechanical_exemption` with rationale, unchanged behavior/API/DB/auth invariants, and narrow tests. If uncertain, use full gate.
- L2/L3 are not automatically exempt. High-risk actions have additional security, migration and human authorization tests in Application Development; the Handoff protocol carries this evidence but does not decide product risk alone.
- Keep track of attempts/false alarms and measured cost/time/tokens with `NOT_AVAILABLE` for missing data, never claimed savings. Controlled comparisons are necessary for superiority claims.

### Example: layout-only admin header

`risk_tier: L1`, `behavior_change: false`, mechanical exemption justified by no route, auth, API, persistence or semantic changes; compare shared header component across affected page families, report user visual UAT separately. A control that changes server authorization or persisted configuration is *not* this example.

## 0.4.1 validator compatibility fix

For new v0.4 handoffs use `protocol.version: "0.4"` and matching `measurement.protocol_version: "0.4"`. The bundled validator accepts both native 0.4 and legacy 0.3 evidence envelopes, rejects mismatches and unknown versions, and does not validate semantic approval. This PATCH changes no wire format or gate requirements.


## 0.5.0 opt-in operational handoff profile for Rapid pilot work

Read `references/rapid-operational-profile.md`. This is a **separate, explicitly labeled operating profile**, not protocol `0.5` and not a claimed v0.4 semantic-gate PASS. Apply only when a project owner expressly approves Rapid UAT and task admission confirms low-risk, narrowly scoped, non-persistent L1 UI/mechanical change.

- `RAPID_OPERATIONAL`: short approved HUMAN instruction and minimal verifiable continuity record, no formal META envelope, independent reconstruction worker, structural validator or attempt measurement. **Never claim these formal checks ran.**
- `FORMAL_CONTROLLED`: preserve all existing v0.4 mandatory HUMAN/META, independent reconstruction, validator, evidence, separate executor result and owner review obligations. Any changed persistence, validation, identity, access control, financial state, integration, destructive action, data migration, or uncertain risk selects formal.
- In Rapid output require task ID, source approval/ref, scope and exclusions, unchanged contracts, Git ref, checks, deployed revision, UAT state and exact continuation prompt. Human approval remains authoritative; execution report never self-closes UAT.
- In formal output preserve all existing YAML/validator fields and version pins; never silently reinterpret older attempts.
- Keep accurate quota/cost measurement if available; unknown is `NOT_AVAILABLE`. Avoid duplicate long narratives already available in Git or authoritative sources.


## 0.6.0 RAPID_FUNCTIONAL – explicitní kompatibilní výjimka pro development

Pro vlastníkem aktivovaný pilotní profil `RAPID_FUNCTIONAL` (viz Application Development 1.12.0) je předání **jediný stručný lidsky čitelný záznam**: task, schválený scope, dotčené plochy, Git commit/dirty, testy, skutečná revize nasazení, UAT stav a další krok. **Nevytvářej formální META envelope, YAML result, nezávislý META-only semantic gate, validátor ani měření pokusů**; nevydávej je za PASS. Toto je workflow výjimka, **nikoli nová verze drátového protokolu**; `FORMAL_CONTROLLED` nadále používá 0.4/0.4.1 a všechny příslušné brány. Dříve připnuté úkoly se nemění bez explicitního převzetí nového profilu. Při rozporu se starším odstavcem o mandatory YAML pro rapid práci platí toto pravidlo v `RAPID_FUNCTIONAL`.

## V0.7 principle: precise communication is independent of process controls

**Use HUMAN + META as the default communication format for AI-to-AI development tasks, in RAPID_UI, RAPID_FUNCTIONAL and FORMAL_CONTROLLED alike.** HUMAN expresses intent and product meaning; META is a compact machine-readable projection that removes ambiguity about scope, constraints, what is deferred, evidence, and the actual acceptance outcome. HUMAN and the latest owner-approved specification remain authoritative. META never grants new permissions.

**Communication precision does not classify risk or activate gates.** Select required checks separately from the actual affected operations: ordinary UI changes require targeted UI checks; functional changes require the minimum relevant integration/negative tests; protected data/auth/tenant/DB migrations/production require appropriate safety checks. Do not invoke independent META-only workers, structural validators, repeated approvals, research measurement, or multiple report artifacts *solely because META is included*.

### Lightweight HUMAN + META for Rapid tasks

- A concise HUMAN brief plus a short YAML META block with `task_id`, `source/decision`, `goal`, `in_scope`, `out_of_scope`, `must_preserve`, `acceptance`, `execution_profile` is enough. Do not duplicate entire paragraphs.
- Executor may return one compact HUMAN summary plus an equally compact META result identifying requirement statuses, tests actually performed, commit, deployed revision, UAT and blockers. Keep the two together in **one handoff**; no independent round-trip or structural validator in Rapid.
- For purely mechanical single-label/UI changes, a few META fields inside the existing handoff suffice. Never turn this format into an approval request or excuse for blocking a small change.
- Formal protocol v0.4 stays available for **genuinely controlled** changes, but its independent pre-execution/return gate and validator apply only when such risk controls are independently required by the chosen FORMAL_CONTROLLED profile, not when a task merely contains YAML.
- Reuse already completed valid reviews while scope and source have not materially changed. When a risk boundary affects only one block, apply its additional controls only to that block, continuing independent approved work. Do not mark an unperformed gate `PASS`.

Read `references/precision-without-bureaucracy.md` for the short interoperable handoff template and examples. This v0.7 section governs over earlier blanket language claiming formal controls for all HUMAN + META transfers, or suggesting that Rapid should drop META entirely.
