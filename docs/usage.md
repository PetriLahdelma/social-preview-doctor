# Usage

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
