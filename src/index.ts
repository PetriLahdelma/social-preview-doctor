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
  help: boolean;
};

const BOT_NAMES: BotName[] = ["linkedin", "twitter", "facebook"];

const HELP_TEXT = `
social-preview-doctor <url> [options]

Options:
  --bot <linkedin|twitter|facebook>  User agent preset (default: linkedin)
  --json                             Emit machine-readable JSON
  --baseline <path>                  Compare against baseline JSON
  --update-baseline                  Write baseline JSON and exit
  --max-redirects <n>                Max redirect hops (default: 5)
  --timeout <ms>                     Request timeout in ms (default: 15000)
  -h, --help                         Show help

Exit codes:
  0 success
  1 runtime/config error
  2 baseline diff detected
`.trim();

function printHelp(): void {
  console.log(HELP_TEXT);
}

function isBotName(value: string): value is BotName {
  return BOT_NAMES.includes(value as BotName);
}

function parseArgs(argv: string[]): Options {
  const opts: Options = {
    json: false,
    updateBaseline: false,
    bot: "linkedin",
    maxRedirects: 5,
    timeoutMs: 15000,
    help: false
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a) continue;
    if (!a.startsWith("--") && !opts.url) {
      opts.url = a;
      continue;
    }
    switch (a) {
      case "--help":
      case "-h":
        opts.help = true;
        break;
      case "--json":
        opts.json = true;
        break;
      case "--baseline":
        opts.baseline = argv[++i];
        if (!opts.baseline) throw new Error("Missing value for --baseline");
        break;
      case "--update-baseline":
        opts.updateBaseline = true;
        break;
      case "--user-agent":
      case "--bot": {
        const value = argv[++i];
        if (!value) throw new Error("Missing value for --bot");
        if (!isBotName(value)) {
          throw new Error(`Unsupported bot: ${value}`);
        }
        opts.bot = value;
        break;
      }
      case "--max-redirects": {
        const value = argv[++i];
        if (!value) throw new Error("Missing value for --max-redirects");
        const num = Number(value);
        if (!Number.isFinite(num) || num < 0) throw new Error("--max-redirects must be >= 0");
        opts.maxRedirects = num;
        break;
      }
      case "--timeout": {
        const value = argv[++i];
        if (!value) throw new Error("Missing value for --timeout");
        const num = Number(value);
        if (!Number.isFinite(num) || num <= 0) throw new Error("--timeout must be > 0");
        opts.timeoutMs = num;
        break;
      }
      default:
        if (a.startsWith("--")) {
          throw new Error(`Unknown option: ${a}`);
        }
    }
  }

  return opts;
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
  let opts: Options;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    printHelp();
    process.exit(1);
    return;
  }

  if (opts.help) {
    printHelp();
    return;
  }

  if (!opts.url) {
    printHelp();
    process.exit(1);
    return;
  }

  const url = opts.url;
  const headers = getHeaders(opts.bot);
  const started = Date.now();
  const { chain, finalUrl, html, headers: finalHeaders } = await fetchChain(
    url,
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
