# Registry Spec

Format of `registry.json` at repo root.

---

## Top-level fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Human-readable registry name |
| `version` | string | Registry schema version (currently **3.0.0**) |
| `plugins` | array | Plugin entries |

---

## Plugin entry

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Folder name under repo root (lowercase, `-` allowed) |
| `name` | yes | Display name in Cultiva catalog |
| `version` | yes | SemVer — must match `manifest.json` |
| `author` | yes | GitHub username or name |
| `description` | yes | Short catalog blurb |
| `icon` | no | Display icon (prefer empty — Cultiva uses letter placeholders) |
| `baseUrl` | yes | Raw GitHub URL to plugin folder |
| `minAppVersion` | yes | Lowest tested Cultiva version |
| `tags` | no | String array for filtering |
| `sha256` | yes | Map of filename → hex hash |

---

## Example entry

```json
{
  "id": "weather",
  "name": "Weather Widget",
  "version": "2.1.0",
  "author": "krwg",
  "description": "Open-Meteo weather with hybrid city search.",
  "icon": "",
  "baseUrl": "https://raw.githubusercontent.com/krwg/cultiva-plugins/main/weather",
  "minAppVersion": "1.7.0",
  "tags": ["widget", "weather"],
  "sha256": {
    "manifest.json": "…",
    "index.js": "…",
    "styles.css": "…",
    "cities-ru.json": "…"
  }
}
```

---

## Which files get hashed?

All installable assets:
- `manifest.json`
- Entry script (`manifest.entry`, default `index.js`)
- Every file in `manifest.styles`
- Every file in `manifest.data`

Compute locally:

```bash
node scripts/compute-registry-sha256.mjs
```

Commit updated `registry.json` after any plugin file change.

---

## baseUrl rules

- Must be **HTTPS** raw content URL (GitHub `raw.githubusercontent.com` or GitHub Pages)
- Must point to the **plugin folder**, not a single file
- Cultiva appends filenames when downloading

---

## Version bumps

1. Update `manifest.json` version in plugin folder.
2. Update matching `version` in registry entry.
3. Re-run sha256 script.
4. Test install on Cultiva ≥ `minAppVersion`.

---

## Validation checklist

- [ ] `id` matches folder name
- [ ] `version` matches manifest
- [ ] All hashed files exist on disk
- [ ] `minAppVersion` is accurate
- [ ] `permissions` in manifest match actual API usage
- [ ] No secrets or API keys in plugin source
