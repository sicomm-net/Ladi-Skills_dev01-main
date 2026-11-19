# Session Transcript Rules (`jp61001-01_Transcript-Rules.md`)

This document defines the rules, naming conventions, template standards, and header formatting for conversation session transcripts saved in this repository.

---

## 1. File Naming Conventions

### 1.1 Filename Format
When saving a session, the file name must follow this structure:
```text
a##-##_{AppName}_by{Model}_u1.10.YMMDD.01.md
```

### 1.2 Variable Definitions
| Variable | Description | Example |
| :--- | :--- | :--- |
| `a##-##` | App code and document identifier prefix from prompt or active app | `a11-01` |
| `{AppName}` | App name or session topic name | `Video-Manager` |
| `{Model}` | The AI model / assistant name | `Antigravity` |
| `YMMDD` | Date with single-digit year (last digit of year), 2-digit month, 2-digit day | `61031` (for `2026-10-31`) |
| `u1.10` | Session format version indicator | `u1.10` |
| `.01` | Daily sequence counter (increments if multiple sessions saved on same date) | `.01`, `.02` |

**Example full filename:**
`a11-01_Video-Manager_byAntigravity_u1.10.61031.01.md`

---

## 2. Directory & Path Routing Rules

### 2.1 Always Use `+docs`
Transcripts must always be saved inside the repository's `+docs` directory tree (never strip the leading `+`).

### 2.2 Target Session Folder
Session files are stored in the matching app's sessions subfolder:
```text
+docs/a##_{AppName}/a##_Sessions/
```
Example:
`+docs/a11_Video-Manager/a11_Sessions/a11-01_Video-Manager_byAntigravity_u1.10.61031.01.md`

---

## 3. Template & Header Structure

Transcripts are generated using the template standard from `+docs/a##_MT-App-Docs/a11_Sessions/a00-01_AI_Session_byModel_v1.10.template.01.md` (or the corresponding app session template):

### 3.1 CSS Styles & Separator
Every transcript begins with the standard embedded CSS style block:
```html
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
```

### 3.2 Header Information
Directly below the style block, write the following header lines:

1. **Heading 1**:
   ```html
   <h1>.(YMMDD-01_{AppName} Session</h1>
   ```
   - `YMMDD`: Today's date with only the last digit of the year (e.g. `61031`).
   - `{AppName}`: The application or topic name from the prompt (e.g. `Video-Manager`).

2. **Metadata Subtitle**:
   ```html
   <div style="padding-left:20px;">By {Model}, Mth DD, YYY6, Version 1.10<br>
   ```
   - `{Model}`: Model name (e.g., `Antigravity`).
   - `Mth DD, YYY6`: Today's date (e.g., `Oct 31, 2026`).
   - *(Note: The line containing `From: <a href="https://gemini.google.com/app/abc...">...</a>` is omitted).*

3. **Heading 2**:
   ```html
   <h2>App: {Project}_{Stage}-{Owner} - a##-##_{AppName}</h2>
   ```
   - `{Project}_{Stage}-{Owner}`: Obtained directly from the workspace's `.code-workspace` filename (e.g., `STTiT_dev01-robin.code-workspace` yields `STTiT_dev01-robin`).
   - `a##-##_{AppName}`: Specified from prompt (e.g. `a11-01_Video-Manager`).

4. **Section Divider**:
   ```markdown
   ---
   ```

---

## 4. Conversation Turns Structure

All conversation turns are appended directly after the `---` horizontal rule using collapsible `<details>` and `<summary>` blocks:

```html
<details>
<summary>Turn [N]: [Intelligent Title]</summary>

### User

[User prompt text]

### Antigravity (Agemi)

[Model response markdown]

</details>
```

> [!IMPORTANT]
> **GFM Spacing Requirement:** Blank lines must separate `<summary>` from the content and the content from `</details>` to guarantee proper GitHub Flavored Markdown (GFM) rendering.

### 4.1 Turn Title Derivation
Turn titles in `<summary>` are automatically synthesized from:
- Audit report headers (e.g., `Audit Report: rename.sh` -> `Development of rename.sh`)
- Prominent model topic headers (e.g., `Stdio vs. HTTP Comparison`)
- Cleaned user prompt inquiry lines (stripping polite prefixes, capitalized, truncated if long)

### 4.2 Disclosure Tag Sanitization (Backticks Requirement)
Any occurrences of `<details><summary>`, `<details>`, `</details>`, `<summary>`, or `</summary>` within conversation prompt/response body text or turn titles must be wrapped in backticks (e.g., `` `<details><summary>` ``, `` `<details>` ``).
- **Reason**: Unquoted disclosure tags in markdown text are rendered by markdown/HTML parsers as active HTML elements, spawning an unwanted child disclosure widget and leaving the parent turn widget without a matching close tag.

---

## 5. Post-Save Outcome Display

Upon saving the session transcript, report the completion status using this exact layout:

```text
Session saved successfully to:
[<relative_path>](file:///<absolute_path>)

• Total Turns: <count>
• Format: Structured <details><summary> blocks matching the [jp61001-01_Transcript-Rules.md](file:///E:/Repos/Robin/Video/STTiT_/dev01-robin/.agents/skills/save-session/scripts/jp61001-01_Transcript-Rules.md) transcript standard.
```
