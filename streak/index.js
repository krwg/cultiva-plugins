class StreakPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this._locale = 'en';
  }

  _t(key, vars = {}) {
    const en = {
      completed: '{name} completed today!',
      streak: '{name} — {n} day streak!',
      milestone: '{name} hit {n} days. Milestone reached!'
    };
    const ru = {
      completed: '{name} — отмечено сегодня!',
      streak: '{name} — серия {n} дн.!',
      milestone: '{name} — {n} дн.! Веха достигнута!'
    };
    const dict = this._locale === 'ru' ? ru : en;
    let text = dict[key] || en[key] || key;
    Object.keys(vars).forEach((k) => {
      text = text.replace(`{${k}}`, String(vars[k]));
    });
    return text;
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

  async onEnable() {
    await this._loadLocale();
    this.hooks.on('onHabitComplete', (habit) => {
      const name = habit && (habit.treeName || habit.name) ? (habit.treeName || habit.name) : 'Habit';
      const streak = habit && habit.currentStreak ? habit.currentStreak : 1;
      const milestones = new Set([7, 30, 100, 365]);
      let text = streak > 1
        ? this._t('streak', { name, n: streak })
        : this._t('completed', { name });
      if (milestones.has(streak)) {
        text = this._t('milestone', { name, n: streak });
      }
      this.context.ui.showNotification('', text);
    });
    this.hooks.on('onSettingsChange', () => {
      void this._loadLocale();
    });
  }

  onDisable() {}
}

return new StreakPlugin(context, hooks);
