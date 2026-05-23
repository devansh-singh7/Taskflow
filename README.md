# 🚀 TaskFlow — Multi-User Task Manager

A modern, production-ready **multi-user task management platform** built with **React, Vite, Zustand, Framer Motion, and DnD Kit**.

TaskFlow provides a fully isolated user experience where every user gets their own dedicated dashboard, secure authentication flow, personal task workspace, analytics, and productivity tools.

---

# ✨ Features

## 🔐 Authentication & User Isolation

* Secure Sign Up / Sign In system
* Persistent login session using JWT-style authentication
* Per-user isolated dashboard and tasks
* Dedicated workspace for every account
* Logout support with session cleanup

---

## ✅ Task Management

* Create, edit, complete, and delete tasks
* Delete button directly inside every task card
* Double-click task card to delete instantly
* Pending tasks automatically stay on top
* Completed tasks move to bottom
* Drag & drop task reordering using DnD Kit
* Search and filter tasks easily

---

## 📊 Productivity & Analytics

* Productivity analytics dashboard
* Task completion tracking
* Category-wise statistics
* Priority-based insights
* Pomodoro timer with sound alerts
* Editable focus duration
* Session history logging

---

## 🎨 UI/UX Features

* Fully responsive modern UI
* Smooth Framer Motion animations
* Collapsible sidebar navigation
* Category management with icon + color picker
* Clean dashboard overview cards
* Fast and optimized Vite setup

---

# 🏗️ Project Architecture

```bash
taskflow/
├── src/
│   ├── store/
│   │   ├── authStore.js
│   │   └── taskStore.js
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AllTasks.jsx
│   │   ├── Analytics.jsx
│   │   └── Pomodoro.jsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Header.jsx
│   │   │
│   │   ├── tasks/
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── AddTaskModal.jsx
│   │   │   └── EditTaskModal.jsx
│   │   │
│   │   └── dashboard/
│   │       ├── StatsCards.jsx
│   │       ├── ProductivityBar.jsx
│   │       ├── PomodoroWidget.jsx
│   │       └── Analytics.jsx
│   │
│   └── layouts/
│       └── MainLayout.jsx
```

---

# 🔒 Multi-User Data Isolation

TaskFlow ensures complete user separation using dynamically scoped localStorage keys.

Each user gets their own dedicated storage namespace:

```js
const getUserStorageKey = () =>
  _currentUserId
    ? `taskflow-tasks-${_currentUserId}`
    : 'taskflow-tasks-guest';
```

After successful login or registration:

```js
reinitForUser(userId)
```

recreates the Zustand store specifically for that user.

✅ Result:

* User A cannot see User B’s tasks
* Dashboards remain completely isolated
* Sessions persist independently

---

# 🔑 Authentication Flow

```text
Register
   ↓
Hash Password + Salt
   ↓
Store User
   ↓
Generate JWT
   ↓
Login Session Created

--------------------------------

Login
   ↓
Verify Email & Password
   ↓
Generate JWT
   ↓
Restore User Session
   ↓
Reinitialize User Store

--------------------------------

Logout
   ↓
Clear JWT & User State
   ↓
Redirect to Login
```

---

# ⚡ Tech Stack

## Frontend

* React.js
* Vite
* Zustand
* React Router
* Framer Motion
* DnD Kit

---

## State Management

* Zustand

---

## Authentication

* JWT-style token system
* Salted password hashing

---

# 🚀 Getting Started

## 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Start Development Server

```bash
npm run dev
```

---

## 4️⃣ Open in Browser

```bash
http://localhost:5173
```

Create an account and start managing tasks 🚀

---

# 📌 Key Functionalities

| Feature                   | Status |
| ------------------------- | ------ |
| Multi-user isolation      | ✅      |
| Persistent authentication | ✅      |
| Add/Edit/Delete tasks     | ✅      |
| Double-click delete       | ✅      |
| Drag & drop sorting       | ✅      |
| Analytics dashboard       | ✅      |
| Pomodoro timer            | ✅      |
| Responsive UI             | ✅      |
| Smooth animations         | ✅      |

---

# 🧠 Production Upgrade Suggestions

For real-world deployment, replace the local mock architecture with:

* Node.js + Express backend
* MongoDB database
* bcrypt password hashing
* jsonwebtoken authentication
* Protected API routes
* Mongoose Task schema with `userId`

---

# 📷 Future Improvements

* Google Authentication
* Real-time sync
* Team collaboration
* Cloud database integration
* Push notifications
* Dark/Light theme switcher
* AI-powered productivity insights

---

# 📄 License

This project is licensed under the MIT License.

---

# ❤️ Built With Passion

Crafted using modern frontend technologies to deliver a scalable and elegant productivity experience.
