# Catalog

Official plugins in registry **3.5.3**. New plugins require **Cultiva 2.0.0 · Rowan** (PLE1); existing entries may declare lower `minAppVersion` floors.

| Plugin | Version | Surface | Permissions | Description |
|--------|---------|---------|-------------|-------------|
| **Weather** ★ | [2.6.0] | Header + garden | `network`, `storage`, `ui` | Open-Meteo; RU cities; optional Weather Neo |
| **Radio** ★ | [2.4.0] | Header | `network`, `storage`, `ui` | Player UI, custom URL, Media Session, opt-in Neo FX |
| **Quote** ★ | [1.6.0] | Garden | `storage`, `ui` | 500 EN + 500 RU curated quotes, favorites, next quote |
| **Insights** | [1.0.0] | Garden | `habits.read`, `storage`, `ui` | On-device habit correlations |
| **Time** | [2.2.2] | Header | `storage`, `ui` | Live clock, world timezones, sheet UI |
| **Pomodoro** | [1.2.1] | Header | `storage`, `ui` | 25/5 focus cycles (configurable) |
| **Weekly Stats** | [1.0.0] | Garden | `habits.read`, `storage`, `ui` | 7-day bars + weekly rate |
| **Habit Reflection** | [1.1.0] | Hook + sheet | `storage`, `ui` | Micro-journal on complete |
| **Routine** | [1.0.0] | Garden | `habits.read`, `storage`, `ui` | Morning/evening checklists |
| **Gentle Nudge** | [1.0.0] | Hook | `habits.read`, `storage`, `ui`, `settings.read` | Evening reminder for incomplete habits |

★ = **Featured** filter (`featured: true`): Weather, Radio, Quote.

---

## Store UX (in-app + Pages)

- Search plus **Category** `<select>` (registry `tags` + **Featured**) and **Sort** `<select>`: Updated, A–Z, Z–A, А–Я
- **Featured** is a filter option — not a separate heading in the list
- Versions as **`[x.y.z]`** (same style as Cultiva)
- Permissions confirmed before Install
- **Details**: tags, permissions, last updated, **README.md** (tables/lists/italics), changelog excerpt, screenshots
- Each registry entry has `"readme": "README.md"` (bilingual EN/RU product copy)
- `lastUpdated` / `changelog` filled by `scripts/enrich-registry-meta.mjs` (public git dates — not telemetry)

---

## Tags

| Plugin | Tags |
|--------|------|
| Weather | `widget`, `weather`, `russia` |
| Time | `widget`, `clock`, `timezone` |
| Radio | `widget`, `radio`, `music`, `ambient` |
| Pomodoro | `widget`, `timer`, `focus`, `productivity` |
| Quote | `widget`, `garden`, `quote` |
| Weekly Stats | `widget`, `garden`, `analytics`, `habits` |
| Insights | `widget`, `garden`, `stats`, `analytics` |
| Habit Reflection | `habits`, `journal`, `mindfulness` |
| Routine | `widget`, `garden`, `habits`, `routine` |
| Gentle Nudge | `habits`, `notification`, `reminder` |

---

## Source folders

Each plugin: `https://github.com/krwg/cultiva-plugins/tree/main/<id>`

Per-plugin docs: `<id>/README.md` (EN + RU) and `<id>/CHANGELOG.md` (Keep a Changelog).

Browse: [GitHub Pages catalog](https://krwg.github.io/cultiva-plugins/)

---

## Version policy

- Plugin `version` in `manifest.json` **must match** registry entry
- CI runs `scripts/validate-registry.mjs` on PRs
- Maintainers run `node scripts/compute-registry-sha256.mjs` after file changes (runs enrich + hashes)
