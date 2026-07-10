# Contributing

Canonical: **[CONTRIBUTING.md](https://github.com/krwg/cultiva-plugins/blob/main/CONTRIBUTING.md)**

## PR checklist (summary)

- [ ] Tested on Cultiva **≥ 1.7.0**
- [ ] `manifest.json` version = registry entry version
- [ ] `node scripts/compute-registry-sha256.mjs` run
- [ ] All `sha256` files exist on disk
- [ ] Permissions match code
- [ ] No secrets in source

## Where to send changes

| Change | Repo |
|--------|------|
| Plugin source / registry | cultiva-plugins |
| Cultiva sandbox / installer | cultiva |

## Wiki

Edit `docs/wiki/` here, then publish to GitHub Wiki per [WIKI.md](https://github.com/krwg/cultiva-plugins/blob/main/docs/WIKI.md).
