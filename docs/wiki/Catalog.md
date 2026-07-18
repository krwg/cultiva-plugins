# Catalog

Official plugins in registry **3.5.1**. New plugins require **Cultiva 2.0.0 · Rowan** (PLE1); existing entries may declare lower `minAppVersion` floors.

| Plugin | Version | Surface | Permissions | Description |
|--------|---------|---------|-------------|-------------|
| **Weather** | [2.5.1] | Header + garden | `network`, `storage`, `ui` | Open-Meteo; **1,071** RU cities; optional **Weather Neo** |
| **Time** | [2.2.2] | Header | `storage`, `ui` | Live clock, world timezones, sheet UI |
| **Radio** | [2.2.0] | Header | `network`, `storage`, `ui` | SomaFM streams, sleep timer, volume |
| **Pomodoro** | [1.2.1] | Header | `storage`, `ui` | 25/5 focus cycles (configurable) |
| **Quote** | [1.3.2] | Garden | `storage`, `ui` | Locale-pure EN/RU quotes, favorites |
| **Weekly Stats** | [1.0.0] | Garden | `ui` | 7-day bars + weekly rate |
| **Habit Reflection** | [1.1.0] | Hook + sheet | `storage`, `ui` | Micro-journal on complete |
| **Routine** | [1.0.0] | Garden | `ui` | Morning/evening checklists |
| **Gentle Nudge** | [1.0.0] | Hook | `ui` | Evening reminder for incomplete habits |

---

## Store UX (in-app + Pages)

- Tag chips and search (registry `tags`)
- **Featured** (`featured: true`) first; others by `lastUpdated` then name
- Versions as **`[x.y.z]`** (same style as Cultiva)
- Permissions confirmed before Install
- **Details**: tags, permissions, last updated, changelog excerpt, screenshots
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
| Weekly Stats | `widget`, `garden`, `stats` |
| Habit Reflection | `habits`, `journal` |
| Routine | `habits`, `routine` |
| Gentle Nudge | `habits`, `reminder` |

---

## Source folders

Each plugin: `https://github.com/krwg/cultiva-plugins/tree/main/<id>`

Per-plugin release history: `<id>/CHANGELOG.md`. Weather also has a [README](https://github.com/krwg/cultiva-plugins/blob/main/weather/README.md).

Browse: [GitHub Pages catalog](https://krwg.github.io/cultiva-plugins/#catalog)

---

## Version policy

- Plugin `version` in `manifest.json` **must match** registry entry
- CI runs `scripts/validate-registry.mjs` on PRs
- Maintainers run `node scripts/compute-registry-sha256.mjs` after file changes (runs enrich + hashes)
