class GentleNudgePlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this._locale = 'en';
    this.settings = { nudgeHour: '18' };
    this._interval = null;
    this._lastNudgeDate = '';
  }

  _t(key, vars = {}) {
    const en = {
      one: 'Still open today: {name}',
      many: '{count} habits still open today'
    };
    const ru = {
      one: 'Ещё не отмечено сегодня: {name}',
      many: 'Сегодня осталось {count} привычек'
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

  async _loadSettings() {
    const saved = await this.context.storage.get('settings');
    if (saved) {
      this.settings = { ...this.settings, ...saved };
    }
    const last = await this.context.storage.get('lastNudgeDate');
    this._lastNudgeDate = typeof last === 'string' ? last : '';
  }

  async _persistLastNudge(dateKey) {
    this._lastNudgeDate = dateKey;
    await this.context.storage.set('lastNudgeDate', dateKey);
  }

  _nudgeHour() {
    const h = parseInt(this.settings.nudgeHour, 10);
    return Number.isFinite(h) && h >= 0 && h <= 23 ? h : 18;
  }

  /**
   * Hour aligned with `app.getToday()` / app timezone when available.
   * Cultiva `getToday` uses the app TZ, or UTC ISO date when timezone is `auto`.
   * Fallback: local wall-clock hour (may disagree with getToday if hosts differ).
   */
  async _currentHour() {
    const app = this.context.app;
    if (app && typeof app.getTimezone === 'function') {
      try {
        const tz = await app.getTimezone();
        if (tz && tz !== 'auto') {
          const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hour: 'numeric',
            hourCycle: 'h23',
            hour12: false
          }).formatToParts(new Date());
          const raw = parts.find((p) => p.type === 'hour')?.value;
          const h = parseInt(raw, 10);
          if (Number.isFinite(h)) {
            return ((h % 24) + 24) % 24;
          }
        }
        // Match getTodayInTZ('auto') which uses UTC calendar date.
        return new Date().getUTCHours();
      } catch {
        void 0;
      }
    }
    return new Date().getHours();
  }

  async _maybeNudge() {
    await this._loadLocale();
    const appSettings = await this.context.app.getSettings();
    if (appSettings && appSettings.focusMode) {
      return;
    }
    const hour = await this._currentHour();
    if (hour < this._nudgeHour()) {
      return;
    }
    const todayKey = await this.context.app.getToday();
    if (this._lastNudgeDate === todayKey) {
      return;
    }
    const habits = await this.context.app.getHabits();
    const open = habits.filter((h) => !h.completedToday);
    if (!open.length) {
      return;
    }
    const text = open.length === 1
      ? this._t('one', { name: open[0].name })
      : this._t('many', { count: open.length });
    await this.context.ui.showNotification('', text);
    await this._persistLastNudge(todayKey);
  }

  _startInterval() {
    this._clearInterval();
    this._interval = setInterval(() => {
      void this._maybeNudge();
    }, 60 * 1000);
    void this._maybeNudge();
  }

  _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  async onEnable() {
    await this._loadLocale();
    await this._loadSettings();
    this.hooks.on('onAppStart', () => {
      void this._loadSettings().then(() => this._startInterval());
    });
    this.hooks.on('onSettingsChange', (payload) => {
      if (payload?.pluginSettings) {
        this.settings = { ...this.settings, ...payload.pluginSettings };
      }
      void this._loadLocale();
    });
    this._startInterval();
  }

  onDisable() {
    this._clearInterval();
  }
}

return new GentleNudgePlugin(context, hooks);
