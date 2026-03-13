# Newral - AI News and Weekly AI Tools

Modern AI news website with:
- Daily AI and emerging tech feed ingestion
- Weekly new tools section
- Live updates via Server-Sent Events
- Responsive mobile layout
- Dark and light mode
- Persistent state on disk (`data/state.json`)
- Production server that serves frontend + API on one port

## 1. Install

```bash
npm install
```

## 2. Configure

```bash
copy .env.example .env
```

Add `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` if you want AI-rewritten trusted summaries.  
Without a key, the app still works using feed-only mode.

## 3. Run

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:8787`

## Data pipeline

- News refresh: every 60 seconds
- Tools refresh: weekly (checked hourly, updated every 7 days)
- Frontend pull refresh: every 60 seconds
- Live push: SSE stream (`/api/stream`)
- Health check: `/healthz`

## Source strategy

Server pulls AI/tech RSS feeds and recent launches, then:
1. Deduplicates and classifies stories.
2. Optionally rewrites summaries via an AI model.
3. Publishes a trusted hero story, ticker, latest cards, and tools list.

## Deploy live on Render (recommended)

1. Push this repo to GitHub.
2. In Render, create a new **Web Service** from the repo.
3. Render auto-detects `render.yaml`:
   - Build command: `npm install && npm run build`
   - Start command: `npm run start`
4. Add environment variables:
   - `NODE_ENV=production`
   - `NEWS_REFRESH_MS=60000`
   - `TOOLS_CHECK_MS=3600000`
   - `OPENAI_API_KEY` (optional)
   - `OPENAI_MODEL` (optional)
   - `ANTHROPIC_API_KEY` (optional)
   - `ANTHROPIC_MODEL` (optional)
5. Deploy and open your Render URL.

## Deploy with Docker

```bash
docker build -t newral .
docker run -p 8787:8787 --env-file .env newral
```

Then open: `http://localhost:8787`
