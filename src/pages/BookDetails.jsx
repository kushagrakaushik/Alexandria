import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, Heart, Bookmark, MessageSquare, Plus } from 'lucide-react';
import { fetchBookById, fetchBooksByGenre } from '../api/books';
import { useLibrary } from '../contexts/LibraryContext';
import BookRow from '../components/BookRow';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addBook, isBookInLibrary } = useLibrary();

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      setLoading(true);
      const data = await fetchBookById(id);
      setBook(data);
      if (data && data.genre) {
        const relatedBooks = await fetchBooksByGenre(data.genre);
        setRelated(relatedBooks.filter(b => b.id !== id).slice(0, 10));
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-purple-400 animate-pulse font-medium text-lg">Summoning archives...</div>;
  if (!book) return <div className="p-20 text-center text-gray-400">Book not found in the void.</div>;

  const saved = isBookInLibrary(book.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="relative z-10 space-y-16 pb-20 mt-4"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold tracking-wider hover:-translate-x-1 duration-300">
        <ChevronLeft size={16} /> Back to Hub
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
        {/* Massive Cover */}
        <div className="w-full lg:w-[400px] shrink-0">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
            className="relative aspect-[2/3] w-full max-w-[400px] mx-auto md:mx-0 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 group"
          >
            <img src={book.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={book.title} />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-white/10 pointer-events-none" />
          </motion.div>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button onClick={() => addBook(book, 'reading')} className="col-span-2 btn-primary py-4 text-base tracking-wide flex items-center gap-2">
               <Bookmark size={18} /> {saved ? 'Update Status' : 'Start Reading'}
            </button>
            <button onClick={() => addBook(book, 'wantToRead')} className="btn-secondary py-3 flex items-center gap-2">
               <Plus size={18} /> To Read
            </button>
            <button onClick={() => addBook(book, 'read')} className="btn-secondary py-3 flex items-center gap-2">
               <Heart size={18} /> Favorite
            </button>
          </div>
          
          {/* Quick Stats Box */}
          <div className="mt-8 glass-panel p-6 flex justify-between text-center divide-x divide-white/10">
             <div className="flex-1">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Rating</p>
                <p className="text-2xl font-bold text-white flex items-center justify-center gap-1"><Star size={16} className="text-yellow-500" fill="currentColor"/> {book.rating}</p>
             </div>
             <div className="flex-1">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Published</p>
                <p className="text-xl font-bold text-white">{book.year !== 'Unknown' ? book.year : '--'}</p>
             </div>
             <div className="flex-1">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Pages</p>
                <p className="text-xl font-bold text-white">~350</p>
             </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="flex-1 space-y-10 lg:mt-4">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 font-medium mb-4 uppercase tracking-widest">
              {book.genre}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4">
              {book.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl text-gray-400 font-light">
              by <span className="text-white hover:text-purple-400 cursor-pointer transition-colors border-b border-purple-500/30">{book.author}</span>
            </motion.p>
          </div>
          
          <div className="relative">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2"><Bookmark size={16}/> Synopsis</h3>
            <p className="text-lg text-gray-300 leading-relaxed max-w-4xl font-light">
              {book.description}
            </p>
          </div>

          <div className="relative pt-10 border-t border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2"><MessageSquare size={16}/> Community Thoughts</h3>
            <div className="space-y-4">
              {/* Mock Reviews */}
              {['A masterpiece of modern storytelling. The pacing was absolutely incredible.', 'Couldn\'t put it down. Finished it in a single weekend. Highly recommended for fans of the genre!'].map((review, i) => (
                <div key={i} className="glass-panel p-5 hover:bg-white/5 transition-colors">
                   <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${i === 0 ? 'from-purple-500 to-blue-500' : 'from-pink-500 to-orange-500'}`} />
                         <span className="font-medium text-sm text-gray-200">User_{Math.floor(Math.random() * 1000)}</span>
                      </div>
                      <div className="flex text-yellow-500"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                   </div>
                   <p className="text-sm text-gray-400">{review}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
         <div className="pt-16 border-t border-white/5">
            <BookRow title="You Might Also Like" books={related} onSeeAll={null} />
         </div>
      )}
    </motion.div>
  );
}
