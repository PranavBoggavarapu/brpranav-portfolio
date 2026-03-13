import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import {
  getState,
  initializeState,
  refreshNewsAndTools,
  refreshNewsOnly,
  refreshToolsIfDue,
  subscribe,
} from "./news-service.js";

const PORT = Number(process.env.PORT || 8787);
const NEWS_REFRESH_MS = Number(process.env.NEWS_REFRESH_MS || 60_000);
const TOOLS_CHECK_MS = Number(process.env.TOOLS_CHECK_MS || 60 * 60 * 1000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "..", "dist");
const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

const clients = new Set();

subscribe((state) => {
  const payload = `event: news-updated\ndata: ${JSON.stringify(state)}\n\n`;
  for (const res of clients) res.write(payload);
});

setInterval(() => {
  const status = JSON.stringify({
    syncing: getState().syncing,
    mode: getState().mode,
    updatedAt: getState().updatedAt,
  });
  const payload = `event: status\ndata: ${status}\n\n`;
  for (const res of clients) res.write(payload);
}, 10000);

app.get("/api/news", (_, res) => {
  const state = getState();
  res.json({
    updatedAt: state.updatedAt,
    ticker: state.ticker,
    hero: state.hero,
    stories: state.stories,
  });
});

app.get("/api/tools", (_, res) => {
  const state = getState();
  res.json({
    updatedAt: state.updatedAt,
    tools: state.tools,
  });
});

app.get("/api/status", (_, res) => {
  const state = getState();
  res.json({
    syncing: state.syncing,
    mode: state.mode,
    updatedAt: state.updatedAt,
    toolsUpdatedAt: state.toolsUpdatedAt,
    sourceCount: state.sources?.length || 0,
  });
});

app.get("/healthz", (_, res) => {
  res.status(200).json({ ok: true, now: new Date().toISOString() });
});

app.get("/api/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("event: ready\ndata: connected\n\n");
  clients.add(res);
  req.on("close", () => clients.delete(res));
});

app.post("/api/refresh", async (_, res) => {
  await refreshNewsAndTools();
  res.json({ ok: true });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));
  app.get(/^\/(?!api|healthz).*/, (_, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

server.listen(PORT, async () => {
  await initializeState();
  setInterval(refreshNewsOnly, NEWS_REFRESH_MS);
  setInterval(refreshToolsIfDue, TOOLS_CHECK_MS);
  console.log(`Newral running on http://localhost:${PORT}`);
});
