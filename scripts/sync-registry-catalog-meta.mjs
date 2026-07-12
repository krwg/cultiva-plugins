import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'registry.json');

const META = {
  weather: {
    minAppVersion: '1.7.0',
    storeFlow: 'direct',
    en: 'Live weather in the header and garden. Hybrid city search across 1100+ Russian cities and worldwide Open-Meteo — know conditions before you step outside.',
    ru: 'Погода в шапке и в саду. Гибридный поиск: 1100+ городов РФ и Open-Meteo по миру — узнайте условия перед выходом.'
  },
  time: {
    minAppVersion: '1.1.0',
    storeFlow: 'direct',
    en: 'A calm always-on clock in the header with world time zones and a polished sheet — perfect for remote work without leaving your garden.',
    ru: 'Живые часы в шапке с часовыми поясами и аккуратным sheet — удобно для удалёнки, не отрываясь от сада.'
  },
  radio: {
    minAppVersion: '1.1.0',
    storeFlow: 'direct',
    en: 'Curated SomaFM streams in the header with volume, sleep timer, and glass UI — focus music while habits stay one click away.',
    ru: 'Потоки SomaFM в шапке: громкость, таймер сна, стеклянный UI — музыка для фокуса рядом с привычками.'
  },
  pomodoro: {
    minAppVersion: '1.1.0',
    storeFlow: 'direct',
    en: 'Classic 25/5 pomodoro in the header with configurable work and break lengths — lightweight focus sprints between check-ins.',
    ru: 'Классический помодоро 25/5 в шапке с настройкой интервалов — короткие спринты фокуса между привычками.'
  },
  quote: {
    minAppVersion: '1.7.0',
    en: 'Daily inspiration card in your garden — 1000 curated quotes in EN and RU, favorites, and locale-pure banks.',
    ru: 'Карточка вдохновения в саду — 1000 цитат EN/RU, избранное и чистые языковые банки.'
  },
  'weekly-stats': {
    minAppVersion: '2.0.0',
    storeFlow: 'get',
    en: 'Garden analytics with a 7-day bar chart and weekly completion rate powered by Cultiva 2.0 — see momentum at a glance.',
    ru: 'Аналитика в саду: график за 7 дней и процент недели на данных Cultiva 2.0 — импульс на одном экране.'
  },
  'habit-reflection': {
    minAppVersion: '1.7.0',
    storeFlow: 'get',
    en: 'Opens a one-line micro-journal sheet right after you complete a habit — capture why it mattered in under five seconds.',
    ru: 'Однострочный журнал сразу после выполнения — зафиксируйте смысл привычки за несколько секунд.'
  },
  routine: {
    minAppVersion: '2.0.0',
    storeFlow: 'get',
    en: 'Morning and evening ritual checklists in the garden, matched to habits by name — start and end the day with intention.',
    ru: 'Утренний и вечерний чеклист в саду по именам привычек — начало и завершение дня с намерением.'
  },
  'gentle-nudge': {
    minAppVersion: '2.0.0',
    en: 'A friendly in-app nudge after your chosen hour if habits remain open — supportive, not nagging, with configurable timing.',
    ru: 'Мягкое напоминание после заданного часа, если привычки открыты — поддержка без навязчивости.'
  }
};

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
registry.version = '3.3.0';

for (const plugin of registry.plugins) {
  const meta = META[plugin.id];
  if (!meta) {
    continue;
  }
  plugin.minAppVersion = meta.minAppVersion;
  delete plugin.storeFlow;
  plugin.description = meta.en;
  plugin.i18n = {
    en: { name: plugin.i18n?.en?.name || plugin.name, description: meta.en },
    ru: { name: plugin.i18n?.ru?.name || plugin.name, description: meta.ru }
  };
}

writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log('[registry] synced catalog meta →', registry.version);
