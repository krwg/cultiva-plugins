

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
    this._sheetSearchT = null;

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
      { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708 }
    ];

     this.russianCities = [];

    this._citiesLoaded = false;
    this._citiesLoadPromise = null;

    this._loadRussianCities = async () => {
      if (this._citiesLoaded) {
        return this.russianCities;
      }
      if (this._citiesLoadPromise) {
        return this._citiesLoadPromise;
      }
    this._citiesLoadPromise = (async () => {
      try {
        if (this.context.data && typeof this.context.data.read === 'function') {
          const list = await this.context.data.read('cities-ru.json');
          this.russianCities = Array.isArray(list) ? list : [];
        } else {
          const res = await fetch('https://raw.githubusercontent.com/krwg/cultiva-plugins/main/weather/cities-ru.json', { cache: 'force-cache' });
          if (res.ok) {
            this.russianCities = await res.json();
          }
        }
      } catch (e) {
        this.russianCities = [];
      }
      this._citiesLoaded = true;
      return this.russianCities;
    })();
      return this._citiesLoadPromise;
    };
  }

  async onEnable() {
    console.log('[Weather] Plugin enabled');

    const saved = await this.context.storage.get('settings');
    if (saved) {
      this.settings = { ...this.settings, ...saved };
    }

    this.context.ui.registerHeaderItem({
      label: '—',
      icon: '',
      onClick: () => this.openWeatherModal()
    });

    if (this.settings.showInGarden) {
      this.context.ui.registerGardenWidget({
        render: (container) => this.renderGardenWidget(container),
        position: 'top',
        onTapMethod: 'openWeatherModal'
      });
    }

    await this._loadRussianCities();
    void this.fetchWeather();
    this.updateInterval = setInterval(() => this.fetchWeather(), 30 * 60 * 1000);

    this.hooks.on('onHabitComplete', (habit) => {
      console.log('[Weather] Habit completed:', habit.name);
    });
  }

  async onDisable() {
    console.log('[Weather] Plugin disabled');
    if (this.updateInterval) clearInterval(this.updateInterval);
  }

  async searchCity(query) {
    if (!query || query.length < 2) return [];

    await this._loadRussianCities();

    const localResults = this.russianCities
      .filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
      .map(c => ({
        name: c.name,
        country: 'Russia',
        lat: c.lat,
        lon: c.lon
      }));

    if (localResults.length > 0) {
      console.log('[Weather] Found in local DB:', localResults.length);
      return localResults.slice(0, 10);
    }

    console.log('[Weather] Searching via Open-Meteo API...');
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
    return '';
  }

  getWeatherShortCode() {
    if (!this.weatherData) return '—';
    const code = this.weatherData.weatherCode;
    if (code === 0) return 'CLR';
    if (code === 1 || code === 2) return 'PTC';
    if (code === 3) return 'CLD';
    if (code >= 45 && code <= 48) return 'FOG';
    if (code >= 51 && code <= 67) return 'RN';
    if (code >= 71 && code <= 77) return 'SN';
    if (code >= 80 && code <= 86) return 'SH';
    if (code >= 95) return 'TS';
    return '—';
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

  updateHeaderIcon() {
    const temp = this.weatherData ? Math.round(this.weatherData.temp) : '--';
    const u = this.weatherData?.units || '°C';
    this.context.ui.updateMainHeader({
      label: `${temp}${u}`,
      icon: ''
    });
  }

  updateGardenWidget() {
    if (!this.settings.showInGarden) return;
    this.context.ui.updateGardenHtml(this._gardenInnerHtml());
  }

  _gardenInnerHtml() {
    if (!this.weatherData) {
      return `<div class="weather-widget-content weather-widget--loading"><span class="weather-temp">--</span><span class="weather-desc">Loading</span></div>`;
    }
    return `<div class="weather-widget-content cultiva-garden-weather">
        <span class="weather-code">${this.getWeatherShortCode()}</span>
        <span class="weather-temp">${Math.round(this.weatherData.temp)}${this.weatherData.units}</span>
        <span class="weather-desc">${this._escapeHtml(this.getWeatherDescription())}</span>
        <span class="weather-location">${this._escapeHtml(this.settings.city)}</span>
      </div>`;
  }

  renderGardenWidget(container) {
    if (!container) return;
    container.innerHTML = this._gardenInnerHtml();
  }

  openWeatherModal() {
    this.context.ui.openMainSheet(this._buildWeatherSheetHtml(''));
  }

  _buildWeatherSheetHtml(searchResultsHtml) {
    const w = this.weatherData;
    const city = this._escapeHtml(this.settings.city);
    const mainTemp = w ? Math.round(w.temp) : '--';
    const units = w?.units || '°C';
    const desc = w ? this._escapeHtml(this.getWeatherDescription()) : 'Loading…';
    const feel = w ? Math.round(w.feelsLike) : '--';
    const hum = w ? w.humidity : '--';
    const wind = w ? w.windSpeed : '--';
    const pills = this.popularCities
      .slice(0, 8)
      .map(
        (c) =>
          `<button type="button" class="cultiva-pill" data-cultiva-act="pickCity" data-lat="${c.lat}" data-lon="${c.lon}" data-city="${this._escapeAttr(c.name)}">${this._escapeHtml(c.name)}</button>`
      )
      .join('');
    const results = searchResultsHtml || '';
    return `
<div class="cultiva-sheet-overlay" data-cultiva-act="close"></div>
<div class="cultiva-sheet-card cultiva-sheet-card--weather">
  <div class="cultiva-sheet-grabber"></div>
  <div class="cultiva-sheet-head">
    <div>
      <div class="cultiva-sheet-title">${city}</div>
      <div class="cultiva-sheet-sub">${desc}</div>
    </div>
    <button type="button" class="cultiva-sheet-x" data-cultiva-act="close" aria-label="Close">×</button>
  </div>
  <div class="cultiva-sheet-body">
    <div class="weather-hero">
      <span class="weather-hero-code">${w ? this.getWeatherShortCode() : '—'}</span>
      <span class="weather-hero-temp">${mainTemp}<span class="weather-hero-unit">${units}</span></span>
    </div>
    <div class="weather-metrics">
      <div><span class="cultiva-muted">Feels</span><strong>${feel}${units}</strong></div>
      <div><span class="cultiva-muted">Humidity</span><strong>${hum}%</strong></div>
      <div><span class="cultiva-muted">Wind</span><strong>${wind} km/h</strong></div>
    </div>
    <label class="cultiva-field-label">Search city</label>
    <input type="text" name="citySearch" class="cultiva-sheet-input" data-cultiva-input-act="search" placeholder="Type at least 2 letters…" autocomplete="off" />
    <div class="cultiva-search-results">${results}</div>
    <label class="cultiva-field-label">Quick picks</label>
    <div class="cultiva-pill-row">${pills}</div>
    <label class="cultiva-field-label">Units</label>
    <select name="units" class="cultiva-sheet-select" data-cultiva-change-act="unitsChange">
      <option value="celsius" ${this.settings.units === 'celsius' ? 'selected' : ''}>Celsius °C</option>
      <option value="fahrenheit" ${this.settings.units === 'fahrenheit' ? 'selected' : ''}>Fahrenheit °F</option>
    </select>
    <p class="cultiva-sheet-footnote">Open-Meteo · Local RU + geocoding</p>
  </div>
</div>`;
  }

  async onModalAction(action, payload) {
    if (action === 'pickCity' && payload && payload.lat != null && payload.lon != null) {
      this.settings.lat = payload.lat;
      this.settings.lon = payload.lon;
      this.settings.city = payload.city || this.settings.city;
      await this.context.storage.set('settings', this.settings);
      await this.fetchWeather();
      this.context.ui.openMainSheet(this._buildWeatherSheetHtml(''));
      return;
    }
    if (action === 'unitsChange' && payload && payload.value) {
      this.settings.units = payload.value;
      await this.context.storage.set('settings', this.settings);
      await this.fetchWeather();
      this.context.ui.openMainSheet(this._buildWeatherSheetHtml(''));
      return;
    }
    if (action === 'input:search') {
      const q = (payload && String(payload.value).trim()) || '';
      clearTimeout(this._sheetSearchT);
      if (q.length < 2) {
        this.context.ui.openMainSheet(this._buildWeatherSheetHtml(''));
        return;
      }
      this._sheetSearchT = setTimeout(async () => {
        const results = await this.searchCity(q);
        let html = '';
        if (results.length === 0) {
          html = '<div class="cultiva-muted cultiva-pad">No cities found</div>';
        } else {
          html = results
            .map(
              (r) =>
                `<button type="button" class="cultiva-list-row" data-cultiva-act="pickCity" data-lat="${r.lat}" data-lon="${r.lon}" data-city="${this._escapeAttr(r.name)}">
              <span class="cultiva-list-title">${this._escapeHtml(r.name)}</span>
              <span class="cultiva-list-sub">${this._escapeHtml([r.admin1, r.country].filter(Boolean).join(', '))}</span>
            </button>`
            )
            .join('');
        }
        this.context.ui.openMainSheet(this._buildWeatherSheetHtml(html));
      }, 380);
    }
  }

  checkExtremeWeather() {
    if (!this.weatherData) return;
    const temp = this.weatherData.temp;
    const weatherCode = this.weatherData.weatherCode;
    if (temp > 30) this.context.ui.showNotification('', 'Stay hydrated! It\'s hot outside.');
    if (temp < 0) this.context.ui.showNotification('', 'Bundle up! It\'s freezing.');
    if (weatherCode >= 95) this.context.ui.showNotification('', 'Thunderstorm warning! Stay safe.');
  }
}

return new WeatherPlugin(context, hooks);
