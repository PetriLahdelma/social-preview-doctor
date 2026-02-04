#!/usr/bin/env node
import fs from "node:fs";
import { getHeaders } from "./lib/headers.js";
import { extractMeta } from "./lib/parse.js";
import { diagnose } from "./lib/diagnose.js";
import { BotName, FetchHop } from "./lib/types.js";

type Options = {
  url?: string;
  json: boolean;
  baseline?: string;
  updateBaseline: boolean;
  bot: BotName;
  maxRedirects: number;
  timeoutMs: number;
};

function parseArgs(argv: string[]): Options {
  const opts: Options = {
    json: false,
    updateBaseline: false,
    bot: "linkedin",
    maxRedirects: 5,
    timeoutMs: 15000
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a) continue;
    if (!a.startsWith("--") && !opts.url) {
      opts.url = a;
      continue;
    }
    switch (a) {
      case "--json":
        opts.json = true;
        break;
      case "--baseline":
        opts.baseline = argv[++i];
        break;
      case "--update-baseline":
        opts.updateBaseline = true;
        break;
      case "--user-agent":
        opts.bot = (argv[++i] as BotName) || opts.bot;
        break;
      case "--max-redirects":
        opts.maxRedirects = Number(argv[++i] || opts.maxRedirects);
        break;
      case "--timeout":
        opts.timeoutMs = Number(argv[++i] || opts.timeoutMs);
        break;
      case "--help":
        printHelp();
        process.exit(0);
      default:
        break;
    }
  }

  return opts;
}

function printHelp(): void {
  console.log("social-preview-doctor <url> [options]\n");
  console.log("--user-agent <linkedin|twitter|facebook>");
  console.log("--json");
  console.log("--baseline <path>");
  console.log("--update-baseline");
  console.log("--max-redirects <n>");
  console.log("--timeout <ms>");
}

function pickHeaders(headers: Headers, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = headers.get(k);
    if (v) out[k] = v;
  }
  return out;
}

async function fetchChain(url: string, headers: Record<string, string>, maxRedirects: number, timeoutMs: number) {
  const chain: FetchHop[] = [];
  let current = url;
  for (let i = 0; i <= maxRedirects; i++) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(current, { headers, redirect: "manual", signal: controller.signal });
    clearTimeout(t);

    const location = res.headers.get("location") || undefined;
    const hop: FetchHop = {
      url: current,
      status: res.status,
      location,
      headers: pickHeaders(res.headers, [
        "cache-control",
        "etag",
        "last-modified",
        "expires",
        "age",
        "x-cache",
        "content-type",
        "x-robots-tag"
      ])
    };
    chain.push(hop);

    if (res.status >= 300 && res.status < 400 && location) {
      current = new URL(location, current).toString();
      continue;
    }

    const contentType = res.headers.get("content-type") || "";
    const html = contentType.includes("text/html") ? await res.text() : "";
    return { chain, finalUrl: current, html, headers: hop.headers };
  }

  return { chain, finalUrl: current, html: "", headers: {} };
}

function diffBaseline(current: any, baseline: any): string[] {
  const diffs: string[] = [];
  const keys = new Set([...Object.keys(current.meta || {}), ...Object.keys(baseline.meta || {})]);
  for (const k of keys) {
    const a = current.meta?.[k];
    const b = baseline.meta?.[k];
    if (a !== b) diffs.push(`${k}: '${b ?? ""}' -> '${a ?? ""}'`);
  }
  if (current.finalUrl !== baseline.finalUrl) {
    diffs.push(`finalUrl: '${baseline.finalUrl ?? ""}' -> '${current.finalUrl ?? ""}'`);
  }
  return diffs;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.url) {
    printHelp();
    process.exit(1);
  }

  const headers = getHeaders(opts.bot);
  const started = Date.now();
  const { chain, finalUrl, html, headers: finalHeaders } = await fetchChain(
    opts.url,
    headers,
    opts.maxRedirects,
    opts.timeoutMs
  );

  const meta = html ? extractMeta(html) : {};
  const diagnostics = diagnose(meta, chain, finalHeaders, finalUrl);
  const output = {
    url: opts.url,
    finalUrl,
    chain,
    meta,
    cache: finalHeaders,
    diagnostics,
    ms: Date.now() - started
  };

  const baselinePath = opts.baseline || "og-baseline.json";

  if (opts.updateBaseline) {
    fs.writeFileSync(baselinePath, JSON.stringify({ finalUrl, meta }, null, 2));
    console.log(`baseline updated: ${baselinePath}`);
    return;
  }

  if (opts.baseline && fs.existsSync(baselinePath)) {
    const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
    const diffs = diffBaseline({ finalUrl, meta }, baseline);
    if (diffs.length) {
      console.error(`baseline diff (${diffs.length}):`);
      for (const d of diffs) console.error(`- ${d}`);
      process.exit(2);
    }
  }

  if (opts.json) {
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  const last = chain[chain.length - 1];
  console.log(`final: ${last?.status ?? "?"} ${finalUrl}`);
  for (const [k, v] of Object.entries(meta)) {
    console.log(`${k}: ${v}`);
  }
  const warns = diagnostics.filter(d => d.level === "warn").length;
  const errs = diagnostics.filter(d => d.level === "error").length;
  console.log(`issues: ${warns} warning(s), ${errs} error(s)`);
}

main().catch(err => {
  console.error(err?.message || err);
  process.exit(1);
});
