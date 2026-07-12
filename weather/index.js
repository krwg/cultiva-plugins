

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
    this._sheetSearchQuery = '';
    this._locale = 'en';

    this.popularCities = [
      { name: 'Moscow', nameRu: 'Москва', country: 'Russia', lat: 55.7558, lon: 37.6173 },
      { name: 'Saint Petersburg', nameRu: 'Санкт-Петербург', country: 'Russia', lat: 59.9343, lon: 30.3351 },
      { name: 'London', nameRu: 'Лондон', country: 'UK', lat: 51.5074, lon: -0.1278 },
      { name: 'Paris', nameRu: 'Париж', country: 'France', lat: 48.8566, lon: 2.3522 },
      { name: 'Berlin', nameRu: 'Берлин', country: 'Germany', lat: 52.5200, lon: 13.4050 },
      { name: 'Rome', nameRu: 'Рим', country: 'Italy', lat: 41.9028, lon: 12.4964 },
      { name: 'Madrid', nameRu: 'Мадрид', country: 'Spain', lat: 40.4168, lon: -3.7038 },
      { name: 'Tokyo', nameRu: 'Токио', country: 'Japan', lat: 35.6762, lon: 139.6503 },
      { name: 'Beijing', nameRu: 'Пекин', country: 'China', lat: 39.9042, lon: 116.4074 },
      { name: 'New York', nameRu: 'Нью-Йорк', country: 'USA', lat: 40.7128, lon: -74.0060 }
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

  _t(key) {
    const ru = {
      loading: 'Загрузка…',
      feels: 'Ощущается',
      humidity: 'Влажность',
      wind: 'Ветер',
      searchCity: 'Поиск города',
      searchPlaceholder: 'Введите минимум 2 буквы…',
      quickPicks: 'Быстрый выбор',
      units: 'Единицы',
      celsius: 'Цельсий °C',
      fahrenheit: 'Фаренгейт °F',
      footnote: 'Open-Meteo · Локальная база РФ + геокодинг',
      noCities: 'Города не найдены',
      clear: 'Ясно',
      partlyCloudy: 'Переменная облачность',
      cloudy: 'Облачно',
      foggy: 'Туман',
      drizzle: 'Морось',
      rainy: 'Дождь',
      snowy: 'Снег',
      showers: 'Ливни',
      snowShowers: 'Снегопад',
      thunderstorm: 'Гроза',
      unknown: 'Неизвестно',
      hot: 'Жарко — пейте воду',
      cold: 'Мороз — оденьтесь теплее',
      storm: 'Гроза — будьте осторожны'
    };
    const en = {
      loading: 'Loading…',
      feels: 'Feels',
      humidity: 'Humidity',
      wind: 'Wind',
      searchCity: 'Search city',
      searchPlaceholder: 'Type at least 2 letters…',
      quickPicks: 'Quick picks',
      units: 'Units',
      celsius: 'Celsius °C',
      fahrenheit: 'Fahrenheit °F',
      footnote: 'Open-Meteo · Local RU + geocoding',
      noCities: 'No cities found',
      clear: 'Clear',
      partlyCloudy: 'Partly cloudy',
      cloudy: 'Cloudy',
      foggy: 'Foggy',
      drizzle: 'Drizzle',
      rainy: 'Rainy',
      snowy: 'Snowy',
      showers: 'Showers',
      snowShowers: 'Snow showers',
      thunderstorm: 'Thunderstorm',
      unknown: 'Unknown',
      hot: 'Stay hydrated! It\'s hot outside.',
      cold: 'Bundle up! It\'s freezing.',
      storm: 'Thunderstorm warning! Stay safe.'
    };
    const dict = this._locale === 'ru' ? ru : en;
    return dict[key] || key;
  }

  _weatherKind() {
    if (!this.weatherData) return 'loading';
    const code = this.weatherData.weatherCode;
    if (code === 0) return 'clear';
    if (code === 1 || code === 2) return 'partly';
    if (code === 3) return 'cloudy';
    if (code >= 45 && code <= 48) return 'fog';
    if (code >= 51 && code <= 67) return 'rain';
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 80 && code <= 82) return 'showers';
    if (code >= 85 && code <= 86) return 'snow';
    if (code >= 95) return 'storm';
    return 'cloudy';
  }

  _weatherIconSvg(kind) {
    const k = kind || this._weatherKind();
    const common = 'class="weather-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"';
    const icons = {
      clear: `<svg ${common}><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2.5v3M12 18.5v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2.5 12h3M18.5 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/></g></svg>`,
      partly: `<svg ${common}><circle cx="8.5" cy="9" r="3.5" fill="currentColor"/><path d="M6.5 18h10.5a4.5 4.5 0 0 0 .4-9 5.5 5.5 0 0 0-10.6 1.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
      cloudy: `<svg ${common}><path d="M6.5 18h11a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.3 1.8A4 4 0 0 0 6.5 18z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
      fog: `<svg ${common}><path d="M5 9h14M4 13h16M6 17h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
      rain: `<svg ${common}><path d="M7 14h10a4 4 0 0 0 .3-8 5.5 5.5 0 0 0-10.5 1.5A3.5 3.5 0 0 0 7 14z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 17.5v3M12 16.5v3M15 17.5v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
      snow: `<svg ${common}><path d="M7 13h10a4 4 0 0 0 .3-8 5.5 5.5 0 0 0-10.5 1.5A3.5 3.5 0 0 0 7 13z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 17.5l1.2 1.2M16 17.5l-1.2 1.2M12 16v2.8M10.5 19.5h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
      showers: `<svg ${common}><path d="M6 12h12a4 4 0 0 0 .2-8 5.5 5.5 0 0 0-10.4 1.4A3.5 3.5 0 0 0 6 12z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 15.5v2.5M12 14.5v2.5M16 15.5v2.5M10 19v2M14 19v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      storm: `<svg ${common}><path d="M7 13h10a4 4 0 0 0 .3-8 5.5 5.5 0 0 0-10.5 1.5A3.5 3.5 0 0 0 7 13z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M13.5 15.5H11l1.5 4.5L9 17h2.5L10 13.5h2.5l-1.5 2z" fill="currentColor"/></svg>`,
      loading: `<svg ${common}><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="4 3"/></svg>`
    };
    return icons[k] || icons.cloudy;
  }

  _cityLabel(name) {
    if (this._locale !== 'ru') {
      return name;
    }
    const hit = this.popularCities.find((c) => c.name === name);
    if (hit && hit.nameRu) {
      return hit.nameRu;
    }
    const local = this.russianCities.find((c) => String(c.name || '').toLowerCase() === String(name || '').toLowerCase());
    return local ? local.name : name;
  }

  _geoLang() {
    return this._locale === 'ru' ? 'ru' : 'en';
  }

  _windUnit() {
    return this._locale === 'ru' ? 'км/ч' : 'km/h';
  }

  _patchSearchResults(html) {
    if (this.context.ui.patchMainSheet) {
      this.context.ui.patchMainSheet('.cultiva-search-results', html);
      return;
    }
    this.context.ui.openMainSheet(this._buildWeatherSheetHtml(html));
  }

  async onEnable() {
    console.log('[Weather] Plugin enabled');

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
    await this._syncCoordsFromCity();

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
    } else {
      this.context.ui.updateGardenHtml('<div style="display:none"></div>');
    }

    await this._loadRussianCities();
    void this.fetchWeather();
    this.updateInterval = setInterval(() => this.fetchWeather(), 30 * 60 * 1000);

    this.hooks.on('onHabitComplete', () => {
      this.checkExtremeWeather();
    });
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
    await this._syncCoordsFromCity();
    if (this.settings.showInGarden) {
      this.context.ui.updateGardenHtml(this._gardenInnerHtml());
    } else {
      this.context.ui.updateGardenHtml('<div style="display:none"></div>');
    }
    await this.fetchWeather();
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
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=${this._geoLang()}&format=json`;
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

  async geocodeCity(name) {
    const q = String(name || '').trim();
    if (!q) {
      return null;
    }
    await this._loadRussianCities();
    const local = this.russianCities.find((c) => String(c.name || '').toLowerCase() === q.toLowerCase());
    if (local) {
      return { city: local.name, lat: local.lat, lon: local.lon };
    }
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=${this._geoLang()}&format=json`;
      const res = await fetch(url);
      const data = await res.json();
      const hit = Array.isArray(data.results) ? data.results[0] : null;
      if (!hit) {
        return null;
      }
      return { city: hit.name || q, lat: hit.latitude, lon: hit.longitude };
    } catch {
      return null;
    }
  }

  async _syncCoordsFromCity() {
    const mapped = await this.geocodeCity(this.settings.city);
    if (!mapped) {
      return;
    }
    this.settings.city = mapped.city;
    this.settings.lat = mapped.lat;
    this.settings.lon = mapped.lon;
    await this.context.storage.set('settings', this.settings);
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
    return this._weatherKind();
  }

  getWeatherDescription() {
    if (!this.weatherData) return this._t('loading');
    const code = this.weatherData.weatherCode;
    if (code === 0) return this._t('clear');
    if (code === 1 || code === 2) return this._t('partlyCloudy');
    if (code === 3) return this._t('cloudy');
    if (code >= 45 && code <= 48) return this._t('foggy');
    if (code >= 51 && code <= 57) return this._t('drizzle');
    if (code >= 61 && code <= 67) return this._t('rainy');
    if (code >= 71 && code <= 77) return this._t('snowy');
    if (code >= 80 && code <= 82) return this._t('showers');
    if (code >= 85 && code <= 86) return this._t('snowShowers');
    if (code >= 95) return this._t('thunderstorm');
    return this._t('unknown');
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
    const kind = this._weatherKind();
    const icon = this._weatherIconSvg(kind);
    if (!this.weatherData) {
      return `<article class="habit-card garden-plugin-card weather-garden-card weather-garden-card--${kind}" tabindex="0">
        <div class="card-header">
          <div class="plant-visual weather-garden-icon">${icon}</div>
          <div class="card-info">
            <div class="card-title">--</div>
            <div class="card-subtitle">${this._escapeHtml(this._t('loading'))}</div>
          </div>
        </div>
      </article>`;
    }
    return `<article class="habit-card garden-plugin-card weather-garden-card weather-garden-card--${kind}" tabindex="0">
        <div class="card-header">
          <div class="plant-visual weather-garden-icon">${icon}</div>
          <div class="card-info">
            <div class="card-title">${Math.round(this.weatherData.temp)}${this.weatherData.units}</div>
            <div class="card-subtitle">${this._escapeHtml(this.getWeatherDescription())}</div>
            <span class="category-badge">${this._escapeHtml(this._cityLabel(this.settings.city))}</span>
          </div>
        </div>
      </article>`;
  }

  renderGardenWidget(container) {
    if (!container) return;
    container.innerHTML = this._gardenInnerHtml();
  }

  openWeatherModal() {
    this._sheetSearchQuery = '';
    this.context.ui.openMainSheet(this._buildWeatherSheetHtml(''));
  }

  _buildWeatherSheetHtml(searchResultsHtml) {
    const w = this.weatherData;
    const kind = this._weatherKind();
    const city = this._escapeHtml(this._cityLabel(this.settings.city));
    const mainTemp = w ? Math.round(w.temp) : '--';
    const units = w?.units || '°C';
    const desc = w ? this._escapeHtml(this.getWeatherDescription()) : this._escapeHtml(this._t('loading'));
    const feel = w ? Math.round(w.feelsLike) : '--';
    const hum = w ? w.humidity : '--';
    const wind = w ? w.windSpeed : '--';
    const searchVal = this._escapeAttr(this._sheetSearchQuery || '');
    const pills = this.popularCities
      .slice(0, 8)
      .map(
        (c) =>
          `<button type="button" class="cultiva-pill" data-cultiva-act="pickCity" data-lat="${c.lat}" data-lon="${c.lon}" data-city="${this._escapeAttr(c.name)}">${this._escapeHtml(this._locale === 'ru' ? (c.nameRu || c.name) : c.name)}</button>`
      )
      .join('');
    const results = searchResultsHtml || '';
    const icon = this._weatherIconSvg(kind);
    return `
<div class="cultiva-sheet-overlay" data-cultiva-act="close"></div>
<div class="cultiva-sheet-card cultiva-sheet-card--weather weather-sheet--${kind}">
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
      <span class="weather-hero-icon">${icon}</span>
      <span class="weather-hero-temp">${mainTemp}<span class="weather-hero-unit">${units}</span></span>
    </div>
    <div class="weather-metrics">
      <div><span class="cultiva-muted">${this._t('feels')}</span><strong>${feel}${units}</strong></div>
      <div><span class="cultiva-muted">${this._t('humidity')}</span><strong>${hum}%</strong></div>
      <div><span class="cultiva-muted">${this._t('wind')}</span><strong>${wind} ${this._windUnit()}</strong></div>
    </div>
    <label class="cultiva-field-label">${this._t('searchCity')}</label>
    <input type="text" name="citySearch" class="cultiva-sheet-input" data-cultiva-input-act="search" placeholder="${this._escapeAttr(this._t('searchPlaceholder'))}" value="${searchVal}" autocomplete="off" />
    <div class="cultiva-search-results">${results}</div>
    <label class="cultiva-field-label">${this._t('quickPicks')}</label>
    <div class="cultiva-pill-row">${pills}</div>
    <label class="cultiva-field-label">${this._t('units')}</label>
    <select name="units" class="cultiva-sheet-select" data-cultiva-change-act="unitsChange">
      <option value="celsius" ${this.settings.units === 'celsius' ? 'selected' : ''}>${this._t('celsius')}</option>
      <option value="fahrenheit" ${this.settings.units === 'fahrenheit' ? 'selected' : ''}>${this._t('fahrenheit')}</option>
    </select>
    <p class="cultiva-sheet-footnote">${this._t('footnote')}</p>
  </div>
</div>`;
  }

  async onModalAction(action, payload) {
    if (action === 'pickCity' && payload && payload.lat != null && payload.lon != null) {
      this.settings.lat = payload.lat;
      this.settings.lon = payload.lon;
      this.settings.city = payload.city || this.settings.city;
      this._sheetSearchQuery = '';
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
      this._sheetSearchQuery = q;
      clearTimeout(this._sheetSearchT);
      if (q.length < 2) {
        this._patchSearchResults('');
        return;
      }
      this._sheetSearchT = setTimeout(async () => {
        const results = await this.searchCity(q);
        let html = '';
        if (results.length === 0) {
          html = `<div class="cultiva-muted cultiva-pad">${this._escapeHtml(this._t('noCities'))}</div>`;
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
        this._patchSearchResults(html);
      }, 380);
    }
  }

  checkExtremeWeather() {
    if (!this.weatherData) return;
    const temp = this.weatherData.temp;
    const weatherCode = this.weatherData.weatherCode;
    if (temp > 30) this.context.ui.showNotification('', this._t('hot'));
    if (temp < 0) this.context.ui.showNotification('', this._t('cold'));
    if (weatherCode >= 95) this.context.ui.showNotification('', this._t('storm'));
  }
}

return new WeatherPlugin(context, hooks);
