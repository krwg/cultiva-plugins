

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

  formatTime(date) {
    const tz = this.settings.timezone || 'UTC';
    const d = date || new Date();
    if (this.settings.format === 'HH:MM') {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(d);
    }
    if (this.settings.format === 'hh:MM:SS A') {
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

  getColorStyle() {
    if (this.settings.color === 'rainbow') {
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
    return colors[this.settings.color] || colors.default;
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
    this.interval = null;
    this.colorInterval = null;
  }

  openSettingsModal() {
    this._tzFilter = '';
    this.context.ui.openMainSheet(this._buildSheetHtml());
  }

  _buildSheetHtml() {
    const all = allTimezones();
    const q = (this._tzFilter || '').trim().toLowerCase();
    const pool = q ? all.filter((z) => z.toLowerCase().includes(q)) : COMMON_TZS;
    const zones = pool.slice(0, 80);
    const rows = zones
      .map(
        (z) =>
          `<button type="button" class="cultiva-tz-row${z === this.settings.timezone ? ' is-active' : ''}" data-cultiva-act="pickTz" data-tz="${this._escapeAttr(z)}"><span class="cultiva-tz-name">${this._escapeHtml(z)}</span></button>`
      )
      .join('');
    const preview = this._escapeHtml(this.formatTime(new Date()));
    const tzLine = this._escapeHtml(this.settings.timezone || 'UTC');
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
      <div class="time-hero-clock">${preview}</div>
      <div class="time-hero-caption">Live preview</div>
    </div>
    <label class="cultiva-field-label">Time zone</label>
    <input type="search" class="cultiva-sheet-input" data-cultiva-input-act="tzFilter" placeholder="Filter zones…" value="${this._escapeAttr(this._tzFilter)}" autocomplete="off" />
    <div class="cultiva-tz-scroll">${rows || '<div class="cultiva-muted cultiva-pad">No matches</div>'}</div>
    <label class="cultiva-field-label">Format</label>
    <div class="cultiva-segmented">
      <label class="cultiva-seg${this.settings.format === 'HH:MM:SS' ? ' is-on' : ''}"><input type="radio" name="format" value="HH:MM:SS" ${this.settings.format === 'HH:MM:SS' ? 'checked' : ''} hidden />24h + sec</label>
      <label class="cultiva-seg${this.settings.format === 'HH:MM' ? ' is-on' : ''}"><input type="radio" name="format" value="HH:MM" ${this.settings.format === 'HH:MM' ? 'checked' : ''} hidden />24h</label>
      <label class="cultiva-seg${this.settings.format === 'hh:MM:SS A' ? ' is-on' : ''}"><input type="radio" name="format" value="hh:MM:SS A" ${this.settings.format === 'hh:MM:SS A' ? 'checked' : ''} hidden />12h</label>
    </div>
    <label class="cultiva-field-label">Accent</label>
    <select name="color" class="cultiva-sheet-select">
      <option value="default" ${this.settings.color === 'default' ? 'selected' : ''}>System</option>
      <option value="green" ${this.settings.color === 'green' ? 'selected' : ''}>Green</option>
      <option value="blue" ${this.settings.color === 'blue' ? 'selected' : ''}>Blue</option>
      <option value="purple" ${this.settings.color === 'purple' ? 'selected' : ''}>Purple</option>
      <option value="orange" ${this.settings.color === 'orange' ? 'selected' : ''}>Orange</option>
      <option value="graphite" ${this.settings.color === 'graphite' ? 'selected' : ''}>Graphite</option>
      <option value="rainbow" ${this.settings.color === 'rainbow' ? 'selected' : ''}>Spectrum</option>
    </select>
    <button type="button" class="cultiva-sheet-primary" data-cultiva-act="apply" data-cultiva-collect="1">Save</button>
  </div>
</div>`;
  }

  async onModalAction(action, payload) {
    if (action === 'input:tzFilter') {
      this._tzFilter = (payload && payload.value) || '';
      this.context.ui.openMainSheet(this._buildSheetHtml());
      return;
    }
    if (action === 'pickTz' && payload && payload.tz) {
      this.settings.timezone = payload.tz;
      await this.context.storage.set('settings', this.settings);
      this.startClock();
      this.context.ui.openMainSheet(this._buildSheetHtml());
      return;
    }
    if (action === 'apply' && payload) {
      if (payload.format) this.settings.format = payload.format;
      if (payload.color) this.settings.color = payload.color;
      await this.context.storage.set('settings', this.settings);
      this.startClock();
      this.context.ui.closeMainSheet();
    }
  }
}

return new TimePlugin(context, hooks);
