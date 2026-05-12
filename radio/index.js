// Cultiva Radio Plugin v2.0.0 — SomaFM streams, sleep timer, glass sheet UI (main window bridge)

class RadioPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.settings = {
      station: 'groovesalad',
      volume: 0.45,
      playing: false,
      sleepMinutes: 0
    };
    this.audio = null;
    this.sleepTimer = null;
    this.stations = {
      groovesalad: { name: 'Groove Salad', tag: 'Chillout', url: 'https://ice6.somafm.com/groovesalad-256-mp3' },
      fluid: { name: 'Fluid', tag: 'Downtempo', url: 'https://ice4.somafm.com/fluid-256-mp3' },
      beatblender: { name: 'Beat Blender', tag: 'Beats', url: 'https://ice2.somafm.com/beatblender-256-mp3' },
      dronezone: { name: 'Drone Zone', tag: 'Ambient', url: 'https://ice1.somafm.com/dronezone-256-mp3' },
      defcon: { name: 'DEF CON Radio', tag: 'Electronic', url: 'https://ice2.somafm.com/defcon-128-mp3' }
    };
  }

  _escapeHtml(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  _headerLabel() {
    if (!this.settings.playing) return 'Radio';
    const s = this.stations[this.settings.station];
    return s ? s.name : 'On air';
  }

  _updateHeader() {
    this.context.ui.updateMainHeader({ label: this._headerLabel(), icon: '' });
  }

  _armSleep() {
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }
    const m = this.settings.sleepMinutes | 0;
    if (m <= 0) return;
    this.sleepTimer = setTimeout(() => {
      this.stopRadio();
      this.context.ui.showNotification('', 'Sleep timer ended — playback stopped.');
    }, m * 60 * 1000);
  }

  async onEnable() {
    const saved = await this.context.storage.get('settings');
    if (saved) {
      this.settings = { ...this.settings, ...saved };
    }
    this.context.ui.registerHeaderItem({
      label: this._headerLabel(),
      icon: '',
      onClick: () => this.openRadioModal()
    });
    if (this.settings.playing) {
      this.playStation(this.settings.station, false);
    }
    this._armSleep();
  }

  onDisable() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }
  }

  playStation(stationId, notify) {
    const station = this.stations[stationId];
    if (!station) return;
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    try {
      this.audio = new Audio(station.url);
      this.audio.volume = this.settings.volume;
      this.audio.play().catch(() => {
        this.context.ui.showNotification('', 'Stream unavailable — try another station.');
      });
      this.settings.station = stationId;
      this.settings.playing = true;
      this._updateHeader();
      this._armSleep();
      if (notify !== false) {
        this.context.ui.showNotification('', `Playing: ${station.name}`);
      }
      this.context.storage.set('settings', this.settings);
    } catch (e) {
      console.error('[Radio]', e);
    }
  }

  stopRadio() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    this.settings.playing = false;
    this.context.storage.set('settings', this.settings);
    this._updateHeader();
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }
  }

  openRadioModal() {
    this.context.ui.openMainSheet(this._buildSheetHtml());
  }

  _buildSheetHtml() {
    const vol = Math.round((this.settings.volume || 0) * 100);
    const sleep = this.settings.sleepMinutes | 0;
    const rows = Object.entries(this.stations)
      .map(([id, s]) => {
        const active = this.settings.station === id && this.settings.playing;
        return `<button type="button" class="cultiva-radio-row${active ? ' is-active' : ''}" data-cultiva-act="play" data-station="${id}">
          <span class="cultiva-radio-title">${this._escapeHtml(s.name)}</span>
          <span class="cultiva-radio-tag">${this._escapeHtml(s.tag)}</span>
          <span class="cultiva-radio-state"></span>
        </button>`;
      })
      .join('');
    return `
<div class="cultiva-sheet-overlay" data-cultiva-act="close"></div>
<div class="cultiva-sheet-card cultiva-sheet-card--radio">
  <div class="cultiva-sheet-grabber"></div>
  <div class="cultiva-sheet-head">
    <div>
      <div class="cultiva-sheet-title">Radio</div>
      <div class="cultiva-sheet-sub">Internet streams · SomaFM</div>
    </div>
    <button type="button" class="cultiva-sheet-x" data-cultiva-act="close" aria-label="Close">×</button>
  </div>
  <div class="cultiva-sheet-body">
    <div class="radio-toolbar">
      <button type="button" class="cultiva-sheet-secondary" data-cultiva-act="stop">Stop</button>
      <button type="button" class="cultiva-sheet-secondary" data-cultiva-act="refreshSheet">Refresh list</button>
    </div>
    <label class="cultiva-field-label">Output level</label>
    <input type="range" name="vol" min="0" max="1" step="0.03" value="${this.settings.volume}" data-cultiva-change-act="volume" />
    <div class="cultiva-range-meta"><span>${vol}%</span></div>
    <label class="cultiva-field-label">Sleep timer</label>
    <div class="cultiva-pill-row">
      <button type="button" class="cultiva-pill${sleep === 0 ? ' is-active' : ''}" data-cultiva-act="sleep" data-minutes="0">Off</button>
      <button type="button" class="cultiva-pill${sleep === 15 ? ' is-active' : ''}" data-cultiva-act="sleep" data-minutes="15">15m</button>
      <button type="button" class="cultiva-pill${sleep === 30 ? ' is-active' : ''}" data-cultiva-act="sleep" data-minutes="30">30m</button>
      <button type="button" class="cultiva-pill${sleep === 60 ? ' is-active' : ''}" data-cultiva-act="sleep" data-minutes="60">60m</button>
    </div>
    <label class="cultiva-field-label">Stations</label>
    <div class="cultiva-radio-scroll">${rows}</div>
    <p class="cultiva-sheet-footnote">Streams courtesy of SomaFM. Playback uses your network connection.</p>
  </div>
</div>`;
  }

  async onModalAction(action, payload) {
    if (action === 'volume' && payload && payload.value != null) {
      this.settings.volume = parseFloat(payload.value);
      if (this.audio) this.audio.volume = this.settings.volume;
      await this.context.storage.set('settings', this.settings);
      return;
    }
    if (action === 'sleep' && payload && payload.minutes != null) {
      this.settings.sleepMinutes = parseInt(payload.minutes, 10) || 0;
      await this.context.storage.set('settings', this.settings);
      this._armSleep();
      this.context.ui.openMainSheet(this._buildSheetHtml());
      return;
    }
    if (action === 'play' && payload && payload.stationId) {
      this.playStation(payload.stationId, true);
      this.context.ui.openMainSheet(this._buildSheetHtml());
      return;
    }
    if (action === 'stop') {
      this.stopRadio();
      this.context.ui.openMainSheet(this._buildSheetHtml());
      return;
    }
    if (action === 'refreshSheet') {
      this.context.ui.openMainSheet(this._buildSheetHtml());
    }
  }
}

return new RadioPlugin(context, hooks);
