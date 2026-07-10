# Security

## Model

| Layer | Protection |
|-------|------------|
| **registry.json** | sha256 per file; mismatch aborts install |
| **HTTPS** | Downloads only from GitHub raw/objects |
| **Sandbox** | Opaque iframe; no Node/Electron in plugin code |
| **Permissions** | `network`, `storage`, `ui` enforced at RPC |
| **Path guards** | Plugin id and relative paths validated on disk |

---

## Supported versions

| Registry | Cultiva | Support |
|----------|---------|---------|
| **3.0.2** | 1.7.x | Yes |
| 3.0.x | 1.7.x | Yes |
| 2.x | 1.1.x | Best effort |

---

## Reporting

**Do not** open public issues for vulnerabilities.

| Target | Contact |
|--------|---------|
| Cultiva sandbox / install pipeline | [cultiva SECURITY.md](https://github.com/krwg/cultiva/blob/main/SECURITY.md) |
| Official plugin in this registry | shevotsukov@icloud.com |
| Third-party registry | Plugin author |

---

## Maintainer duties

After any plugin file change:

```bash
node scripts/compute-registry-sha256.mjs
git add registry.json && git commit
```

Never merge PRs with missing or stale hashes.

---

## User guidance

Install only from this official registry unless you audit third-party code. Cultiva cannot vouch for unofficial `registry.json` URLs.
