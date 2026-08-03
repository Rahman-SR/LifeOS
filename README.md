# LifeOS

LifeOS is a calm, cross-platform daily management app built with Expo and React Native. This repository contains the Expo SDK 54 foundation, completed email/password authentication, the authenticated Today dashboard, and real Supabase-backed task management.

The Today task preview and progress counts use real task data. Habits, notes, mood, journal, and goals remain temporary dashboard mock data. Their feature logic, statistics, and remote push notifications remain intentionally deferred. The database foundation is defined as versioned Supabase migrations with Row Level Security.

## Task management

The Tasks tab provides Today, Upcoming, Overdue, and Completed views, owner-scoped task and category queries, create/edit/detail/delete flows, completion and restoration, default categories, priorities, dates, optional times, and optional local reminders. Task data is cached with TanStack Query and protected by the existing Supabase RLS policies.

Task reminder identifiers are stored locally with Expo SecureStore. Notification permission is requested only when a task reminder is enabled. Expo Go supports local notifications, but production notification configuration and full standalone behavior should also be verified in an Expo development build.

## Today dashboard shell

The Today tab includes the personalized greeting, current date, daily progress, task and habit previews, reflection shortcuts, active goal, recent note, pull-to-refresh, and quick-add sheet. Mock completion controls update only in memory and reset when the dashboard refreshes or the app reloads. Quick-add and preview actions intentionally show a next-phase message instead of opening feature forms.

## Requirements

- Node.js 20.19 or newer
- npm
- Expo Go with SDK 54 support on an Android or iOS device
- A Supabase project when you are ready to connect authentication and data

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   **PowerShell**

   ```powershell
   Copy-Item .env.example .env
   ```

3. In Supabase Dashboard, open **Project Settings → API Keys → Legacy API Keys**. Copy the Project URL and `anon` key into `.env`:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

   Never add a service-role or secret key to this mobile app.

4. Start Expo:

   ```bash
   npm start
   ```

5. Scan the QR code in Expo Go. The computer and device should be on the same network. If LAN discovery is blocked, run:

   ```bash
   npx expo start --tunnel
   ```

Restart Expo after changing `.env`. Use `npx expo start --clear` if Metro is holding stale configuration.

## Supabase Authentication setup

1. Open **Authentication → Providers → Email** and enable the Email provider.
2. Turn **Confirm email** off for the current first-time sign-in flow. New users receive a session immediately and enter the protected app without opening Gmail. Re-enable verification later only if the product flow is updated to require it.
3. Set the minimum password length to at least **8** so Dashboard rules match the app validation.
4. Open **Authentication → URL Configuration** and set a valid Site URL for confirmation and recovery emails. Add `lifeos://**` to the redirect allow list for future standalone/development-build deep links.
5. The default Supabase email sender is rate-limited and intended for testing. Configure custom SMTP before production use.

The `handle_new_user` database trigger creates the profile and notification-preference records from the registration metadata. The app reads the owner-only profile through RLS after authentication and synchronizes onboarding completion to that profile.

## Apply the database foundation

The migration at `supabase/migrations/20260803081527_create_lifeos_schema.sql` creates the LifeOS tables, indexes, ownership constraints, profile bootstrap trigger, minimal grants, and Row Level Security policies. The authentication migration adds the profile onboarding-completion flag.

### Option A: Supabase CLI

1. Sign in and link this folder to the same project referenced by `.env`:

   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

   `YOUR_PROJECT_REF` is the first part of your Project URL: `https://YOUR_PROJECT_REF.supabase.co`.

2. Preview and apply pending migrations:

   ```bash
   npx supabase db push --dry-run
   npx supabase db push
   ```

3. Regenerate the database types after every schema change:

   ```powershell
   npx supabase gen types typescript --linked | Out-File -Encoding utf8 types/database.ts
   ```

### Option B: Supabase Dashboard

If the CLI is not linked, open **Supabase Dashboard → SQL Editor → New query**, paste the complete migration file, and choose **Run** once. Then open **Table Editor** and verify that the eleven public tables exist.

Because SQL Editor does not add the file to the CLI migration history, mark this version as applied before a future `db push`:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase migration repair --status applied 20260803081527 20260803091445 20260803123521
```

Do not rerun the same migration in SQL Editor after it succeeds. Future schema changes must use new timestamped migration files created with `npx supabase migration new <name>`.

## Quality checks

```bash
npm run typecheck
npm run lint
npx expo install --check
```

## Foundation structure

```text
app/                 Expo Router routes and route groups
  (auth)/            Login, registration, and password-reset request
  (tabs)/            Today, Tasks, Habits, Notes, and Profile tabs
components/          Reusable UI and feedback components
features/auth/        Authentication forms, validation, storage, and services
features/tasks/       Task UI, validation, services, queries, and mutations
hooks/               Shared application hooks
lib/                 Supabase, TanStack Query, and local notification configuration
providers/           Root application providers
store/               Small shared UI state
theme/               Light/dark tokens and theme types
supabase/migrations/ Future database migrations
types/database.ts     Schema-aligned Supabase client types
```

## Theme testing

The app follows the device color scheme by default. Open the **Profile** tab to switch between System, Light, and Dark for the current session. Profile-backed theme persistence will be added with authentication and settings.

## Authentication behavior

`lib/supabase.ts` uses only `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Native sessions use Expo SecureStore; web uses browser local storage. Session refresh is tied to the native app lifecycle, and the auth provider listens for Supabase authentication events.

Unauthenticated first-time users see onboarding. Completing or skipping onboarding is saved locally, then users are routed to authentication. Authenticated users are routed to the protected tab area, while logout returns them to login. With **Confirm email** disabled, a successful registration immediately creates a session and opens the tab area. Registration sends `display_name` as user metadata so the database trigger can create the matching profile record.

All eleven user-owned tables enable Row Level Security. Feature tables allow authenticated users to manage only rows whose `user_id` matches their session; profiles and notification preferences are created automatically and allow owner-only reads and updates. Cross-user category, habit, and goal relationships are rejected by composite foreign keys.

Do not place service-role credentials in Expo environment variables. The mobile app must use only the project URL and anon key.

## Planning documents

The authoritative product, workflow, schema, design, and architecture requirements remain in the numbered Markdown files at the project root. Start with `06_CODEX_ANTIGRAVITY_MASTER_PROMPT.md` before implementing the next feature.
