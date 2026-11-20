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

# Ladi-Skills_dev01-main: Initial Overview
<div style="padding-left:20px;">Date: 2026-11-19, Version: 1.10</div>

Reviewed at commit `e429344` plus uncommitted translation edits.
Scope: the whole repository except `+skills`, which is covered in `b00_skills-initial-overview.md` (in this folder).

## 1. What this repo is

A "formR" starter project (`README.md`: "8020's Ladi-Skills", by Robin Mattern, remote `sicomm-net/Ladi-Skills_dev01-main`). It has two purposes:

1. A library of AI "skills" (instruction packages) in `+skills`, with the documentation that goes with them in `+docs`.
2. A client/server app scaffold (Express servers plus static client apps) meant to host pages for those skills.

At this commit the skills and docs are real and substantial. The app scaffold is mostly empty stubs. Nothing has been installed or run (no `node_modules` anywhere), and this review did not start any app.

Git history is six commits (`61118.01` to `v1.01`). The last one translated Czech to English in `+docs` and `+skills`.

## 2. Folder map

| Path | Role | State |
|---|---|---|
| `+docs/` | Documentation | Active, see section 3 |
| `+skills/` | Skill masters | Active, see `b00_skills-initial-overview.md` |
| `client/` | Client apps `c00`, `c01` (port group 0) | `c00` works as code; `c01` is a stub |
| `client1/` | Client app `c10_ladis-skills-app` | Stub |
| `server/` | Server apps `s00`, `s01` | `s00` works as code; `s01` is a stub |
| `server1/` | Server app `s10_ladis-skills-api`, shared `app_modules/` | Stub plus two utility modules |
| `run-app.sh` | Launcher for client/server apps | Working script, see section 5 |
| `Ladi-29310.yaml` | PM2 config for a `live-server` on port 46311 | Points to a path from another machine |
| `.agents/` | Rules, scripts and a `save-session` skill for the Antigravity-style agent | Active |
| `.kiro/` | Kiro copy of `save-session`, empty `mcp.json` | Active |
| `!__601-29-0001_...` | Placeholder folder (only `.gitkeep`) | Empty |
| `.gitattributes`, `.gitignore` | LF line endings; ignores `.env`, `node_modules`, `*.bak`, `*_v[0-9]*`, `*_t[0-9]*`, media, zips | |

Naming convention: folders and files carry a prefix with the type and number (`c00_`, `s10_`, `b12_`, `a00-01_`). Date-stamped versions use `u<YMMDD>` (editable) and `v<n>` (archived, immutable, and git-ignored).

## 3. Documentation (`+docs`)

| Folder | Content |
|---|---|
| `README.md` | Another formR template README (project "SCN3-Apps", folder table describes `docs/`, `data/`, `sources/`, which do not exist here). Stale. |
| `a00_AI-App-Specs/` | Three working documents: `a00-01_New-App-Guidelines.md` (rules for the AI coding assistant), `a00-02_Technical-Specs.md` (sample client/server spec, ports 3200/3250), `a00-03_Development-Methodology.md` (plan for live team web apps on an always-on Mac mini behind Tailscale, with `dev` and `main` branches, pm2, GitHub PRs). |
| `a##_MT-App-Docs/` | Empty templates (Plan, Notes, Session log) with `{AppName}` placeholders, plus a `STOC.html` viewer. |
| `a01_Home-Page/` | Empty (`.gitkeep` only) plus `STOC.html`. |
| `b10_Ladi's Skills/` | Skill-related docs: two saved AI chat sessions (`b10_Sessions`), an empty plan and notes template, and three files in `b10_Misc` (a PDF "How to Use Existing Skills", an LG AI Engineering article as `.docx`, a notes template). |
| `STOC.html` (x3) | A single-file "Documentation Viewer & TOC" page (marked + DOMPurify from CDNs). Not checked in a browser. |

The `b10_Sessions` files record a Gmail-reading test with Grok and Gemini sessions. The Grok session ends with a prompt rating.

## 4. Apps

### 4.1 Port and naming scheme

`run-app.sh` builds ports from project number, stage, client or server number, and app number (`a01` starts server `s01` and client `c01`). `client`/`server` is group 0, `client1`/`server1` is group 1. `Help` in the script shows example ports `61351` (server) and `61301` (client).

### 4.2 What each app contains

| App | Files | Notes |
|---|---|---|
| `client/c00_static-pages-app` | `c00_server.mjs`, `.cjs` wrapper, `routes.json`, `index.html` | Express static-file router driven by `routes.json`. Default port 19100. |
| `server/s00_dynamic-pages-api` | Byte-identical copies of the `c00` files | Duplicate of `c00` with different names; both are 2,266-byte servers. |
| `client/c01_home-page-app`, `server/s01_home-page-api` | `package.json`, `config`, README | `c01_index.html` and `s01_server.mjs` are 0 bytes. |
| `client1/c10_ladis-skills-app`, `server1/s10_ladis-skills-api` | Same pattern | `c10_index.html`, `s10_server.mjs`, `s10_config.js` are 0 bytes. `c10_client.mjs` is leftover Pinecone/LangChain sample code that imports three files that do not exist. |
| `server1/app_modules` | `utilities.mjs` (285 lines), `a27_logpath.mjs` (378 lines) | Shared helpers, not read in detail. |

