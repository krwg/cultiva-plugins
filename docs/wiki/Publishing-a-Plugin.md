# Publishing a Plugin

Step-by-step guide to add or update a plugin in **cultiva-plugins**.

---

## Prerequisites

- Cultiva **1.7.0+** installed for testing
- Fork of [cultiva-plugins](https://github.com/krwg/cultiva-plugins)
- Read [Cultiva PLUGIN_AUTHOR_GUIDE](https://github.com/krwg/cultiva/blob/main/docs/PLUGIN_AUTHOR_GUIDE.md)

---

## 1. Create plugin folder

```
my-plugin/
  manifest.json
  index.js
  styles.css       # optional
  data.json        # optional — list in manifest.data
```

**manifest.json minimum:**

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "Short description",
  "icon": "",
  "entry": "index.js",
  "styles": ["styles.css"],
  "permissions": ["ui"],
  "minAppVersion": "1.7.0"
}
```

---

## 2. Implement entry script

```javascript
export default class MyPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
  }

  async onEnable() {
    this.context.ui.updateMainHeader({ label: 'Hello', icon: '' });
  }

  async onDisable() {
    // cleanup timers, listeners
  }
}
```

Use **main-window UI APIs** — sandbox cannot access real DOM.

---

## 3. Test locally

Point Cultiva registry URL to your fork's raw `registry.json`:

```
https://raw.githubusercontent.com/YOUR_USER/cultiva-plugins/main/registry.json
```

Install via **Settings → Plugins**. Check DevTools for sandbox errors.

---

## 4. Compute sha256

```bash
node scripts/compute-registry-sha256.mjs
```

Verify `registry.json` updated with correct hashes.

---

## 5. Add registry entry

Append to `plugins` array in `registry.json` with all required fields (see [[Registry Spec]]).

---

## 6. Open PR

Include:
- Plugin source files
- Updated `registry.json`
- Screenshot or short description of behavior
- Confirmation tested on Cultiva 1.7.0

---

## Updating an existing plugin

1. Bump `version` in both `manifest.json` and registry entry.
2. Re-run sha256 script.
3. PR with changelog note in description.

Users reinstall or wait for future auto-update support.

---

## Sheet UI tips

If your plugin uses `openMainSheet`:
- Include full sheet scaffold (overlay + card) **or** wait for core shared CSS
- Use `data-cultiva-action` / `data-cultiva-input-act` for interactions
- Implement `onModalAction(action, payload)` on your class

Avoid rebuilding the entire sheet on every input keystroke — causes focus loss (core fix pending).

---

## Permissions

| Permission | Grants |
|------------|--------|
| `ui` | Header, sheets, garden, notifications |
| `storage` | `context.storage.get/set` |
| `network` | `fetch` in sandbox (HTTP GET) |

Declare only what you use. `Audio()` streaming is currently outside fetch permission gate.
