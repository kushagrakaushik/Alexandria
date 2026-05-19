import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userProfile } from '../data/mockData';
import BookVerseCard from '../components/BookVerseCard';
import { useLibrary } from '../contexts/LibraryContext';
import { LayoutGrid, List, Download, SlidersHorizontal } from 'lucide-react';

const COLUMNS = [
  { id: 'reading', label: 'Currently Reading', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' },
  { id: 'wantToRead', label: 'Want to Read', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', dot: 'bg-purple-400' },
  { id: 'read', label: 'Completed', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
];

export default function Library() {
  const { libraryBooks, addBook, exportLibrary, userSettings } = useLibrary();
  const [viewMode, setViewMode] = useState('grid');
  const [activeGenre, setActiveGenre] = useState('All');

  // Derive all genres from library
  const genres = useMemo(() => {
    const counts = libraryBooks.reduce((acc, book) => {
      if (book.genre) acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});
    return ['All', ...Object.keys(counts).sort()];
  }, [libraryBooks]);

  // Filter books by genre
  const filteredBooks = useMemo(() => {
    if (activeGenre === 'All') return libraryBooks;
    return libraryBooks.filter(b => b.genre === activeGenre);
  }, [libraryBooks, activeGenre]);

  const genreCount = (genre) => {
    if (genre === 'All') return libraryBooks.length;
    return libraryBooks.filter(b => b.genre === genre).length;
  };

  const handleDragStart = (e, book) => {
    e.dataTransfer.setData('bookId', book.id);
  };

  const handleDrop = (e, statusId) => {
    const bookId = e.dataTransfer.getData('bookId');
    const book = libraryBooks.find(b => b.id === bookId);
    if (book && book.readStatus !== statusId) {
      addBook(book, statusId);
    }
  };

  const allowDrop = (e) => e.preventDefault();

  const readCount = libraryBooks.filter(b => b.readStatus === 'read').length;
  const readingCount = libraryBooks.filter(b => b.readStatus === 'reading').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10 pb-20 mt-4">

      {/* Header Panel */}
      <section className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
        <div className="flex items-center gap-6 z-10">
          <img
            src={userSettings.avatarUrl}
            className="w-20 h-20 rounded-full border-4 border-white/10 shadow-2xl object-cover group-hover:scale-105 transition-transform"
          />
          <div>
            <h1 className="text-3xl font-bold mb-1 tracking-tight text-white">{userSettings.name}'s Library</h1>
            <p className="text-gray-400 text-sm">Track, organize, and manage your entire reading journey.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 z-10">
          <div className="flex gap-6 bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{readCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-emerald-400 mt-1">Read</p>
            </div>
            <div className="text-center border-l pl-6 border-white/10">
              <p className="text-3xl font-bold text-white">{readingCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-blue-400 mt-1">Reading</p>
            </div>
            <div className="text-center border-l pl-6 border-white/10">
              <p className="text-3xl font-bold text-white">{libraryBooks.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-purple-400 mt-1">Total</p>
            </div>
          </div>

          <button
            onClick={exportLibrary}
            className="p-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all hover:border-white/20"
            title="Export library"
          >
            <Download size={18} />
          </button>
        </div>
      </section>

      {/* Genre Filter + View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Genre chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={14} className="text-gray-500 shrink-0" />
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activeGenre === genre
                  ? 'bg-purple-500/25 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {genre}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                activeGenre === genre ? 'bg-purple-500/40 text-purple-200' : 'bg-white/10 text-gray-500'
              }`}>
                {genreCount(genre)}
              </span>
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex gap-1.5 bg-white/5 p-1.5 rounded-xl border border-white/5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Genre active label */}
      {activeGenre !== 'All' && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-400"
        >
          Showing <span className="text-white font-semibold">{activeGenre}</span>
          <span className="text-gray-600">·</span>
          <span>{genreCount(activeGenre)} book{genreCount(activeGenre) !== 1 ? 's' : ''}</span>
          <button onClick={() => setActiveGenre('All')} className="text-purple-400 hover:text-purple-300 ml-1 text-xs underline underline-offset-2">
            Clear filter
          </button>
        </motion.div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {COLUMNS.map(col => {
          const books = filteredBooks.filter(b => b.readStatus === col.id);
          return (
            <div
              key={col.id}
              onDragOver={allowDrop}
              onDrop={(e) => handleDrop(e, col.id)}
              className="glass-panel min-h-120 p-6 flex flex-col border border-white/5 bg-linear-to-b from-transparent to-black/20"
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-6">
                <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest ${col.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                  {col.label}
                </div>
                <span className="text-xs text-gray-600 font-medium">{books.length}</span>
              </div>

              {/* Books */}
              <div className={`flex flex-col gap-4 flex-1 ${viewMode === 'grid' ? 'grid grid-cols-2 lg:flex lg:flex-col' : ''}`}>
                <AnimatePresence>
                  {books.map(book => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      key={book.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, book)}
                      className={`cursor-grab active:cursor-grabbing ${viewMode === 'list' ? 'glass-panel p-3 flex gap-4 hover:bg-white/10 transition-colors border-white/5' : ''}`}
                    >
                      {viewMode === 'list' ? (
                        <>
                          <img src={book.coverUrl} className="w-14 h-20 object-cover rounded-lg shadow-lg shrink-0" />
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h3 className="font-bold text-sm text-white truncate">{book.title}</h3>
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{book.author}</p>
                            {book.genre && (
                              <span className="text-[10px] text-purple-400 mt-1.5 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full w-fit">
                                {book.genre}
                              </span>
                            )}
                            <p className="text-xs text-yellow-500 mt-2 flex items-center gap-1">★ {book.rating}</p>
                          </div>
                        </>
                      ) : (
                        <BookVerseCard book={book} />
                      )}
                    </motion.div>
                  ))}
                  {books.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full min-h-50 border-2 border-dashed border-white/8 rounded-xl flex flex-col items-center justify-center text-gray-600 text-sm p-8 text-center gap-3"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-dashed ${col.color.split(' ')[2]} opacity-40`} />
                      {activeGenre !== 'All'
                        ? `No ${activeGenre} books here`
                        : 'Drag books here or add from Discover'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
