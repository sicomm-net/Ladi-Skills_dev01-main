---
name: save-session
description: >-
  Export and save the current Kiro CLI conversation session as a formatted,
  collapsible Markdown transcript with interactive <details><summary> turn blocks.
  Use whenever the user asks to "save this session", "save session as <filename>",
  or "export session".
---

# Save Session Skill (`save-session`)

The `save-session` skill exports the current Kiro CLI conversation session into a
formatted, human-readable Markdown transcript with collapsible turn-by-turn blocks.

---

## When to Use

Activate this skill whenever the user asks to:
- "save this session"
- "save session as `<filename>`"
- "export session"
- "create a verbatim collapsible transcript"
- "record the conversation turns"

---

## Architecture & Script Execution

The skill is powered by a pure Node.js ESM script with zero third-party dependencies:
`node .kiro/skills/save-session/scripts/save-session.mjs <output_path> [options]`

### CLI Arguments & Options

| Argument / Flag | Description |
| :--- | :--- |
| `<output_path>` | **Required** (unless `--dry-run`). Target output path or bare filename (e.g., `jp07-01_Session_v61001-01.md`). |
| `-n`, `--dry-run` | Preview discovered session ID, turn counts, and turn titles without writing to disk. |
| `-c`, `--session <id>` | Explicit Kiro session UUID. Reads `~/.kiro/sessions/cli/<id>.jsonl`. |
| `-t`, `--transcript <path>` | Explicit path to a Kiro `cli/*.jsonl` session file. |
| `--title <title>` | Explicit session title override for the header. |
| `-mh`, `--model-header` | Derive turn titles from the model's topic header, falling back to the user prompt. **(default)** |
| `-uh`, `--user-header` | Derive turn titles from the user prompt, falling back to the model's topic header. |
| `-w`, `--workspace <path>` | Workspace root path (defaults to current working directory). |
| `-h`, `--help` | Show command usage and options. |

---

## Session Source

Kiro CLI writes conversation sessions as JSONL files to:
`~/.kiro/sessions/cli/<session-uuid>.jsonl` (honoring `KIRO_HOME` when set).

Each line is a JSON object with a `kind`:
- `Prompt` — a user message (`data.content[]` with `kind:"text"`).
- `AssistantMessage` — a Kiro reply (`data.content[]` mixing `thinking`, `text`, `toolUse`).
- `ToolResults` — tool output.

The parser renders **only** user prompt text and assistant `text` content. `thinking`,
`toolUse`, and `ToolResults` are excluded from the transcript. When no `--session` or
`--transcript` is given, the script selects the most recently modified non-empty session
file that contains a user `Prompt`.

> Scope note: this skill targets the `~/.kiro/sessions/cli/*.jsonl` format only. The newer
> per-workspace `messages.jsonl` layout is not parsed.

---

## Automatic Path Resolution

The script resolves the output target:

1. **Explicit Paths**: A relative/absolute path containing folder separators is written directly.
2. **Bare Filenames**: A bare filename (e.g., `jp07-01_Session_v61001-01.md`) routes into the
   repository's `+docs/` tree:
   - Scans `+docs/` for session directories (`*Sessions*`/`*sessions*`).
   - If the filename contains an app code (e.g., `07` in `jp07-...`), routes to the matching
     `+docs/a07_.../a07_Sessions/` directory.
   - Otherwise falls back to the first discovered session folder, or `+docs/<filename>`.
   - Parent directories are created automatically.

---

## Standard Transcript Formatting

The generated Markdown follows a consistent layout:

1. **Embedded CSS** — headings, blue accents, code-block backgrounds (`#ece7e7`), styled `<details>`/`<summary>`.
2. **Header Metadata** — Title, File, Date range, Speakers (`User and Kiro`), Workspace, Primary Components, Status.
3. **Collapsible Turn Widgets**:
   ```html
   <details>
   <summary>Turn [N]: [Intelligent Title]</summary>

   ### User

   [User prompt text]

   ### Kiro

   [Model response markdown]

   </details>
   ```
   > Blank lines separate `<summary>` from content and content from `</details>` for correct GFM rendering.
4. **Intelligent Turn Titles** — synthesized from either a prominent model topic header or a
   cleaned first line of the user prompt (polite prefixes stripped, capitalized, truncated if
   long). The source is selectable: `-mh`/`--model-header` (default) prefers the model header
   and falls back to the user prompt; `-uh`/`--user-header` prefers the user prompt and falls
   back to the model header.

---

## Agent Execution Instructions

When a user requests to save or export the session:

1. **Determine Destination**:
   - If the user gave a filename or path, use that argument.
   - If the user simply said "save this session", choose a filename following repository naming
     conventions (e.g., `jp07-01_Session_<Topic>_v<Version>.md`).

2. **Execute Script**:
   ```bash
   node .kiro/skills/save-session/scripts/save-session.mjs "<output_path>"
   ```
   Use `--dry-run` first to preview discovered turns without writing.

3. **Audit & Verification**:
   - Check the reported turn count and byte size.
   - Verify the file exists and is cleanly formatted.

4. **Report Outcome**:
   - Report the saved file path as a clickable Markdown link (`file:///...`).
   - State the total number of turns saved and primary session topics.
