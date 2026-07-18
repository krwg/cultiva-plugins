const LOCAL_FALLBACK = {
  en: [{ text: 'Every day is another chance to grow.', author: 'Unknown' }],
  ru: [{ text: 'Каждый день — новый шанс расти.', author: 'Неизвестный автор' }]
};

const CYRILLIC = /[\u0400-\u04FF]/;
const MIXED_EN = /\b(today|your|the|and|to|for|with|build|create|habits?)\b/i;
const MAX_FAVORITES = 50;

function dayHash(seed = '') {
  const d = new Date();
  const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${seed}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h;
}

function quoteKey(q) {
  return `${q.text}::${q.author}`;
}

class QuotePlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.midnightTimer = null;
    this.currentQuote = null;
    this._locale = 'en';
    this._quotes = { en: LOCAL_FALLBACK.en, ru: LOCAL_FALLBACK.ru };
    this._favorites = [];
  }

  _t(key) {
    const en = {
      favorited: 'Added to favorites',
      unfavorited: 'Removed from favorites',
      favoritesFull: 'Favorites limit reached (50)',
      anotherQuote: 'Next quote',
      shuffled: 'Showing another quote',
      addFavorite: 'Add to favorites',
      removeFavorite: 'Remove from favorites'
    };
    const ru = {
      favorited: 'Добавлено в избранное',
      unfavorited: 'Удалено из избранного',
      favoritesFull: 'Лимит избранного (50)',
      anotherQuote: 'Следующая цитата',
      shuffled: 'Показана другая цитата',
      addFavorite: 'В избранное',
      removeFavorite: 'Убрать из избранного'
    };
    const dict = this._locale === 'ru' ? ru : en;
    return dict[key] || en[key] || key;
  }

  _escapeHtml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  _quoteIconSvg() {
    return '<svg class="quote-icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.6 6.3c-2.3 1.7-3.8 4.5-3.8 7.7 0 2.8 2.1 5 4.8 5s4.8-2.2 4.8-5-2.1-5-4.8-5c-.4 0-.8 0-1.1.1.6-1 1.4-1.9 2.4-2.6l-2.3-.2Zm10.7 0c-2.3 1.7-3.8 4.5-3.8 7.7 0 2.8 2.1 5 4.8 5s4.8-2.2 4.8-5-2.1-5-4.8-5c-.4 0-.8 0-1.1.1.6-1 1.4-1.9 2.4-2.6l-2.3-.2Z"/></svg>';
  }

  _heartSvg(filled) {
    const fill = filled ? 'currentColor' : 'none';
    const stroke = 'currentColor';
    return `<svg class="quote-heart-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="${fill}" stroke="${stroke}" stroke-width="1.8" d="M12 20.5s-7.2-4.6-9.5-8.8C.8 8.2 2.6 5 5.8 4.4c1.8-.3 3.5.4 4.6 1.8 1.1-1.4 2.8-2.1 4.6-1.8 3.2.6 5 3.8 3.3 7.3-2.3 4.2-9.5 8.8-9.5 8.8z"/></svg>`;
  }

  _shuffleSvg() {
    return '<svg class="quote-shuffle-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>';
  }

  async _loadLocale() {
    if (this.context.app && typeof this.context.app.getLocale === 'function') {
      try {
        this._locale = await this.context.app.getLocale();
      } catch {
        this._locale = 'en';
      }
    }
    if (this._locale !== 'ru') {
      this._locale = 'en';
    }
  }

  _filterBank(list, locale) {
    if (!Array.isArray(list)) {
      return [];
    }
    return list.filter((q) => {
      if (!q?.text || q.author === 'Cultiva') {
        return false;
      }
      const hasCyr = CYRILLIC.test(q.text);
      if (locale === 'ru') {
        return hasCyr && !MIXED_EN.test(q.text);
      }
      return !hasCyr;
    });
  }

  async _loadQuotes() {
    try {
      if (this.context.data && typeof this.context.data.read === 'function') {
        const data = await this.context.data.read('quotes-data.json');
        if (data && Array.isArray(data.en) && Array.isArray(data.ru)) {
          this._quotes = {
            en: this._filterBank(data.en, 'en'),
            ru: this._filterBank(data.ru, 'ru')
          };
        }
      }
    } catch {
      void 0;
    }
  }

  async _loadFavorites() {
    const raw = await this.context.storage.get('favorites');
    this._favorites = Array.isArray(raw) ? raw.slice(0, MAX_FAVORITES) : [];
  }

  async _saveFavorites() {
    await this.context.storage.set('favorites', this._favorites);
  }

  _bank() {
    const bank = this._quotes[this._locale];
    if (bank && bank.length) {
      return bank;
    }
    return LOCAL_FALLBACK[this._locale] || LOCAL_FALLBACK.en;
  }

  _pickQuote() {
    const bank = this._bank();
    if (!bank.length) {
      return LOCAL_FALLBACK[this._locale]?.[0] || LOCAL_FALLBACK.en[0];
    }
    return bank[dayHash(this._locale) % bank.length];
  }

  _activeQuote() {
    return this.currentQuote || this._pickQuote();
  }

  _isFavorite(q) {
    const k = quoteKey(q);
    return this._favorites.some((f) => quoteKey(f) === k);
  }

  _html() {
    const q = this._activeQuote();
    const fav = this._isFavorite(q);
    const heartLabel = fav ? this._t('removeFavorite') : this._t('addFavorite');
    const shuffleLabel = this._t('anotherQuote');
    return `<article class="habit-card garden-plugin-card garden-plugin-card--quote" data-category="mindfulness">
      <div class="card-header quote-card-header">
        <div class="plant-visual quote-icon">${this._quoteIconSvg()}</div>
        <div class="card-info quote-card-info">
          <div class="card-title quote-card-text">"${this._escapeHtml(q.text)}"</div>
          <div class="card-subtitle quote-card-author">— ${this._escapeHtml(q.author)}</div>
        </div>
        <div class="quote-card-actions">
          <button type="button" class="quote-shuffle-btn" data-plugin-act="shuffleAnother" aria-label="${this._escapeHtml(shuffleLabel)}" title="${this._escapeHtml(shuffleLabel)}">${this._shuffleSvg()}</button>
          <button type="button" class="quote-favorite-btn${fav ? ' quote-favorite-btn--active' : ''}" data-plugin-act="toggleFavorite" aria-label="${this._escapeHtml(heartLabel)}" title="${this._escapeHtml(heartLabel)}">${this._heartSvg(fav)}</button>
        </div>
      </div>
    </article>`;
  }

  _refreshGarden() {
    this.context.ui.updateGardenHtml(this._html());
  }

  async toggleFavorite() {
    const q = this._activeQuote();
    const k = quoteKey(q);
    const idx = this._favorites.findIndex((f) => quoteKey(f) === k);
    if (idx >= 0) {
      this._favorites.splice(idx, 1);
      this.context.ui.showNotification('', this._t('unfavorited'));
    } else {
      if (this._favorites.length >= MAX_FAVORITES) {
        this.context.ui.showNotification('', this._t('favoritesFull'));
        return;
      }
      this._favorites.unshift({ text: q.text, author: q.author, savedAt: new Date().toISOString() });
      this.context.ui.showNotification('', this._t('favorited'));
    }
    await this._saveFavorites();
    this._refreshGarden();
  }

  shuffleAnother() {
    const bank = this._bank();
    const current = this._activeQuote();
    const currentKey = quoteKey(current);
    const others = bank.filter((q) => quoteKey(q) !== currentKey);
    if (!others.length) {
      return;
    }
    this.currentQuote = others[Math.floor(Math.random() * others.length)];
    this.context.ui.showNotification('', this._t('shuffled'));
    this._refreshGarden();
  }

  async onEnable() {
    await this._loadLocale();
    await this._loadQuotes();
    await this._loadFavorites();
    this.currentQuote = this._pickQuote();
    this.context.ui.registerGardenWidget({
      position: 'top',
      render: (el) => {
        el.innerHTML = this._html();
      }
    });
    this._scheduleMidnightRefresh();
    this.hooks.on('onSettingsChange', () => {
      void this._handleSettingsChange();
    });
  }

  async _handleSettingsChange() {
    const prevLocale = this._locale;
    await this._loadLocale();
    await this._loadFavorites();
    if (prevLocale !== this._locale) {
      this.currentQuote = this._pickQuote();
    }
    this._refreshGarden();
  }

  _scheduleMidnightRefresh() {
    if (this.midnightTimer) {
      clearTimeout(this.midnightTimer);
      this.midnightTimer = null;
    }
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 3);
    const delay = Math.max(1000, next.getTime() - now.getTime());
    this.midnightTimer = setTimeout(async () => {
      this.currentQuote = this._pickQuote();
      this._refreshGarden();
      this._scheduleMidnightRefresh();
    }, delay);
  }

  onDisable() {
    if (this.midnightTimer) {
      clearTimeout(this.midnightTimer);
      this.midnightTimer = null;
    }
  }
}

return new QuotePlugin(context, hooks);
