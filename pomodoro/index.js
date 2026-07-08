class PomodoroPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.settings = { workMinutes: 25, breakMinutes: 5 };
    this.phase = 'idle';
    this.remaining = 0;
    this.endTimestamp = 0;
    this.tick = null;
  }

  _escapeHtml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  _label() {
    if (this.phase === 'idle') {
      return 'Pomodoro';
    }
    const m = Math.ceil(this.remaining / 60);
    const tag = this.phase === 'work' ? 'Focus' : 'Break';
    return `${tag} ${m}m`;
  }

  _updateHeader() {
    this.context.ui.updateMainHeader({ label: this._label(), icon: '🍅' });
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
      icon: '🍅',
      onClick: () => this.openModal()
    });
  }

  onDisable() {
    this._clearTick();
    void this._persistState();
  }

  openModal() {
    const work = this.settings.workMinutes;
    const brk = this.settings.breakMinutes;
    const status = this.phase === 'idle'
      ? 'Ready to focus'
      : `${this.phase === 'work' ? 'Focus' : 'Break'} — ${Math.ceil(this.remaining / 60)} min left`;
    this.context.ui.openMainSheet(`
      <div class="cultiva-sheet-overlay" data-cultiva-act="close"></div>
      <div class="cultiva-sheet-card pomodoro-sheet">
        <div class="cultiva-sheet-header">
          <span>🍅 Pomodoro</span>
          <button type="button" data-cultiva-act="close">✕</button>
        </div>
        <p class="pomodoro-status">${this._escapeHtml(status)}</p>
        <div class="pomodoro-actions">
          <button type="button" class="pomodoro-btn" data-cultiva-act="startWork">Start ${work}m focus</button>
          <button type="button" class="pomodoro-btn secondary" data-cultiva-act="startBreak">Start ${brk}m break</button>
          <button type="button" class="pomodoro-btn ghost" data-cultiva-act="stop">Stop</button>
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
        const msg = finishedPhase === 'work' ? 'Focus session complete — take a break!' : 'Break over — back to the garden!';
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
