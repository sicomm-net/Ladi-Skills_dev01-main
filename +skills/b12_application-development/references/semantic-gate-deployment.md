# Semantic Gate Deployment — application-development 1.6.0

## Controlled adoption
1. Finish/secure already-running development work; record checkpoint and preserve dirty changes. Do not retroactively invalidate a running task.
2. Verify actual Git branch, HEAD, status, `AGENTS.md`, `spec/README.md`, authoritative files and precedence before any methodology update.
3. In a separate governance-only commit, mirror `ai-meta-handoff` 0.3 including `scripts/validate_handoff.py` and references; pin Application Development 1.6.0. Never copy whole unrelated Skill catalog.
4. For new functional tasks generate `ai/handoffs/<task>/reviewed-bundle.json` only after approved HUMAN and a truly independent META-only reconstruction plus manager comparison. Run structural preflight before Codex.
5. Save attempt-level metrics and implementation report/manager review in an access-controlled deployment folder. Preserve v0.2 archives; never forge missing reviews.
6. Pilot with a small, safe functional task; test success + mandatory negative paths, then approve broader deployment only after human UAT.

## Recommended project layout (adapt to existing repository)

```text
AGENTS.md
spec/README.md
spec/current/
ai/skills/application-development/SKILL.md
ai/skills/ai-meta-handoff/{SKILL.md,references/,scripts/}
ai/governance/deployment.yaml
ai/handoffs/<TASK>/reviewed-bundle.json
ai/measurements/handoff-events.jsonl
dev/CODEX_HANDOFF.md
```

## Blocking policy

- `BLOCKED` on missing reconstruction, independent provenance, source revision mismatch, edited META, partial comparison, unresolved requirement or missing measurements.
- Require authentic manager/human judgment for semantic equivalence; no Python script can infer it from a PASS label.
- Require independent revalidation of code/test evidence and UAT before `CLOSED`.
- Add a protected-branch CI required check where feasible. A local instructions-only check is not a tamper-proof enforcement mechanism.
- Do not install, update Skills or touch MEMALA solely by generating this master artifact.

## Minimal reference test matrix

Valid review PASS; missing review BLOCKED; changed META digest BLOCKED; stale source revision BLOCKED; missing acceptance/requirements BLOCKED; duplicate IDs BLOCKED; mismatched coverage BLOCKED; failed manager comparison BLOCKED; missing metric BLOCKED; executor-only report never accepted as authoritative approval.
