# Pilot Rapid Delivery – low-overhead operational handoff

## Admission (opt in only)

Apply to owner-approved pilot such as MEMALA. The owner approves the operating mode and each change's functional scope. The current approved product spec remains authoritative, not historic source code or screenshots. Keep previously pinned in-flight tasks unchanged.

1. Identify impact. `RAPID_OPERATIONAL` is allowed for L1 presentation and narrowly local non-persistent UI interaction changes only if no authorization, API, data storage, workflow state, external integration, migration, deletion, or cross-workspace behavior changes. A user-facing validation fix that writes document dates is L2, not L1. Payment-card ownership data changes are L2 or higher even if its control looks tiny. If unsure, `FORMAL_CONTROLLED`.
2. For Rapid, preserve the human-approved scope and source ref; document protected UI, changed and excluded surfaces, no new behavior beyond approval, one relevant build/component smoke, live-app revision check, safe app-only deploy, owner UAT, and Git rollback path. No synthetic DB by default.
3. Formal change = full existing independent HUMAN/META reconstruction, structural validator, provenance and evidence, and proportional focused tests. Reuse valid existing evidence, do not rerun entire history.
4. **Design Freeze**: the existing owner-approved look is binding. Use neighboring screen/component and style tokens, consistent sizing, icons, spacing, typography, responsive behavior and accessibility. Never invent style from scratch. Screenshot is acceptance reference only; project spec stays functional authority.
5. **Mandatory executor output**: Every completed `RAPID_OPERATIONAL` task must end with both (a) a concise HUMAN summary and (b) a separate, complete, copy-paste-ready fenced YAML block headed `CODEX IMPLEMENTATION META REPORT`, marked `EXECUTOR_TO_ORCHESTRATOR`. Keep it compact with task ID, actual change, tests, Git/deployment refs, UAT state, blockers, `manager_review_status: NOT_REVIEWED`, `manual_transfer_required: true`, and next action. The report must appear inline in the final answer even if a META file is also saved. No formal round-trip gate is claimed for eligible L1 Rapid tasks. This operational completion handoff is mandatory, not merely optional when the AI Meta Handoff skill is available.
6. **Lean continuation**: preflight verify repo root, branch, HEAD, dirty/staging, current task and relevant spec, then consult latest `dev/CODEX_HANDOFF.md`; avoid repeated full scans when verified checkpoint remains valid. End with current commit, deploy revision, evidence, UAT pending/passed/failed, blockers and exact NEXT CODEX PROMPT. Keep one current-state-first handoff; history remains in Git.
7. **Quota**: honor known 20% checkpoint aware and 10% handoff threshold, for both limits independently; if unknown, `NOT_AVAILABLE` rather than guessing. Use short incremental commits and handoff before exhaustion.
8. **Data**: no synthetic writes, deletions or migrations in real production database; preserve tenant isolation and worker state. App-only deployment does not authorize data migration. User-performed UAT may naturally create real pilot records and must be distinguishable from synthetic test writes. Paid AI calls are permitted by project policy, never turn off AI workers as a generic restriction.

## Rapid HUMAN + META input / output example

INPUT: `task_id`, approved behavior or exact UX correction, source approval, `risk=L1`, unchanged surfaces, design reference, acceptance action, deploy target and allowed scope.

OUTPUT HUMAN: `task_id`, `RAPID_OPERATIONAL` justification, actual changed files, checks PASS/NOT_RUN, commit, deployed revision, UAT=WAIT_FOR_UAT, blocker and `NEXT CODEX PROMPT`.

OUTPUT META: a distinct fenced `yaml` section headed `CODEX IMPLEMENTATION META REPORT` containing `task_id`, `direction: EXECUTOR_TO_ORCHESTRATOR`, `profile: RAPID_OPERATIONAL`, change summary, tests, commit, deployed revision, `owner_uat: WAIT_FOR_UAT`, `manager_review_status: NOT_REVIEWED`, `manual_transfer_required: true`, blockers and next action. Include the entire block directly in Codex's final response; a saved JSON/YAML path is insufficient. No fictional META round-trip PASS. The operator can copy this into another session/account without the original chat.

## Mode decision tests

| Case | Route | Reason |
| --- | --- | --- |
| Replace text edit button with existing pencil icon | RAPID_OPERATIONAL | Presentation only, unchanged action |
| New account form layout using existing component | RAPID_OPERATIONAL only if no validation/API/state changes | Preserve Design Freeze |
| Change payment-card private/company ownership semantics | FORMAL_CONTROLLED | Changes persisted meaning |
| Fix invoice due-date save rejecting same issue date | FORMAL_CONTROLLED | Persistence/validation |
| Modify tenant roles or permission boundaries | FORMAL_CONTROLLED, L3 | Authorization |
| New DB migration | FORMAL_CONTROLLED, L3 | Schema/data risk |

Do not claim measured speed gains without observed timing and quota data.
