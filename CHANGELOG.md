# Changelog

All notable changes to the **Cultiva Plugins registry** are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/). Registry version is the top-level `version` field in `registry.json`.

---

## [3.2.0] — 2026-07-12

### Added
- **Weekly Stats** — garden 7-bar chart + `app.getWeeklySummary()` rate (Cultiva 2.0)
- **Habit Reflection** — micro-journal sheet on `onHabitComplete`
- **Morning & Evening Routine** — garden checklist by habit name
- **Gentle Nudge** — daily reminder for open habits after configurable hour
- **Focus Session** — header pomodoro with `app.completeHabit()` on work end

---

## [3.0.7] — 2026-07-12

### Changed
- Radio 2.2.0: manifest settings for default station, volume, and sleep timer; stream error in header
- Time 2.2.2: sheet is timezone-only; format/color live in plugin Settings modal

---

## [3.0.6] — 2026-07-12

### Changed
- Quote 1.3.1: leaner garden card (heart only, no hint row); removed legacy quote generator script

---

## [3.0.5] — 2026-07-12

### Changed
- Quote 1.3.0: 1000 EN + 1000 RU quotes from open sources; locale-pure banks (no mixed EN/RU)
- Quote: heart button to save favorites; browse favorites in plugin settings
- Quote: full quote text visible in garden widget (no ellipsis clipping)

---

## [3.0.4] — 2026-07-12

### Changed
- Weather manifest settings labels default to English (City, Units, Show in garden)

### Fixed
- Weather: removed ~180 lines of unused `.weather-modal-*` and legacy `.weather-widget` CSS

---

## [3.0.3] — 2026-07-12

### Changed
- All six plugins adopt `onSettingsChange` for locale/theme refresh without disable/re-enable
- Pomodoro: letter placeholder instead of emoji in sheet UI
- Streak Celebrator: EN/RU notification strings

### Fixed
- Quote: removed unused `storage` permission; locale refresh on settings change
- Weather: extreme-weather alerts on habit complete; cities-ru.json via bundled data only (no GitHub raw fallback)

---

## [3.0.2] — 2026-07-09

### Changed
- README catalog table synced with manifest versions
- GitHub Pages landing redesigned (Apple green style, hash routing preserved)

### Fixed
- Registry manifest version drift vs `manifest.json` (weather 2.3.0, time 2.2.0, etc.) — hashes recomputed via `compute-registry-sha256.mjs`

---

## [3.0.1] — 2026-07-08

### Changed
- Plugin version bumps across catalog (weather 2.3.0, time 2.2.0, radio 2.1.0, pomodoro 1.2.0, quote 1.2.0)
- Letter placeholders in Cultiva catalog UI (no emoji in manifests)
- `cultiva-sheet-base.css` sha256 alignment for shared sheet styles

### Fixed
- Weather `onEnable` no longer blocks install on network timeout
- Registry `baseUrl` canonical path `krwg/cultiva-plugins`

---

## [3.0.0] — 2026-07-08

### Added
- **Pomodoro Timer** plugin (header focus timer)
- **Quote of the Day** plugin (garden widget, 500 EN/RU quotes)
- **Streak Celebrator** plugin (`onHabitComplete` notifications)
- sha256 integrity map for every installable file per plugin
- `scripts/compute-registry-sha256.mjs` for maintainers
- Bundled `weather/cities-ru.json` (~1100+ cities) with `context.data.read` support
- GitHub Pages docs site (`docs/index.html`)
- GitHub Wiki — catalog, registry spec, publishing guide

### Changed
- Registry schema bumped to **3.0.0**
- All plugins require Cultiva **minAppVersion 1.7.0**
- Weather 2.1.0 — hybrid RU offline search + Open-Meteo worldwide
- Time 2.0.0 — timezone sheet, accent colors
- Radio 2.0.0 — SomaFM streams, sleep timer

---

## [2.0.0] — 2026-06

### Added
- **Time Widget** plugin
- **Radio Widget** plugin
- Registry JSON manifest with `baseUrl` per plugin

### Changed
- **Weather Widget** major update — sheet UI, garden widget, settings

---

## [1.0.0] — 2026-05

### Added
- Initial **Weather Widget** plugin
- First `registry.json` with single-plugin catalog
- MIT license

---

[3.0.2]: https://github.com/krwg/cultiva-plugins/compare/3.0.1...main
[3.0.1]: https://github.com/krwg/cultiva-plugins/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/krwg/cultiva-plugins/compare/registry-2.0.0...3.0.0
[2.0.0]: https://github.com/krwg/cultiva-plugins/releases
[1.0.0]: https://github.com/krwg/cultiva-plugins/releases
