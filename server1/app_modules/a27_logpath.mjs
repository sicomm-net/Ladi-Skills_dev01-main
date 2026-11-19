// ==================================================================
// a27_logpath.mjs   (Phase 3 — finalized)
//
// The SINGLE shared log module. The `a` prefix means it is used by BOTH
// server scripts (c27 writer, s27 reader). It contains two things, and no
// Express knowledge:
//
//   1. The "aeo log name scheme" — pure path helpers that turn a config
//      object + a date into the daily log filename. Inputs come from the
//      per-server *_config.js files. Writer (c27) and reader (s27) use the
//      same scheme so paths can never drift (PLAN R-2).
//
//        {aLogDir}/{appStageDir}/{YYMM.Mth}/{pm2Name}_v{TS}-app.log
//          aLogDir     - PC: E:/Repos/SCN3/BASEC_/._/LOGs
//                        servers: /nfs/u06/SCN3/BASEC_/._/LOGs
//          appStageDir - {Proj}_{stg##}-{owner}, e.g. SCN3_dev01-info
//          {YYMM.Mth}  - month folder, e.g. 2609.Sep   (getTS(4))
//          pm2Name     - PM2 process name, hyphenated, e.g. SCN3-19327
//          {TS}        - date stamp YMMDD, e.g. 60918   (getTS(1))
//          suffix      - default '-app.log'
//
//      c27 and s27 write DIFFERENT files (the port in pm2Name differs);
//      they never write the same file.
//
//   2. The getlog read/filter helpers (formerly c00_getLog.mjs /
//      s27_getLog.mjs) — parse the d/t/c query args, read a multi-day range
//      of daily files, filter lines, and (for the activity log) strip IPs.
//      There is NO registerGetLogRoute; each server mounts its own route
//      inline and calls these functions.
// ==================================================================

import path from 'path';
import { readFile } from 'fs';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function pad2(n) { return (n < 10 ? '0' : '') + n; }

// ------------------------------------------------------------------
// 1) PATH SCHEME
// ------------------------------------------------------------------

