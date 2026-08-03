# LifeOS — Build Start Checklist

## Accounts

- [ ] GitHub account
- [ ] Expo account
- [ ] Supabase account
- [ ] Google Play Console later
- [ ] Apple Developer account later

## Local Tools

- [ ] Node.js LTS
- [ ] Git
- [ ] VS Code, Codex, or Antigravity
- [ ] Expo Go on Android
- [ ] Expo Go on iPhone when available

## Project Setup

- [ ] Create Expo project
- [ ] Start Git repository
- [ ] Create GitHub repository
- [ ] Add `.gitignore`
- [ ] Add `.env.example`
- [ ] Install dependencies
- [ ] Configure Expo Router
- [ ] Test app in Expo Go

## Supabase Setup

- [ ] Create project
- [ ] Save project URL
- [ ] Save anonymous key
- [ ] Add environment variables
- [ ] Apply schema
- [ ] Enable RLS
- [ ] Add policies
- [ ] Test user isolation
- [ ] Generate TypeScript types

## Design Setup

- [ ] Approve color palette
- [ ] Approve typography
- [ ] Approve navigation
- [ ] Create Stitch screen concepts
- [ ] Save screenshots
- [ ] Implement reusable UI components first

## Recommended First Coding Order

1. Project foundation
2. Theme
3. Supabase
4. Authentication
5. Today dashboard shell
6. Tasks
7. Habits
8. Notes
9. Mood
10. Journal
11. Goals
12. Notifications
13. Statistics
14. Release preparation

## First Command

```bash
npx create-expo-app@latest lifeos
cd lifeos
npx expo start
```

## First Git Commit

```bash
git init
git add .
git commit -m "chore: initialize LifeOS Expo project"
```
