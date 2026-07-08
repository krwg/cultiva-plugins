# Catalog

Official plugins in **registry 3.0.0**. All require Cultiva **≥ 1.7.0**.

---

## Summary table

| ID | Name | Version | Surface | Permissions | Status |
|----|------|---------|---------|-------------|--------|
| `weather` | Weather Widget | 2.1.0 | Header + garden | network, storage, ui | Partial — settings geocoding, garden toggle |
| `time` | Time Widget | 2.0.0 | Header | storage, ui | Partial — rainbow animation, search focus |
| `radio` | Radio Widget | 2.0.0 | Header | storage, ui | Working — autoplay policy on cold start |
| `pomodoro` | Pomodoro Timer | 1.0.0 | Header | storage, ui | Partial — sheet CSS when alone, no persistence |
| `quote` | Quote of the Day | 1.0.0 | Garden | ui | Working — light theme contrast, no midnight refresh |
| `streak` | Streak Celebrator | 1.0.0 | Hook | ui | Working — basic toasts only |

---

## weather

**Description:** Current conditions via Open-Meteo. Hybrid city search: 1100+ Russian cities offline + worldwide geocoding.

**Files:** `manifest.json`, `index.js`, `styles.css`, `cities-ru.json`

**Settings:** city, units (metric/imperial), show in garden

**Known issues:**
- Settings "City" text field does not update lat/lon
- `showInGarden: false` does not remove existing garden widget
- City search loses input focus on each keystroke

---

## time

**Description:** Live clock with timezone picker, 12/24h format, accent colors.

**Settings:** format, color (including rainbow)

**Known issues:**
- Rainbow mode updates hue but header color refreshes only every 1s
- Timezone filter search loses focus (sheet remount)

---

## radio

**Description:** SomaFM ambient streams with volume slider and sleep timer.

**Settings:** last station, volume, sleep minutes

**Notes:**
- Uses `Audio()` for streams — not gated by `network` permission (fetch)
- Autoplay on restore may fail without prior user gesture

---

## pomodoro

**Description:** 25/5 focus timer in header chip.

**Settings:** work minutes, break minutes

**Known issues:**
- Missing shared `.cultiva-sheet-*` CSS when installed without weather/time/radio
- Timer state not persisted across app restart
- Auto-reopens sheet when phase completes

---

## quote

**Description:** Deterministic daily quote in garden (12 quotes, date hash).

**Known issues:**
- Hardcoded rgba colors — poor light theme contrast
- Quote does not refresh at midnight without plugin reload

---

## streak

**Description:** `onHabitComplete` hook → celebration notification.

**Known issues:**
- No milestone messages (7/30/100 days)
- Hook not removed on disable until sandbox destroy

---

## Install from Cultiva

**Settings → Plugins → Install**

Or verify registry manually:
```bash
curl -s https://raw.githubusercontent.com/krwg/cultiva-plugins/main/registry.json | jq '.plugins[].id'
```
