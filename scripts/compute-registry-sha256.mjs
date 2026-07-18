import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join, resolve, sep, isAbsolute } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const registryPath = join(root, 'registry.json');

spawnSync(process.execPath, [join(__dirname, 'sync-sheet-css.mjs')], { stdio: 'inherit' });
spawnSync(process.execPath, [join(__dirname, 'enrich-registry-meta.mjs')], { stdio: 'inherit' });

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

/** Reject absolute paths and `..` segments so hashes never follow traversal. */
function assertSafeRelPath(rel) {
  const name = String(rel || '').replace(/^[/\\]+/, '');
  if (!name) {
    throw new Error('Empty relative path in manifest');
  }
  if (isAbsolute(name) || /^[A-Za-z]:[\\/]/.test(name) || name.includes('..')) {
    throw new Error(`Unsafe relative path rejected: ${rel}`);
  }
  if (name.split(/[/\\]/).some((seg) => seg === '..')) {
    throw new Error(`Unsafe relative path rejected: ${rel}`);
  }
  return name;
}

function resolveInsidePlugin(pluginDir, name) {
  const safe = assertSafeRelPath(name);
  const full = resolve(pluginDir, safe);
  const rootDir = resolve(pluginDir);
  if (full !== rootDir && !full.startsWith(rootDir + sep)) {
    throw new Error(`Path escapes plugin directory: ${name}`);
  }
  return { name: safe, filePath: full };
}

function listPluginFiles(pluginDir, manifest) {
  const names = new Set(['manifest.json']);
  const entry = assertSafeRelPath(manifest.entry || 'index.js');
  names.add(entry);
  for (const rel of manifest.styles || []) {
    if (typeof rel === 'string' && rel.trim()) {
      names.add(assertSafeRelPath(rel));
    }
  }
  for (const rel of manifest.data || []) {
    if (typeof rel === 'string' && rel.trim()) {
      names.add(assertSafeRelPath(rel));
    }
  }
  const hashes = {};
  for (const name of names) {
    const { name: safeName, filePath } = resolveInsidePlugin(pluginDir, name);
    if (!existsSync(filePath)) {
      throw new Error(`Missing file for hash: ${pluginDir}/${safeName}`);
    }
    hashes[safeName] = sha256File(filePath, safeName);
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
