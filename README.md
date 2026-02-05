# social-preview-doctor
Debug OG/Twitter previews with real crawler headers.

- Emulates social crawler headers to inspect OG and Twitter tags.
- Checks headers and redirects the way social bots do.
- Supports JSON output and baseline diffs for CI.

**Try in 10 seconds**
```bash
npx social-preview-doctor https://example.com
```

**Demo**
Record a run that shows parsed OG/Twitter tags and redirect chain.

**Trust & safety**
This tool makes HTTP requests to the target URL. Run it against URLs you trust.

Star if this saves you time.  
→ Buzz Kit: /buzz-kit

![CI](https://github.com/PetriLahdelma/social-preview-doctor/actions/workflows/ci.yml/badge.svg) ![Release](https://img.shields.io/github/v/release/PetriLahdelma/social-preview-doctor) ![License](https://img.shields.io/github/license/PetriLahdelma/social-preview-doctor) ![Stars](https://img.shields.io/github/stars/PetriLahdelma/social-preview-doctor)

![Hero](assets/hero.png?20260205)

## Requirements

- Node.js 20+
- Network access to the target URL

## Quickstart

```bash
npx social-preview-doctor https://example.com
```

## Usage

```bash
social-preview-doctor https://example.com
social-preview-doctor https://example.com --bot twitter --json
social-preview-doctor https://example.com --baseline og-baseline.json --update-baseline
```

**Options**

- `--bot <linkedin|twitter|facebook>` Bot user-agent preset (default `linkedin`).
- `--json` Emit machine-readable JSON.
- `--baseline <path>` Compare current metadata to a baseline JSON file.
- `--update-baseline` Write baseline JSON and exit.
- `--max-redirects <n>` Max redirect hops (default `5`).
- `--timeout <ms>` Request timeout in ms (default `15000`).

## GitHub Action

```yaml
- uses: PetriLahdelma/social-preview-doctor@v0
  with:
    url: https://example.com
    user_agent: twitter
    json: "true"
```

## Demo

```bash
social-preview-doctor https://example.com --json
```

## Why This Exists

Social crawlers are picky. This checks headers, redirects, and OG/Twitter tags in the same way they do.

## JSON Output

```json
{
  "url": "https://example.com",
  "finalUrl": "https://example.com/",
  "chain": [
    { "url": "https://example.com", "status": 301, "location": "https://example.com/" }
  ],
  "meta": { "og:title": "Example" },
  "cache": { "content-type": "text/html; charset=UTF-8" },
  "diagnostics": [{ "level": "warn", "code": "missing-og-image", "message": "Missing og:image" }],
  "ms": 1234
}
```

## Exit Codes

- `0` Success
- `1` Runtime/config error
- `2` Baseline diff detected

## Troubleshooting

- **Unsupported bot**: Use `--bot linkedin|twitter|facebook`.
- **No HTML**: Ensure the final response is `text/html`.
- **Baseline diff**: Re-run with `--update-baseline` to refresh expected values.
- **Timeouts**: Increase `--timeout` for slow pages.
- **Redirect loops**: Reduce `--max-redirects` or fix the target URL.

## FAQ

- **Does it follow redirects?** Yes, up to `--max-redirects`.
- **Can it fail CI?** Yes, via baseline diffs.

## Contributing

See `CONTRIBUTING.md` for the workflow and tests.

## License

MIT
