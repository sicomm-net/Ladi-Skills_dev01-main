# Pilot Rapid UAT (opt-in project mode)

## Activation and authority

Activate only for a pilot explicitly approved by the project owner. Record that choice in project workflow/governance; project-specific requirements remain in `spec/current/**`. This operating mode does not grant permission to modify source-of-truth requirements or bypass independent semantic gates for behavior changes. Keep existing pinned protocol versions for in-flight tasks.

## Execution loop

1. Classify the actual impact (L1/L2/L3), not the apparent code size. Determine affected UI/API/persistence/auth/data/worker surfaces.
2. Keep changes atomic, inspect Git state and preserve unrelated work.
3. **Pure visual/mechanical L1:** targeted build/component smoke check; no synthetic test database by default; scoped commit; safe app-only deployment; owner visual/scenario UAT. Document tests not run and why. If the change actually alters behavior, apply required §12 semantic gates; do not call it mechanical.
4. **Behavior-changing low-risk changes:** respect §12 formal handoff gates and perform the smallest control(s) for the touched behavior. Use production UAT for functional validation only after safe deploy.
5. **Persistence, validation, roles, multi-tenant boundaries, deletion or migrations:** reclassify to L2/L3 as appropriate and verify integrity/authorization/transaction behavior with targeted isolated tests before deployment; real UAT is complementary, not a substitute.
6. On successful checks, commit, deploy only the intended app version into the pilot, verify actual running revision and health, preserve real records and running dependent services. Never reset, seed or perform synthetic writes in production.
7. Owner exercises real scenario in the pilot. Record PASS/FAIL and concrete reproduction. Do not claim closure on synthetic PASS or deployment success alone; UAT closure belongs to manager/owner.
8. If UAT fails, diagnose one specific defect and iterate narrowly; do not add unrelated features or broad regression suites without impact evidence.

## Invariants and exceptions

- Minimal verification is not zero verification. An L1 label does not automatically exempt semantic handoff requirements; only demonstrably mechanical, non-behavioral changes qualify for the documented exemption.
- Preserve data, audit and isolation across Workspace; deployment must be reversible at application level. Rollback of code is not necessarily rollback of data.
- Do not disable AI services or paid AI calls merely as a generic cost precaution; follow the project's explicit operating policy. Costly extraordinary workloads still need explicit approval.
- Keep a short per-change record: classification, impact, changed files, checked/not checked controls, commit, running version, UAT state and next action.
