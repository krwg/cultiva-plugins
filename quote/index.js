const QUOTES = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Small daily improvements are the key to long-term results.', author: 'Unknown' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle' },
  { text: 'A journey of a thousand miles begins with a single step.', author: 'Laozi' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
  { text: 'Motivation is what gets you started. Habit is what keeps you going.', author: 'Jim Ryun' },
  { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear' },
  { text: 'Well begun is half done.', author: 'Aristotle' },
  { text: 'The best time to plant a tree was twenty years ago. The second best time is now.', author: 'Chinese proverb' },
  { text: 'Consistency is more important than perfection.', author: 'Unknown' },
  { text: 'Every day is another chance to grow.', author: 'Unknown' }
];

function dayIndex() {
  const d = new Date();
  const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h % QUOTES.length;
}

class QuotePlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
  }

  _escapeHtml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  _html() {
    const q = QUOTES[dayIndex()];
    return `<div class="quote-widget"><div class="quote-text">“${this._escapeHtml(q.text)}”</div><div class="quote-author">— ${this._escapeHtml(q.author)}</div></div>`;
  }

  async onEnable() {
    this.context.ui.registerGardenWidget({
      position: 'top',
      render: (el) => {
        el.innerHTML = this._html();
      }
    });
  }

  onDisable() {}
}

return new QuotePlugin(context, hooks);
