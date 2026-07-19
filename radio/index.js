
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
    this._sleepEndsAt = 0;
    this._sleepTick = null;
    this._nowPlayingMeta = '';
    this._icyAbort = null;
    this._icyTimer = null;
    this._audioCtx = null;
    this._analyser = null;
    this._mediaSource = null;
    this._vizRaf = null;
    this._vizMode = 'off';
    this._vizSilentFrames = 0;
    this._fadeToken = 0;
    this._wiredAudio = null;
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
      },
      nightride: {
        name: 'Nightride FM',
        tag: 'Synthwave',
        genre: 'synthwave',
        urls: [
          'https://stream.nightride.fm/nightride.mp3'
        ]
      },
      chillsynth: {
        name: 'Chill Synth',
        tag: 'Synthwave',
        genre: 'synthwave',
        urls: [
          'https://stream.nightride.fm/chillsynth.mp3'
        ]
      },
      darksynth: {
        name: 'Dark Synth',
        tag: 'Synthwave',
        genre: 'synthwave',
        urls: [
          'https://stream.nightride.fm/darksynth.mp3'
        ]
      },
      eurodance: {
        name: 'Record Eurodance',
        tag: 'Retro Rave',
        genre: 'retrorave',
        urls: [
          'https://radiorecord.hostingradio.ru/eurodance96.aacp'
        ]
      },
      nashe: {
        name: 'Наше Радио',
        tag: 'Русский рок',
        genre: 'russian',
        urls: [
          'https://nashe1.hostingradio.ru/nashe-128.mp3'
        ]
      },
      europaplus: {
        name: 'Europa Plus',
        tag: 'Поп',
        genre: 'russian',
        urls: [
          'https://ep128.hostingradio.ru:8030/ep128'
        ]
      },
      digitalis: {
        name: 'Digitalis',
        tag: 'Analog',
        genre: 'electronic',
        urls: [
          'https://ice6.somafm.com/digitalis-128-mp3',
          'https://ice2.somafm.com/digitalis-128-mp3',
          'https://ice1.somafm.com/digitalis-128-mp3'
        ]
      },
      suburbsofgoa: {
        name: 'Suburbs of Goa',
        tag: 'World',
        genre: 'downtempo',
        urls: [
          'https://ice6.somafm.com/suburbsofgoa-128-mp3',
          'https://ice2.somafm.com/suburbsofgoa-128-mp3',
          'https://ice1.somafm.com/suburbsofgoa-128-mp3'
        ]
      },
      sf1033: {
        name: 'SF 10-33',
        tag: 'Ambient',
        genre: 'ambient',
        urls: [
          'https://ice6.somafm.com/sf1033-128-mp3',
          'https://ice2.somafm.com/sf1033-128-mp3',
          'https://ice1.somafm.com/sf1033-128-mp3'
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
      sub: '33 станции · синтвейв, ретрорейв и др.',
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
      footnote: '33 станции · SomaFM, Nightride, Record, русские эфиры. Нужен интернет.',
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
      sub: '33 stations · synthwave, retro rave & more',
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
      footnote: '33 stations · SomaFM, Nightride, Record, RU live. Requires network.',
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
        const tip = this._nowPlayingMeta
          ? `♪ ${this._nowPlayingMeta}`
          : `♪ ${station.name}`;
        this.context.ui.setTrayTooltip?.(tip);
        this.context.ui.registerTrayItems?.([
          { id: 'radio-now', label: tip, enabled: true },
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
    if (this._nowPlayingMeta) {
      const short = this._nowPlayingMeta.length > 36
        ? `${this._nowPlayingMeta.slice(0, 33)}…`
        : this._nowPlayingMeta;
      return short;
    }
    const s = this._currentStation();
    return s ? s.name : this._t('onAir');
  }

  _updateHeader() {
    this.context.ui.updateMainHeader({ label: this._headerLabel(), icon: '' });
    this._syncTray();
  }

  _refreshSheet() {
    this.context.ui.openMainSheet(this._buildSheetHtml());
    if (this._vizMode === 'live' && this.settings.visualFx) {
      this._ensureVizLoop();
    }
  }

  _patchSheet(selector, html) {
    if (this.context.ui && typeof this.context.ui.patchMainSheet === 'function') {
      try {
        this.context.ui.patchMainSheet(selector, html);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  _optimisticSelect(stationId) {
    this._streamFailed = false;
    this._lastFailReason = null;
    this.settings.station = stationId;
    this.settings.playing = true;
    this._nowPlayingMeta = '';
    this._updateHeader();
  }

  _setMediaSession(station) {
    if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
    try {
      const title = this._nowPlayingMeta || station?.name || this._t('radio');
      const artist = this._nowPlayingMeta ? (station?.name || 'Cultiva Radio') : 'Cultiva Radio';
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist
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

  _sleepRemainingMs() {
    if (!this._sleepEndsAt) return 0;
    return Math.max(0, this._sleepEndsAt - Date.now());
  }

  _formatSleepRemain(ms) {
    const total = Math.ceil(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  _sleepProgress() {
    const m = this.settings.sleepMinutes | 0;
    if (m <= 0 || !this._sleepEndsAt) return 0;
    const total = m * 60 * 1000;
    const left = this._sleepRemainingMs();
    return Math.max(0, Math.min(1, 1 - (left / total)));
  }

  _patchSleepCountdown() {
    const m = this.settings.sleepMinutes | 0;
    if (m <= 0) return;
    const left = this._sleepRemainingMs();
    const label = this._formatSleepRemain(left);
    const p = this._sleepProgress();
    const html = `<span class="radio-sleep-ring" style="--sleep-p:${p.toFixed(4)}"></span><span class="radio-sleep-label">${this._escapeHtml(label)}</span>`;
    if (!this._patchSheet(`.radio-sleep-pill[data-minutes="${m}"]`, html)) {
      // Older hosts without patch: countdown appears on next full sheet open.
    }
  }

  _armSleep() {
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }
    if (this._sleepTick) {
      clearInterval(this._sleepTick);
      this._sleepTick = null;
    }
    const m = this.settings.sleepMinutes | 0;
    if (m <= 0) {
      this._sleepEndsAt = 0;
      return;
    }
    this._sleepEndsAt = Date.now() + m * 60 * 1000;
    this.sleepTimer = setTimeout(() => {
      void this.stopRadio(true);
      this._notify(this._t('sleepDone'));
    }, m * 60 * 1000);
    this._sleepTick = setInterval(() => {
      this._patchSleepCountdown();
    }, 1000);
    this._patchSleepCountdown();
  }

  async _fadeVolume(audio, from, to, ms) {
    if (!audio) return;
    const token = ++this._fadeToken;
    const steps = Math.max(6, Math.round(ms / 40));
    const dt = ms / steps;
    for (let i = 1; i <= steps; i += 1) {
      if (token !== this._fadeToken) return;
      try {
        audio.volume = from + ((to - from) * (i / steps));
      } catch {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, dt));
    }
    try {
      audio.volume = to;
    } catch {
      void 0;
    }
  }

  _stopIcy() {
    if (this._icyTimer) {
      clearTimeout(this._icyTimer);
      this._icyTimer = null;
    }
    if (this._icyAbort) {
      try {
        this._icyAbort.abort();
      } catch {
        void 0;
      }
      this._icyAbort = null;
    }
  }

  _applyNowPlayingMeta(title) {
    const next = String(title || '').replace(/\0/g, '').trim();
    if (!next || next === this._nowPlayingMeta) return;
    this._nowPlayingMeta = next;
    this._updateHeader();
    this._setMediaSession(this._currentStation());
    this._patchSheet('.radio-now-tag', this._escapeHtml(next));
  }

  async _pollIcyOnce(url) {
    const ctrl = new AbortController();
    this._icyAbort = ctrl;
    try {
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        signal: ctrl.signal,
        headers: {
          'Icy-MetaData': '1',
          'User-Agent': 'CultivaRadio/2.6'
        }
      });
      const metaInt = parseInt(res.headers.get('icy-metaint') || '0', 10);
      if (!metaInt || !res.body || typeof res.body.getReader !== 'function') {
        return false;
      }
      const reader = res.body.getReader();
      let pending = new Uint8Array(0);
      let needAudio = metaInt;
      const deadline = Date.now() + 12000;
      while (Date.now() < deadline) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value || !value.length) continue;
        const merged = new Uint8Array(pending.length + value.length);
        merged.set(pending, 0);
        merged.set(value, pending.length);
        pending = merged;
        while (pending.length >= needAudio + 1) {
          pending = pending.subarray(needAudio);
          const metaLen = pending[0] * 16;
          pending = pending.subarray(1);
          if (pending.length < metaLen) {
            needAudio = 0;
            break;
          }
          if (metaLen > 0) {
            const meta = new TextDecoder('utf-8').decode(pending.subarray(0, metaLen));
            const m = meta.match(/StreamTitle='([^']*)'/i) || meta.match(/StreamTitle="([^"]*)"/i);
            if (m && m[1]) {
              this._applyNowPlayingMeta(m[1]);
              try {
                await reader.cancel();
              } catch {
                void 0;
              }
              return true;
            }
          }
          pending = pending.subarray(metaLen);
          needAudio = metaInt;
        }
        if (needAudio === 0 && pending.length > 0) {
          needAudio = metaInt;
        }
      }
      try {
        await reader.cancel();
      } catch {
        void 0;
      }
      return false;
    } catch {
      return false;
    } finally {
      if (this._icyAbort === ctrl) {
        this._icyAbort = null;
      }
    }
  }

  _scheduleIcy(url) {
    this._stopIcy();
    if (!url) return;
    const run = async () => {
      if (!this.settings.playing) return;
      await this._pollIcyOnce(url);
      if (!this.settings.playing) return;
      this._icyTimer = setTimeout(() => {
        void run();
      }, 14000);
    };
    void run();
  }

  _teardownVizGraph() {
    if (this._vizRaf) {
      cancelAnimationFrame(this._vizRaf);
      this._vizRaf = null;
    }
    try {
      if (this._analyser) {
        this._analyser.disconnect();
      }
    } catch {
      void 0;
    }
    try {
      if (this._mediaSource) {
        this._mediaSource.disconnect();
      }
    } catch {
      void 0;
    }
    this._analyser = null;
    this._vizSilentFrames = 0;
  }

  _stopViz() {
    if (this._vizRaf) {
      cancelAnimationFrame(this._vizRaf);
      this._vizRaf = null;
    }
    try {
      if (this._analyser) {
        this._analyser.disconnect();
      }
    } catch {
      void 0;
    }
    this._analyser = null;
    this._vizMode = 'off';
    this._vizSilentFrames = 0;
    // Keep MediaElementSource → destination so playback does not go silent.
    if (this._mediaSource && this._audioCtx) {
      try {
        this._mediaSource.disconnect();
        this._mediaSource.connect(this._audioCtx.destination);
      } catch {
        void 0;
      }
    }
  }

  _detachAudioGraph() {
    this._teardownVizGraph();
    try {
      if (this._mediaSource) {
        this._mediaSource.disconnect();
      }
    } catch {
      void 0;
    }
    this._mediaSource = null;
    this._wiredAudio = null;
    this._vizMode = 'off';
  }

  _ensureAudioContext() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!this._audioCtx) {
      try {
        this._audioCtx = new AC();
      } catch {
        return null;
      }
    }
    if (this._audioCtx.state === 'suspended') {
      void this._audioCtx.resume();
    }
    return this._audioCtx;
  }

  _connectAnalyser(audio) {
    if (this._vizRaf) {
      cancelAnimationFrame(this._vizRaf);
      this._vizRaf = null;
    }
    if (!this.settings.visualFx || !audio) {
      this._stopViz();
      return;
    }
    const ctx = this._ensureAudioContext();
    if (!ctx) {
      this._vizMode = 'decorative';
      return;
    }
    try {
      audio.crossOrigin = 'anonymous';
      if (!this._mediaSource || this._wiredAudio !== audio) {
        try {
          if (this._mediaSource) {
            this._mediaSource.disconnect();
          }
        } catch {
          void 0;
        }
        this._mediaSource = ctx.createMediaElementSource(audio);
        this._wiredAudio = audio;
      } else {
        try {
          this._mediaSource.disconnect();
        } catch {
          void 0;
        }
      }
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.72;
      this._mediaSource.connect(analyser);
      analyser.connect(ctx.destination);
      this._analyser = analyser;
      this._vizMode = 'live';
      this._vizSilentFrames = 0;
      this._ensureVizLoop();
    } catch {
      this._vizMode = 'decorative';
      this._mediaSource = null;
      this._wiredAudio = null;
      this._analyser = null;
    }
  }

  _renderVizBars(heights) {
    if (!heights || !heights.length) {
      this._patchSheet('.radio-viz', '');
      return;
    }
    const html = heights.map((h) => `<i style="height:${Math.max(10, Math.round(h))}%"></i>`).join('');
    this._patchSheet('.radio-viz', html);
  }

  _ensureVizLoop() {
    if (this._vizRaf) return;
    if (this._vizMode !== 'live' || !this._analyser) return;
    const bins = 24;
    const data = new Uint8Array(this._analyser.frequencyBinCount);
    const tick = () => {
      this._vizRaf = null;
      if (this._vizMode !== 'live' || !this._analyser || !this.settings.playing) {
        return;
      }
      this._analyser.getByteFrequencyData(data);
      let sum = 0;
      const heights = [];
      const step = Math.max(1, Math.floor(data.length / bins));
      for (let i = 0; i < bins; i += 1) {
        let v = 0;
        const start = i * step;
        for (let j = 0; j < step && start + j < data.length; j += 1) {
          v += data[start + j];
        }
        v /= step;
        sum += v;
        heights.push(12 + (v / 255) * 88);
      }
      if (sum < 12) {
        this._vizSilentFrames += 1;
        // Keep Neo atmosphere; hide dead flat bars while probing / on CORS silence.
        if (this._vizSilentFrames === 1 || this._vizSilentFrames % 15 === 0) {
          this._renderVizBars(null);
        }
        if (this._vizSilentFrames > 45) {
          this._teardownVizGraph();
          if (this._mediaSource && this._audioCtx) {
            try {
              this._mediaSource.connect(this._audioCtx.destination);
            } catch {
              void 0;
            }
          }
          this._vizMode = 'decorative';
          this._refreshSheet();
          return;
        }
      } else {
        this._vizSilentFrames = 0;
        this._renderVizBars(heights);
      }
      this._vizRaf = requestAnimationFrame(tick);
    };
    this._vizRaf = requestAnimationFrame(tick);
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
    if (this.settings.playing && this.audio) {
      if (this.settings.visualFx) {
        if (!this.audio.crossOrigin) {
          void this.playStation(this.settings.station, false);
        } else {
          this._connectAnalyser(this.audio);
        }
      } else {
        this._stopViz();
      }
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
    this._fadeToken += 1;
    this._stopIcy();
    this._stopViz();
    void this._stopAudio({ fade: false });
    this._clearMediaSession();
    this._nowPlayingMeta = '';
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
    if (this._sleepTick) {
      clearInterval(this._sleepTick);
      this._sleepTick = null;
    }
    this._sleepEndsAt = 0;
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

  async _stopAudio(opts) {
    const fade = !opts || opts.fade !== false;
    await this._cancelPlayPromise();
    const audio = this.audio;
    this.audio = null;
    this._stopIcy();
    this._detachAudioGraph();
    if (!audio) return;
    if (fade) {
      const from = Number.isFinite(audio.volume) ? audio.volume : 0;
      await this._fadeVolume(audio, from, 0, 240);
    }
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
    await this._stopAudio({ fade: true });
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
    await this._stopAudio({ fade: false });
    if (playId !== this._playId) return;

    const targetVol = this.settings.volume;
    const audio = new Audio();
    audio.preload = 'none';
    if (this.settings.visualFx) {
      audio.crossOrigin = 'anonymous';
    }
    audio.volume = 0;
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
      this._connectAnalyser(audio);
      await this._fadeVolume(audio, 0, targetVol, 280);
      if (!isCurrent()) return;
      this._setMediaSession(station);
      this._scheduleIcy(urls[index]);
      this._updateHeader();
      this._armSleep();
      if (notify !== false) {
        this._notify(`${this._t('playing')}: ${station.name}`);
      }
      await this.context.storage.set('settings', this.settings);
      this._refreshSheet();
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
    this._fadeToken += 1;
    this._nowPlayingMeta = '';
    await this._stopAudio({ fade: true });
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
    if (this._sleepTick) {
      clearInterval(this._sleepTick);
      this._sleepTick = null;
    }
    this._sleepEndsAt = 0;
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
    if (this._vizMode === 'live' && this.settings.visualFx) {
      this._ensureVizLoop();
    }
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
    const stationTag = this._nowPlayingMeta || (station ? station.tag : '');
    const playing = !!this.settings.playing;
    const visualFx = this.settings.visualFx === true;
    const genreCls = this._genreClass(station);
    const liveViz = visualFx && this._vizMode === 'live';
    // Genre Neo background + pulse always stay on when Neo is enabled —
    // live analyser bars layer on top; never replace the atmosphere.
    const neoCls = visualFx ? ` radio-neo ${genreCls}` : '';
    const playingCls = playing && visualFx ? ' is-playing' : '';
    const vizCls = liveViz ? ' has-live-viz' : '';
    const statusText = this._streamFailed
      ? this._failMessage()
      : (playing ? this._t('nowPlaying') : this._t('radio'));
    const filter = String(this._stationFilter || '').trim().toLowerCase();
    const sleepLeft = sleep > 0 ? this._sleepRemainingMs() : 0;
    const sleepLabel = sleep > 0 ? this._formatSleepRemain(sleepLeft || sleep * 60 * 1000) : '';
    const sleepP = this._sleepProgress();
    const vizBars = ''; // filled by live analyser when signal has energy


    const sleepPill = (minutes, label) => {
      const active = sleep === minutes;
      if (!active || minutes === 0) {
        return `<button type="button" class="cultiva-pill${active ? ' is-active' : ''}" data-cultiva-act="sleep" data-minutes="${minutes}">${label}</button>`;
      }
      return `<button type="button" class="cultiva-pill radio-sleep-pill is-active" data-cultiva-act="sleep" data-minutes="${minutes}"><span class="radio-sleep-ring" style="--sleep-p:${sleepP.toFixed(4)}"></span><span class="radio-sleep-label">${this._escapeHtml(sleepLabel)}</span></button>`;
    };

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
<div class="cultiva-sheet-card cultiva-sheet-card--radio${neoCls}${playingCls}${vizCls}">
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
      ${liveViz ? `<div class="radio-viz" aria-hidden="true">${vizBars}</div>` : ''}
    </div>
    <div class="radio-transport">
      <button type="button" class="radio-ctrl radio-ctrl--side" data-cultiva-act="prev" aria-label="${this._escapeAttr(this._t('prev'))}">‹</button>
      <button type="button" class="radio-ctrl radio-ctrl--primary" data-cultiva-act="toggle" aria-label="${this._escapeAttr(playing ? this._t('pause') : this._t('play'))}">${playing ? '❚❚' : '▶'}</button>
      <button type="button" class="radio-ctrl radio-ctrl--side" data-cultiva-act="next" aria-label="${this._escapeAttr(this._t('next'))}">›</button>
    </div>
    <label class="cultiva-field-label">${this._t('output')}</label>
    <input type="range" name="vol" min="0" max="1" step="0.03" value="${this.settings.volume}" data-cultiva-change-act="volume" />
    <div class="cultiva-range-meta"><span>${vol}%</span></div>
    <label class="cultiva-field-label">${this._t('sleep')}</label>
    <div class="cultiva-pill-row">
      ${sleepPill(0, this._t('off'))}
      ${sleepPill(15, '15m')}
      ${sleepPill(30, '30m')}
      ${sleepPill(60, '60m')}
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
    if (action === 'refreshSheet') {
      this._refreshSheet();
    }
  }
}

return new RadioPlugin(context, hooks);
