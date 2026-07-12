import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const registryPath = join(root, 'registry.json');

spawnSync(process.execPath, [join(__dirname, 'sync-sheet-css.mjs')], { stdio: 'inherit' });

function isTextAsset(name) {
  return /\.(json|js|css|md|txt|html|yml|yaml)$/i.test(name);
}

function sha256File(filePath, name) {
  const raw = readFileSync(filePath);
  if (!isTextAsset(name)) {
    return createHash('sha256').update(raw).digest('hex');
  }
  const normalized = raw.toString('utf8').replace(/\r\n/g, '\n');
  return createHash('sha256').update(Buffer.from(normalized, 'utf8')).digest('hex');
}

function listPluginFiles(pluginDir, manifest) {
  const names = new Set(['manifest.json']);
  const entry = (manifest.entry || 'index.js').replace(/^[/\\]+/, '');
  names.add(entry);
  for (const rel of manifest.styles || []) {
    if (typeof rel === 'string' && rel.trim()) {
      names.add(rel.replace(/^[/\\]+/, ''));
    }
  }
  for (const rel of manifest.data || []) {
    if (typeof rel === 'string' && rel.trim()) {
      names.add(rel.replace(/^[/\\]+/, ''));
    }
  }
  const hashes = {};
  for (const name of names) {
    const filePath = join(pluginDir, name);
    if (!existsSync(filePath)) {
      throw new Error(`Missing file for hash: ${pluginDir}/${name}`);
    }
    hashes[name] = sha256File(filePath, name);
  }
  return hashes;
}

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
let versionMismatch = false;

for (const plugin of registry.plugins) {
  const pluginDir = join(root, plugin.id);
  const manifestPath = join(pluginDir, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  if (plugin.version !== manifest.version) {
    console.warn(`[registry] version drift ${plugin.id}: registry=${plugin.version} manifest=${manifest.version} → syncing to manifest`);
    plugin.version = manifest.version;
    versionMismatch = true;
  }

  plugin.sha256 = listPluginFiles(pluginDir, manifest);
  console.log(`[sha256] ${plugin.id}@${manifest.version}: ${Object.keys(plugin.sha256).length} files`);
}

if (versionMismatch) {
  const parts = registry.version.split('.').map(Number);
  parts[2] += 1;
  registry.version = parts.join('.');
  console.log(`[registry] bumped registry version → ${registry.version}`);
}

writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log('[sha256] Updated', registryPath);

const pagesRegistryPath = join(root, 'docs', 'registry.json');
writeFileSync(pagesRegistryPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log('[sha256] Copied to', pagesRegistryPath);
