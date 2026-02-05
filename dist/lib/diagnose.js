function isAbsoluteUrl(value) {
    try {
        new URL(value);
        return true;
    }
    catch {
        return false;
    }
}
export function diagnose(meta, chain, finalHeaders, finalUrl) {
    const issues = [];
    const last = chain[chain.length - 1];
    if (!last || last.status >= 400) {
        issues.push({ level: "error", code: "bad-status", message: `Final status ${last?.status ?? "unknown"} is not OK.` });
    }
    const ct = finalHeaders["content-type"] || "";
    if (ct && !ct.includes("text/html")) {
        issues.push({ level: "error", code: "not-html", message: `Content-Type is '${ct}', not HTML.` });
    }
    if (!meta["og:title"] && !meta.title) {
        issues.push({ level: "warn", code: "missing-og-title", message: "Missing og:title (and no <title> fallback)." });
    }
    if (!meta["og:image"]) {
        issues.push({ level: "warn", code: "missing-og-image", message: "Missing og:image." });
    }
    if (meta["og:image"] && !isAbsoluteUrl(meta["og:image"])) {
        issues.push({ level: "warn", code: "relative-og-image", message: "og:image is not an absolute URL." });
    }
    if (!meta["twitter:card"]) {
        issues.push({ level: "info", code: "missing-twitter-card", message: "Missing twitter:card." });
    }
    const robots = (finalHeaders["x-robots-tag"] || "").toLowerCase();
    if (robots.includes("noindex") || robots.includes("nofollow")) {
        issues.push({ level: "warn", code: "robots-block", message: "x-robots-tag may block previews." });
    }
    const cc = (finalHeaders["cache-control"] || "").toLowerCase();
    if (cc.includes("no-store") || cc.includes("no-cache")) {
        issues.push({ level: "info", code: "cache-disabled", message: "Cache-Control suggests previews may be uncached." });
    }
    if (!finalUrl.startsWith("https://")) {
        issues.push({ level: "info", code: "not-https", message: "Final URL is not HTTPS." });
    }
    return issues;
}
//# sourceMappingURL=diagnose.js.map