`routes.json` maps `/home`, `/home1`, `/aeo-slides1`, `/aeo-survey` to folders. Three of those folders (`client1/c10_home-page`, `client2/c27_aeo-generator-app`, `client1/c11_aeo-survey-app`) do not exist in this repo, so only `/home` can resolve.

## 5. `run-app.sh`

A ~300-line Bash launcher. It reads `PROJECT_NO`, `PROJECT_STAGE`, `DATA_FOLDER` from config, picks ports, runs `npm install` when `node_modules` is missing and the `package.json` has dependencies, installs `nodemon` and `live-server` globally if absent, and starts the server first, then the client.

Things to know before using it:
- It **kills whatever process is listening on the target port** (`kill -9`, `taskkill`), without asking.
- `checkFW` calls `sudo ufw allow` (Linux only).
- It installs global npm packages silently.
- It needs `jq`.
- It is hard-coded for `nPrj=29` and a development stage.

<div class="page-break"><hr style="border-inline-style: dashed;"></div>

## 6. AI-agent configuration

- `.agents/rules/AGENTS.md`: supervisor/orchestrator protocol that delegates all work to sub-agents and requires an audit of each change.
- `.agents/rules/Conversation-Rules.md`: concise answers, one step at a time, quiet mode by default when dispatching sub-agents.
- `.agents/rules/Repository-Rules.md`: commit message format `.(<version>_<message>` using `.agents/scripts/get-version.sh`; never edit `*_v[0-9]*` files; `.env` for secrets only; `[cs]##_config.js` with `DATA_MODE = 'Mock' | 'Live'`.
- `.kiro/settings/mcp.json`: empty. `.kiro/skills/save-session` is the Kiro version of the save-session skill.

## 7. Issues found

Ordered by importance.

1. **Credentials committed.** `client/c01_home-page-app/_config.js` and `client1/c10_ladis-skills-app/c10_config.js` contain MySQL host `45.32.219.12`, user `nimdas`, and the password `FormR!1234` (also used for a local `root` login). They are in git history since the initial commit. Rotate the password if that server is real, then remove the values from the files. This also violates the repo's own rule that secrets belong only in `.env`.
2. **Invalid JSON.** `client1/package.json`, `client/c01_home-page-app/c01_package.json`, `client1/c10_ladis-skills-app/c10_package.json`, `server/s01_home-page-api/s01_package.json` and `server1/s10_ladis-skills-api/s10_package.json` fail `JSON.parse` (`"type" "module"` is missing a colon, line 10). `npm install` will fail in those folders. `run-app.sh` also reads these files with `jq`, which will fail the same way.
3. **Broken `npm` metadata.** `server/package.json` points `main` and `dev` to folders that do not exist (`s01_first-api`, `s11_first-apis/0-main.mjs`). The root `client/package.json` is named `client0_apps` and says to run `npm start in c00_home-app`, which does not exist. Express versions differ between `server` (`^5.2.1`) and `server1` (`^4.21.2`).
4. **Stale rule paths.** `.agents/rules/AGENTS.md` points to `docs/a00_AI-App-Specs/New-App-Guidelines.md` and `Technical-Specs.md`. The real files are `+docs/a00_AI-App-Specs/a00-01_New-App-Guidelines.md` and `a00-02_Technical-Specs.md`.
5. **Duplicated and empty code.** `c00` and `s00` are the same code. Several "stub" apps are 0-byte files. READMEs for `c00`, `c01`, `c10`, `s00` are the same copied text and refer to `docs/setup/...`, `.env_u01` and `00_main.mjs`, none of which exist.
6. **`Ladi-29310.yaml`** hard-codes `/Users/Shared/Repos/JPSessions_/dev01-robin/...`, a different repo and machine.
7. **`.gitignore`** has no newline at the end and does not cover the `+skills_backup_u261119/` folder created during the translation work. Decide whether to commit or delete that backup before the next commit.
8. **`save-session` has three copies** (`+skills/b01_save-session`, `.agents/skills/save-session`, `.kiro/skills/save-session`). The Antigravity copy in `.agents` differs from `+skills/b01_save-session/save-session-agy.mjs`. See the skills overview.
9. **`+docs/README.md`** describes a different project's layout (`SCN3-Apps`).

## 8. Suggested next steps

1. Rotate and remove the database password (issue 1). History rewriting is a separate decision for the owner.
2. Fix the five `package.json` files (one-character fix each) and the dead `main`/`dev` entries.
3. Correct the paths in `.agents/rules/AGENTS.md` and refresh `+docs/README.md`.
4. Decide what the app scaffold is for. If the skills library is the product, remove or label the empty stubs and the `c00`/`s00` duplicate.
5. Commit or delete `+skills_backup_u261119/`.
