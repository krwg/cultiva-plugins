# Catalog

Official plugins in registry **3.5.1**. New plugins require **Cultiva 2.0.0 · Rowan** (PLE1); existing entries may declare lower `minAppVersion` floors.

| Plugin | Version | Surface | Permissions | Description |
|--------|---------|---------|-------------|-------------|
| **Weather** | 2.3.0 | Header + garden | `network`, `storage`, `ui` | Open-Meteo; **1,071** RU cities offline in `cities-ru.json` |
| **Time** | 2.2.0 | Header | `storage`, `ui` | Live clock, world timezones, sheet UI |
| **Radio** | 2.1.0 | Header | `network`, `storage`, `ui` | SomaFM streams, sleep timer, volume |
| **Pomodoro** | 1.2.0 | Header | `storage`, `ui` | 25/5 focus cycles (configurable) |
| **Quote** | 1.2.0 | Garden | `storage`, `ui` | **500** EN + **500** RU quotes, deterministic daily |
| **Streak** | 1.0.0 | Hook + toast | `ui` | Celebration on `onHabitComplete` |

---

## Tags

| Plugin | Tags |
|--------|------|
| Weather | `widget`, `weather`, `russia` |
| Time | `widget`, `clock`, `timezone` |
| Radio | `widget`, `radio`, `music`, `ambient` |
| Pomodoro | `widget`, `timer`, `focus`, `productivity` |
| Quote | `widget`, `garden`, `quote` |
| Streak | `habits`, `streak`, `notification` |

---

## Source folders

Each plugin: `https://github.com/krwg/cultiva-plugins/tree/main/<id>`

Browse with UI: [GitHub Pages catalog](https://krwg.github.io/cultiva-plugins/#catalog)

---

## Version policy

- Plugin `version` in `manifest.json` **must match** registry entry
- CI runs `scripts/validate-registry.mjs` on PRs
- Maintainers run `node scripts/compute-registry-sha256.mjs` after file changes
