# AI Meta Handoff Protocol

Protocol identifier: `AI_META_HANDOFF`
Current version: `0.4` (v0.2/v0.3 field meanings preserved)

This protocol is a machine-oriented projection of a human-readable specification or result. It is never the source of product authority by itself.

## Required envelope

```yaml
protocol:
  id: AI_META_HANDOFF
  version: "0.4"

handoff:
  id: <stable-or-generated-id>
  direction: SPEC_TO_EXECUTOR | EXECUTOR_TO_ORCHESTRATOR | PEER_TO_PEER
  message_type: REQUIREMENT | IMPLEMENTATION_RESULT | TEST_RESULT | REVIEW_RESULT | UAT_RESULT | STATUS | PROTOCOL_FEEDBACK
  project: <project-id-or-name>
  timestamp: <ISO-8601 if known>

human_authority:
  status: AUTHORITATIVE
  source_refs: []
  precedence: []

meta_status:
  semantic_match: CONFIRMED | PARTIAL | CONFLICT | NOT_CHECKED
  unresolved: []
```

## Requirement representation

Use for approved requirements or work instructions.

```yaml
requirements:
  - id: REQ-001
    status: REQUIRED | OPTIONAL | PROHIBITED | DEFERRED
    action: ADD | CHANGE | REMOVE | PRESERVE | VERIFY
    target: <stable target name>
    scope:
      - UI | FRONTEND | BACKEND | API | DATABASE | AI | AUTH | WORKFLOW | OPERATIONS | TESTS | DOCUMENTATION
    behavior:
      <structured project-specific fields>
    constraints: []
    must_preserve: []
    acceptance:
      - id: AC-001
        condition: <human-readable but testable condition>
    source_refs: []
    interpretation:
      certainty: CONFIRMED | UNPROVEN | UNKNOWN
      notes: null
```

## Result representation

Use when an executor returns implementation, test, review, or UAT results.

```yaml
results:
  - requirement_id: REQ-001
    status: IMPLEMENTED | VERIFIED | NOT_APPLICABLE | BLOCKED | PARTIAL | FAILED
    affected_layers: []
    implementation:
      components: []
      behavior_changes: []
      persistence_impact: NONE | ADDITIVE | MODIFIED | DESTRUCTIVE
      api_impact: NONE | ADDITIVE | MODIFIED | BREAKING
      migration_ids: []
    evidence:
      tests: []
      artifacts: []
      observations: []
    interpretation_variance:
      status: NONE | MINOR | MATERIAL
      details: null
```

## Evidence and test format

```yaml
test_evidence:
  - id: TEST-001
    kind: UNIT | INTEGRATION | RACE | BROWSER | BUILD | MANUAL | UAT | STATIC_ANALYSIS | OTHER
    scope: <what was tested>
    status: PASS | FAIL | PARTIAL | NOT_RUN
    count: null
    command_or_method: null
    artifact_ref: null
    notes: null
```

Never use `PASS` when the evidence is only an assumption or intended future test.

## Uncertainty and root cause

```yaml
root_cause:
  status: CONFIRMED | UNPROVEN | UNKNOWN
  findings: []
  excluded_hypotheses: []
  remaining_hypotheses: []
```

Use `UNPROVEN` when evidence suggests a cause but does not establish it.

## Blockers and missing requirements

```yaml
blockers:
  - code: REQUIREMENT_NOT_FOUND | CONFLICTING_REQUIREMENTS | ENVIRONMENT_BLOCKED | SAFETY_BLOCK | OTHER
    scope: <affected requirement or component>
    details: <what is missing or conflicting>
    affected_only: true
```

Do not stop unrelated work when `affected_only: true` and the human specification allows independent progress.

## Project state

```yaml
project_state:
  git:
    governance_commit: null
    implementation_commits: []
    final_head: null
    dirty_changes_preserved: null
  deployment:
    environment: null
    status: NOT_DEPLOYED | DEPLOYED | READY_FOR_UAT | FAILED
    health: null
    readiness: null
  data:
    migration_ids: []
    reset_performed: false
    preservation_evidence: []
  external_actions:
    ai_calls: null
    email_calls: null
    other_calls: []
```

