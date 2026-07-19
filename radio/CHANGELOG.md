# Changelog

All notable changes to the **Radio Widget** plugin are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [2.6.0] — 2026-07-19

### Added
- **33 curated stations** — +9: Nightride FM, Chill Synth, Dark Synth (synthwave), Record Eurodance (retro rave), Наше Радио & Europa Plus (RU), Digitalis, Suburbs of Goa, SF 10-33
- **ICY now-playing** — real `Artist – Track` from stream metadata (polled; SomaFM / Nightride / RU ice verified)
- **Live Radio Neo** — `AudioContext` + `AnalyserNode` frequency bars tied to the real signal; silent/CORS fail → decorative genre Neo fallback
- Sleep timer **mm:ss countdown** + thin progress ring on the active pill
- **Volume crossfade** (~240–280 ms) on stop/start to soften station switches

### Changed
- Removed **Stop** and **Neo on/off** from the player sheet — pause via transport; Neo only in plugin settings
- `minAppVersion` → **1.7.0** (tray APIs remain best-effort on older PE2 hosts)

---

## [2.5.1] — 2026-07-19

### Fixed
- Store install integrity: LF line endings so registry sha256 matches GitHub raw

---

## [2.5.0] — 2026-07-19

### Fixed
- Custom stream paste: extract multiple URLs, resolve `.m3u` / `.pls` playlists to direct ice mirrors, reject bare HTML page links with a clearer error
- Custom field is plain text (not `type=url`) so paste of playlist links is not blocked by browser validation

### Added
- **Stream history** — last 8 custom URLs as one-tap chips
- Station filter in the player sheet
- Ten SomaFM stations: Synphaera, The Trip, Left Coast 70s, Boot Liquor, Illinois Street Lounge, Metal Detector, Sonic Universe, Vaporwaves, cliqhop idm, Mission Control
- Tray now-playing: tooltip + menu row for the current station (PE2 per-plugin tray merge)

### Changed
- `minAppVersion` → **2.3.2** (tray APIs)

---

## [2.4.0] — 2026-07-18

### Fixed
- Dual-stream race: stop/pause previous `Audio` and cancel in-flight `play()` before creating a new one; single `this.audio` owner; generation token ignores late success/fail from superseded attempts
- Station switch awaits stop, then play; header and sheet active state update synchronously (optimistic UI)

### Added
- Player-style sheet: large title, genre tag, play/pause, prev/next, volume, sleep timer, now-playing strip
- Stations: Groove Salad Classic, Underground 80s, Indie Pop Rocks, Deep Space One (multi-mirror SomaFM)
- Optional **Radio Neo** (`visualFx`, default off): genre gradients + pulse while playing; respects `prefers-reduced-motion`
- Full RU/EN UI strings and play/stop/error notifications

### Changed
- `minAppVersion` → **1.7.0**

---

## [2.3.0] — 2026-07-18

### Added
- Media Session metadata and play/pause/stop handlers while streaming
- Distinct autoplay-blocked vs stream-unavailable messages (EN/RU)
- Custom stream URL (`customUrl`) with sheet input and `custom` station

---

## [2.2.0] — 2026-07-12

### Added
- Manifest settings for default station, volume, and sleep timer
- Stream error indicator in the header

---

## [2.1.1] — 2026-07-12

### Added
- `onSettingsChange` for locale/theme refresh without disable/re-enable

---

## [2.1.0] — 2026-07-08

### Fixed
- Stream URL fallbacks for SomaFM stations

### Added
- Paradise and Chillhop station options

---

## [2.0.1] — 2026-07-08

### Changed
- Minor polish and registry sync

---

## [2.0.0] — 2026-07-07

### Added
- Header radio widget with SomaFM stations and sleep timer
