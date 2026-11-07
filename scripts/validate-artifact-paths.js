#!/usr/bin/env node
/**
 * validate-artifact-paths.js
 *
 * Guards the PRD -> tasks -> build pipeline against silent artifact-path drift.
 *
 * `/get-tasks` (producer) writes one task file per task plus a plan document
 * under `tasks/<name>/`. `/build` (consumer) reads those artifacts back. When
 * the producer moves an artifact without updating the consumers, the pipeline
 * breaks, and nothing else in CI catches it (command parity only compares
 * descriptions).
 *
 * This validator enforces one canonical artifact path across every file in the
 * pipeline: `tasks/<name>/plan.md`, where `<name>` is the task directory. A
 * concrete name such as `tasks/billing/plan.md` is equally valid. Changing the
 * convention means updating ARTIFACT_PATTERNS *and* every guarded file in the
 * same change; CI fails until they agree.
 *
 * Scope is deliberately narrow: only the plan artifact, only the files that
 * define the pipeline. It is not a general markdown path linter.
 *
 * Exit codes: 0 = all clear, 1 = one or more drifted paths.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Literal artifact paths accepted without pattern matching.
const ARTIFACT_ALLOWLIST = new Set([]);

// Path shapes the pipeline may reference. `<name>` is a placeholder for the
// task directory; a concrete directory name is accepted too.
const ARTIFACT_PATTERNS = [
  /^tasks\/(?:<[^>/]+>|[A-Za-z0-9._-]+)\/plan\.md$/i,
];

// The files that make up the PRD -> tasks -> build pipeline. Absent files are
// skipped, not failed: this validator checks path consistency, not presence.
const GUARDED_FILES = [
  '.claude/commands/get-tasks.md',
  '.claude/commands/build.md',
  'skills/get-tasks/SKILL.md',
  'docs/commands.md',
  'docs/workflows.md',
];

// Matches a path-like token ending in a spec/plan/todo artifact filename,
// including directory prefixes with bracket or angle-bracket placeholders like
// tasks/<name>/plan.md. Case-insensitive so SPEC.md and a drifted spec.md are
// both caught, then compared against the allowlist and patterns.
const ARTIFACT_RE = /(?:spec\/(?:[A-Za-z0-9._<>[\]-]+\/)*[A-Za-z0-9._<>[\]-]+\.md|(?:[A-Za-z0-9._<>[\]-]+\/)*(?:spec|plan|todo)\.md)/gi;

function findViolations(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return null; // skipped

  const violations = [];
  const lines = fs.readFileSync(abs, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const matches = line.match(ARTIFACT_RE);
    if (!matches) return;
    for (const match of matches) {
      const approved = ARTIFACT_ALLOWLIST.has(match)
        || ARTIFACT_PATTERNS.some(pattern => pattern.test(match));
      if (!approved) violations.push({ line: i + 1, match });
    }
  });
  return violations;
}

function main() {
  console.log('Checking spec/plan/todo artifact paths...\n');

  let checked = 0;
  let errors = 0;

  for (const relPath of GUARDED_FILES) {
    const violations = findViolations(relPath);
    if (violations === null) continue; // file not present, skip
    checked++;

    if (violations.length === 0) {
      console.log(`  ✓  ${relPath}`);
    } else {
      console.log(`  ✗  ${relPath}`);
      for (const { line, match } of violations) {
        console.log(`       L${line}: ${match} — not an approved spec/plan/todo artifact path`);
        errors++;
      }
    }
  }

  const status = errors > 0 ? 'FAILED' : 'PASSED';
  console.log(`\n${checked} files checked — ${errors} error(s) — ${status}`);

  if (errors > 0) {
    console.log('\nThe PRD -> tasks -> build pipeline expects one set of artifact paths.');
    console.log('Either use a path from ARTIFACT_PATTERNS, or change the convention');
    console.log('across every guarded file and update the patterns in the same change.');
    process.exit(1);
  }
}

main();
