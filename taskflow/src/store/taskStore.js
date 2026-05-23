import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES = [
  { id: 'work',     name: 'Work',     color: '#6366f1', icon: '💼', bgColor: '#eef2ff' },
  { id: 'personal', name: 'Personal', color: '#ec4899', icon: '✨', bgColor: '#fdf2f8' },
  { id: 'study',    name: 'Study',    color: '#f59e0b', icon: '📚', bgColor: '#fffbeb' },
  { id: 'health',   name: 'Health',   color: '#10b981', icon: '💪', bgColor: '#ecfdf5' },
  { id: 'finance',  name: 'Finance',  color: '#3b82f6', icon: '💰', bgColor: '#eff6ff' },
];

const MOTIVATIONAL_QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Your future is created by what you do today.", author: "Robert Kiyosaki" },
  { text: "Small steps every day lead to big results.", author: "Unknown" },
  { text: "Productivity is never an accident.", author: "Paul J. Meyer" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
];

const TASK_EMOJIS = {
  work:     ['💼','📊','📈','🖥️','📧','🤝','📋','⚡'],
  personal: ['🌟','🎯','💡','🏠','🛒','📱','🎨','✈️'],
  study:    ['📚','✏️','🎓','📝','🔬','💻','📖','🧠'],
  health:   ['💪','🏃','🥗','😴','🧘','🏋️','🍎','💊'],
  finance:  ['💰','📊','💳','🏦','📈','💵','🔐','🎯'],
};

// ─── User-scoped storage key ──────────────────────────────────────────────────
// Each user gets their own localStorage key so data is 100% isolated.
let _currentUserId = null;

export const setCurrentUser = (userId) => { _currentUserId = userId; };

const getUserStorageKey = () =>
  _currentUserId ? `taskflow-tasks-${_currentUserId}` : 'taskflow-tasks-guest';

// ─── Store factory ────────────────────────────────────────────────────────────
// We create the store with a dynamic storage key so each user has isolated data.

const createTaskStore = () => create(
  persist(
    (set, get) => ({
      tasks: [],
      categories: [...DEFAULT_CATEGORIES],
      filter: { status: 'all', priority: 'all', category: 'all', search: '' },
      currentQuoteIndex: Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length),

      // ── Tasks CRUD ──────────────────────────────────────────────────────────

      addTask: (task) => {
        const emojiPool = TASK_EMOJIS[task.categoryId] || TASK_EMOJIS.work;
        const emoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
        const newTask = {
          id: `task_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          ...task,
          emoji,
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
          order: get().tasks.length,
        };
        set(s => ({ tasks: [newTask, ...s.tasks] })); // prepend so new tasks appear first
        return newTask;
      },

      updateTask: (id, updates) =>
        set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates } : t) })),

      deleteTask: (id) =>
        set(s => ({ tasks: s.tasks.filter(t => t.id !== id) })),

      toggleTask: (id) =>
        set(s => ({
          tasks: s.tasks.map(t =>
            t.id === id
              ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null }
              : t
          ),
        })),

      reorderTasks: (newOrder) => set({ tasks: newOrder }),

      // ── Categories ─────────────────────────────────────────────────────────

      addCategory: (cat) =>
        set(s => ({ categories: [...s.categories, { id: `cat_${Date.now()}`, ...cat }] })),

      deleteCategory: (id) =>
        set(s => ({ categories: s.categories.filter(c => c.id !== id) })),

      // ── Filters ────────────────────────────────────────────────────────────

      setFilter: (key, value) =>
        set(s => ({ filter: { ...s.filter, [key]: value } })),

      resetFilters: () =>
        set({ filter: { status: 'all', priority: 'all', category: 'all', search: '' } }),

      // ── Computed ───────────────────────────────────────────────────────────

      getFilteredTasks: () => {
        const { tasks, filter } = get();
        return tasks.filter(t => {
          if (filter.status   === 'completed' && !t.completed) return false;
          if (filter.status   === 'pending'   &&  t.completed) return false;
          if (filter.priority !== 'all'       && t.priority !== filter.priority) return false;
          if (filter.category !== 'all'       && t.categoryId !== filter.category) return false;
          if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
          return true;
        });
      },

      getStats: () => {
        const { tasks } = get();
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const overdue = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
        const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, pending, overdue, productivity };
      },

      getRandomQuote: () => {
        const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
        set({ currentQuoteIndex: idx });
      },

      getCurrentQuote: () => MOTIVATIONAL_QUOTES[get().currentQuoteIndex],

      getSmartSuggestions: () =>
        ["Review your goals for this week","Schedule a 10-minute break","Send that follow-up email",
         "Drink a glass of water","Clear your inbox","Plan tomorrow's top 3 tasks",
         "Take a 5-minute stretch break","Review your notes from last meeting"]
          .sort(() => Math.random() - 0.5).slice(0, 3),
    }),
    {
      name: getUserStorageKey(), // ← user-scoped key!
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ tasks: s.tasks, categories: s.categories }),
    }
  )
);

// Singleton store — re-initialised on login via reinitForUser()
let _store = createTaskStore();
export const useTaskStore = (...args) => _store(...args);

/**
 * Call this right after login/register with the user's ID.
 * It re-creates the store bound to that user's localStorage key,
 * so tasks are fully isolated per account.
 */
export const reinitForUser = (userId) => {
  setCurrentUser(userId);
  _store = createTaskStore();
};

export { MOTIVATIONAL_QUOTES, TASK_EMOJIS, DEFAULT_CATEGORIES };
