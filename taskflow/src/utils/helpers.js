import { formatDistanceToNow, format, isAfter, isBefore, addDays } from 'date-fns';

export const formatDueDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return format(date, 'MMM dd, yyyy');
};

export const getRelativeTime = (dateStr) => {
  if (!dateStr) return null;
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
};

export const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  return isBefore(new Date(dateStr), new Date());
};

export const isDueSoon = (dateStr) => {
  if (!dateStr) return false;
  const due = new Date(dateStr);
  const now = new Date();
  const soon = addDays(now, 2);
  return isAfter(due, now) && isBefore(due, soon);
};

export const getPriorityConfig = (priority) => {
  const configs = {
    high: {
      label: 'High',
      color: '#ef4444',
      bg: '#fef2f2',
      darkBg: '#450a0a',
      border: '#fecaca',
      dot: '🔴',
      badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
    },
    medium: {
      label: 'Medium',
      color: '#f59e0b',
      bg: '#fffbeb',
      darkBg: '#451a03',
      border: '#fde68a',
      dot: '🟡',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    },
    low: {
      label: 'Low',
      color: '#10b981',
      bg: '#ecfdf5',
      darkBg: '#052e16',
      border: '#a7f3d0',
      dot: '🟢',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
    },
  };
  return configs[priority] || configs.medium;
};

export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const groupTasksByCategory = (tasks, categories) => {
  const groups = {};
  categories.forEach(cat => {
    groups[cat.id] = { category: cat, tasks: [] };
  });
  tasks.forEach(task => {
    if (groups[task.categoryId]) {
      groups[task.categoryId].tasks.push(task);
    } else {
      if (!groups['other']) groups['other'] = { category: { id: 'other', name: 'Other', color: '#94a3b8', icon: '📌' }, tasks: [] };
      groups['other'].tasks.push(task);
    }
  });
  return Object.values(groups).filter(g => g.tasks.length > 0);
};

export const getProductivityEmoji = (percentage) => {
  if (percentage >= 80) return '🔥';
  if (percentage >= 60) return '⚡';
  if (percentage >= 40) return '📈';
  if (percentage >= 20) return '🌱';
  return '💪';
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
