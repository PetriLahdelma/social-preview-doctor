import assert from "node:assert/strict";
import { diagnose } from "../dist/lib/diagnose.js";

const okMeta = {
  "og:title": "Example",
  "og:image": "https://example.com/og.png",
  "twitter:card": "summary_large_image"
};

const okChain = [
  {
    url: "https://example.com",
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=600"
    }
  }
];

const okIssues = diagnose(okMeta, okChain, okChain[0].headers, "https://example.com");
assert.equal(okIssues.length, 0);

const badIssues = diagnose(
  { "og:image": "/relative.png" },
  [{ url: "http://example.com", status: 404, headers: { "content-type": "application/json", "x-robots-tag": "noindex" } }],
  { "content-type": "application/json", "x-robots-tag": "noindex", "cache-control": "no-cache" },
  "http://example.com"
);

assert.ok(badIssues.some(i => i.code === "bad-status"));
assert.ok(badIssues.some(i => i.code === "not-html"));
assert.ok(badIssues.some(i => i.code === "missing-og-title"));
assert.ok(badIssues.some(i => i.code === "relative-og-image"));
assert.ok(badIssues.some(i => i.code === "missing-twitter-card"));
assert.ok(badIssues.some(i => i.code === "robots-block"));
assert.ok(badIssues.some(i => i.code === "cache-disabled"));
assert.ok(badIssues.some(i => i.code === "not-https"));

console.log("diagnose.test.js ok");
