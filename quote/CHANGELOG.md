# Changelog

All notable changes to the **Quote of the Day** plugin are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [1.6.0] — 2026-07-18

### Changed
- Rebuilt quote banks: **500** curated English quotes and **500** authentic Russian quotes / пословицы / афоризмы
- English: well-known attributions (philosophers, writers, leaders, classic proverbs) — no Unknown
- Russian: native Russian/Soviet authors and traditional folk sayings (Пушкин, Толстой, Чехов, Достоевский, Горький, Пришвин, Русская пословица, etc.) — not translations of the English bank

---

## [1.5.0] — 2026-07-18

### Changed
- Garden card **min-height 184px** (habit-card height) with flex layout so content fills
- Next-quote control uses a **chevron** instead of the multi-arrow shuffle icon
- All button labels and toasts via `_t()` (EN/RU), including next quote and favorites

### Added
- `showNotification` on next quote and favorite / unfavorite

---

## [1.4.0] — 2026-07-18

### Added
- **Another quote** button — shuffle a different quote from the local bank (EN/RU)

---

## [1.3.2] — 2026-07-12

### Fixed
- Favorites heart behavior

### Changed
- Manifest setting **i18n** blocks

---

## [1.3.1] — 2026-07-12

### Changed
- Leaner garden card (heart only, no hint row)

---

## [1.3.0] — 2026-07-12

### Added
- **1000** locale-pure EN + **1000** RU quotes from open sources
- Favorites heart to save quotes; browse favorites in plugin settings
- Full quote text visible in the garden widget (no ellipsis clipping)

---

## [1.2.1] — 2026-07-12

### Added
- `onSettingsChange` for locale refresh without disable/re-enable

### Removed
- Unused `storage` permission

---

## [1.2.0] — 2026-07-08

### Added
- **500** EN + **500** RU local quotes (deterministic daily)
- SVG icon; removed external quote API

---

## [1.0.2] — 2026-07-08

### Changed
- Garden card height / polish aligned with habit cards

---

## [1.0.1] — 2026-07-08

### Changed
- Card layout polish

---

## [1.0.0] — 2026-07-08

### Added
- Garden quote-of-the-day widget
