import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const registryPath = join(root, 'registry.json');

function gitLastUpdated(pluginId) {
  const result = spawnSync(
    'git',
    ['-c', `safe.directory=${root}`, 'log', '-1', '--format=%cI', '--', pluginId],
    { cwd: root, encoding: 'utf8' }
  );
  if (result.status !== 0) {
    return null;
  }
  const iso = String(result.stdout || '').trim();
  return iso || null;
}

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
let changed = 0;

for (const plugin of registry.plugins || []) {
  const pluginDir = join(root, plugin.id);
  const changelogPath = join(pluginDir, 'CHANGELOG.md');

  const lastUpdated = gitLastUpdated(plugin.id);
  if (lastUpdated && plugin.lastUpdated !== lastUpdated) {
    plugin.lastUpdated = lastUpdated;
    changed += 1;
  }

  if (existsSync(changelogPath)) {
    if (plugin.changelog !== 'CHANGELOG.md') {
      plugin.changelog = 'CHANGELOG.md';
      changed += 1;
    }
  }

  console.log(
    `[enrich] ${plugin.id}: lastUpdated=${plugin.lastUpdated || '—'} changelog=${plugin.changelog || '—'}`
  );
}

writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`[enrich] Updated ${registryPath} (${changed} field change(s))`);
