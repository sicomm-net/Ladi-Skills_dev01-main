#!/usr/bin/env node

/**
 * save-session.mjs
 *
 * Deterministic conversation session exporter for Kiro CLI.
 * Parses Kiro CLI session JSONL files (~/.kiro/sessions/cli/<uuid>.jsonl)
 * and formats an interactive, collapsible Markdown transcript document.
 *
 * Pure Node.js ESM - zero third-party dependencies.
 *
 * Kiro cli/*.jsonl format (one JSON object per line):
 *   { "version":"v1", "kind":"Prompt",           "data":{ "content":[{"kind":"text","data":"..."}], "meta":{...} } }
 *   { "version":"v1", "kind":"AssistantMessage",  "data":{ "content":[{"kind":"thinking"|"text"|"toolUse", ...}] } }
 *   { "version":"v1", "kind":"ToolResults",       "data":{ ... } }
 *
 * Only user `Prompt` text and assistant `text` content are rendered.
 * `thinking`, `toolUse`, and `ToolResults` are excluded from the transcript.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

// Parse command line arguments
function parseArgs(args) {
  const options = {
    outputPath: null,
    transcriptPath: null,
    sessionId: null,
    dryRun: false,
    title: null,
    titleSource: 'model', // 'model' (-mh, default) or 'user' (-uh)
    workspace: null,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--dry-run' || arg === '-n') {
      options.dryRun = true;
    } else if (arg === '--transcript' || arg === '-t') {
      options.transcriptPath = args[++i];
    } else if (arg === '--session' || arg === '-c') {
      options.sessionId = args[++i];
    } else if (arg === '--title') {
      options.title = args[++i];
    } else if (arg === '--model-header' || arg === '-mh') {
      options.titleSource = 'model';
    } else if (arg === '--user-header' || arg === '-uh') {
      options.titleSource = 'user';
    } else if (arg === '--workspace' || arg === '-w') {
      options.workspace = args[++i];
    } else if (!arg.startsWith('-') && !options.outputPath) {
      options.outputPath = arg;
    }
  }

  return options;
}

// Print CLI help
function printHelp() {
  console.log(`
Usage:
  node save-session.mjs [output_path] [options]

Arguments:
  output_path           Path or bare filename for the saved transcript Markdown file.
                        Bare filenames (e.g. jp07-01_Session_v61001-01.md) automatically
                        resolve to the corresponding +docs/**/Sessions directory.

