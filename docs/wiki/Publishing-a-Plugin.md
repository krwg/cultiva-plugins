# Publishing a Plugin

## Prerequisites

- Cultiva **1.7.0+** for testing
- Read [PLUGIN_AUTHOR_GUIDE.md](https://github.com/krwg/cultiva/blob/main/docs/PLUGIN_AUTHOR_GUIDE.md)
- Fork [cultiva-plugins](https://github.com/krwg/cultiva-plugins)

---

## Steps

### 1. Create plugin folder

```
my-plugin/
├── manifest.json
├── index.js
└── styles.css       # optional
```

`manifest.json` must include `id`, `version`, `permissions`, `minAppVersion: "1.7.0"`, `entry`.

### 2. Implement entry script

Return a plugin instance with `onEnable` / `onDisable`. Use bridge APIs for UI — no main-window DOM access.

### 3. Add registry entry

Edit `registry.json` — new object in `plugins[]` with `baseUrl` pointing to your folder on `main`.

### 4. Compute hashes

```bash
node scripts/compute-registry-sha256.mjs
```

Commit updated `registry.json` (version bump included if script increments).

### 5. Test install

In Cultiva desktop:

- Settings → Plugins → point registry URL to your fork's raw `registry.json` (if testing pre-merge)
- Install → enable → exercise all surfaces

### 6. Open PR

Use the PR template checklist. Include permission rationale if using `network`.

---

## After merge

- Users get new catalog on next browse refresh
- No Cultiva app update required unless new RPC APIs are needed

---

## New plugin vs update

| Type | Action |
|------|--------|
| New plugin | New folder + new registry block |
| Bugfix | Bump `manifest.version` + registry `version` + rehash |
| Breaking API | Bump `minAppVersion` and document in PR |

---

## Submission without PR

Use [plugin submission issue template](https://github.com/krwg/cultiva-plugins/issues/new/choose).
