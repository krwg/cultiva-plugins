class PomodoroPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.settings = { workMinutes: 25, breakMinutes: 5 };
    this.phase = 'idle';
    this.remaining = 0;
    this.endTimestamp = 0;
    this.tick = null;
    this._locale = 'en';
  }

  _t(key) {
    const ru = {
      idle: 'Помодоро',
      focus: 'Фокус',
      break: 'Перерыв',
      ready: 'Готовы к фокусу',
      title: 'Помодоро',
      workDone: 'Фокус завершён — сделайте перерыв!',
      breakDone: 'Перерыв окончен — возвращайтесь в сад!'
    };
    const en = {
      idle: 'Pomodoro',
      focus: 'Focus',
      break: 'Break',
      ready: 'Ready to focus',
      title: 'Pomodoro',
      workDone: 'Focus session complete — take a break!',
      breakDone: 'Break over — back to the garden!'
    };
    const dict = this._locale === 'ru' ? ru : en;
    return dict[key] || en[key] || key;
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
      return this._t('idle');
    }
    const tag = this.phase === 'work' ? this._t('focus') : this._t('break');
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
    if (savedTimer && savedTimer.endTimestamp) {
      const phase = savedTimer.phase === 'work' || savedTimer.phase === 'break' ? savedTimer.phase : null;
      if (phase) {
        const now = Date.now();
        const left = Math.max(0, Math.floor((Number(savedTimer.endTimestamp) - now) / 1000));
        if (left > 0) {
          this.phase = phase;
          this.endTimestamp = Number(savedTimer.endTimestamp);
          this.remaining = left;
          this._startTick();
        }
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
    const ru = this._locale === 'ru';
    const status = this.phase === 'idle'
      ? this._t('ready')
      : `${this.phase === 'work' ? this._t('focus') : this._t('break')} — ${this._formatRemaining()}`;
    const title = this._t('title');
    const sub = ru ? `${work} мин фокус · ${brk} мин перерыв` : `${work}m focus · ${brk}m break`;
    const btnWork = ru ? `Старт ${work} мин` : `Start ${work}m focus`;
    const btnBreak = ru ? `Перерыв ${brk} мин` : `Start ${brk}m break`;
    const btnStop = ru ? 'Стоп' : 'Stop';
    this.context.ui.openMainSheet(`
      <div class="cultiva-sheet-overlay" data-cultiva-act="close"></div>
      <div class="cultiva-sheet-card cultiva-sheet-card--pomodoro">
        <div class="cultiva-sheet-grabber"></div>
        <div class="cultiva-sheet-head">
          <div>
            <div class="cultiva-sheet-title">${title}</div>
            <div class="cultiva-sheet-sub">${sub}</div>
          </div>
          <button type="button" class="cultiva-sheet-x" data-cultiva-act="close" aria-label="Close">×</button>
        </div>
        <div class="cultiva-sheet-body">
          <div class="pomodoro-hero">
            <div class="pomodoro-hero-letter">P</div>
            <div class="pomodoro-hero-timer">${this.phase === 'idle' ? `${String(work).padStart(2, '0')}:00` : this._formatRemaining()}</div>
            <div class="pomodoro-hero-status">${this._escapeHtml(status)}</div>
          </div>
          <div class="pomodoro-actions">
            <button type="button" class="cultiva-sheet-primary pomodoro-btn--focus" data-cultiva-act="startWork">${btnWork}</button>
            <button type="button" class="cultiva-sheet-secondary pomodoro-btn--break" data-cultiva-act="startBreak">${btnBreak}</button>
            <button type="button" class="cultiva-sheet-secondary pomodoro-btn--ghost" data-cultiva-act="stop">${btnStop}</button>
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
        const msg = finishedPhase === 'work' ? this._t('workDone') : this._t('breakDone');
        this.context.ui.showNotification('', msg);
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

return new PomodoroPlugin(context, hooks);
