# Rapid operational profile (skill 0.5, formal protocol remains 0.4)

This profile intentionally does not emit the v0.4 formal handoff envelope. It is not suitable as an evidence substitute for formal behavior-changing tasks.

## Admission gate

All required: explicit pilot-owner opt-in; bounded approved task; no changed persistence, document validation, workflow semantics, auth, tenancy, integrations, deletion, schema or other high-impact surfaces; existing UI Design Freeze or approved reference; task-specific reasoning recorded. Otherwise use `FORMAL_CONTROLLED` v0.4. Ambiguous classification => formal.

## Request (short HUMAN)

```text
task_id:
mode: RAPID_OPERATIONAL
source_approval:
risk_tier: L1
requested_ux_change:
protected_design_reference:
unchanged_contracts: API, DB, auth, worker, storage, business workflow
excluded_surfaces:
acceptance_by_owner:
```

## Return (short factual operational handoff)

```text
task_id:
mode: RAPID_OPERATIONAL (not formal META)
reason_no_formal_gate:
git_root/branch/commit/dirty:
changed_files:
checks_passed / checks_not_run:
deploy_target / running_revision:
uat_status: WAIT_FOR_UAT | PASS | FAIL
risks_or_blockers:
NEXT_CODEX_PROMPT:
```

Use a Git-versioned `dev/CODEX_HANDOFF.md` as current-state-first continuity record. An implementation completion statement without owner UAT is never accepted as closed. A receiving Codex must verify Git real state and task authority, not rely solely on this return text. Do not claim independent round trip, validator PASS or authenticated manager review for this profile.

## Examples

- Switch existing action label to standard icon with exactly same onClick => Rapid.
- Change payment-card owner from contact to company/private => formal; persistence semantics.
- Fix a due-date save validator => formal; data modification path.
- Change cross-tenant access => formal L3.


## Addition – RAPID_FUNCTIONAL (skill 0.6.0)

For an owner-authorized non-production, bounded implementation correction including extraction, workers, data transformations or API in existing schema, `RAPID_FUNCTIONAL` is permitted if no accounting-semantic, auth/tenant, schema migration, protected data, production, or new high-impact effect is touched. Follow Application Development 1.12.0 `references/rapid-functional-development.md`. One concise HUMAN handoff suffices. No formal META or formal PASS is implied. Existing `RAPID_OPERATIONAL` L1 rules remain unchanged for UI-only tasks.


## v0.7 override — Rapid precision format

Contrary to older text above, Rapid now **uses a compact HUMAN + META pair by default** for AI-to-AI tasks and returns. The pair is one deliverable, not two report rounds. No formal envelope, independent META reconstruction, validator, measurement or second approval is required merely by emitting META. Apply extra controls only for actual high-risk changes, then classify the affected block as FORMAL_CONTROLLED. See `precision-without-bureaucracy.md`.
