# LifeOS — Design System

## 1. Design Direction

LifeOS should feel:

- Calm
- Modern
- Minimal
- Encouraging
- Personal
- Easy to scan
- Suitable for repeated daily use

Avoid:

- Excessive gradients
- Too many bright colors
- Heavy shadows
- Tiny text
- Crowded dashboards
- Decorative elements that reduce clarity

---

## 2. Design Personality

The app should combine:

- Apple Health-style clarity
- Todo app simplicity
- Soft wellness visual language
- Modern productivity structure

The interface should feel useful rather than playful, but still friendly.

---

## 3. Color Tokens

Use design tokens instead of hardcoded values.

## Light Theme

```text
background:        #F7F8FA
surface:           #FFFFFF
surfaceSecondary:  #F0F2F5
textPrimary:       #171A1F
textSecondary:     #667085
textMuted:         #98A2B3
border:            #E4E7EC
primary:           #5B67F1
primaryPressed:    #4652D9
success:           #12B76A
warning:           #F79009
danger:            #F04438
info:              #2E90FA
```

## Dark Theme

```text
background:        #0F1115
surface:           #181B21
surfaceSecondary:  #22262E
textPrimary:       #F5F7FA
textSecondary:     #B4BBC6
textMuted:         #7E8794
border:            #303641
primary:           #7C86FF
primaryPressed:    #626CE8
success:           #32D583
warning:           #FDB022
danger:            #FF6B61
info:              #53B1FD
```

## Mood Colors

```text
excellent: #12B76A
good:      #84CC16
okay:      #FACC15
low:       #FB923C
bad:       #F04438
```

Use mood colors as accents, not full-screen backgrounds.

---

## 4. Typography

Recommended font:

```text
Inter
```

Alternative:

```text
System font for initial MVP
```

### Type Scale

```text
Display:        32 / 38, Bold
Heading 1:      28 / 34, Bold
Heading 2:      24 / 30, Semibold
Heading 3:      20 / 26, Semibold
Title:          18 / 24, Semibold
Body Large:     17 / 24, Regular
Body:           15 / 22, Regular
Body Small:     13 / 18, Regular
Caption:        12 / 16, Medium
Button:         15 / 20, Semibold
```

Do not use more than three font weights on one screen.

---

## 5. Spacing System

Use a 4-point base system.

```text
4
8
12
16
20
24
32
40
48
64
```

Common usage:

- Screen horizontal padding: 20
- Card internal padding: 16
- Section gap: 24
- Element gap: 12
- Small inline gap: 8

---

## 6. Radius

```text
Small:   8
Medium:  12
Large:   16
XL:      24
Pill:    999
```

Recommended:

- Inputs: 12
- Buttons: 12
- Cards: 16
- Bottom sheets: 24 top corners
- Chips: pill

---

## 7. Shadows

Keep shadows subtle.

### Light Theme

```text
shadow opacity: 0.06–0.10
shadow radius: 8–16
elevation: 1–3
```

### Dark Theme

Prefer border and surface contrast over strong shadows.

---

## 8. Icons

Use one icon family consistently.

Recommended:

- Lucide React Native
- Expo Vector Icons as fallback

Guidelines:

- 20–24 px for normal actions
- 16–18 px for small metadata
- 28–32 px for feature illustrations
- Use outlined icons by default
- Filled icons only for active tab states

---

## 9. Buttons

## Primary Button

- Full-width where appropriate
- Primary background
- White text
- Height: 48–52
- Radius: 12
- Clear pressed state
- Loading state

## Secondary Button

- Surface background
- Border
- Primary text

## Destructive Button

- Danger accent
- Confirmation required for irreversible actions

## Icon Button

- Minimum 44 × 44 touch target

---

## 10. Inputs

Inputs should include:

- Label
- Optional helper text
- Error message
- Focus state
- Disabled state
- Clear visual border
- Minimum height of 48

Do not rely only on placeholder text as the label.

---

## 11. Cards

Use cards for grouped information, not every element.

Card types:

- Progress card
- Task card
- Habit card
- Mood card
- Goal card
- Empty-state card

