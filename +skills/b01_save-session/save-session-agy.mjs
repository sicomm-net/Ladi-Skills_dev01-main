#!/usr/bin/env node

/**
 * save-session.mjs
 *
 * Deterministic conversation session exporter for Antigravity (AGY).
 * Parses transcript JSONL files and formats an interactive, collapsible
 * Markdown document matching the jp61001-01)e standard.
 *
 * Pure Node.js ESM - zero third-party dependencies.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

// Parse command line arguments
function parseArgs(args) {
  const options = {
    outputPath: null,
    transcriptPath: null,
    conversationId: null,
    dryRun: false,
    title: null,
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
    } else if (arg === '--conversation' || arg === '-c') {
      options.conversationId = args[++i];
    } else if (arg === '--title') {
      options.title = args[++i];
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
                        resolve to the corresponding docs/**/Sessions directory.

Options:
  -n, --dry-run         Preview discovered conversation, turns, and statistics without writing.
  -c, --conversation ID Specify explicit conversation ID in Antigravity brain directory.
  -t, --transcript PATH Specify explicit path to a transcript_full.jsonl or transcript.jsonl.
  --title TITLE         Override session title in the Markdown header.
  -w, --workspace PATH  Specify workspace root directory (defaults to current working directory).
  -h, --help            Show this help documentation.

Examples:
  node .agents/skills/save-session/scripts/save-session.mjs --dry-run
  node .agents/skills/save-session/scripts/save-session.mjs jp07-01_Session_v61001-01.md
  node .agents/skills/save-session/scripts/save-session.mjs docs/a07_My-MCP-Server/a07_Sessions/transcript.md
`);
}

// Locate transcript JSONL file
function findTranscript(conversationId, explicitTranscriptPath) {
  if (explicitTranscriptPath) {
    const resolved = path.resolve(process.cwd(), explicitTranscriptPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Specified transcript file not found: ${resolved}`);
    }
    return {
      transcriptPath: resolved,
      conversationId: conversationId || path.basename(path.dirname(path.dirname(path.dirname(resolved)))),
    };
  }

  // Gather brain base directories across platform defaults and environment
  const brainDirs = [
    process.env.ANTIGRAVITY_APP_DATA_DIR ? path.join(process.env.ANTIGRAVITY_APP_DATA_DIR, 'brain') : null,
    path.join(os.homedir(), '.gemini', 'antigravity-cli', 'brain'),
    process.env.USERPROFILE ? path.join(process.env.USERPROFILE, '.gemini', 'antigravity-cli', 'brain') : null,
    process.env.HOME ? path.join(process.env.HOME, '.gemini', 'antigravity-cli', 'brain') : null,
  ].filter(Boolean);

  const existingBrainDirs = [...new Set(brainDirs)].filter(d => fs.existsSync(d));

  if (existingBrainDirs.length === 0) {
    throw new Error('No Antigravity brain directories found on this system.');
  }

  // If specific conversation ID requested
  if (conversationId) {
    for (const bDir of existingBrainDirs) {
      const convDir = path.join(bDir, conversationId);
      if (fs.existsSync(convDir)) {
        const full = path.join(convDir, '.system_generated', 'logs', 'transcript_full.jsonl');
        const compact = path.join(convDir, '.system_generated', 'logs', 'transcript.jsonl');
        const target = fs.existsSync(full) ? full : (fs.existsSync(compact) ? compact : null);
        if (target) {
          return { transcriptPath: target, conversationId };
        }
      }
    }
    throw new Error(`Conversation directory not found for ID: ${conversationId}`);
  }

  // Scan all candidate conversation directories
  const candidates = [];
  for (const bDir of existingBrainDirs) {
    try {
      const entries = fs.readdirSync(bDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const full = path.join(bDir, entry.name, '.system_generated', 'logs', 'transcript_full.jsonl');
        const compact = path.join(bDir, entry.name, '.system_generated', 'logs', 'transcript.jsonl');
        const target = fs.existsSync(full) ? full : (fs.existsSync(compact) ? compact : null);
        if (target) {
          try {
            const stat = fs.statSync(target);
            candidates.push({
              id: entry.name,
              transcriptPath: target,
              mtime: stat.mtimeMs,
            });
          } catch {}
        }
      }
    } catch {}
  }

  if (candidates.length === 0) {
    throw new Error('No conversation transcripts found in Antigravity brain directories.');
  }

  // Sort by modification time descending
  candidates.sort((a, b) => b.mtime - a.mtime);

  // Subagents may have newer mtime than their parent session but lack interactive USER_INPUT.
  // Prioritize the most recently modified conversation that contains human USER_INPUT.
  for (const candidate of candidates) {
    try {
      const sample = fs.readFileSync(candidate.transcriptPath, 'utf8');
      if (sample.includes('"USER_INPUT"') || sample.includes('"USER_EXPLICIT"')) {
        return { transcriptPath: candidate.transcriptPath, conversationId: candidate.id };
      }
    } catch {}
  }

  // Fallback to absolute latest if none have USER_INPUT
  return { transcriptPath: candidates[0].transcriptPath, conversationId: candidates[0].id };
}

