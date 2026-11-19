# Examples

## 1. Human specification to coding AI

### HUMAN LAYER

The user approved serial batch extraction. Only one document may be active in the extraction pipeline at a time. Reliability is more important than throughput. The implementation must not reset unrelated UAT data. If the scope of a destructive test-data reset cannot be identified unambiguously, do not delete anything and return `REQUIREMENT_NOT_FOUND` for the reset only.

### META LAYER

```yaml
protocol:
  id: AI_META_HANDOFF
  version: "0.1"
handoff:
  id: EXAMPLE-SERIAL-001
  direction: SPEC_TO_EXECUTOR
  message_type: REQUIREMENT
  project: ExampleProject
human_authority:
  status: AUTHORITATIVE
  source_refs:
    - approved-human-decision
  precedence:
    - newest-approved-decision-wins
meta_status:
  semantic_match: CONFIRMED
  unresolved: []
requirements:
  - id: SERIAL-01
    status: REQUIRED
    action: CHANGE
    target: batch_extraction
    scope: [BACKEND, AI, WORKFLOW]
    behavior:
      concurrency: 1
      reliability_priority: true
      throughput_priority: false
    constraints:
      - Do not re-enable parallel extraction during this experiment.
  - id: RESET-01
    status: REQUIRED
    action: VERIFY
    target: uat_test_data_reset
    scope: [DATABASE, OPERATIONS]
    behavior:
      destructive_action_requires_unambiguous_scope: true
    must_preserve:
      - unrelated UAT data
      - configuration
      - users and roles
    acceptance:
      - id: RESET-AC-01
        condition: If reset scope is ambiguous, no destructive operation occurs.
```

## 2. Coding AI back to project AI

### HUMAN LAYER

Serial extraction is implemented and ready for UAT. Concurrency is 1 across extraction and persistence. Tests passed. Existing UAT data was preserved. The root cause of the earlier contamination is still unproven.

### META LAYER

```yaml
protocol:
  id: AI_META_HANDOFF
  version: "0.1"
handoff:
  id: EXAMPLE-SERIAL-RESULT-001
  direction: EXECUTOR_TO_ORCHESTRATOR
  message_type: IMPLEMENTATION_RESULT
  project: ExampleProject
human_authority:
  status: AUTHORITATIVE
  source_refs:
    - SERIAL-01
meta_status:
  semantic_match: CONFIRMED
  unresolved: []
results:
  - requirement_id: SERIAL-01
    status: IMPLEMENTED
    affected_layers: [BACKEND, AI, DATABASE]
    implementation:
      components:
        - extraction_worker
        - persistence_gate
      behavior_changes:
        - concurrency set to 1
        - next item starts after durable completion of previous item
      persistence_impact: ADDITIVE
      api_impact: NONE
      migration_ids:
        - 0027_serial_metrics
    evidence:
      tests:
        - TEST-SERIAL-RACE
      artifacts:
        - implementation-report
      observations:
        - UAT data preserved
    interpretation_variance:
      status: NONE
      details: null
root_cause:
  status: UNPROVEN
  findings:
    - No shared mutable buffer was confirmed.
  remaining_hypotheses:
    - Multi-input prompt construction may have contributed.
project_state:
  deployment:
    environment: local_uat
    status: READY_FOR_UAT
    health: 200
    readiness: 200
  data:
    reset_performed: false
    preservation_evidence:
      - core table hashes unchanged
```

## 3. Separate Codex completion block and manual return (v0.2)

The executor emits **two separate sections**: a short HUMAN summary and the following copy-ready META block. The human copies the latter verbatim to the manager AI. The manager then compares it to the original approved HUMAN DEFINITION; Codex itself cannot approve closure.

**CODEX IMPLEMENTATION META REPORT**

```yaml
protocol:
  id: AI_META_HANDOFF
  version: "0.2"
handoff:
  id: EXAMPLE-RESULT-002
  direction: EXECUTOR_TO_ORCHESTRATOR
  message_type: IMPLEMENTATION_RESULT
  project: ExampleProject
human_authority:
  status: AUTHORITATIVE
  source_refs: [spec/current/approved.md#SERIAL-01]
  precedence: [approved-human-definition]
meta_status:
  semantic_match: NOT_CHECKED
  unresolved: []
completion_report:
  task_id: SERIAL-01
  task_source_ref: spec/current/approved.md#SERIAL-01
  task_source_revision: example-commit-sha
  self_reported_status: IMPLEMENTED
  completed_requirement_ids: [SERIAL-01]
  partial_requirement_ids: []
  unimplemented_requirement_ids: []
  unapproved_changes: []
  known_limitations: [UAT has not run]
  manual_transfer_required: true
  manager_review_status: NOT_REVIEWED
results:
  - requirement_id: SERIAL-01
    status: IMPLEMENTED
    affected_layers: [BACKEND]
    implementation:
      components: [extraction_worker]
      behavior_changes: [next item begins only after durable persistence]
      persistence_impact: NONE
      api_impact: NONE
      migration_ids: []
    evidence:
      tests: [TEST-001]
      artifacts: [git:example-commit-sha]
      observations: []
    interpretation_variance:
      status: NONE
      details: null
test_evidence:
  - id: TEST-001
    kind: UNIT
    scope: serial queue
    status: PASS
    count: 1
    command_or_method: pytest tests/test_serial.py
    artifact_ref: git:example-commit-sha
    notes: null
```

Upon receipt, manager reconstructs the claimed behavior from META only, compares it to HUMAN definition and separately verifies repository/tests. If UAT is mandatory but incomplete, `closure_gate: WAIT_FOR_UAT`, never `CLOSED`.


## 4. Version 0.3 structural preflight

Prepare an already independently reviewed JSON bundle with `meta`, `review`, and `measurement` following `references/protocol.md`. Run:

```bash
python3 scripts/validate_handoff.py --bundle path/to/reviewed-bundle.json --task TASK-ID --source-revision EXACT-REVISION
```

`STRUCTURAL_PASS` means only the review evidence is well-formed and bound to this META; it does **not** imply that an AI has been called or that the semantic comparison is objectively correct. Use `python3 -m unittest discover -s scripts -p 'test_*.py'` to test guardrails.
