// Cultiva Time Plugin v1.0.0

class TimePlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.settings = {
      format: 'HH:MM:SS',
      color: 'default'
    };
    this.interval = null;
    this.colorInterval = null;
    this.hue = 0;
  }
  
  async onEnable() {
    console.log('[Time] Plugin enabled');
    
    const saved = await this.context.storage.get('settings');
    if (saved) {
      this.settings = { ...this.settings, ...saved };
    }
    
    this.context.ui.registerHeaderItem({
      label: this.formatTime(new Date()),
      icon: '⏰',
      onClick: () => this.openSettingsModal()
    });
    
    this.startClock();
  }
  
  onDisable() {
    console.log('[Time] Plugin disabled');
    if (this.interval) clearInterval(this.interval);
    if (this.colorInterval) clearInterval(this.colorInterval);
  }
  
  formatTime(date) {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    switch (this.settings.format) {
      case 'HH:MM':
        return `${hours}:${minutes}`;
      case 'hh:MM:SS A':
        const h12 = hours % 12 || 12;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        return `${h12}:${minutes}:${seconds} ${ampm}`;
      default: // HH:MM:SS
        return `${hours}:${minutes}:${seconds}`;
    }
  }
  
  getColorStyle() {
    if (this.settings.color === 'rainbow') {
      return `hsl(${this.hue}, 70%, 50%)`;
    }
    
    const colors = {
      default: 'var(--text-primary)',
      green: '#4caf50',
      blue: '#58a6ff',
      purple: '#bc8cff',
      orange: '#ff9500'
    };
    return colors[this.settings.color] || colors.default;
  }
  
  updateHeaderDisplay() {
    const now = new Date();
    const timeStr = this.formatTime(now);
    const color = this.getColorStyle();
    
    const headerItems = document.querySelectorAll('.header-plugin-item');
    headerItems.forEach(item => {
      const iconEl = item.querySelector('.header-plugin-icon');
      if (iconEl && iconEl.textContent === '⏰') {
        item.innerHTML = `
          <span class="header-plugin-icon" style="color: ${color}">⏰</span>
          <span style="color: ${color}">${timeStr}</span>
        `;
      }
    });
  }
  
  startClock() {
    this.updateHeaderDisplay();
    
    this.interval = setInterval(() => {
      this.updateHeaderDisplay();
    }, 1000);
    
    if (this.settings.color === 'rainbow') {
      this.colorInterval = setInterval(() => {
        this.hue = (this.hue + 1) % 360;
      }, 100);
    } else if (this.colorInterval) {
      clearInterval(this.colorInterval);
      this.colorInterval = null;
    }
  }
  
  openSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'time-modal';
    modal.innerHTML = `
      <div class="time-modal-overlay"></div>
      <div class="time-modal-content" style="max-width: 360px;">
        <div class="time-modal-header">
          <h2>⏰ Time Settings</h2>
          <button class="time-modal-close">&times;</button>
        </div>
        <div class="time-modal-body">
          <div class="time-setting">
            <label>Format</label>
            <select class="time-format-select">
              <option value="HH:MM:SS" ${this.settings.format === 'HH:MM:SS' ? 'selected' : ''}>24-hour with seconds (23:59:59)</option>
              <option value="HH:MM" ${this.settings.format === 'HH:MM' ? 'selected' : ''}>24-hour (23:59)</option>
              <option value="hh:MM:SS A" ${this.settings.format === 'hh:MM:SS A' ? 'selected' : ''}>12-hour (11:59:59 PM)</option>
            </select>
          </div>
          <div class="time-setting" style="margin-top: 16px;">
            <label>Color</label>
            <select class="time-color-select">
              <option value="default" ${this.settings.color === 'default' ? 'selected' : ''}>Default</option>
              <option value="green" ${this.settings.color === 'green' ? 'selected' : ''}>Green</option>
              <option value="blue" ${this.settings.color === 'blue' ? 'selected' : ''}>Blue</option>
              <option value="purple" ${this.settings.color === 'purple' ? 'selected' : ''}>Purple</option>
              <option value="orange" ${this.settings.color === 'orange' ? 'selected' : ''}>Orange</option>
              <option value="rainbow" ${this.settings.color === 'rainbow' ? 'selected' : ''}>🌈 Rainbow</option>
            </select>
          </div>
          <div class="time-preview" style="margin-top: 20px; text-align: center; padding: 12px; background: var(--bg-secondary); border-radius: 12px;">
            <span style="font-size: 24px; font-weight: 600;" id="time-preview">${this.formatTime(new Date())}</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.time-modal-close');
    const overlay = modal.querySelector('.time-modal-overlay');
    const formatSelect = modal.querySelector('.time-format-select');
    const colorSelect = modal.querySelector('.time-color-select');
    const preview = modal.querySelector('#time-preview');
    
    closeBtn.onclick = () => modal.remove();
    overlay.onclick = () => modal.remove();
    
    const updatePreview = () => {
      this.settings.format = formatSelect.value;
      this.settings.color = colorSelect.value;
      preview.textContent = this.formatTime(new Date());
      preview.style.color = this.getColorStyle();
    };
    
    formatSelect.onchange = updatePreview;
    colorSelect.onchange = updatePreview;
    
    const saveAndClose = async () => {
      await this.context.storage.set('settings', this.settings);
      this.startClock();
      modal.remove();
    };
    
    modal.querySelector('.time-modal-close').onclick = saveAndClose;
    
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        saveAndClose();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    setTimeout(() => modal.classList.add('active'), 10);
  }
}

return new TimePlugin(context, hooks);
