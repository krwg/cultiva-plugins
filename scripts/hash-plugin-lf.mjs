import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

/** Hash plugin files as GitHub raw serves them (LF). Usage: node scripts/hash-plugin-lf.mjs radio */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const id = process.argv[2];
if (!id) {
  console.error('Usage: node scripts/hash-plugin-lf.mjs <pluginId>');
  process.exit(1);
}
const dir = resolve(root, id);
const names = ['manifest.json', 'index.js', 'styles.css', 'cultiva-sheet-base.css', 'cities-ru.json'];
for (const name of names) {
  const p = resolve(dir, name);
  if (!existsSync(p)) continue;
  let buf = readFileSync(p);
  if (!name.endsWith('.json') && !name.endsWith('.js') && !name.endsWith('.css') && !name.endsWith('.md')) {
    // binary-ish: hash as-is
  } else {
    const text = buf.toString('utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    buf = Buffer.from(text, 'utf8');
    writeFileSync(p, text, 'utf8');
  }
  console.log(`${name}: ${createHash('sha256').update(buf).digest('hex')}`);
}
