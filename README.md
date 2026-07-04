<div align="center">

# Cultiva Plugins

**Official widget registry for [Cultiva](https://github.com/krwg/cultiva) — weather, clock, and ambient radio on your habit garden.**

[![Registry](https://img.shields.io/badge/registry-2.0.0-34c759?style=flat-square)](registry.json)
[![License](https://img.shields.io/badge/license-MIT-af52de?style=flat-square)](LICENSE)
[![Cultiva](https://img.shields.io/badge/for-Cultiva%201.1.0+-0071e3?style=flat-square)](https://github.com/krwg/cultiva)
[![Plugins](https://img.shields.io/badge/plugins-3-ffcc00?style=flat-square)](#included-plugins)

</div>

---

This repository is the **public plugin catalog** for Cultiva. The desktop app fetches `registry.json` and installs sandboxed widgets from here — no separate store account, no npm for end users.

**[→ Registry overview (Pages)](https://krwg.github.io/cultiva-plugins/)** · **[Cultiva app](https://github.com/krwg/cultiva/releases)**

---

## Included plugins

| Plugin | What it does |
|--------|----------------|
| **Weather** | Current conditions — hybrid search across 1100+ Russian cities and worldwide locations via Open-Meteo (no API key). |
| **Time** | Live clock with time zones and a sheet-style picker. |
| **Radio** | Curated ambient streams (e.g. SomaFM), sleep timer, volume, glass UI. |

Each plugin ships as `manifest.json` + `index.js` + `styles.css` in its own folder. Cultiva loads them from the `baseUrl` in the registry.

---

## For Cultiva users

1. Install **[Cultiva](https://github.com/krwg/cultiva/releases)**.
2. Open **Settings → Plugins**.
3. Browse the registry, install a widget, enable it on the garden home screen.

Plugins run in a **sandbox** with declared permissions (`network`, `storage`, `ui` where needed). Your habit data stays local.

---

## For plugin authors

| File | Role |
|------|------|
| `registry.json` | Catalog index — id, version, `baseUrl`, `minAppVersion`, tags |
| `<plugin>/manifest.json` | Entry point, permissions, display name |
| `<plugin>/index.js` | Widget logic (ES module API provided by Cultiva) |
| `<plugin>/styles.css` | Scoped styles |

Authoring guide in the main Cultiva repo: [`docs/PLUGIN_AUTHOR_GUIDE.md`](https://github.com/krwg/cultiva/blob/main/docs/PLUGIN_AUTHOR_GUIDE.md).

**Add or update a plugin:**

1. Create a folder with `manifest.json`, `index.js`, and optional `styles.css`.
2. Add an entry to `registry.json` with a `baseUrl` pointing at  
   `https://raw.githubusercontent.com/krwg/cultiva-plugins/main/<id>`.
3. Open a pull request.

---

## Layout

```
cultiva-plugins/
├── registry.json       # app-facing catalog
├── weather/            # Weather Widget
├── time/               # Time Widget
├── radio/              # Radio Widget
├── neoui/              # NeoUI setup helper (dev)
└── docs/index.html     # GitHub Pages landing
```

---

## License

**MIT** — see [LICENSE](LICENSE).

---

<div align="center">

Maintained by [krwg](https://github.com/krwg) · widgets for the garden, not the cloud

</div>
