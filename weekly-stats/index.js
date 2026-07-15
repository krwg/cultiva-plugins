class WeeklyStatsPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this._locale = 'en';
    this._summary = null;
    this._bars = [];
  }

  _t(key, vars = {}) {
    const en = {
      title: 'This week',
      rate: '{rate}% completion',
      empty: 'No habits yet'
    };
    const ru = {
      title: 'Эта неделя',
      rate: '{rate}% выполнено',
      empty: 'Пока нет привычек'
    };
    const dict = this._locale === 'ru' ? ru : en;
    let text = dict[key] || en[key] || key;
    Object.keys(vars).forEach((k) => {
      text = text.replace(`{${k}}`, String(vars[k]));
    });
    return text;
  }

  _dayLabels() {
    if (this._locale === 'ru') {
      return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    }
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
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

  _weekStartFromTodayKey(todayKey) {
    const [y, m, d] = String(todayKey || '').split('-').map(Number);
    const base = (y && m && d)
      ? new Date(y, m - 1, d, 12, 0, 0, 0)
      : new Date();
    const day = base.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    base.setDate(base.getDate() + diff);
    base.setHours(0, 0, 0, 0);
    return base;
  }

  _dayKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
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

  async _buildBars() {
    const habits = await this.context.app.getHabits();
    const todayKey = await this.context.app.getToday();
    const weekStart = this._weekStartFromTodayKey(todayKey);
    const bars = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const key = this._dayKey(d);
      let done = 0;
      const total = habits.length;
      for (const h of habits) {
        if (this._habitDoneOn(h, key, todayKey)) {
          done += 1;
        }
      }
      bars.push({ label: this._dayLabels()[i], done, total, key });
    }
    const max = Math.max(1, ...bars.map((b) => b.done));
    return bars.map((b) => ({ ...b, pct: Math.round((b.done / max) * 100) }));
  }

  async _refresh() {
    await this._loadLocale();
    try {
      this._summary = await this.context.app.getWeeklySummary();
    } catch {
      this._summary = { completions: 0, possible: 0, rate: 0 };
    }
    try {
      this._bars = await this._buildBars();
    } catch {
      this._bars = this._dayLabels().map((label) => ({ label, done: 0, total: 0, pct: 0 }));
    }
    this._renderGarden();
  }

  _escapeHtml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  _html() {
    const s = this._summary || { completions: 0, possible: 0, rate: 0 };
    const empty = s.possible === 0;
    const bars = (this._bars || []).map((b) => `
      <div class="weekly-stats-bar-col" title="${this._escapeHtml(b.label)}: ${b.done}/${b.total || 0}">
        <div class="weekly-stats-bar-track">
          <div class="weekly-stats-bar-fill" style="height:${b.pct}%"></div>
        </div>
        <span class="weekly-stats-bar-label">${this._escapeHtml(b.label)}</span>
      </div>`).join('');
    const sub = empty
      ? this._t('empty')
      : `${s.completions}/${s.possible} · ${this._t('rate', { rate: s.rate })}`;
    return `<article class="habit-card garden-plugin-card garden-plugin-card--weekly-stats" data-category="mindfulness">
      <div class="card-header weekly-stats-header">
        <div class="plant-visual weekly-stats-icon" aria-hidden="true">W</div>
        <div class="card-info weekly-stats-info">
          <div class="card-title weekly-stats-title">${this._t('title')}</div>
          <div class="card-subtitle weekly-stats-sub">${this._escapeHtml(sub)}</div>
        </div>
      </div>
      <div class="weekly-stats-chart" role="img" aria-label="${this._escapeHtml(sub)}">${bars}</div>
    </article>`;
  }

  _renderGarden() {
    this.context.ui.updateGardenHtml(this._html());
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

return new WeeklyStatsPlugin(context, hooks);
