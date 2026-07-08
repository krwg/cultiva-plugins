

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

  updateHeaderDisplay() {
    const timeStr = this.formatTime(new Date());
    const color = this.getColorStyle();
    this.context.ui.updateMainHeader({
      label: timeStr,
      icon: '',
      labelColor: color || undefined
    });
  }

  startClock() {
    this.updateHeaderDisplay();
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.updateHeaderDisplay(), 1000);
    if (this.colorInterval) clearInterval(this.colorInterval);
    if (this.settings.color === 'rainbow') {
      this.colorInterval = setInterval(() => {
        this.hue = (this.hue + 1) % 360;
        this.updateHeaderDisplay();
      }, 80);
    }
  }

  async onEnable() {
    const saved = await this.context.storage.get('settings');
    if (saved) {
      this.settings = { ...this.settings, ...saved };
    }
    this.context.ui.registerHeaderItem({
      label: this.formatTime(new Date()),
      icon: '',
      onClick: () => this.openSettingsModal()
    });
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

  _buildSheetHtml() {
    const draft = this._sheetDraft || this.settings;
    const all = allTimezones();
    const q = (this._tzFilter || '').trim().toLowerCase();
    const pool = q ? all.filter((z) => z.toLowerCase().includes(q)) : COMMON_TZS;
    const zones = pool.slice(0, 80);
    const rows = zones
      .map(
        (z) =>
          `<button type="button" class="cultiva-tz-row${z === draft.timezone ? ' is-active' : ''}" data-cultiva-act="pickTz" data-tz="${this._escapeAttr(z)}"><span class="cultiva-tz-name">${this._escapeHtml(z)}</span></button>`
      )
      .join('');
    const preview = this._escapeHtml(this.formatTime(new Date(), draft));
    const previewColor = this._escapeHtml(this.getColorStyle(draft) || '');
    const tzLine = this._escapeHtml(draft.timezone || 'UTC');
    const seg = (value, label) =>
      `<button type="button" class="cultiva-seg${draft.format === value ? ' is-on' : ''}" data-cultiva-act="pickFormat" data-format="${value}">${label}</button>`;
    return `
<div class="cultiva-sheet-overlay" data-cultiva-act="close"></div>
<div class="cultiva-sheet-card cultiva-sheet-card--time">
  <div class="cultiva-sheet-grabber"></div>
  <div class="cultiva-sheet-head">
    <div>
      <div class="cultiva-sheet-title">Clock</div>
      <div class="cultiva-sheet-sub">${tzLine}</div>
    </div>
    <button type="button" class="cultiva-sheet-x" data-cultiva-act="close" aria-label="Close">×</button>
  </div>
  <div class="cultiva-sheet-body">
    <div class="time-hero">
      <div class="time-hero-clock" style="${previewColor ? `color:${previewColor}` : ''}">${preview}</div>
      <div class="time-hero-caption">Live preview</div>
    </div>
    <label class="cultiva-field-label">Time zone</label>
    <input type="search" name="tzFilter" class="cultiva-sheet-input" data-cultiva-input-act="tzFilter" placeholder="Filter zones…" value="${this._escapeAttr(this._tzFilter)}" autocomplete="off" />
    <div class="cultiva-tz-scroll">${rows || '<div class="cultiva-muted cultiva-pad">No matches</div>'}</div>
    <label class="cultiva-field-label">Format</label>
    <div class="cultiva-segmented">
      ${seg('HH:MM:SS', '24h + sec')}
      ${seg('HH:MM', '24h')}
      ${seg('hh:MM:SS A', '12h')}
    </div>
    <label class="cultiva-field-label">Accent</label>
    <select name="color" class="cultiva-sheet-select" data-cultiva-change-act="colorDraft">
      <option value="default" ${draft.color === 'default' ? 'selected' : ''}>System</option>
      <option value="green" ${draft.color === 'green' ? 'selected' : ''}>Green</option>
      <option value="blue" ${draft.color === 'blue' ? 'selected' : ''}>Blue</option>
      <option value="purple" ${draft.color === 'purple' ? 'selected' : ''}>Purple</option>
      <option value="orange" ${draft.color === 'orange' ? 'selected' : ''}>Orange</option>
      <option value="graphite" ${draft.color === 'graphite' ? 'selected' : ''}>Graphite</option>
      <option value="rainbow" ${draft.color === 'rainbow' ? 'selected' : ''}>Spectrum</option>
    </select>
    <button type="button" class="cultiva-sheet-primary" data-cultiva-act="apply" data-cultiva-collect="1">Save</button>
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
    if (action === 'pickFormat' && payload && payload.format) {
      if (!this._sheetDraft) {
        this._sheetDraft = { ...this.settings };
      }
      this._sheetDraft.format = payload.format;
      this.context.ui.openMainSheet(this._buildSheetHtml());
      this._startSheetPreviewClock();
      return;
    }
    if (action === 'colorDraft' && payload && payload.value) {
      if (!this._sheetDraft) {
        this._sheetDraft = { ...this.settings };
      }
      this._sheetDraft.color = payload.value;
      this.context.ui.openMainSheet(this._buildSheetHtml());
      this._startSheetPreviewClock();
      return;
    }
    if (action === 'apply' && payload) {
      if (!this._sheetDraft) {
        this._sheetDraft = { ...this.settings };
      }
      if (payload.format) {
        this._sheetDraft.format = payload.format;
      }
      if (payload.color) {
        this._sheetDraft.color = payload.color;
      }
      this.settings = { ...this._sheetDraft };
      await this.context.storage.set('settings', this.settings);
      this._sheetDraft = null;
      this._stopSheetPreviewClock();
      this.startClock();
      this.context.ui.closeMainSheet();
    }
  }
}

return new TimePlugin(context, hooks);
