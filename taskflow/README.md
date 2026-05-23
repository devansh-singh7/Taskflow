# TaskFlow — Multi-User Task Manager

A production-ready, fully isolated multi-user task management app built with **React + Vite + Zustand**.

---

## Architecture

```
taskflow/
├── src/
│   ├── store/
│   │   ├── authStore.js      ← JWT auth, bcrypt-style password hashing, per-user isolation
│   │   └── taskStore.js      ← Per-user scoped localStorage, reinitForUser()
│   ├── pages/
│   │   ├── Login.jsx         ← Sign up / Sign in with validation
│   │   ├── Dashboard.jsx     ← Main overview with stats, tasks, pomodoro
│   │   ├── AllTasks.jsx      ← Full task list with search & filters
│   │   ├── Analytics.jsx     ← Completion rate, speed, per-category/priority stats
│   │   └── Pomodoro.jsx      ← Focus timer with sound, editable duration, session log
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx   ← Collapsible nav, categories, user info, logout
│   │   │   └── Header.jsx    ← Centred search, Add Task (left), AI/Voice (right)
│   │   ├── tasks/
│   │   │   ├── TaskCard.jsx  ← Delete btn + double-click delete, confirm stage, animations
│   │   │   ├── TaskList.jsx  ← DnD sort, pending-first, completed separator
│   │   │   ├── AddTaskModal.jsx
│   │   │   └── EditTaskModal.jsx
│   │   └── dashboard/
│   │       ├── StatsCards.jsx
│   │       ├── ProductivityBar.jsx  ← Big quote card
│   │       ├── PomodoroWidget.jsx
│   │       └── Analytics.jsx
│   └── layouts/
│       └── MainLayout.jsx    ← Page router, add-task modal state
```

---

## Multi-User Isolation

**Problem solved:** Each user's tasks live under a unique localStorage key:

```js
// taskStore.js
const getUserStorageKey = () =>
  _currentUserId ? `taskflow-tasks-${_currentUserId}` : 'taskflow-tasks-guest';
```

After login/register, `reinitForUser(userId)` recreates the Zustand store bound
to that user's key — so User A and User B **never share any data**.

---

## Authentication Flow

```
Register → hash(password + salt) → store in tf-users[] → issue JWT
Login    → lookup email → verify hash → issue JWT → reinitForUser(id)
Reload   → checkAuth() verifies JWT expiry → reinitForUser(id) from stored session
Logout   → clear JWT + user → redirect to Login
```

JWT is a simulated HS256 token (header.payload.signature in base64).
Password hashing uses a deterministic salted hash (mirrors bcrypt pattern).

---

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173 — create an account and start adding tasks.

---

## Key Features

- ✅ Per-user isolated dashboard & tasks
- ✅ Persistent login (7-day JWT)
- ✅ Add Task via header button OR inside My Tasks
- ✅ Delete button on every task card (2-click confirm)
- ✅ Double-click any task card to delete instantly
- ✅ New tasks appear at top; completed tasks sink to bottom
- ✅ Draggable task reordering (DnD Kit)
- ✅ Collapsible sidebar with page routing
- ✅ Full Analytics page (completion rate + speed)
- ✅ Pomodoro timer with sound alert + editable duration
- ✅ Add Category modal with icon + colour picker
- ✅ Smooth Framer Motion animations throughout

---

## Production Notes

For a real backend, replace `authStore.js` and `taskStore.js` with:
- **Express + MongoDB** API (see architecture in the project spec)
- **bcrypt** for password hashing
- **jsonwebtoken** for JWT signing/verification
- **Mongoose** Task schema with `userId` field for DB-level isolation
