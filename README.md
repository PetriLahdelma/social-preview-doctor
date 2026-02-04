# social-preview-doctor

Debug Open Graph and Twitter card previews before the bots do.

Tagline: Diagnose broken social previews with real crawler headers.

## Quickstart
```bash
npx social-preview-doctor https://example.com
```

## Demo
```bash
social-preview-doctor https://example.com --user-agent linkedin
```
Expected output (trimmed):
```
final: 200 https://example.com
og:title: Example Domain
og:image: https://example.com/og.png
issues: 1 warning, 0 errors
```

## Screenshots
Placeholder: add screenshots in `docs/` and link them here.

## What it does
- Emulates LinkedIn, Twitter, and Facebook crawlers with realistic headers
- Shows redirect chain and key cache headers
- Parses OG/Twitter tags and canonical/title
- Diagnoses common reasons previews break
- Supports JSON output and baseline diffs for CI

## CLI
```bash
social-preview-doctor <url> [options]
```
Options:
- `--user-agent <linkedin|twitter|facebook>`
- `--json`
- `--baseline <path>` (default: `og-baseline.json`)
- `--update-baseline`
- `--max-redirects <n>`
- `--timeout <ms>`

## Baseline diff (CI friendly)
```bash
# Create or update baseline
social-preview-doctor https://example.com --baseline og-baseline.json --update-baseline

# Compare against baseline and fail on diffs
social-preview-doctor https://example.com --baseline og-baseline.json
```

## GitHub Action wrapper (optional)
This repo includes a composite action. In your workflow, check out your repo first, then run:
```yaml
- uses: PetriLahdelma/social-preview-doctor@v0
  with:
    url: https://example.com
    baseline: og-baseline.json
```

## Manual publish steps (optional)
```bash
npm login
npm publish --access public
```
If the name is taken, consider scoped naming like `@petri-lahdelma/social-preview-doctor`.

## License
MIT
