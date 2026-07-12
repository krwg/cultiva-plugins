# Registry Spec

The Cultiva desktop app reads **`registry.json`** from this repository at install time.

**Current version:** `3.5.1` (top-level `version` field)

**Cultiva:** **2.0.0 · Rowan** with **PLE1** plugin engine — expanded bridge APIs (`app.getWeeklySummary()`, habit hooks, manifest-driven settings). New plugins must set `minAppVersion: "2.0.0"`.

---

## Top-level shape

```json
{
  "name": "Cultiva Plugins Registry",
  "version": "3.5.1",
  "plugins": [ /* array of plugin entries */ ]
}
```

Bump `version` when any plugin or hash map changes (maintainer script may auto-increment patch).

---

## Plugin entry

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Folder name; lowercase, `-` allowed |
| `name` | yes | Display name in Cultiva |
| `version` | yes | SemVer; must match `manifest.json` |
| `author` | yes | Maintainer string |
| `description` | yes | Short summary |
| `icon` | yes | Use `""` (letter placeholders in UI) |
| `baseUrl` | yes | Raw GitHub URL to plugin folder on `main` |
| `minAppVersion` | yes | `"2.0.0"` for **new** plugins; catalog may retain `1.1.0` / `1.7.0` on legacy entries |
| `tags` | no | String array for discovery |
| `sha256` | yes | Map of **filename → hex hash** for every installable file |

---

## sha256 map

Must include **every** file Cultiva downloads:

- `manifest.json`
- `entry` script (usually `index.js`)
- Each path in `manifest.styles`
- Each path in `manifest.data`

Cultiva **aborts install** on mismatch.

Regenerate:

```bash
node scripts/compute-registry-sha256.mjs
```

---

## baseUrl

Must point to raw content on `main`, e.g.:

```
https://raw.githubusercontent.com/krwg/cultiva-plugins/main/weather
```

Cultiva appends `/manifest.json`, `/index.js`, etc.

---

## Client fetch URL

Default registry URL baked into Cultiva:

```
https://raw.githubusercontent.com/krwg/cultiva-plugins/main/registry.json
```

Fork testing: point Cultiva settings to your fork's raw URL.

---

## Validation

`.github/workflows/registry-validate.yml` runs `scripts/validate-registry.mjs` on PRs.
