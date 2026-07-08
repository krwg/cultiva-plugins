const LOCAL_FALLBACK = {
  en: [{ text: 'Every day is another chance to grow.', author: 'Unknown' }],
  ru: [{ text: 'Каждый день — новый шанс расти.', author: 'Неизвестный автор' }]
};

function dayHash(seed = '') {
  const d = new Date();
  const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${seed}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h;
}

class QuotePlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.midnightTimer = null;
    this.currentQuote = null;
    this._locale = 'en';
    this._quotes = { en: LOCAL_FALLBACK.en, ru: LOCAL_FALLBACK.ru };
  }

  _escapeHtml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  _quoteIconSvg() {
    return '<svg class="quote-icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.6 6.3c-2.3 1.7-3.8 4.5-3.8 7.7 0 2.8 2.1 5 4.8 5s4.8-2.2 4.8-5-2.1-5-4.8-5c-.4 0-.8 0-1.1.1.6-1 1.4-1.9 2.4-2.6l-2.3-.2Zm10.7 0c-2.3 1.7-3.8 4.5-3.8 7.7 0 2.8 2.1 5 4.8 5s4.8-2.2 4.8-5-2.1-5-4.8-5c-.4 0-.8 0-1.1.1.6-1 1.4-1.9 2.4-2.6l-2.3-.2Z"/></svg>';
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

  async _loadQuotes() {
    try {
      if (this.context.data && typeof this.context.data.read === 'function') {
        const data = await this.context.data.read('quotes-data.json');
        if (data && Array.isArray(data.en) && Array.isArray(data.ru)) {
          this._quotes = data;
          return;
        }
      }
    } catch {
      // Keep fallback bank.
    }
  }

  _bank() {
    return this._quotes[this._locale] || this._quotes.en || LOCAL_FALLBACK.en;
  }

  _pickQuote() {
    const bank = this._bank();
    if (!bank.length) {
      return LOCAL_FALLBACK[this._locale]?.[0] || LOCAL_FALLBACK.en[0];
    }
    return bank[dayHash(this._locale) % bank.length];
  }

  _html() {
    const q = this.currentQuote || this._pickQuote();
    return `<article class="habit-card garden-plugin-card garden-plugin-card--quote" data-category="mindfulness">
      <div class="card-header">
        <div class="plant-visual quote-icon">${this._quoteIconSvg()}</div>
        <div class="card-info">
          <div class="card-title">"${this._escapeHtml(q.text)}"</div>
          <div class="card-subtitle">— ${this._escapeHtml(q.author)}</div>
        </div>
      </div>
      <div class="card-actions quote-card-actions" aria-hidden="true">
        <span class="quote-card-spacer"></span>
      </div>
    </article>`;
  }

  async onEnable() {
    await this._loadLocale();
    await this._loadQuotes();
    this.currentQuote = this._pickQuote();
    this.context.ui.registerGardenWidget({
      position: 'top',
      render: (el) => {
        el.innerHTML = this._html();
      }
    });
    this._scheduleMidnightRefresh();
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
      this.context.ui.updateGardenHtml(this._html());
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