Options:
  -n, --dry-run         Preview discovered session, turns, and statistics without writing.
  -c, --session ID      Specify explicit Kiro session UUID (file ~/.kiro/sessions/cli/<ID>.jsonl).
  -t, --transcript PATH Specify explicit path to a Kiro cli/*.jsonl session file.
  --title TITLE         Override session title in the Markdown header.
  -mh, --model-header   Derive turn titles from the model's topic header, falling back
                        to the user prompt. (default)
  -uh, --user-header    Derive turn titles from the user prompt, falling back to the
                        model's topic header.
  -w, --workspace PATH  Specify workspace root directory (defaults to current working directory).
  -h, --help            Show this help documentation.

Examples:
  node .kiro/skills/save-session/scripts/save-session.mjs --dry-run
  node .kiro/skills/save-session/scripts/save-session.mjs jp07-01_Session_v61001-01.md
  node .kiro/skills/save-session/scripts/save-session.mjs +docs/a07_My-MCP-Server/a07_Sessions/transcript.md
`);
}

// Resolve the Kiro CLI sessions directory (~/.kiro/sessions/cli, honoring KIRO_HOME)
function getCliSessionsDir() {
  const kiroHome = process.env.KIRO_HOME && process.env.KIRO_HOME.trim()
    ? process.env.KIRO_HOME
    : path.join(os.homedir(), '.kiro');
  return path.join(kiroHome, 'sessions', 'cli');
}

// Locate the session JSONL file
function findTranscript(sessionId, explicitTranscriptPath) {
  if (explicitTranscriptPath) {
    const resolved = path.resolve(process.cwd(), explicitTranscriptPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Specified transcript file not found: ${resolved}`);
    }
    return { transcriptPath: resolved, sessionId: sessionId || path.basename(resolved, '.jsonl') };
  }

  const cliDir = getCliSessionsDir();
  if (!fs.existsSync(cliDir)) {
    throw new Error(`Kiro CLI sessions directory not found: ${cliDir}`);
  }

  // Explicit session ID requested
  if (sessionId) {
    const target = path.join(cliDir, `${sessionId}.jsonl`);
    if (!fs.existsSync(target)) {
      throw new Error(`Session file not found for ID: ${sessionId} (${target})`);
    }
    return { transcriptPath: target, sessionId };
  }

  // Scan all cli/*.jsonl files, pick the most recently modified non-empty one
  const candidates = [];
  for (const entry of fs.readdirSync(cliDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.jsonl')) continue;
    const full = path.join(cliDir, entry.name);
    try {
      const stat = fs.statSync(full);
      if (stat.size > 0) {
        candidates.push({ id: path.basename(entry.name, '.jsonl'), transcriptPath: full, mtime: stat.mtimeMs });
      }
    } catch {}
  }

  if (candidates.length === 0) {
    throw new Error(`No non-empty session transcripts found in ${cliDir}.`);
  }

  candidates.sort((a, b) => b.mtime - a.mtime);

  // Prefer the most recent session that actually contains a user Prompt.
  for (const candidate of candidates) {
    try {
      const sample = fs.readFileSync(candidate.transcriptPath, 'utf8');
      if (sample.includes('"kind":"Prompt"')) {
        return { transcriptPath: candidate.transcriptPath, sessionId: candidate.id };
      }
    } catch {}
  }

  return { transcriptPath: candidates[0].transcriptPath, sessionId: candidates[0].id };
}

// Resolve output path (handling bare filenames and +docs/**/Sessions routing)
function resolveOutputPath(rawPath, workspaceDir) {
  if (!rawPath) return null;

  // If path contains directory separators, resolve directly against cwd
  if (rawPath.includes('/') || rawPath.includes('\\')) {
    return path.resolve(process.cwd(), rawPath);
  }

  // Bare filename provided (e.g. jp07-01_Session_v61001-01.md)
  const bareFilename = rawPath;
  const docsDir = path.join(workspaceDir, '+docs');

  if (fs.existsSync(docsDir)) {
    const sessionDirs = [];

    function findSessionDirs(current) {
      try {
        const entries = fs.readdirSync(current, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const sub = path.join(current, entry.name);
            if (/sessions?/i.test(entry.name)) {
              sessionDirs.push(sub);
            } else if (!entry.name.startsWith('.') && !entry.name.startsWith('_')) {
              findSessionDirs(sub);
            }
          }
        }
      } catch {}
    }

    findSessionDirs(docsDir);

    if (sessionDirs.length > 0) {
      // 1. Check for app code in bare filename (e.g. "07", "a07", "jp07")
      const appCodeMatch = bareFilename.match(/(?:[a-zA-Z]{1,2})?(\d{2})/);
      if (appCodeMatch) {
        const code = appCodeMatch[1];
        const match = sessionDirs.find(d => {
          const norm = d.replace(/\\/g, '/');
          return norm.includes(`a${code}`) || norm.includes(`${code}_`);
        });
        if (match) {
          return path.join(match, bareFilename);
        }
      }

      // 2. Check for keywords from filename in session folder names
      const words = bareFilename.split(/[-_.)]/).filter(w => w.length > 2);
      for (const w of words) {
        const match = sessionDirs.find(d => d.toLowerCase().includes(w.toLowerCase()));
        if (match) {
          return path.join(match, bareFilename);
        }
      }

      // 3. Fall back to the first discovered session directory
      return path.join(sessionDirs[0], bareFilename);
    }

    // Default to +docs/ if no session dirs found
    return path.join(docsDir, bareFilename);
  }

  // Fallback to workspace root
  return path.resolve(workspaceDir, bareFilename);
}