Standard card:

```text
background: surface
radius: 16
padding: 16
border: 1px subtle
```

---

## 12. Bottom Navigation

Tabs:

1. Today
2. Tasks
3. Habits
4. Notes
5. Profile

Guidelines:

- Show label and icon
- Active state uses primary color
- Inactive state uses muted text
- Respect safe-area inset
- Avoid overly tall tab bar

---

## 13. Floating Quick Add

Use one primary floating action button where it helps.

Tap opens a bottom sheet:

- Add Task
- Add Habit
- Add Note
- Record Mood
- Write Journal

Do not place multiple floating buttons on the same screen.

---

## 14. Screen Layout

Standard screen structure:

```text
Safe Area
Header
Optional Summary
Main Scrollable Content
Primary Action
Bottom Navigation
```

### Header Types

- Large title
- Back title
- Title with action
- Greeting header

---

## 15. Today Dashboard Layout

Recommended order:

1. Greeting and date
2. Daily progress card
3. Tasks section
4. Habits section
5. Mood and journal row
6. Active goal card
7. Recent note

Avoid showing too much history on the Today screen.

---

## 16. Task Card Design

Each task card should show:

- Completion control
- Title
- Due time
- Category
- Priority indicator

Swipe actions can be added later. MVP should use explicit menus for safety and predictability.

---

## 17. Habit Card Design

Each habit card should show:

- Icon
- Habit name
- Current streak
- Completion control
- Optional progress count

Completion should provide light haptic feedback.

---

## 18. Empty States

Each empty state should contain:

- Simple icon or illustration
- One clear sentence
- One primary action

Example:

```text
No tasks for today
You're all clear. Add a task when you're ready.
[Add Task]
```

---

## 19. Feedback and Motion

Use motion sparingly:

- 150–250 ms transitions
- Press scale
- Checkmark animation
- Progress fill
- Bottom-sheet slide
- Fade for empty-state changes

Use haptics for:

- Completing task
- Completing habit
- Saving mood
- Important destructive confirmation

---

## 20. Accessibility

- Minimum touch target: 44 × 44
- Body text should not be smaller than 14
- Support dynamic text where possible
- Maintain contrast
- Provide accessibility labels
- Avoid color-only status communication
- Support reduced motion later

---

## 21. Stitch Design Prompt

```text
Design a modern cross-platform mobile application named LifeOS.

LifeOS is a calm personal daily management app combining tasks, habits, notes, mood tracking, journaling, goals, and reminders.

Design style:
- Minimal, modern, calm, premium
- Soft productivity and wellness aesthetic
- Clean white or near-white surfaces in light mode
- Deep neutral surfaces in dark mode
- Primary accent: indigo #5B67F1
- Rounded cards with 16px radius
- Subtle borders and shadows
- Inter typography
- Clear spacing based on a 4px system
- Accessible contrast
- Bottom navigation with Today, Tasks, Habits, Notes, and Profile
- One floating quick-add action

Create the following screens:
1. Splash
2. Onboarding
3. Login
4. Register
5. Today dashboard
6. Task list
7. Create task
8. Habit list
9. Create habit
10. Notes list
11. Note editor
12. Mood check-in
13. Journal
14. Goals
15. Statistics
16. Profile
17. Settings

The Today dashboard should include:
- Greeting and current date
- Daily progress summary
- Today's tasks
- Today's habits
- Mood shortcut
- Journal shortcut
- Active goal
- Quick-add button

Keep screens realistic for Expo React Native implementation. Avoid web-style sidebars, tiny controls, excessive gradients, and overly complex dashboards.
```

---

## 22. Codex Design Instruction

```text
Follow DESIGN_SYSTEM.md exactly.

Do not invent new colors, spacing values, typography sizes, radii, or component styles unless the design system explicitly allows it.

Build reusable React Native components for:
- Screen
- AppHeader
- Card
- Button
- IconButton
- TextField
- EmptyState
- ProgressBar
- SectionHeader
- TaskCard
- HabitCard
- MoodSelector
- BottomSheetAction
- LoadingState
- ErrorState

All screens must support light and dark themes.
```
