# v1.11.0 deployment and acknowledgement test

The master ZIP alone does not update a native Codex skill or an existing repository mirror. Treat installation as a separate operation with approval and a recorded revision.

1. Retain the former 1.10.1 master and pin current in-flight tasks; do not silently repin their formal handoffs.
2. Install/update the author-development Skill using the platform's supported installation workflow. Confirm that a fresh ChatGPT invocation reads version `1.11.0` from `SKILL.md`, not merely the ZIP filename.
3. Update Codex's `ai/skills/application-development` mirror as a **separate governance commit** only when authorized; keep its bundled references/scripts, provenance, checksum and version. Do not overwrite unrelated files or assume the assistant's personal Skill library automatically reaches Codex.
4. Add explicit discoverability in `AGENTS.md`: read the exact mirrored SKILL and `references/outcome-and-recoverability.md`, report version and SHA256 before work. Codex must show the real files/paths and hash, not simply say 'recognized'.
5. Execute `python3 ai/skills/application-development/scripts/test_recovery_checkpoint.py` in the Codex environment. A script copied into another location must pass equivalent tests.
6. Configure and test an owner-approved external periodic checkpoint scheduler on the Mac **separately**. Do not assume Codex Desktop exposes quota telemetry, on-call hooks, or a programmable watchdog. Until this is actually running, status must be `MANUAL_ONLY` or `NOT_INSTALLED`.
7. Simulate terminating Codex with no final message, leave both tracked/untracked work, and use a second session/account to inspect the file, verify Git/spec and continue without resetting work. Assert no waiting for old quota or destructive replay.
8. Run the contradictory-cleanup/admission test and ensure a scoped safe alternative is used *only if previously approved*; otherwise outcome is `BLOCKED`, not fake completion.
9. Only after tests pass mark the author deployment `VERIFIED`; otherwise publish precise `BLOCKED` findings. Installation and application source changes must remain separate from business code.

Acceptance evidence: installed Skill version/hash, Codex mirror version/hash, independent scheduling status, interrupted-session takeover transcript, and a concise report of PASS/BLOCKED. A semantic-gate PASS on unrelated code does not prove this rollout.
