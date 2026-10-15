#!/usr/bin/env node
/** Compare emitted CSS against a Git revision, including responsive and state rules. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const sass = require('sass');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const root = path.resolve(__dirname, '..');
const revision = process.argv[2];
if (!revision) {
  console.error('Usage: npm run check-style-parity -- <baseline-git-revision>');
  process.exit(1);
}
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' });
const normalizeValue = value => value.replace(/(^|[^\d])0\.(\d)/g, '$1.$2');

function normalize(css) {
  const tree = postcss.parse(css);
  tree.walkComments(node => node.remove());
  function visit(node) {
    if (node.type === 'decl') return [node.prop, normalizeValue(node.value), Boolean(node.important)];
    let children = node.nodes?.map(visit);
    if (node.type === 'rule') {
      // Utility expansion may reorder independent properties. Preserve order within
      // shorthand families, where e.g. margin followed by margin-top is significant.
      const family = property => {
        if (/^(font($|-)|line-height$)/.test(property)) return 'font';
        if (/^(top|right|bottom|left|inset($|-))/.test(property)) return 'inset';
        if (/^(gap|row-gap|column-gap)$/.test(property)) return 'gap';
        return property.split('-')[0];
      };
      const families = new Map();
      children.forEach(declaration => {
        const key = family(declaration[0]);
        if (!families.has(key)) families.set(key, []);
        families.get(key).push(declaration);
      });
      for (const [key, declarations] of families) {
        const properties = declarations.map(declaration => declaration[0]);
        const overlaps = key === 'border' || properties.some((a, i) => properties.some((b, j) =>
          i !== j && (a === b || a.startsWith(b + '-') || b.startsWith(a + '-') ||
            (key === 'font' && (a === 'font' || b === 'font')) ||
            ((key === 'gap' || key === 'inset') && (a === key || b === key)))
        ));
        if (!overlaps) declarations.sort((a, b) => a[0].localeCompare(b[0]));
      }
      children = [...families].sort(([a], [b]) => a.localeCompare(b));
    }
    return [node.type, node.selector || node.name, node.params, children];
  }
  return tree.nodes.map(visit);
}

async function compile(file, config, isSass) {
  const css = isSass ? sass.compile(file, { logger: sass.Logger.silent }).css : fs.readFileSync(file, 'utf8');
  const result = await postcss([
    tailwind({ ...config, content: [{ raw: 'block', extension: 'html' }] }),
    autoprefixer(),
  ]).process(css, { from: file });
  return normalize(result.css);
}

async function main() {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-style-parity-'));
  try {
    const files = git('ls-tree', '-r', '--name-only', revision, 'src').trim().split('\n').filter(file => /\.(scss|css)$/.test(file));
    for (const file of [...files, 'tailwind.config.js']) {
      const target = path.join(temporary, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, git('show', revision + ':' + file));
    }
    const baselineConfig = require(path.join(temporary, 'tailwind.config.js'));
    const currentConfig = require(path.join(root, 'tailwind.config.js'));
    let checked = 0;
    for (const oldFile of files) {
      const currentFile = oldFile.replace(/\.scss$/, '.css');
      if (!fs.existsSync(path.join(root, currentFile))) {
        // These three legacy imports are now inlined in the global entry point.
        assert.ok(/^src\/assets\/css\/(main|index|nirmalhk7)\.scss$/.test(oldFile), 'Unexpected missing stylesheet: ' + oldFile);
        continue;
      }
      const expected = await compile(path.join(temporary, oldFile), baselineConfig, oldFile.endsWith('.scss'));
      const actual = await compile(path.join(root, currentFile), currentConfig, false);
      assert.deepStrictEqual(actual, expected, 'CSS changed: ' + currentFile);
      console.log('PASS ' + currentFile);
      checked++;
    }
    assert.ok(checked > 0, 'No stylesheets compared');
    console.log(checked + ' stylesheets preserve selectors, conditions, values, importance, and shorthand order.');
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
