import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOTS = ['public', 'src'];
const EXTS = new Set(['.html', '.htm', '.js', '.jsx', '.ts', '.tsx']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (EXTS.has(extname(name))) out.push(p);
  }
  return out;
}

const files = ROOTS.flatMap((r) => {
  try { return walk(r); } catch { return []; }
});

// Match <a ...>...EdVisorly...</a> across JS template literals and HTML.
// Captures the attributes substring of the opening <a> tag.
const ANCHOR_RE = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;

const offenders = [];
const checked = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  if (!/edvisorly/i.test(src)) continue;

  let m;
  ANCHOR_RE.lastIndex = 0;
  while ((m = ANCHOR_RE.exec(src)) !== null) {
    const [full, attrs, inner] = m;
    if (!/edvisorly/i.test(inner)) continue;

    const hasBlank = /\btarget\s*=\s*["']_blank["']/i.test(attrs);
    const relMatch = attrs.match(/\brel\s*=\s*["']([^"']+)["']/i);
    const relVal = relMatch ? relMatch[1].toLowerCase() : '';
    const hasNoopener = /\bnoopener\b/.test(relVal);
    const hasNoreferrer = /\bnoreferrer\b/.test(relVal);

    checked.push({ file, snippet: full.slice(0, 120) });

    if (!hasBlank || !hasNoopener || !hasNoreferrer) {
      offenders.push({
        file,
        snippet: full.slice(0, 200),
        hasBlank,
        hasNoopener,
        hasNoreferrer,
      });
    }
  }
}

test('every EdVisorly anchor opens in a new tab with rel="noopener noreferrer"', () => {
  assert.ok(checked.length > 0, 'expected to find at least one EdVisorly anchor across the project');
  assert.deepEqual(
    offenders,
    [],
    `EdVisorly anchors missing target=_blank or rel=noopener noreferrer:\n` +
      offenders.map((o) => `- ${o.file}\n  ${o.snippet}`).join('\n'),
  );
});

test('no plain-text "EdVisorly" mention sits outside an anchor in user-facing HTML/JS templates', () => {
  // Soft guard: any HTML file containing the word EdVisorly must wrap it in an <a>.
  const htmlOffenders = [];
  for (const file of files.filter((f) => f.endsWith('.html'))) {
    const src = readFileSync(file, 'utf8');
    if (!/edvisorly/i.test(src)) continue;
    // strip anchors, then look for residual mentions
    const stripped = src.replace(ANCHOR_RE, (full, _a, inner) =>
      /edvisorly/i.test(inner) ? '' : full,
    );
    if (/edvisorly/i.test(stripped)) {
      htmlOffenders.push(file);
    }
  }
  assert.deepEqual(
    htmlOffenders,
    [],
    `HTML files mention "EdVisorly" outside of an <a> tag: ${htmlOffenders.join(', ')}`,
  );
});
