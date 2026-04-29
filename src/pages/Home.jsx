import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchTrendingBooks, fetchBooksByGenre } from '../api/books';
import BookRow from '../components/BookRow';
import { Link } from 'react-router-dom';
import { Flame, Sparkles } from 'lucide-react';

export default function Home() {
  const [featuredBook, setFeaturedBook] = useState(null);
  const [rows, setRows] = useState({
    trending: [],
    fiction: [],
    business: [],
    tech: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllRows = async () => {
      setLoading(true);
      const [trending, fiction, business, tech] = await Promise.all([
        fetchTrendingBooks(),
        fetchBooksByGenre('Fiction'),
        fetchBooksByGenre('Business'),
        fetchBooksByGenre('Computers')
      ]);

      if (trending.length > 0) {
        setFeaturedBook(trending[0]);
        setRows({
          trending: trending.slice(1),
          fiction,
          business,
          tech
        });
      }
      setLoading(false);
    };
    loadAllRows();
  }, []);

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center text-xl text-purple-300 animate-pulse font-medium">Curating your universe...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-16 pb-20 mt-4"
    >
      {/* Heavy Hero Section */}
      {featuredBook && (
        <section className="relative w-full h-[65vh] min-h-[500px] max-h-[700px] rounded-3xl overflow-hidden glass-panel flex flex-col justify-center p-8 md:p-16 border border-white/10 group">
          <div className="absolute inset-0 z-0">
            <img src={featuredBook.coverUrl} alt="Background" className="w-full h-full object-cover opacity-20 blur-3xl top-0 scale-125 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-base)] via-[var(--bg-base)]/90 to-[var(--bg-base)]/40" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[var(--bg-base)] to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-3xl flex flex-col items-start gap-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold uppercase tracking-widest border border-purple-500/30 backdrop-blur-md"
            >
              <Sparkles size={14} /> Premiere Pick
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight text-white mb-2"
            >
              {featuredBook.title}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-gray-300 mb-4 line-clamp-3 leading-relaxed max-w-2xl font-light"
            >
              {featuredBook.description}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 mt-2"
            >
              <Link to={`/book/${featuredBook.id}`} className="btn-primary py-3.5 px-8 text-lg font-bold">
                Discover
              </Link>
            </motion.div>
          </div>

          <div className="hidden lg:block absolute right-24 top-1/2 -translate-y-1/2 w-[300px] aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transform rotate-6 group-hover:rotate-0 transition-all duration-700 ease-out border border-white/20">
            <img src={featuredBook.coverUrl} alt={featuredBook.title} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
              <div className="w-full">
                <div className="flex items-center gap-1.5 text-yellow-500 mb-1">
                  {'★'.repeat(Math.round(featuredBook.rating))}
                  <span className="text-gray-300 text-sm ml-2 font-medium">{featuredBook.rating}</span>
                </div>
                <p className="text-white font-medium line-clamp-1">{featuredBook.author}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Netflix Layout Rows */}
      <div className="space-y-12">
        <BookRow title={<span className="flex items-center gap-2"><Flame className="text-orange-500" /> Trending Now</span>} books={rows.trending} onSeeAll={() => { }} />
        <BookRow title="Epic Fiction" books={rows.fiction} onSeeAll={() => { }} />
        <BookRow title="High-Tech & Programming" books={rows.tech} onSeeAll={() => { }} />
        <BookRow title="Business & Strategy" books={rows.business} onSeeAll={() => { }} />
      </div>
    </motion.div>
  );
}
