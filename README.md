# Newral - Free AI News Site on GitHub Pages

Modern AI news website with:
- Daily AI and emerging tech feed ingestion
- Weekly new tools section
- Responsive mobile layout
- Dark and light mode
- Free hosting on GitHub Pages
- Scheduled publishing with GitHub Actions

## Local development

```bash
npm install
npm run generate:content
npm run dev
```

Optional secret for AI-rewritten summaries:
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

The UI reads from `public/data/content.json`, so local dev works without a backend.

## Free deployment

This repo is set up to deploy through GitHub Pages using:
- [`.github/workflows/deploy-pages.yml`](C:\Users\asus\Downloads\Newral\.github\workflows\deploy-pages.yml)
- [`scripts/generate-content.mjs`](C:\Users\asus\Downloads\Newral\scripts\generate-content.mjs)

Workflow behavior:
- runs on every push to `main`
- runs on a schedule twice per hour
- regenerates `content.json`
- builds the site
- deploys `dist/` to GitHub Pages

## Turn on GitHub Pages

1. Open your repo settings on GitHub.
2. Go to `Pages`.
3. Under `Build and deployment`, choose `GitHub Actions`.
4. Save.

After that, the workflow will publish the site automatically.

## Notes

- GitHub Pages is free for this setup.
- Updates are scheduled, not truly per-second live.
- If you add `OPENAI_API_KEY` as a GitHub Actions secret, summaries can be rewritten in a cleaner newsroom style during the build.
