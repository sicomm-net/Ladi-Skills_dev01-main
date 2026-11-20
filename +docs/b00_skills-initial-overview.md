<style>
   th { padding: 5px 6px !important; }
   td { padding: 2px 6px !important; }                       /* top, right, bottom, left */
   li { margin:  -6px 16px 4px !important; }                 /* top, right/left, bottom */
   h1 { margin:  8px;        color: blue; font-size: 24px; } /* -6px 6px -6px; */
   h2 { margin:  18px 0 8px; color: blue; font-size: 18px; } /* 12px 6px -8px; */
   h3 { margin:  18px 0 8px; color: blue; font-size: 16px; }
   hr { height:  4px; background-color: #b8a9a9; margin-top: 15px; }
  pre { padding: 6px 9px !important; margin: 0px !important; background-color: #d8d2d2 }
 code { background-color: #d8d2d2; }
 blockquote {  padding: 15px 6px 2px !important; }
.page-break { page-break-before: always; break-before: page; }
details { margin-bottom: 16px; border: 1px solid #d0d7de; border-radius: 6px; padding: 10px 16px; }
summary { font-size: 16px; font-weight: bold; color: blue; cursor: pointer; padding: 4px 0; }
</style>
<!-- ----------------------------------------------------------------------------- -->
<!-- <div class="page-break"><hr style="border-inline-style: dashed;"></div> -->

# +skills: Initial Overview

Date: 2026-11-19. Companion to `a00_app-initial-overview.md` (in this folder).

## 1. Summary

`+skills` holds seven skill masters (`b11` to `b17`), one set of session-export scripts (`b01`), and an empty `b00_install-scripts`. Every skill passes `b15_skill-creator/scripts/quick_validate.py`, and the two test suites that ship with the skills pass (12 tests in `b13`, 6 in `b12`). The skills are authored by Ladislav Goc and licensed per customer; all rights are reserved in each skill's own text. Apart from `b15`, which is Apache 2.0, they are not open source.

After the Czech-to-English translation (commit `e429344` and later edits), the only Czech left in `+skills` is deliberate: the "CO – PROČ – Z ČEHO – KOMU – POZOR NA" mnemonic, the Czech trigger phrases beside their English equivalents, and the original Czech file `b16_prompt-evaluation/SKILL_u61118.md`.

## 2. Inventory

| Folder                        | Skill name (`name:`)      | Purpose  of the skill                                                                                                                                                   | Lines               | Version |
|-------------------------------|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|---------|
| `b01_save-session`            | none (scripts)            | Export an AI chat session to a collapsible Markdown transcript. Three variants: Antigravity (`-agy.mjs`), Kiro (`.kiro.mjs`), VS Code / GitHub Copilot (`.github.ps1`). | 1,248               | n/a     |
| `b11_partner-collaboration`   | `partnerska-spoluprace`   | Partner-style dialogue: one question at a time, working interpretation, recommendation with reasons, separation of facts, recommendations and assumptions.              |   275               | 1.4.0   |
| `b12_application-development` | `application-development` | Spec-driven software workflow joining Chat, Git, Codex and user acceptance testing.                                                                                     |   490 + 9/2 scripts | 1.13.0  |
| `b13_ai-meta-handoff`         | `ai-meta-handoff`         | Two-layer HUMAN + META handoff between AI agents, with a structural validator.                                                                                          |   204 + 6/2 scripts | 0.7.0   |
| `b14_master-deployment`       | `master-deployment`       | Master → Deployment product model: versioning, licensing, ownership, data separation.                                                                                   |   235               | 1.4.0   |
| `b15_skill-creator`           | `skill-creator`           | Guide and scripts for creating and packaging skills (Apache 2.0).                                                                                                       |   349 + 3 scripts   | n/a     |
| `b16_prompt-evaluation`       | `prompt-evaluation`       | Scores a prompt 0 to 10 on five questions and offers a 1-2-3 menu (run, complete, analyze).                                                                             |   256               | 2.2.0   |
| `b17_accounting-assistants`   | `ucetni-asistent`         | Assistant for a Czech accounting office: current-law verification, primary sources, citation rules.                                                                     |   419               | 3.0.0   |

Each skill folder (except `b01`) has `SKILL.md`, `agents/openai.yaml` and `assets/icon.svg`. The `!_...` subfolders are `.gitkeep` placeholders.

## 3. How the skills relate

```text
b14 master-deployment      model for any product: master, licensed deployments, versions
  ├─ b12 application-development   uses b14 principles when it builds portable products
  │     └─ b13 ai-meta-handoff     handoff format b12 requires for formal tasks
  ├─ b11 partner-collaboration     conversation style, independent
  ├─ b16 prompt-evaluation         standalone
  ├─ b17 accounting-assistants     standalone, domain skill
  └─ b15 skill-creator             tool for authoring any of the above
b01 save-session                   tool for documenting sessions (also installed under .agents/ and .kiro/)
```

`b12` and `b13` are tightly coupled: `b12` pins specific `b13` versions (v0.4 for new formal tasks, v0.7.0 for the lighter HUMAN + META format) and names its reference files. All the referenced files exist, including `b13/references/precision-without-bureaucracy.md`, `b12/scripts/recovery_checkpoint.py` and the nine `b12/references/*.md` files.

## 4. Per-skill notes

### b12 application-development (largest, most complex)
- Core idea: Git is durable state, Codex sessions are replaceable workers, existing code is evidence of the implementation and never of intended behavior.
- Classifies every change as `BUG_AGAINST_SPEC`, `APPROVED_SPEC_CHANGE`, `REQUIREMENT_NOT_FOUND` or `IMPLEMENTATION_ONLY`.
- Adds layers over time (sections 12 to 19): semantic gate, risk tiers, rapid pilot modes, foundation gate, interruption-safe execution, `RAPID_FUNCTIONAL`, and finally HUMAN + META "without bureaucracy". Later sections override earlier unconditional wording, so the file has to be read through to the end. The 490-line `SKILL.md` is long for a model to load each time.
- `scripts/recovery_checkpoint.py` saves Git state under `.git/application-development/`. The skill says clearly that the script is not an installed watchdog.
- Contains the project name `MEMALA` in `SKILL.md` (sections 12 and 18) and in four reference files, although its own self-check section says not to add customer-specific data to the master.

### b13 ai-meta-handoff
- Defines HUMAN layer (authoritative) and META layer (machine-readable refinement), with an independent META-only reconstruction step.
- `scripts/validate_handoff.py` checks structure only. The skill states that a structural pass is not semantic approval.
- `references/protocol.md` (310 lines) and `examples.md` (197 lines) are the detail.

### b14 master-deployment
- Clear and short. Defines master, deployment, customer configuration, instance, back-generalization. Rules cover SemVer, source of truth, data protection, UI vs internal codes, one main action per user goal.

### b11 partner-collaboration
- Strongly conversational (one question per step, then recommendation). Section 1.4.0 adds a "results mode" for continuing projects that takes precedence over the question-first dialogue.

### b16 prompt-evaluation
- Already an English translation by a third party, with a notice that it has not been verified by the author. The notice refers to the original as `SKILL.r20261118.md`; the file is actually named `SKILL_u61118.md`.

### b17 accounting-assistants
- Czech accounting, tax, payroll and labor law. Requires verification against primary sources (e-Sbírka, Finanční správa, ČSSZ and others) for any time-dependent claim. It cannot do that without web or tool access. Without it, the skill's own rule requires saying so.
- The yaml `short_description` and `SKILL.md` still target Czech users; only the instruction language changed.

### b15 skill-creator
- Third-party content under Apache 2.0 (`LICENSE.txt`). Provides `init_skill.py`, `package_skill.py`, `quick_validate.py`, which were used for the validation in this review.

### b01 save-session
- `save-session.kiro.mjs` is identical to `.kiro/skills/save-session/scripts/save-session.mjs`.
- `save-session-agy.mjs` differs from `.agents/skills/save-session/scripts/save-session.mjs`. The `.agents` copy adds session-date helpers and a `jp61001-01_Transcript-Rules.md` reference, so it is the newer one.
- `save-session.github.ps1` defaults to `docs/a28_teams-mgt/a12_Notes` as output, a path that does not exist in this repo, and looks for transcripts in VS Code's `workspaceStorage` on Windows.

## 5. Issues and risks

1. **Translation changed trigger wording.** Skill names (`partnerska-spoluprace`, `ucetni-asistent`) stayed in Czech, but descriptions are now English. Czech-language users who relied on Czech trigger phrases may see different skill selection. Test with real prompts before relying on it.
2. **Czech wording kept in `agents/openai.yaml`** for `b16` is intentional but mixes languages in a field the UI displays.
3. **`b16` points to a file name that does not exist** (`SKILL.r20261118.md`). Fix the notice or rename the original.
4. **`b01` copies are drifting.** Three locations, three variants, no single source. Decide which is the master and copy from it.
5. **`b17` and `b14` have no tests or example prompts.** `b12` and `b13` have scripts with tests; the other skills are instructions only, so changes cannot be checked automatically.
6. **Length.** `b12` (490 lines) and `b17` (419) are long, and `b12` loads nine references on top. Check whether sections 12 to 19 of `b12` can be consolidated, as later sections already supersede earlier ones.
7. **Author-specific content in masters** (`MEMALA`, Ladislav Goc's name, license text) is by design for `b11`, `b14`, `b16` and `b17` but conflicts with `b12`'s own "no customer data in the master" rule for `MEMALA`.
8. **Backups.** `+skills_backup_u261119/` (repo root) holds the pre-translation Czech originals of 14 files. It is untracked and not in `.gitignore`.
9. **`b00_install-scripts` is empty.** There is no installer; the skills reach agents only by manual copying (as with `.kiro/` and `.agents/`).

## 6. Suggested next steps

1. Fix the `SKILL.r20261118.md` reference in `b16`.
2. Choose one master copy for each `save-session` variant and sync the `.agents` and `.kiro` installs from it.
3. Add a few example prompts per skill (`b14`, `b16`, `b17` first) to check triggers after the translation.
4. Decide whether to keep `+skills_backup_u261119/` (commit or move out of the repo) before the next commit.
5. Write `b00_install-scripts` or document the manual install steps for Kiro, Antigravity and Codex.
