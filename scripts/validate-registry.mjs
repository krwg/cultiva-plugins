import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const registryPath = join(root, 'registry.json');

const BASE_URL_PREFIX = 'https://raw.githubusercontent.com/krwg/cultiva-plugins/main/';

spawnSync(process.execPath, [join(__dirname, 'sync-sheet-css.mjs')], { stdio: 'inherit' });

const registryBefore = JSON.parse(readFileSync(registryPath, 'utf8'));

const computeResult = spawnSync(process.execPath, [join(__dirname, 'compute-registry-sha256.mjs')], { stdio: 'inherit' });
if (computeResult.status !== 0) {
  process.exit(computeResult.status || 1);
}

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

function sha256MapEqual(a, b) {
  const left = a && typeof a === 'object' ? a : {};
  const right = b && typeof b === 'object' ? b : {};
  const keysA = Object.keys(left).sort();
  const keysB = Object.keys(right).sort();
  if (keysA.length !== keysB.length) {
    return false;
  }
  return keysA.every((k, i) => keysB[i] === k && left[k] === right[k]);
}

function collectSha256Maps(reg) {
  const maps = {};
  for (const plugin of reg.plugins || []) {
    maps[plugin.id] = plugin.sha256 || {};
  }
  return maps;
}

let failed = false;

const beforeMaps = collectSha256Maps(registryBefore);
const afterMaps = collectSha256Maps(registry);
const allIds = new Set([...Object.keys(beforeMaps), ...Object.keys(afterMaps)]);
const stale = [];
for (const id of allIds) {
  if (!sha256MapEqual(beforeMaps[id], afterMaps[id])) {
    stale.push(id);
  }
}
if (stale.length > 0) {
  console.error(
    `[validate] stale registry sha256 for: ${stale.join(', ')} — ` +
      'recompute was applied to the working tree; commit the updated registry.json (and docs/registry.json) before merge'
  );
  failed = true;
}
if (registryBefore.version !== registry.version) {
  console.error(
    `[validate] registry version changed by compute: committed=${registryBefore.version} computed=${registry.version} — commit the updated registry.json`
  );
  failed = true;
}

for (const plugin of registry.plugins) {
  const expectedBase = `${BASE_URL_PREFIX}${plugin.id}`;
  const baseUrl = typeof plugin.baseUrl === 'string' ? plugin.baseUrl : '';
  const baseOk = baseUrl === expectedBase
    || (baseUrl.startsWith(`${expectedBase}/`)
      && !baseUrl.slice(expectedBase.length).includes('..')
      && !baseUrl.includes('\\'));
  if (!baseOk) {
    console.error(
      `[validate] bad baseUrl for ${plugin.id}: got ${JSON.stringify(plugin.baseUrl)}, ` +
        `expected ${JSON.stringify(expectedBase)} (or a path under that prefix)`
    );
    failed = true;
  }

  const manifestPath = join(root, plugin.id, 'manifest.json');
  if (!existsSync(manifestPath)) {
    console.error(`[validate] missing manifest for ${plugin.id}`);
    failed = true;
    continue;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (plugin.version !== manifest.version) {
    console.error(`[validate] version mismatch ${plugin.id}: registry=${plugin.version} manifest=${manifest.version}`);
    failed = true;
  }
  for (const style of manifest.styles || []) {
    const cssPath = join(root, plugin.id, style);
    if (!existsSync(cssPath)) {
      console.error(`[validate] missing style ${plugin.id}/${style}`);
      failed = true;
    }
  }
  if (!Array.isArray(manifest.permissions) || manifest.permissions.length === 0) {
    console.error(`[validate] ${plugin.id} manifest.permissions must be a non-empty array`);
    failed = true;
  }
  if (manifest.surfaces !== undefined) {
    if (!Array.isArray(manifest.surfaces) || manifest.surfaces.length === 0) {
      console.error(`[validate] ${plugin.id} manifest.surfaces must be a non-empty array when set`);
      failed = true;
    }
  }
  if (plugin.i18n) {
    for (const locale of ['en', 'ru']) {
      const block = plugin.i18n[locale];
      if (!block || typeof block.name !== 'string' || typeof block.description !== 'string') {
        console.error(`[validate] ${plugin.id} registry i18n.${locale} requires name and description`);
        failed = true;
      }
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log(`[validate] registry ${registry.version} OK (${registry.plugins.length} plugins)`);