// Date -> "YMMDD" (single trailing year digit), matching getTS(1).
export function tsStamp(d) {
    const y = String(d.getFullYear()).slice(-1);
    return `${y}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
}

// Date -> "YYMM.Mth", matching getTS(4). e.g. 2026-09-18 -> "2609.Sep"
export function monthFolder(d) {
    const yy = String(d.getFullYear()).slice(-1);
    return `2${yy}${pad2(d.getMonth() + 1)}.${MONTHS[d.getMonth()]}`;
}
export function dayFolder(d) {                                                                      // .(60921.03.1 RAM Beg)
    return `${monthFolder(d)}${pad2(d.getDate())}`;
}                                                                                                   // .(60921.03.1 End)

function requireConfig(cfg) {
    if (!cfg || typeof cfg !== 'object') {
        throw new Error('a27_logpath: config object is required');
    }
    for (const k of ['aLogDir', 'appStageDir', 'pm2Name']) {
        if (!cfg[k]) throw new Error(`a27_logpath: config.${k} is required`);
    }
}

// (config + Date) -> absolute daily log filename.
export function logFileFor(cfg, date = new Date()) {
    requireConfig(cfg);
    const suffix = cfg.suffix || '-app.log';
    const fileName = `${cfg.pm2Name}_v${tsStamp(date)}${suffix}`;
//  return path.join(cfg.aLogDir, cfg.appStageDir, monthFolder(date), fileName);                    //#.(60921.03.2)
    return path.join(cfg.aLogDir, cfg.appStageDir, dayFolder(date), fileName);                      // .(60921.03.2)
}

// (config + Date) -> directory that holds the daily file (for mkdir).
export function logDirFor(cfg, date = new Date()) {
    requireConfig(cfg);
//  return path.join(cfg.aLogDir, cfg.appStageDir, monthFolder(date));                              //#.(60921.03.3) 
    return path.join(cfg.aLogDir, cfg.appStageDir, dayFolder(date));                                // .(60921.03.3)    
}

// Shared DATA dir (CuePoints / Transcript / mp4), OUT of the repo:
//   {aDataDir}/{appStageDir}/
// Both c27 (serves it) and s27 (reads/writes it) resolve the SAME path.
export function dataDirFor(cfg) {
    if (!cfg || !cfg.aDataDir || !cfg.appStageDir) {
        throw new Error('a27_logpath.dataDirFor: config.aDataDir and config.appStageDir are required');
    }
    return path.join(cfg.aDataDir, cfg.appStageDir);
}

// Inclusive Date range -> ordered list of daily log filenames.
export function logFilesForRange(cfg, startDate, endDate) {
    requireConfig(cfg);
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        throw new Error('a27_logpath: startDate and endDate must be Date objects');
    }
    const cur = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    if (end < cur) return [];
    const files = [];
    let guard = 0;
    while (cur <= end && guard < 3660) {
        files.push(logFileFor(cfg, cur));
        cur.setDate(cur.getDate() + 1);
        guard++;
    }
    return files;
}

// ------------------------------------------------------------------
// 2) GETLOG READ / FILTER HELPERS
// ------------------------------------------------------------------

function ymd(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}

// Parse the "d" arg -> { startDate, endDate } inclusive Date range.
export function parseDayArg(dArg, now = new Date()) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startBack = 0;
    let span = 1;
    if (dArg != null && String(dArg).trim() !== '') {
        const s = String(dArg).trim().replace(/\s+/g, '+');
        let m;
        if ((m = s.match(/^-(\d+)\+(\d+)$/))) {          // -X+Y
            startBack = parseInt(m[1], 10);
            span = parseInt(m[2], 10);
        } else if ((m = s.match(/^-(\d+)$/))) {          // -N
            startBack = parseInt(m[1], 10);
            span = 1;
        } else if (s === '0') {                          // today
            startBack = 0; span = 1;
        } else {
            throw new Error('bad d arg: ' + s);
        }
    }
    if (span < 1) span = 1;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - startBack);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (span - 1));
    return { startDate, endDate };
}

// Parse the "t" arg -> { startMinutes, durationHours } or null.
export function parseTimeArg(tArg) {
    if (tArg == null || String(tArg).trim() === '') return null;
    let s = String(tArg).trim().toLowerCase().replace(/\s+/g, '+');
    let durationHours = null;
    const plus = s.indexOf('+');
    if (plus !== -1) {
        durationHours = parseInt(s.slice(plus + 1), 10);
        if (isNaN(durationHours)) throw new Error('bad t duration');
        s = s.slice(0, plus);
    }
    let ampm = null;
    const ap = s.match(/(am|pm|a|p)$/);
    if (ap) { ampm = ap[1][0]; s = s.slice(0, s.length - ap[1].length); }
    let hh = 0, mm = 0;
    if (s.indexOf(':') !== -1) {
        const parts = s.split(':');
        hh = parseInt(parts[0], 10);
        mm = parseInt(parts[1], 10) || 0;
    } else {
        hh = parseInt(s, 10);
        mm = 0;
    }
    if (isNaN(hh)) throw new Error('bad t time');
    if (ampm === 'p' && hh < 12) hh += 12;
    if (ampm === 'a' && hh === 12) hh = 0;
    return { startMinutes: hh * 60 + mm, durationHours };
}

// Build a code matcher from the "c" arg (case-insensitive; codes uppercase).
export function makeCodeMatcher(cArg) {
    if (cArg == null || String(cArg).trim() === '') return null;
    const c = String(cArg).trim().toLowerCase();
    const exact = /-\d+$/.test(c);
    return function (lineCode) {
        const lc = String(lineCode).toLowerCase();
        if (exact) return lc === c;
        return lc === c || lc.indexOf(c + '-') === 0;
    };
}

// Build an event/action matcher from the "e" arg: a LEADING (prefix) match
// against the action name, case-insensitive. A trailing "*" is optional and
// treated the same as a plain prefix (e.g. e=play and e=play* both match
// "play" and "played ..."). Matching is anchored at the start of the action.
// A "+" is treated as a SPACE so multi-word prefixes work through a URL,
// e.g. e=session+start matches "session started" but NOT "session video ended".
export function makeEventMatcher(eArg) {
    if (eArg == null || String(eArg).trim() === '') return null;
    let e = String(eArg).trim().toLowerCase();
    if (e.endsWith('*')) e = e.slice(0, -1);   // trailing * is implied for a prefix match
    e = e.replace(/\+/g, ' ');                 // '+' means a space (URL-safe multi-word)
    return function (action) {
        return String(action).toLowerCase().indexOf(e) === 0;
    };
}

// Parse an ACTIVITY log line: [YYYY-MM-DD HH:mm:ss]  IP  CODE  action
// const ACTIVITY_LINE_RE = /^\[(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\]\s+(\S+)\s+(\S+)\s/;

// Parse an ACTIVITY log line: [HHMM.SS.mmm]  IP  CODE  action
// Captures IP + CODE so the IP can be stripped from /getlog2 output.
const ACTIVITY_LINE_RE = /^\[(\d{2})(\d{2})\.(\d{2})\.(\d{3})\]\s+(\S+)\s+(\S+)\s+(.*)$/;
export function parseLogLine(line, fileDate) {
    const m = line.match(ACTIVITY_LINE_RE);
    if (!m) return null;
    const [, H, Mi, S, ms, ip, code, action] = m;
    const d = fileDate || new Date();
    const ts = new Date(d.getFullYear(), d.getMonth(), d.getDate(), +H, +Mi, +S, +ms);
    return { ts, dateStr: `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`, ip, code, action: (action || '').trim(), raw: line };
//  return { ts, dateStr: `${Y}-${Mo}-${D}`, ip, code, raw: line };
}

// Remove the IP column from an activity line, preserving [ts] + CODE + rest.
// Kept for optional future use (currently /getlog2 retains the IP).
export function stripIp(raw) {
    const m = raw.match(/^(\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\])\s+\S+\s+(.*)$/);
    if (!m) return raw;
    return `${m[1]}  ${m[2]}`;
}

// Core filter for ACTIVITY lines. `code` filter only applies when the line
// has a CODE column (activity log). Returns matching raw lines.
export function filterLogLines(lines, { day, time, code, event }, now = new Date()) {
    const { startDate, endDate } = parseDayArg(day, now);
    const startYmd = ymd(startDate);
    const endYmd = ymd(endDate);
    const timeSpec = parseTimeArg(time);
    const codeMatch = makeCodeMatcher(code);
    const eventMatch = makeEventMatcher(event);

    // Time window: t=HH[+dur] is a SINGLE CONTINUOUS block starting at the
    // window start on the range's start day and running `dur` continuous hours
    // (it may span past midnight into following days). Not a per-day window.
    let winFrom = null, winTo = null, startMin = null;
    let effectiveEndYmd = endYmd;
    if (timeSpec) {
        startMin = timeSpec.startMinutes;
        winFrom = new Date(startDate);
        winFrom.setMinutes(startMin);
        if (timeSpec.durationHours != null) {
            winTo = new Date(winFrom.getTime() + timeSpec.durationHours * 3600 * 1000);
            const winToYmd = ymd(winTo);
            if (winToYmd > effectiveEndYmd) effectiveEndYmd = winToYmd;
        }
    }

    const out = [];
    // Always keep the session/server banner and its underline, regardless of
    // d/t/c filters (they delimit sessions).
    //   session start : "[HHMM YMMDD]  Begin              <code>"
    //   server start  : "[HHMM YMMDD]  Starting app       <appStageDir>"
    //   underline     : "               -----------------------------------"
    const isBanner = (s) =>
        /\]\s+Begin\s+\S/.test(s) ||          // Begin + code
        /\]\s+Starting app\s+\S/.test(s) ||   // server-start header
        /^\s+-{10,}\s*$/.test(s);             // underline row
    for (const entry of lines) {
        const { line: raw, fileDate } = entry;
        if (!raw) continue;
        if (isBanner(raw)) { out.push(raw); continue; }
        const p = parseLogLine(raw, fileDate);
        if (!p) continue;
        if (p.dateStr < startYmd || p.dateStr > effectiveEndYmd) continue;
        if (timeSpec) {
            if (winTo) {
                if (p.ts < winFrom || p.ts >= winTo) continue;
            } else if (p.dateStr === startYmd) {
                const mins = p.ts.getHours() * 60 + p.ts.getMinutes();
                if (mins < startMin) continue;
            }
        }
        if (codeMatch && !codeMatch(p.code)) continue;
        if (eventMatch && !eventMatch(p.action)) continue;
        out.push(raw);
    }

    // Banner cleanup after filtering:
    //  c= / e= : drop orphaned session (Begin) banners; KEEP the "Starting app"
    //            server-start header (a non-matching query just shows the server banner).
    //  t=      : drop orphaned banners outside the time window, INCLUDING the
    //            "Starting app" header (only banners with in-window activity stay).
    if (timeSpec) return dropEmptyBanners(out, { dropServerStart: true });
    if (codeMatch || eventMatch) return dropEmptyBanners(out, { dropServerStart: false });
    return out;
}

// Remove underline+Begin pairs that have no activity line under them.
// A Begin is "empty" when the next line is a "-----" underline, another
// Begin/Starting-app header, or the end of the list.
function dropEmptyBanners(lines, { dropServerStart = false } = {}) {
    const isUnderline  = (s) => /^\s+-{10,}\s*$/.test(s);
    const isBeginHdr   = (s) => /\]\s+Begin\s+\S/.test(s);
    const isServerHdr  = (s) => /\]\s+Starting app\s+\S/.test(s);
    const isHeader     = (s) => isBeginHdr(s) || isServerHdr(s);
    // Which headers are candidates for removal when they have no content under them.
    const isRemovable  = (s) => isBeginHdr(s) || (dropServerStart && isServerHdr(s));
    const keep = lines.slice();
    for (let i = 0; i < keep.length; i++) {
        if (keep[i] == null) continue;
        if (isRemovable(keep[i])) {
            // find the next non-null line after this header
            let j = i + 1;
            while (j < keep.length && keep[j] == null) j++;
            const nextIsEmptyBoundary = (j >= keep.length) || isUnderline(keep[j]) || isHeader(keep[j]);
            if (nextIsEmptyBoundary) {
                // remove this Begin and the underline immediately preceding it
                keep[i] = null;
                let k = i - 1;
                while (k >= 0 && keep[k] == null) k--;
                if (k >= 0 && isUnderline(keep[k])) keep[k] = null;
            }
        }
    }
    return keep.filter((l) => l != null);
}

// Filter for OPERATIONAL (console_log1) lines: same timestamp prefix, but no
// IP/CODE columns. Supports d/t only (no code filter, no IP strip). The old
// console_log format is: [HHMM 2YMMDD]  ...  — but dated lines also appear as
// [YYYY-MM-DD HH:mm:ss] via console_log2; here we match the console_log1
// timestamp `[getTS(3)]` = [HHMM.SS.mmm]-ish, so we filter permissively by the
// selected day's FILE rather than per-line parsing. For simplicity and safety
// the operational reader returns all lines from the selected day files (the
// file name already encodes the day) and applies the optional time window
// only when a parseable leading [YYYY-MM-DD HH:mm:ss] timestamp is present.
export function filterOpLines(lines, { day, time }, now = new Date()) {
    const { startDate, endDate } = parseDayArg(day, now);
    const startYmd = ymd(startDate);
    const endYmd = ymd(endDate);
    const timeSpec = parseTimeArg(time);

    const DATED = /^\[(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\]/;
    const out = [];
    for (const entry of lines) {
        const raw = typeof entry === 'string' ? entry : entry.line;
        if (!raw) continue;
        const m = raw.match(DATED);
        if (!m) { out.push(raw); continue; }
        const [, Y, Mo, D, H, Mi] = m;
        const dateStr = `${Y}-${Mo}-${D}`;
        if (dateStr < startYmd || dateStr > endYmd) continue;
        if (timeSpec) {
            const mins = (+H) * 60 + (+Mi);
            if (dateStr === startYmd && mins < timeSpec.startMinutes) continue;
        }
        out.push(raw);
    }
    return out;
}

// Read + concat an ordered list of daily files. Missing files are skipped
// (not errors). Callback: cb(err, lines[]). err is only for unexpected fatals.
export function readLogRange(files, cb) {
    const all = [];
    let i = 0;
    (function next() {
        if (i >= files.length) { cb(null, all); return; }
        const f = files[i++];
        // Extract date from filename: pm2Name_vYMMDD-app.log -> YMMDD
        const dm = path.basename(f).match(/_v(\d)(\d{2})(\d{2})/);
        const fileDate = dm ? new Date(2000 + +('2' + dm[1]), +dm[2] - 1, +dm[3]) : new Date();
        readFile(f, 'utf8', (err, data) => {
            if (!err && data) {
                for (const ln of data.split('\n')) all.push({ line: ln, fileDate });
            }
            next();
        });
    })();
}
