import { copyFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const source = join(root, 'shared', 'cultiva-sheet-base.css');
const targets = ['weather', 'time', 'radio', 'pomodoro'];

for (const id of targets) {
  const dest = join(root, id, 'cultiva-sheet-base.css');
  copyFileSync(source, dest);
  console.log(`[sync-sheet-css] ${id}/cultiva-sheet-base.css`);
}
