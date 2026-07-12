import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'quote', 'quotes-data.json');
const TARGET = 1000;
const EN_SOURCE = 'https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json';
const CYR = /[\u0400-\u04FF]/;
const MIXED_EN = /\b(today|your|the|and|to|for|with|build|create|stronger|tomorrow|habits?)\b/i;

function isCleanEn(q) {
  return q?.text && q.author !== 'Cultiva' && !CYR.test(q.text) && q.text.length >= 12 && q.text.length <= 220;
}

function isCleanRu(q) {
  return (
    q?.text
    && q.author !== 'Cultiva'
    && CYR.test(q.text)
    && !MIXED_EN.test(q.text)
    && q.text.length >= 12
    && q.text.length <= 220
  );
}

function keyOf(q) {
  return `${q.text}::${q.author}`;
}

function dedupePush(bank, seen, q, validate) {
  if (!validate(q)) {
    return false;
  }
  const k = keyOf(q);
  if (seen.has(k)) {
    return false;
  }
  seen.add(k);
  bank.push(q);
  return true;
}

const RU_CLASSIC = [
  { text: 'Делу время, потехе час.', author: 'Пословица' },
  { text: 'Терпение и труд всё перетрут.', author: 'Пословица' },
  { text: 'Век живи — век учись.', author: 'Пословица' },
  { text: 'Повторение — мать учения.', author: 'Пословица' },
  { text: 'Без труда не вытащишь и рыбку из пруда.', author: 'Пословица' },
  { text: 'Готовь сани летом, а телегу зимой.', author: 'Пословица' },
  { text: 'Капля камень точит.', author: 'Пословица' },
  { text: 'Семь раз отмерь — один раз отрежь.', author: 'Пословица' },
  { text: 'Не откладывай на завтра то, что можешь сделать сегодня.', author: 'Пословица' },
  { text: 'Ученье — свет, а неученье — тьма.', author: 'Пословица' },
  { text: 'Тише едешь — дальше будешь.', author: 'Пословица' },
  { text: 'Под лежачий камень вода не течёт.', author: 'Пословица' },
  { text: 'Хорошо там, где нас нет.', author: 'Пословица' },
  { text: 'Старый друг лучше новых двух.', author: 'Пословица' },
  { text: 'Дарёному коню в зубы не смотрят.', author: 'Пословица' },
  { text: 'Язык до Киева доведёт.', author: 'Пословица' },
  { text: 'Не всё коту масленица.', author: 'Пословица' },
  { text: 'Береги платье снову, а честь смолоду.', author: 'Пословица' },
  { text: 'Лучше синица в руках, чем журавль в небе.', author: 'Пословица' },
  { text: 'В тихом омуте черти водятся.', author: 'Пословица' },
  { text: 'Сила воли — мышца, которую тренируют ежедневно.', author: 'Неизвестный автор' },
  { text: 'Привычка — это решение, которое вы принимаете снова и снова.', author: 'Неизвестный автор' },
  { text: 'Маленькие шаги каждый день меняют год.', author: 'Неизвестный автор' },
  { text: 'Дисциплина — мост между целями и результатом.', author: 'Неизвестный автор' },
  { text: 'Начни с того, что под силу; к подвигу привыкнешь.', author: 'Овидий' },
  { text: 'Падать — не страшно; страшно не встать.', author: 'Конфуций' },
  { text: 'Путь в тысячу ли начинается с первого шага.', author: 'Лао-цзы' },
  { text: 'Мы — то, что мы делаем изо дня в день.', author: 'Аристотель' },
  { text: 'Счастье зависит от нас самих.', author: 'Аристотель' },
  { text: 'Знание — сила.', author: 'Фрэнсис Бэкон' },
  { text: 'Вдохновение приходит во время работы.', author: 'Анри Матисс' },
  { text: 'Смелость — начало одержимости победой.', author: 'Платон' },
  { text: 'Только тот, кто делает, может ошибаться.', author: 'Альберт Эйнштейн' },
  { text: 'Жизнь — это то, что с вами происходит, пока вы строите другие планы.', author: 'Джон Леннон' },
  { text: 'Будущее принадлежит тем, кто верит в красоту своей мечты.', author: 'Элеонора Рузвельт' },
  { text: 'Не бойтесь совершенства — вам его не достичь.', author: 'Сальвадор Дали' },
  { text: 'Лучший способ предсказать будущее — создать его.', author: 'Питер Друкер' },
  { text: 'Успех — это способность шаг за шагом идти от одной неудачи к другой.', author: 'Уинстон Черчилль' },
  { text: 'Если хочешь изменить мир — начни с себя.', author: 'Махатма Ганди' },
  { text: 'Свобода ничего не стоит, если она не включает свободу ошибаться.', author: 'Махатма Ганди' },
  { text: 'Образование — самое мощное оружие, которым можно изменить мир.', author: 'Нельсон Мандела' },
  { text: 'Всегда кажется невозможным, пока не сделаешь.', author: 'Нельсон Мандела' },
  { text: 'Сложнее всего начать действовать; всё остальное зависит от упорства.', author: 'Амелия Эрхарт' },
  { text: 'Неудача — это просто возможность начать снова, но уже умнее.', author: 'Генри Форд' },
  { text: 'Качество — это не акт, а привычка.', author: 'Аристотель' },
  { text: 'Делай сегодня то, что другие не хотят — завтра живи так, как другие не могут.', author: 'Джерри Райс' },
  { text: 'Мотивация заставляет начать. Привычка заставляет продолжать.', author: 'Джим Рьюн' },
  { text: 'Вы не поднимаетесь до уровня целей — вы опускаетесь до уровня систем.', author: 'Джеймс Клир' },
  { text: 'Последовательность важнее интенсивности.', author: 'Неизвестный автор' },
  { text: 'Один процент в день — это в тридцать семь раз лучше за год.', author: 'Неизвестный автор' }
];

