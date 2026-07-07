import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const registryPath = join(root, 'registry.json');

function sha256File(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
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
    hashes[name] = sha256File(filePath);
  }
  return hashes;
}

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
for (const plugin of registry.plugins) {
  const pluginDir = join(root, plugin.id);
  const manifest = JSON.parse(readFileSync(join(pluginDir, 'manifest.json'), 'utf8'));
  plugin.sha256 = listPluginFiles(pluginDir, manifest);
  console.log(`[sha256] ${plugin.id}: ${Object.keys(plugin.sha256).length} files`);
}

writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log('[sha256] Updated', registryPath);
