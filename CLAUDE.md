# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

There is no test runner configured yet.

## Environment Variables

Copy `.env.excample` to `.env`. The backend API URL is configured via:

```
NEXT_PUBLIC_MEMORATOR_BE_API_URL=http://localhost:8080/api/
```

## Architecture

**Next.js App Router** with a route group `(pages)/` for all page routes. The `app/` directory is split into two concerns:

- **`app/(pages)/`** — Next.js route pages. Each route folder contains only a `page.tsx` that renders a view. The root layout lives at `app/(pages)/layout.tsx`.
- **`app/views/`** — Feature-level UI components. Each view is a folder with a component file, a custom hook (e.g., `useSignUp.tsx`), and an `index.ts` barrel export.

### Data Fetching

No third-party data fetching libraries — uses native `fetch`. API calls are made inside custom hooks co-located with their view. The backend base URL is read from `NEXT_PUBLIC_MEMORATOR_BE_API_URL`, with a fallback to a relative `/api/` path.

Auth tokens (`accessToken`, `refreshToken`) returned from the backend are stored as cookies with `path=/; sameSite=lax`.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. No component library. Global styles are in `app/(pages)/globals.css`.

### Path Alias

`@/*` resolves to the project root (e.g., `@/app/views/SignUp`).
