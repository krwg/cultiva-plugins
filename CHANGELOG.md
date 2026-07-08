# Changelog

All notable changes to the **Cultiva Plugins registry** are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/). Registry version is the top-level `version` field in `registry.json`.

---

## [3.0.0] — 2026-07-08

### Added
- **Pomodoro Timer** plugin (header focus timer)
- **Quote of the Day** plugin (garden widget)
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
- Registry URL canonical path: `krwg/cultiva-plugins`
- Removed emoji from plugin UI; letter placeholders in Cultiva catalog

### Fixed
- Weather `onEnable` no longer blocks on network (install timeout)
- Registry `baseUrl` points to correct repository

---

## [2.0.0] — 2026-06

### Added
- **Time Widget** plugin
- **Radio Widget** plugin
- Registry JSON manifest with `baseUrl` per plugin

### Changed
- **Weather Widget** major update — sheet UI, garden widget, settings
- Expanded README and install documentation

---

## [1.0.0] — 2026-05

### Added
- Initial **Weather Widget** plugin
- First `registry.json` with single-plugin catalog
- MIT license

---

[3.0.0]: https://github.com/krwg/cultiva-plugins/compare/registry-2.0.0...main
[2.0.0]: https://github.com/krwg/cultiva-plugins/releases
[1.0.0]: https://github.com/krwg/cultiva-plugins/releases
