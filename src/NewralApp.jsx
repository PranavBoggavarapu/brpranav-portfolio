import { useEffect, useMemo, useState } from "react";

const CATEGORIES = ["All", "Research", "Industry", "Products", "Policy"];

const FALLBACK = {
  updatedAt: new Date().toISOString(),
  ticker: [
    "Live AI desk is warming up. Pulling the latest sources now.",
    "Weekly tools section refreshes automatically each Monday.",
  ],
  hero: {
    id: "hero-1",
    title: "Building a trusted AI newsroom with model-powered curation",
    summary:
      "Newral aggregates top AI and emerging tech sources, then restructures them into concise, readable coverage for a modern audience.",
    category: "Research",
    source: "Newral Editorial",
    publishedAt: new Date().toISOString(),
    readTime: "5 min read",
    link: "#",
  },
  stories: [],
  tools: [],
};

function timeAgo(isoDate) {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMins = Math.max(1, Math.floor((now - then) / 60000));
  if (diffMins < 60) return `${diffMins}m ago`;
  const hours = Math.floor(diffMins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NewralApp() {
  const [theme, setTheme] = useState(() => localStorage.getItem("newral-theme") || "dark");
  const [category, setCategory] = useState("All");
  const [payload, setPayload] = useState(FALLBACK);
  const [status, setStatus] = useState({ syncing: false, mode: "fallback" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("newral-theme", theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        setLoading(true);
        const [newsRes, toolsRes, statusRes] = await Promise.all([
          fetch("/api/news"),
          fetch("/api/tools"),
          fetch("/api/status"),
        ]);
        if (!mounted) return;
        const news = await newsRes.json();
        const tools = await toolsRes.json();
        const meta = await statusRes.json();
        setPayload({
          ...news,
          tools: tools.tools || [],
        });
        setStatus(meta);
      } catch (error) {
        console.error("Initial load failed:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    hydrate();
    const interval = setInterval(hydrate, 60000);

    const stream = new EventSource("/api/stream");
    stream.addEventListener("news-updated", (event) => {
      try {
        const next = JSON.parse(event.data);
        setPayload((prev) => ({ ...prev, ...next }));
      } catch (error) {
        console.error("Unable to parse stream payload:", error);
      }
    });
    stream.addEventListener("status", (event) => {
      try {
        setStatus(JSON.parse(event.data));
      } catch (error) {
        console.error("Unable to parse status payload:", error);
      }
    });

    return () => {
      mounted = false;
      clearInterval(interval);
      stream.close();
    };
  }, []);

  const stories = useMemo(() => {
    const all = payload.stories || [];
    if (category === "All") return all;
    return all.filter((story) => story.category === category);
  }, [payload.stories, category]);

  const dateLabel = new Date(payload.updatedAt || Date.now()).toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="page">
      <div className="ticker">
        <span className="live-dot" />
        <strong>LIVE AI DESK</strong>
        <div className="ticker-scroll">
          {[...(payload.ticker || []), ...(payload.ticker || [])].map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>

      <header className="header">
        <div className="brand">
          <h1>NEWRAL</h1>
          <span>AI Newsroom</span>
        </div>

        <nav>
          {CATEGORIES.map((item) => (
            <button
              key={item}
              className={item === category ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button onClick={() => setTheme((v) => (v === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <main className="main">
        <section className="status">
          <span>{dateLabel}</span>
          <span>{status.syncing ? "Syncing feeds..." : "Live sync running"}</span>
          <span>Mode: {status.mode || "fallback"}</span>
        </section>

        <section className="hero-grid">
          <article className="hero-card">
            <p className="pill">{payload.hero?.category || "Research"}</p>
            <h2>{payload.hero?.title}</h2>
            <p>{payload.hero?.summary}</p>
            <div className="hero-meta">
              <span>{payload.hero?.source}</span>
              <span>{timeAgo(payload.hero?.publishedAt || Date.now())}</span>
            </div>
            <a href={payload.hero?.link || "#"} target="_blank" rel="noreferrer">
              Read source
            </a>
          </article>

          <aside className="side-list">
            <h3>Top Stories</h3>
            {(payload.stories || []).slice(0, 5).map((story, index) => (
              <a
                key={story.id || `${story.title}-${index}`}
                href={story.link || "#"}
                target="_blank"
                rel="noreferrer"
              >
                <small>{story.category}</small>
                <p>{story.title}</p>
              </a>
            ))}
          </aside>
        </section>

        <section className="section-head">
          <h3>Latest AI and Emerging Tech</h3>
          <span>{stories.length} stories</span>
        </section>

        <section className="news-grid">
          {loading && <p className="muted">Loading live feed...</p>}
          {!loading &&
            stories.map((story) => (
              <article key={story.id} className="news-card">
                <small>{story.category}</small>
                <h4>{story.title}</h4>
                <p>{story.summary}</p>
                <div className="story-meta">
                  <span>{story.source}</span>
                  <span>{timeAgo(story.publishedAt)}</span>
                </div>
                <a href={story.link || "#"} target="_blank" rel="noreferrer">
                  Open source
                </a>
              </article>
            ))}
        </section>

        <section className="section-head tools-head">
          <h3>This Week's New AI Tools</h3>
          <span>Refreshed weekly</span>
        </section>

        <section className="tools-grid">
          {(payload.tools || []).map((tool) => (
            <article key={tool.name} className="tool-card">
              <div className="tool-top">
                <h4>{tool.name}</h4>
                <span>{tool.badge || "NEW"}</span>
              </div>
              <p className="tool-tagline">{tool.tagline}</p>
              <p>{tool.description}</p>
              <div className="tool-meta">
                <span>{tool.category}</span>
                <span>{tool.pricing || "TBA"}</span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
