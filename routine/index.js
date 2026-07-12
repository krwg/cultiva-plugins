class RoutinePlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this._locale = 'en';
    this.settings = { morningHabits: '', eveningHabits: '' };
  }

  _t(key) {
    const en = {
      morning: 'Morning',
      evening: 'Evening',
      empty: 'Add habit names in plugin settings',
      done: 'done',
      pending: 'pending'
    };
    const ru = {
      morning: 'Утро',
      evening: 'Вечер',
      empty: 'Добавьте имена привычек в настройках плагина',
      done: 'готово',
      pending: 'ожидает'
    };
    const dict = this._locale === 'ru' ? ru : en;
    return dict[key] || en[key] || key;
  }

  _escapeHtml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
  }

  _parseNames(raw) {
    return String(raw || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  _matchHabit(habits, name) {
    const needle = name.toLowerCase();
    return habits.find((h) => String(h.name || '').toLowerCase() === needle) || null;
  }

  _sectionHtml(title, names, habits) {
    if (!names.length) {
      return '';
    }
    const items = names.map((name) => {
      const h = this._matchHabit(habits, name);
      const done = h ? h.completedToday : false;
      const cls = done ? 'routine-item routine-item--done' : 'routine-item';
      const mark = done ? '✓' : '○';
      const status = done ? this._t('done') : this._t('pending');
      return `<li class="${cls}" aria-label="${this._escapeHtml(name)} ${status}">
        <span class="routine-mark" aria-hidden="true">${mark}</span>
        <span class="routine-name">${this._escapeHtml(name)}</span>
      </li>`;
    }).join('');
    return `<section class="routine-section">
      <h3 class="routine-heading">${this._escapeHtml(title)}</h3>
      <ul class="routine-list">${items}</ul>
    </section>`;
  }

  async _html() {
    const habits = await this.context.app.getHabits();
    const morning = this._parseNames(this.settings.morningHabits);
    const evening = this._parseNames(this.settings.eveningHabits);
    if (!morning.length && !evening.length) {
      return `<article class="habit-card garden-plugin-card garden-plugin-card--routine" data-category="other">
        <p class="routine-empty">${this._t('empty')}</p>
      </article>`;
    }
    const body = [
      this._sectionHtml(this._t('morning'), morning, habits),
      this._sectionHtml(this._t('evening'), evening, habits)
    ].filter(Boolean).join('');
    return `<article class="habit-card garden-plugin-card garden-plugin-card--routine" data-category="other">${body}</article>`;
  }

  async _refresh() {
    await this._loadLocale();
    await this._loadSettings();
    const html = await this._html();
    this.context.ui.updateGardenHtml(html);
  }

  async onEnable() {
    this.context.ui.registerGardenWidget({
      position: 'top',
      render: (el) => {
        void this._html().then((html) => { el.innerHTML = html; });
      }
    });
    await this._refresh();
    this.hooks.on('onHabitComplete', () => {
      void this._refresh();
    });
    this.hooks.on('onAppStart', () => {
      void this._refresh();
    });
    this.hooks.on('onSettingsChange', (payload) => {
      if (payload?.pluginSettings) {
        this.settings = { ...this.settings, ...payload.pluginSettings };
      }
      void this._refresh();
    });
  }

  onDisable() {}
}

return new RoutinePlugin(context, hooks);
