import { motion } from 'framer-motion';
import { useLibrary } from '../contexts/LibraryContext';
import { userProfile } from '../data/mockData';
import { Trophy, BookOpen, Clock, Crown, Flame, Star, Award } from 'lucide-react';
import BookVerseCard from '../components/BookVerseCard';

export default function Profile() {
  const { libraryBooks } = useLibrary();
  
  const read = libraryBooks.filter(b => b.readStatus === 'read');
  const reading = libraryBooks.filter(b => b.readStatus === 'reading');
  
  // Dynamic genre frequency calculation
  const genres = libraryBooks.reduce((acc, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {});
  const topGenre = Object.keys(genres).sort((a,b) => genres[b] - genres[a])[0] || 'Fiction';

  const stats = [
    { label: 'Books Read', value: read.length, icon: BookOpen, color: 'text-blue-400' },
    { label: 'Currently Reading', value: reading.length, icon: Clock, color: 'text-purple-400' },
    { label: 'Top Genre', value: topGenre, icon: Star, color: 'text-yellow-400' },
    { label: 'Reading Streak', value: '14 Days', icon: Flame, color: 'text-orange-400' },
  ];

  const badges = [
    { title: 'Early Adopter', icon: Crown, color: 'from-amber-400 to-amber-600', active: true },
    { title: 'Speed Reader', icon: Flame, color: 'from-red-500 to-orange-500', active: read.length >= 10 },
    { title: 'Curator', icon: Star, color: 'from-blue-400 to-indigo-500', active: libraryBooks.length >= 20 },
    { title: 'Completionist', icon: Trophy, color: 'from-emerald-400 to-emerald-600', active: read.length >= 50 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12 pb-20 mt-4">
       <section className="glass-panel p-8 md:p-12 relative overflow-hidden flex flex-col items-center text-center">
         <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent opacity-50" />
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1000')] opacity-5 bg-cover pointer-events-none" />
         <div className="relative z-10 space-y-6 flex flex-col items-center">
           <img src={userProfile.avatarUrl} className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl object-cover hover:scale-105 transition-transform" />
           <div>
             <h1 className="text-4xl font-black mb-2">{userProfile.name}</h1>
             <p className="text-purple-300 font-medium tracking-wide">Reader Level {14 + Math.floor(read.length / 5)} • Joined 2024</p>
           </div>
         </div>
       </section>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {stats.map((stat, i) => {
           const Icon = stat.icon;
           return (
             <div key={i} className="glass-panel p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/5 transition-colors">
               <div className={`p-3 rounded-full bg-white/5 shadow-inner border border-white/5 ${stat.color}`}>
                 <Icon size={24} />
               </div>
               <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{stat.label}</p>
               </div>
             </div>
           )
         })}
       </div>

       <section className="space-y-6">
         <h2 className="text-2xl font-bold flex items-center gap-2"><Award className="text-purple-400"/> Achievements</h2>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className={`glass-panel p-6 flex flex-col items-center text-center transition-all ${badge.active ? 'border-white/20 hover:scale-105' : 'opacity-40 grayscale border-transparent'}`}>
                   <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg mb-4`}>
                      <Icon size={32} className="text-white" />
                   </div>
                   <h3 className="font-bold">{badge.title}</h3>
                   <p className="text-xs text-gray-400 mt-1">{badge.active ? 'Unlocked' : 'Locked'}</p>
                </div>
              )
            })}
         </div>
       </section>

       {read.length > 0 && (
         <section className="space-y-6">
           <h2 className="text-2xl font-bold flex items-center gap-2"><Clock className="text-blue-400"/> Recent Activity</h2>
           <div className="glass-panel p-2">
             {read.slice(0,5).map((book, i) => (
                <div key={book.id} className={`flex items-center gap-4 p-4 ${i !== read.length -1 ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors rounded-xl`}>
                   <img src={book.coverUrl} className="w-12 h-16 object-cover rounded shadow border border-white/10" />
                   <div className="flex-1">
                      <p className="text-xs text-gray-400"><span className="text-white font-medium">{userProfile.name}</span> finished reading</p>
                      <h4 className="font-bold text-sm sm:text-base mt-0.5 max-w-lg truncate">{book.title}</h4>
                   </div>
                   <div className="text-xs text-gray-500 hidden sm:block">Just now</div>
                </div>
             ))}
           </div>
         </section>
       )}
    </motion.div>
  );
}
