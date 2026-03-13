import fs from "fs/promises";
import path from "path";
import Parser from "rss-parser";
import OpenAI from "openai";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "public", "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "content.json");

const parser = new Parser();
const REQUEST_TIMEOUT_MS = 12000;

const FEEDS = [
  "https://openai.com/news/rss.xml",
  "https://blog.google/technology/ai/rss/",
  "https://www.anthropic.com/news/rss.xml",
  "https://deepmind.google/blog/rss.xml",
  "https://venturebeat.com/category/ai/feed/",
  "https://techcrunch.com/category/artificial-intelligence/feed/",
  "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
];

const FALLBACK = {
  updatedAt: new Date().toISOString(),
  mode: "static-fallback",
  statusNote: "Static build is using fallback content.",
  ticker: [
    "AI coverage will refresh automatically when GitHub Actions runs.",
    "Weekly tools are curated into the static site build.",
  ],
  hero: {
    id: "seed",
    title: "Newral is ready for free GitHub Pages deployment",
    summary:
      "This build publishes AI and emerging tech updates as static content so the site can stay free to host.",
    category: "Industry",
    source: "Newral Editorial",
    publishedAt: new Date().toISOString(),
    readTime: "3 min read",
    link: "https://github.com/PranavBoggavarapu/newral-ai-news",
  },
  stories: [],
  tools: [
    {
      name: "Cursor",
      tagline: "AI native code editor",
      description: "Understands repository context and accelerates developer workflows.",
      category: "Code",
      badge: "HOT",
      pricing: "Freemium",
    },
    {
      name: "Perplexity Pro",
      tagline: "Research with cited answers",
      description: "Useful for fast research briefs and source-backed answers.",
      category: "Research",
      badge: "NEW",
      pricing: "$20/mo",
    },
  ],
};

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function classifyCategory(text = "") {
  const t = text.toLowerCase();
  if (t.includes("policy") || t.includes("regulat") || t.includes("act")) return "Policy";
  if (t.includes("launch") || t.includes("product") || t.includes("release")) return "Products";
  if (t.includes("research") || t.includes("paper") || t.includes("benchmark")) return "Research";
  return "Industry";
}

function shortSummary(text = "") {
  const clean = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (clean.length < 220) return clean;
  return `${clean.slice(0, 215).trim()}...`;
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.title || ""}::${item.link || ""}`.toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchToolsFromHn() {
  try {
    const response = await fetchWithTimeout(
      "https://hn.algolia.com/api/v1/search_by_date?query=show%20hn%20ai&tags=story&hitsPerPage=12"
    );
    const data = await response.json();
    return (data.hits || []).slice(0, 6).map((hit, index) => ({
      name: (hit.title || "AI Tool").replace(/^Show HN:\s*/i, "").slice(0, 42).trim(),
      tagline: "Emerging AI product launch",
      description: shortSummary(hit.story_text || hit.title || "New AI tool launch."),
      category: "Productivity",
      badge: index < 3 ? "HOT" : "NEW",
      pricing: "Check website",
    }));
  } catch {
    return FALLBACK.tools;
  }
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function rewriteSummaries(stories) {
  if (!openaiClient || stories.length === 0) return stories;

  const prompt = [
    "Rewrite the following AI news summaries in concise, trustworthy newsroom style.",
    "Return strict JSON array only: [{id,summary,readTime}]",
    JSON.stringify(stories.map((story) => ({
      id: story.id,
      title: story.title,
      summary: story.summary,
    }))),
  ].join("\n");

  try {
    const response = await openaiClient.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: prompt,
      temperature: 0.2,
    });
    const text = response.output_text?.trim();
    if (!text) return stories;
    const rewritten = new Map(JSON.parse(text).map((item) => [item.id, item]));
    return stories.map((story) => ({
      ...story,
      summary: rewritten.get(story.id)?.summary || story.summary,
      readTime: rewritten.get(story.id)?.readTime || story.readTime,
    }));
  } catch {
    return stories;
  }
}

async function fetchStories() {
  const cutoff = Date.now() - 72 * 60 * 60 * 1000;
  const stories = [];

  for (const feed of FEEDS) {
    try {
      const response = await fetchWithTimeout(feed);
      const xml = await response.text();
      const parsed = await parser.parseString(xml);
      for (const item of parsed.items || []) {
        const publishedAt = new Date(item.isoDate || item.pubDate || Date.now()).getTime();
        if (publishedAt < cutoff) continue;
        const title = (item.title || "").trim();
        if (!title) continue;
        const summary = shortSummary(item.contentSnippet || item.content || title);
        stories.push({
          id: `${publishedAt}-${title}`.replace(/\s+/g, "-").slice(0, 70),
          title,
          summary,
          category: classifyCategory(`${title} ${summary}`),
          source: parsed.title || "AI Source",
          publishedAt: new Date(publishedAt).toISOString(),
          readTime: "4 min read",
          link: item.link || "#",
        });
      }
    } catch {
      // Ignore individual feed failures and keep building from the remaining feeds.
    }
  }

  const curated = dedupe(stories)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 18);

  return rewriteSummaries(curated);
}

async function main() {
  const stories = await fetchStories();
  const tools = await fetchToolsFromHn();

  const content = stories.length
    ? {
        updatedAt: new Date().toISOString(),
        mode: openaiClient ? "static-ai-curated" : "static-feed-curated",
        statusNote: "Published by GitHub Actions on a free schedule.",
        ticker: stories.slice(0, 8).map((story) => story.title),
        hero: stories[0],
        stories,
        tools,
      }
    : FALLBACK;

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(content, null, 2), "utf-8");
  console.log(`Wrote ${OUTPUT_FILE}`);
}

main().catch(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(FALLBACK, null, 2), "utf-8");
  process.exit(0);
});
