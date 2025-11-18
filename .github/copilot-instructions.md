# Copilot Instructions for this Repo

Use these notes to work productively in this codebase without guesswork. Keep changes minimal and aligned with existing patterns.

## Overview

- Framework: Next.js 16 (App Router) + React 19 + TypeScript (strict).
- React Compiler enabled (`next.config.ts` sets `reactCompiler: true`; `babel-plugin-react-compiler` installed). Favor pure components and immutable state.
- Source root is `src/`; app entry under `src/app` (App Router). Path alias `@/*` → `src/*` (see `tsconfig.json`).

## Project Layout & Conventions

- Root layout: `src/app/layout.tsx` defines global `<html>`/`<body>`, loads `Geist` fonts via `next/font/google`, and applies CSS variables on the body.
- Global styles: `src/app/globals.css` (limit globals here). Route-level styles use CSS Modules near the component, e.g., `src/app/page.module.css`.
- Pages (routes): files named `page.tsx` under `src/app/**` create routes. Example: add `/about` by creating `src/app/about/page.tsx`.
- Metadata: export a typed `metadata: Metadata` from a route or layout when you need SEO/meta.
- Components default to Server Components. Add `"use client"` only when interactivity is required.
- Images: use `next/image` (see `src/app/page.tsx`); prefer assets in `public/` referenced as `/asset.png`.
- Imports: use alias `@/…` for modules under `src` instead of deep relative paths.

## React Compiler (Important)

- Keep render logic pure; avoid side effects inside components.
- Update state immutably; avoid in-place mutation of objects/arrays.
- Derive values from props/state inside render; move non-reactive work outside components when possible.

## Scripts & Tooling

- Dev server: `npm run dev` → http://localhost:3000
- Build: `npm run build`; Production start: `npm run start`
- Lint: `npm run lint` (ESLint 9 with `eslint-config-next` core web vitals + TypeScript). Ignores are set via `eslint.config.mjs`.
- TypeScript: strict config with `@/*` paths and `moduleResolution: bundler`.

## Patterns by Example

- New page route (server component):
  ```tsx
  // src/app/about/page.tsx
  export default function About() {
    return <main>About</main>;
  }
  ```
- Client component (only if needed):
  ```tsx
  "use client";
  import { useState } from "react";
  export default function Counter() {
    const [n, setN] = useState(0);
    return <button onClick={() => setN(n + 1)}>Count: {n}</button>;
  }
  ```
- Route styles: colocate a `page.module.css` next to the route and import as `import styles from "./page.module.css"`.

## When Adding Code

- Prefer Server Components; keep client boundaries small.
- Use `next/image` and `next/link` for assets and navigation.
- Put shared UI under `src/` (e.g., `src/components/...`) and import via `@/components/...`.
- Keep global CSS minimal; prefer CSS Modules per route/component.

## References

- Entry files: `src/app/page.tsx`, `src/app/layout.tsx`
- Styles: `src/app/globals.css`, `src/app/page.module.css`
- Config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `package.json`

If anything here conflicts with actual code, follow the code and propose a small doc fix in this file.
