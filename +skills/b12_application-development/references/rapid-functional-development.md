# RAPID_FUNCTIONAL – approved experimental development profile (v1.12)

## Scope and decision
Activated by an **explicit, persistent opt-in from the project owner** in Git governance (e.g. `AGENTS.md`/`spec/README.md`), with the development runtime and test data identified. Project specifications remain authoritative. If the project is in active development by its author, such as MEMALA, routine fixes of already approved behavior may be made under this profile, including changes to extraction logic, worker, transformations, UI, API, or data in an existing schema, under the conditions below.

### Admission conditions
- The task concerns a specific approved behavior, or the owner has just approved a change to it; the new meaning is recorded in the relevant project specification before the change is completed at the latest.
- The affected environment is demonstrably `DEVELOPMENT`, not production, and the actual scope of permissions and data is known.
- There is no change to authentication, authorization, tenant isolation, legally significant retention/audit, accounting or tax semantics, no irreversible handling of protected data, and no uncontrolled new migration.
- The fix is bounded and has a concrete verifiable outcome. An unclear boundary or a new security impact switches **only the affected block** to `FORMAL_CONTROLLED`.

### Working loop
1. Once at the start, verify the relevant `AGENTS.md`, the active assignment/specification, and the Git root/branch/HEAD/dirty state; adopt a valid checkpoint without re-reading the whole history.
2. Capture a human contract in 5–12 lines: goal, affected areas, forbidden interventions, target development environment, test/owner UAT. Do not request a second approval of the same contract.
3. Implement autonomously. Fix ordinary technical obstacles within scope (e.g. an outdated cleanup manifest). Do not build artificial gates or duplicate reports.
4. Run a targeted build and the smallest relevant unit/integration/negative test for the changed data path; preserve verification of the tenant/data boundary actually affected. Do not run the complete repository suite without a substantive reason.
5. Commit a coherent change; deploy the approved app-only revision to the designated Development environment, check the running revision and basic health; hand over to the owner for UAT.
6. Output = **one short HUMAN report** covering the task, actual diff/commit, targeted tests, deploy target/revision, UAT, and any real blocker. META YAML, independent META-only reconstruction, validator, and attempt metrics are not required for this profile and are not reported as PASS. Maintain a Git handoff only if cross-session continuity is needed.

### Test data
Identified test imports approved by the owner in the designated development DB are consumable. Existing scoped cleanup is preferred; its automatic recovery copies are allowed. Do not require an additional export or additional confirmation. Before removal, verify client IDs, table relations, working states, and that the records are not other/protected documents. If the manifest is outdated, fix it for the tables actually affected, with a narrowly targeted dry-run/count and a reference check; no direct SQL as a bypass and no global reset. If the scope cannot be proven, stop **only the deletion**; other fixes continue.

### Pre-authorized operations
Code editing, targeted tests, build, internal worker restart, routine cleanup of the lab AI audit table, an approved app-only deploy to the designated Development environment, and scoped removal of the approved test corpus, all without further confirmation. This never includes production, other tenants, secrets, exceeding provider cost limits, or global destructive DB actions.

### When FORMAL_CONTROLLED is required
New or changed business/accounting semantics outside the approved assignment, DB migration/multitenancy/auth, a new external side effect with material cost, removal of real accounting data, any production intervention, a broad or unverifiable operation, or a conflict of authoritative requirements.

### Existing rules
This profile **explicitly replaces** the older universal requirements for a formal semantic gate and a mandatory META completion report *only for tasks classified as RAPID_FUNCTIONAL*. `RAPID_OPERATIONAL` remains for mechanical UI work; `FORMAL_CONTROLLED` for everything else. Keep the active protocol pin of tasks already running until the owner explicitly switches it; never pretend a formal gate passed.


## v1.13 override — HUMAN + META as a communication aid

Replace the older 'one HUMAN contract/report, no META' wording for developer AI handoffs with **one compact HUMAN + META request and one compact HUMAN + META result**, without formal META validation, independent workers or extra approval steps. This format does not change RAPID_FUNCTIONAL admission limits or risk-scaled tests. `ai-meta-handoff` v0.7 `references/precision-without-bureaucracy.md` supplies the short schema.
