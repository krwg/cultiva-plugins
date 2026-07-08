import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const EN_BASE = [
  ['The secret of getting ahead is getting started.', 'Mark Twain'],
  ['Small daily improvements are the key to long-term results.', 'Unknown'],
  ['We are what we repeatedly do. Excellence is a habit.', 'Aristotle'],
  ['A journey of a thousand miles begins with a single step.', 'Laozi'],
  ['The only way to do great work is to love what you do.', 'Steve Jobs'],
  ['Success is the sum of small efforts repeated day in and day out.', 'Robert Collier'],
  ['Motivation gets you started. Habit keeps you going.', 'Jim Ryun'],
  ['You do not rise to your goals. You fall to your systems.', 'James Clear'],
  ['Well begun is half done.', 'Aristotle'],
  ['The best time to plant a tree was twenty years ago. The second best time is now.', 'Chinese proverb'],
  ['Consistency is more important than perfection.', 'Unknown'],
  ['Every day is another chance to grow.', 'Unknown'],
  ['Discipline is choosing what you want most over what you want now.', 'Unknown'],
  ['Focus on progress, not perfection.', 'Unknown'],
  ['Your future is created by what you do today.', 'Unknown'],
  ['Energy flows where attention goes.', 'Unknown'],
  ['Start where you are. Use what you have. Do what you can.', 'Arthur Ashe'],
  ['It always seems impossible until it is done.', 'Nelson Mandela'],
  ['What you do every day matters more than what you do once in a while.', 'Gretchen Rubin'],
  ['Courage is not the absence of fear, but action in spite of it.', 'Mark Twain'],
  ['The harder you work for something, the greater you feel when you achieve it.', 'Unknown'],
  ['Dream big. Start small. Act now.', 'Unknown'],
  ['Little by little, one travels far.', 'J.R.R. Tolkien'],
  ['Do not wait for opportunity. Create it.', 'Unknown'],
  ['A calm mind brings inner strength and self-confidence.', 'Dalai Lama'],
  ['Happiness is not something ready made. It comes from your own actions.', 'Dalai Lama'],
  ['Quality is not an act, it is a habit.', 'Aristotle'],
  ['If you get tired, learn to rest, not to quit.', 'Banksy'],
  ['The only impossible journey is the one you never begin.', 'Tony Robbins'],
  ['Act as if what you do makes a difference. It does.', 'William James'],
  ['Be patient with yourself. Self-growth is tender.', 'Unknown'],
  ['You are never too old to set another goal.', 'C.S. Lewis'],
  ['What we think, we become.', 'Buddha'],
  ['Simplicity is the ultimate sophistication.', 'Leonardo da Vinci'],
  ['The mind is everything. What you think you become.', 'Buddha'],
  ['With the new day comes new strength and new thoughts.', 'Eleanor Roosevelt'],
  ['Believe you can and you are halfway there.', 'Theodore Roosevelt'],
  ['It does not matter how slowly you go as long as you do not stop.', 'Confucius'],
  ['Keep your face always toward the sunshine.', 'Walt Whitman'],
  ['In the middle of difficulty lies opportunity.', 'Albert Einstein'],
  ['The future depends on what you do today.', 'Mahatma Gandhi'],
  ['Do one thing every day that scares you.', 'Eleanor Roosevelt'],
  ['Strive not to be a success, but rather to be of value.', 'Albert Einstein'],
  ['Life is 10% what happens to us and 90% how we react.', 'Charles Swindoll'],
  ['You miss 100% of the shots you do not take.', 'Wayne Gretzky'],
  ['Whether you think you can or you think you cannot, you are right.', 'Henry Ford'],
  ['The only limit is the one you set yourself.', 'Unknown'],
  ['Make each day your masterpiece.', 'John Wooden'],
  ['Action is the foundational key to all success.', 'Pablo Picasso']
];

