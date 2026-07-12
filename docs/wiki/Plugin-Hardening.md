# Plugin Hardening

Tracker for quality, security, and consistency across official plugins.

**Registry:** 3.5.1 · **Cultiva:** 2.0.0+ · Rowan (PLE1)

---

## Completed (1.7 / 3.x)

- [x] sha256 integrity on all installable files
- [x] `minAppVersion` audit — legacy floors (`1.1.0` / `1.7.0`); **new plugins require `2.0.0`**
- [x] Shared `cultiva-sheet-base.css` for weather, time, radio
- [x] Weather offline RU cities bundle (`cities-ru.json`)
- [x] Quote offline bundle (`quotes-data.json`)
- [x] Letter placeholders — no emoji in plugin UI/manifests
- [x] Registry version sync script (`compute-registry-sha256.mjs`)
- [x] CI validate workflow (`validate-registry.mjs`)
- [x] Manifest-driven settings UI in Cultiva

---

## Open / follow-up

Track in [GitHub Issues](https://github.com/krwg/cultiva-plugins/issues):

| Area | Notes |
|------|--------|
| Weather dead code | `checkExtremeWeather()` unused — wire or remove |
| Registry schema 3.1 | `permissions` catalog, i18n fields, `deprecated` |
| README/wiki drift | Keep catalog table synced with `registry.json` |
| Plugin test harness | Manual install only today |

Issue numbers #2–#10 referenced historical audit — see open issues for current state.

---

## Security review checklist

- [ ] No secrets in repo
- [ ] `permissions` match actual API usage
- [ ] User-controlled strings escaped in sheet HTML
- [ ] Network calls only to documented hosts
- [ ] No habit data exfiltration

Report vulnerabilities: [SECURITY.md](https://github.com/krwg/cultiva-plugins/blob/main/SECURITY.md)
