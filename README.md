# Spec → Scaffold Developer Agent

Generate a small, realistic project scaffold from a short feature description. Paste a spec, click Generate, preview the resulting files, and download them as a ZIP.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and the OpenAI API.

## Quick Start

Prerequisites: Node.js 18+ and an OpenAI API key.

1. Install dependencies

```bash
npm install
```

1. Configure environment

Create `.env.local` in the project root with your OpenAI key:

```bash
echo "OPENAI_API_KEY=sk-..." > .env.local
```

1. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000> and paste a short feature spec. Click “Generate Scaffold” to create files, preview them in the UI, and use “Download ZIP” to export.

## What It Does

- Backend: The API route `src/app/api/scaffold/route.ts` calls OpenAI with your spec and returns a typed JSON payload containing:
  - `summary`: brief description of the generated project
  - `architectureNotes`: high-level guidance and rationale
  - `files[]`: an array of `{ path, description, content }`
- Frontend: `src/app/page.tsx` lets you:
  - Enter a feature spec and trigger generation
  - Browse the file list and preview contents
  - Download everything as `scaffold.zip` via `DownloadZipButton`

## Configuration

- Model: Set in `src/app/api/scaffold/route.ts` (default: `gpt-4o-mini`).
- Runtime: The route uses the Edge runtime by default. If you prefer Node.js (e.g., for local mocking), change `export const runtime = "edge";` to `"nodejs"`.
- Tailwind CSS v4: Enabled by `@tailwindcss/postcss` (see `postcss.config.mjs`). The global CSS imports Tailwind via `@import "tailwindcss";` in `src/app/globals.css`.

## Scripts

```bash
npm run dev     # Start dev server (http://localhost:3000)
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Lint the project
```

## Deployment

Set `OPENAI_API_KEY` in your hosting environment (e.g., Vercel Project Settings → Environment Variables). Deploy the app, then visit the URL to use the generator.

## Notes & Troubleshooting

- Costs and privacy: Requests are sent to OpenAI using your API key; usage is billed to your account. Do not commit API keys.
- Tailwind classes not applying? Ensure `src/app/globals.css` includes `@import "tailwindcss";` and rebuild.
- Large outputs: For very big scaffolds, the UI shows a preview and lets you download the ZIP to inspect locally.