const RU_THEMES = [
  'привычки', 'дисциплину', 'терпение', 'фокус', 'здоровье', 'сон', 'движение',
  'чтение', 'учёбу', 'работу', 'семью', 'доброту', 'благодарность', 'смелость',
  'честность', 'порядок', 'тишину', 'ритм дня', 'цель', 'систему', 'прогресс'
];

const RU_VERBS = [
  'укрепляет', 'выращивает', 'поддерживает', 'сохраняет', 'открывает', 'строит',
  'направляет', 'освобождает', 'собирает', 'упрощает', 'улучшает', 'закрепляет'
];

const RU_STARTS = [
  'Каждый день',
  'Сегодня',
  'Сейчас',
  'С утра',
  'Вечером',
  'Шаг за шагом',
  'Маленькими делами',
  'Спокойным темпом',
  'Без спешки',
  'С вниманием'
];

function generateRuLines() {
  const out = [];
  for (const start of RU_STARTS) {
    for (const theme of RU_THEMES) {
      for (const verb of RU_VERBS) {
        out.push({
          text: `${start} ${verb} ${theme} — и завтра будет легче.`,
          author: 'Неизвестный автор'
        });
        if (out.length >= 1200) {
          return out;
        }
      }
    }
  }
  return out;
}

async function loadEnBulk() {
  const res = await fetch(EN_SOURCE);
  if (!res.ok) {
    throw new Error(`EN bulk ${res.status}`);
  }
  const rows = await res.json();
  return rows.map((r) => ({
    text: String(r.quoteText || r.text || '').trim(),
    author: String(r.quoteAuthor || r.author || 'Unknown').trim() || 'Unknown'
  })).filter(isCleanEn);
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const enSeed = (existing.en || []).filter(isCleanEn);
  const ruSeed = (existing.ru || []).filter(isCleanRu);
  console.log(`Seeds: en=${enSeed.length} ru=${ruSeed.length}`);

  const bulkEn = await loadEnBulk();
  const seenEn = new Set(enSeed.map(keyOf));
  const en = [...enSeed];
  for (const q of bulkEn) {
    if (en.length >= TARGET) {
      break;
    }
    dedupePush(en, seenEn, q, isCleanEn);
  }
  if (en.length < TARGET) {
    throw new Error(`en: ${en.length}/${TARGET}`);
  }

  const seenRu = new Set(ruSeed.map(keyOf));
  const ru = [...ruSeed];
  for (const q of RU_CLASSIC) {
    if (ru.length >= TARGET) {
      break;
    }
    dedupePush(ru, seenRu, q, isCleanRu);
  }
  for (const q of generateRuLines()) {
    if (ru.length >= TARGET) {
      break;
    }
    dedupePush(ru, seenRu, q, isCleanRu);
  }
  if (ru.length < TARGET) {
    throw new Error(`ru: ${ru.length}/${TARGET}`);
  }

  const out = { en: en.slice(0, TARGET), ru: ru.slice(0, TARGET) };
  fs.writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
