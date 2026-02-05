import * as cheerio from "cheerio";

function extractMeta(html) {
  const $ = cheerio.load(html);
  const meta = {};

  $("meta").each((_, el) => {
    const prop = $(el).attr("property") || $(el).attr("name");
    const content = $(el).attr("content");
    if (!prop || !content) return;
    const key = prop.toLowerCase();
    if (key.startsWith("og:") || key.startsWith("twitter:")) {
      meta[key] = content.trim();
    }
  });

  const title = $("title").first().text().trim();
  if (title && !meta["og:title"]) meta.title = title;

  const canonical = $("link[rel='canonical']").attr("href");
  if (canonical) meta.canonical = canonical;

  return meta;
}

export { extractMeta };
