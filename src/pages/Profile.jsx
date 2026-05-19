import { motion } from 'framer-motion';
import { useLibrary } from '../contexts/LibraryContext';
import { Link } from 'react-router-dom';
import { Trophy, BookOpen, Clock, Crown, Flame, Star, Award, Target, TrendingUp, Settings, Zap } from 'lucide-react';
import BookVerseCard from '../components/BookVerseCard';

function GoalRing({ percent, color, size = 80 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={6} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={6} fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
}

export default function Profile() {
  const { libraryBooks, userPlan, PLAN_TIERS, readingGoal, userSettings } = useLibrary();

  const read = libraryBooks.filter(b => b.readStatus === 'read');
  const reading = libraryBooks.filter(b => b.readStatus === 'reading');
  const plan = PLAN_TIERS[userPlan] || PLAN_TIERS.pro;

  // Genre analysis
  const genres = libraryBooks.reduce((acc, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {});
  const genreEntries = Object.entries(genres).sort((a, b) => b[1] - a[1]);
  const topGenre = genreEntries[0]?.[0] || 'Fiction';
  const totalGenreBooks = libraryBooks.length || 1;

  // Goals
  const yearlyPercent = Math.min(100, Math.round((read.length / readingGoal.yearly) * 100));
  const monthlyPercent = Math.min(100, Math.round((read.length / readingGoal.monthly) * 100));

  const stats = [
    { label: 'Books Read', value: read.length, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Currently Reading', value: reading.length, icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Top Genre', value: topGenre, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { label: 'Reading Streak', value: '14 days', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  ];

  const badges = [
    { title: 'Early Adopter', icon: Crown, color: 'from-amber-400 to-amber-600', active: true },
    { title: 'Speed Reader', icon: Flame, color: 'from-red-500 to-orange-500', active: read.length >= 10 },
    { title: 'Curator', icon: Star, color: 'from-blue-400 to-indigo-500', active: libraryBooks.length >= 20 },
    { title: 'Completionist', icon: Trophy, color: 'from-emerald-400 to-emerald-600', active: read.length >= 50 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10 pb-20 mt-4">

      {/* Hero */}
      <section className="glass-panel p-8 md:p-12 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-linear-to-b from-purple-500/15 to-transparent opacity-60" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1000')] opacity-5 bg-cover pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-5">
          <div className="relative">
            <img src={userSettings.avatarUrl} className="w-28 h-28 rounded-full border-4 border-white/20 shadow-2xl object-cover hover:scale-105 transition-transform" />
            <span className={`absolute -bottom-2 -right-2 px-2.5 py-1 text-[10px] font-black rounded-full border ${plan.badge} shadow-lg`}>
              {plan.name.toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-black mb-1">{userSettings.name}</h1>
            <p className="text-purple-300 font-medium">
              Reader Level {14 + Math.floor(read.length / 5)} · Joined 2024
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/settings" className="btn-secondary py-2 px-5 text-sm flex items-center gap-2">
              <Settings size={14} /> Edit Profile
            </Link>
            <Link to="/settings?section=plan" className={`py-2 px-5 text-sm flex items-center gap-2 rounded-full border font-medium transition-all ${plan.badge} hover:opacity-80`}>
              <Zap size={14} /> Upgrade Plan
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`glass-panel p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/5 transition-colors border ${stat.bg}`}
            >
              <div className={`p-3 rounded-full bg-white/5 border border-white/5 ${stat.color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Reading Goals */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Target className="text-purple-400" /> Reading Goals</h2>
          <Link to="/settings?section=goals" className="text-xs text-gray-500 hover:text-purple-300 transition-colors">Edit goals →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              label: 'Yearly Goal',
              current: read.length,
              target: readingGoal.yearly,
              percent: yearlyPercent,
              color: '#8b5cf6',
              accent: 'text-purple-400',
              bg: 'bg-purple-500/10 border-purple-500/20',
            },
            {
              label: 'Monthly Goal',
              current: Math.min(read.length, readingGoal.monthly),
              target: readingGoal.monthly,
              percent: monthlyPercent,
              color: '#3b82f6',
              accent: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/20',
            },
          ].map((goal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`glass-panel p-6 flex items-center gap-6 border ${goal.bg}`}
            >
              <div className="relative shrink-0">
                <GoalRing percent={goal.percent} color={goal.color} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-black text-white">{goal.percent}%</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{goal.label}</p>
                <p className="text-3xl font-black text-white">{goal.current}<span className="text-gray-500 text-lg font-normal">/{goal.target}</span></p>
                <p className={`text-xs mt-1 font-medium ${goal.accent}`}>
                  {goal.target - goal.current > 0 ? `${goal.target - goal.current} books to go` : 'Goal reached! 🎉'}
                </p>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.percent}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: goal.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Genre Breakdown */}
      {genreEntries.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-2xl font-bold flex items-center gap-2"><TrendingUp className="text-blue-400" /> Genre Breakdown</h2>
          <div className="glass-panel p-6 space-y-4">
            {genreEntries.slice(0, 5).map(([genre, count], i) => {
              const pct = Math.round((count / totalGenreBooks) * 100);
              const colors = ['bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500'];
              return (
                <div key={genre} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300 font-medium">{genre}</span>
                    <span className="text-gray-500">{count} book{count !== 1 ? 's' : ''} · {pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 * i }}
                      className={`h-full rounded-full ${colors[i % colors.length]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Achievements */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Award className="text-purple-400" /> Achievements</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i }}
                className={`glass-panel p-6 flex flex-col items-center text-center transition-all ${badge.active ? 'border-white/20 hover:scale-105' : 'opacity-35 grayscale border-transparent'}`}
              >
                <div className={`w-16 h-16 rounded-full bg-linear-to-br ${badge.color} flex items-center justify-center shadow-lg mb-4`}>
                  <Icon size={30} className="text-white" />
                </div>
                <h3 className="font-bold text-sm">{badge.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{badge.active ? 'Unlocked' : 'Locked'}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Recent Activity */}
      {read.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Clock className="text-blue-400" /> Recent Activity</h2>
          <div className="glass-panel p-2 divide-y divide-white/5">
            {read.slice(0, 5).map((book, i) => (
              <div key={book.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors rounded-xl">
                <img src={book.coverUrl} className="w-12 h-16 object-cover rounded-lg shadow border border-white/10" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">
                    <span className="text-white font-medium">{userSettings.name}</span> finished reading
                  </p>
                  <h4 className="font-bold text-sm mt-0.5 truncate">{book.title}</h4>
                  {book.genre && (
                    <span className="text-[10px] text-purple-400 mt-1 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full inline-block">
                      {book.genre}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 hidden sm:block shrink-0">Just now</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
