import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const registryPath = join(root, 'registry.json');

const META = {
  weather: {
    minAppVersion: '1.7.0',
    storeFlow: 'direct',
    en: {
      name: 'Weather',
      tagline: 'Forecast always within reach.',
      description: 'Glanced out the window but still unsure? The Weather plugin shows a live forecast in the header and garden. Built-in search covers 1100+ Russian cities — type a few letters and the rest fills in. Outside Russia, Open-Meteo keeps you covered anywhere in the world. Check cloud cover, temperature, and precipitation in seconds — then decide whether to grab an umbrella or go for a run.'
    },
    ru: {
      name: 'Погода',
      tagline: 'Прогноз, который всегда под рукой.',
      description: 'Выглянули в окно, но сомневаетесь? Плагин «Погода» показывает актуальный прогноз прямо в шапке приложения и в саду. Встроенный поиск знает 1100+ городов России — достаточно ввести несколько букв, и всё остальное подхватится. За пределами РФ работает Open-Meteo, так что вы не потеряетесь в любой точке мира. Оцените облачность, температуру и осадки за секунду — и решайте, брать зонт или выходить на пробежку.'
    }
  },
  time: {
    minAppVersion: '1.1.0',
    storeFlow: 'direct',
    en: {
      name: 'Time',
      tagline: 'Live clocks in the header and the world.',
      description: 'Track time without extra friction. Time places a calm digital clock in the header; tap it for a sheet with multiple time zones. Ideal when your team spans London, New York, or Tokyo — you instantly see who is starting breakfast and who is heading to bed. No tab switching — just the moment you need, one glance away.'
    },
    ru: {
      name: 'Время',
      tagline: 'Живые часы в шапке и мире.',
      description: 'Следите за временем без лишних движений. «Время» размещает в шапке аккуратный цифровой циферблат, а если нажать на него — откроется лист-штора с поддержкой нескольких часовых поясов. Идеально, если вы работаете с командой в Лондоне, Нью-Йорке или Токио: сразу видно, кто уже завтракает, а кто собирается спать. Никаких переключений между вкладками — только нужный момент на расстоянии взгляда.'
    }
  },
  radio: {
    minAppVersion: '1.1.0',
    storeFlow: 'direct',
    en: {
      name: 'Music',
      tagline: 'A background stream that sets the tone.',
      description: 'When silence gets in the way and playlists feel tired, turn on Music. The plugin streams trusted SomaFM channels right from your garden. Adjust volume, set a sleep timer, and enjoy a glassy minimal interface. Whether you are focusing, reading, or setting a mood — let background sound become part of your ritual.'
    },
    ru: {
      name: 'Музыка',
      tagline: 'Фоновый поток, который настраивает.',
      description: 'Когда тишина мешает, а подборка плейлистов надоела — включите «Музыку». Плагин даёт доступ к проверенным потокам SomaFM прямо из сада. Регулируйте громкость, ставьте таймер сна (чтобы уснуть под любимую волну) и наслаждайтесь стеклянным, минималистичным интерфейсом. Хотите сосредоточиться на работе, почитать или просто создать атмосферу — этот плагин сделает фоновый звук частью вашего ритуала.'
    }
  },
  pomodoro: {
    minAppVersion: '1.1.0',
    storeFlow: 'direct',
    en: {
      name: 'Timer',
      tagline: 'Short sprints for a bigger goal.',
      description: 'Staying on task without drifting to tea or your phone is a skill. Timer helps with classic 25/5 intervals or your own settings. Keep it in the header while you work on habits; when it ends, a gentle chime brings you back. A perfect companion for pomodoro practice — or anyone who wants to steer their attention.'
    },
    ru: {
      name: 'Таймер',
      tagline: 'Короткие спринты для большой цели.',
      description: 'Сконцентрироваться на задаче, не отвлекаясь на чай и телефон — это искусство. «Таймер» помогает в этом: классические интервалы 25/5 или ваши собственные настройки. Включите его в шапке, и он будет отсчитывать время, пока вы работаете над привычками. Когда таймер заканчивается — короткий сигнал возвращает вас в реальность. Идеальный спутник для тех, кто практикует технику «помидора» или просто хочет управлять своим вниманием.'
    }
  },
  quote: {
    minAppVersion: '1.7.0',
    storeFlow: 'direct',
    en: {
      name: 'Thoughts',
      tagline: 'One quote that can shift the day.',
      description: 'Every morning starts with a mood. Thoughts offers an inspiring line — in Russian or English, based on your language. More than 1000 quotes in separate banks so you always find one that resonates. Save favorites and return when you doubt. A small spark that can launch an entire day.'
    },
    ru: {
      name: 'Мысли',
      tagline: 'Одна цитата, которая меняет ход дня.',
      description: 'Каждое утро начинается с настроения. «Мысли» предлагает вам карточку с вдохновляющей фразой — на русском или английском, в зависимости от выбранного языка. Более 1000 цитат в банках, разделённых по языкам, так что вы всегда найдёте ту, что отзовётся. Сохраняйте понравившиеся в избранное и возвращайтесь к ним в моменты сомнений. Небольшая искра, которая может запустить целый день.'
    }
  },
  'weekly-stats': {
    minAppVersion: '2.0.0',
    storeFlow: 'get',
    en: {
      name: 'Summary',
      tagline: 'Your progress in numbers and charts.',
      description: 'How do you know the week mattered? Summary shows clean habit completion stats for the last 7 days. A visual chart and weekly percentage reveal where you are rising and where to push. Data comes from your Cultiva 2.0 history — not abstract numbers, but your personal slice. Great for weekly reflection and momentum for the next seven days.'
    },
    ru: {
      name: 'Итоги',
      tagline: 'Ваш прогресс — в цифрах и графиках.',
      description: 'Как понять, что неделя прошла не зря? «Итоги» показывают чистую статистику выполнения привычек за последние 7 дней. Визуальный график и процент от общей недели — вы сразу видите, где вы на подъёме, а где нужно поднажать. Данные берутся из вашей собственной истории в Cultiva 2.0, так что это не абстрактные цифры, а ваш личный срез. Отличный повод для еженедельной рефлексии и импульса для следующей недели.'
    }
  },
  'habit-reflection': {
    minAppVersion: '1.7.0',
    storeFlow: 'get',
    en: {
      name: 'Notes',
      tagline: 'One line after every completion.',
      description: 'You finished a habit — then what? Notes prompts a micro-reflection: a single short line right after you check in. Capture what you felt, what worked, or what surprised you. Not a three-page journal — just one sentence that turns routine into awareness. A week later, reread and see how your relationship with habits shifts.'
    },
    ru: {
      name: 'Заметки',
      tagline: 'Одна строка после каждого дела.',
      description: 'Выполнили привычку — и что дальше? «Заметки» предлагают вам мгновенную микро-рефлексию: поле для одной короткой фразы появляется сразу после отметки. Запишите, что чувствовали, что удалось или что удивило. Это не дневник на три страницы, а всего одна строка, но она превращает рутину в осознанный опыт. Через неделю вы будете перечитывать свои заметки и видеть, как меняется ваше восприятие привычек.'
    }
  },
  routine: {
    minAppVersion: '2.0.0',
    storeFlow: 'get',
    en: {
      name: 'Routine',
      tagline: 'Start and end the day with intention.',
      description: 'Morning sets the tone; evening closes the loop. Routine turns your habits into checklists that appear morning and evening. Walk the list you defined — so nothing important slips at the start, and you feel closure at the finish. Not just reminders, but a ritual that trains you to switch between on and off with purpose.'
    },
    ru: {
      name: 'Режим',
      tagline: 'Начать и завершить день с намерением.',
      description: 'Утро определяет день, а вечер подводит итог. «Режим» превращает ваши привычки в чеклист, который появляется утром и вечером. Пройдитесь по списку привычек, которые вы сами задали, — так вы не забудете важное на старте и почувствуете удовлетворение на финише. Это не просто напоминалка, а ритуал, который приучает вас жить осознанно, переключаясь между «включиться» и «отключиться».'
    }
  },
  'gentle-nudge': {
    minAppVersion: '2.0.0',
    storeFlow: 'get',
    en: {
      name: 'Reminders',
      tagline: 'A quiet call when you drift.',
      description: 'You set a goal, then life crowded it out. Reminders gently bring you back. After your chosen hour, if planned habits are still open, the plugin sends a soft signal — not nagging, more like a friend whispering. Set the time and let it support you until the cycle is complete.'
    },
    ru: {
      name: 'Напоминания',
      tagline: 'Тихий зов, когда вы отвлеклись.',
      description: 'Вы поставили цель, но в пылу дел забыли о привычках? «Напоминания» мягко возвращают вас в нужное русло. После выбранного вами часа, если вы ещё не выполнили запланированные привычки, плагин подаст лёгкий сигнал — не раздражающий, не навязчивый, похожий на шёпот друга. Это не спам, а поддержка для тех моментов, когда жизнь закручивается. Установите время, и плагин будет бережно напоминать, пока вы не завершите цикл.'
    }
  }
};

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

for (const plugin of registry.plugins) {
  const meta = META[plugin.id];
  if (!meta) {
    continue;
  }
  plugin.minAppVersion = meta.minAppVersion;
  if (meta.storeFlow) {
    plugin.storeFlow = meta.storeFlow;
  } else {
    delete plugin.storeFlow;
  }
  plugin.description = meta.en.description;
  plugin.i18n = {
    en: {
      name: meta.en.name,
      tagline: meta.en.tagline,
      description: meta.en.description
    },
    ru: {
      name: meta.ru.name,
      tagline: meta.ru.tagline,
      description: meta.ru.description
    }
  };
}

writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
writeFileSync(join(root, 'docs/registry.json'), `${JSON.stringify(registry, null, 2)}\n`);
console.log('[registry] synced catalog meta →', registry.version);

const compute = spawnSync(process.execPath, [join(__dirname, 'compute-registry-sha256.mjs')], { stdio: 'inherit' });
if (compute.status !== 0) {
  process.exit(compute.status || 1);
}
