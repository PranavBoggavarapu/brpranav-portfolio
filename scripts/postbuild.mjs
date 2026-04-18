import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { projects } from "../src/data/projects.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const siteUrl = "https://brpranav.com";

const indexHtml = await fs.readFile(path.join(dist, "index.html"), "utf8");

await fs.writeFile(path.join(dist, "404.html"), indexHtml);

for (const project of projects) {
  const routeDir = path.join(dist, "work", project.id);
  await fs.mkdir(routeDir, { recursive: true });
  await fs.writeFile(path.join(routeDir, "index.html"), indexHtml);
}

const urls = [
  { loc: `${siteUrl}/`, priority: "1.0" },
  ...projects.map((project) => ({
    loc: `${siteUrl}/work/${project.id}/`,
    priority: "0.8",
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

await fs.writeFile(path.join(dist, "sitemap.xml"), sitemap);
await fs.writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`
);
