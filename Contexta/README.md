# Contexta

A Mac-first music-session continuity companion. This initial MVP preserves the creative trail around a project: session summaries, decisions, ideas, references, rejected directions, and open questions.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

`npm run dev` launches Vite and the Electron desktop shell. For the browser-only UI, run `npm run preview` after a build.

## Verify

```bash
npm run typecheck
npm test
npm run build
```

## What is implemented

- Project and session navigation with realistic seeded music-session data
- “Where you left off” continuity briefing
- Structured decisions, ideas, references, and open questions
- Filterable memory timeline
- Start/stop recording experience and live elapsed time
- Context-aware assistant drawer
- Privacy/capture controls
- Local persistence for the last selected project
- Secure Electron defaults (`contextIsolation` on, Node integration off)

Capture, transcription, SQLite persistence, and model calls are represented at the product layer but are not connected to native or cloud services yet.
