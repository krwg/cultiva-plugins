# Contributing

---

## What we accept

| Change | Repo |
|--------|------|
| New official plugins | **cultiva-plugins** (PR) |
| Plugin bug fixes | **cultiva-plugins** |
| Registry / sha256 updates | **cultiva-plugins** |
| Core runtime / sandbox | **cultiva** |
| Docs site (`docs/index.html`) | **cultiva-plugins** |

---

## PR checklist

- [ ] Plugin tested on Cultiva **1.7.0**
- [ ] `manifest.json` version bumped
- [ ] Registry entry updated
- [ ] `node scripts/compute-registry-sha256.mjs` run
- [ ] No emoji in plugin UI code (letter placeholders in catalog)
- [ ] Permissions match actual API usage
- [ ] Description in PR explains user-visible behavior

---

## Labels

| Label | Use |
|-------|-----|
| `bug` | Broken behavior |
| `enhancement` | New feature |
| `documentation` | Docs/wiki only |
| `good first issue` | Small, scoped tasks |

---

## Milestone

Active work: **1.7 Linden · Plugin Hardening**

See [GitHub Issues](https://github.com/krwg/cultiva-plugins/issues) for open tasks.

---

## License

Contributions to this registry are **MIT**.

Plugins you publish remain your code — ensure license compatibility with bundled assets (e.g. city data, stream URLs).
