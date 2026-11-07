#!/usr/bin/env node

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { afterEach, test } = require('node:test');

const VALIDATOR = path.join(__dirname, 'validate-artifact-paths.js');
const sandboxes = [];

function makeSandbox() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'viserys-validate-artifact-paths-test-'));
  const scriptsDir = path.join(root, 'scripts');
  fs.mkdirSync(scriptsDir, { recursive: true });
  fs.copyFileSync(VALIDATOR, path.join(scriptsDir, 'validate-artifact-paths.js'));
  sandboxes.push(root);
  return root;
}

function writeFile(root, relativePath, content) {
  const file = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function run(root) {
  return spawnSync(process.execPath, [path.join(root, 'scripts', 'validate-artifact-paths.js')], {
    cwd: root,
    encoding: 'utf8',
  });
}

afterEach(() => {
  for (const root of sandboxes.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('passes when producers and consumers use the canonical artifact paths', () => {
  const root = makeSandbox();
  writeFile(root, '.claude/commands/get-tasks.md', 'Write `tasks/<name>/plan.md` indexing the task files.\n');
  writeFile(root, '.claude/commands/build.md', 'Read the PRD at `docs/prd/<name>.md` and the plan at `tasks/<name>/plan.md`.\n');
  writeFile(root, 'skills/get-tasks/SKILL.md', 'Save to `tasks/<name>/plan.md`.\n');
  writeFile(root, 'docs/commands.md', 'Plans live at `tasks/<name>/plan.md`.\n');
  writeFile(root, 'docs/workflows.md', 'Output: `docs/prd/<name>.md`, `tasks/<name>/plan.md`.\n');

  const result = run(root);

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /5 files checked — 0 error\(s\) — PASSED/);
});

test('accepts a concrete task directory name', () => {
  const root = makeSandbox();
  writeFile(root, '.claude/commands/build.md', 'Read the plan at `tasks/billing/plan.md`.\n');

  const result = run(root);

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /1 files checked — 0 error\(s\) — PASSED/);
});

test('fails when a producer drifts to an unapproved artifact path', () => {
  const root = makeSandbox();
  // The producer moves to the per-feature layout; consumers stay on the canonical path.
  writeFile(root, '.claude/commands/get-tasks.md', 'Save the plan to `docs/features/[feature-name]/plan.md`.\n');
  writeFile(root, '.claude/commands/build.md', 'Require a plan at `tasks/<name>/plan.md`.\n');

  const result = run(root);

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /docs\/features\/\[feature-name\]\/plan\.md/);
  assert.match(result.stdout, /error\(s\) — FAILED/);
});

test('rejects the retired tasks/plan.md and tasks/todo.md layout', () => {
  const root = makeSandbox();
  writeFile(root, '.claude/commands/build.md', 'Require `tasks/plan.md` and `tasks/todo.md`.\n');

  const result = run(root);

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /tasks\/plan\.md/);
  assert.match(result.stdout, /tasks\/todo\.md/);
});

test('rejects the retired SPEC.md root location', () => {
  const root = makeSandbox();
  writeFile(root, '.claude/commands/build.md', 'Look for the spec at `SPEC.md`.\n');

  const result = run(root);

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /SPEC\.md/);
});

test('reports the offending file and line number', () => {
  const root = makeSandbox();
  writeFile(root, 'docs/commands.md', 'Intro line.\nSave the plan to `plan.md` in the root.\n');

  const result = run(root);

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /docs\/commands\.md/);
  assert.match(result.stdout, /L2:/);
});

test('ignores non-artifact markdown references (no false positives)', () => {
  const root = makeSandbox();
  writeFile(
    root,
    'skills/get-tasks/SKILL.md',
    'See `SKILL.md` and `references/testing-patterns.md`. Each task is `tasks/<name>/task-01.md`.\n',
  );

  const result = run(root);

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /1 files checked — 0 error\(s\) — PASSED/);
});

test('skips guarded files that do not exist', () => {
  const root = makeSandbox();
  writeFile(root, '.claude/commands/get-tasks.md', 'Write `tasks/<name>/plan.md`.\n');
  // No other guarded files present.

  const result = run(root);

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /1 files checked — 0 error\(s\) — PASSED/);
});
