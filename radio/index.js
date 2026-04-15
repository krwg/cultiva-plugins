// Cultiva Radio Plugin v1.0.0

class RadioPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.settings = {
      station: 'lofi',
      volume: 0.3,
      playing: false
    };
    this.audio = null;
    
    this.stations = {
      lofi: {
        name: 'Lofi Girl',
        url: 'https://stream.lofi.co/stream/lofi',
        icon: '🎧'
      },
      jazz: {
        name: 'Smooth Jazz',
        url: 'https://jazz.stream.ouifm.fr/ouifm-jazz.mp3',
        icon: '🎷'
      },
      classical: {
        name: 'Classical Radio',
        url: 'https://stream.classicalradio.com/classical',
        icon: '🎻'
      },
      nature: {
        name: 'Nature Sounds',
        url: 'https://stream.naturefm.com/nature',
        icon: '🌿'
      },
      rain: {
        name: 'Rain Ambient',
        url: 'https://stream.rainfm.com/rain',
        icon: '🌧️'
      }
    };
  }
  
  async onEnable() {
    console.log('[Radio] Plugin enabled');
    
    const saved = await this.context.storage.get('settings');
    if (saved) {
      this.settings = { ...this.settings, ...saved };
    }
    
    this.context.ui.registerHeaderItem({
      label: this.settings.playing ? '🔊' : '📻',
      icon: this.stations[this.settings.station]?.icon || '📻',
      onClick: () => this.openRadioModal()
    });
    
    if (this.settings.playing) {
      this.playStation(this.settings.station);
    }
  }
  
  onDisable() {
    console.log('[Radio] Plugin disabled');
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
  
  playStation(stationId) {
    const station = this.stations[stationId];
    if (!station) return;
    
    if (this.audio) {
      this.audio.pause();
    }
    
    try {
      this.audio = new Audio(station.url);
      this.audio.volume = this.settings.volume;
      this.audio.play().catch(e => {
        console.warn('[Radio] Playback failed:', e);
        this.context.ui.showNotification('📻', 'Station unavailable. Try another.');
      });
      
      this.settings.station = stationId;
      this.settings.playing = true;
      this.updateHeaderIcon('🔊', station.icon);
    } catch (e) {
      console.error('[Radio] Failed to play:', e);
    }
  }
  
  stopRadio() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    this.settings.playing = false;
    this.updateHeaderIcon('📻', this.stations[this.settings.station]?.icon || '📻');
  }
  
  updateHeaderIcon(label, icon) {
    const headerItems = document.querySelectorAll('.header-plugin-item');
    headerItems.forEach(item => {
      const iconEl = item.querySelector('.header-plugin-icon');
      if (iconEl && (iconEl.textContent === '📻' || iconEl.textContent === '🔊')) {
        item.innerHTML = `
          <span class="header-plugin-icon">${icon}</span>
          <span>${label}</span>
        `;
      }
    });
  }
  
  async openRadioModal() {
    const modal = document.createElement('div');
    modal.className = 'radio-modal';
    
    const stationEntries = Object.entries(this.stations).map(([id, station]) => `
      <div class="radio-station ${this.settings.station === id ? 'active' : ''}" data-station="${id}">
        <span class="radio-station-icon">${station.icon}</span>
        <span class="radio-station-name">${station.name}</span>
        ${this.settings.playing && this.settings.station === id ? '<span class="radio-playing">🔊</span>' : ''}
      </div>
    `).join('');
    
    modal.innerHTML = `
      <div class="radio-modal-overlay"></div>
      <div class="radio-modal-content" style="max-width: 360px;">
        <div class="radio-modal-header">
          <h2>📻 Radio Stations</h2>
          <button class="radio-modal-close">&times;</button>
        </div>
        <div class="radio-modal-body">
          <div class="radio-stations-list">
            ${stationEntries}
          </div>
          
          <div class="radio-volume" style="margin-top: 20px;">
            <label style="font-size: 12px; color: var(--text-tertiary);">Volume</label>
            <input type="range" class="radio-volume-slider" min="0" max="1" step="0.05" value="${this.settings.volume}" 
                   style="width: 100%; margin-top: 8px;">
            <span style="float: right; font-size: 12px; color: var(--text-tertiary);">${Math.round(this.settings.volume * 100)}%</span>
          </div>
          
          <div class="radio-controls" style="margin-top: 20px; display: flex; gap: 12px;">
            ${this.settings.playing ? `
              <button class="radio-btn radio-btn-stop" style="flex: 1; padding: 10px; border-radius: 8px; border: none; background: var(--accent-red); color: white; cursor: pointer;">
                ⏹ Stop
              </button>
            ` : ''}
          </div>
          
          <div class="radio-credit" style="margin-top: 16px; font-size: 11px; color: var(--text-tertiary); text-align: center;">
            Internet radio streams
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.radio-modal-close');
    const overlay = modal.querySelector('.radio-modal-overlay');
    const volumeSlider = modal.querySelector('.radio-volume-slider');
    const stopBtn = modal.querySelector('.radio-btn-stop');
    
    closeBtn.onclick = () => {
      this.context.storage.set('settings', this.settings);
      modal.remove();
    };
    overlay.onclick = () => {
      this.context.storage.set('settings', this.settings);
      modal.remove();
    };
    
    modal.querySelectorAll('.radio-station').forEach(el => {
      el.onclick = () => {
        const stationId = el.dataset.station;
        this.playStation(stationId);
        this.context.storage.set('settings', this.settings);
        modal.remove();
        this.context.ui.showNotification('📻', `Now playing: ${this.stations[stationId].name}`);
      };
    });
    
    volumeSlider.oninput = () => {
      this.settings.volume = parseFloat(volumeSlider.value);
      if (this.audio) {
        this.audio.volume = this.settings.volume;
      }
      volumeSlider.nextElementSibling.textContent = `${Math.round(this.settings.volume * 100)}%`;
    };
    
    if (stopBtn) {
      stopBtn.onclick = () => {
        this.stopRadio();
        this.context.storage.set('settings', this.settings);
        modal.remove();
      };
    }
    
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.context.storage.set('settings', this.settings);
        modal.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    setTimeout(() => modal.classList.add('active'), 10);
  }
}

return new RadioPlugin(context, hooks);
