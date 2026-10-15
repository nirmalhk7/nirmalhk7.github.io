#!/usr/bin/env node
/** Enforce the migration's actual goal: fewer handwritten stylesheet lines. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const revision = process.argv[2] || '2621bf2ebe81889b055442606c66fd918d2599f8';
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' });
const baselineFiles = git('ls-tree', '-r', '--name-only', revision, 'src').trim().split('\n').filter(file => /\.(css|scss)$/.test(file));
const countLines = text => text.trimEnd().split('\n').length;
function stylesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? stylesIn(file) : /\.(css|scss)$/.test(file) ? [file] : [];
  });
}
const currentFiles = stylesIn(path.join(root, 'src'));
const baselineLines = baselineFiles.reduce((sum, file) => sum + countLines(git('show', revision + ':' + file)), 0);
const currentLines = currentFiles.reduce((sum, file) => sum + countLines(fs.readFileSync(file, 'utf8')), 0);
const reduction = (1 - currentLines / baselineLines) * 100;
console.log(JSON.stringify({ baselineFiles: baselineFiles.length, baselineLines, currentFiles: currentFiles.length, currentLines, reductionPercent: Number(reduction.toFixed(1)) }, null, 2));
assert.ok(currentLines <= Math.floor(baselineLines / 2), 'Custom CSS must remain at least 50% below the pre-migration line count');
console.log('PASS: most custom stylesheet lines removed through Tailwind component classes.');
