// Cultiva Weather Plugin [1.0.0]
// Powered by Open-Meteo API (free, no API key required)

class WeatherPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.settings = {
      city: 'Moscow',
      units: 'celsius',
      showInGarden: true
    };
    this.weatherData = null;
    this.updateInterval = null;
    
    this.cityCoordinates = {
      'Moscow': { lat: 55.7558, lon: 37.6173 },
      'Saint Petersburg': { lat: 59.9343, lon: 30.3351 },
      'London': { lat: 51.5074, lon: -0.1278 },
      'New York': { lat: 40.7128, lon: -74.0060 },
      'Tokyo': { lat: 35.6762, lon: 139.6503 },
      'Berlin': { lat: 52.5200, lon: 13.4050 },
      'Paris': { lat: 48.8566, lon: 2.3522 }
    };
  }
  
  async onEnable() {
    console.log('[Weather] Plugin enabled');
    
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
  
  async onDisable() {
    console.log('[Weather] Plugin disabled');
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
  
  async fetchWeather() {
    try {
      const coords = this.cityCoordinates[this.settings.city] || this.cityCoordinates['Moscow'];
      
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
      
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
      
      this.checkExtremeWeather();
      
    } catch (e) {
      console.error('[Weather] Failed to fetch:', e);
    }
  }
  
  getWeatherIcon() {
    if (!this.weatherData) return '🌤️';
    
    const code = this.weatherData.weatherCode;
    
    if (code === 0) return '☀️'; // Clear sky
    if (code === 1 || code === 2) return '🌤️'; // Partly cloudy
    if (code === 3) return '☁️'; // Cloudy
    if (code >= 45 && code <= 48) return '🌫️'; // Fog
    if (code >= 51 && code <= 57) return '🌧️'; // Drizzle
    if (code >= 61 && code <= 67) return '🌧️'; // Rain
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code >= 80 && code <= 82) return '🌦️'; // Rain showers
    if (code >= 85 && code <= 86) return '🌨️'; // Snow showers
    if (code >= 95) return '⛈️'; // Thunderstorm
    
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
      if (item.querySelector('.header-plugin-icon')?.textContent === '🌤️' ||
          item.querySelector('.header-plugin-icon')?.textContent === '☀️') {
        item.innerHTML = `
          <span class="header-plugin-icon">${icon}</span>
          <span>${temp}${this.weatherData?.units || '°C'}</span>
        `;
      }
    });
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
    
    const modal = document.createElement('div');
    modal.className = 'weather-modal';
    modal.innerHTML = `
      <div class="weather-modal-overlay"></div>
      <div class="weather-modal-content">
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
          <div class="weather-credit">
            Powered by Open-Meteo
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.weather-modal-close').onclick = () => modal.remove();
    modal.querySelector('.weather-modal-overlay').onclick = () => modal.remove();
    
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
  
  async onSettingsChanged(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    await this.context.storage.set('settings', this.settings);
    await this.fetchWeather();
  }
}

return new WeatherPlugin(context, hooks);
