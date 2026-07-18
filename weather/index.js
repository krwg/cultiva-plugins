
class WeatherPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.settings = {
      city: 'Moscow',
      units: 'celsius',
      showInGarden: true,
      neoMode: false,
      neoBypassThemes: false,
      showHourly: true,
      showDaily: true,
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
      storm: 'Гроза — будьте осторожны',
      hourly: 'По часам',
      daily: 'На неделю',
      precip: 'Осадки',
      showHourly: 'Почасовой прогноз',
      showDaily: 'Прогноз на неделю',
      neoHint: 'Погода Нео',
      pressure: 'Давление',
      clouds: 'Облачность',
      uv: 'УФ-индекс',
      hpa: 'гПа'
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
      storm: 'Thunderstorm warning! Stay safe.',
      hourly: 'Hourly',
      daily: 'This week',
      precip: 'Precip',
      showHourly: 'Hourly forecast',
      showDaily: '7-day forecast',
      neoHint: 'Weather Neo',
      pressure: 'Pressure',
      clouds: 'Clouds',
      uv: 'UV index',
      hpa: 'hPa'
    };
    const dict = this._locale === 'ru' ? ru : en;
    return dict[key] || key;
  }

  _isNeo() {
    return this.settings.neoMode === true;
  }

  _neoBypass() {
    return this._isNeo() && this.settings.neoBypassThemes === true;
  }

  _neoClassList() {
    if (!this._isNeo()) return '';
    return this._neoBypass() ? ' weather-neo weather-neo-bypass' : ' weather-neo';
  }

  _isLowPower() {
    try {
      return typeof document !== 'undefined'
        && document.documentElement?.dataset?.lowPower === '1';
    } catch {
      return false;
    }
  }

  _dayPhase(date = new Date()) {
    const h = date.getHours();
    if (h >= 5 && h < 8) return 'dawn';
    if (h >= 8 && h < 17) return 'day';
    if (h >= 17 && h < 21) return 'evening';
    return 'night';
  }

  _weatherKind() {
    return this._kindFromCode(this.weatherData?.weatherCode);
  }

  _kindFromCode(code) {
    if (code == null || code === '') return 'loading';
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

  _neoFxHtml(kind, phase) {
    if (!this._isNeo()) return '';
    const low = this._isLowPower();
    const parts = ['<div class="weather-neo-fx" aria-hidden="true">'];
    if (kind === 'rain' || kind === 'showers') {
      const n = low ? 4 : 8;
      for (let i = 0; i < n; i++) {
        const left = 8 + i * (80 / Math.max(1, n - 1));
        const delay = (i * 0.14).toFixed(2);
        const dur = (0.85 + (i % 3) * 0.12).toFixed(2);
        parts.push(`<span class="weather-neo-streak" style="left:${left}%;animation-delay:${delay}s;animation-duration:${dur}s"></span>`);
      }
    } else if (kind === 'snow') {
      const n = low ? 5 : 12;
      for (let i = 0; i < n; i++) {
        const left = 6 + (i * 9) % 88;
        const top = (i * 11) % 55;
        const delay = (i * 0.35).toFixed(2);
        parts.push(`<span class="weather-neo-flake" style="left:${left}%;top:${top}%;animation-delay:${delay}s"></span>`);
      }
    } else if (kind === 'clear') {
      if (phase === 'night') {
        const n = low ? 6 : 14;
        for (let i = 0; i < n; i++) {
          const left = 8 + (i * 13) % 84;
          const top = 6 + (i * 19) % 60;
          parts.push(`<span class="weather-neo-star" style="left:${left}%;top:${top}%"></span>`);
        }
      } else if (phase === 'dawn' || phase === 'evening') {
        parts.push('<span class="weather-neo-glow weather-neo-glow--warm"></span>');
      } else {
        parts.push('<span class="weather-neo-glow weather-neo-glow--sun"></span>');
        if (!low) {
          parts.push('<span class="weather-neo-sunrays"></span>');
        }
      }
    } else if (kind === 'partly') {
      parts.push('<span class="weather-neo-glow weather-neo-glow--soft"></span>');
      if (phase === 'night' && !low) {
        for (let i = 0; i < 5; i++) {
          parts.push(`<span class="weather-neo-star" style="left:${15 + i * 16}%;top:${10 + (i % 3) * 18}%"></span>`);
        }
      }
    } else if (kind === 'storm' && !low) {
      parts.push('<span class="weather-neo-flash"></span>');
      const n = 4;
      for (let i = 0; i < n; i++) {
        parts.push(`<span class="weather-neo-streak" style="left:${20 + i * 18}%;animation-delay:${(i * 0.2).toFixed(2)}s"></span>`);
      }
    } else if (kind === 'fog') {
      parts.push('<span class="weather-neo-haze"></span>');
    }
    parts.push('</div>');
    return parts.join('');
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

  _toDisplayTemp(celsius) {
    if (this.settings.units === 'fahrenheit') {
      return Math.round(celsius * 9 / 5 + 32);
    }
    return Math.round(celsius);
  }

  _formatHourLabel(iso) {
    try {
      const d = new Date(iso);
      const h = d.getHours();
      if (this._locale === 'ru') {
        return `${h}:00`;
      }
      const am = h < 12;
      const h12 = h % 12 || 12;
      return `${h12}${am ? 'a' : 'p'}`;
    } catch {
      return '';
    }
  }

  _formatWeekday(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(this._locale === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short' });
    } catch {
      return '';
    }
  }

  _patchSearchResults(html) {
    if (this.context.ui.patchMainSheet) {
      const ok = this.context.ui.patchMainSheet('.cultiva-search-results', html);
      if (ok !== false) {
        return;
      }
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

  _translitRuToLat(input) {
    const map = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
      к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
      х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
    };
    return String(input || '').toLowerCase().split('').map((ch) => map[ch] ?? ch).join('');
  }

  async searchCity(query) {
    if (!query || query.length < 2) return [];

    await this._loadRussianCities();
    const q = query.toLowerCase().trim();
    const qLat = this._translitRuToLat(q);

    const localResults = this.russianCities
      .filter((c) => {
        const name = String(c.name || '').toLowerCase();
        return name.includes(q) || name.includes(qLat) || this._translitRuToLat(name).includes(qLat);
      })
      .map((c) => ({
        name: c.name,
        country: 'Russia',
        lat: c.lat,
        lon: c.lon
      }));

    let remote = [];
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=${this._geoLang()}&format=json`;
      const response = await fetch(url);
      const data = await response.json();
      remote = (data.results || []).map((r) => ({
        name: r.name,
        country: r.country,
        admin1: r.admin1,
        lat: r.latitude,
        lon: r.longitude
      }));
    } catch (e) {
      console.error('[Weather] Search failed:', e);
    }

    const seen = new Set();
    const merged = [];
    for (const row of [...localResults, ...remote]) {
      const key = `${String(row.name).toLowerCase()}|${row.lat}|${row.lon}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(row);
      if (merged.length >= 10) break;
    }
    return merged;
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

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
        + `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,cloud_cover`
        + `&hourly=temperature_2m,weather_code,precipitation_probability`
        + `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max`
        + `&forecast_days=7&timezone=auto`;
      const response = await fetch(url);
      const data = await response.json();

      const units = this.settings.units === 'fahrenheit' ? '°F' : '°C';
      const now = Date.now();
      const hourly = [];
      const times = data.hourly?.time || [];
      for (let i = 0; i < times.length && hourly.length < 24; i++) {
        const t = new Date(times[i]).getTime();
        if (t < now - 30 * 60 * 1000) continue;
        hourly.push({
          time: times[i],
          temp: this._toDisplayTemp(data.hourly.temperature_2m[i]),
          code: data.hourly.weather_code[i],
          precip: data.hourly.precipitation_probability?.[i]
        });
      }

      const daily = [];
      const dTimes = data.daily?.time || [];
      for (let i = 0; i < dTimes.length; i++) {
        daily.push({
          date: dTimes[i],
          code: data.daily.weather_code[i],
          max: this._toDisplayTemp(data.daily.temperature_2m_max[i]),
          min: this._toDisplayTemp(data.daily.temperature_2m_min[i]),
          precip: data.daily.precipitation_sum?.[i],
          uv: data.daily.uv_index_max?.[i]
        });
      }

      this.weatherData = {
        temp: this._toDisplayTemp(data.current.temperature_2m),
        feelsLike: this._toDisplayTemp(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        pressure: data.current.surface_pressure != null ? Math.round(data.current.surface_pressure) : null,
        cloudCover: data.current.cloud_cover != null ? Math.round(data.current.cloud_cover) : null,
        uvMax: daily[0]?.uv != null ? Math.round(daily[0].uv) : null,
        units,
        hourly,
        daily
      };

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

  _gardenClassList(kind, phase) {
    const neo = this._neoClassList();
    const phaseCls = this._isNeo() ? ` weather-phase--${phase}` : '';
    return `habit-card garden-plugin-card weather-garden-card weather-garden-card--${kind}${phaseCls}${neo}`;
  }

  _gardenInnerHtml() {
    const kind = this._weatherKind();
    const phase = this._dayPhase();
    const icon = this._weatherIconSvg(kind);
    const fx = this._neoFxHtml(kind, phase);
    const cls = this._gardenClassList(kind, phase);
    if (!this.weatherData) {
      return `<article class="${cls}" tabindex="0">
        ${fx}
        <div class="card-header">
          <div class="plant-visual weather-garden-icon">${icon}</div>
          <div class="card-info">
            <div class="card-title">--</div>
            <div class="card-subtitle">${this._escapeHtml(this._t('loading'))}</div>
          </div>
        </div>
      </article>`;
    }
    return `<article class="${cls}" tabindex="0">
        ${fx}
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

  _hourlyHtml() {
    if (!this.settings.showHourly || !this.weatherData?.hourly?.length) return '';
    const units = this.weatherData.units || '°C';
    const items = this.weatherData.hourly.slice(0, 24).map((h) => {
      const k = this._kindFromCode(h.code);
      const precip = h.precip != null ? `<div class="cultiva-muted">${h.precip}%</div>` : '';
      return `<div class="weather-hourly-item">
        <div>${this._escapeHtml(this._formatHourLabel(h.time))}</div>
        ${this._weatherIconSvg(k)}
        <strong>${h.temp}${units}</strong>
        ${precip}
      </div>`;
    }).join('');
    return `<div class="weather-section-label">${this._t('hourly')}</div><div class="weather-hourly">${items}</div>`;
  }

  _dailyHtml() {
    if (!this.settings.showDaily || !this.weatherData?.daily?.length) return '';
    const units = this.weatherData.units || '°C';
    const rows = this.weatherData.daily.map((d) => {
      const k = this._kindFromCode(d.code);
      return `<div class="weather-daily-row">
        <span>${this._escapeHtml(this._formatWeekday(d.date))}</span>
        ${this._weatherIconSvg(k)}
        <span class="cultiva-muted">${d.precip != null ? `${d.precip} mm` : ''}</span>
        <span class="weather-daily-temps">${d.min}° <strong>${d.max}°</strong></span>
      </div>`;
    }).join('');
    return `<div class="weather-section-label">${this._t('daily')}</div><div class="weather-daily">${rows}</div>`;
  }

  _toggleRow(act, checked, label) {
    return `<label class="weather-toggle-row">
      <span>${this._escapeHtml(label)}</span>
      <span class="weather-toggle toggle-switch">
        <input type="checkbox" data-cultiva-act="${act}" ${checked ? 'checked' : ''}/>
        <span class="weather-toggle-slider toggle-slider"></span>
      </span>
    </label>`;
  }

  _buildWeatherSheetHtml(searchResultsHtml) {
    const w = this.weatherData;
    const kind = this._weatherKind();
    const phase = this._dayPhase();
    const city = this._escapeHtml(this._cityLabel(this.settings.city));
    const mainTemp = w ? Math.round(w.temp) : '--';
    const units = w?.units || '°C';
    const desc = w ? this._escapeHtml(this.getWeatherDescription()) : this._escapeHtml(this._t('loading'));
    const feel = w ? Math.round(w.feelsLike) : '--';
    const hum = w ? w.humidity : '--';
    const wind = w ? w.windSpeed : '--';
    const pressure = w?.pressure != null ? w.pressure : '--';
    const clouds = w?.cloudCover != null ? `${w.cloudCover}%` : '--';
    const uv = w?.uvMax != null ? w.uvMax : '--';
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
    const fx = this._neoFxHtml(kind, phase);
    const neoCls = this._neoClassList();
    const phaseCls = this._isNeo() ? ` weather-phase--${phase}` : '';
    return `
<div class="cultiva-sheet-overlay" data-cultiva-act="close"></div>
<div class="cultiva-sheet-card cultiva-sheet-card--weather weather-sheet--${kind}${phaseCls}${neoCls}">
  ${fx}
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
    <p class="weather-hero-desc">${desc}</p>
    <div class="weather-metrics weather-metrics--6">
      <div><span class="cultiva-muted">${this._t('feels')}</span><strong>${feel}${units}</strong></div>
      <div><span class="cultiva-muted">${this._t('humidity')}</span><strong>${hum}%</strong></div>
      <div><span class="cultiva-muted">${this._t('wind')}</span><strong>${wind} ${this._windUnit()}</strong></div>
      <div><span class="cultiva-muted">${this._t('pressure')}</span><strong>${pressure} ${this._t('hpa')}</strong></div>
      <div><span class="cultiva-muted">${this._t('clouds')}</span><strong>${clouds}</strong></div>
      <div><span class="cultiva-muted">${this._t('uv')}</span><strong>${uv}</strong></div>
    </div>
    ${this._hourlyHtml()}
    ${this._dailyHtml()}
    <div class="weather-view-toggles">
      ${this._toggleRow('toggleHourly', this.settings.showHourly !== false, this._t('showHourly'))}
      ${this._toggleRow('toggleDaily', this.settings.showDaily !== false, this._t('showDaily'))}
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
    if (action === 'toggleHourly') {
      // Browser already toggled the checkbox; sync from that when possible
      if (payload && typeof payload.checked === 'boolean') {
        this.settings.showHourly = payload.checked;
      } else {
        this.settings.showHourly = !this.settings.showHourly;
      }
      await this.context.storage.set('settings', this.settings);
      this.context.ui.openMainSheet(this._buildWeatherSheetHtml(''));
      return;
    }
    if (action === 'toggleDaily') {
      if (payload && typeof payload.checked === 'boolean') {
        this.settings.showDaily = payload.checked;
      } else {
        this.settings.showDaily = !this.settings.showDaily;
      }
      await this.context.storage.set('settings', this.settings);
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
      this._patchSearchResults(`<div class="cultiva-muted cultiva-pad">${this._escapeHtml(this._t('loading'))}</div>`);
      this._sheetSearchT = setTimeout(async () => {
        try {
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
        } catch (e) {
          console.error('[Weather] Search UI failed:', e);
          this._patchSearchResults(`<div class="cultiva-muted cultiva-pad">${this._escapeHtml(this._t('noCities'))}</div>`);
        }
      }, 280);
    }
  }

  checkExtremeWeather() {
    if (!this.weatherData) return;
    const temp = this.weatherData.temp;
    const weatherCode = this.weatherData.weatherCode;
    const isF = this.weatherData.units === '°F' || this.settings.units === 'fahrenheit';
    const hot = isF ? temp > 86 : temp > 30;
    const cold = isF ? temp < 32 : temp < 0;
    if (hot) this.context.ui.showNotification('', this._t('hot'));
    if (cold) this.context.ui.showNotification('', this._t('cold'));
    if (weatherCode >= 95) this.context.ui.showNotification('', this._t('storm'));
  }
}

return new WeatherPlugin(context, hooks);