## Protocol feedback

Use when the protocol itself was insufficient.

```yaml
protocol_feedback:
  ambiguity_detected: true
  area: <protocol concept>
  human_fallback_used: true
  suggested_extension:
    field: <candidate field name>
    purpose: <why it would reduce interpretation>
```

Protocol changes are proposals until explicitly approved by the protocol owner.

## Semantic round-trip validation

Before finalizing a SPEC_TO_EXECUTOR handoff:

1. Read the HUMAN layer.
2. Read only the META layer and reconstruct the intended behavior.
3. Compare the reconstruction against the HUMAN layer.
4. Set:
   - `CONFIRMED` if material meaning matches.
   - `PARTIAL` if the meta layer intentionally omits nuance but does not contradict it.
   - `CONFLICT` if any structured statement changes the human meaning.
5. Never deliver a `CONFLICT` handoff as ready for execution.

## Extensibility

Project extensions may add fields under:

```yaml
extensions:
  <project-or-domain-name>:
    ...
```

They must not redefine the meaning of core fields in the same protocol version.

## V0.2: Independent reverse translation and manager acceptance

For `SPEC_TO_EXECUTOR`, use the existing envelope, then include:

```yaml
round_trip:
  original_human_ref: spec/current/approved-spec.md#REQ-001
  source_revision: <revision-or-hash>
  reconstructed_human: <complete human reconstruction made using META alone>
  reconstruction_input: META_ONLY
  comparison:
    - requirement_id: REQ-001
      completeness: MATCH | OMITTED | PARTIAL
      meaning: MATCH | CONFLICT | UNVERIFIED
      constraints_preserved: true
      prohibitions_preserved: true
      acceptance_preserved: true
      unapproved_additions: []
      discrepancies: []
  gate: PASS | BLOCKED
  reviewer: <independent-worker-or-reviewer-identifier>
```

Do not expose the original HUMAN DEFINITION to the reconstruction worker before it creates `reconstructed_human`. The comparing manager must have both inputs. `gate: PASS` only if *all* material requirements, constraints, prohibitions, and acceptance criteria match, with no material additions or unknowns. The existing `meta_status.semantic_match` remains as a backwards-compatible summary; it is not enough by itself. On mismatch repair META, do not mutate approved HUMAN to fit.

For `EXECUTOR_TO_ORCHESTRATOR`, the executor **must return a standalone YAML block labelled `CODEX IMPLEMENTATION META REPORT`**, directly copyable by a human to another account. Use existing `results`, `test_evidence`, `project_state` and add:

```yaml
completion_report:
  task_id: <approved-task-id>
  task_source_ref: <authoritative-human-definition-ref>
  task_source_revision: <revision-or-hash>
  self_reported_status: IMPLEMENTED | PARTIAL | BLOCKED | NOT_STARTED
  completed_requirement_ids: []
  partial_requirement_ids: []
  unimplemented_requirement_ids: []
  unapproved_changes: []
  known_limitations: []
  manual_transfer_required: true
  manager_review_status: NOT_REVIEWED
```

The executor MUST report all requirements, including missing, failed, not-tested, and deferred items, with requirement IDs and concrete Git/test evidence. It must not assert manager acceptance or transfer. Never use `VERIFIED` for claims supported only by a Codex narrative. A `PASS` test must list the actual test method and result, not intention.

After manual transfer, the **manager**, not executor, performs two checks:

1. **Semantic check:** reconstruct `IMPLEMENTATION_RECONSTRUCTED` from the returned META alone, independently compare its claims against each requirement and acceptance criterion in authoritative HUMAN DEFINITION, and record missing, extra or changed behavior. This checks consistency of the *report* with the specification.
2. **Evidence check:** inspect available code diffs, Git refs, test logs and UAT; do not infer implementation correctness solely from the report. When the manager cannot access evidence, mark `UNVERIFIED` and request evidence/UAT, not `MATCH` as verified implementation.

