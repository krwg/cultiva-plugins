# GitHub Wiki — publish workflow

**Live wiki:** https://github.com/krwg/cultiva-plugins/wiki

Markdown source is maintained in **`docs/wiki/`** in this repository. Publish to GitHub Wiki when pages change.

**Current Cultiva requirement for new plugins:** **2.0.0 · Rowan** (PLE1 plugin engine).

---

## Publish

```bash
git clone https://github.com/krwg/cultiva-plugins.wiki.git
cd cultiva-plugins.wiki
cp /path/to/cultiva-plugins/docs/wiki/*.md .
git add -A && git commit -m "docs(wiki): sync from main" && git push
```

---

## Page map (`docs/wiki/`)

| File | Topic |
|------|--------|
| [Home.md](wiki/Home.md) | Registry overview |
| [Catalog.md](wiki/Catalog.md) | All 9 plugins, versions, permissions |
| [Registry-Spec.md](wiki/Registry-Spec.md) | `registry.json` schema, sha256 |
| [Publishing-a-Plugin.md](wiki/Publishing-a-Plugin.md) | Author workflow |
| [Plugin-Hardening.md](wiki/Plugin-Hardening.md) | Audit tracker |
| [Security.md](wiki/Security.md) | Integrity, sandbox |
| [Troubleshooting.md](wiki/Troubleshooting.md) | Install failures |
| [Contributing.md](wiki/Contributing.md) | PR checklist |
| [_Sidebar.md](wiki/_Sidebar.md) | Navigation |
| [_Footer.md](wiki/_Footer.md) | Footer |

---

## Related

| Resource | URL |
|----------|-----|
| **Pages landing** | https://krwg.github.io/cultiva-plugins/ |
| **Cultiva wiki** | https://github.com/krwg/cultiva/wiki |
| **Author guide** | [PLUGIN_AUTHOR_GUIDE.md](https://github.com/krwg/cultiva/blob/main/docs/PLUGIN_AUTHOR_GUIDE.md) |
| **registry.json** | [main/registry.json](https://github.com/krwg/cultiva-plugins/blob/main/registry.json) |

Do **not** duplicate wiki under other paths — `docs/wiki/` is the version-controlled source.
