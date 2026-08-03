# LifeOS — App Workflow and Screen Map

## 1. App Entry Flow

```text
App Launch
   ↓
Splash Screen
   ↓
Check Local Session
   ├── No Session → Onboarding or Login
   └── Valid Session → Today Dashboard
```

---

## 2. Authentication Flow

```text
Welcome
   ↓
Login
   ├── Register
   ├── Forgot Password
   └── Successful Login
           ↓
       Today Dashboard
```

### Registration Flow

```text
Register
   ↓
Enter Name, Email, Password
   ↓
Validate Form
   ↓
Create Supabase Auth User
   ↓
Create Profile Record
   ↓
Show Success State
   ↓
Today Dashboard
```

---

## 3. Onboarding Flow

### Screen 1 — Organize Your Day

Explain tasks and daily planning.

### Screen 2 — Build Better Habits

Explain habit tracking and streaks.

### Screen 3 — Reflect and Improve

Explain mood and journal features.

### Screen 4 — Reminder Setup

Explain why notifications help.

### Screen 5 — Start LifeOS

Create account or continue to login.

---

## 4. Main Navigation

### Bottom Tabs

```text
Today | Tasks | Habits | Notes | Profile
```

### Floating Quick Add

From supported screens:

```text
+ Task
+ Habit
+ Note
+ Mood
+ Journal
```

---

## 5. Today Dashboard Workflow

```text
Today Dashboard
   ├── View Daily Summary
   ├── Complete Task
   ├── Complete Habit
   ├── Record Mood
   ├── Open Journal
   ├── Open Goal
   └── Use Quick Add
```

### Dashboard Sections

1. Greeting and date
2. Progress overview
3. Today's tasks
4. Today's habits
5. Mood check-in
6. Journal prompt
7. Active goal
8. Recent note

---

## 6. Task Workflow

### Task List

```text
Tasks
   ├── Today
   ├── Upcoming
   ├── Overdue
   └── Completed
```

### Create Task

```text
Tap Add Task
   ↓
Enter Title
   ↓
Optional Description
   ↓
Select Date and Time
   ↓
Select Priority
   ↓
Select Category
   ↓
Optional Reminder
   ↓
Save
```

### Task Actions

- Complete
- Edit
- Delete
- Reschedule
- Duplicate later
- Restore if completed

---

## 7. Habit Workflow

### Habit List

```text
Habits
   ├── Today's Habits
   ├── All Habits
   └── Archived Habits
```

### Create Habit

```text
Tap Add Habit
   ↓
Enter Habit Name
   ↓
Select Icon
   ↓
Choose Daily or Weekdays
   ↓
Set Optional Reminder
   ↓
Save
```

### Habit Completion

```text
Tap Completion Button
   ↓
Create Habit Log
   ↓
Update Progress
   ↓
Recalculate Streak
```

---

## 8. Notes Workflow

```text
Notes
   ├── Search
   ├── Pinned
   ├── Recent
   └── Archived
```

### Create Note

```text
Tap Add Note
   ↓
Enter Title
   ↓
Enter Content
   ↓
Pin Option
   ↓
Save
```

---

## 9. Mood Workflow

```text
Today Dashboard
   ↓
Tap Mood
   ↓
Select Mood
   ↓
Add Optional Reason
   ↓
Save Daily Mood
```

Only one mood entry should exist per user per date.

---

## 10. Journal Workflow

```text
Today Dashboard
   ↓
Open Journal
   ↓
View Daily Prompts
   ↓
Write Entry
   ↓
Save Draft Automatically
   ↓
Submit / Save
```

### Journal History

```text
Journal History
   ├── Calendar View Later
   ├── List View
   ├── Search
   └── Open Entry
```

---

## 11. Goal Workflow

```text
Goals
   ├── Active
   ├── Completed
   ├── Paused
   └── Archived
```

### Create Goal

```text
Tap Add Goal
   ↓
Enter Goal Title
   ↓
Optional Description
   ↓
Set Target Date
   ↓
Add Milestones
   ↓
Save
```

### Update Goal

```text
Open Goal
   ↓
Update Progress
   ↓
Complete Milestone
   ↓
Mark Goal Complete
```

---

## 12. Profile and Settings Workflow

```text
Profile
   ├── Edit Profile
   ├── Statistics
   ├── Theme
   ├── Notifications
   ├── Data Export
   ├── Privacy
   ├── Delete Account
   └── Logout
```

---

## 13. Empty States

Each module must have a useful empty state.

### Tasks

> No tasks yet. Add your first task and start planning your day.

### Habits

> Create a habit you want to repeat consistently.

### Notes

> Capture an idea, reminder, or important thought.

### Journal

> Your journal is empty. Write your first daily reflection.

### Goals

> Create a meaningful goal and track your progress.

---

## 14. Error States

Use clear messages:

- Unable to connect
- Session expired
- Failed to save
- Permission denied
- Notification permission not granted
- Data could not be loaded

Every recoverable error should include a retry action.

---

## 15. Recommended Build Order

1. Expo project setup
2. Design tokens and reusable UI
3. Supabase client setup
4. Authentication
5. Protected routing
6. Profile
7. Today dashboard shell
8. Tasks
9. Habits
10. Notes
11. Mood
12. Journal
13. Goals
14. Notifications
15. Statistics
16. Settings
17. Testing
18. Production builds
