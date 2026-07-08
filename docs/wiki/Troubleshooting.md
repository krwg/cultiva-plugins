# Troubleshooting

---

## Install fails immediately

| Check | Action |
|-------|--------|
| Cultiva version | Must be ≥ plugin `minAppVersion` (**1.7.0**) |
| Registry URL | Default: `https://raw.githubusercontent.com/krwg/cultiva-plugins/main/registry.json` |
| Network | GitHub must be reachable |
| sha256 mismatch | Re-pull latest registry; maintainer may have updated hashes |

DevTools: look for `[PluginManager]` errors.

---

## Install succeeds then rolls back

Usually **sandbox timeout** in `onEnable`:
- Do not `await` long network calls before registering UI
- Pattern: `void this.fetchData()` then register header/garden immediately

Weather plugin fixed this pattern in 2.1.0 — older copies may still block.

---

## Plugin missing after restart

Cultiva removes unloadable plugin ids from the install list (console warning only). Reinstall and check DevTools for init errors.

---

## sha256 script fails

```bash
node scripts/compute-registry-sha256.mjs
```

Ensure every file referenced in manifest (`styles`, `data`, `entry`) exists on disk.

---

## Wrong plugin version shown

Registry `version` must match `manifest.json`. Bump both together.

---

## Per-plugin workarounds (1.7.0)

| Plugin | Workaround |
|--------|------------|
| **Weather** | Pick city from header sheet, not Settings text field |
| **Pomodoro** | Install Weather or Time for sheet CSS |
| **Radio** | Click Play after startup (autoplay policy) |
| **Time** | Avoid rainbow mode until fix; type TZ search slowly |

---

## Get help

- [cultiva-plugins/issues](https://github.com/krwg/cultiva-plugins/issues) — plugin bugs
- [cultiva/issues](https://github.com/krwg/cultiva/issues) — core runtime bugs
- [Cultiva Wiki Troubleshooting](https://github.com/krwg/cultiva/wiki/Troubleshooting)
