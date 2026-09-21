#!/usr/bin/env node

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { afterEach, test } = require('node:test');

const VALIDATOR = path.join(__dirname, 'validate-personas.js');
const PERSONAS = ['artisan', 'chronicler', 'kingsguard', 'maester', 'prover', 'racer', 'strategist'];
const sandboxes = [];

function write(root, relativePath, content) {
  const file = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function makeSandbox() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'viserys-validate-personas-test-'));
  write(root, 'scripts/validate-personas.js', fs.readFileSync(VALIDATOR, 'utf8'));
  for (const name of PERSONAS) write(root, `agents/${name}.md`, `---\nname: ${name}\ndescription: ${name} persona\n---\n`);
  write(root, '.opencode/agents/viserys.md', '---\nmode: primary\n---\n');
  for (const file of ['.claude/commands/ship.md', '.gemini/commands/ship.toml', 'commands/ship.toml']) {
    const content = file.startsWith('.claude/')
      ? 'run four core viserys:maester viserys:kingsguard viserys:prover viserys:chronicler; viserys:artisan when UI changes\n'
      : 'run four core maester kingsguard prover chronicler; artisan when UI changes\n';
    write(root, file, content);
  }
  write(root, '.claude/commands/plan.md', 'spawn viserys:strategist\n');
  write(root, '.claude/commands/webperf.md', 'spawn viserys:racer\n');
  write(root, '.claude/commands/review.md', 'invoke code-review-and-quality and spawn viserys:maester; inspect staged unstaged untracked changes; Critical Required Optional Nit\n');
  for (const file of ['.gemini/commands/review.toml', 'commands/review.toml']) {
    write(root, file, 'invoke code-review-and-quality and spawn maester; inspect staged unstaged untracked changes; Critical Required Optional Nit\n');
  }
  for (const file of ['.gemini/commands/planning.toml', 'commands/planning.toml']) {
    write(root, file, 'spawn strategist\n');
  }
  for (const file of ['.gemini/commands/webperf.toml', 'commands/webperf.toml']) {
    write(root, file, 'call racer\n');
  }
  sandboxes.push(root);
  return root;
}

function run(root) {
  return spawnSync(process.execPath, [path.join(root, 'scripts', 'validate-personas.js')], {
    cwd: root,
    encoding: 'utf8',
  });
}

afterEach(() => {
  for (const root of sandboxes.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

test('passes the canonical persona and orchestration contract', () => {
  const root = makeSandbox();
  const result = run(root);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /0 error\(s\) — PASSED/);
});

test('fails when a legacy persona identifier remains', () => {
  const root = makeSandbox();
  write(root, 'docs/example.md', 'Use the code-reviewer persona.\n');
  const result = run(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /legacy identifier code-reviewer/);
});

test('fails when a ship adapter omits a required persona', () => {
  const root = makeSandbox();
  write(root, 'commands/ship.toml', 'maester kingsguard prover artisan when UI changes\n');
  const result = run(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /commands[\\/]ship\.toml — missing chronicler/);
});

test('fails when review names maester without dispatching it', () => {
  const root = makeSandbox();
  write(root, 'commands/review.toml', 'do not spawn maester; code-review-and-quality staged unstaged untracked Critical Required Optional Nit\n');
  const result = run(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /commands[\\/]review\.toml — missing explicit maester dispatch/);
});

test('fails when review uses the legacy severity taxonomy', () => {
  const root = makeSandbox();
  write(root, 'commands/review.toml', 'invoke code-review-and-quality and spawn maester; staged unstaged untracked Critical Important Suggestion\n');
  const result = run(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /commands[\\/]review\.toml — missing Required severity/);
});

test('fails when persona frontmatter is missing or incomplete', () => {
  const root = makeSandbox();
  write(root, 'agents/maester.md', '# Maester\n');
  const result = run(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /agents[\\/]maester\.md — missing or malformed YAML frontmatter/);
});

test('fails when persona description is missing', () => {
  const root = makeSandbox();
  write(root, 'agents/maester.md', '---\nname: maester\n---\n');
  const result = run(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /agents[\\/]maester\.md — missing frontmatter description/);
});

test('fails when planning names strategist without dispatching it', () => {
  const root = makeSandbox();
  write(root, 'commands/planning.toml', 'do not spawn strategist\n');
  const result = run(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /commands[\\/]planning\.toml — missing explicit strategist dispatch/);
});

test('fails when webperf names racer without dispatching it', () => {
  const root = makeSandbox();
  write(root, 'commands/webperf.toml', 'do not spawn racer\n');
  const result = run(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /commands[\\/]webperf\.toml — missing explicit racer dispatch/);
});

test('fails when ship allows the core fan-out to be skipped', () => {
  const root = makeSandbox();
  write(root, 'commands/ship.toml', 'run four core maester kingsguard prover chronicler; artisan when UI changes; skip fan-out for small changes\n');
  const result = run(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /commands[\\/]ship\.toml — core fan-out cannot be skipped/);
});

test('fails when an OpenCode persona adapter is added', () => {
  const root = makeSandbox();
  write(root, '.opencode/agents/maester.md', '---\nmode: subagent\n---\n');
  const result = run(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /expected only viserys\.md/);
});
