**Overview**
social-preview-doctor debugs OG/Twitter previews using real crawler headers.

**Problem**
Social previews break because headers, redirects, or tags are wrong.

**What It Does**
- Emulates social crawler headers.
- Reports redirects, headers, and OG/Twitter tags.
- Outputs JSON for CI baseline diffs.

**Quickstart**
```bash
npx social-preview-doctor https://example.com
```

**Who It Is For**
Frontend and marketing teams who need reliable social previews.

**Trust & Safety**
Makes HTTP requests to target URLs. Run against URLs you trust.

**Repo**
PetriLahdelma/social-preview-doctor
