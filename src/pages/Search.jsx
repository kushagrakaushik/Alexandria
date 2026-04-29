import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchBooks } from '../api/books';
import BookCard from '../components/BookVerseCard'; // Also using updated BookVerseCard instead of old BookCard
import { motion } from 'framer-motion';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      const books = await searchBooks(query);
      setResults(books);
      setLoading(false);
    };
    performSearch();
  }, [query]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-12 pb-20 pt-8">
      <div className="border-b border-white/5 pb-6">
         <h1 className="text-3xl md:text-4xl font-bold">Search Results</h1>
         <p className="text-gray-400 mt-2 text-lg">Showing results for <span className="text-white font-medium">"{query}"</span></p>
      </div>

      {loading ? (
        <div className="p-20 text-center text-xl text-purple-300 animate-pulse">Searching the archives...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 glass-panel border-dashed">
          <p className="text-xl">No books found for "{query}".</p>
          <p className="mt-2">Try another keyword or author.</p>
        </div>
      )}
    </motion.div>
  );
}
