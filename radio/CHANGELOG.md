# Changelog

All notable changes to the **Radio Widget** plugin are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [2.5.1] — 2026-07-19

### Fixed
- Store install integrity: registry SHA-256 now matches GitHub raw (LF) bytes — Integrity check failed for index.js on Windows CRLF hashes

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

## [2.0.0] — 2026-05-12

### Added
- SomaFM stations, volume control, and sleep timer
- Sandbox sheet UI via main-window bridge

### Changed
- Major rewrite for Cultiva **0.4.0+** plugin host

---

## [1.0.1] — 2026-05-12

### Changed
- Description notes Cultiva **0.4.0+**

---

## [1.0.0] — 2026-04-15

### Added
- Radio Widget streaming plugin