Recommended manager-side record (not authored as an executor conclusion):

```yaml
manager_comparison:
  task_id: <same-task-id>
  human_definition_ref: <authoritative-ref>
  report_handoff_id: <handoff.id>
  reconstructed_from_meta_only: <description of what executor claims it did>
  requirements:
    - id: REQ-001
      reported_match: MATCH | PARTIAL | DEVIATION | UNVERIFIED | BLOCKED
      evidence_status: VERIFIED | SELF_REPORTED | NOT_AVAILABLE | FAILED
      deviations: []
      next_action: null
  closure_gate: CLOSED | WAIT_FOR_UAT | RETURN_TO_CODEX | BLOCKED
  reviewer: <manager-id>
```

`CLOSED` requires no material discrepancies, adequate independent evidence and the necessary human acceptance. A different branch, spec revision, omitted requirement, or materially conflicting behavior cannot be silently closed. Retain the handoff and manager comparison in the project's controlled history without copying sensitive data into general methodology masters.


## V0.3 reproducible evidence envelope (additive to v0.2)

Historical v0.2 handoffs remain valid as archived evidence but **cannot satisfy a new v0.3 pre-execution gate without a fresh independent review**. Never interpret a structural validator result as a semantic verdict.

The deterministic preflight validator accepts one JSON object (YAML equivalent may be stored separately) containing `meta`, `review`, and `measurement`. Preserve the full v0.2 META payload, adding `handoff.task_id` equal to the requested task ID and setting `protocol.version: "0.3"`, and the existing mandatory `round_trip` fields. Record the review separately from META so changing a review does not silently rewrite an instruction payload:

```yaml
review:
  round_trip:
    original_human_ref: spec/current/approved.md
    source_revision: immutable-revision-or-hash
    meta_sha256: sha256-of-canonical-meta-json
    reconstruction_input: META_ONLY
    reconstructed_human: "Complete independent reconstruction..."
    reconstruction_worker: independent-worker-id
    comparison_worker: manager-worker-id
    reviewer: accountable-manager-id
    comparison:
      - requirement_id: REQ-001
        completeness: MATCH
        meaning: MATCH
        constraints_preserved: true
        prohibitions_preserved: true
        acceptance_preserved: true
        unapproved_additions: []
        discrepancies: []
    gate: PASS
measurement:
  task_id: TASK-ID
  protocol_version: "0.3"
  study_mode: OBSERVATIONAL
  iteration: 1
  requirement_count: 1
  discrepancies: []
  tokens_input: NOT_AVAILABLE
  tokens_output: NOT_AVAILABLE
  elapsed_seconds: NOT_AVAILABLE
  cost_usd: NOT_AVAILABLE
  escaped_defects: NOT_AVAILABLE
  final_gate: PASS
  evidence_refs: []
```

The validator's JSON canonical META digest uses sorted keys, UTF-8, compact separators, retaining Unicode. It is a **change detector**, not a cryptographic signature of human approval. The validator may not be used to create a semantic PASS. Review artifacts must have independent provenance and be versioned. A source revision mismatch, missing IDs, incomplete coverage, META digest mismatch, unavailable reconstruction, worker collision or non-PASS review **blocks implementation**.

A deployment may store iteration records in JSONL using `references/measurement.md`. Retain raw per-attempt evidence in the project's access-controlled repository, aggregate anonymized research statistics separately. See `scripts/test_validator.py` for negative and positive examples.


## V0.4 risk and frozen UX optional extension

See `references/risk-design-extension.md` and the SKILL.md v0.4 section. No existing v0.3 required field, meaning or gate is altered.

## 0.4.1 validator compatibility clarification

The 0.4.1 bundled validator accepts `protocol.version: "0.3"` or `"0.4"` and requires `measurement.protocol_version` to match exactly. The current native envelope version remains `"0.4"`; 0.4.1 is the Skill PATCH release number, **not** a new envelope value. Unknown envelope versions are fail-closed.
