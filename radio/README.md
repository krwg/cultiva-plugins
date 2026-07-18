# Radio Widget

Internet radio in the Cultiva header — a real mini-player for SomaFM favorites, Radio Paradise, Chillhop, or your own stream URL (including `.m3u` / `.pls`). Sleep timer, volume, Media Session, stream history, tray now-playing, and optional Radio Neo visuals.

**Version:** 2.5.1 (see [CHANGELOG.md](./CHANGELOG.md))  
**minAppVersion:** `2.3.2`  
**Author:** krwg

---

## English

### Why Radio

Focus sessions need a soundtrack that stays out of the way. **Radio** puts curated chill, ambient, and indie streams one tap from the header — no browser tab, no extra app. Pick a station, set a sleep timer, and keep gardening.

### What you get

| Surface | What you get |
|---------|----------------|
| **Header** | Live station name while playing; tap opens the player sheet |
| **Sheet** | Now-playing strip, play/pause, prev/next, volume, sleep timer, station list, custom URL |
| **Media Session** | Lock screen / OS media keys: play, pause, stop, prev/next |
| **Custom stream** | Paste a direct audio URL, `.m3u` / `.pls`, or several URLs — resolved automatically; recent streams stay as chips |
| **Tray** | Current station in the system tray tooltip and menu while playing |
| **Radio Neo** | Opt-in genre gradients and a subtle pulse while playing |

### Stations

Groove Salad, Groove Salad Classic, Fluid, Beat Blender, Drone Zone, Lush, Space Station, Secret Agent, Underground 80s, Indie Pop Rocks, Deep Space One, Radio Paradise, Chillhop Radio, DEF CON Radio, Synphaera, The Trip, Left Coast 70s, Boot Liquor, Illinois Street Lounge, Metal Detector, Sonic Universe, Vaporwaves, cliqhop idm, Mission Control — plus custom URL.

### Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `station` | select | `groovesalad` | Default / last station (includes `custom` when a URL is set) |
| `customUrl` | text | _(empty)_ | Direct stream URL for the custom station |
| `volume` | select | `0.45` | Playback level |
| `sleepMinutes` | select | `0` | Auto-stop after 15 / 30 / 60 minutes |
| `visualFx` | boolean | `false` | Radio Neo visuals (opt-in) |

### Permissions

- `network` — stream audio
- `storage` — remember station, volume, timer, custom URL, and Neo preference
- `ui` — header and sheet

### Requirements

Cultiva **2.3.2** or newer. Requires network access for streams.

---

## Русский

### Зачем Радио

Для фокуса нужен саундтрек, который не мешает. **Радио** держит спокойные, эмбиент и инди-потоки в один тап из шапки — без вкладки браузера и лишних приложений. Выберите станцию, поставьте таймер сна и продолжайте растить привычки.

### Что вы получаете

| Поверхность | Что даёт |
|-------------|----------|
| **Шапка** | Имя станции во время эфира; нажатие открывает плеер |
| **Панель** | Сейчас играет, play/pause, prev/next, громкость, таймер сна, список станций, свой URL |
| **Media Session** | Экран блокировки и системные кнопки: play, pause, stop, prev/next |
| **Свой поток** | Прямой URL, `.m3u` / `.pls` или несколько ссылок; история последних потоков |
| **Трей** | Текущая станция в tooltip и меню, пока играет |
| **Радио Нео** | Опциональные градиенты жанра и пульс во время эфира |

| **Радио Нео** | Опциональные градиенты по жанру и лёгкий пульс во время эфира |

### Станции

Groove Salad, Groove Salad Classic, Fluid, Beat Blender, Drone Zone, Lush, Space Station, Secret Agent, Underground 80s, Indie Pop Rocks, Deep Space One, Radio Paradise, Chillhop Radio, DEF CON Radio — плюс свой URL.

### Настройки

| Ключ | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `station` | select | `groovesalad` | Станция по умолчанию / последняя (включая `custom`) |
| `customUrl` | text | _(пусто)_ | Прямой URL своего потока |
| `volume` | select | `0.45` | Громкость |
| `sleepMinutes` | select | `0` | Автостоп через 15 / 30 / 60 минут |
| `visualFx` | boolean | `false` | Визуалы Радио Нео (по желанию) |

### Разрешения

- `network` — потоковое аудио
- `storage` — станция, громкость, таймер, свой URL и настройка Нео
- `ui` — шапка и панель

### Требования

Cultiva **2.3.2** или новее. Нужен интернет для потоков.
