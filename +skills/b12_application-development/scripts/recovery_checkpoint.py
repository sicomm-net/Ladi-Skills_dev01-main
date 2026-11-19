#!/usr/bin/env python3
"""Local, non-destructive Git state checkpoint for interruption recovery.

No background scheduling is installed by this script. Snapshot contains only
Git metadata and file path/status information, never source or secret contents.
"""
import argparse
import datetime as dt
import hashlib
import json
import os
import pathlib
import subprocess
import sys
import tempfile

VERSION = "1.11.0"


def git(repo, *args):
    proc = subprocess.run(["git", "-C", str(repo), *args], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)
    if proc.returncode:
        raise RuntimeError(proc.stderr.decode("utf-8", "replace").strip() or "Git command failed")
    return proc.stdout


def resolve(repo):
    root = pathlib.Path(os.fsdecode(git(repo, "rev-parse", "--show-toplevel")).strip()).resolve()
    gitdir_raw = os.fsdecode(git(root, "rev-parse", "--absolute-git-dir")).strip()
    return root, pathlib.Path(gitdir_raw).resolve()


def state(root):
    data = git(root, "status", "--porcelain=v1", "-z", "--untracked-files=all")
    # A SHA over porcelain-v1 bytes captures staging, tracked and untracked status,
    # but does not capture contents. Changes to an already-modified file are not
    # detectable from porcelain alone; use git diff hashes as well.
    diff_work = git(root, "diff", "--binary", "--no-ext-diff", "--")
    diff_index = git(root, "diff", "--cached", "--binary", "--no-ext-diff", "--")
    # Untracked content is intentionally NOT read. Presence is observable by Git.
    return {
        "branch": os.fsdecode(git(root, "branch", "--show-current")).strip() or "DETACHED",
        "head": os.fsdecode(git(root, "rev-parse", "HEAD")).strip(),
        "status_sha256": hashlib.sha256(data).hexdigest(),
        "worktree_diff_sha256": hashlib.sha256(diff_work).hexdigest(),
        "index_diff_sha256": hashlib.sha256(diff_index).hexdigest(),
        "status_entries": len([x for x in data.split(b"\0") if x]),
        "dirty": bool(data),
    }


def checkpoint_path(gitdir):
    return gitdir / "application-development" / "checkpoint.json"


def atomic_json(path, payload):
    path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    fd, temp = tempfile.mkstemp(prefix=".checkpoint-", dir=path.parent)
    try:
        os.fchmod(fd, 0o600)
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(payload, f, sort_keys=True, indent=2)
            f.write("\n")
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp, path)
    finally:
        if os.path.exists(temp):
            os.unlink(temp)


def run():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="action", required=True)
    s = sub.add_parser("snapshot")
    s.add_argument("--repo", default=".")
    s.add_argument("--task", required=True)
    s.add_argument("--phase", required=True)
    s.add_argument("--contract", required=True)
    i = sub.add_parser("inspect")
    i.add_argument("--repo", default=".")
    args = parser.parse_args()
    root, gitdir = resolve(args.repo)
    path = checkpoint_path(gitdir)
    current = state(root)
    if args.action == "snapshot":
        contract = pathlib.Path(args.contract)
        if not contract.is_absolute():
            contract = root / contract
        contract = contract.resolve()
        if not contract.is_file():
            raise RuntimeError("Task contract must be an existing file")
        if not contract.is_relative_to(root):
            raise RuntimeError("Task contract must be inside the repository")
        payload = {
            "schema": 1,
            "tool_version": VERSION,
            "task": args.task,
            "phase": args.phase,
            "contract_relpath": str(contract.relative_to(root)),
            "contract_sha256": hashlib.sha256(contract.read_bytes()).hexdigest(),
            "created_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
            "repository": str(root),
            "git_state": current,
        }
        atomic_json(path, payload)
        print(json.dumps({"status": "SNAPSHOT_WRITTEN", "path": str(path), "task": args.task, "git_state": current}, sort_keys=True))
        return 0
    if not path.is_file():
        print(json.dumps({"status": "RECOVERY_REQUIRED", "reason": "NO_CHECKPOINT", "git_state": current}, sort_keys=True))
        return 2
    saved = json.loads(path.read_text(encoding="utf-8"))
    differences = [k for k in current if current[k] != saved.get("git_state", {}).get(k)]
    rel = saved.get("contract_relpath", "")
    contract = (root / rel).resolve()
    try:
        contract_valid = contract.is_relative_to(root) and contract.is_file() and hashlib.sha256(contract.read_bytes()).hexdigest() == saved["contract_sha256"]
    except (KeyError, OSError):
        contract_valid = False
    if not contract_valid:
        differences.append("contract")
    if saved.get("repository") != str(root):
        differences.append("repository")
    result = {
        "status": "MATCH" if not differences else "RECOVERY_REQUIRED",
        "task": saved.get("task"),
        "phase": saved.get("phase"),
        "created_utc": saved.get("created_utc"),
        "changed": differences,
        "git_state": current,
    }
    print(json.dumps(result, sort_keys=True))
    return 0 if not differences else 2


if __name__ == "__main__":
    try:
        sys.exit(run())
    except (RuntimeError, OSError, ValueError) as exc:
        print(json.dumps({"status": "ERROR", "detail": str(exc)}), file=sys.stderr)
        sys.exit(1)
