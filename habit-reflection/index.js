const MAX_TEXT_LENGTH = 1000;

class HabitReflectionPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this._locale = 'en';
    this._pendingHabit = null;
    this._journal = [];
  }

  _t(key, vars = {}) {
    const en = {
      title: 'Reflection',
      prompt: 'How did {name} feel today?',
      placeholder: 'One line — optional',
      save: 'Save',
      skip: 'Skip',
      saved: 'Reflection saved'
    };
    const ru = {
      title: 'Рефлексия',
      prompt: 'Как прошла «{name}» сегодня?',
      placeholder: 'Одна строка — по желанию',
      save: 'Сохранить',
      skip: 'Пропустить',
      saved: 'Запись сохранена'
    };
    const dict = this._locale === 'ru' ? ru : en;
    let text = dict[key] || en[key] || key;
    Object.keys(vars).forEach((k) => {
      text = text.replace(`{${k}}`, String(vars[k]));
    });
    return text;
  }

  _escapeHtml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

  async _loadJournal() {
    const raw = await this.context.storage.get('journal');
    this._journal = Array.isArray(raw) ? raw : [];
  }

  async _saveJournal() {
    await this.context.storage.set('journal', this._journal);
  }

  _habitName(habit) {
    return habit && (habit.treeName || habit.name) ? (habit.treeName || habit.name) : 'Habit';
  }

  _sheetHtml(habit) {
    const name = this._habitName(habit);
    return `
      <div class="cultiva-sheet-overlay" data-cultiva-act="close"></div>
      <div class="cultiva-sheet-card cultiva-sheet-card--reflection">
        <div class="cultiva-sheet-grabber"></div>
        <div class="cultiva-sheet-head">
          <div>
            <div class="cultiva-sheet-title">${this._t('title')}</div>
            <div class="cultiva-sheet-sub">${this._escapeHtml(this._t('prompt', { name }))}</div>
          </div>
          <button type="button" class="cultiva-sheet-x" data-cultiva-act="close" aria-label="Close">×</button>
        </div>
        <div class="cultiva-sheet-body">
          <textarea class="reflection-textarea" data-cultiva-field="reflectionText" rows="3" maxlength="${MAX_TEXT_LENGTH}" placeholder="${this._escapeHtml(this._t('placeholder'))}"></textarea>
          <div class="reflection-actions">
            <button type="button" class="cultiva-sheet-primary" data-cultiva-act="saveReflection">${this._t('save')}</button>
            <button type="button" class="cultiva-sheet-secondary reflection-skip" data-cultiva-act="skipReflection">${this._t('skip')}</button>
          </div>
        </div>
      </div>`;
  }

  _openSheet(habit) {
    this._pendingHabit = habit;
    this.context.ui.openMainSheet(this._sheetHtml(habit));
  }

  async onEnable() {
    await this._loadLocale();
    await this._loadJournal();

    this.hooks.on('onHabitComplete', (habit) => {
      void this._loadLocale().then(() => this._openSheet(habit));
    });

    this.hooks.on('onSettingsChange', () => {
      void this._loadLocale();
    });
  }

  async onModalAction(action, payload) {
    if (action === 'close' || action === 'skipReflection') {
      this._pendingHabit = null;
      this.context.ui.closeMainSheet();
      return;
    }
    if (action === 'saveReflection') {
      const text = String(payload?.reflectionText || '').trim().slice(0, MAX_TEXT_LENGTH);
      const habit = this._pendingHabit;
      if (text && habit) {
        const today = this.context.app && typeof this.context.app.getToday === 'function'
          ? await this.context.app.getToday()
          : new Date().toISOString().slice(0, 10);
        this._journal.unshift({
          habitId: habit.id || '',
          habitName: this._habitName(habit),
          date: today,
          text,
          savedAt: new Date().toISOString()
        });
        if (this._journal.length > 200) {
          this._journal.length = 200;
        }
        await this._saveJournal();
        this.context.ui.showNotification('', this._t('saved'));
      }
      this._pendingHabit = null;
      this.context.ui.closeMainSheet();
    }
  }

  onDisable() {}
}

return new HabitReflectionPlugin(context, hooks);
