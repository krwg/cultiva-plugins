# Changelog

All notable changes to the **Weather Widget** plugin are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versions from `weather/manifest.json` git history. No `1.1`–`1.4` releases exist; history jumps `1.0.0` → `1.5.0`.

---

## [Unreleased]

## [2.6.0] — 2026-07-18

### Added
- `showNotification` for city change, weather fetch errors, and Weather Neo on/off (EN/RU)
- Sheet close button `aria-label` via `_t()` (EN/RU)

### Changed
- Full EN/RU `_t()` coverage for sheet strings; EN fallback in `_t`
- Manifest setting **i18n** blocks for both EN and RU

---

## [2.5.1] — 2026-07-18

### Fixed
- City search for Cyrillic queries (e.g. «Майкоп» → Maykop) via transliteration + always merging Open-Meteo geocoding
- Search shows a loading state; more reliable results patching

### Changed
- `_weatherKind()` now delegates to `_kindFromCode()` (single source of truth for WMO codes)
- Honor `prefers-reduced-motion: reduce` (hide Neo particle layer)

---

## [2.5.0] — 2026-07-18

### Added
- Setting **`neoBypassThemes`** — Neo palette wins over Cultiva theme card backgrounds (`!important` bypass)
- Sheet metrics: **pressure**, **cloud cover**, **UV index** (today’s max)
- Clear-day **sun rays** animation; richer precip / storm particle layers

### Changed
- Neo colors much brighter (Apple Weather–like saturation) with stronger dawn / day / evening / night variants
- Hourly strip: fixed flex-shrink / min-height so hours are fully readable
- Forecast toggles use **Cultiva-style switches** instead of native checkboxes
- Garden weather card keeps habit-card height (`min-height: 184px`, no stretch)

### Fixed
- Hourly forecast row collapsed to a thin unreadable band in the sheet

---

## [2.4.0] — 2026-07-18

### Added
- Optional **Weather Neo** visuals (`neoMode`): geometry gradients, time-of-day tint, in-card CSS rain/snow/glow/flash, low-power awareness
- **Hourly forecast** and **7-day forecast** in the sheet (`showHourly`, `showDaily`; defaults on)
- Manifest description updated for Neo + forecast

### Fixed
- Extreme-weather thresholds respect Fahrenheit when units are °F

### Notes
- Still `minAppVersion` **1.7.0** (classic mode on older Cultiva)

---

## [2.3.2] — 2026-07-12

### Changed
- Default manifest setting labels to English (City, Units, Show in garden; °C/°F options)
- Localization via Cultiva plugin-i18n when app language is Russian

### Fixed
- Removed ~180 lines of unused `.weather-modal-*` / legacy `.weather-widget` CSS

### Later (no version bump)
- Manifest setting **i18n** blocks for RU
- Declared `surfaces: ["header", "garden"]`
- Product description refreshed for hybrid worldwide city search

---

## [2.3.1] — 2026-07-12

### Added
- `onSettingsChange` for locale/theme refresh without disable/re-enable

### Fixed
- Extreme-weather alerts wired to `onHabitComplete`
- `cities-ru.json` loaded only via bundled `data.read` (no GitHub raw fallback)

### Changed
- Shared `cultiva-sheet-base.css` for sheet UI

---

## [2.3.0] — 2026-07-08

### Fixed
- Russian city display / labeling polish
- Wind shown in **km/h** where applicable
- Garden card sizing aligned with habit cards

---

## [2.2.0] — 2026-07-08

### Added
- SVG weather icons
- Russian UI copy
- Patch-based city search improvements
- Habit-style garden cards with weather tints

### Changed
- Temporary RU labels on manifest settings (later reverted to EN in 2.3.2)

---

## [2.1.0] — 2026-07-08

### Added
- Bundled `cities-ru.json` (~1100+ cities) via manifest `data`
- Hybrid RU offline search + Open-Meteo worldwide

### Fixed
- Load cities from installed bundle; non-blocking `onEnable`
- Text weather codes instead of emoji icons; empty `icon` in manifest
- Geocode city settings on enable; clear garden output on disable

### Changed
- `minAppVersion` aligned to Cultiva **1.7.0** Linden

---

## [2.0.0] — 2026-05-12

### Added
- Header + garden surfaces via main-window bridge (`updateMainHeader`, `updateGardenHtml`, `openMainSheet`)
- Dedicated `styles.css` for sheet/garden UI
- City search sheet in the main window

### Changed
- Major sandbox rewrite for Cultiva **0.4.0+** plugin host
- Description: weather in header and garden, city search, sheet UI
- `minAppVersion` **0.4.0** (later raised to 1.7.0 with Linden)

---

## [1.7.0] — 2026-05-12

### Changed
- Description notes Cultiva **0.4.0+** (plugin sandbox) while still requiring **0.3.5+**

---

## [1.6.1] — 2026-05-12

### Changed
- Small `index.js` cleanup / upload sync

---

## [1.6.0] — 2026-04-15

### Added
- Hybrid city search: local Russian DB first, then Open-Meteo for worldwide
- Full **1100+** Russian cities database (then inlined in `index.js`)
- Instant local search for Russian cities

### Changed
- Removed OpenWeatherMap (CSP issues)
- Removed Nominatim/OpenStreetMap (rate limiting)
- Cleaner search architecture

### Fixed
- Small Russian cities not found in search
- CSP blocking external API calls
- Header icon not updating on temperature change

---

## [1.5.1] — 2026-04-15

### Changed
- Slimmed / simplified `index.js` after 1.5.0 search experiments

---

## [1.5.0] — 2026-04-15

### Added
- Enhanced city search (OpenStreetMap Nominatim in this generation)
- Popular cities with coordinates
- Improved search / UI elements

---

## [1.0.0] — 2026-04-15

### Added
- Weather Widget plugin via **Open-Meteo** (no API key)
- Settings: city (default Moscow), units (°C/°F), show in garden
- Permissions: `network`, `storage`, `ui`
- `minAppVersion` **0.3.5**
- Garden weather display; styles and modal improvements soon after