// Resolve output path (handling bare filenames and docs/**/Sessions routing)
function resolveOutputPath(rawPath, workspaceDir) {
  if (!rawPath) return null;

  // If path contains directory separators, resolve directly against cwd
  if (rawPath.includes('/') || rawPath.includes('\\')) {
    return path.resolve(process.cwd(), rawPath);
  }

  // Bare filename provided (e.g. jp07-01_Session_v61001-01.md)
  const bareFilename = rawPath;
  const docsDir = path.join(workspaceDir, 'docs');

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

    // Default to docs/ if no session dirs found
    return path.join(docsDir, bareFilename);
  }

  // Fallback to workspace root
  return path.resolve(workspaceDir, bareFilename);
}

// Derive a clean, human-readable title for a turn
function deriveTurnTitle(userPrompt, modelText) {
  // 1. Check model response for explicit Audit Report headers
  if (modelText) {
    const auditMatch = modelText.match(/^#+\s*(?:Audit Report:?\s*)([^\n]+)/m);
    if (auditMatch) {
      let title = auditMatch[1].replace(/[`*]/g, '').trim();
      if (/^Modifications to\s+/i.test(title)) {
        title = title.replace(/^Modifications to\s+.*[\\/]([^\s]+)/i, 'Enhancing `$1`');
      } else if (title.includes('/') || title.includes('\\')) {
        const basename = title.replace(/.*[\\/]([^\s]+)/, '$1');
        title = `Development of \`${basename}\``;
      }
      title = title.replace(/^Review & Completion of\s+/i, 'Reviewing ');
      if (title.length > 5 && title.length <= 80) {
        return title;
      }
    }

    // 2. Check model response for prominent topic headers
    const topicHeaderMatch = modelText.match(/^#+\s*(?:\d+\.\s*)?([A-Z][^\n]+)/m);
    if (topicHeaderMatch) {
      let candidate = topicHeaderMatch[1].replace(/[`*]/g, '').trim();
      candidate = candidate.replace(/^\d+\.\s*/, '');
      const lower = candidate.toLowerCase();
      const isGeneric = lower.startsWith('audit report') ||
                        lower.startsWith('changes summary') ||
                        lower.startsWith('verification') ||
                        lower.startsWith('how it works') ||
                        lower.startsWith('created file');
      if (!isGeneric && candidate.length > 6 && candidate.length <= 70) {
        const uLower = (userPrompt || '').toLowerCase();
        if (uLower.startsWith('thanks') || uLower.startsWith('list ') || uLower.includes('mcp')) {
          return candidate;
        }
      }
    }
  }

  // 3. Fallback to cleaned first line of user prompt
  const firstLine = (userPrompt || '')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('>') && !l.startsWith('#'))[0] || 'User Inquiry';

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

  return cleaned || 'Conversation Turn';
}

// Parse transcript JSONL file into turn structures
function parseTranscript(filePath) {
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

    if (step.created_at) {
      timestamps.push(step.created_at);
    }

    // Skip internal system messages
    if (step.type === 'SYSTEM_MESSAGE' || step.source === 'SYSTEM') {
      continue;
    }

    // Detect user prompt
    if (step.type === 'USER_INPUT' || step.source === 'USER_EXPLICIT') {
      let rawText = step.content || '';

      // Skip internal system injections
      if (rawText.includes('<SYSTEM_MESSAGE>')) {
        continue;
      }

      // Extract user request if enclosed in tags
      const userReqMatch = rawText.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
      let userPrompt = userReqMatch ? userReqMatch[1] : rawText;

      // Clean metadata and settings tags
      userPrompt = userPrompt
        .replace(/<ADDITIONAL_METADATA>[\s\S]*?<\/ADDITIONAL_METADATA>/g, '')
        .replace(/<USER_SETTINGS_CHANGE>[\s\S]*?<\/USER_SETTINGS_CHANGE>/g, '')
        .trim();

      if (!userPrompt || userPrompt.startsWith('<SYSTEM_MESSAGE>')) {
        continue;
      }

      // Finalize previous turn
      if (currentTurn) {
        turns.push(currentTurn);
      }

      currentTurn = {
        turnNumber: turns.length + 1,
        userPrompt,
        modelResponses: [],
        stepIndex: step.step_index,
        timestamp: step.created_at,
      };
      continue;
    }

    // Detect model response text
    if (currentTurn && step.source === 'MODEL' && step.type === 'PLANNER_RESPONSE') {
      if (step.content && step.content.trim()) {
        currentTurn.modelResponses.push(step.content.trim());
      }
    }
  }

  if (currentTurn) {
    turns.push(currentTurn);
  }

  // Renumber turns sequentially 1..N and derive titles
  turns.forEach((t, i) => {
    t.turnNumber = i + 1;
    t.fullModelText = t.modelResponses.join('\n\n');
    t.title = deriveTurnTitle(t.userPrompt, t.fullModelText);
  });

  return { turns, timestamps };
}

// Derive date range from step timestamps
function deriveDateRange(timestamps) {
  if (!timestamps || timestamps.length === 0) {
    return new Date().toISOString().slice(0, 10);
  }
  const dates = timestamps
    .map(ts => ts.slice(0, 10))
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
    const docDirMatch = relPath.match(/docs[\\/](?:a\d+[-_])?([^\\/]+)/i);
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
<strong>Speakers:</strong> User and Antigravity (Agemi)<br/>
<strong>Workspace:</strong> <code>${meta.workspacePath}</code><br/>
<strong>Primary Components:</strong> ${meta.primaryComponents}<br/>
<strong>Status:</strong> Verbatim Conversation Dialogue (Collapsible Turn-by-Turn)
</div>

---
`;

  for (const turn of turns) {
    const modelContent = turn.fullModelText || '*(Response in progress or no model response)*';
    doc += `\n<details>\n<summary>Turn ${turn.turnNumber}: ${turn.title}</summary>\n\n### User\n\n${turn.userPrompt}\n\n### Antigravity (Agemi)\n\n${modelContent}\n\n</details>\n`;
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
  const { transcriptPath, conversationId } = findTranscript(options.conversationId, options.transcriptPath);

  // Parse turns from transcript
  const { turns, timestamps } = parseTranscript(transcriptPath);

  // Resolve output path
  let resolvedPath = null;
  if (options.outputPath) {
    resolvedPath = resolveOutputPath(options.outputPath, workspaceDir);
  }

  // Handle dry-run mode
  if (options.dryRun) {
    console.log('\n=== save-session DRY RUN ===');
    console.log(`Active Conversation ID : ${conversationId}`);
    console.log(`Transcript Source      : ${transcriptPath}`);
    console.log(`Workspace Path         : ${workspaceDir}`);
    console.log(`Target Destination     : ${resolvedPath || '(Preview only - no path specified)'}`);
    console.log(`Discovered Turns       : ${turns.length}`);
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
