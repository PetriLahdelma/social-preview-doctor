**A) Positioning**
Hooks:
- Fix broken OG previews before you post.
- Debug social previews with real crawler headers.
- See exactly what Twitter and OG bots see.
- Catch redirect and header issues fast.
- Social previews without guesswork.
Tagline: Debug OG/Twitter previews with real crawler headers.
One-breath: social-preview-doctor emulates social crawlers to check headers, redirects, and OG/Twitter tags, with JSON output for CI.
Use-cases:
- Verify OG tags on a marketing page.
- Check redirect chains that break previews.
- Baseline preview metadata for CI diffs.
Differentiator: Emulates social crawler headers instead of a generic fetch.

**B) Repo Structure**
Recommended minimal tree additions:
- `buzz-kit/` for launch assets and copy.
- `assets/` for hero and demo captures.
- `examples/` for sample URLs and expected outputs.
Try in 10 seconds command flow:
1. Run `npx social-preview-doctor https://example.com`.
2. Review headers, redirects, and parsed OG/Twitter tags.
Trust & safety notes:
- Makes HTTP requests to target URLs.
- Run against URLs you trust.

**C) README**
Above-the-fold block inserted:
````md
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
````
Outline recommendations:
- Why this exists
- Quickstart
- Output formats and JSON
- Redirect handling
- CI baseline diffs
- FAQ
- Contributing
- License

**D) Viral Artifacts**
Demo scenarios:
- Debug a page missing `og:image`.
- Show a redirect chain that breaks preview rendering.
- Baseline JSON diff in CI.
What to record and framing:
- Terminal run plus JSON output.
- 15 to 20 seconds for the short, 45 to 60 seconds for the long.
- Frame as "see what social bots see".
15 to 20 second script:
- "Social previews are picky. Here's what bots actually see." 
- Run `npx social-preview-doctor https://example.com`.
- "It shows headers, redirects, and OG/Twitter tags." 
45 to 60 second script:
- "This CLI emulates social crawler headers." 
- "It checks redirects, headers, and OG/Twitter metadata." 
- Run the command and show output.
- "You can output JSON and diff in CI." 
Captions:
- "See what social bots see."
- "Fix OG previews fast."
- "Debug social previews with real crawler headers." 

**E) Distribution Plan**
Targets:
- r/webdev
- r/marketing
- r/SEO
- r/frontend
- r/opensource
- r/devops
- Hacker News Show HN
- Lobsters
- Indie Hackers
- dev.to
- Awesome SEO list
- Awesome Web Tools list
Day 1 launch package:
- Reddit post: "I built social-preview-doctor to debug OG/Twitter previews with real crawler headers. It checks headers, redirects, and tags, and can output JSON for CI baselines. Quickstart: `npx social-preview-doctor https://example.com`. Feedback welcome."
- HN Show: "Show HN: social-preview-doctor — debug OG/Twitter previews with real crawler headers"
- X thread line 1: "1/ Social previews are picky."
- X thread line 2: "2/ social-preview-doctor shows what bots actually see." 
- X thread line 3: "3/ It checks headers, redirects, and OG/Twitter tags." 
- X thread line 4: "4/ Try: `npx social-preview-doctor https://example.com`" 
- X thread line 5: "5/ Repo: PetriLahdelma/social-preview-doctor" 
- LinkedIn post: "Just shipped social-preview-doctor, a CLI that emulates social crawler headers to debug OG/Twitter previews. It checks headers, redirects, and tags, and supports JSON output for CI. Quickstart: `npx social-preview-doctor https://example.com`."
2-week cadence plan:
- Day 1: Launch posts + demo short.
- Day 3: Share a redirect-chain example.
- Day 5: Post a JSON output snippet.
- Day 7: Share a CI baseline diff clip.
- Day 10: Post FAQ on tags.
- Day 14: Recap and ask for feature requests.

**F) Curator Outreach**
Press-kit contents:
- `press-kit/one-pager.md`
- `press-kit/demo-script-15s.md`
- `press-kit/demo-script-60s.md`
- `press-kit/screenshots-plan.md`
- `posts/reddit.md`
- `posts/hn.md`
- `posts/x-thread.md`
- `posts/linkedin.md`
- `checklist-14-days.md`
120-word email pitch:
"Hi [Name], I built social-preview-doctor, a CLI that emulates social crawler headers to debug OG/Twitter previews. It checks redirects, headers, and metadata the same way social bots do and can output JSON for CI baseline diffs. The goal is to make broken social previews obvious before a launch. If your readers care about web tooling, marketing tech, or SEO, this could be a useful feature. Happy to share a short demo clip or sample output."
280-char DM pitch:
"Built social-preview-doctor: emulates social crawler headers to debug OG/Twitter previews. Checks redirects and tags, outputs JSON for CI. Try: `npx social-preview-doctor https://example.com`."
Follow-ups:
- "Quick bump in case you missed this. Happy to send a 15s demo clip or example output."
- "If this is not a fit, who else covers web tooling or SEO dev tools?"
Search queries:
- "SEO tooling newsletter"
- "web tooling roundup"
- "marketing tech newsletter"
- "frontend tools weekly"
- "social preview debugging"
- "awesome SEO list"
- "web dev tools YouTube"
- "developer relations marketing"
- "OG tags tooling"
- "social media metadata tools"

**G) Execution Checklist**
Day 0: Prepare a few URLs with known OG issues.
Day 1: Launch posts and 15s demo clip.
Day 2: Share redirect-chain example.
Day 3: Post JSON output snippet.
Day 4: Share a header comparison example.
Day 5: Post CI baseline diff example.
Day 6: Ask for tag edge cases.
Day 7: Publish 60s walkthrough.
Day 8: Share a second demo URL.
Day 9: Post FAQ and troubleshooting.
Day 10: Ask for integrations.
Day 11: Recap early feedback.
Day 12: Ship a minor update if needed.
Day 13: Share a user example.
Day 14: Publish roadmap and contribution requests.
Metrics to track:
- GitHub stars and clones
- NPM installs
- Demo views and completion rate
- Issues opened and feature requests
What to fix if momentum stalls:
- Show the OG tag output in the first 5 seconds.
- Add a clear example of a broken preview and the fix.
- Clarify redirect handling in the README.
