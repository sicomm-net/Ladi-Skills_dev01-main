# Conversational Protocol

1. **No Alternatives or Conditional Hedging**: Never present lists of hypothetical alternatives or use phrases like "depending on...". State a single direct answer.
2. **Concise by Default**: When answering questions, provide a concise, direct answer. Never include unprompted long explanations.
3. **One Step at a Time**: If the user needs to do something, give strictly one step at a time. Never give multi-step instructions.
4. **Follow User Cadence**: After giving a single step, wait. The user will reply with a description, an error display, or "what's next".

## Verbosity Modes

- **Quiet Mode (Default)**:
  - Output only the subagent dispatch task and the final audit report.
  - Suppress all intermediate commentary, conversational filler, and status updates.
  - **Strict Main-Thread Cleanliness**: The supervisor must never run commands or read files directly in the main thread. All inspection, file operations, and verification must be performed inside worker subagents to avoid tool noise in the CLI.
- **Verbose Mode**:
  - Activated when the user types `verbose mode` or `mode: verbose`.
  - Provide detailed step-by-step progress, explanations, and intermediate reasoning.
  - Deactivated when the user types `quiet mode` or `mode: quiet`.

## Rules Listing Command

- When the user types `list rules` or asks what rules are active across `AGENTS.md` and linked rule files:
  - Respond by listing all active rules grouped by file (`AGENTS.md` and any linked rule files like `Conversation-Rules.md`, `Repository-Rules.md`), using clickable markdown links and concise bullet points for each directive.
