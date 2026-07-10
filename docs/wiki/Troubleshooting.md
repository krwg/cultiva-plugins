# Troubleshooting

## Install fails immediately

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| sha256 mismatch | Registry out of sync with files | Pull latest `main`; maintainer re-runs hash script |
| 404 on download | Wrong `baseUrl` in registry | Fix path to `raw.githubusercontent.com/.../main/<id>` |
| minAppVersion | Cultiva too old | Upgrade to **1.7.0+** |
| Network error | Offline or GitHub down | Retry; check firewall |

## Plugin installs but doesn't show

- Enable **Plugins** globally in Settings
- Toggle plugin off/on
- Restart Cultiva
- Header plugins need `registerHeaderItem` in `onEnable`

## Weather-specific

| Issue | Fix |
|-------|-----|
| No cities worldwide | Need network for geocoding |
| RU cities work offline | Expected — `cities-ru.json` bundled |
| Install hung (old builds) | Fixed in 2.x — update Cultiva + registry |

## Radio-specific

- Requires `network` permission and live stream URL
- Sleep timer stops playback when expired

## Testing a fork

1. Push plugin + registry to your fork
2. In Cultiva, set custom registry URL to:
   `https://raw.githubusercontent.com/<you>/cultiva-plugins/<branch>/registry.json`
3. Browse → Install

## Cultiva app bugs

If sandbox or install pipeline fails across plugins → [cultiva issues](https://github.com/krwg/cultiva/issues).

## Logs

Run Cultiva from terminal (platform-specific) and reproduce install with DevTools open (Ctrl+Shift+I) for network errors.
