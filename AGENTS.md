# AGENTS.md — Jukebox

## Project Overview

Jukebox is a collaborative Spotify listening room app built with **Next.js 15 (App Router)**, **TypeScript**, **Socket.IO**, and the **Spotify Web Playback SDK**. Users authenticate via Spotify OAuth, create rooms, search for songs, and build a shared queue. Real-time sync is handled by a Socket.IO server on port 4000.

## Tech Stack

- **Framework:** Next.js 15.5 with Turbopack (App Router)
- **Language:** TypeScript (strict mode)
- **React:** v19 with server and client components
- **UI:** shadcn/ui (new-york style), Radix UI, Tailwind CSS v4, Lucide icons
- **Animation:** motion (Framer Motion successor)
- **Real-time:** Socket.IO v4.8 (server + client)
- **Theming:** next-themes
- **Package manager:** npm

## Build / Lint / Test Commands

```bash
# Development server (Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint (ESLint 9 flat config with next/core-web-vitals + next/typescript)
npm run lint

# Type check only (no emit)
npx tsc --noEmit
```

**Note:** There is no test framework configured. No jest, vitest, or test files exist yet. If adding tests, prefer vitest (aligns with the Vite/Turbopack ecosystem).

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Home — redirects to Spotify login
│   ├── layout.tsx              # Root layout (ThemeProvider, Geist font)
│   ├── globals.css             # Tailwind v4 + shadcn theme variables
│   ├── room/page.tsx           # Room page (server component)
│   └── api/
│       ├── addSong/route.ts         # POST — add song to room queue
│       ├── spotifylogin/route.ts    # GET — initiate Spotify OAuth
│       ├── spotifylogin/callback/route.ts  # GET — OAuth callback, creates room
│       ├── spotifyplaybacktransfer/route.ts # GET — transfer playback
│       └── spotifysearch/route.ts   # GET — search Spotify tracks
├── components/
│   ├── room_client.tsx         # Main room UI (client component)
│   ├── spotifyplayer.tsx       # Spotify Web Playback SDK player
│   ├── homepage-buttons.tsx    # Create/Join buttons
│   ├── themeprovider.tsx       # next-themes wrapper
│   └── ui/                     # shadcn/ui generated components
├── modules/
│   ├── room.ts                 # Room class (queue, socket events)
│   ├── roomlist.ts             # Singleton room list (in-memory store)
│   ├── socketio_server.ts      # Singleton Socket.IO server (port 4000)
│   └── spotifyHandler.ts       # Spotify API handler (auth, search, play)
├── types/
│   ├── socketTypes.ts          # Socket.IO event type interfaces
│   ├── spotifyToken.ts         # Token info type
│   └── trackTypes.ts           # Track type definition
└── lib/
    └── utils.ts                # cn() utility (clsx + tailwind-merge)
```

## Path Aliases

Defined in `tsconfig.json`:
- `@/*` → `./src/*` — use for all cross-directory imports
- `public/*` → `./public/*`

Use `@/` aliases for imports across directories. Relative imports (`./`) are acceptable for sibling files within the same directory (e.g., inside `src/modules/`).

## Code Style Guidelines

### Formatting
- **Indentation:** 2 spaces (preferred; some files use 4 — normalize to 2 for new code)
- **Semicolons:** Include semicolons at end of statements
- **Quotes:** Double quotes for strings (align with JSX convention)
- **Trailing commas:** Include trailing commas in multi-line objects/arrays
- No `.prettierrc` or `.editorconfig` exists — be consistent within files you edit

### Imports
- Place imports at the top of the file
- No strict grouping enforced, but prefer: external packages first, then `@/` local imports
- Use `@/*` path alias for cross-directory imports
- Use relative `./` imports for same-directory siblings only

### Naming Conventions
- **Files:** Existing files use mixed conventions (snake_case, kebab-case, camelCase). For new files: use kebab-case for components, camelCase for modules/utilities
- **React components:** PascalCase function names (`RoomClient`, `SpotifyPlayer`)
- **Variables/functions (domain logic):** snake_case (`room_id`, `token_info`, `get_queue`)
- **Variables/functions (React/handlers):** camelCase (`searchHandler`, `setSearchedTracks`)
- **Classes:** lowercase in this codebase (`room`, `roomlist`, `socket_server`) — follow existing convention
- **Interfaces:** PascalCase, optionally with `I` prefix (`IRoom`, `IRoomlist`, `ServerToClientEvents`)
- **Type aliases:** camelCase for data shapes (`spotifyTokenInfoType`, `tracks`), PascalCase for component props (`SpotifyPlayerProps`)

### Types
- TypeScript strict mode is enabled
- Use `interface` for behavioral contracts and socket event maps
- Use `type` for data shapes and component props
- Define component prop types as a `type` alias directly above the component
- Pass props as a single `props` parameter (not destructured in the function signature), except for simple cases
- Avoid `any` — prefer proper types. Existing code has heavy `any` usage that should be improved over time
- Explicit return types are not required on implementations but are used on interface method signatures

### Components
- **Functional components only** — use `function` declarations (not arrow functions)
- **Default exports** for pages and components: `export default function ComponentName(...)`
- Named exports only for shadcn/ui generated components
- Never use `React.FC` or `React.FunctionComponent`
- Mark client components with `"use client"` directive at line 1
- Server components (no directive) handle data fetching; client components handle interactivity

### Error Handling
- API routes: wrap logic in try/catch, log errors with `console.log(err)`, return appropriate HTTP status codes
- Return `new Response(null, { status: 500 })` or `NextResponse.json({ error: '...' }, { status: 500 })` on failure
- Always null-check room lookups before accessing properties

### Server-Side Singletons
Modules that need to persist across Next.js hot reloads use this pattern:
```ts
const globalForX = global as unknown as { myInstance?: MyClass };
const instance = globalForX.myInstance ?? new MyClass();
if (!globalForX.myInstance) globalForX.myInstance = instance;
export default instance;
```

### Architecture Patterns
- **In-memory state:** Rooms and queues are stored in global singletons (no database)
- **Socket.IO:** Separate server on port 4000 for real-time room events (`joinRoom`, `play`, `playlist_update`)
- **Spotify API:** All Spotify interactions go through the `spotifyHandler` class (static methods)
- **OAuth flow:** `/api/spotifylogin` → Spotify → `/api/spotifylogin/callback` → creates room → redirects to `/room?room_id=<uuid>`

## Environment Variables

Required in `.env` (gitignored — never commit):
```
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REDIRECT_URI=...
```

## ESLint Configuration

ESLint 9 flat config (`eslint.config.mjs`) extends:
- `next/core-web-vitals`
- `next/typescript`

Ignored paths: `node_modules/`, `.next/`, `out/`, `build/`, `next-env.d.ts`

## Key Files for Context

When working on a feature, these files are most likely relevant:
- **Room logic:** `src/modules/room.ts`, `src/modules/roomlist.ts`
- **Spotify integration:** `src/modules/spotifyHandler.ts`, `src/components/spotifyplayer.tsx`
- **Real-time events:** `src/modules/socketio_server.ts`, `src/types/socketTypes.ts`
- **Room UI:** `src/components/room_client.tsx`
- **API routes:** `src/app/api/*/route.ts`
- **Type definitions:** `src/types/`
