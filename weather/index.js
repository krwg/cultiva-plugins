// Cultiva Weather Plugin v1.0.0
// Powered by Open-Meteo API (free, no API key required)

class WeatherPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.settings = {
      city: 'Moscow',
      units: 'celsius',
      showInGarden: true,
      lat: 55.7558,
      lon: 37.6173
    };
    this.weatherData = null;
    this.updateInterval = null;
    this.searchTimeout = null;
    this.searchResults = [];
    
    this.popularCities = [
      { name: 'Moscow', country: 'Russia', lat: 55.7558, lon: 37.6173 },
      { name: 'Saint Petersburg', country: 'Russia', lat: 59.9343, lon: 30.3351 },
      { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 },
      { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060 },
      { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
      { name: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050 },
      { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
      { name: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964 },
      { name: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038 },
      { name: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074 },
      { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
      { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708 },
      { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lon: 28.9784 },
      { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lon: -43.1729 },
      { name: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357 }
    ];
  }
  
  async onEnable() {
    console.log('[Weather] Plugin enabled');
    
    await this.loadStyles();
    
    const saved = await this.context.storage.get('settings');
    if (saved) {
      this.settings = { ...this.settings, ...saved };
    }
    
    this.context.ui.registerHeaderItem({
      label: 'Weather',
      icon: this.getWeatherIcon() || '🌤️',
      onClick: () => this.openWeatherModal()
    });
    
    if (this.settings.showInGarden) {
      this.context.ui.registerGardenWidget({
        render: (container) => this.renderGardenWidget(container),
        position: 'top'
      });
    }
    
    await this.fetchWeather();
    
    this.updateInterval = setInterval(() => this.fetchWeather(), 30 * 60 * 1000);
    
    this.hooks.on('onHabitComplete', (habit) => {
      console.log('[Weather] Habit completed:', habit.name);
    });
  }
  
  async loadStyles() {
    if (document.getElementById('weather-plugin-styles')) return;
    
    try {
      const css = await window.electron.readPluginFile('weather/styles.css');
      if (css) {
        const style = document.createElement('style');
        style.id = 'weather-plugin-styles';
        style.textContent = css;
        document.head.appendChild(style);
      }
    } catch (e) {
      console.warn('[Weather] Failed to load styles:', e);
    }
  }
  
  async onDisable() {
    console.log('[Weather] Plugin disabled');
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    document.getElementById('weather-plugin-styles')?.remove();
  }
  
  async searchCity(query) {
    if (!query || query.length < 2) return [];
    
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
      const response = await fetch(url);
      const data = await response.json();
      
      return (data.results || []).map(r => ({
        name: r.name,
        country: r.country,
        admin1: r.admin1,
        lat: r.latitude,
        lon: r.longitude
      }));
    } catch (e) {
      console.error('[Weather] Search failed:', e);
      return [];
    }
  }
  
  async fetchWeather() {
    try {
      const lat = this.settings.lat || 55.7558;
      const lon = this.settings.lon || 37.6173;
      
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      this.weatherData = {
        temp: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        units: '°C'
      };
      
      if (this.settings.units === 'fahrenheit') {
        this.weatherData.temp = Math.round(this.weatherData.temp * 9/5 + 32);
        this.weatherData.feelsLike = Math.round(this.weatherData.feelsLike * 9/5 + 32);
        this.weatherData.units = '°F';
      }
      
      console.log('[Weather] Updated:', this.weatherData);
      
      this.updateHeaderIcon();
      this.updateGardenWidget();
      
    } catch (e) {
      console.error('[Weather] Failed to fetch:', e);
    }
  }
  
  getWeatherIcon() {
    if (!this.weatherData) return '🌤️';
    
    const code = this.weatherData.weatherCode;
    
    if (code === 0) return '☀️';
    if (code === 1 || code === 2) return '🌤️';
    if (code === 3) return '☁️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 57) return '🌧️';
    if (code >= 61 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95) return '⛈️';
    
    return '🌡️';
  }
  
  getWeatherDescription() {
    if (!this.weatherData) return 'Loading...';
    
    const code = this.weatherData.weatherCode;
    
    if (code === 0) return 'Clear';
    if (code === 1 || code === 2) return 'Partly cloudy';
    if (code === 3) return 'Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 57) return 'Drizzle';
    if (code >= 61 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 85 && code <= 86) return 'Snow showers';
    if (code >= 95) return 'Thunderstorm';
    
    return 'Unknown';
  }
  
  updateHeaderIcon() {
    const icon = this.getWeatherIcon();
    const temp = this.weatherData ? Math.round(this.weatherData.temp) : '--';
    
    const headerItems = document.querySelectorAll('.header-plugin-item');
    headerItems.forEach(item => {
      const iconEl = item.querySelector('.header-plugin-icon');
      if (iconEl && (iconEl.textContent === '🌤️' || iconEl.textContent === '☀️' || iconEl.textContent === '🌡️' || iconEl.textContent === '☁️' || iconEl.textContent === '🌧️')) {
        item.innerHTML = `
          <span class="header-plugin-icon">${icon}</span>
          <span>${temp}${this.weatherData?.units || '°C'}</span>
        `;
      }
    });
  }
  
  updateGardenWidget() {
    const widget = document.getElementById('weather-garden-widget');
    if (!widget || !this.weatherData) return;
    
    widget.innerHTML = `
      <div class="weather-widget-content">
        <span class="weather-icon">${this.getWeatherIcon()}</span>
        <span class="weather-temp">${Math.round(this.weatherData.temp)}${this.weatherData.units}</span>
        <span class="weather-desc">${this.getWeatherDescription()}</span>
        <span class="weather-location">${this.settings.city}</span>
      </div>
    `;
  }
  
  renderGardenWidget(container) {
    if (!container) return;
    
    const widget = document.createElement('div');
    widget.className = 'weather-widget';
    widget.id = 'weather-garden-widget';
    
    if (this.weatherData) {
      widget.innerHTML = `
        <div class="weather-widget-content">
          <span class="weather-icon">${this.getWeatherIcon()}</span>
          <span class="weather-temp">${Math.round(this.weatherData.temp)}${this.weatherData.units}</span>
          <span class="weather-desc">${this.getWeatherDescription()}</span>
          <span class="weather-location">${this.settings.city}</span>
        </div>
      `;
    } else {
      widget.innerHTML = `
        <div class="weather-widget-content">
          <span class="weather-icon">🌤️</span>
          <span class="weather-temp">--</span>
          <span class="weather-desc">Loading...</span>
        </div>
      `;
    }
    
    widget.addEventListener('click', () => this.openWeatherModal());
    
    container.appendChild(widget);
  }
  
  openWeatherModal() {
    if (!this.weatherData) {
      this.context.ui.showNotification('🌤️', 'Weather data not available');
      return;
    }
    
    document.querySelector('.weather-modal')?.remove();
    
    const modal = document.createElement('div');
    modal.className = 'weather-modal';
    modal.innerHTML = `
      <div class="weather-modal-overlay"></div>
      <div class="weather-modal-content" style="max-width: 420px;">
        <div class="weather-modal-header">
          <h2>${this.settings.city}</h2>
          <button class="weather-modal-close">&times;</button>
        </div>
        <div class="weather-modal-body">
          <div class="weather-main">
            <span class="weather-main-icon">${this.getWeatherIcon()}</span>
            <span class="weather-main-temp">${Math.round(this.weatherData.temp)}${this.weatherData.units}</span>
          </div>
          <div class="weather-desc">${this.getWeatherDescription()}</div>
          <div class="weather-details">
            <div class="weather-detail">
              <span>Feels like</span>
              <span>${Math.round(this.weatherData.feelsLike)}${this.weatherData.units}</span>
            </div>
            <div class="weather-detail">
              <span>Humidity</span>
              <span>${this.weatherData.humidity}%</span>
            </div>
            <div class="weather-detail">
              <span>Wind</span>
              <span>${this.weatherData.windSpeed} km/h</span>
            </div>
          </div>
          
          <div class="weather-city-search" style="margin-top: 16px;">
            <label style="font-size: 12px; color: var(--text-tertiary);">Search city</label>
            <input type="text" class="weather-search-input" placeholder="Type city name..." 
                   style="width: 100%; padding: 10px; border-radius: 8px; background: var(--bg-secondary); 
                          color: var(--text-primary); border: 1px solid var(--border-light); margin-top: 4px;">
            <div class="weather-search-results" style="max-height: 200px; overflow-y: auto; margin-top: 8px;"></div>
          </div>
          
          <div class="weather-popular" style="margin-top: 12px;">
            <label style="font-size: 12px; color: var(--text-tertiary);">Popular cities</label>
            <div class="weather-popular-list" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
              ${this.popularCities.slice(0, 6).map(c => 
                `<button class="weather-city-btn" data-lat="${c.lat}" data-lon="${c.lon}" data-name="${c.name}" 
                         style="padding: 6px 12px; background: var(--bg-tertiary); border: 1px solid var(--border-light); 
                                border-radius: 16px; font-size: 12px; cursor: pointer; color: var(--text-primary);">
                  ${c.name}
                </button>`
              ).join('')}
            </div>
          </div>
          
          <div class="weather-units-selector" style="margin-top: 16px;">
            <label style="font-size: 12px; color: var(--text-tertiary);">Units</label>
            <select class="weather-units-select" style="width: 100%; padding: 8px; border-radius: 8px; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-light); margin-top: 4px;">
              <option value="celsius" ${this.settings.units === 'celsius' ? 'selected' : ''}>Celsius (°C)</option>
              <option value="fahrenheit" ${this.settings.units === 'fahrenheit' ? 'selected' : ''}>Fahrenheit (°F)</option>
            </select>
          </div>
          
          <div class="weather-credit">
            Powered by Open-Meteo
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.weather-modal-close');
    const overlay = modal.querySelector('.weather-modal-overlay');
    const searchInput = modal.querySelector('.weather-search-input');
    const searchResults = modal.querySelector('.weather-search-results');
    const unitsSelect = modal.querySelector('.weather-units-select');
    
    closeBtn.onclick = () => modal.remove();
    overlay.onclick = () => modal.remove();
    
    searchInput.oninput = async () => {
      clearTimeout(this.searchTimeout);
      const query = searchInput.value.trim();
      
      if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
      }
      
      searchResults.innerHTML = '<div style="padding: 8px; color: var(--text-tertiary);">Searching...</div>';
      
      this.searchTimeout = setTimeout(async () => {
        const results = await this.searchCity(query);
        
        if (results.length === 0) {
          searchResults.innerHTML = '<div style="padding: 8px; color: var(--text-tertiary);">No cities found</div>';
          return;
        }
        
        searchResults.innerHTML = results.map(r => `
          <div class="weather-search-item" data-lat="${r.lat}" data-lon="${r.lon}" data-name="${r.name}" 
               style="padding: 8px; cursor: pointer; border-radius: 6px; margin-bottom: 2px;"
               onmouseover="this.style.background='var(--bg-tertiary)'" 
               onmouseout="this.style.background='transparent'">
            ${r.name}${r.admin1 ? ', ' + r.admin1 : ''} (${r.country})
          </div>
        `).join('');
        

        searchResults.querySelectorAll('.weather-search-item').forEach(item => {
          item.onclick = async () => {
            const lat = parseFloat(item.dataset.lat);
            const lon = parseFloat(item.dataset.lon);
            const name = item.dataset.name;
            
            this.settings.lat = lat;
            this.settings.lon = lon;
            this.settings.city = name;
            await this.context.storage.set('settings', this.settings);
            
            modal.querySelector('.weather-modal-header h2').textContent = name;
            searchResults.innerHTML = '';
            searchInput.value = '';
            
            this.fetchWeather();
          };
        });
      }, 500);
    };
    

    modal.querySelectorAll('.weather-city-btn').forEach(btn => {
      btn.onclick = async () => {
        const lat = parseFloat(btn.dataset.lat);
        const lon = parseFloat(btn.dataset.lon);
        const name = btn.dataset.name;
        
        this.settings.lat = lat;
        this.settings.lon = lon;
        this.settings.city = name;
        await this.context.storage.set('settings', this.settings);
        
        modal.querySelector('.weather-modal-header h2').textContent = name;
        
        this.fetchWeather();
      };
    });
    
    unitsSelect.onchange = async () => {
      this.settings.units = unitsSelect.value;
      await this.context.storage.set('settings', this.settings);
      this.fetchWeather();
    };
    
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    setTimeout(() => modal.classList.add('active'), 10);
  }
  
  checkExtremeWeather() {
    if (!this.weatherData) return;
    
    const temp = this.weatherData.temp;
    const weatherCode = this.weatherData.weatherCode;
    
    if (temp > 30) {
      this.context.ui.showNotification('🔥', 'Stay hydrated! It\'s hot outside.');
    }
    
    if (temp < 0) {
      this.context.ui.showNotification('❄️', 'Bundle up! It\'s freezing.');
    }
    
    if (weatherCode >= 95) {
      this.context.ui.showNotification('⛈️', 'Thunderstorm warning! Stay safe.');
    }
  }
}

return new WeatherPlugin(context, hooks);
