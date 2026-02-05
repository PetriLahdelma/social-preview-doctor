# social-preview-doctor

Debug OG/Twitter previews with real crawler headers.

![CI](https://github.com/PetriLahdelma/social-preview-doctor/actions/workflows/ci.yml/badge.svg) ![Release](https://img.shields.io/github/v/release/PetriLahdelma/social-preview-doctor) ![License](https://img.shields.io/github/license/PetriLahdelma/social-preview-doctor) ![Stars](https://img.shields.io/github/stars/PetriLahdelma/social-preview-doctor)

![Hero](assets/hero.png?20260205)

## Quickstart

```bash
npx social-preview-doctor https://example.com
```

## Demo

```bash
social-preview-doctor https://example.com --json
```

## Why This Exists

Social crawlers are picky. This checks headers, redirects, and OG/Twitter tags in the same way they do.

## FAQ

- **Does it follow redirects?** Yes, up to `--max-redirects`.
- **Can it fail CI?** Yes, via baseline diffs.

## Contributing

See `CONTRIBUTING.md` for the workflow and tests.

## License

MIT
