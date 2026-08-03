# LifeOS — Technical Architecture and Development Roadmap

## 1. Architecture

```text
Expo React Native App
        ↓
Supabase JavaScript Client
        ↓
Supabase Auth + PostgreSQL + Storage
```

Optional later:

```text
Supabase Edge Functions
        ↓
External APIs
```

---

## 2. Recommended Packages

### Core

```bash
npx create-expo-app@latest lifeos
```

### Expo Packages

```bash
npx expo install expo-router
npx expo install expo-secure-store
npx expo install expo-notifications
npx expo install expo-haptics
npx expo install expo-image
npx expo install expo-constants
npx expo install expo-linking
npx expo install react-native-safe-area-context
npx expo install react-native-screens
```

### Application Packages

```bash
npm install @supabase/supabase-js
npm install @tanstack/react-query
npm install zustand
npm install react-hook-form
npm install zod
npm install @hookform/resolvers
npm install lucide-react-native
npm install date-fns
```

---

## 3. Suggested Project Structure

```text
lifeos/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── tasks.tsx
│   │   ├── habits.tsx
│   │   ├── notes.tsx
│   │   └── profile.tsx
│   ├── tasks/
│   ├── habits/
│   ├── notes/
│   ├── journal/
│   ├── goals/
│   ├── settings/
│   ├── onboarding.tsx
│   ├── _layout.tsx
│   └── +not-found.tsx
├── components/
│   ├── ui/
│   ├── cards/
│   ├── forms/
│   └── feedback/
├── features/
│   ├── auth/
│   ├── tasks/
│   ├── habits/
│   ├── notes/
│   ├── mood/
│   ├── journal/
│   └── goals/
├── hooks/
├── lib/
│   ├── supabase.ts
│   ├── query-client.ts
│   ├── notifications.ts
│   └── validation.ts
├── store/
├── theme/
├── types/
├── constants/
├── assets/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── .env.example
└── README.md
```

---

## 4. Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Never include:

```text
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
PAYMENT_SECRET
```

inside the mobile client.

---

## 5. State Management

### Supabase Auth

Use for:

- Session
- User identity
- Authentication events

### TanStack Query

Use for:

- Tasks
- Habits
- Notes
- Mood entries
- Journal entries
- Goals
- Profiles

### Zustand

Use only for:

- Theme state
- Temporary UI filters
- Draft quick-add state
- Global modal state if necessary

### React Hook Form

Use for:

- Authentication forms
- Task forms
- Habit forms
- Note forms
- Goal forms
- Settings forms

---

## 6. Development Phases

## Phase 0 — Planning

Deliverables:

- PRD
- Workflow
- Database schema
- Design system
- Technical roadmap
- Master prompt

## Phase 1 — Project Foundation

Tasks:

- Create Expo project
- Enable TypeScript
- Configure Expo Router
- Configure linting
- Create folder structure
- Add theme tokens
- Add base UI components
- Initialize GitHub repository

## Phase 2 — Supabase Foundation

Tasks:

- Create Supabase project
- Apply database schema
- Enable RLS
- Add policies
- Configure authentication
- Configure environment variables
- Generate TypeScript database types

## Phase 3 — Authentication

Tasks:

- Splash
- Onboarding
- Login
- Register
- Forgot password
- Session persistence
- Protected route groups
- Logout
- Account deletion shell

## Phase 4 — Dashboard

Tasks:

- Today screen layout
- Greeting
- Current date
- Progress summary
- Loading states
- Empty states
- Quick add
- Section navigation

## Phase 5 — Tasks

Tasks:

- Task CRUD
- Filters
- Completion
- Categories
- Priority
- Due date and time
- Local reminder
- Overdue state

## Phase 6 — Habits

Tasks:

- Habit CRUD
- Daily/weekday frequency
- Completion logs
- Streak calculation
- Habit reminder
- History

## Phase 7 — Notes

Tasks:

- Note CRUD
- Pin
- Archive
- Search
- Recent notes

## Phase 8 — Mood and Journal

Tasks:

- Daily mood
- Mood history
- Journal editor
- Daily uniqueness
- Journal history
- Search

## Phase 9 — Goals

Tasks:

- Goal CRUD
- Milestones
- Progress
- Completion
- Archive

## Phase 10 — Statistics

Tasks:

- Weekly task summary
- Habit completion
- Streak summary
- Mood chart
- Journal consistency
- Goal progress

## Phase 11 — Settings and Notifications

Tasks:

- Theme
- Reminder settings
- Time format
- Week start
- Local notification scheduling
- Permission flow
- Data export

## Phase 12 — Quality and Release

Tasks:

- Android testing
- iOS testing
- Error review
- Performance review
- Accessibility pass
- Production configuration
- EAS development build
- EAS production build
- Privacy policy
- Store assets

---

## 7. Branching Strategy

```text
main
develop
feature/authentication
feature/tasks
feature/habits
feature/notes
feature/journal
feature/goals
feature/notifications
```

Commit after each stable feature.

Examples:

```text
feat(auth): add email login and session persistence
feat(tasks): add task creation and completion
fix(habits): correct streak calculation
refactor(ui): extract reusable card component
```

---

## 8. Testing Checklist

### Authentication

- Register
- Invalid email
- Weak password
- Login
- Wrong password
- Password reset
- Logout
- Expired session

### Tasks

- Create
- Edit
- Complete
- Delete
- Date filtering
- Overdue state
- Reminder scheduling

### Habits

- Create daily habit
- Create weekday habit
- Complete once
- Uncomplete
- Streak calculation
- Day transition

### Notes

- Create
- Edit
- Pin
- Archive
- Search

### Mood and Journal

- One entry per date
- Edit existing entry
- History
- Search

### Security

- User A cannot read User B data
- User A cannot update User B data
- No service key in bundle
- Account deletion removes data

---

## 9. Cost Control

Use initially:

- Supabase Free
- Expo Free
- GitHub Free
- Local notifications
- Text-only content
- No AI API
- No payment SDK
- No external backend

Upgrade only when usage requires it.

---

## 10. Definition of Done

A feature is complete when:

- UI matches design system
- Loading state exists
- Empty state exists
- Error state exists
- Form validation exists
- Supabase operation works
- RLS is tested
- Android is tested
- iOS is tested when available
- TypeScript has no errors
- Code is committed
