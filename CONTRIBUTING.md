# Contributing to cultiva-plugins

Thank you for helping improve the official **Cultiva plugin registry**.

This repo holds plugin source, `registry.json`, and the GitHub Pages docs site. The Cultiva desktop app downloads files from here at runtime — every change must keep the registry consistent and installable.

---

## Before you start

- Read the [README](README.md) and [CHANGELOG](CHANGELOG.md)
- Plugin API reference: [Cultiva PLUGIN_AUTHOR_GUIDE](https://github.com/krwg/cultiva/blob/main/docs/PLUGIN_AUTHOR_GUIDE.md)
- Wiki: [Publishing a Plugin](https://github.com/krwg/cultiva-plugins/wiki/Publishing-a-Plugin)
- Security: [SECURITY.md](SECURITY.md) — **never** open public issues for vulnerabilities

---

## Ways to contribute

| Type | How |
|------|-----|
| **Bug in an official plugin** | [Bug report issue](https://github.com/krwg/cultiva-plugins/issues/new/choose) |
| **New plugin for the registry** | [Plugin submission issue](https://github.com/krwg/cultiva-plugins/issues/new/choose) or PR |
| **Registry / sha256 / docs** | PR with checklist below |
| **Questions** | [Wiki](https://github.com/krwg/cultiva-plugins/wiki) or [Cultiva Discussions](https://github.com/krwg/cultiva/discussions) |

Core Cultiva runtime bugs belong in [krwg/cultiva](https://github.com/krwg/cultiva/issues).

---

## Pull request workflow

1. **Fork** and branch from `main`
2. Make focused changes — one plugin or one registry update per PR when possible
3. **Test** install on Cultiva **≥ 2.0.0 · Rowan** (point registry URL to your fork's raw `registry.json`)
4. **Recompute hashes:**

```bash
node scripts/compute-registry-sha256.mjs
```

5. Commit updated `registry.json` with matching `version` fields in manifests
6. Open PR with a clear description and screenshots if UI changed

---

## Publishing checklist

- [ ] `manifest.json` — valid id, version, permissions, `minAppVersion`
- [ ] `index.js` — exports default class with `onEnable` / `onDisable`
- [ ] All assets listed in `manifest.styles` and `manifest.data`
- [ ] Registry entry — `baseUrl`, `version`, `sha256` for every installable file
- [ ] Tested install + enable + disable on Cultiva 1.7.0+
- [ ] No secrets, API keys, or habit data collection
- [ ] English description in PR; user-facing strings may be en/ru

---

## Code style

- Vanilla JavaScript (ES modules in plugin entry)
- Match patterns in existing plugins (`weather/`, `time/`, etc.)
- No emoji in plugin UI code (Cultiva uses letter placeholders in catalog)
- Keep sheet CSS self-contained or document dependency on Cultiva core sheet base

---

## License

Contributions to this repository are licensed under **MIT** (see [LICENSE](LICENSE)).

Individual plugins you submit remain your work; by merging into the official registry you agree they are distributed under MIT alongside the rest of this repo.
