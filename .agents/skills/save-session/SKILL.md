---
name: save-session
description: >-
  Export and save the current conversation session as a formatted, collapsible
  Markdown transcript with interactive <details><summary> turn blocks.
  Use whenever the user asks to "save this session", "save session as <filename>",
  or "export session".
---

# Save Session Skill (`save-session`)

The `save-session` skill provides an automated, deterministic workflow for exporting the current Antigravity conversation session into a formatted, human-readable Markdown transcript document matching the [`jp61001-01_Transcript-Rules.md`](file:///E:/Repos/Robin/Video/STTiT_/dev01-robin/.agents/skills/save-session/scripts/jp61001-01_Transcript-Rules.md) standard.

---

## When to Use

Activate this skill whenever the user asks to:
- "save this session"
- "save session as `a##-##_{AppName}`" (e.g. `save this session as a11-01_Video-Manager`)
- "export session"
- "create a verbatim collapsible transcript"
- "record the conversation turns"

---

## Architecture & Script Execution

The skill is powered by a pure Node.js ESM script with zero third-party dependencies:
`node .agents/skills/save-session/scripts/save-session.mjs <output_path> [options]`

### CLI Arguments & Options

| Argument / Flag | Description |
| :--- | :--- |
| `<output_path>` | **Required** (unless `--dry-run`). Target output path, session spec (e.g. `a11-01_Video-Manager`), or bare filename (e.g., `a11-01_Video-Manager_byAntigravity_u1.10.61031.01.md`). |
| `-n`, `--dry-run` | Preview discovered conversation ID, turn counts, and turn titles without writing to disk. |
| `-c`, `--conversation <id>` | Explicit conversation ID in Antigravity brain directory (`~/.gemini/antigravity-cli/brain/`). |
| `-t`, `--transcript <path>` | Explicit path to a `transcript_full.jsonl` or `transcript.jsonl` file. |
| `--title <title>` | Explicit session title override for the header. |
| `-w`, `--workspace <path>` | Workspace root path (defaults to current working directory). |
| `-h`, `--help` | Show command usage and options. |

---

## Automatic Path & Name Resolution

> [!IMPORTANT]
> **Always use `+docs`**: The repository documentation folder is named `+docs` (with a leading `+`). Transcripts are always stored inside `+docs/a##_{AppName}/a##_Sessions/`. Never strip the leading `+` from `+docs`.

The target path and filename are resolved according to [`jp61001-01_Transcript-Rules.md`](file:///E:/Repos/Robin/Video/STTiT_/dev01-robin/.agents/skills/save-session/scripts/jp61001-01_Transcript-Rules.md):

1. **Session Naming Pattern**:
   ```text
   a##-##_{AppName}_by{Model}_u1.10.YMMDD.01.md
   ```
   Where:
   - `a##-##`: App code prefix (e.g. `a11-01`)
   - `{AppName}`: Application topic name (e.g. `Video-Manager`)
   - `{Model}`: Model name (e.g. `Antigravity`)
   - `YMMDD`: Single-digit year, 2-digit month, 2-digit day (e.g. `61031` for Oct 31, 2026)
   - `.01`: Daily sequence number, incrementing if file already exists

2. **Directory Routing**:
   - Routes automatically into `+docs/a##_{AppName}/a##_Sessions/`.

---

## Standard Transcript Formatting Rules

Transcript layout, styling, header metadata, and template structure are governed by:
[`jp61001-01_Transcript-Rules.md`](file:///E:/Repos/Robin/Video/STTiT_/dev01-robin/.agents/skills/save-session/scripts/jp61001-01_Transcript-Rules.md)

Key requirements defined in the rules include:
- Standard embedded CSS style block from session templates.
- Formatted header with `<h1>.(YMMDD-01_{AppName} Session</h1>`.
- Subtitle with `By {Model}, Mth DD, YYY6, Version 1.10<br>` (with `From:` link omitted).
- `<h2>App: {Project}_{Stage}-{Owner} - a##-##_{AppName}</h2>` matching the `.code-workspace` filename.
- Section divider `---` followed by collapsible `<details>` / `<summary>` turn blocks with strict GFM blank-line spacing.
- Automatic synthesis of turn titles from headings, audit lines, and user prompts.

---

## Agent Execution Instructions

When a user requests to save or export the session:

1. **Determine Destination & Filename**:
   - If user says "save this session as a##-##_{AppName}": construct the filename `a##-##_{AppName}_by{Model}_u1.10.YMMDD.01.md` inside `+docs/a##_{AppName}/a##_Sessions/`.
   - If user simply says "save this session": determine the active app (e.g. `a11-01_Video-Manager`) and follow the standard naming pattern.

2. **Execute Script**:
   Run the command via `run_command`:
   ```bash
   node .agents/skills/save-session/scripts/save-session.mjs "<output_path>"
   ```

3. **Audit & Verification**:
   - Check the script output for reported turn count and byte size.
   - Verify the file exists and is cleanly formatted.

4. **Report Outcome**:
   Display the outcome in this format:
   ```text
   Session saved successfully to:
   [<relative_path>](file:///<absolute_path>)

   • Total Turns: <turn_count>
   • Format: Structured <details><summary> blocks matching the [jp61001-01_Transcript-Rules.md](file:///E:/Repos/Robin/Video/STTiT_/dev01-robin/.agents/skills/save-session/scripts/jp61001-01_Transcript-Rules.md) transcript standard.
   ```
