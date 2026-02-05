export default {
  name: "social-preview-doctor",
  tagline: "Debug OG/Twitter previews with real crawler headers.",
  value: "Emulate social bots to validate previews before they ship.",
  accent: "#0EA5E9",
  pills: ["Bot headers","Baseline diff","JSON output"],
  demo: ["$ social-preview-doctor https://example.com --bot twitter","Final URL: https://example.com/","OG:image: missing (warn)","Redirects: 1  Latency: 1.2s"],
  callout: "Run against URLs you trust. The crawler emulation follows redirects and reports missing tags.",
  quickstart: "npx social-preview-doctor https://example.com",
  hero: { width: 1600, height: 900 },
  icon: {
    inner: `
<rect x="112" y="152" width="288" height="208" rx="28" stroke="{{accent}}" stroke-width="{{stroke}}"/>
<line x1="112" y1="196" x2="400" y2="196" stroke="{{accent}}" stroke-width="{{stroke}}" stroke-linecap="round"/>
<circle cx="256" cy="272" r="52" stroke="{{accent}}" stroke-width="{{stroke}}"/>
<line x1="256" y1="220" x2="256" y2="324" stroke="{{accent}}" stroke-width="{{stroke}}" stroke-linecap="round"/>
<line x1="204" y1="272" x2="308" y2="272" stroke="{{accent}}" stroke-width="{{stroke}}" stroke-linecap="round"/>
`
  }
};
