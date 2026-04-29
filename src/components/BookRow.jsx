import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import BookVerseCard from './BookVerseCard';

export default function BookRow({ title, books, onSeeAll }) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.8;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!books || books.length === 0) return null;

  return (
    <div className="space-y-4 relative group/row w-full">
      <div className="flex justify-between items-end px-2 md:px-0">
        <h2 className="text-2xl font-bold tracking-tight text-white/90">{title}</h2>
        {onSeeAll && (
          <button 
            onClick={onSeeAll}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 transition-all group-hover/row:translate-x-1"
          >
            See all <ChevronRight size={16} />
          </button>
        )}
      </div>

      <div className="relative">
        {/* Left gradient fade / button */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg-base)] via-[var(--bg-base)]/80 to-transparent z-10 opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:flex items-center pointer-events-none">
          <button 
            onClick={() => scroll('left')}
            className="ml-2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur text-white shadow-lg transition-transform hover:scale-110 pointer-events-auto"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div 
          ref={rowRef}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-2 scrollbar-hide px-2 md:px-0 snap-x snap-mandatory"
        >
          {books.map(book => (
             <div key={book.id} className="snap-start shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
                <BookVerseCard book={book} />
             </div>
          ))}
        </div>

        {/* Right gradient fade / button */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg-base)] via-[var(--bg-base)]/80 to-transparent z-10 opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:flex items-center justify-end pointer-events-none">
          <button 
            onClick={() => scroll('right')}
            className="mr-2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur text-white shadow-lg transition-transform hover:scale-110 pointer-events-auto"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
