class FocusSessionPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.settings = { workMinutes: 25, breakMinutes: 5, linkedHabitName: '' };
    this.phase = 'idle';
    this.remaining = 0;
    this.endTimestamp = 0;
    this.tick = null;
    this._locale = 'en';
  }

  _escapeHtml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  _formatRemaining() {
    const m = Math.floor(this.remaining / 60);
    const s = this.remaining % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  _label() {
    if (this.phase === 'idle') {
      return this._locale === 'ru' ? 'Фокус' : 'Focus';
    }
    const tag = this.phase === 'work'
      ? (this._locale === 'ru' ? 'Фокус' : 'Focus')
      : (this._locale === 'ru' ? 'Перерыв' : 'Break');
    return `${tag} ${this._formatRemaining()}`;
  }

  _updateHeader() {
    this.context.ui.updateMainHeader({ label: this._label(), icon: '' });
  }

  _clearTick() {
    if (this.tick) {
      clearInterval(this.tick);
      this.tick = null;
    }
  }

  async _persistState() {
    await this.context.storage.set('settings', this.settings);
    await this.context.storage.set('timerState', {
      phase: this.phase,
      endTimestamp: this.endTimestamp
    });
  }

  async _findLinkedHabit() {
    const name = String(this.settings.linkedHabitName || '').trim();
    if (!name) {
      return null;
    }
    const habits = await this.context.app.getHabits();
    const needle = name.toLowerCase();
    return habits.find((h) => String(h.name || '').toLowerCase() === needle) || null;
  }

  async _completeLinkedHabit() {
    const habit = await this._findLinkedHabit();
    if (!habit || habit.completedToday) {
      return;
    }
    try {
      await this.context.app.completeHabit(habit.id);
    } catch {
      void 0;
    }
  }

  async onEnable() {
    if (this.context.app && typeof this.context.app.getLocale === 'function') {
      try {
        this._locale = await this.context.app.getLocale();
      } catch {
        this._locale = 'en';
      }
    }
    const saved = await this.context.storage.get('settings');
    if (saved) {
      this.settings = { ...this.settings, ...saved };
      this.settings.workMinutes = parseInt(this.settings.workMinutes, 10) || 25;
      this.settings.breakMinutes = parseInt(this.settings.breakMinutes, 10) || 5;
    }
    const savedTimer = await this.context.storage.get('timerState');
    if (savedTimer && savedTimer.phase && savedTimer.endTimestamp) {
      const now = Date.now();
      const left = Math.max(0, Math.floor((Number(savedTimer.endTimestamp) - now) / 1000));
      if (left > 0) {
        this.phase = savedTimer.phase;
        this.endTimestamp = Number(savedTimer.endTimestamp);
        this.remaining = left;
        this._startTick();
      }
    }
    this.context.ui.registerHeaderItem({
      label: this._label(),
      icon: '',
      onClick: () => this.openModal()
    });
    this.hooks.on('onSettingsChange', (payload) => {
      void this.onSettingsChange(payload);
    });
  }

  async onSettingsChange(payload) {
    if (this.context.app && typeof this.context.app.getLocale === 'function') {
      try {
        this._locale = await this.context.app.getLocale();
      } catch {
        this._locale = 'en';
      }
    }
    if (payload?.pluginSettings) {
      this.settings = { ...this.settings, ...payload.pluginSettings };
      this.settings.workMinutes = parseInt(this.settings.workMinutes, 10) || 25;
      this.settings.breakMinutes = parseInt(this.settings.breakMinutes, 10) || 5;
    }
    this._updateHeader();
  }

  onDisable() {
    this._clearTick();
    void this._persistState();
  }

  openModal() {
    const work = this.settings.workMinutes;
    const brk = this.settings.breakMinutes;
    const linked = String(this.settings.linkedHabitName || '').trim();
    const ru = this._locale === 'ru';
    const status = this.phase === 'idle'
      ? (ru ? 'Готовы к фокусу' : 'Ready to focus')
      : `${this.phase === 'work' ? (ru ? 'Фокус' : 'Focus') : (ru ? 'Перерыв' : 'Break')} — ${this._formatRemaining()}`;
    const title = ru ? 'Сессия фокуса' : 'Focus Session';
    const sub = linked
      ? (ru ? `Связано: ${linked}` : `Linked: ${linked}`)
      : (ru ? `${work} мин фокус · ${brk} мин перерыв` : `${work}m focus · ${brk}m break`);
    const btnWork = ru ? `Старт ${work} мин` : `Start ${work}m focus`;
    const btnBreak = ru ? `Перерыв ${brk} мин` : `Start ${brk}m break`;
    const btnStop = ru ? 'Стоп' : 'Stop';
    this.context.ui.openMainSheet(`
      <div class="cultiva-sheet-overlay" data-cultiva-act="close"></div>
      <div class="cultiva-sheet-card cultiva-sheet-card--focus-session">
        <div class="cultiva-sheet-grabber"></div>
        <div class="cultiva-sheet-head">
          <div>
            <div class="cultiva-sheet-title">${title}</div>
            <div class="cultiva-sheet-sub">${this._escapeHtml(sub)}</div>
          </div>
          <button type="button" class="cultiva-sheet-x" data-cultiva-act="close" aria-label="Close">×</button>
        </div>
        <div class="cultiva-sheet-body">
          <div class="focus-session-hero">
            <div class="focus-session-hero-letter">F</div>
            <div class="focus-session-hero-timer">${this.phase === 'idle' ? `${String(work).padStart(2, '0')}:00` : this._formatRemaining()}</div>
            <div class="focus-session-hero-status">${this._escapeHtml(status)}</div>
          </div>
          <div class="focus-session-actions">
            <button type="button" class="cultiva-sheet-primary focus-session-btn--focus" data-cultiva-act="startWork">${btnWork}</button>
            <button type="button" class="cultiva-sheet-secondary focus-session-btn--break" data-cultiva-act="startBreak">${btnBreak}</button>
            <button type="button" class="cultiva-sheet-secondary focus-session-btn--ghost" data-cultiva-act="stop">${btnStop}</button>
          </div>
        </div>
      </div>`);
  }

  _startPhase(phase, minutes) {
    this._clearTick();
    this.phase = phase;
    this.remaining = minutes * 60;
    this.endTimestamp = Date.now() + this.remaining * 1000;
    this._updateHeader();
    this._startTick();
    void this._persistState();
  }

  _startTick() {
    this._clearTick();
    this.tick = setInterval(() => {
      this.remaining = Math.max(0, Math.floor((this.endTimestamp - Date.now()) / 1000));
      this._updateHeader();
      if (this.remaining <= 0) {
        const finishedPhase = this.phase;
        this._clearTick();
        this.phase = 'idle';
        this.endTimestamp = 0;
        this._updateHeader();
        const ru = this._locale === 'ru';
        if (finishedPhase === 'work') {
          void this._completeLinkedHabit();
          this.context.ui.showNotification('', ru ? 'Сессия фокуса завершена!' : 'Focus session complete!');
        } else {
          this.context.ui.showNotification('', ru ? 'Перерыв окончен!' : 'Break over — back to the garden!');
        }
        void this._persistState();
      }
    }, 1000);
  }

  async onModalAction(action) {
    if (action === 'startWork') {
      this._startPhase('work', this.settings.workMinutes);
      this.context.ui.closeMainSheet();
      return;
    }
    if (action === 'startBreak') {
      this._startPhase('break', this.settings.breakMinutes);
      this.context.ui.closeMainSheet();
      return;
    }
    if (action === 'stop') {
      this._clearTick();
      this.phase = 'idle';
      this.remaining = 0;
      this.endTimestamp = 0;
      this._updateHeader();
      await this._persistState();
      this.context.ui.closeMainSheet();
    }
  }
}

return new FocusSessionPlugin(context, hooks);
