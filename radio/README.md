# Radio Widget

Internet radio in the Cultiva header — SomaFM favorites, Radio Paradise, Chillhop, or your own stream URL. Sleep timer, volume, and lock-screen Media Session controls.

**Version:** 2.3.0 (see [CHANGELOG.md](./CHANGELOG.md))  
**minAppVersion:** `1.1.0`  
**Author:** krwg

---

## English

### Why Radio

Focus sessions need a soundtrack that stays out of the way. **Radio** puts curated chill and ambient streams one tap from the header — no browser tab, no extra app. Pick a station, set a sleep timer, and keep gardening.

### What you get

| Surface | What you get |
|---------|----------------|
| **Header** | Live station name while playing; tap opens the control sheet |
| **Sheet** | Station list, volume, sleep timer, custom URL |
| **Media Session** | Lock screen / OS media keys: play, pause, stop |
| **Custom stream** | Paste any direct audio URL and play it as your station |

### Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `station` | select | `groovesalad` | Default / last station (includes `custom` when a URL is set) |
| `customUrl` | text | _(empty)_ | Direct stream URL for the custom station |
| `volume` | select | `0.45` | Playback level |
| `sleepMinutes` | select | `0` | Auto-stop after 15 / 30 / 60 minutes |

### Permissions

- `network` — stream audio
- `storage` — remember station, volume, timer, and custom URL
- `ui` — header and sheet

### Requirements

Cultiva **1.1.0** or newer. Requires network access for streams.

---

## Русский

### Зачем Радио

Для фокуса нужен саундтрек, который не мешает. **Радио** держит спокойные и эмбиент-потоки в один тап из шапки — без вкладки браузера и лишних приложений. Выберите станцию, поставьте таймер сна и продолжайте растить привычки.

### Что вы получаете

| Поверхность | Что даёт |
|-------------|----------|
| **Шапка** | Имя станции во время эфира; нажатие открывает панель |
| **Панель** | Список станций, громкость, таймер сна, свой URL |
| **Media Session** | Экран блокировки и системные кнопки: play, pause, stop |
| **Свой поток** | Вставьте прямой URL аудио и слушайте как свою станцию |

### Настройки

| Ключ | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `station` | select | `groovesalad` | Станция по умолчанию / последняя (включая `custom`) |
| `customUrl` | text | _(пусто)_ | Прямой URL своего потока |
| `volume` | select | `0.45` | Громкость |
| `sleepMinutes` | select | `0` | Автостоп через 15 / 30 / 60 минут |

### Разрешения

- `network` — потоковое аудио
- `storage` — станция, громкость, таймер и свой URL
- `ui` — шапка и панель

### Требования

Cultiva **1.1.0** или новее. Нужен интернет для потоков.
