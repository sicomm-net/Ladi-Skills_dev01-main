

<style>
   table { border-spacing: 0px;      border: 1px solid black; }
   th { padding: 5px 6px !important; border: 1px solid black; }
   td { padding: 2px 6px !important; border: 1px solid black; }  /* top, right, bottom, left */
   li { margin:  -6px 16px 4px !important; }                     /* top, right/left, bottom */
   h1 { margin:  8px;        color: blue; font-size: 24px; }     /* -6px 6px -6px; */
   h2 { margin:  18px 0 8px; color: blue; font-size: 18px; }     /* 12px 6px -8px; */
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

# Live team web apps on always-on Mac mini - Phase 1
<div style="padding-left:20px;">Date: 2026-11-16, Version: 1.10</div>

---

## Goal
Dynamic pages (Node.js web apps) that Grok Bot agents build and maintain, and that every Grok Bot team member can open in their own browser. Only people on the tailnet can reach them, and every change is reviewed in GitHub.
- **Server:** Sue's always-on Mac mini `rm231p-os14` (100.68.77.110).
- **Source of truth:** a private GitHub repo. Every change, whoever or whatever made it, goes through a commit or a pull request.

---

## 1. Tailscale is the weak link. Design around it

Tailscale keeps the apps private and lets developers reach the Mac mini. It has been unreliable for us:
- **On my computer:**
  - After waking from sleep it has lost the coordination server three times (Oct 29 twice, Nov 16).
  - A rebuild wipes Tailscale's state.
  - Its address has had to be restored.
  - A new watchdog (Nov 16) should catch this, but isn't proven yet.
- **Device keys expire** (180 days by default) and the device silently drops off. This has happened to rm238p-w11p and jp242p-ub24.
- **Relays:** traffic sometimes goes through Tailscale relay servers (for example "nyc"), which is slower.

**How the plan handles it:**
1. **Deploys don't need Tailscale.** The Mac mini pulls from GitHub on its own every few minutes. No bot has to SSH in to ship a change.
2. **Disable key expiry** on `rm231p-os14`: in the Tailscale admin, go to Machines, open the device's "..." menu, and choose Disable key expiry.
3. **Development doesn't need Tailscale either.** Sue's shared bot works on the Mac mini through the Grok Bot app there, and Robin's Coder bot works through GitHub and cloud agents.
4. **Health check:** each app has a `/health` endpoint, and a daily, quiet-unless-down check tells us if it's unreachable.
5. **Fallback Page:** a Grok Bot Page shows the last snapshot and links to the live app, so there's always something to see.

## 2. Environments

| Environment | Branch | Where | Port | Who uses it |
|---|---|---|---|---|
| Development | feature branches | Sue's Mac mini (Sue's bot) or Robin's PC rm238p-w11p | any | The developer |
| Pre-release (staging) | `dev` | Mac mini, folder `~/apps/<app>-dev` | 31x1 | Sue and Robin testing |
| Production | `main` | Mac mini, folder `~/apps/<app>` | 31x0 | All team members |   
<p>&nbsp;</p>    
Each Mac mini folder auto-pulls its own branch and restarts with `pm2` when it changes. "Updating production" just means merging `dev` into `main`.

## 3. Workflow

1. **Sue's shared bot** builds a change on a feature branch, in the app's dev folder on the Mac mini.
   - Sue gives it an Auto-review rule that allows any change inside that app's folder, while everything else still asks for approval.
2. **Sue tests it** locally, then approves a pull request into `dev`. Pre-release updates automatically.
3. **Robin tests the pre-release**, either at its Tailscale address or by pulling `dev` onto rm238p-w11p.
4. **Robin's changes:** the Coder bot makes them with a cloud agent on a feature branch and opens a pull request into `dev`. Robin pulls the branch to test on Windows. Sue or a third party approves the pull request.
5. **Release:** when pre-release is good, Sue (or the agreed approver) approves a pull request from `dev` into `main`. Production updates within about 5 minutes.
6. **Team members** just open the production address. No installs or pulls needed. Only developers keep copies.

**Rules:**
- `main` is protected: pull requests only, with one approval required.
- No bot pushes straight to `main`.

## 4. Monitoring

- Chats with a shared bot are private to whoever is chatting. Robin, Coder, and RamRod can't read Sue's chats with her bot.
- **GitHub is the shared record:**
  - Every change is a commit or pull request with a clear description.
  - Coder or RamRod can summarize repo activity on request, or in a weekly routine.
- Each app keeps a `CHANGELOG.md`.

## 5. Inside Grok Bot

A Grok Bot Page can't load the live app, because Pages have no network access. Each app gets a Page that shows its last snapshot and has a link to open the live app in the browser.

## 6. One-time setup

| # | Step | Who |
|---|------|-----|
| 1 | Disable key expiry on `rm231p-os14` | Robin or Sue (Tailscale admin) |
| 2 | Decide the tailnet (`jp@` holds the Mac mini) and give team members access (invite them, or share the Mac mini with them) | Robin |
| 3 | Create a private repo with `main` and `dev`, and protect `main` | Coder (cloud agent) and Robin |
| 4 | On the Mac mini, install Node and `pm2`, and add a launchd auto-pull job per environment | Sue's bot, with Sue's approval |
| 5 | Run `tailscale serve` for each port, which gives tailnet-only HTTPS addresses | Sue's bot or Sue |
| 6 | Add an Auto-review rule for Sue's bot, scoped to `~/apps/` | Sue |
| 7 | Set up a health-check routine and the snapshot-plus-link Page | Coder |

## 7. Open questions
- Who approves releases to `main`: Sue only, or Sue or a third party?
- One repo for all apps (`live-apps`, with a folder per app), or a repo per app? I'd recommend a repo per app once there's more than one.
- Port numbering convention: I've assumed 31x0 for production and 31x1 for pre-release.

## Not doing
- Nothing goes on the public internet.
- My Grok Bot computer is not used as a server.
