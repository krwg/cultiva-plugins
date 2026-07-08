import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const registryPath = join(root, 'registry.json');

spawnSync(process.execPath, [join(__dirname, 'sync-sheet-css.mjs')], { stdio: 'inherit' });

const registryBefore = readFileSync(registryPath, 'utf8');
spawnSync(process.execPath, [join(__dirname, 'compute-registry-sha256.mjs')], { stdio: 'inherit' });
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

let failed = false;

for (const plugin of registry.plugins) {
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
}

if (failed) {
  process.exit(1);
}

console.log(`[validate] registry ${registry.version} OK (${registry.plugins.length} plugins)`);
