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