# Troubleshooting

- **Unsupported bot**: Use `--bot linkedin|twitter|facebook`.
- **No HTML**: Ensure the final response is `text/html`.
- **Baseline diff**: Re-run with `--update-baseline` to refresh expected values.
- **Timeouts**: Increase `--timeout` for slow pages.
- **Redirect loops**: Reduce `--max-redirects` or fix the target URL.
