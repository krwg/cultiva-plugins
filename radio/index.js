

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
    this._locale = 'en';
    this.stations = {
      groovesalad: {
        name: 'Groove Salad',
        tag: 'Chillout',
        urls: [
          'https://ice6.somafm.com/groovesalad-256-mp3',
          'https://ice5.somafm.com/groovesalad-128-mp3',
          'https://ice1.somafm.com/groovesalad-128-mp3'
        ]
      },
      fluid: {
        name: 'Fluid',
        tag: 'Downtempo',
        urls: [
          'https://ice6.somafm.com/fluid-128-mp3',
          'https://ice4.somafm.com/fluid-128-mp3',
          'https://ice2.somafm.com/fluid-128-mp3'
        ]
      },
      beatblender: {
        name: 'Beat Blender',
        tag: 'Beats',
        urls: [
          'https://ice6.somafm.com/beatblender-128-mp3',
          'https://ice2.somafm.com/beatblender-128-mp3',
          'https://ice1.somafm.com/beatblender-128-mp3'
        ]
      },
      dronezone: {
        name: 'Drone Zone',
        tag: 'Ambient',
        urls: [
          'https://ice1.somafm.com/dronezone-256-mp3',
          'https://ice3.somafm.com/dronezone-128-mp3'
        ]
      },
      lush: {
        name: 'Lush',
        tag: 'Sensual',
        urls: [
          'https://ice2.somafm.com/lush-128-mp3',
          'https://ice1.somafm.com/lush-128-mp3'
        ]
      },
      spacestation: {
        name: 'Space Station',
        tag: 'Ambient',
        urls: [
          'https://ice1.somafm.com/spacestation-128-mp3',
          'https://ice6.somafm.com/spacestation-128-mp3'
        ]
      },
      secretagent: {
        name: 'Secret Agent',
        tag: 'Lounge',
        urls: [
          'https://ice1.somafm.com/secretagent-128-mp3',
          'https://ice6.somafm.com/secretagent-128-mp3'
        ]
      },
      radioparadise: {
        name: 'Radio Paradise',
        tag: 'Eclectic',
        urls: [
          'https://stream.radioparadise.com/aac-128',
          'https://stream.radioparadise.com/mp3-128'
        ]
      },
      chillhop: {
        name: 'Chillhop Radio',
        tag: 'Lo-fi',
        urls: [
          'https://stream.chillhop.com/chillhop-radio',
          'https://www.chillhop.com/listen/chillhop-radio'
        ]
      },
      defcon: {
        name: 'DEF CON Radio',
        tag: 'Electronic',
        urls: [
          'https://ice2.somafm.com/defcon-128-mp3',
          'https://ice6.somafm.com/defcon-128-mp3'
        ]
      }
    };
  }

  _t(key) {
    const ru = {
      radio: 'Радио',
      onAir: 'В эфире',
      title: 'Радио',
      sub: 'Интернет-станции · SomaFM и др.',
      stop: 'Стоп',
      refresh: 'Обновить',
      output: 'Громкость',
      sleep: 'Таймер сна',
      off: 'Выкл',
      stations: 'Станции',
      footnote: 'Потоки SomaFM, Radio Paradise, Chillhop. Нужен интернет.',
      playing: 'Играет',
      unavailable: 'Поток недоступен — попробуйте другую станцию.',
      sleepDone: 'Таймер сна завершён — воспроизведение остановлено.'
    };
    const en = {
      radio: 'Radio',
      onAir: 'On air',
      title: 'Radio',
      sub: 'Internet streams · SomaFM & more',
      stop: 'Stop',
      refresh: 'Refresh',
      output: 'Output level',
      sleep: 'Sleep timer',
      off: 'Off',
      stations: 'Stations',
      footnote: 'Streams from SomaFM, Radio Paradise, Chillhop. Requires network.',
      playing: 'Playing',
      unavailable: 'Stream unavailable — try another station.',
      sleepDone: 'Sleep timer ended — playback stopped.'
    };
    const dict = this._locale === 'ru' ? ru : en;
    return dict[key] || key;
  }

  _escapeHtml(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  _headerLabel() {
    if (!this.settings.playing) return this._t('radio');
    const s = this.stations[this.settings.station];
    return s ? s.name : this._t('onAir');
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
      this.context.ui.showNotification('', this._t('sleepDone'));
    }, m * 60 * 1000);
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
    } else {
      const saved = await this.context.storage.get('settings');
      if (saved) {
        this.settings = { ...this.settings, ...saved };
      }
    }
    this._updateHeader();
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

  _stationUrls(stationId) {
    const station = this.stations[stationId];
    if (!station) return [];
    if (Array.isArray(station.urls) && station.urls.length) {
      return station.urls;
    }
    return station.url ? [station.url] : [];
  }

  playStation(stationId, notify) {
    const station = this.stations[stationId];
    const urls = this._stationUrls(stationId);
    if (!station || !urls.length) return;
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    this._tryPlayUrls(stationId, station, urls, 0, notify);
  }

  _tryPlayUrls(stationId, station, urls, index, notify) {
    if (index >= urls.length) {
      this.context.ui.showNotification('', this._t('unavailable'));
      return;
    }
    const audio = new Audio(urls[index]);
    audio.preload = 'none';
    audio.volume = this.settings.volume;
    const fail = () => {
      audio.pause();
      this._tryPlayUrls(stationId, station, urls, index + 1, notify);
    };
    const succeed = () => {
      this.audio = audio;
      this.settings.station = stationId;
      this.settings.playing = true;
      this._updateHeader();
      this._armSleep();
      if (notify !== false) {
        this.context.ui.showNotification('', `${this._t('playing')}: ${station.name}`);
      }
      this.context.storage.set('settings', this.settings);
    };
    audio.addEventListener('error', fail, { once: true });
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(succeed).catch(fail);
    } else {
      succeed();
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
      <div class="cultiva-sheet-title">${this._t('title')}</div>
      <div class="cultiva-sheet-sub">${this._t('sub')}</div>
    </div>
    <button type="button" class="cultiva-sheet-x" data-cultiva-act="close" aria-label="Close">×</button>
  </div>
  <div class="cultiva-sheet-body">
    <div class="radio-toolbar">
      <button type="button" class="cultiva-sheet-secondary" data-cultiva-act="stop">${this._t('stop')}</button>
      <button type="button" class="cultiva-sheet-secondary" data-cultiva-act="refreshSheet">${this._t('refresh')}</button>
    </div>
    <label class="cultiva-field-label">${this._t('output')}</label>
    <input type="range" name="vol" min="0" max="1" step="0.03" value="${this.settings.volume}" data-cultiva-change-act="volume" />
    <div class="cultiva-range-meta"><span>${vol}%</span></div>
    <label class="cultiva-field-label">${this._t('sleep')}</label>
    <div class="cultiva-pill-row">
      <button type="button" class="cultiva-pill${sleep === 0 ? ' is-active' : ''}" data-cultiva-act="sleep" data-minutes="0">${this._t('off')}</button>
      <button type="button" class="cultiva-pill${sleep === 15 ? ' is-active' : ''}" data-cultiva-act="sleep" data-minutes="15">15m</button>
      <button type="button" class="cultiva-pill${sleep === 30 ? ' is-active' : ''}" data-cultiva-act="sleep" data-minutes="30">30m</button>
      <button type="button" class="cultiva-pill${sleep === 60 ? ' is-active' : ''}" data-cultiva-act="sleep" data-minutes="60">60m</button>
    </div>
    <label class="cultiva-field-label">${this._t('stations')}</label>
    <div class="cultiva-radio-scroll">${rows}</div>
    <p class="cultiva-sheet-footnote">${this._t('footnote')}</p>
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
