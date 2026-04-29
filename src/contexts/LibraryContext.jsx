import React, { createContext, useContext, useState, useEffect } from 'react';

const LibraryContext = createContext();

export function LibraryProvider({ children }) {
  const [libraryBooks, setLibraryBooks] = useState(() => {
    const saved = localStorage.getItem('alexandria_library');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('alexandria_library', JSON.stringify(libraryBooks));
  }, [libraryBooks]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000); // hide after 3 sec
  };

  const addBook = (book, status = 'wantToRead') => {
    setLibraryBooks(prev => {
      const exists = prev.find(b => b.id === book.id);
      if (exists) {
        showToast(`Updated "${book.title}" in library!`);
        return prev.map(b => b.id === book.id ? { ...b, readStatus: status } : b);
      }
      showToast(`Added "${book.title}" to library!`);
      return [{ ...book, readStatus: status }, ...prev];
    });
  };

  const removeBook = (id) => {
    setLibraryBooks(prev => prev.filter(b => b.id !== id));
    showToast("Book removed from library.");
  };

  const isBookInLibrary = (id) => {
    return libraryBooks.some(b => b.id === id);
  };

  return (
    <LibraryContext.Provider value={{ libraryBooks, addBook, removeBook, isBookInLibrary, toastMessage, showToast }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}
