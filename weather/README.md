# Weather Widget

Current conditions in the Cultiva header and garden, with hybrid city search for any location worldwide. Optional **Weather Neo** visuals, hourly and 7-day forecast.

**Version:** 2.5.1 (see [CHANGELOG.md](./CHANGELOG.md))  
**minAppVersion:** `1.7.0`

---

## Features

| Surface | What you get |
|---------|----------------|
| **Header** | Compact temperature + condition; tap opens the forecast sheet |
| **Garden** | Habit-style weather card (optional via `showInGarden`) |
| **Weather Neo** | Opt-in geometry gradients, time-of-day tint, in-card rain/snow/glow/flash (`neoMode`) |
| **Hourly** | Next-hours strip in the sheet (`showHourly`) |
| **Daily** | 7-day forecast in the sheet (`showDaily`) |
| **City search** | Local RU city DB first, then Open-Meteo geocoding worldwide |

---

## Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `city` | text | `Moscow` | Display / search city name |
| `units` | select | `celsius` | `celsius` or `fahrenheit` |
| `showInGarden` | boolean | `true` | Show weather card in the garden |
| `neoMode` | boolean | `false` | Enable Weather Neo visuals |
| `neoBypassThemes` | boolean | `false` | Keep Neo palette when Cultiva themes would otherwise recolor the card |
| `showHourly` | boolean | `true` | Show hourly forecast in the sheet |
| `showDaily` | boolean | `true` | Show 7-day forecast in the sheet |

Coordinates (`lat` / `lon`) are stored after a successful city pick; they are not exposed as manifest settings.

---

## Permissions

- `network` — Open-Meteo forecast and geocoding
- `storage` — remember city, units, and Neo toggles
- `ui` — header, garden, and sheet surfaces

---

## Data & API

- Forecast and geocoding: **[Open-Meteo](https://open-meteo.com/)** (no API key)
- Bundled offline RU cities: `cities-ru.json` (~1,071 entries) via manifest `data` + `context.data.read`
- Hybrid search: local RU match first, then Open-Meteo worldwide

---

## Low-power behavior

When Cultiva sets `html[data-low-power="1"]`, Weather Neo CSS effects (rain streaks, snowflakes, flash, glow) are reduced or disabled so the widget stays readable without heavy animation.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for every release from **1.0.0** through **2.5.0**.
