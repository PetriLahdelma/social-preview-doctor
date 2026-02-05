const COMMON = {
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9",
    range: "bytes=0-1048576"
};
const AGENTS = {
    linkedin: "LinkedInBot/1.0 (+http://www.linkedin.com)",
    twitter: "Twitterbot/1.0",
    facebook: "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"
};
export function getHeaders(bot) {
    return {
        ...COMMON,
        "user-agent": AGENTS[bot]
    };
}
//# sourceMappingURL=headers.js.map