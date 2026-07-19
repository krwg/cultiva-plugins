# Radio Widget

Internet radio in the Cultiva header — a mini-player for **33** curated stations (SomaFM, Nightride synthwave, Record Eurodance / retro rave, Наше Радио & Europa Plus, plus more), or your own stream URL (including `.m3u` / `.pls`). ICY now-playing, live analyser Neo, sleep countdown, volume crossfade, Media Session, stream history, and tray.

**Version:** 2.6.1 (see [CHANGELOG.md](./CHANGELOG.md))  
**minAppVersion:** `1.7.0`  
**Author:** krwg

> **Support note:** Cultiva **1.7** still works with this plugin, but **1.7 will soon stop being supported**. Prefer **Cultiva 2.0+** (Rowan) for current PE2 tray/merge APIs and the best Radio experience.

---

## English

### Why Radio

Focus sessions need a soundtrack that stays out of the way. **Radio** puts chill, synthwave, retro rave, and Russian live streams one tap from the header — no browser tab, no extra app.

### What you get

| Surface | What you get |
|---------|----------------|
| **Header** | Live station or ICY track title while playing; tap opens the player sheet |
| **Sheet** | Now-playing (ICY when available), play/pause, prev/next, volume, sleep countdown ring, station list, custom URL |
| **Media Session** | Lock screen / OS media keys with real track metadata when ICY is present |
| **Custom stream** | Direct audio URL, `.m3u` / `.pls`, or several URLs — resolved automatically; recent streams as chips |
| **Tray** | Current track/station in the system tray (Cultiva 2.3.2+ PE2; graceful no-op on older hosts) |
| **Radio Neo** | Opt-in in **plugin settings** only: live frequency bars from the real audio signal; decorative genre fallback if CORS/analyser is silent |

### Stations (33)

Groove Salad, Groove Salad Classic, Fluid, Beat Blender, Drone Zone, Lush, Space Station, Secret Agent, Underground 80s, Indie Pop Rocks, Deep Space One, Radio Paradise, Chillhop Radio, DEF CON Radio, Synphaera, The Trip, Left Coast 70s, Boot Liquor, Illinois Street Lounge, Metal Detector, Sonic Universe, Vaporwaves, cliqhop idm, Mission Control, **Nightride FM**, **Chill Synth**, **Dark Synth**, **Record Eurodance**, **Наше Радио**, **Europa Plus**, Digitalis, Suburbs of Goa, SF 10-33 — plus custom URL.

### Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `station` | select | `groovesalad` | Default / last station (includes `custom` when a URL is set) |
| `customUrl` | text | _(empty)_ | Direct stream URL for the custom station |
| `volume` | select | `0.45` | Playback level |
| `sleepMinutes` | select | `0` | Auto-stop after 15 / 30 / 60 minutes |
| `visualFx` | boolean | `false` | Radio Neo live analyser (settings only) |

### Permissions

- `network` — stream audio + ICY metadata poll
- `storage` — remember station, volume, timer, custom URL, and Neo preference
- `ui` — header and sheet

### Requirements

Cultiva **1.7.0** or newer (**2.0+ recommended**; 1.7 support ending soon). Requires network access for streams.

---

## Русский

### Зачем Радио

Для фокуса нужен саундтрек, который не мешает. **Радио** держит chill, синтвейв, ретрорейв и русские эфиры в один тап из шапки — без вкладки браузера.

### Что вы получаете

| Поверхность | Что даёт |
|-------------|----------|
| **Шапка** | Станция или ICY-трек во время эфира; нажатие открывает плеер |
| **Панель** | Сейчас играет (ICY), play/pause, prev/next, громкость, таймер сна с отсчётом, список станций, свой URL |
| **Media Session** | Экран блокировки и системные кнопки с реальным названием трека |
| **Свой поток** | Прямой URL, `.m3u` / `.pls` или несколько ссылок; история последних потоков |
| **Трей** | Текущий трек/станция (Cultiva 2.3.2+; на старых хостах тихо отключается) |
| **Радио Нео** | Только в **настройках плагина**: живые полосы уровня по реальному сигналу; декоративный fallback при CORS |

### Станции (33)

Те же 33 кураторские станции, включая Nightride / Chill Synth / Dark Synth, Record Eurodance, Наше Радио, Europa Plus — плюс свой URL.

### Настройки

| Ключ | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `station` | select | `groovesalad` | Станция по умолчанию / последняя |
| `customUrl` | text | _(пусто)_ | URL своего потока |
| `volume` | select | `0.45` | Громкость |
| `sleepMinutes` | select | `0` | Автостоп через 15 / 30 / 60 минут |
| `visualFx` | boolean | `false` | Радио Нео — живой анализатор (только настройки) |

### Разрешения

- `network` — потоковое аудио и опрос ICY
- `storage` — станция, громкость, таймер, свой URL и Нео
- `ui` — шапка и панель

### Требования

Cultiva **1.7.0** или новее (**2.0+ рекомендуется**; поддержка 1.7 скоро закончится). Нужен интернет для потоков.
