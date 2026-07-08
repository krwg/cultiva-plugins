# GitHub Wiki — publish workflow

**Live wiki:** https://github.com/krwg/cultiva-plugins/wiki

Markdown for this wiki is edited via the separate git repo:

```bash
git clone https://github.com/krwg/cultiva-plugins.wiki.git
cd cultiva-plugins.wiki
# edit Home.md, Catalog.md, …
git add -A && git commit -m "docs(wiki): …" && git push
```

Wiki links use `Page-Name` format (spaces → hyphens).

---

## Page map

| File | Topic |
|------|--------|
| `Home.md` | Landing |
| `Plugin-Hardening.md` | Audit, milestone, issues #2–#10 |
| `Catalog.md` | All 6 plugins, status, permissions |
| `Registry-Spec.md` | `registry.json` schema, sha256 |
| `Publishing-a-Plugin.md` | Author workflow |
| `Security.md` | Integrity, sandbox |
| `Troubleshooting.md` | Install failures, workarounds |
| `Contributing.md` | PR checklist |
| `_Sidebar.md` | Navigation |
| `_Footer.md` | Footer links |

---

## Related docs

| Resource | URL |
|----------|-----|
| **Docs site (Pages)** | https://krwg.github.io/cultiva-plugins/ |
| **Cultiva wiki** | https://github.com/krwg/cultiva/wiki |
| **Author guide (cultiva repo)** | [PLUGIN_AUTHOR_GUIDE.md](https://github.com/krwg/cultiva/blob/main/docs/PLUGIN_AUTHOR_GUIDE.md) |

Do **not** duplicate wiki content under `docs/wiki/` in this repo — GitHub Wiki is canonical.
