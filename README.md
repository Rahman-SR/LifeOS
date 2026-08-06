# LifeOS

LifeOS is a calm, cross-platform daily management app built with Expo and React Native. This repository contains the Expo SDK 54 foundation, completed email/password authentication, the authenticated Today dashboard, and real Supabase-backed task, habit, note, mood, journal, goal, and milestone management.

The Today task, habit, recent-note, mood, journal, and primary-goal previews use real Supabase data. Advanced statistics and remote push notifications remain intentionally deferred. The database foundation is defined as versioned Supabase migrations with Row Level Security.

## Goals and milestones

Goals support Active, Completed, Paused, and Archived views; create, edit, detail, status, manual progress, archive, restore, and permanent-delete actions; and ordered milestones with completion tracking. Completing a goal sets progress to 100% and records `completed_at`. Milestone completion never silently changes the goal's manual progress; the details screen offers an explicit “Use milestone progress” action instead.

Goal and milestone creation/editing is saved atomically through a security-invoker database function. Existing owner-only RLS remains authoritative, and the milestone composite foreign key prevents a milestone from being attached to another user's goal.

## Mood and journal

Mood tracking stores one owner-scoped text mood per profile-local date, supports editing today, and provides recent history with weekly and monthly distributions. Daily journal entries use the same local-date rule, support explicit create/update saves, reflection prompts, history search, editing, and confirmed deletion. The unique `(user_id, date)` constraints prevent duplicates while RLS restricts every operation to the authenticated owner.

## Notes management

The Notes tab provides All, Pinned, Recent, and Archived views; debounced title/content search; create, edit, detail, permanent-delete, pin, unpin, archive, and restore flows; pull to refresh; and owner-scoped Supabase queries protected by RLS. Notes require at least a non-whitespace title or content, use explicit saves, warn before discarding edits, and prevent repeated submissions.

Normal views place pinned notes first and then sort by the latest update. Archived notes are fetched only for the Archived view. The Today dashboard independently shows the most recently updated active note, and Quick Add opens the real note editor.

## Habit tracking

The Habits tab provides Today, All habits, and Archived views; create, edit, detail, archive, restore, and permanent-delete flows; daily and selected-weekday schedules; target counts; local reminders; recent history; completion rate; and current/best streaks. Habit completion uses one owner-scoped log per local calendar date and an atomic database function capped at the habit target.

Weekdays use the project convention: **Sunday is 0 and Saturday is 6**. The UI exposes only `daily` and selected weekdays (`weekly` in the live database). Monthly and custom recurrence remain out of scope.

## Task management

The Tasks tab provides Today, Upcoming, Overdue, and Completed views, owner-scoped task and category queries, create/edit/detail/delete flows, completion and restoration, default categories, priorities, dates, optional times, and optional local reminders. Task data is cached with TanStack Query and protected by the existing Supabase RLS policies.

Task reminder identifiers are stored locally with Expo SecureStore. Notification permission is requested only when a task reminder is enabled. Expo Go supports local notifications, but production notification configuration and full standalone behavior should also be verified in an Expo development build.

## Today dashboard shell

The Today tab includes the personalized greeting, current date, real task and habit progress, reflection shortcuts, primary active goal, recent note, pull-to-refresh, and quick-add sheet. Quick Add opens the real Task, Habit, Note, Mood, Journal, and Goal flows.

## List UI and navigation

Tasks, Habits, and Notes share a compact horizontal filter-chip row and lightweight list-card primitives. Selected filters use a filled semantic state and automatically remain visible on narrow screens. Cards keep completion, status, and overflow actions at least 44 x 44 points while reducing unused vertical space.

Bottom tabs use per-feature semantic accents, keep the default no-animation transition explicit, and freeze inactive native screens. TanStack Query keeps successful data fresh for two minutes and cached for fifteen minutes so normal tab switching can reuse already-loaded data without an unnecessary full-screen loader.

## Requirements

- Node.js 22 or newer
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

The Phase 7 migration at `supabase/migrations/20260804083222_align_mood_and_journal_schema.sql` converts legacy numeric mood rows to the documented text mood values, renames the daily mood date column, adds the three journal reflection fields, and adds history indexes. The Phase 8 migration at `supabase/migrations/20260806102625_add_goal_completion_and_save_rpc.sql` adds goal completion timestamps, lifecycle checks, indexes, and the transactional goal-with-milestones save function. Apply both before testing these features. Existing owner RLS policies and authenticated table grants remain unchanged.

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
npx supabase migration repair --status applied 20260803081527 20260803091445 20260803123521 20260804042839 20260804052243 20260804083222 20260806102625
```

Do not rerun the same migration in SQL Editor after it succeeds. Future schema changes must use new timestamped migration files created with `npx supabase migration new <name>`.

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
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
features/habits/      Habit UI, schedules, streaks, services, queries, and mutations
features/notes/       Note UI, validation, search, services, queries, and mutations
features/mood/        Daily mood check-in, history, summaries, services, and queries
features/journal/     Daily journal editor, history, search, services, and queries
features/goals/       Goal and milestone UI, validation, summaries, services, queries, and mutations
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
