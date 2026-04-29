import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Plus, Check } from 'lucide-react';
import { useLibrary } from '../contexts/LibraryContext';

export default function BookVerseCard({ book }) {
  const { addBook, isBookInLibrary } = useLibrary();
  const saved = isBookInLibrary(book.id);

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group relative flex flex-col gap-3"
    >
      <Link to={`/book/${book.id}`} className="relative block aspect-[2/3] w-full rounded-xl overflow-hidden glass-panel p-0 border-white/5">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040406]/95 via-[#040406]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Hover content */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 flex flex-col gap-2">
           <div className="flex items-center gap-1.5 text-yellow-500">
              <Star size={14} fill="currentColor" />
              <span className="text-sm font-bold text-white">{book.rating}</span>
           </div>
           
           <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed hidden sm:block">
             {book.description || 'No description available for this novel.'}
           </p>

           <button 
             onClick={(e) => {
               e.preventDefault();
               addBook(book, 'wantToRead');
             }}
             className={`mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold transition-colors shadow-lg backdrop-blur ${
                saved 
                ? 'bg-white/20 text-white' 
                : 'bg-purple-600 text-white hover:bg-purple-500'
             }`}
           >
             {saved ? <><Check size={14} /> Saved</> : <><Plus size={14} /> Quick Save</>}
           </button>
        </div>
      </Link>

      <div className="px-1">
        <h3 className="font-semibold text-sm md:text-base text-gray-100 line-clamp-1 group-hover:text-purple-300 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
          {book.author}
        </p>
      </div>
    </motion.div>
  );
}
