import Parser from "rss-parser";
import OpenAI from "openai";
import { loadStateFromDisk, saveStateToDisk } from "./storage.js";

const parser = new Parser();
const listeners = new Set();

const FEEDS = [
  "https://openai.com/news/rss.xml",
  "https://blog.google/technology/ai/rss/",
  "https://www.anthropic.com/news/rss.xml",
  "https://deepmind.google/blog/rss.xml",
  "https://venturebeat.com/category/ai/feed/",
  "https://techcrunch.com/category/artificial-intelligence/feed/",
  "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
];

const FALLBACK_TOOLS = [
  {
    name: "Cursor",
    tagline: "AI native code editor",
    description: "Understands repository context and accelerates full-stack delivery.",
    category: "Code",
    badge: "HOT",
    pricing: "Freemium",
  },
  {
    name: "Perplexity Pro",
    tagline: "Research with cited answers",
    description: "Strong for fast research briefs and source-grounded summaries.",
    category: "Research",
    badge: "NEW",
    pricing: "$20/mo",
  },
  {
    name: "Runway",
    tagline: "AI video generation suite",
    description: "Text-to-video and editing workflows for creators and teams.",
    category: "Video",
    badge: "PRO",
    pricing: "Paid plans",
  },
];

let state = {
  updatedAt: new Date().toISOString(),
  toolsUpdatedAt: null,
  syncing: false,
  mode: "fallback",
  sources: [],
  ticker: ["Warming up live feeds..."],
  hero: {
    id: "seed",
    title: "Live AI newsroom preparing first sync",
    summary: "This feed will publish AI and tech updates continuously once sources are indexed.",
    category: "Industry",
    source: "Newral",
    publishedAt: new Date().toISOString(),
    readTime: "3 min read",
    link: "#",
  },
  stories: [],
  tools: FALLBACK_TOOLS,
};

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;
const anthropicKey = process.env.ANTHROPIC_API_KEY || "";

function emit() {
  for (const callback of listeners) callback(state);
}

async function persistState() {
  await saveStateToDisk(state);
}

export function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getState() {
  return state;
}

function classifyCategory(text = "") {
  const t = text.toLowerCase();
  if (t.includes("policy") || t.includes("regulat") || t.includes("act")) return "Policy";
  if (t.includes("launch") || t.includes("product") || t.includes("release")) return "Products";
  if (t.includes("research") || t.includes("paper") || t.includes("benchmark")) return "Research";
  return "Industry";
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = (item.link || item.title || "").toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function shortSummary(text = "") {
  const clean = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (clean.length < 210) return clean;
  return `${clean.slice(0, 205).trim()}...`;
}

async function summarizeStories(stories) {
  if (stories.length === 0) return stories;

  const prompt = [
    "Rewrite each story summary for a trusted AI news site.",
    "Use concise neutral language and avoid hype.",
    "Return strict JSON array only: [{id,summary,readTime}]",
    `Input stories: ${JSON.stringify(
      stories.map((s) => ({ id: s.id, title: s.title, summary: s.summary }))
    )}`,
  ].join("\n");

  const applyParsed = (parsed) => {
    const mapped = new Map(parsed.map((item) => [item.id, item]));
    return stories.map((story) => {
      const x = mapped.get(story.id);
      if (!x) return story;
      return {
        ...story,
        summary: x.summary || story.summary,
        readTime: x.readTime || story.readTime,
      };
    });
  };

  if (openaiClient) {
    try {
      const response = await openaiClient.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        input: prompt,
        temperature: 0.2,
      });
      const text = response.output_text?.trim();
      if (text) return applyParsed(JSON.parse(text));
    } catch (error) {
      console.error("OpenAI summary failed:", error.message);
    }
  }

  if (anthropicKey) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
          max_tokens: 1500,
          temperature: 0.2,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.find((x) => x.type === "text")?.text?.trim();
      if (text) return applyParsed(JSON.parse(text));
    } catch (error) {
      console.error("Anthropic summary failed:", error.message);
    }
  }

  return stories;
}

async function fetchToolsFromHN() {
  try {
    const url =
      "https://hn.algolia.com/api/v1/search_by_date?query=show%20hn%20ai&tags=story&hitsPerPage=20";
    const response = await fetch(url);
    const data = await response.json();
    const hits = (data.hits || []).slice(0, 8);
    const tools = hits.map((hit, index) => ({
      name: (hit.title || "AI Tool").replace(/^Show HN:\s*/i, "").slice(0, 40).trim(),
      tagline: "Emerging product launch",
      description: shortSummary(hit.story_text || hit.title || "New AI tool launch from community."),
      category: "Productivity",
      badge: index < 3 ? "HOT" : "NEW",
      pricing: "Check website",
    }));
    return dedupe(tools).slice(0, 6);
  } catch (error) {
    console.error("Tools fetch failed:", error.message);
    return FALLBACK_TOOLS;
  }
}

async function fetchFeedItems() {
  const now = Date.now();
  const cutoff = now - 72 * 60 * 60 * 1000;

  const collected = [];
  for (const feed of FEEDS) {
    try {
      const parsed = await parser.parseURL(feed);
      for (const item of parsed.items || []) {
        const date = new Date(item.isoDate || item.pubDate || now).getTime();
        if (date < cutoff) continue;
        const title = (item.title || "").trim();
        if (!title) continue;
        const summary = shortSummary(item.contentSnippet || item.content || title);
        collected.push({
          id: `${date}-${title}`.replace(/\s+/g, "-").slice(0, 64),
          title,
          summary,
          category: classifyCategory(`${title} ${summary}`),
          source: parsed.title || "AI Source",
          publishedAt: new Date(date).toISOString(),
          readTime: "4 min read",
          link: item.link || "#",
        });
      }
    } catch (error) {
      console.error(`Feed failed ${feed}:`, error.message);
    }
  }

  const stories = dedupe(collected)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 24);
  return summarizeStories(stories);
}

function buildTicker(stories) {
  return stories.slice(0, 8).map((story) => story.title);
}

function buildHero(stories) {
  return stories[0] || state.hero;
}

export async function refreshNewsOnly() {
  state = { ...state, syncing: true };
  emit();
  await persistState();

  const stories = await fetchFeedItems();
  if (stories.length === 0) {
    state = {
      ...state,
      syncing: false,
      updatedAt: new Date().toISOString(),
      mode: "fallback",
    };
    emit();
    await persistState();
    return;
  }

  state = {
    ...state,
    updatedAt: new Date().toISOString(),
    syncing: false,
    mode: openaiClient || anthropicKey ? "ai-curated" : "feed-only",
    stories,
    hero: buildHero(stories),
    ticker: buildTicker(stories),
    sources: FEEDS,
  };
  emit();
  await persistState();
}

export async function refreshNewsAndTools() {
  await refreshNewsOnly();
  const tools = await fetchToolsFromHN();
  state = {
    ...state,
    tools: tools.length ? tools : FALLBACK_TOOLS,
    toolsUpdatedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  emit();
  await persistState();
}

export async function refreshToolsIfDue() {
  const last = state.toolsUpdatedAt ? new Date(state.toolsUpdatedAt).getTime() : 0;
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - last < weekMs) return;
  const tools = await fetchToolsFromHN();
  state = {
    ...state,
    tools: tools.length ? tools : FALLBACK_TOOLS,
    toolsUpdatedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  emit();
  await persistState();
}

export async function initializeState() {
  const cached = await loadStateFromDisk();
  if (cached && typeof cached === "object") {
    state = {
      ...state,
      ...cached,
      syncing: false,
    };
    emit();
  }
  await refreshNewsAndTools();
}