// Title candidate from the cleaned first meaningful line of the user prompt
function titleFromUserPrompt(userPrompt) {
  const firstLine = (userPrompt || '')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('>') && !l.startsWith('#'))[0] || '';

  if (!firstLine) return '';

  let cleaned = firstLine
    .replace(/^([Cc]an you|[Cc]ould you|[Pp]lease|[Ww]ill you|[Kk]indly|[Hh]ey|[Hh]i|[Hh]ello|[Ss]o),?\s+/i, '')
    .replace(/^i want (?:you to )?/i, '')
    .replace(/^i need (?:you to )?/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  cleaned = cleaned.replace(/[.:]+$/, '');
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  if (cleaned.length > 80) {
    cleaned = cleaned.substring(0, 77).trim() + '...';
  }
  return cleaned;
}

// Title candidate from a prominent topic header in the model response
function titleFromModelHeader(modelText) {
  if (!modelText) return '';
  const topicHeaderMatch = modelText.match(/^#+\s*(?:\d+\.\s*)?([A-Z][^\n]+)/m);
  if (topicHeaderMatch) {
    let candidate = topicHeaderMatch[1].replace(/[`*]/g, '').trim();
    candidate = candidate.replace(/^\d+\.\s*/, '');
    if (candidate.length > 6 && candidate.length <= 70) {
      return candidate;
    }
  }
  return '';
}

// Derive a turn title based on the selected source.
//   titleSource 'model' (default): model header first, user prompt fallback.
//   titleSource 'user'           : user prompt first, model header fallback.
function deriveTurnTitle(userPrompt, modelText, titleSource) {
  if (titleSource === 'user') {
    return titleFromUserPrompt(userPrompt) || titleFromModelHeader(modelText) || 'Conversation Turn';
  }
  // default: 'model'
  return titleFromModelHeader(modelText) || titleFromUserPrompt(userPrompt) || 'Conversation Turn';
}

// Extract plain text from a Kiro content[] array for a given set of allowed kinds
function extractText(contentArr, allowedKinds) {
  if (!Array.isArray(contentArr)) return '';
  return contentArr
    .filter(c => c && allowedKinds.includes(c.kind) && typeof c.data === 'string')
    .map(c => c.data.trim())
    .filter(Boolean)
    .join('\n\n');
}

// Parse a Kiro cli/*.jsonl session file into turn structures
function parseTranscript(filePath, titleSource) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const turns = [];
  let currentTurn = null;
  const timestamps = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    let step;
    try {
      step = JSON.parse(line);
    } catch {
      continue;
    }

    const kind = step.kind;
    const data = step.data || {};

    // Collect timestamps where available (Prompt meta carries a unix timestamp)
    if (data.meta && data.meta.timestamp) {
      timestamps.push(data.meta.timestamp);
    }

    if (kind === 'Prompt') {
      const userPrompt = extractText(data.content, ['text']);
      if (!userPrompt) continue;

      // Finalize previous turn
      if (currentTurn) {
        turns.push(currentTurn);
      }

      currentTurn = {
        turnNumber: turns.length + 1,
        userPrompt,
        modelResponses: [],
      };
      continue;
    }

    // Assistant reply text (exclude thinking + toolUse)
    if (kind === 'AssistantMessage' && currentTurn) {
      const text = extractText(data.content, ['text']);
      if (text) {
        currentTurn.modelResponses.push(text);
      }
    }

    // ToolResults are intentionally excluded from the transcript
  }

  if (currentTurn) {
    turns.push(currentTurn);
  }

  // Renumber turns sequentially 1..N and derive titles
  turns.forEach((t, i) => {
    t.turnNumber = i + 1;
    t.fullModelText = t.modelResponses.join('\n\n');
    t.title = deriveTurnTitle(t.userPrompt, t.fullModelText, titleSource);
  });

  return { turns, timestamps };
}

// Derive date range from unix-second timestamps
function deriveDateRange(timestamps) {
  if (!timestamps || timestamps.length === 0) {
    return new Date().toISOString().slice(0, 10);
  }
  const dates = timestamps
    .map(ts => new Date(ts * 1000).toISOString().slice(0, 10))
    .sort();
  const first = dates[0];
  const last = dates[dates.length - 1];
  return first === last ? first : `${first} to ${last}`;
}

// Derive primary components
function derivePrimaryComponents(resolvedPath, workspaceDir) {
  try {
    const serverDir = path.join(workspaceDir, 'server');
    const clientDir = path.join(workspaceDir, 'client');
    const serverApps = fs.existsSync(serverDir)
      ? fs.readdirSync(serverDir, { withFileTypes: true })
          .filter(e => e.isDirectory() && !e.name.startsWith('.') && !e.name.startsWith('!') && e.name !== 'node_modules' && e.name !== 'app_modules')
          .map(e => e.name)
      : [];
    const clientApps = fs.existsSync(clientDir)
      ? fs.readdirSync(clientDir, { withFileTypes: true })
          .filter(e => e.isDirectory() && !e.name.startsWith('.') && !e.name.startsWith('!') && e.name !== 'node_modules')
          .map(e => e.name)
      : [];

    const searchPath = (resolvedPath || '') + ' ' + (workspaceDir || '');
    const codeMatch = searchPath.match(/(?:[a-zA-Z]{1,2})?(\d{2})/);
    if (codeMatch) {
      const code = codeMatch[1];
      const sApp = serverApps.find(a => a.includes(code));
      const cApp = clientApps.find(a => a.includes(code));
      if (sApp && cApp) {
        return `<code>server/${sApp}</code> &amp; <code>client/${cApp}</code>`;
      } else if (sApp) {
        return `<code>server/${sApp}</code>`;
      } else if (cApp) {
        return `<code>client/${cApp}</code>`;
      }
    }

    if (serverApps.length > 0 && clientApps.length > 0) {
      return `<code>server/${serverApps[0]}</code> &amp; <code>client/${clientApps[0]}</code>`;
    }
  } catch {}
  return `<code>${path.basename(workspaceDir)}</code>`;
}

// Derive session metadata (Title, Components, Dates)
function deriveSessionMetadata(options, resolvedPath, workspaceDir, turns, timestamps) {
  const filename = resolvedPath ? path.basename(resolvedPath) : 'Session_Transcript.md';
  const relPath = resolvedPath ? path.relative(workspaceDir, resolvedPath) : '';

  // Title derivation
  let title = options.title;
  if (!title) {
    const match = filename.match(/_Session_([^_.]+)(?:_by|\.md)?/i);
    if (match) {
      const raw = match[1];
      if (!raw.toLowerCase().startsWith('output') && !raw.toLowerCase().startsWith('test')) {
        title = raw;
      }
    }
  }
  if (!title) {
    const docDirMatch = relPath.match(/\+docs[\\/](?:a\d+[-_])?([^\\/]+)/i);
    if (docDirMatch) {
      const topic = docDirMatch[1].replace(/^a\d+[-_]?/, '');
      if (topic && topic.toLowerCase() !== 'sessions') {
        title = topic;
      }
    }
  }
  if (!title) {
    title = path.basename(workspaceDir);
  }

  const primaryComponents = derivePrimaryComponents(resolvedPath, workspaceDir);
  const dateRange = deriveDateRange(timestamps);

  return {
    title,
    filename,
    dateRange,
    workspacePath: workspaceDir,
    primaryComponents,
  };
}

// Generate the final Markdown transcript document
function formatMarkdown(meta, turns) {
  let doc = `<style>
   th { padding: 5px 6px !important; }
   td { padding: 2px 6px !important; }
 li p { margin:  6px 0px !important; }
   h1 { margin:  8px;        color: blue; font-size: 24px; }
   h2 { margin:  18px 0 8px; color: blue; font-size: 20px; }
   h3 { margin:  2px;        color: blue; font-size: 16px; margin-left: 16px; }
  pre { padding: 6px 9px !important; margin: 15px !important; background-color: #ece7e7 }
 code { background-color: #ece7e7; }
 blockquote {  padding: 15px 6px 2px !important; }
.page-break { page-break-before: always; break-before: page; }
details { margin-bottom: 16px; border: 1px solid #d0d7de; border-radius: 6px; padding: 10px 16px; }
summary { font-size: 16px; font-weight: bold; color: blue; cursor: pointer; padding: 4px 0; }
</style>
<!-- ----------------------------------------------------------------------------- -->

# Session Transcript: ${meta.title}

<div style="padding-left:16px; margin-bottom: 20px;">
<strong>File:</strong> <code>${meta.filename}</code><br/>
<strong>Date:</strong> ${meta.dateRange}<br/>
<strong>Speakers:</strong> User and Kiro<br/>
<strong>Workspace:</strong> <code>${meta.workspacePath}</code><br/>
<strong>Primary Components:</strong> ${meta.primaryComponents}<br/>
<strong>Status:</strong> Verbatim Conversation Dialogue (Collapsible Turn-by-Turn)
</div>

---
`;

  for (const turn of turns) {
    const modelContent = turn.fullModelText || '*(Response in progress or no model response)*';
    doc += `\n<details>\n<summary>Turn ${turn.turnNumber}: ${turn.title}</summary>\n\n### User\n\n${turn.userPrompt}\n\n### Kiro\n\n${modelContent}\n\n</details>\n`;
  }

  return doc;
}

// Main execution
function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const workspaceDir = options.workspace ? path.resolve(process.cwd(), options.workspace) : process.cwd();

  // Find transcript
  const { transcriptPath, sessionId } = findTranscript(options.sessionId, options.transcriptPath);

  // Parse turns from transcript
  const { turns, timestamps } = parseTranscript(transcriptPath, options.titleSource);

  // Resolve output path
  let resolvedPath = null;
  if (options.outputPath) {
    resolvedPath = resolveOutputPath(options.outputPath, workspaceDir);
  }

  // Handle dry-run mode
  if (options.dryRun) {
    console.log('\n=== save-session DRY RUN ===');
    console.log(`Active Session ID  : ${sessionId}`);
    console.log(`Transcript Source  : ${transcriptPath}`);
    console.log(`Workspace Path     : ${workspaceDir}`);
    console.log(`Title Source       : ${options.titleSource === 'user' ? 'user-header (-uh)' : 'model-header (-mh)'}`);
    console.log(`Target Destination : ${resolvedPath || '(Preview only - no path specified)'}`);
    console.log(`Discovered Turns   : ${turns.length}`);
    console.log('\n--- Turn Outline ---');
    for (const turn of turns) {
      console.log(`Turn ${turn.turnNumber.toString().padStart(2, ' ')}: ${turn.title}`);
    }
    console.log('\n[Dry Run] Verification complete. No files were written to disk.\n');
    return;
  }

  // Validate output path when not in dry-run mode
  if (!resolvedPath) {
    console.error('Error: output_path argument is required (e.g. jp07-01_Session_v61001-01.md). Use -n / --dry-run to preview without saving.');
    process.exit(1);
  }

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

  // Generate metadata and document content
  const meta = deriveSessionMetadata(options, resolvedPath, workspaceDir, turns, timestamps);
  const markdown = formatMarkdown(meta, turns);

  // Write file to disk
  fs.writeFileSync(resolvedPath, markdown, 'utf8');

  console.log(`\n[save-session] Successfully saved session transcript (${turns.length} turns, ${Buffer.byteLength(markdown, 'utf8')} bytes) to:\n  ${resolvedPath}\n`);
}

main();
