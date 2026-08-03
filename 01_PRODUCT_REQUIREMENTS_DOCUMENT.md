# LifeOS — Product Requirements Document

## 1. Product Overview

**Product Name:** LifeOS  
**Platform:** Android and iOS  
**Framework:** Expo + React Native + TypeScript  
**Backend:** Supabase  
**Target Release:** MVP / Version 1.0  
**Primary Goal:** Help users organize their daily life from one simple mobile application.

LifeOS is a personal daily management application that combines tasks, habits, notes, mood tracking, journaling, goals, and reminders in one clean interface.

The app should answer:

> What do I need to do today, and how am I progressing?

---

## 2. Problem Statement

People often use multiple applications for:

- Tasks
- Notes
- Habits
- Journaling
- Mood tracking
- Goals
- Reminders

This creates unnecessary complexity and reduces consistency. LifeOS provides a focused daily dashboard where users can manage the most important parts of their day without switching between several apps.

---

## 3. Target Users

### Primary Users

- Students
- Working professionals
- Freelancers
- Job seekers
- People building habits
- People who want a structured daily routine

### User Characteristics

- Uses a smartphone daily
- Wants a simple productivity system
- Does not want a complicated Notion-style setup
- Wants reminders and progress tracking
- Prefers quick actions and a clean dashboard

---

## 4. Product Goals

### MVP Goals

- Allow users to create an account and securely access their data
- Provide a useful daily dashboard
- Support task, habit, note, mood, journal, and goal tracking
- Provide local reminders
- Sync data through Supabase
- Work on Android and iOS
- Support light and dark mode
- Remain usable with minimal recurring infrastructure cost

### Long-Term Goals

- AI-assisted planning
- Voice notes
- OCR
- Family sharing
- Calendar integration
- Advanced analytics
- Premium subscription
- Home-screen widgets
- Wearable integration

---

## 5. MVP Scope

### Included

1. Authentication
2. Onboarding
3. Today dashboard
4. Task management
5. Habit tracking
6. Quick notes
7. Mood tracking
8. Daily journal
9. Goal tracking
10. Local notifications
11. Basic weekly statistics
12. Profile and settings
13. Light and dark mode
14. Account deletion
15. Supabase cloud sync

### Excluded from MVP

- AI assistant
- Social feed
- Chat
- Family accounts
- Payments
- Google Calendar sync
- Apple Calendar sync
- Voice transcription
- OCR scanner
- Maps
- Video uploads
- Public profiles
- Subscription billing
- Advanced push campaigns

---

## 6. Core User Journey

### New User

1. Installs LifeOS
2. Views onboarding
3. Creates an account
4. Sets name and optional profile preferences
5. Adds the first task
6. Adds the first habit
7. Lands on the Today dashboard
8. Receives optional reminder prompts

### Returning User

1. Opens the app
2. Sees today's tasks and habits
3. Marks progress
4. Adds quick notes
5. Records mood
6. Writes journal entry
7. Reviews daily progress

---

## 7. Functional Requirements

## 7.1 Authentication

Users must be able to:

- Register with email and password
- Log in
- Log out
- Reset password
- Stay signed in
- Delete account

Optional for later:

- Google login
- Apple login
- Magic link
- Phone OTP

---

## 7.2 Onboarding

The onboarding flow should:

- Explain the purpose of LifeOS
- Highlight tasks, habits, notes, and daily progress
- Ask for notification permission only after explaining the benefit
- Allow skipping non-essential setup
- Save onboarding completion locally and in the user profile

---

## 7.3 Today Dashboard

The Today screen should display:

- User greeting
- Current date
- Daily progress summary
- Today's tasks
- Today's habits
- Mood status
- Journal shortcut
- Goal progress
- Quick-add button
- Optional streak card

The dashboard must prioritize speed and simplicity.

---

## 7.4 Task Management

Users must be able to:

- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks complete
- Restore completed tasks
- Set due date
- Set optional due time
- Set priority
- Assign category
- Add description
- View today, upcoming, overdue, and completed tasks

### Task Priorities

- Low
- Medium
- High

### Default Task Categories

- Personal
- Work
- Study
- Health
- Shopping

---

## 7.5 Habit Tracking

Users must be able to:

- Create habits
- Edit habits
- Delete habits
- Mark a habit complete for a date
- View current streak
- View completion history
- Select daily or selected-weekday frequency
- Set optional reminder time
- Choose an icon
- Choose an optional color token

Examples:

- Drink water
- Exercise
- Read
- Study
- Sleep early
- Take medicine

---

## 7.6 Notes

Users must be able to:

- Create text notes
- Edit notes
- Delete notes
- Pin notes
- Archive notes
- Search notes
- View recent notes

MVP notes are text-only.

---

## 7.7 Mood Tracking

Users can record one mood per day.

Mood options:

- Excellent
- Good
- Okay
- Low
- Bad

Each entry may include:

- Mood value
- Optional short reason
- Date
- Timestamp

---

## 7.8 Daily Journal

Users must be able to:

- Write one journal entry per day
- Edit the current day's entry
- View previous entries
- Search journal entries
- Answer optional prompts

Suggested prompts:

- What went well today?
- What was difficult?
- What should I improve tomorrow?

---

## 7.9 Goals

Users must be able to:

- Create goals
- Edit goals
- Delete goals
- Set a target date
- Set progress percentage
- Add milestones
- Mark goals completed
- Archive goals

Goal statuses:

- Active
- Completed
- Paused
- Archived

---

## 7.10 Notifications

MVP notifications should be local device notifications.

Supported reminders:

- Task reminder
- Habit reminder
- Morning planning reminder
- Evening review reminder
- Journal reminder

Users must be able to disable reminders globally or individually.

---

## 7.11 Statistics

MVP statistics should show:

- Tasks completed this week
- Habit completion rate
- Current best streak
- Mood distribution
- Journal days completed
- Goal progress summary

Charts must remain simple and readable.

---

## 7.12 Profile and Settings

Users must be able to manage:

- Display name
- Optional profile photo
- Theme
- Notification preferences
- Week start preference
- Time format
- Data export
- Account deletion
- Logout

---

## 8. Navigation Structure

### Authentication Stack

- Splash
- Onboarding
- Login
- Register
- Forgot Password

### Main Tabs

1. Today
2. Tasks
3. Habits
4. Notes
5. Profile

### Secondary Screens

- Create Task
- Edit Task
- Habit Details
- Create Habit
- Mood Check-in
- Journal
- Journal History
- Goals
- Goal Details
- Statistics
- Notifications
- Settings
- About
- Privacy Policy
- Terms
- Delete Account

---

## 9. Non-Functional Requirements

### Performance

- Initial screen should load quickly
- Lists should use optimized React Native list components
- Avoid unnecessary database calls
- Use pagination for long note and journal history
- Cache server data locally

### Security

- Supabase Row Level Security must be enabled
- Service role key must never be included in the app
- User data must be filtered by authenticated user ID
- Sensitive local values should use SecureStore
- Validate all form input

### Accessibility

- Support readable font sizes
- Maintain sufficient contrast
- Add labels for screen readers
- Ensure buttons have adequate touch targets
- Avoid using color as the only status indicator

### Reliability

- Show loading, empty, error, and retry states
- Prevent duplicate submissions
- Handle expired authentication sessions
- Support temporary network failure gracefully

---

## 10. Technical Stack

### Frontend

- Expo
- React Native
- TypeScript
- Expo Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Expo SecureStore
- Expo Notifications

### Backend

- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Supabase Row Level Security
- Supabase Edge Functions only when required

### Development

- Codex or Antigravity
- GitHub
- Expo Go
- Expo Development Build
- EAS Build

---

## 11. Success Metrics

### MVP Success

- User completes onboarding
- User creates at least one task
- User creates at least one habit
- User returns on a second day
- User completes at least one daily check-in
- App remains stable on Android and iOS

### Later Product Metrics

- Daily active users
- Seven-day retention
- Average completed tasks per day
- Habit completion rate
- Journal completion frequency
- Notification opt-in rate

---

## 12. Release Criteria

The MVP is ready for release when:

- Authentication is stable
- All MVP modules work
- RLS policies are tested
- Empty and error states exist
- Android production build succeeds
- iOS production build succeeds
- Account deletion works
- Privacy policy is available
- Notifications work on development builds
- No service keys are exposed
- Critical crashes are resolved
