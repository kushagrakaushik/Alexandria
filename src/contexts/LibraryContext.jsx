import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LibraryContext = createContext();

export const PLAN_TIERS = {
  free: { name: 'Free', bookLimit: 25, color: 'text-gray-400', badge: 'bg-gray-500/20 border-gray-500/30 text-gray-300' },
  pro: { name: 'Pro', bookLimit: 500, color: 'text-purple-400', badge: 'bg-purple-500/20 border-purple-500/30 text-purple-300' },
  enterprise: { name: 'Enterprise', bookLimit: Infinity, color: 'text-amber-400', badge: 'bg-amber-500/20 border-amber-500/30 text-amber-300' },
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function LibraryProvider({ children }) {
  const [libraryBooks, setLibraryBooks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('alexandria_library') || '[]'); }
    catch { return []; }
  });

  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem('alexandria_notifications') || '[]'); }
    catch { return []; }
  });

  const [toastMessage, setToastMessage] = useState(null);

  const [readingGoal, setReadingGoalState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('alexandria_reading_goal') || '{"yearly":24,"monthly":2}'); }
    catch { return { yearly: 24, monthly: 2 }; }
  });

  const [userPlan, setUserPlanState] = useState(() => {
    return localStorage.getItem('alexandria_plan') || 'pro';
  });

  const [userSettings, setUserSettingsState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('alexandria_settings') || JSON.stringify({
        name: 'Alex Reader',
        email: 'alex@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        notificationsEnabled: true,
        emailDigest: true,
        publicProfile: false,
        theme: 'dark',
      }));
    } catch { return {}; }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('alexandria_library', JSON.stringify(libraryBooks));
  }, [libraryBooks]);

  useEffect(() => {
    localStorage.setItem('alexandria_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('alexandria_reading_goal', JSON.stringify(readingGoal));
  }, [readingGoal]);

  useEffect(() => {
    localStorage.setItem('alexandria_plan', userPlan);
  }, [userPlan]);

  useEffect(() => {
    localStorage.setItem('alexandria_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addNotification = useCallback((notification) => {
    setNotifications(prev => {
      const newNotif = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notification,
      };
      return [newNotif, ...prev].slice(0, 50);
    });
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => setNotifications([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const setReadingGoal = (goal) => {
    setReadingGoalState(goal);
  };

  const setUserPlan = (plan) => {
    setUserPlanState(plan);
    addNotification({
      type: 'system',
      title: 'Plan Updated',
      message: `Your plan was updated to ${PLAN_TIERS[plan]?.name || plan}.`,
      icon: 'zap',
    });
  };

  const setUserSettings = (settings) => {
    setUserSettingsState(prev => ({ ...prev, ...settings }));
  };

  // Check achievements after library changes
  const checkAchievements = useCallback((books) => {
    const readCount = books.filter(b => b.readStatus === 'read').length;
    const total = books.length;
    const milestones = [
      { at: 1, title: 'First Chapter', message: 'You added your first book!', icon: 'star' },
      { at: 5, title: 'Bookworm', message: 'Library has 5 books!', icon: 'achievement' },
      { at: 10, title: 'Speed Reader', message: 'You\'ve read 10 books!', icon: 'achievement', check: () => readCount >= 10 },
      { at: 25, title: 'Curator', message: '25 books in your library!', icon: 'achievement' },
    ];
    const achieved = localStorage.getItem('alexandria_achievements') || '[]';
    const achievedSet = new Set(JSON.parse(achieved));

    milestones.forEach(m => {
      const key = `${m.title}`;
      const triggered = m.check ? m.check() : total >= m.at;
      if (triggered && !achievedSet.has(key)) {
        achievedSet.add(key);
        addNotification({ type: 'achievement', title: m.title, message: m.message, icon: m.icon });
      }
    });
    localStorage.setItem('alexandria_achievements', JSON.stringify([...achievedSet]));
  }, [addNotification]);

  const addBook = (book, status = 'wantToRead') => {
    setLibraryBooks(prev => {
      const exists = prev.find(b => b.id === book.id);
      let next;
      if (exists) {
        if (exists.readStatus !== status) {
          const label = status === 'reading' ? 'Currently Reading' : status === 'read' ? 'Completed' : 'Want to Read';
          addNotification({
            type: 'status_changed',
            title: 'Status Updated',
            message: `"${book.title}" moved to ${label}`,
            icon: 'refresh',
          });
          showToast(`Updated "${book.title}" in library!`);
        }
        next = prev.map(b => b.id === book.id ? { ...b, readStatus: status } : b);
      } else {
        addNotification({
          type: 'book_added',
          title: 'Book Added',
          message: `"${book.title}" by ${book.author} added to your library`,
          icon: 'book',
        });
        showToast(`Added "${book.title}" to library!`);
        next = [{ ...book, readStatus: status }, ...prev];
      }
      checkAchievements(next);
      return next;
    });
  };

  const removeBook = (id) => {
    const book = libraryBooks.find(b => b.id === id);
    setLibraryBooks(prev => prev.filter(b => b.id !== id));
    if (book) {
      addNotification({
        type: 'book_removed',
        title: 'Book Removed',
        message: `"${book.title}" removed from your library`,
        icon: 'trash',
      });
    }
    showToast('Book removed from library.');
  };

  const isBookInLibrary = (id) => libraryBooks.some(b => b.id === id);

  const exportLibrary = () => {
    const data = JSON.stringify({ books: libraryBooks, exported: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alexandria-library.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Library exported!');
    addNotification({ type: 'system', title: 'Export Complete', message: 'Your library was exported successfully.', icon: 'download' });
  };

  return (
    <LibraryContext.Provider value={{
      libraryBooks, addBook, removeBook, isBookInLibrary,
      toastMessage, showToast,
      notifications, addNotification, markAllRead, markRead, clearNotifications, unreadCount,
      readingGoal, setReadingGoal,
      userPlan, setUserPlan, PLAN_TIERS,
      userSettings, setUserSettings,
      exportLibrary,
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}
