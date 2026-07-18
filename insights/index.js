class InsightsPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this._locale = 'en';
    this._patterns = null;
  }

  _t(key, vars = {}) {
    const en = {
      title: 'Correlations',
      subtitle: 'Local patterns from your habits',
      empty: 'Need more habit history to find links',
      needHabits: 'Add at least two habits to see correlations',
      coLabel: 'Together',
      coValue: 'When {a} is done, {b} is too — {pct}%',
      breakLabel: 'Streak breaks',
      breakValue: 'Most often on {day}',
      pairLabel: 'Linked streak',
      pairValue: '{a} + {b} · {n} days',
      mon: 'Monday',
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday',
      fri: 'Friday',
      sat: 'Saturday',
      sun: 'Sunday'
    };
    const ru = {
      title: 'Связи',
      subtitle: 'Локальные закономерности по привычкам',
      empty: 'Нужно больше истории, чтобы найти связи',
      needHabits: 'Добавьте хотя бы две привычки',
      coLabel: 'Вместе',
      coValue: 'Когда сделано «{a}», часто и «{b}» — {pct}%',
      breakLabel: 'Срывы серии',
      breakValue: 'Чаще всего в {day}',
      pairLabel: 'Связанная серия',
      pairValue: '{a} + {b} · {n} дн.',
      mon: 'понедельник',
      tue: 'вторник',
      wed: 'среда',
      thu: 'четверг',
      fri: 'пятница',
      sat: 'суббота',
      sun: 'воскресенье'
    };
    const dict = this._locale === 'ru' ? ru : en;
    let text = dict[key] || en[key] || key;
    Object.keys(vars).forEach((k) => {
      text = text.replace(`{${k}}`, String(vars[k]));
    });
    return text;
  }

  _weekdayName(dow) {
    const keys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return this._t(keys[dow] || 'mon');
  }

  async _loadLocale() {
    if (this.context.app && typeof this.context.app.getLocale === 'function') {
      try {
        this._locale = await this.context.app.getLocale();
      } catch {
        this._locale = 'en';
      }
    }
    if (this._locale !== 'ru') {
      this._locale = 'en';
    }
  }

  _dayKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  _parseKey(key) {
    const [y, m, d] = String(key || '').split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d, 12, 0, 0, 0);
  }

  _habitDoneOn(habit, key, todayKey) {
    if (Array.isArray(habit.recentHistory) && habit.recentHistory.includes(key)) {
      return true;
    }
    if (Array.isArray(habit.history) && habit.history.includes(key)) {
      return true;
    }
    if (key === todayKey && habit.completedToday) {
      return true;
    }
    if (habit.lastCompleted === key) {
      return true;
    }
    return false;
  }

  _collectDates(habit, todayKey) {
    const set = new Set();
    for (const src of [habit.recentHistory, habit.history]) {
      if (!Array.isArray(src)) continue;
      for (const k of src) {
        if (typeof k === 'string' && k) set.add(k);
      }
    }
    if (habit.lastCompleted) set.add(habit.lastCompleted);
    if (habit.completedToday && todayKey) set.add(todayKey);
    return set;
  }

  _buildDayMap(habits, todayKey) {
    const allKeys = new Set();
    const byHabit = new Map();
    for (const h of habits) {
      const dates = this._collectDates(h, todayKey);
      byHabit.set(h.id, dates);
      dates.forEach((k) => allKeys.add(k));
    }
    const sorted = [...allKeys].sort();
    const dayMap = new Map();
    for (const key of sorted) {
      const ids = new Set();
      for (const h of habits) {
        if (this._habitDoneOn(h, key, todayKey)) {
          ids.add(h.id);
        }
      }
      dayMap.set(key, ids);
    }
    return { dayMap, sorted, byHabit };
  }

  _shortName(name) {
    const s = String(name || '').trim();
    if (s.length <= 22) return s;
    return `${s.slice(0, 20)}…`;
  }

  _computeCoOccurrence(habits, dayMap, sorted) {
    if (habits.length < 2 || sorted.length < 3) return null;
    const totalDays = sorted.length;
    let best = null;

    for (let i = 0; i < habits.length; i++) {
      for (let j = 0; j < habits.length; j++) {
        if (i === j) continue;
        const a = habits[i];
        const b = habits[j];
        let daysA = 0;
        let both = 0;
        let daysB = 0;
        for (const key of sorted) {
          const ids = dayMap.get(key);
          const hasA = ids.has(a.id);
          const hasB = ids.has(b.id);
          if (hasA) daysA += 1;
          if (hasB) daysB += 1;
          if (hasA && hasB) both += 1;
        }
        if (daysA < 3) continue;
        const rate = both / daysA;
        const baseline = daysB / totalDays;
        const lift = rate - baseline;
        if (lift < 0.08 && rate < 0.55) continue;
        const score = lift * 2 + rate;
        if (!best || score > best.score) {
          best = {
            score,
            a: a.name,
            b: b.name,
            pct: Math.round(rate * 100)
          };
        }
      }
    }
    return best;
  }

  _computeBreakWeekday(habits, byHabit, todayKey) {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    let total = 0;

    for (const h of habits) {
      const dates = byHabit.get(h.id);
      if (!dates || dates.size === 0) continue;
      const sorted = [...dates].sort();
      const first = this._parseKey(sorted[0]);
      const last = this._parseKey(todayKey) || this._parseKey(sorted[sorted.length - 1]);
      if (!first || !last) continue;

      const cursor = new Date(first);
      while (cursor <= last) {
        const key = this._dayKey(cursor);
        const prev = new Date(cursor);
        prev.setDate(prev.getDate() - 1);
        const prevKey = this._dayKey(prev);
        if (dates.has(prevKey) && !dates.has(key) && key <= todayKey) {
          counts[cursor.getDay()] += 1;
          total += 1;
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    if (total < 2) return null;
    let maxDow = 0;
    for (let d = 1; d < 7; d++) {
      if (counts[d] > counts[maxDow]) maxDow = d;
    }
    if (counts[maxDow] === 0) return null;
    return { dow: maxDow, count: counts[maxDow] };
  }

  _computePairStreak(habits, dayMap, sorted) {
    if (habits.length < 2 || sorted.length < 2) return null;
    let best = null;

    for (let i = 0; i < habits.length; i++) {
      for (let j = i + 1; j < habits.length; j++) {
        const a = habits[i];
        const b = habits[j];
        let run = 0;
        let maxRun = 0;
        let prevDate = null;

        for (const key of sorted) {
          const ids = dayMap.get(key);
          const both = ids.has(a.id) && ids.has(b.id);
          const cur = this._parseKey(key);
          if (!cur || !both) {
            run = 0;
            prevDate = null;
            continue;
          }
          if (prevDate) {
            const expected = new Date(prevDate);
            expected.setDate(expected.getDate() + 1);
            if (this._dayKey(expected) === key) {
              run += 1;
            } else {
              run = 1;
            }
          } else {
            run = 1;
          }
          prevDate = cur;
          if (run > maxRun) maxRun = run;
        }

        if (maxRun < 2) continue;
        if (!best || maxRun > best.n) {
          best = { a: a.name, b: b.name, n: maxRun };
        }
      }
    }
    return best;
  }

  async _computePatterns() {
    const habits = await this.context.app.getHabits();
    const todayKey = await this.context.app.getToday();

    if (!habits || habits.length < 2) {
      return { kind: 'needHabits' };
    }

    const { dayMap, sorted, byHabit } = this._buildDayMap(habits, todayKey);
    if (sorted.length < 3) {
      return { kind: 'empty' };
    }

    const co = this._computeCoOccurrence(habits, dayMap, sorted);
    const br = this._computeBreakWeekday(habits, byHabit, todayKey);
    const pair = this._computePairStreak(habits, dayMap, sorted);

    if (!co && !br && !pair) {
      return { kind: 'empty' };
    }

    return { kind: 'ok', co, br, pair };
  }

  _escapeHtml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  _html() {
    const p = this._patterns;
    if (!p || p.kind === 'needHabits') {
      return `<article class="habit-card garden-plugin-card garden-plugin-card--insights" data-category="mindfulness">
        <div class="card-header insights-header">
          <div class="plant-visual insights-icon" aria-hidden="true">C</div>
          <div class="card-info insights-info">
            <div class="card-title insights-title">${this._t('title')}</div>
            <div class="card-subtitle insights-sub">${this._t('subtitle')}</div>
          </div>
        </div>
        <p class="insights-empty">${this._t('needHabits')}</p>
      </article>`;
    }
    if (p.kind === 'empty') {
      return `<article class="habit-card garden-plugin-card garden-plugin-card--insights" data-category="mindfulness">
        <div class="card-header insights-header">
          <div class="plant-visual insights-icon" aria-hidden="true">C</div>
          <div class="card-info insights-info">
            <div class="card-title insights-title">${this._t('title')}</div>
            <div class="card-subtitle insights-sub">${this._t('subtitle')}</div>
          </div>
        </div>
        <p class="insights-empty">${this._t('empty')}</p>
      </article>`;
    }

    const rows = [];
    if (p.co) {
      rows.push(`<div class="insights-row">
        <span class="insights-label">${this._t('coLabel')}</span>
        <span class="insights-value">${this._escapeHtml(this._t('coValue', {
          a: this._shortName(p.co.a),
          b: this._shortName(p.co.b),
          pct: p.co.pct
        }))}</span>
      </div>`);
    }
    if (p.br) {
      rows.push(`<div class="insights-row">
        <span class="insights-label">${this._t('breakLabel')}</span>
        <span class="insights-value">${this._escapeHtml(this._t('breakValue', {
          day: this._weekdayName(p.br.dow)
        }))}</span>
      </div>`);
    }
    if (p.pair) {
      rows.push(`<div class="insights-row">
        <span class="insights-label">${this._t('pairLabel')}</span>
        <span class="insights-value">${this._escapeHtml(this._t('pairValue', {
          a: this._shortName(p.pair.a),
          b: this._shortName(p.pair.b),
          n: p.pair.n
        }))}</span>
      </div>`);
    }

    return `<article class="habit-card garden-plugin-card garden-plugin-card--insights" data-category="mindfulness">
      <div class="card-header insights-header">
        <div class="plant-visual insights-icon" aria-hidden="true">C</div>
        <div class="card-info insights-info">
          <div class="card-title insights-title">${this._t('title')}</div>
          <div class="card-subtitle insights-sub">${this._t('subtitle')}</div>
        </div>
      </div>
      <div class="insights-list">${rows.join('')}</div>
    </article>`;
  }

  _renderGarden() {
    this.context.ui.updateGardenHtml(this._html());
  }

  async _refresh() {
    await this._loadLocale();
    try {
      this._patterns = await this._computePatterns();
    } catch {
      this._patterns = { kind: 'empty' };
    }
    this._renderGarden();
  }

  async onEnable() {
    this.context.ui.registerGardenWidget({
      position: 'top',
      render: (el) => {
        el.innerHTML = this._html();
      }
    });
    await this._refresh();
    this.hooks.on('onHabitComplete', () => {
      void this._refresh();
    });
    this.hooks.on('onAppStart', () => {
      void this._refresh();
    });
    this.hooks.on('onSettingsChange', () => {
      void this._refresh();
    });
  }

  onDisable() {}
}

return new InsightsPlugin(context, hooks);
