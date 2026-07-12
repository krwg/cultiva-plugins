

const COMMON_TZS = [
  'UTC',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Europe/Istanbul',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo'
];

function allTimezones() {
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
      return Intl.supportedValuesOf('timeZone');
    }
  } catch (e) {

  }
  return COMMON_TZS.slice();
}

const TZ_CITY_RU = {
  'UTC': 'Всемирное',
  'Europe/London': 'Лондон',
  'Europe/Dublin': 'Дублин',
  'Europe/Lisbon': 'Лиссабон',
  'Europe/Paris': 'Париж',
  'Europe/Berlin': 'Берлин',
  'Europe/Rome': 'Рим',
  'Europe/Madrid': 'Мадрид',
  'Europe/Amsterdam': 'Амстердам',
  'Europe/Brussels': 'Брюссель',
  'Europe/Vienna': 'Вена',
  'Europe/Prague': 'Прага',
  'Europe/Warsaw': 'Варшава',
  'Europe/Budapest': 'Будапешт',
  'Europe/Athens': 'Афины',
  'Europe/Helsinki': 'Хельсинки',
  'Europe/Kiev': 'Киев',
  'Europe/Kyiv': 'Киев',
  'Europe/Bucharest': 'Бухарест',
  'Europe/Sofia': 'София',
  'Europe/Istanbul': 'Стамбул',
  'Europe/Moscow': 'Москва',
  'Europe/Minsk': 'Минск',
  'Europe/Riga': 'Рига',
  'Europe/Tallinn': 'Таллин',
  'Europe/Vilnius': 'Вильнюс',
  'Asia/Dubai': 'Дубай',
  'Asia/Tbilisi': 'Тбилиси',
  'Asia/Yerevan': 'Ереван',
  'Asia/Baku': 'Баку',
  'Asia/Almaty': 'Алматы',
  'Asia/Tashkent': 'Ташкент',
  'Asia/Kolkata': 'Индия',
  'Asia/Bangkok': 'Бангкок',
  'Asia/Singapore': 'Сингапур',
  'Asia/Shanghai': 'Шанхай',
  'Asia/Hong_Kong': 'Гонконг',
  'Asia/Tokyo': 'Токио',
  'Asia/Seoul': 'Сеул',
  'Australia/Sydney': 'Сидней',
  'Australia/Melbourne': 'Мельбурн',
  'Pacific/Auckland': 'Окленд',
  'America/New_York': 'Нью-Йорк',
  'America/Chicago': 'Чикаго',
  'America/Denver': 'Денвер',
  'America/Los_Angeles': 'Лос-Анджелес',
  'America/Toronto': 'Торонто',
  'America/Sao_Paulo': 'Сан-Паулу',
  'America/Mexico_City': 'Мехико',
  'Africa/Cairo': 'Каир',
  'Africa/Johannesburg': 'Йоханнесбург'
};

function getOffsetMinutes(timeZone, date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset'
    }).formatToParts(date);
    const raw = parts.find((p) => p.type === 'timeZoneName')?.value || 'GMT';
    const m = raw.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!m) {
      return 0;
    }
    const sign = m[1] === '-' ? -1 : 1;
    return sign * (parseInt(m[2], 10) * 60 + (m[3] ? parseInt(m[3], 10) : 0));
  } catch {
    return 0;
  }
}

function offsetLabel(mins) {
  if (mins === 0) {
    return 'UTC±0';
  }
  const sign = mins > 0 ? '+' : '-';
  const abs = Math.abs(mins);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (m === 0) {
    return `UTC${sign}${h}`;
  }
  return `UTC${sign}${h}:${String(m).padStart(2, '0')}`;
}

function cityLabel(timeZone, locale) {
  if (locale === 'ru' && TZ_CITY_RU[timeZone]) {
    return TZ_CITY_RU[timeZone];
  }
  if (timeZone === 'UTC') {
    return locale === 'ru' ? 'Всемирное' : 'Universal';
  }
  return timeZone.split('/').pop().replace(/_/g, ' ');
}

function buildTimezoneGroups(locale) {
  const grouped = new Map();
  for (const tz of allTimezones()) {
    const off = getOffsetMinutes(tz);
    if (!grouped.has(off)) {
      grouped.set(off, []);
    }
    grouped.get(off).push({ tz, city: cityLabel(tz, locale) });
  }
  return Array.from(grouped.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([off, zones]) => ({
      offset: off,
      label: offsetLabel(off),
      zones: zones.sort((a, b) => a.city.localeCompare(b.city, locale === 'ru' ? 'ru' : 'en'))
    }));
}

class TimePlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.settings = {
      format: 'HH:MM:SS',
      color: 'default',
      timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' : 'UTC'
    };
    this.interval = null;
    this.colorInterval = null;
    this.hue = 0;
    this._tzFilter = '';
    this._sheetDraft = null;
    this._previewTimer = null;
    this._locale = 'en';
    this._themeAccent = null;
    this._tzGroups = null;
  }

  _t(key) {
    const ru = {
      clock: 'Часы',
      preview: 'Предпросмотр',
      timezone: 'Часовой пояс',
      filter: 'Фильтр поясов…',
      format: 'Формат',
      accent: 'Акцент',
      system: 'Системный',
      save: 'Сохранить',
      noMatches: 'Ничего не найдено',
      formatColorInSettings: 'Формат и цвет акцента — в настройках плагина.'
    };
    const en = {
      clock: 'Clock',
      preview: 'Live preview',
      timezone: 'Time zone',
      filter: 'Filter zones…',
      format: 'Format',
      accent: 'Accent',
      system: 'System',
      save: 'Save',
      noMatches: 'No matches',
      formatColorInSettings: 'Time format and accent color are in plugin Settings.'
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
    return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  _activeSettings() {
    return this._sheetDraft || this.settings;
  }

  formatTime(date, settingsOverride) {
    const cfg = settingsOverride || this._activeSettings();
    const tz = cfg.timezone || 'UTC';
    const d = date || new Date();
    if (cfg.format === 'HH:MM') {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(d);
    }
    if (cfg.format === 'hh:MM:SS A') {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(d);
    }
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(d);
  }

  getColorStyle(settingsOverride) {
    const cfg = settingsOverride || this._activeSettings();
    if (cfg.color === 'rainbow') {
      return `hsl(${this.hue}, 72%, 52%)`;
    }
    const colors = {
      default: '',
      green: '#34c759',
      blue: '#0a84ff',
      purple: '#bf5af2',
      orange: '#ff9f0a',
      graphite: '#8e8e93'
    };
    return colors[cfg.color] || colors.default;
  }

  _previewColorStyle() {
    return this.getColorStyle(this._sheetDraft || this.settings);
  }

  _startSheetPreviewClock() {
    if (this._previewTimer) {
      clearInterval(this._previewTimer);
    }
    const tick = () => {
      if (!this.context.ui.patchMainSheet) {
        return;
      }
      const text = this._escapeHtml(this.formatTime(new Date(), this._sheetDraft || this.settings));
      this.context.ui.patchMainSheet('.time-hero-clock', text);
    };
    tick();
    this._previewTimer = setInterval(tick, 1000);
  }

  _stopSheetPreviewClock() {
    if (this._previewTimer) {
      clearInterval(this._previewTimer);
      this._previewTimer = null;
    }
  }

  async _syncThemeAccent() {
    if (this.settings.color !== 'default' || !this.context.app?.getThemeColor) {
      this._themeAccent = null;
      return;
    }
    try {
      this._themeAccent = await this.context.app.getThemeColor('text-primary');
    } catch {
      this._themeAccent = null;
    }
  }

  updateHeaderDisplay() {
    const timeStr = this.formatTime(new Date());
    let color = null;
    if (this.settings.color === 'default') {
      color = this._themeAccent || null;
    } else {
      color = this.getColorStyle() || null;
    }
    this.context.ui.updateMainHeader({
      label: timeStr,
      icon: '',
      labelColor: color
    });
  }

  startClock() {
    this.updateHeaderDisplay();
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.updateHeaderDisplay();
      if (this.settings.color === 'default') {
        void this._syncThemeAccent();
      }
    }, 1000);
    if (this.colorInterval) clearInterval(this.colorInterval);
    if (this.settings.color === 'rainbow') {
      this.colorInterval = setInterval(() => {
        this.hue = (this.hue + 1) % 360;
        this.updateHeaderDisplay();
      }, 80);
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
    }
    await this._syncThemeAccent();
    this.context.ui.registerHeaderItem({
      label: this.formatTime(new Date()),
      icon: '',
      onClick: () => this.openSettingsModal()
    });
    this.startClock();
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
    await this._syncThemeAccent();
    this.startClock();
  }

  onDisable() {
    if (this.interval) clearInterval(this.interval);
    if (this.colorInterval) clearInterval(this.colorInterval);
    this._stopSheetPreviewClock();
    this.interval = null;
    this.colorInterval = null;
    this._sheetDraft = null;
  }

  openSettingsModal() {
    this._tzFilter = '';
    this._sheetDraft = { ...this.settings };
    this.context.ui.openMainSheet(this._buildSheetHtml());
    this._startSheetPreviewClock();
  }

  _buildTzRowsHtml(draft) {
    const q = (this._tzFilter || '').trim().toLowerCase();
    if (q) {
      const pool = allTimezones().filter((z) => {
        const city = cityLabel(z, this._locale).toLowerCase();
        return z.toLowerCase().includes(q) || city.includes(q);
      });
      const rows = pool.slice(0, 120).map((z) => {
        const off = offsetLabel(getOffsetMinutes(z));
        const city = cityLabel(z, this._locale);
        return `<button type="button" class="cultiva-tz-row${z === draft.timezone ? ' is-active' : ''}" data-cultiva-act="pickTz" data-tz="${this._escapeAttr(z)}"><span class="cultiva-tz-name">${this._escapeHtml(city)}</span><span class="cultiva-tz-meta">${this._escapeHtml(off)}</span></button>`;
      }).join('');
      return rows || `<div class="cultiva-muted cultiva-pad">${this._escapeHtml(this._t('noMatches'))}</div>`;
    }
    if (!this._tzGroups) {
      this._tzGroups = buildTimezoneGroups(this._locale);
    }
    return this._tzGroups.map((group) => {
      const rows = group.zones.map((z) =>
        `<button type="button" class="cultiva-tz-row${z.tz === draft.timezone ? ' is-active' : ''}" data-cultiva-act="pickTz" data-tz="${this._escapeAttr(z.tz)}"><span class="cultiva-tz-name">${this._escapeHtml(z.city)}</span><span class="cultiva-tz-meta">${this._escapeHtml(group.label)}</span></button>`
      ).join('');
      return `<div class="cultiva-tz-group"><div class="cultiva-tz-group-label">${this._escapeHtml(group.label)}</div>${rows}</div>`;
    }).join('');
  }

  _buildSheetHtml() {
    const draft = this._sheetDraft || this.settings;
    const rows = this._buildTzRowsHtml(draft);
    const preview = this._escapeHtml(this.formatTime(new Date(), draft));
    let previewStyle = '';
    if (draft.color !== 'default') {
      const previewColor = this.getColorStyle(draft);
      if (previewColor) {
        previewStyle = ` style="color:${this._escapeHtml(previewColor)}"`;
      }
    }
    const tzLine = this._escapeHtml(cityLabel(draft.timezone || 'UTC', this._locale));
    return `
<div class="cultiva-sheet-overlay" data-cultiva-act="close"></div>
<div class="cultiva-sheet-card cultiva-sheet-card--time">
  <div class="cultiva-sheet-grabber"></div>
  <div class="cultiva-sheet-head">
    <div>
      <div class="cultiva-sheet-title">${this._t('clock')}</div>
      <div class="cultiva-sheet-sub">${tzLine}</div>
    </div>
    <button type="button" class="cultiva-sheet-x" data-cultiva-act="close" aria-label="Close">×</button>
  </div>
  <div class="cultiva-sheet-body">
    <div class="time-hero">
      <div class="time-hero-clock"${previewStyle}>${preview}</div>
      <div class="time-hero-caption">${this._t('preview')}</div>
    </div>
    <label class="cultiva-field-label">${this._t('timezone')}</label>
    <input type="search" name="tzFilter" class="cultiva-sheet-input" data-cultiva-input-act="tzFilter" placeholder="${this._escapeAttr(this._t('filter'))}" value="${this._escapeAttr(this._tzFilter)}" autocomplete="off" />
    <div class="cultiva-tz-scroll">${rows}</div>
    <p class="cultiva-sheet-footnote">${this._escapeHtml(this._t('formatColorInSettings') || 'Time format and accent color are in plugin Settings.')}</p>
  </div>
</div>`;
  }

  async onModalAction(action, payload) {
    if (action === 'close') {
      this._stopSheetPreviewClock();
      this._sheetDraft = null;
      return;
    }
    if (action === 'input:tzFilter') {
      this._tzFilter = (payload && payload.value) || '';
      this.context.ui.openMainSheet(this._buildSheetHtml());
      return;
    }
    if (action === 'pickTz' && payload && payload.tz) {
      if (!this._sheetDraft) {
        this._sheetDraft = { ...this.settings };
      }
      this._sheetDraft.timezone = payload.tz;
      this.settings.timezone = payload.tz;
      await this.context.storage.set('settings', this.settings);
      this.startClock();
      this.context.ui.openMainSheet(this._buildSheetHtml());
      this._startSheetPreviewClock();
      return;
    }
  }
}

return new TimePlugin(context, hooks);
