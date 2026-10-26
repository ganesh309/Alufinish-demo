#!/usr/bin/env node
/**
 * Tiny static-site builder.
 *   node build.js
 * Reads src/layout.html + src/pages/*.html and writes the finished pages
 * into the project root. Each page starts with an HTML comment holding its
 * metadata (title, description, nav, page).
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const src = path.join(root, 'src');
const layout = fs.readFileSync(path.join(src, 'layout.html'), 'utf8');
const pagesDir = path.join(src, 'pages');

const parseMeta = (block) => {
  const meta = {};
  block.trim().split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return meta;
};

let count = 0;
for (const file of fs.readdirSync(pagesDir)) {
  if (!file.endsWith('.html')) continue;
  let body = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const m = body.match(/^\s*<!--([\s\S]*?)-->/);
  const meta = m ? parseMeta(m[1]) : {};
  if (m) body = body.slice(m[0].length);

  const page = meta.page || file.replace(/\.html$/, '');
  let html = layout
    .replace(/\{\{title\}\}/g, () => meta.title || 'Italtecno India')
    .replace(/\{\{description\}\}/g, () => meta.description || '')
    .replace(/\{\{page\}\}/g, () => page)
    .replace('{{content}}', () => body.trim());

  if (meta.nav) {
    html = html.replace(
      new RegExp(`data-nav="${meta.nav}"`, 'g'),
      `data-nav="${meta.nav}" data-active="true"`
    );
  }

  fs.writeFileSync(path.join(root, file), html);
  count += 1;
  console.log('built', file);
}
console.log(`${count} page(s) written to ${root}`);
