<div align="center">

# Cultiva Plugins 1.1.0

**Plugins that listen to your garden — not just widgets on a shelf.**

[![Registry](https://img.shields.io/badge/registry-3.5.1-34c759?style=flat-square)](https://github.com/krwg/cultiva-plugins/blob/main/registry.json)
[![Plugins](https://img.shields.io/badge/plugins-9-ffcc00?style=flat-square)](https://krwg.github.io/cultiva-plugins/)
[![Hooks](https://img.shields.io/badge/surface-hooks-5856d6?style=flat-square)](#hook-catalog)
[![Cultiva](https://img.shields.io/badge/Cultiva-1.7.0%2B%20hooks-0071e3?style=flat-square&logo=electron&logoColor=white)](https://github.com/krwg/cultiva/releases)
[![License](https://img.shields.io/badge/license-MIT-af52de?style=flat-square)](LICENSE)

[Catalog](https://krwg.github.io/cultiva-plugins/) · [Cultiva app](https://github.com/krwg/cultiva/releases) · [Author guide](https://github.com/krwg/cultiva/blob/main/docs/PLUGIN_AUTHOR_GUIDE.md#7-hooks-api) · [Publishing wiki](https://github.com/krwg/cultiva-plugins/wiki/Publishing-a-Plugin)

</div>

---

## Hooks, explained as a product

In Cultiva, a plugin is not only a header chip or a garden card. **Hook-based extensions subscribe to moments in the app** — you complete a habit, change a theme, tweak settings, or open Cultiva in the morning. The host fires the callback; the plugin responds **at the right time**, without polling.

| Moment | What you feel |
|:-------|:--------------|
| **After a check-in** | A reflection sheet, routine checklist tick, weekly chart refresh |
| **On launch** | Gentle reminders and today’s summaries warm up |
| **When settings change** | Timer, weather, and quotes follow your choices instantly |
| **Theme & background** | Custom plugin themes stay readable as the garden restyles |

Everything stays **on-device**. Hooks wire your garden to plugin behavior locally — no cloud, no telemetry.

---

## Hook reference

Subscribe in plugin code with `hooks.on('hookName', callback)`. Full spec: [PLUGIN_AUTHOR_GUIDE §7](https://github.com/krwg/cultiva/blob/main/docs/PLUGIN_AUTHOR_GUIDE.md#7-hooks-api).

| Hook | Fires when | Product idea |
|:-----|:-----------|:-------------|
| `onAppStart` | Cultiva opens or returns to foreground | Nudge open habits, preload summaries |
| `onHabitComplete` | You mark a habit done | Micro-journal, celebration, routine + stats refresh |
| `onSettingsChange` | App or plugin settings change | Sync timer, weather, quotes, radio volume |
| `onThemeApplied` | Theme applied (`{ theme, resolved }`) | Align custom plugin theme colors |
| `onBackgroundApplied` | Ambient background changes | React to the new visual layer |
| `onLanguageChange` | Locale switches (`en` \| `ru`) | Flip copy without reload |
| `onFocusModeChange` | Focus mode toggles | Hide distractions in the garden |

---

## Official catalog — who listens to what

| Plugin | Surfaces | Hooks in practice | Min Cultiva |
|:-------|:---------|:------------------|:------------|
| **Notes** (Habit Reflection) | `hooks` | One-line sheet after every check-in; **journal panel in settings** *(1.1.0)* | 1.7.0 |
| **Morning & Evening Routine** | `garden` · `hooks` | Checklist by habit name updates on complete + app start | 2.0.0 |
| **Weekly Stats** | `garden` · `hooks` | 7-day bar chart recalculates after each check-in | 2.0.0 |
| **Gentle Nudge** | `hooks` | Friendly reminder after your chosen hour if habits remain open | 2.0.0 |
| **Weather** | `header` · `garden` | Reacts to check-ins and city/unit settings | 1.7.0 |
| **Time** | `header` | Stays in sync via `onSettingsChange` | 1.1.0 |
| **Radio** | `header` | Volume, station, sleep timer follow settings | 1.1.0 |
| **Pomodoro** | `header` | Timer prefs update live | 1.1.0 |
| **Quote** | `garden` | Favorites and locale follow settings | 1.7.0 |

> Header-only widgets work without hooks; hooks make them **feel alive** when preferences change.

---

## Spotlight — Notes 1.1.0

[![Notes](https://img.shields.io/badge/Notes-1.1.0-34c759?style=flat-square)](habit-reflection/)
[![Surface](https://img.shields.io/badge/surface-hooks_only-5856d6?style=flat-square)](habit-reflection/manifest.json)
[![Hook](https://img.shields.io/badge/hook-onHabitComplete-ff9500?style=flat-square)](#hook-reference)

**Habit Reflection** (catalog name: **Notes**) is the reference **hook-only** plugin — no garden widget; value lives in the moment after you check in.

| | |
|:--|:--|
| **Unchanged** | Bottom sheet right after `onHabitComplete` — one optional line, skip anytime |
| **New in 1.1.0** | **Saved reflections** panel in plugin settings (`type: journal`) — browse the log without touching storage APIs |
| **i18n** | EN/RU empty states and labels |

---

## Compatibility

| | |
|:--|:--|
| **Registry** | [3.5.1](https://github.com/krwg/cultiva-plugins/blob/main/registry.json) — **9** official plugins |
| **Cultiva 1.1.0** | Header widgets (Time, Radio, Pomodoro) |
| **Cultiva 1.7.0** | Garden + hooks (Weather, Quote, Notes) |
| **Cultiva 2.0.0 Rowan** | Analytics plugins, PLE1 bridge, App Store **Get → Install** flow |

---

## For plugin authors

Hooks turn an extension into **part of the rhythm**, not a static button.

1. Declare `"surfaces": ["hooks"]` — or combine with `"header"` / `"garden"` in `manifest.json`.
2. Request only the `permissions` you need (`storage`, `ui`; skip `network` when possible).
3. Follow [Publishing a Plugin](https://github.com/krwg/cultiva-plugins/wiki/Publishing-a-Plugin) and [Plugin Hardening](https://github.com/krwg/cultiva-plugins/wiki/Plugin-Hardening).

---

<div align="center">

**Install:** Cultiva → **Settings → Plugins → Catalog** → **Get** / **Install**

[![Pages](https://img.shields.io/badge/browse-krwg.github.io%2Fcultiva--plugins-0071e3?style=flat-square)](https://krwg.github.io/cultiva-plugins/)

</div>
