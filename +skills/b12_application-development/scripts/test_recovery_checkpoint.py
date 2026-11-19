#!/usr/bin/env python3
"""Isolated integration tests for recovery checkpoint tool (no network)."""
import json
import pathlib
import subprocess
import sys
import tempfile
import unittest

TOOL = pathlib.Path(__file__).with_name("recovery_checkpoint.py")


def call(*args):
    return subprocess.run([sys.executable, str(TOOL), *map(str, args)], capture_output=True, text=True)


def git(root, *args):
    return subprocess.run(["git", "-C", str(root), *args], capture_output=True, text=True, check=True).stdout


class RecoveryTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = pathlib.Path(self.tmp.name)
        git(self.root, "init", "-q")
        git(self.root, "config", "user.email", "test@example.invalid")
        git(self.root, "config", "user.name", "Checkpoint Test")
        (self.root / "contract.md").write_text("OWNER OUTCOME: working application\n")
        (self.root / "app.txt").write_text("baseline\n")
        git(self.root, "add", "contract.md", "app.txt")
        git(self.root, "commit", "-qm", "baseline")

    def snapshot(self):
        return call("snapshot", "--repo", self.root, "--task", "TEST-1", "--phase", "BEFORE_EDIT", "--contract", "contract.md")

    def inspect(self):
        return call("inspect", "--repo", self.root)

    def test_clean_match_and_private_permissions(self):
        result = self.snapshot()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(self.inspect().stdout)["status"], "MATCH")
        path = self.root / ".git" / "application-development" / "checkpoint.json"
        self.assertEqual(path.stat().st_mode & 0o777, 0o600)

    def test_abrupt_abort_with_dirty_and_untracked(self):
        self.snapshot()
        (self.root / "app.txt").write_text("unfinished edit\n")
        (self.root / "new.txt").write_text("unfinished new file\n")
        result = self.inspect()
        self.assertEqual(result.returncode, 2)
        self.assertEqual(json.loads(result.stdout)["status"], "RECOVERY_REQUIRED")
        self.assertEqual((self.root / "app.txt").read_text(), "unfinished edit\n")
        self.assertTrue((self.root / "new.txt").exists())

    def test_changed_existing_diff_detected(self):
        (self.root / "app.txt").write_text("first\n")
        self.snapshot()
        (self.root / "app.txt").write_text("second\n")
        self.assertIn("worktree_diff_sha256", json.loads(self.inspect().stdout)["changed"])

    def test_changed_contract_and_commit_detected(self):
        self.snapshot()
        (self.root / "contract.md").write_text("DIFFERENT OWNER OUTCOME\n")
        self.assertIn("contract", json.loads(self.inspect().stdout)["changed"])
        git(self.root, "add", "contract.md")
        git(self.root, "commit", "-qm", "new task")
        self.assertIn("head", json.loads(self.inspect().stdout)["changed"])

    def test_missing_checkpoint_requires_recovery(self):
        result = self.inspect()
        self.assertEqual(result.returncode, 2)
        self.assertEqual(json.loads(result.stdout)["reason"], "NO_CHECKPOINT")

    def test_snapshot_does_not_stage_untracked(self):
        (self.root / "untracked").write_text("keep")
        self.snapshot()
        self.assertIn("?? untracked", git(self.root, "status", "--short"))


if __name__ == "__main__":
    unittest.main()
