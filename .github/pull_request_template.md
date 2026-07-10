## Summary

<!-- What changed and why (registry version bump, plugin fix, new plugin, docs only)? -->

## Type

- [ ] Bug fix (existing plugin)
- [ ] New plugin
- [ ] Registry / sha256 update
- [ ] Documentation / wiki / Pages only
- [ ] Other

## Plugin(s) affected

<!-- e.g. weather, pomodoro — or "none" for docs-only -->

## Checklist

- [ ] Tested install on Cultiva **≥ 1.7.0** (fork registry URL or local build)
- [ ] `manifest.json` version matches registry entry
- [ ] Ran `node scripts/compute-registry-sha256.mjs` and committed `registry.json`
- [ ] All files in `sha256` map exist and are listed in manifest (`entry`, `styles`, `data`)
- [ ] Permissions in manifest match actual API usage
- [ ] No secrets or API keys in plugin source
- [ ] Screenshots attached if UI changed (optional but helpful)

## Registry version

<!-- If bumping registry `version` in registry.json, note old → new -->

**Before:** `3.0.1` → **After:** `<!-- e.g. 3.0.2 -->`
