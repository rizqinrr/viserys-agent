#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PERSONAS = ['artisan', 'chronicler', 'kingsguard', 'maester', 'prover', 'racer', 'strategist'];
const LEGACY_NAMES = ['code-reviewer', 'security-auditor', 'test-engineer', 'web-performance-auditor'];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function fail(message) {
  console.log(`  ✗  ${message}`);
  return 1;
}

function main() {
  let errors = 0;

  console.log('Checking persona files...');
  const agentDir = path.join(ROOT, 'agents');
  const files = fs.readdirSync(agentDir).filter(file => file.endsWith('.md')).sort();
  const expectedFiles = PERSONAS.map(name => `${name}.md`);

  if (JSON.stringify(files) !== JSON.stringify(expectedFiles)) {
    errors += fail(`expected ${expectedFiles.join(', ')}; found ${files.join(', ')}`);
  } else {
    console.log(`  ✓  ${PERSONAS.length} canonical persona files`);
  }

  for (const name of PERSONAS) {
    const content = read(`agents/${name}.md`);
    const frontmatter = content.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
    if (!frontmatter) {
      errors += fail(`agents/${name}.md — missing or malformed YAML frontmatter`);
      continue;
    }
    const nameMatch = frontmatter[1].match(/^name:\s*(.+)$/m);
    const descriptionMatch = frontmatter[1].match(/^description:\s*(.+)$/m);
    if (!nameMatch || nameMatch[1].trim() !== name) {
      errors += fail(`agents/${name}.md — frontmatter name must match filename`);
    }
    if (!descriptionMatch || descriptionMatch[1].trim().length === 0) {
      errors += fail(`agents/${name}.md — missing frontmatter description`);
    }
  }

  console.log('\nChecking orchestration contracts...');
  const shipFiles = ['.claude/commands/ship.md', '.gemini/commands/ship.toml', 'commands/ship.toml'];
  for (const relativePath of shipFiles) {
    const content = read(relativePath);
    for (const name of ['maester', 'kingsguard', 'prover', 'chronicler', 'artisan']) {
      if (!content.includes(name)) errors += fail(`${relativePath} — missing ${name}`);
    }
    if (!/(spawn|call|run)[\s\S]{0,500}(maester|four core)/i.test(content)) {
      errors += fail(`${relativePath} — missing explicit core persona dispatch`);
    }
    if (!/artisan[\s\S]{0,240}(when|conditional|hanya)/i.test(content) && !/(when|conditional|hanya)[\s\S]{0,240}artisan/i.test(content)) {
      errors += fail(`${relativePath} — artisan must be conditional`);
    }
    if (/skip[\s\S]{0,120}(fan-out|core persona)/i.test(content)) {
      errors += fail(`${relativePath} — core fan-out cannot be skipped`);
    }
  }

  const claudeShip = read('.claude/commands/ship.md');
  for (const name of ['maester', 'kingsguard', 'prover', 'chronicler', 'artisan']) {
    if (!claudeShip.includes(`viserys:${name}`)) {
      errors += fail(`.claude/commands/ship.md — missing plugin-scoped viserys:${name}`);
    }
  }

  const claudePlanning = read('.claude/commands/plan.md');
  if (!claudePlanning.includes('viserys:strategist')) {
    errors += fail('.claude/commands/plan.md — must use plugin-scoped viserys:strategist');
  }
  const claudeWebperf = read('.claude/commands/webperf.md');
  if (!claudeWebperf.includes('viserys:racer')) {
    errors += fail('.claude/commands/webperf.md — must use plugin-scoped viserys:racer');
  }

  const reviewFiles = ['.claude/commands/review.md', '.gemini/commands/review.toml', 'commands/review.toml'];
  for (const relativePath of reviewFiles) {
    const content = read(relativePath);
    if (!/(spawn|call|invoke)[\s\S]{0,160}`?(?:viserys:)?maester`?/i.test(content) || /(do not|don't|never)[\s\S]{0,40}(spawn|call|invoke)[\s\S]{0,40}`?(?:viserys:)?maester`?/i.test(content)) {
      errors += fail(`${relativePath} — missing explicit maester dispatch`);
    }
    if (relativePath === '.claude/commands/review.md' && !content.includes('viserys:maester')) {
      errors += fail(`${relativePath} — must use plugin-scoped viserys:maester`);
    }
    if (!content.includes('code-review-and-quality')) {
      errors += fail(`${relativePath} — missing code-review-and-quality skill`);
    }
    for (const phrase of ['staged', 'unstaged', 'untracked']) {
      if (!content.includes(phrase)) errors += fail(`${relativePath} — missing ${phrase} review coverage`);
    }
    for (const severity of ['Critical', 'Required', 'Optional', 'Nit']) {
      if (!content.includes(severity)) errors += fail(`${relativePath} — missing ${severity} severity`);
    }
    if (/Categorize findings as Critical, Important, or Suggestion/i.test(content)) {
      errors += fail(`${relativePath} — uses legacy review severity taxonomy`);
    }
  }

  const planningFiles = ['.claude/commands/plan.md', '.gemini/commands/planning.toml', 'commands/planning.toml'];
  for (const relativePath of planningFiles) {
    const content = read(relativePath);
    if (!/(spawn|call)[\s\S]{0,120}`?(?:viserys:)?strategist`?/i.test(content) || /(do not|don't|never)[\s\S]{0,40}(spawn|call)[\s\S]{0,40}`?(?:viserys:)?strategist`?/i.test(content)) {
      errors += fail(`${relativePath} — missing explicit strategist dispatch`);
    }
  }

  const webperfFiles = ['.claude/commands/webperf.md', '.gemini/commands/webperf.toml', 'commands/webperf.toml'];
  for (const relativePath of webperfFiles) {
    const content = read(relativePath);
    if (!/(spawn|call|act as)[\s\S]{0,160}`?(?:viserys:)?racer`?/i.test(content) || /(do not|don't|never)[\s\S]{0,40}(spawn|call|act as)[\s\S]{0,40}`?(?:viserys:)?racer`?/i.test(content)) {
      errors += fail(`${relativePath} — missing explicit racer dispatch`);
    }
  }

  console.log('\nChecking legacy identifiers and OpenCode boundary...');
  const scanRoots = [
    'agents',
    'commands',
    'docs',
    'references',
    'skills',
    '.claude/commands',
    '.gemini/commands',
    '.opencode/agents',
    '.opencode/command',
  ];
  const rootFiles = ['AGENTS.md', 'README.md', 'CONTRIBUTING.md', 'plugin.json'];
  const textFiles = rootFiles
    .map(relativePath => path.join(ROOT, relativePath))
    .filter(fs.existsSync);
  const walk = directory => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (/\.(md|toml|json|js)$/.test(entry.name)) textFiles.push(fullPath);
    }
  };
  for (const relativePath of scanRoots) walk(path.join(ROOT, relativePath));

  for (const fullPath of textFiles) {
    const content = fs.readFileSync(fullPath, 'utf8');
    for (const legacyName of LEGACY_NAMES) {
      if (content.includes(legacyName)) {
        errors += fail(`${path.relative(ROOT, fullPath)} — legacy identifier ${legacyName}`);
      }
    }
  }

  const openCodeAgentDir = path.join(ROOT, '.opencode', 'agents');
  const openCodeAgents = fs.existsSync(openCodeAgentDir)
    ? fs.readdirSync(openCodeAgentDir).filter(file => file.endsWith('.md')).sort()
    : [];
  if (JSON.stringify(openCodeAgents) !== JSON.stringify(['viserys.md'])) {
    errors += fail(`.opencode/agents — expected only viserys.md; found ${openCodeAgents.join(', ')}`);
  } else {
    console.log('  ✓  no OpenCode persona adapters added');
  }

  const status = errors === 0 ? 'PASSED' : 'FAILED';
  console.log(`\n${errors} error(s) — ${status}`);
  if (errors > 0) process.exit(1);
}

main();
