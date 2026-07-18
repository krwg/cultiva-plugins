
class RadioPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.settings = {
      station: 'groovesalad',
      volume: 0.45,
      playing: false,
      sleepMinutes: 0,
      customUrl: '',
      customHistory: [],
      visualFx: false
    };
    this.audio = null;
    this.sleepTimer = null;
    this._locale = 'en';
    this._streamFailed = false;
    this._lastFailReason = null;
    this._playId = 0;
    this._playPromise = null;
    this._customResolvedUrls = null;
    this._stationFilter = '';
    this._baseStations = {
      groovesalad: {
        name: 'Groove Salad',
        tag: 'Chillout',
        genre: 'chillout',
        urls: [
          'https://ice6.somafm.com/groovesalad-256-mp3',
          'https://ice5.somafm.com/groovesalad-128-mp3',
          'https://ice1.somafm.com/groovesalad-128-mp3'
        ]
      },
      gsclassic: {
        name: 'Groove Salad Classic',
        tag: 'Chillout',
        genre: 'chillout',
        urls: [
          'https://ice6.somafm.com/gsclassic-128-mp3',
          'https://ice4.somafm.com/gsclassic-128-mp3',
          'https://ice2.somafm.com/gsclassic-128-mp3'
        ]
      },
      fluid: {
        name: 'Fluid',
        tag: 'Downtempo',
        genre: 'downtempo',
        urls: [
          'https://ice6.somafm.com/fluid-128-mp3',
          'https://ice4.somafm.com/fluid-128-mp3',
          'https://ice2.somafm.com/fluid-128-mp3'
        ]
      },
      beatblender: {
        name: 'Beat Blender',
        tag: 'Beats',
        genre: 'beats',
        urls: [
          'https://ice6.somafm.com/beatblender-128-mp3',
          'https://ice2.somafm.com/beatblender-128-mp3',
          'https://ice1.somafm.com/beatblender-128-mp3'
        ]
      },
      dronezone: {
        name: 'Drone Zone',
        tag: 'Ambient',
        genre: 'ambient',
        urls: [
          'https://ice1.somafm.com/dronezone-256-mp3',
          'https://ice3.somafm.com/dronezone-128-mp3'
        ]
      },
      lush: {
        name: 'Lush',
        tag: 'Sensual',
        genre: 'sensual',
        urls: [
          'https://ice2.somafm.com/lush-128-mp3',
          'https://ice1.somafm.com/lush-128-mp3'
        ]
      },
      spacestation: {
        name: 'Space Station',
        tag: 'Ambient',
        genre: 'ambient',
        urls: [
          'https://ice1.somafm.com/spacestation-128-mp3',
          'https://ice6.somafm.com/spacestation-128-mp3'
        ]
      },
      secretagent: {
        name: 'Secret Agent',
        tag: 'Lounge',
        genre: 'lounge',
        urls: [
          'https://ice1.somafm.com/secretagent-128-mp3',
          'https://ice6.somafm.com/secretagent-128-mp3'
        ]
      },
      u80s: {
        name: 'Underground 80s',
        tag: 'Synthpop',
        genre: 'electronic',
        urls: [
          'https://ice6.somafm.com/u80s-128-mp3',
          'https://ice4.somafm.com/u80s-128-mp3',
          'https://ice2.somafm.com/u80s-128-mp3'
        ]
      },
      indiepop: {
        name: 'Indie Pop Rocks',
        tag: 'Indie',
        genre: 'indie',
        urls: [
          'https://ice6.somafm.com/indiepop-128-mp3',
          'https://ice4.somafm.com/indiepop-128-mp3',
          'https://ice1.somafm.com/indiepop-128-mp3'
        ]
      },
      deepspaceone: {
        name: 'Deep Space One',
        tag: 'Space',
        genre: 'space',
        urls: [
          'https://ice6.somafm.com/deepspaceone-128-mp3',
          'https://ice2.somafm.com/deepspaceone-128-mp3',
          'https://ice1.somafm.com/deepspaceone-128-mp3'
        ]
      },
      radioparadise: {
        name: 'Radio Paradise',
        tag: 'Eclectic',
        genre: 'eclectic',
        urls: [
          'https://stream.radioparadise.com/aac-128',
          'https://stream.radioparadise.com/mp3-128'
        ]
      },
      chillhop: {
        name: 'Chillhop Radio',
        tag: 'Lo-fi',
        genre: 'lofi',
        urls: [
          'https://stream.chillhop.com/chillhop-radio'
        ]
      },
      defcon: {
        name: 'DEF CON Radio',
        tag: 'Electronic',
        genre: 'electronic',
        urls: [
          'https://ice2.somafm.com/defcon-128-mp3',
          'https://ice6.somafm.com/defcon-128-mp3'
        ]
      },
      synphaera: {
        name: 'Synphaera',
        tag: 'Space',
        genre: 'space',
        urls: [
          'https://ice6.somafm.com/synphaera-128-mp3',
          'https://ice2.somafm.com/synphaera-128-mp3'
        ]
      },
      thetrip: {
        name: 'The Trip',
        tag: 'Progressive',
        genre: 'electronic',
        urls: [
          'https://ice6.somafm.com/thetrip-128-mp3',
          'https://ice2.somafm.com/thetrip-128-mp3'
        ]
      },
      seventies: {
        name: 'Left Coast 70s',
        tag: 'Mellow',
        genre: 'eclectic',
        urls: [
          'https://ice6.somafm.com/seventies-128-mp3',
          'https://ice2.somafm.com/seventies-128-mp3'
        ]
      },
      bootliquor: {
        name: 'Boot Liquor',
        tag: 'Americana',
        genre: 'indie',
        urls: [
          'https://ice6.somafm.com/bootliquor-128-mp3',
          'https://ice2.somafm.com/bootliquor-128-mp3'
        ]
      },
      illstreet: {
        name: 'Illinois Street Lounge',
        tag: 'Lounge',
        genre: 'lounge',
        urls: [
          'https://ice6.somafm.com/illstreet-128-mp3',
          'https://ice2.somafm.com/illstreet-128-mp3'
        ]
      },
      metal: {
        name: 'Metal Detector',
        tag: 'Metal',
        genre: 'electronic',
        urls: [
          'https://ice6.somafm.com/metal-128-mp3',
          'https://ice2.somafm.com/metal-128-mp3'
        ]
      },
      sonicuniverse: {
        name: 'Sonic Universe',
        tag: 'Jazz',
        genre: 'eclectic',
        urls: [
          'https://ice6.somafm.com/sonicuniverse-128-mp3',
          'https://ice2.somafm.com/sonicuniverse-128-mp3'
        ]
      },
      vaporwaves: {
        name: 'Vaporwaves',
        tag: 'Vaporwave',
        genre: 'lofi',
        urls: [
          'https://ice6.somafm.com/vaporwaves-128-mp3',
          'https://ice2.somafm.com/vaporwaves-128-mp3'
        ]
      },
      cliqhop: {
        name: 'cliqhop idm',
        tag: 'IDM',
        genre: 'electronic',
        urls: [
          'https://ice6.somafm.com/cliqhop-128-mp3',
          'https://ice2.somafm.com/cliqhop-128-mp3'
        ]
      },
      missioncontrol: {
        name: 'Mission Control',
        tag: 'Ambient',
        genre: 'ambient',
        urls: [
          'https://ice6.somafm.com/missioncontrol-128-mp3',
          'https://ice2.somafm.com/missioncontrol-128-mp3'
        ]
      }
    };
    this.stations = { ...this._baseStations };
  }

  _t(key) {
    const ru = {
      radio: 'Радио',
      onAir: 'В эфире',
      title: 'Радио',
      sub: 'Интернет-станции · SomaFM и др.',
      stop: 'Стоп',
      play: 'Играть',
      pause: 'Пауза',
      prev: 'Предыдущая',
      next: 'Следующая',
      refresh: 'Обновить',
      output: 'Громкость',
      sleep: 'Таймер сна',
      off: 'Выкл',
      stations: 'Станции',
      customUrl: 'Свой поток',
      customPlay: 'Слушать',
      customName: 'Свой поток',
      customTag: 'URL',
      customHint: 'Прямой MP3/AAC, .m3u / .pls или несколько URL через пробел/строку',
      customHistory: 'Недавние потоки',
      customClearHistory: 'Очистить',
      resolving: 'Разбор плейлиста…',
      invalidUrl: 'Не удалось найти рабочий поток в этой ссылке.',
      footnote: 'Потоки SomaFM, Radio Paradise, Chillhop. Нужен интернет.',
      playing: 'Играет',
      stopped: 'Остановлено',
      nowPlaying: 'Сейчас играет',
      connecting: 'Подключение…',
      unavailable: 'Поток недоступен — попробуйте другую станцию или .m3u/.pls вместо страницы.',
      autoplayBlocked: 'Автовоспроизведение заблокировано — нажмите станцию.',
      sleepDone: 'Таймер сна завершён — воспроизведение остановлено.',
      visualFx: 'Визуальные эффекты',
      visualFxOn: 'Нео вкл',
      visualFxOff: 'Нео выкл',
      filterStations: 'Фильтр станций',
      close: 'Закрыть'
    };
    const en = {
      radio: 'Radio',
      onAir: 'On air',
      title: 'Radio',
      sub: 'Internet streams · SomaFM & more',
      stop: 'Stop',
      play: 'Play',
      pause: 'Pause',
      prev: 'Previous',
      next: 'Next',
      refresh: 'Refresh',
      output: 'Output level',
      sleep: 'Sleep timer',
      off: 'Off',
      stations: 'Stations',
      customUrl: 'Custom stream',
      customPlay: 'Play',
      customName: 'Custom stream',
      customTag: 'URL',
      customHint: 'Direct MP3/AAC, .m3u / .pls, or several URLs separated by space/newline',
      customHistory: 'Recent streams',
      customClearHistory: 'Clear',
      resolving: 'Resolving playlist…',
      invalidUrl: 'Could not find a playable stream in that link.',
      footnote: 'Streams from SomaFM, Radio Paradise, Chillhop. Requires network.',
      playing: 'Playing',
      stopped: 'Stopped',
      nowPlaying: 'Now playing',
      connecting: 'Connecting…',
      unavailable: 'Stream unavailable — try another station, or paste a .m3u/.pls instead of a web page.',
      autoplayBlocked: 'Autoplay blocked — tap a station to play.',
      sleepDone: 'Sleep timer ended — playback stopped.',
      visualFx: 'Visual effects',
      visualFxOn: 'Neo on',
      visualFxOff: 'Neo off',
      filterStations: 'Filter stations',
      close: 'Close'
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

  _escapeAttr(s) {
    return this._escapeHtml(s);
  }

  _notify(message) {
    if (this.context.ui && typeof this.context.ui.showNotification === 'function') {
      this.context.ui.showNotification('', message);
    }
  }

  _syncStationsMap() {
    const url = typeof this.settings.customUrl === 'string' ? this.settings.customUrl.trim() : '';
    this.stations = { ...this._baseStations };
    if (url || (this._customResolvedUrls && this._customResolvedUrls.length)) {
      const urls = (this._customResolvedUrls && this._customResolvedUrls.length)
        ? this._customResolvedUrls
        : [url];
      this.stations.custom = {
        name: this._t('customName'),
        tag: this._t('customTag'),
        genre: 'custom',
        urls
      };
    }
  }

  _extractUrls(raw) {
    const text = String(raw || '').trim();
    if (!text) {
      return [];
    }
    const found = text.match(/https?:\/\/[^\s<>"'`]+/gi) || [];
    if (found.length) {
      return [...new Set(found.map((u) => u.replace(/[.,;:!?)\]}>]+$/g, '')))];
    }
    if (/^[\w.-]+\.[a-z]{2,}([/:].*)?$/i.test(text)) {
      return [`https://${text}`];
    }
    return [];
  }

  _looksLikePlaylist(url) {
    const u = String(url || '').toLowerCase();
    return /\.pls($|\?)/.test(u)
      || /\.m3u8?($|\?)/.test(u)
      || /\/m3u\//.test(u)
      || /somafm\.com\/[^/]+\.pls/.test(u)
      || /somafm\.com\/[^/]+\d*\.pls/.test(u);
  }

  _parsePlaylistText(text, playlistUrl) {
    const body = String(text || '');
    const urls = [];
    if (/\[playlist\]/i.test(body) || /\.pls/i.test(playlistUrl)) {
      for (const m of body.matchAll(/File\d+=\s*(.+)/gi)) {
        const line = String(m[1] || '').trim();
        if (/^https?:\/\//i.test(line)) {
          urls.push(line);
        }
      }
    }
    for (const line of body.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) {
        continue;
      }
      if (/^https?:\/\//i.test(t)) {
        urls.push(t.replace(/[.,;:!?)\]}>]+$/g, ''));
      }
    }
    return [...new Set(urls)].filter((u) => !/\.m3u8($|\?)/i.test(u));
  }

  async _fetchPlaylistUrls(playlistUrl) {
    try {
      const res = await fetch(playlistUrl, { method: 'GET', cache: 'no-store' });
      if (!res.ok) {
        return [];
      }
      const text = await res.text();
      return this._parsePlaylistText(text, playlistUrl);
    } catch {
      return [];
    }
  }

  async _resolveStreamUrls(raw) {
    const candidates = this._extractUrls(raw);
    if (!candidates.length) {
      return [];
    }
    const out = [];
    for (const u of candidates) {
      if (/\.m3u8($|\?)/i.test(u)) {
        continue;
      }
      if (this._looksLikePlaylist(u)) {
        const resolved = await this._fetchPlaylistUrls(u);
        out.push(...resolved);
      } else {
        out.push(u);
      }
    }
    return [...new Set(out)].slice(0, 10);
  }

  _pushCustomHistory(entry) {
    const value = String(entry || '').trim();
    if (!value) {
      return;
    }
    const prev = Array.isArray(this.settings.customHistory) ? this.settings.customHistory : [];
    const next = [value, ...prev.filter((x) => x !== value)];
    this.settings.customHistory = next.slice(0, 8);
  }

  _syncTray() {
    const station = this._currentStation();
    const playing = !!this.settings.playing && station;
    try {
      if (playing) {
        this.context.ui.setTrayTooltip?.(`♪ ${station.name}`);
        this.context.ui.registerTrayItems?.([
          { id: 'radio-now', label: `♪ ${station.name}`, enabled: true },
          { id: 'radio-toggle', label: this._t('pause'), enabled: true }
        ]);
      } else {
        this.context.ui.setTrayTooltip?.('');
        this.context.ui.clearTrayItems?.();
      }
    } catch {
      void 0;
    }
  }

  async onTrayAction(id) {
    if (id === 'radio-toggle' || id === 'radio-now') {
      if (id === 'radio-now') {
        this.openRadioModal();
        return;
      }
      await this.togglePlayPause();
      this._syncTray();
    }
  }

  _stationIds() {
    this._syncStationsMap();
    return Object.keys(this.stations);
  }

  _normalizeSettings(raw) {
    const s = { ...this.settings, ...raw };
    if (typeof s.volume === 'string') {
      s.volume = parseFloat(s.volume);
    }
    if (!Number.isFinite(s.volume)) {
      s.volume = 0.45;
    }
    if (typeof s.sleepMinutes === 'string') {
      s.sleepMinutes = parseInt(s.sleepMinutes, 10) || 0;
    }
    if (typeof s.customUrl !== 'string') {
      s.customUrl = s.customUrl == null ? '' : String(s.customUrl);
    }
    s.customUrl = s.customUrl.trim();
    if (!Array.isArray(s.customHistory)) {
      s.customHistory = [];
    }
    s.customHistory = s.customHistory
      .map((x) => String(x || '').trim())
      .filter(Boolean)
      .slice(0, 8);
    s.visualFx = s.visualFx === true || s.visualFx === 'true';
    if (s.station === 'custom') {
      if (!s.customUrl) {
        s.station = 'groovesalad';
      }
    } else if (!this._baseStations[s.station]) {
      s.station = 'groovesalad';
    }
    return s;
  }

  _isAutoplayError(err) {
    if (!err) return false;
    if (err.name === 'NotAllowedError') return true;
    const msg = String(err.message || '');
    return /autoplay|user.?gesture|not allowed/i.test(msg);
  }

  _failMessage() {
    return this._t(this._lastFailReason === 'autoplayBlocked' ? 'autoplayBlocked' : 'unavailable');
  }

  _currentStation() {
    this._syncStationsMap();
    return this.stations[this.settings.station] || null;
  }

  _headerLabel() {
    if (this._streamFailed) {
      return this._failMessage();
    }
    if (!this.settings.playing) return this._t('radio');
    const s = this._currentStation();
    return s ? s.name : this._t('onAir');
  }

  _updateHeader() {
    this.context.ui.updateMainHeader({ label: this._headerLabel(), icon: '' });
    this._syncTray();
  }

  _refreshSheet() {
    this.context.ui.openMainSheet(this._buildSheetHtml());
  }

  _optimisticSelect(stationId) {
    this._streamFailed = false;
    this._lastFailReason = null;
    this.settings.station = stationId;
    this.settings.playing = true;
    this._updateHeader();
  }

  _setMediaSession(station) {
    if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: station?.name || this._t('radio'),
        artist: 'Cultiva Radio'
      });
      navigator.mediaSession.setActionHandler('play', () => {
        if (this.settings.station) {
          void this.playStation(this.settings.station, false);
        }
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        void this.stopRadio(true);
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        void this.stopRadio(true);
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        void this._stepStation(-1);
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        void this._stepStation(1);
      });
    } catch {
      void 0;
    }
  }

  _clearMediaSession() {
    if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
    try {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('stop', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    } catch {
      void 0;
    }
  }

  _armSleep() {
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }
    const m = this.settings.sleepMinutes | 0;
    if (m <= 0) return;
    this.sleepTimer = setTimeout(() => {
      void this.stopRadio(true);
      this._notify(this._t('sleepDone'));
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
      this.settings = this._normalizeSettings(saved);
    }
    this._syncStationsMap();
    this.context.ui.registerHeaderItem({
      label: this._headerLabel(),
      icon: '',
      onClick: () => this.openRadioModal()
    });
    if (this.settings.playing) {
      void this.playStation(this.settings.station, false);
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
    const prevStation = this.settings.station;
    const prevPlaying = this.settings.playing;
    if (payload?.pluginSettings) {
      this.settings = this._normalizeSettings({ ...this.settings, ...payload.pluginSettings });
    } else {
      const saved = await this.context.storage.get('settings');
      if (saved) {
        this.settings = this._normalizeSettings({ ...this.settings, ...saved });
      }
    }
    this._syncStationsMap();
    if (this.audio) {
      this.audio.volume = this.settings.volume;
    }
    this._armSleep();
    await this.context.storage.set('settings', this.settings);
    if (this.settings.playing && prevStation !== this.settings.station) {
      void this.playStation(this.settings.station, false);
    } else if (this.settings.playing && !prevPlaying) {
      void this.playStation(this.settings.station, false);
    }
    this._updateHeader();
  }

  onDisable() {
    this._playId += 1;
    void this._stopAudio();
    this._clearMediaSession();
    try {
      this.context.ui.setTrayTooltip?.('');
      this.context.ui.clearTrayItems?.();
    } catch {
      void 0;
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

  async _cancelPlayPromise() {
    const p = this._playPromise;
    this._playPromise = null;
    if (!p) return;
    try {
      await Promise.race([
        p.catch(() => undefined),
        new Promise((resolve) => setTimeout(resolve, 50))
      ]);
    } catch {
      void 0;
    }
  }

  async _stopAudio() {
    await this._cancelPlayPromise();
    const audio = this.audio;
    this.audio = null;
    if (!audio) return;
    try {
      audio.onerror = null;
      audio.onplay = null;
      audio.pause();
    } catch {
      void 0;
    }
    try {
      audio.removeAttribute('src');
      audio.load();
    } catch {
      void 0;
    }
  }

  async playStation(stationId, notify) {
    this._syncStationsMap();
    if (stationId === 'custom' && this.settings.customUrl) {
      const resolved = await this._resolveStreamUrls(this.settings.customUrl);
      if (resolved.length) {
        this._customResolvedUrls = resolved;
        this._syncStationsMap();
      }
    }
    const station = this.stations[stationId];
    const urls = this._stationUrls(stationId);
    if (!station || !urls.length) return;

    this._optimisticSelect(stationId);
    await this.context.storage.set('settings', this.settings);

    const playId = ++this._playId;
    await this._stopAudio();
    if (playId !== this._playId) return;

    await this._tryPlayUrls(playId, stationId, station, urls, 0, notify);
  }

  async _tryPlayUrls(playId, stationId, station, urls, index, notify) {
    if (playId !== this._playId) return;

    if (index >= urls.length) {
      if (playId !== this._playId) return;
      if (!this._lastFailReason) {
        this._lastFailReason = 'unavailable';
      }
      this._streamFailed = true;
      this.settings.playing = false;
      this._clearMediaSession();
      this._updateHeader();
      this._notify(this._failMessage());
      await this.context.storage.set('settings', this.settings);
      this._refreshSheet();
      return;
    }

    this._streamFailed = false;
    await this._stopAudio();
    if (playId !== this._playId) return;

    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = this.settings.volume;
    this.audio = audio;

    const isCurrent = () => playId === this._playId && this.audio === audio;

    const fail = async (err) => {
      if (!isCurrent()) return;
      try {
        audio.pause();
      } catch {
        void 0;
      }
      if (this.audio === audio) {
        this.audio = null;
      }
      if (this._isAutoplayError(err)) {
        this._lastFailReason = 'autoplayBlocked';
        this._streamFailed = true;
        this.settings.playing = false;
        this._clearMediaSession();
        this._updateHeader();
        this._notify(this._t('autoplayBlocked'));
        await this.context.storage.set('settings', this.settings);
        this._refreshSheet();
        return;
      }
      this._lastFailReason = 'unavailable';
      await this._tryPlayUrls(playId, stationId, station, urls, index + 1, notify);
    };

    const succeed = async () => {
      if (!isCurrent()) {
        try {
          audio.pause();
        } catch {
          void 0;
        }
        return;
      }
      this._streamFailed = false;
      this._lastFailReason = null;
      this.settings.station = stationId;
      this.settings.playing = true;
      this._setMediaSession(station);
      this._updateHeader();
      this._armSleep();
      if (notify !== false) {
        this._notify(`${this._t('playing')}: ${station.name}`);
      }
      await this.context.storage.set('settings', this.settings);
    };

    audio.addEventListener('error', () => {
      void fail(null);
    }, { once: true });

    audio.src = urls[index];
    let playPromise;
    try {
      playPromise = audio.play();
    } catch (err) {
      await fail(err);
      return;
    }

    this._playPromise = playPromise;
    if (playPromise && typeof playPromise.then === 'function') {
      try {
        await playPromise;
        this._playPromise = null;
        await succeed();
      } catch (err) {
        if (this._playPromise === playPromise) {
          this._playPromise = null;
        }
        await fail(err);
      }
    } else {
      this._playPromise = null;
      await succeed();
    }
  }

  async stopRadio(notify) {
    this._playId += 1;
    await this._stopAudio();
    this._clearMediaSession();
    this._streamFailed = false;
    this._lastFailReason = null;
    this.settings.playing = false;
    await this.context.storage.set('settings', this.settings);
    this._updateHeader();
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }
    if (notify) {
      this._notify(this._t('stopped'));
    }
  }

  async togglePlayPause() {
    if (this.settings.playing && this.audio && !this.audio.paused) {
      await this.stopRadio(true);
      return;
    }
    await this.playStation(this.settings.station, true);
  }

  async _stepStation(delta) {
    const ids = this._stationIds();
    if (!ids.length) return;
    let idx = ids.indexOf(this.settings.station);
    if (idx < 0) idx = 0;
    const next = ids[(idx + delta + ids.length) % ids.length];
    this._optimisticSelect(next);
    this._refreshSheet();
    await this.playStation(next, true);
  }

  openRadioModal() {
    this.context.ui.openMainSheet(this._buildSheetHtml());
  }

  _genreClass(station) {
    const g = station?.genre || 'chillout';
    return `radio-genre--${g}`;
  }

  _buildSheetHtml() {
    this._syncStationsMap();
    const vol = Math.round((this.settings.volume || 0) * 100);
    const sleep = this.settings.sleepMinutes | 0;
    const customVal = this._escapeAttr(this.settings.customUrl || '');
    const station = this._currentStation();
    const stationName = station ? station.name : this._t('radio');
    const stationTag = station ? station.tag : '';
    const playing = !!this.settings.playing;
    const visualFx = this.settings.visualFx === true;
    const genreCls = this._genreClass(station);
    const neoCls = visualFx ? ` radio-neo ${genreCls}` : '';
    const playingCls = playing && visualFx ? ' is-playing' : '';
    const statusText = this._streamFailed
      ? this._failMessage()
      : (playing ? this._t('nowPlaying') : this._t('radio'));
    const filter = String(this._stationFilter || '').trim().toLowerCase();

    const rows = Object.entries(this.stations)
      .filter(([, s]) => {
        if (!filter) return true;
        const hay = `${s.name} ${s.tag} ${s.genre}`.toLowerCase();
        return hay.includes(filter);
      })
      .map(([id, s]) => {
        const active = this.settings.station === id;
        const live = active && playing;
        return `<button type="button" class="cultiva-radio-row${active ? ' is-active' : ''}${live ? ' is-live' : ''}" data-cultiva-act="play" data-station="${this._escapeAttr(id)}">
          <span class="cultiva-radio-title">${this._escapeHtml(s.name)}</span>
          <span class="cultiva-radio-tag">${this._escapeHtml(s.tag)}</span>
          <span class="cultiva-radio-state"></span>
        </button>`;
      })
      .join('');

    const history = Array.isArray(this.settings.customHistory) ? this.settings.customHistory : [];
    const historyHtml = history.length
      ? `<label class="cultiva-field-label">${this._t('customHistory')}</label>
    <div class="radio-history-row">
      ${history.map((u) => {
        const short = u.length > 42 ? `${u.slice(0, 39)}…` : u;
        return `<button type="button" class="cultiva-pill radio-history-chip" data-cultiva-act="playHistory" data-url="${this._escapeAttr(u)}" title="${this._escapeAttr(u)}">${this._escapeHtml(short)}</button>`;
      }).join('')}
      <button type="button" class="cultiva-pill" data-cultiva-act="clearHistory">${this._t('customClearHistory')}</button>
    </div>`
      : '';

    return `
<div class="cultiva-sheet-overlay" data-cultiva-act="close"></div>
<div class="cultiva-sheet-card cultiva-sheet-card--radio${neoCls}${playingCls}">
  <div class="cultiva-sheet-grabber"></div>
  <div class="cultiva-sheet-head">
    <div>
      <div class="cultiva-sheet-title">${this._t('title')}</div>
      <div class="cultiva-sheet-sub">${this._t('sub')}</div>
    </div>
    <button type="button" class="cultiva-sheet-x" data-cultiva-act="close" aria-label="${this._escapeAttr(this._t('close'))}">×</button>
  </div>
  <div class="cultiva-sheet-body">
    <div class="radio-now">
      <div class="radio-now-status">${this._escapeHtml(statusText)}</div>
      <div class="radio-now-title">${this._escapeHtml(stationName)}</div>
      <div class="radio-now-tag">${this._escapeHtml(stationTag)}</div>
    </div>
    <div class="radio-transport">
      <button type="button" class="radio-ctrl radio-ctrl--side" data-cultiva-act="prev" aria-label="${this._escapeAttr(this._t('prev'))}">‹</button>
      <button type="button" class="radio-ctrl radio-ctrl--primary" data-cultiva-act="toggle" aria-label="${this._escapeAttr(playing ? this._t('pause') : this._t('play'))}">${playing ? '❚❚' : '▶'}</button>
      <button type="button" class="radio-ctrl radio-ctrl--side" data-cultiva-act="next" aria-label="${this._escapeAttr(this._t('next'))}">›</button>
    </div>
    <div class="radio-toolbar">
      <button type="button" class="cultiva-sheet-secondary" data-cultiva-act="stop">${this._t('stop')}</button>
      <button type="button" class="cultiva-sheet-secondary" data-cultiva-act="toggleVisualFx">${visualFx ? this._t('visualFxOn') : this._t('visualFxOff')}</button>
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
    <label class="cultiva-field-label">${this._t('customUrl')}</label>
    <div class="radio-custom-row">
      <input type="text" name="customUrl" class="cultiva-sheet-input" value="${customVal}" placeholder="https://… or .m3u / .pls" autocomplete="off" spellcheck="false" />
      <button type="button" class="cultiva-sheet-secondary" data-cultiva-act="playCustom" data-cultiva-collect="1">${this._t('customPlay')}</button>
    </div>
    <p class="cultiva-sheet-footnote radio-custom-hint">${this._t('customHint')}</p>
    ${historyHtml}
    <label class="cultiva-field-label">${this._t('stations')}</label>
    <input type="search" name="stationFilter" class="cultiva-sheet-input radio-station-filter" value="${this._escapeAttr(this._stationFilter || '')}" placeholder="${this._escapeAttr(this._t('filterStations'))}" data-cultiva-input-act="stationFilter" autocomplete="off" />
    <div class="cultiva-radio-scroll">${rows || `<p class="cultiva-sheet-footnote">${this._escapeHtml(this._t('filterStations'))}</p>`}</div>
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
      this._refreshSheet();
      return;
    }
    if (action === 'toggleVisualFx') {
      this.settings.visualFx = !this.settings.visualFx;
      await this.context.storage.set('settings', this.settings);
      this._refreshSheet();
      return;
    }
    if (action === 'playCustom' && payload) {
      const raw = String(payload.customUrl || '').trim();
      this._notify(this._t('resolving'));
      const urls = await this._resolveStreamUrls(raw);
      if (!urls.length) {
        this._streamFailed = true;
        this._lastFailReason = 'unavailable';
        this._notify(this._t('invalidUrl'));
        this._refreshSheet();
        return;
      }
      this.settings.customUrl = raw || urls[0];
      this._customResolvedUrls = urls;
      this._pushCustomHistory(this.settings.customUrl);
      this._syncStationsMap();
      await this.context.storage.set('settings', this.settings);
      this._optimisticSelect('custom');
      this._refreshSheet();
      await this.playStation('custom', true);
      return;
    }
    if (action === 'playHistory' && payload?.url) {
      const raw = String(payload.url).trim();
      this._notify(this._t('resolving'));
      const urls = await this._resolveStreamUrls(raw);
      if (!urls.length) {
        this._notify(this._t('invalidUrl'));
        return;
      }
      this.settings.customUrl = raw;
      this._customResolvedUrls = urls;
      this._pushCustomHistory(raw);
      this._syncStationsMap();
      await this.context.storage.set('settings', this.settings);
      this._optimisticSelect('custom');
      this._refreshSheet();
      await this.playStation('custom', true);
      return;
    }
    if (action === 'clearHistory') {
      this.settings.customHistory = [];
      await this.context.storage.set('settings', this.settings);
      this._refreshSheet();
      return;
    }
    if (action === 'input:stationFilter' && payload) {
      this._stationFilter = String(payload.value || '');
      this._refreshSheet();
      return;
    }
    if (action === 'play') {
      const stationId = payload?.station || payload?.stationId;
      if (!stationId) return;
      this._optimisticSelect(stationId);
      this._refreshSheet();
      await this.playStation(stationId, true);
      return;
    }
    if (action === 'toggle') {
      await this.togglePlayPause();
      this._refreshSheet();
      return;
    }
    if (action === 'prev') {
      await this._stepStation(-1);
      return;
    }
    if (action === 'next') {
      await this._stepStation(1);
      return;
    }
    if (action === 'stop') {
      await this.stopRadio(true);
      this._refreshSheet();
      return;
    }
    if (action === 'refreshSheet') {
      this._refreshSheet();
    }
  }
}

return new RadioPlugin(context, hooks);
