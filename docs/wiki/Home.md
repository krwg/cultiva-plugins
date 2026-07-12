# Cultiva Plugins

**Official sandboxed extension registry for [Cultiva](https://github.com/krwg/cultiva) ≥ 2.0.0 · Rowan** (PLE1 plugin engine).

**Registry version:** [3.5.1](https://github.com/krwg/cultiva-plugins/blob/main/registry.json)  
**Catalog UI:** [krwg.github.io/cultiva-plugins](https://krwg.github.io/cultiva-plugins/)

---

## What this repo is

- `registry.json` — catalog + **sha256** hashes (Cultiva downloads this at runtime)
- Nine official plugin folders (`weather/`, `time/`, …)
- GitHub Pages landing and wiki source

**No store account. No telemetry. Habit data never leaves the device.**

---

## Quick links

| | |
|---|---|
| [Install guide](https://github.com/krwg/cultiva/wiki/Plugins) | For Cultiva users |
| [Catalog](Catalog) | All plugins, versions |
| [Publishing](Publishing-a-Plugin) | For authors |
| [Troubleshooting](Troubleshooting) | Hash mismatch, install errors |
| [Cultiva 2.0.0 · Rowan release](https://github.com/krwg/cultiva/releases/tag/2.0.0) | Required app version for new plugins |

---

## How install works

1. Cultiva fetches `registry.json` from GitHub
2. User taps **Install** in Settings → Plugins
3. Each file is downloaded and **sha256**-verified
4. Plugin runs in sandboxed iframe with declared permissions

---

## Maintainer

[krwg](https://github.com/krwg) · MIT license · [CHANGELOG](https://github.com/krwg/cultiva-plugins/blob/main/CHANGELOG.md)
