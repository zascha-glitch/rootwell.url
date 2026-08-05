# Todos app (Next.js + Supabase)

Separate Next.js app for the Supabase `todos` table. The Rootwell marketing site at the repo root stays static.

## Setup

```bash
cd todos-app
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What is included

- `lib/supabase/client.ts` — browser client
- `lib/supabase/server.ts` — server client (Server Components / actions)
- `lib/supabase/proxy.ts` + `proxy.ts` — refreshes auth session via `getClaims()`
- Login / signup and a simple todos list against `public.todos`

RLS only allows authenticated users to read/write their own rows.
