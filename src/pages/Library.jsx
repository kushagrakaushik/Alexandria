import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userProfile } from '../data/mockData';
import BookVerseCard from '../components/BookVerseCard'; 
import { useLibrary } from '../contexts/LibraryContext';
import { LayoutGrid, List } from 'lucide-react';

export default function Library() {
  const { libraryBooks, addBook } = useLibrary();
  const [viewMode, setViewMode] = useState('grid');
  
  const columns = [
    { id: 'reading', label: 'Currently Reading', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { id: 'wantToRead', label: 'Want to Read', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'read', label: 'Completed', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
  ];

  const handleDragStart = (e, book) => {
    e.dataTransfer.setData('bookId', book.id);
  };

  const handleDrop = (e, statusId) => {
    const bookId = e.dataTransfer.getData('bookId');
    const book = libraryBooks.find(b => b.id === bookId);
    if (book && book.readStatus !== statusId) {
      addBook(book, statusId); // update status natively
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 pb-20 mt-4">
      
      <section className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
        <div className="flex items-center gap-6 z-10">
          <img src={userProfile.avatarUrl} className="w-24 h-24 rounded-full border-4 border-white/10 shadow-2xl object-cover relative group-hover:scale-105 transition-transform" />
          <div>
             <h1 className="text-3xl font-bold mb-1 tracking-tight text-white">Your Universe</h1>
             <p className="text-gray-400">Track, organize, and manage your entire reading journey.</p>
          </div>
        </div>
        
        <div className="flex gap-4 sm:gap-8 z-10 bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
           <div className="text-center"><p className="text-3xl font-bold text-white">{libraryBooks.filter(b=>b.readStatus==='read').length}</p><p className="text-[10px] sm:text-xs uppercase tracking-widest text-emerald-400 mt-1">Read</p></div>
           <div className="text-center border-l gap-4 pl-4 sm:pl-8 border-white/10"><p className="text-3xl font-bold text-white">{libraryBooks.filter(b=>b.readStatus==='reading').length}</p><p className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-400 mt-1">Reading</p></div>
           <div className="text-center border-l gap-4 pl-4 sm:pl-8 border-white/10"><p className="text-3xl font-bold text-white">{libraryBooks.length}</p><p className="text-[10px] sm:text-xs uppercase tracking-widest text-purple-400 mt-1">Total</p></div>
        </div>
      </section>

      <div className="flex justify-end gap-2 px-2">
        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-purple-500/20 text-purple-300 shadow-inner border border-purple-500/30' : 'text-gray-500 hover:text-white border border-transparent hover:bg-white/5'}`}><LayoutGrid size={20}/></button>
        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-purple-500/20 text-purple-300 shadow-inner border border-purple-500/30' : 'text-gray-500 hover:text-white border border-transparent hover:bg-white/5'}`}><List size={20}/></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {columns.map(col => {
           const books = libraryBooks.filter(b => b.readStatus === col.id);
           return (
             <div 
               key={col.id} 
               onDragOver={allowDrop} 
               onDrop={(e) => handleDrop(e, col.id)}
               className="glass-panel min-h-[500px] p-6 flex flex-col border border-white/5 bg-gradient-to-b from-transparent to-black/20"
             >
                <div className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest mb-6 inline-flex self-start ${col.color}`}>
                   {col.label} ({books.length})
                </div>

                <div className={`flex flex-col gap-4 flex-1 ${viewMode === 'grid' ? 'grid grid-cols-2 lg:flex lg:flex-col' : ''}`}>
                   <AnimatePresence>
                     {books.map(book => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          key={book.id} 
                          draggable 
                          onDragStart={(e) => handleDragStart(e, book)}
                          className={`cursor-grab active:cursor-grabbing ${viewMode==='list' ? 'glass-panel p-3 flex gap-4 hover:bg-white/10 transition-colors border-white/5' : ''}`}
                        >
                          {viewMode === 'list' ? (
                             <>
                               <img src={book.coverUrl} className="w-16 h-24 object-cover rounded-md shadow-lg shrink-0" />
                               <div className="flex-1 min-w-0 flex flex-col justify-center">
                                 <h3 className="font-bold text-sm text-white truncate">{book.title}</h3>
                                 <p className="text-xs text-gray-400 mt-1 truncate">{book.author}</p>
                                 <p className="text-xs text-yellow-500 mt-2 flex items-center gap-1">★ {book.rating}</p>
                               </div>
                             </>
                          ) : (
                             <BookVerseCard book={book} />
                          )}
                        </motion.div>
                     ))}
                     {books.length === 0 && (
                        <div className="h-full border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-500 text-sm p-10 text-center bg-black/20">
                           Drag books here or add from the Discover page.
                        </div>
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
