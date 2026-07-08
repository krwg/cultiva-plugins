# Security Policy

## Supported versions

| Registry / Cultiva | Supported |
|--------------------|-----------|
| Registry **3.0.0** + Cultiva **1.7.x** | Yes |
| Registry 2.x + Cultiva 1.1.x | Best effort |
| Older | No |

---

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

### Cultiva app or sandbox runtime

Report to the main Cultiva security policy:

**[github.com/krwg/cultiva/blob/main/SECURITY.md](https://github.com/krwg/cultiva/blob/main/SECURITY.md)**

Email: **shevotsukov@icloud.com**

### Official plugin in this registry

Email **shevotsukov@icloud.com** with:

- Plugin id and version
- Description and impact
- Steps to reproduce
- Affected Cultiva version(s)

You may also use the [Security alert template](https://github.com/krwg/cultiva-plugins/issues/new/choose) — maintainers will convert it to a private thread if needed.

### Third-party / custom registry plugins

Report to the plugin author or registry maintainer. Cultiva core is not responsible for unofficial registries.

---

## Scope

**In scope for this repo:**

- Malicious or vulnerable code in official plugin folders
- Incorrect or tampered `sha256` entries in `registry.json`
- Supply-chain issues in the published manifest / baseUrl chain

**Out of scope:**

- Bugs that are not security issues (use regular [bug reports](https://github.com/krwg/cultiva-plugins/issues/new/choose))
- Open-Meteo, SomaFM, or other third-party service availability
- Issues requiring physical access to an unlocked machine

---

## Response

We aim to acknowledge reports within **72 hours** and provide a status update within **14 days**.

Fixed plugin issues are released via updated registry versions and recomputed sha256 hashes.