const RU_BASE = [
  ['Секрет успеха — начать.', 'Марк Твен'],
  ['Маленькие ежедневные улучшения — ключ к долгосрочному результату.', 'Неизвестный автор'],
  ['Мы — то, что мы делаем изо дня в день. Совершенство — это привычка.', 'Аристотель'],
  ['Путь в тысячу ли начинается с первого шага.', 'Лао-цзы'],
  ['Единственный способ делать великие дела — любить то, что делаешь.', 'Стив Джобс'],
  ['Успех — это сумма небольших усилий, повторяемых день за днём.', 'Роберт Коллиер'],
  ['Мотивация запускает. Привычка удерживает.', 'Джим Рьюн'],
  ['Вы не поднимаетесь до целей — вы опускаетесь до уровня систем.', 'Джеймс Клир'],
  ['Хорошее начало — половина дела.', 'Аристотель'],
  ['Лучшее время посадить дерево было двадцать лет назад. Следующее лучшее — сейчас.', 'Китайская пословица'],
  ['Последовательность важнее идеальности.', 'Неизвестный автор'],
  ['Каждый день — новый шанс расти.', 'Неизвестный автор'],
  ['Дисциплина — это выбор того, чего хочешь больше всего, а не сейчас.', 'Неизвестный автор'],
  ['Сосредоточьтесь на прогрессе, а не на идеале.', 'Неизвестный автор'],
  ['Ваше будущее создаётся тем, что вы делаете сегодня.', 'Неизвестный автор'],
  ['Энергия течёт туда, куда направлено внимание.', 'Неизвестный автор'],
  ['Начните с того, что есть. Используйте то, что под рукой. Делайте то, что можете.', 'Артур Эш'],
  ['Всегда кажется невозможным — пока не сделаешь.', 'Нельсон Мандела'],
  ['Важнее то, что вы делаете каждый день, а не изредка.', 'Гретхен Рубин'],
  ['Мужество — не отсутствие страха, а действие вопреки ему.', 'Марк Твен'],
  ['Чем больше труда вложено, тем сильнее радость результата.', 'Неизвестный автор'],
  ['Мечтай смело. Начинай с малого. Действуй сейчас.', 'Неизвестный автор'],
  ['Мало-помалу можно пройти далеко.', 'Дж. Р. Р. Толкин'],
  ['Не ждите возможности — создайте её.', 'Неизвестный автор'],
  ['Спокойный ум даёт внутреннюю силу и уверенность.', 'Далай-лама'],
  ['Счастье не дано — оно рождается из ваших действий.', 'Далай-лама'],
  ['Качество — не поступок, а привычка.', 'Аристотель'],
  ['Если устали — отдыхайте, а не сдавайтесь.', 'Бэнкси'],
  ['Невозможен только путь, который вы так и не начали.', 'Тони Роббинс'],
  ['Действуйте так, будто это имеет значение. Имеет.', 'Уильям Джеймс'],
  ['Будьте терпеливы к себе. Рост — нежный процесс.', 'Неизвестный автор'],
  ['Никогда не поздно поставить новую цель.', 'К. С. Льюис'],
  ['Мы становимся тем, о чём думаем.', 'Будда'],
  ['Простота — высшая изощрённость.', 'Леонардо да Винчи'],
  ['Всё начинается с мысли.', 'Будда'],
  ['С новым днём приходят новые силы и новые мысли.', 'Элеонора Рузвельт'],
  ['Поверьте, что можете — и вы на полпути.', 'Теодор Рузвельт'],
  ['Не важно, как медленно идёте, если не останавливаетесь.', 'Конфуций'],
  ['Держите лицо к солнцу.', 'Уолт Уитмен'],
  ['В трудностях скрыта возможность.', 'Альберт Эйнштейн'],
  ['Будущее зависит от того, что вы делаете сегодня.', 'Махатма Ганди'],
  ['Каждый день делайте одно, что пугает.', 'Элеонора Рузвельт'],
  ['Стремитесь быть полезным, а не просто успешным.', 'Альберт Эйнштейн'],
  ['Жизнь на 10% — события, на 90% — реакция.', 'Чарльз Суиндолл'],
  ['Вы промахиваетесь в 100% бросков, которые не делаете.', 'Уэйн Гретцки'],
  ['Думаете, что можете — или не можете: в обоих случаях правы.', 'Генри Форд'],
  ['Единственный предел — тот, что вы сами себе поставили.', 'Неизвестный автор'],
  ['Сделайте каждый день шедевром.', 'Джон Вуден'],
  ['Действие — основа любого успеха.', 'Пабло Пикассо']
];

const EN_VERBS = ['build', 'grow', 'learn', 'practice', 'choose', 'protect', 'nurture', 'honor', 'shape', 'refine'];
const EN_NOUNS = ['habits', 'focus', 'clarity', 'patience', 'courage', 'kindness', 'discipline', 'balance', 'rhythm', 'intention'];
const EN_OUTCOMES = ['a stronger tomorrow', 'lasting change', 'real progress', 'inner calm', 'steady momentum', 'meaningful growth'];
const RU_VERBS = ['выращивайте', 'укрепляйте', 'берегите', 'развивайте', 'выбирайте', 'поддерживайте', 'создавайте', 'направляйте'];
const RU_NOUNS = ['привычки', 'фокус', 'ясность', 'терпение', 'смелость', 'доброту', 'дисциплину', 'баланс', 'ритм', 'намерение'];
const RU_OUTCOMES = ['сильное завтра', 'устойчивые перемены', 'настоящий прогресс', 'внутреннее спокойствие', 'стабильный импульс', 'осмысленный рост'];

function expandQuotes(base, verbs, nouns, outcomes) {
  const out = [...base.map(([text, author]) => ({ text, author }))];
  const seen = new Set(out.map((q) => q.text));

  for (const v of verbs) {
    for (const n of nouns) {
      for (const o of outcomes) {
        if (out.length >= 500) break;
        const variants = [
          `Today, ${v} your ${n} to create ${o}.`,
          `Protect your ${n}; it leads to ${o}.`,
          `Small steps in ${n} bring ${o}.`,
          `Choose ${n} daily and trust ${o}.`,
          `Your ${n} today shapes ${o}.`
        ];
        for (const text of variants) {
          if (out.length >= 500) break;
          if (!seen.has(text)) {
            seen.add(text);
            out.push({ text, author: 'Cultiva' });
          }
        }
      }
      if (out.length >= 500) break;
    }
    if (out.length >= 500) break;
  }

  let i = 0;
  while (out.length < 500) {
    const text = `Keep going — your next small step in ${nouns[i % nouns.length]} matters. (${i + 1})`;
    if (!seen.has(text)) {
      seen.add(text);
      out.push({ text, author: 'Cultiva' });
    }
    i += 1;
  }

  return out.slice(0, 500);
}

const data = {
  en: expandQuotes(EN_BASE, EN_VERBS, EN_NOUNS, EN_OUTCOMES),
  ru: expandQuotes(RU_BASE, RU_VERBS, RU_NOUNS, RU_OUTCOMES)
};

const outPath = join(__dirname, '..', 'quotes-data.json');
writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`Wrote ${data.en.length} EN and ${data.ru.length} RU quotes to ${outPath}`);
