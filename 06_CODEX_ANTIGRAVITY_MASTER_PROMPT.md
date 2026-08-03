# LifeOS — Codex / Antigravity Master Prompt

You are building a production-quality cross-platform mobile application named **LifeOS**.

Read and follow these files before making changes:

1. `01_PRODUCT_REQUIREMENTS_DOCUMENT.md`
2. `02_APP_WORKFLOW_AND_SCREEN_MAP.md`
3. `03_DATABASE_SCHEMA.md`
4. `04_DESIGN_SYSTEM.md`
5. `05_TECHNICAL_ARCHITECTURE_AND_ROADMAP.md`

## Product

LifeOS is a personal daily management app combining:

- Tasks
- Habits
- Notes
- Mood tracking
- Daily journal
- Goals
- Local reminders
- Basic statistics

## Required Stack

- Expo
- React Native
- TypeScript
- Expo Router
- Supabase
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Expo SecureStore
- Expo Notifications
- Expo Haptics

## Core Rules

1. Use TypeScript strictly.
2. Follow the folder structure from the technical architecture document.
3. Follow `DESIGN_SYSTEM.md` exactly.
4. Do not hardcode colors, spacing, typography, or radii inside screens.
5. Build reusable components.
6. Keep database logic inside feature services or hooks.
7. Use TanStack Query for server data.
8. Use Zustand only for small shared UI state.
9. Use React Hook Form and Zod for forms.
10. Handle loading, empty, success, and error states.
11. Never expose Supabase service-role credentials.
12. Assume Row Level Security is required.
13. Do not disable RLS.
14. Avoid unnecessary dependencies.
15. Keep the app compatible with Expo.
16. Do not use unsupported native packages without explaining why a development build is required.
17. Do not create all features in one large change.
18. Complete and test one feature at a time.
19. Do not change unrelated files.
20. Preserve existing working functionality.

## UI Requirements

- Support light and dark mode
- Use safe areas
- Use accessible touch targets
- Use consistent cards and buttons
- Use clear typography hierarchy
- Use Lucide icons
- Avoid web-style layouts
- Avoid excessive gradients
- Avoid oversized shadows
- Keep Today dashboard scannable

## Data Requirements

All user-owned records must include the authenticated user's ID.

Tables:

- profiles
- task_categories
- tasks
- habits
- habit_logs
- notes
- mood_logs
- journal_entries
- goals
- goal_milestones
- notification_preferences

## Development Method

Before each feature:

1. Inspect the current codebase.
2. Identify affected files.
3. State the implementation plan.
4. Implement the smallest complete version.
5. Run TypeScript and lint checks.
6. Fix errors.
7. Summarize changes.
8. List manual device tests.

## Initial Task

Build only the project foundation.

Deliver:

- Expo Router setup
- Authentication and tab route groups
- Theme tokens
- Light and dark theme support
- Supabase client
- TanStack Query provider
- Basic reusable UI components
- Environment example file
- Placeholder screens
- README setup instructions

Do not build task, habit, note, journal, mood, goal, or notification business logic during the initial task.

## Required Reusable Components

Create:

- `Screen`
- `AppText`
- `AppHeader`
- `Card`
- `Button`
- `IconButton`
- `TextField`
- `SectionHeader`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `ProgressBar`

## Completion Output

After implementation, provide:

- Files created
- Files changed
- Commands run
- Any errors fixed
- Manual testing steps
- Recommended next feature
