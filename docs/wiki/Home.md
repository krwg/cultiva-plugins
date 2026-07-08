# cultiva-plugins Wiki

Official documentation for the **Cultiva plugin registry** — the HTTPS catalog that Cultiva **1.7.0+** fetches at runtime.

| | |
|---|---|
| **Repository** | [github.com/krwg/cultiva-plugins](https://github.com/krwg/cultiva-plugins) |
| **Registry version** | **3.0.0** |
| **Docs site** | [krwg.github.io/cultiva-plugins](https://krwg.github.io/cultiva-plugins/) |
| **Cultiva app** | [github.com/krwg/cultiva](https://github.com/krwg/cultiva) |

---

## What is this repo?

This is **not** plugin source bundled inside Cultiva. It is the **public store**:

1. Cultiva downloads `registry.json` over HTTPS.
2. Each plugin entry lists `baseUrl`, version, and **sha256** hashes.
3. The app installs verified files into `userData/cultiva-plugins/`.

---

## Pages

| Page | Description |
|------|-------------|
| [Catalog](Catalog) | All 6 official plugins, permissions, surfaces |
| [Registry Spec](Registry-Spec) | `registry.json` schema, sha256 workflow |
| [Publishing a Plugin](Publishing-a-Plugin) | Step-by-step author workflow |
| [Security](Security) | Integrity, permissions, sandbox boundaries |
| [Troubleshooting](Troubleshooting) | Install failures, sha256, version mismatches |
| [Contributing](Contributing) | PRs, labels, review process |

---

## Quick links

**Registry URL:**
```
https://raw.githubusercontent.com/krwg/cultiva-plugins/main/registry.json
```

**Author guide (Cultiva repo):** [PLUGIN_AUTHOR_GUIDE.md](https://github.com/krwg/cultiva/blob/main/docs/PLUGIN_AUTHOR_GUIDE.md)

**Type definitions:** [cultiva-plugin.d.ts](https://github.com/krwg/cultiva/blob/main/cultiva-plugin.d.ts)

---

## Current status (1.7 Linden · Plugin Hardening)

Several plugins have known UX bugs tracked in [issues](https://github.com/krwg/cultiva-plugins/issues). Core fixes land in **cultiva**; plugin-specific fixes land here.

See [Troubleshooting](Troubleshooting) for workarounds.
