# Mods for using the +skills with kiro-cli in VS Code

Date: 2026-11-19. Nothing in the repo was changed for this document; every item below is a change for you to make.

## 1. Summary

Kiro will not find the skills where they are. It only looks in `.kiro/skills/<name>/` (this repo) and `~/.kiro/skills/<name>/` (your user folder), and the folder name must equal the `name:` in `SKILL.md`. Your folders are `+skills/b12_application-development` and so on, so they need to be copied into `.kiro/skills/` under their skill names. Beyond that, you need a root `AGENTS.md` (the current one is at `.agents/rules/AGENTS.md` and is written for another agent), a steering file, and the project structure that `b12_application-development` expects.

Sources: [Kiro skills](https://kiro.dev/docs/skills.md), [steering](https://kiro.dev/docs/steering.md), [agent configuration reference](https://kiro.dev/docs/custom-agents/configuration-reference.md).

State checked on this machine:

| Item | Value |
|---|---|
| `kiro-cli` | 2.37.1 at `~/.local/bin/kiro-cli` |
| `code` | `/usr/local/bin/code` |
| `jq`, `node`, `python3` | present |
| `~/.kiro/skills`, `~/.kiro/agents` | empty or absent |
| `.kiro/skills/` in repo | only `save-session` |
| `.kiro/steering/`, root `AGENTS.md`, `spec/` | do not exist |

I did not run an interactive `kiro-cli chat` session, so skill loading in section 3 is untested. The agent file in section 5 passes `kiro-cli agent validate` on 2.37.1.

## 2. Required: install the skills where Kiro looks

Kiro's docs do not mention symlinks or extra skill folders, so copy the files. `+skills` stays the master; `.kiro/skills` becomes a generated copy.

| Master folder | Name Kiro sees (folder and `name:`) |
|---|---|
| `+skills/b11_partner-collaboration` | `partnerska-spoluprace` |
| `+skills/b12_application-development` | `application-development` |
| `+skills/b13_ai-meta-handoff` | `ai-meta-handoff` |
| `+skills/b14_master-deployment` | `master-deployment` |
| `+skills/b15_skill-creator` | `skill-creator` |
| `+skills/b16_prompt-evaluation` | `prompt-evaluation` |
| `+skills/b17_accounting-assistants` | `ucetni-asistent` |
| `+skills/b01_save-session` | already installed as `.kiro/skills/save-session` |

Why the copy is needed:
- `name` must match the folder name, using lowercase letters, digits and hyphens. The `bNN_` prefix has underscores, so the master folders cannot be used directly.
- `b15`'s `quick_validate.py` accepts the skills as they are. It does not check the folder-name rule, so passing it proves nothing here.
- All descriptions are under the 1,024-character limit (longest: 698).

Save this as `+skills/b00_install-scripts/install-kiro-skills.sh` (that folder is empty today). I ran it against a temp folder and it produced the seven folders above:

```bash
#!/bin/bash
# Copy each skill in +skills/ to <dest>/<name>/ where <name> is the `name:` in SKILL.md.
set -euo pipefail
root="$(git rev-parse --show-toplevel)"
dest="${1:-$root/.kiro/skills}"
for d in "$root"/+skills/b[1-9]*/; do
  [ -f "$d/SKILL.md" ] || continue
  name="$(awk '/^---/{n++; next} n==1 && /^name:/{print $2; exit}' "$d/SKILL.md")"
  [ -n "$name" ] || { echo "no name in $d" >&2; continue; }
  mkdir -p "$dest/$name"
  rsync -a --delete --exclude '.gitkeep' --exclude '!_*' --exclude 'SKILL_*' --exclude '__pycache__' "$d" "$dest/$name/"
  echo "synced $(basename "$d") -> $name"
done
```

Run it from the repo root with `bash +skills/b00_install-scripts/install-kiro-skills.sh`, and again whenever a master changes. Never edit the copies in `.kiro/skills/`. `--delete` removes anything in a copy that is not in its master. The `SKILL_*` exclude keeps the Czech original `SKILL_u61118.md` out of the `prompt-evaluation` copy.

To make the skills available in every project instead, pass `~/.kiro/skills` as the first argument. A workspace skill overrides a global one of the same name.

Files Kiro ignores (harmless): `agents/openai.yaml` and `assets/icon.svg`. Kiro's docs do not mention them.

## 3. Check the skills load

1. Open the repo in VS Code, open the integrated terminal at the repo root, and run `kiro-cli chat`. Kiro finds `.kiro/` from the directory where you start it.
2. Ask: "Which skills are loaded?", or run `/context show`.
3. Try one skill by name, for example `/prompt-evaluation` followed by a short prompt.

Skills are picked up when a chat session starts, so restart the chat after each sync.

Two things to watch:
- Skills activate automatically from their descriptions. `partnerska-spoluprace` and `prompt-evaluation` have broad descriptions and may trigger when you do not want them. If that happens, shorten the description in the master, or use the custom agent in section 5 and leave those two out.
- `ucetni-asistent` needs to check current Czech law online. Give your agent the `web` tool (section 5). Without it, the skill's own rules require saying it could not verify.

## 4. Required: rules and project structure

### 4.1 Root `AGENTS.md`

Kiro always loads `AGENTS.md` from the workspace root. The existing file is `.agents/rules/AGENTS.md`, written for a different agent. It does not fit Kiro:
- It tells the agent to use an `invoke_subagent` tool and to delegate everything. Kiro's tool is named `subagent`.
- `Conversation-Rules.md` says the supervisor must never run commands or read files in the main thread. That blocks Kiro from doing normal work.
- It points to `docs/a00_AI-App-Specs/New-App-Guidelines.md`. The real files are `+docs/a00_AI-App-Specs/a00-01_New-App-Guidelines.md` and `a00-02_Technical-Specs.md`.

Create a new `AGENTS.md` at the repo root and leave the `.agents` files for the other agent. It should hold:

1. **Spec sources:** `spec/README.md` is the authority (section 4.3). `+docs/a00_AI-App-Specs/` is developer context.
2. **Repository rules** carried over from `.agents/rules/Repository-Rules.md`: commit format `.(<version>_<message>` using `bash .agents/scripts/get-version.sh next git`, never edit `*_v[0-9]*` files, secrets only in `.env`, `_config.js` with `DATA_MODE = 'Mock' | 'Live'`.
3. **Terms, because the skills were written for ChatGPT and Codex:** "Codex" and "executor" mean the Kiro agent. "Chat" means the same Kiro session. Skill scripts are at `.kiro/skills/<name>/scripts/`. The skills say `ai/skills/...`; ignore that mirror, because Kiro loads the skills natively (`b12` section 3a says to prefer the native source).
4. **Opt-in to the light profile.** `b12`'s `RAPID_FUNCTIONAL` profile only applies when the project owner opts in explicitly in the Git governance files. Without it, `b12` requires a separate worker to reconstruct each task from the META text alone, plus validator runs, and a single Kiro session cannot do that independently. If you want the light profile, write in `AGENTS.md`: development runtime only, test data is disposable, profile `RAPID_FUNCTIONAL` approved. Keep protected data, authentication and production out of scope, as `b12` requires.

### 4.2 Steering files (optional but cheap)

Create `.kiro/steering/`. Steering files load according to `inclusion:` frontmatter (`always` is the default).

- `repo-rules.md` with `inclusion: always` if you prefer rules there rather than in `AGENTS.md`.
- `conversation-rules.md` with `inclusion: manual`. The "one step at a time" style suits `b11` but slows app building, so load it only when you type `#conversation-rules`.

### 4.3 Structure that `b12` expects

For app work, `b12` expects these at the repo root. None exist yet:

```text
AGENTS.md
spec/
  README.md        which files are authoritative, precedence, how changes are approved
  current/         the approved functional spec for the app
dev/
  CODEX_HANDOFF.md current status for continuing in a new session (only for long work)
```

Create `spec/README.md` first, then `spec/current/` with a spec for the app you want. The existing `+docs/a00_AI-App-Specs/*.md` are rules and a sample, not a spec of your app.

## 5. Optional: custom agent

Kiro's default agent already loads workspace skills and steering, so this step is not required. Use a custom agent only if you want to control tools or leave skills out. Custom agents do not auto-load skills or steering; they must be listed in `resources`.

`.kiro/agents/ladi.json` (passes `kiro-cli agent validate --path` on 2.37.1):

```json
{
  "name": "ladi",
  "description": "Ladi-Skills project agent",
  "tools": ["read", "write", "shell", "web", "@builtin"],
  "resources": [
    "file://AGENTS.md",
    "file://.kiro/steering/**/*.md",
    "skill://.kiro/skills/application-development/SKILL.md",
    "skill://.kiro/skills/ai-meta-handoff/SKILL.md",
    "skill://.kiro/skills/master-deployment/SKILL.md",
    "skill://.kiro/skills/skill-creator/SKILL.md"
  ],
  "includeMcpJson": true,
  "allowedTools": ["read"]
}
```

Start it with `kiro-cli chat --agent ladi`, or make it the default with `kiro-cli agent set-default ladi`.

Version note: the docs describe a newer CLI V3 where `allowedTools` is replaced by `permissions.rules`. This machine has 2.37.1. If you upgrade, run `/upgrade-agent` (or `kiro-cli agent upgrade <dir>`). It backs up the old file as `.json.bak`, which `.gitignore` already ignores.

With `"allowedTools": ["read"]` Kiro asks before every write or shell command. Widen it only after you have watched a few sessions. The docs warn that skills run with the same permissions as the agent, and a write-enabled agent can edit anything under `~/.kiro`.

## 6. VS Code

Nothing is required in VS Code itself. You only need the integrated terminal and `kiro-cli` on the path (it is). Notes:

- `.vscode/settings.json` already excludes `node_modules` and `.git` from the file watcher. No change needed.
- `.vscode/launch.json` has a Node launch and a `bashdb` entry. Both are unrelated to Kiro and can stay.
- `.vscode/mcp.json` and `.kiro/settings/mcp.json` are empty (`{"mcpServers": { }}`). The skills need no MCP server. Do not copy `.agents/mcp_config.json` (`freecad-mcp`) across; nothing here uses it.
- Run `bash run-app.sh` from the integrated terminal. It needs `jq` (present). Be aware it kills any process on the target port.

## 7. Fix before the first app build

These are in `a00_app-initial-overview.md`. They will stop a Kiro-built app from running:

1. Five invalid `package.json` files (missing colon after `"type"`), so `npm install` fails.
2. MySQL credentials committed in two config files. Rotate the password. Kiro can read these files, so they would also go into model context.
3. `server/package.json` and `client/package.json` point to scripts that do not exist.

## 8. Order of work

1. Run the sync script (section 2). Commit `.kiro/skills/`.
2. Write root `AGENTS.md` and, if wanted, the steering files (section 4).
3. Create `spec/README.md` and `spec/current/` (section 4.3).
4. Run `kiro-cli chat` in the VS Code terminal and check the skills load (section 3).
5. Fix the items in section 7.
6. Optionally add the custom agent (section 5).
