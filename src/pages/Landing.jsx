import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Sparkles, BarChart3, Users, Zap, Shield,
  ChevronRight, Star, Check, ArrowRight, Menu, X,
  Target, Library, Bell, Globe
} from 'lucide-react';

const FEATURES = [
  {
    icon: Library,
    title: 'Kanban Library',
    desc: 'Organize every book into Reading, Want to Read, and Completed with drag-and-drop simplicity.',
    color: 'from-purple-500/20 to-purple-600/5',
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  {
    icon: Target,
    title: 'Reading Goals',
    desc: 'Set yearly and monthly targets. Watch animated progress rings fill as you hit milestones.',
    color: 'from-blue-500/20 to-blue-600/5',
    accent: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  {
    icon: BarChart3,
    title: 'Genre Analytics',
    desc: 'See your genre breakdown, top picks, and reading streaks all in one beautiful dashboard.',
    color: 'from-emerald-500/20 to-emerald-600/5',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    desc: 'Stay updated with achievement unlocks, status changes, and reading reminders — all in-app.',
    color: 'from-amber-500/20 to-amber-600/5',
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  {
    icon: Users,
    title: 'Community Feed',
    desc: 'See what others are reading, share reviews, and discover new books through a social feed.',
    color: 'from-pink-500/20 to-pink-600/5',
    accent: 'text-pink-400',
    border: 'border-pink-500/20',
  },
  {
    icon: Globe,
    title: 'Google Books API',
    desc: 'Millions of books auto-populated with covers, descriptions, ratings, and metadata.',
    color: 'from-indigo-500/20 to-indigo-600/5',
    accent: 'text-indigo-400',
    border: 'border-indigo-500/20',
  },
];

const STEPS = [
  { step: '01', title: 'Create your account', desc: 'Sign up free in under 30 seconds. No credit card required.' },
  { step: '02', title: 'Search any book', desc: 'Millions of books at your fingertips via Google Books. Add them with one click.' },
  { step: '03', title: 'Track & conquer goals', desc: 'Watch your library grow, hit milestones, and unlock achievements.' },
];

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for casual readers.',
    color: 'border-white/10',
    btn: 'btn-secondary',
    features: ['Up to 25 books', 'Basic library kanban', 'Community access', 'Book search'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$7',
    period: '/month',
    desc: 'For the serious reader.',
    color: 'border-purple-500/50',
    btn: 'btn-primary',
    popular: true,
    features: ['Unlimited books', 'Reading goals & analytics', 'Smart notifications', 'Export library', 'Genre breakdown', 'Priority support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$29',
    period: '/month',
    desc: 'For teams and institutions.',
    color: 'border-amber-500/40',
    btn: 'btn-secondary',
    features: ['Everything in Pro', 'Team library sharing', 'Custom integrations', 'Admin dashboard', 'Dedicated support', 'SLA guarantee'],
  },
];

const TESTIMONIALS = [
  {
    text: 'Alexandria turned my chaotic reading list into a system I actually enjoy using. The goal rings alone keep me motivated.',
    name: 'Sarah Chen',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
    stars: 5,
  },
  {
    text: 'The genre analytics showed me I read 80% sci-fi without realizing it. Now I\'m actively broadening my horizons.',
    name: 'Marcus Reid',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    stars: 5,
  },
  {
    text: 'Finally a book tracker that looks as good as it works. The dark UI is *chef\'s kiss*. I\'ve tried five others and none compare.',
    name: 'Priya Menon',
    role: 'Writer & Blogger',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
    stars: 5,
  },
];

const STATS = [
  { value: '50K+', label: 'Books tracked' },
  { value: '12K+', label: 'Active readers' },
  { value: '4.9★', label: 'Average rating' },
  { value: '98%', label: 'Satisfaction rate' },
];

const BOOK_COVERS = [
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=300&auto=format&fit=crop',
];

function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold gradient-text tracking-tight">Alexandria</Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link to="/signup" className="btn-primary py-2.5 px-5 text-sm">
            Get started free
          </Link>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-3 text-sm">
              <a href="#features" className="py-2 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Features</a>
              <a href="#how-it-works" className="py-2 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>How it works</a>
              <a href="#pricing" className="py-2 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Pricing</a>
              <hr className="border-white/10" />
              <Link to="/login" className="py-2 text-gray-300 hover:text-white">Log in</Link>
              <Link to="/signup" className="btn-primary py-3 text-center">Get started free</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#040406] text-white overflow-x-hidden">
      <LandingNav />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-6 text-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/15 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-5xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/15 border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold"
          >
            <Sparkles size={14} /> The reading platform for serious readers
          </motion.div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.95] text-white">
            Your reading
            <br />
            <span className="gradient-text">universe,</span>
            <br />
            organized.
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            Track every book, hit ambitious goals, discover what you love, and share the journey — all in one beautifully designed platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/signup" className="btn-primary py-4 px-10 text-base font-bold flex items-center gap-2">
              Start for free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary py-4 px-10 text-base font-bold">
              Sign in
            </Link>
          </div>

          <p className="text-xs text-gray-600">No credit card required · Free plan available · Up and running in 30s</p>
        </motion.div>

        {/* Floating book shelf visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative z-10 mt-20 flex items-end justify-center gap-3 md:gap-5"
        >
          {BOOK_COVERS.map((src, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              style={{ height: `${180 + (i % 3) * 30}px` }}
              className="relative rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10"
              whileHover={{ scale: 1.05, rotate: 0 }}
              initial={{ rotate: (i % 2 === 0 ? -1 : 1) * (1 + i * 0.5) }}
            >
              <img src={src} className="h-full w-20 md:w-28 object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────── */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl font-black gradient-text">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-purple-400 text-sm font-bold uppercase tracking-widest"
            >
              Everything you need
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-black tracking-tight"
            >
              Built for readers,
              <br />
              <span className="gradient-text">by readers.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className={`glass-panel p-7 space-y-4 border bg-linear-to-br ${f.color} ${f.border} hover:scale-[1.02] transition-transform`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center ${f.accent}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-linear-to-b from-purple-900/10 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4">
            <span className="text-purple-400 text-sm font-bold uppercase tracking-widest">Simple to start</span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight">Up and running
              <br /><span className="gradient-text">in three steps.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-linear-to-r from-purple-500/40 to-transparent z-0 -translate-y-1/2" />
                )}
                <div className="glass-panel p-8 space-y-4 relative z-10 border border-white/8">
                  <span className="text-5xl font-black gradient-text">{s.step}</span>
                  <h3 className="text-xl font-bold text-white">{s.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────── */}
      <section id="pricing" className="py-28 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-purple-400 text-sm font-bold uppercase tracking-widest">Transparent pricing</span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight">Start free,
              <br /><span className="gradient-text">scale as you grow.</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">No hidden fees. Upgrade or downgrade anytime. Cancel when you want.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative glass-panel p-8 border ${plan.color} ${plan.popular ? 'shadow-[0_0_40px_rgba(139,92,246,0.15)] scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-linear-to-r from-purple-500 to-fuchsia-500 text-white text-xs font-black rounded-full tracking-widest uppercase shadow-lg">
                      Most popular
                    </span>
                  </div>
                )}

                <div className="space-y-2 mb-8">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.desc}</p>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-5xl font-black text-white">{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                </div>

                <Link to="/signup" className={`${plan.btn} w-full py-3 text-center mb-8 block font-bold text-sm`}>
                  Get started
                </Link>

                <ul className="space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-purple-900/8 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4">
            <span className="text-purple-400 text-sm font-bold uppercase tracking-widest">What readers say</span>
            <h2 className="text-5xl font-black tracking-tight">Loved by
              <span className="gradient-text"> readers</span>.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-7 space-y-5 border border-white/8 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex text-yellow-500 gap-0.5">
                  {Array(t.stars).fill(0).map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <img src={t.avatar} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-panel p-16 text-center border border-purple-500/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-br from-purple-600/15 to-fuchsia-600/10 pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight">
              Ready to build your
              <br /><span className="gradient-text">reading universe?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-xl mx-auto">
              Join thousands of readers tracking, growing, and discovering — for free.
            </p>
            <Link to="/signup" className="btn-primary py-5 px-12 text-lg font-bold inline-flex items-center gap-3">
              Get started free <ArrowRight size={20} />
            </Link>
            <p className="text-xs text-gray-600">No credit card · Free plan forever · Cancel anytime</p>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold gradient-text">Alexandria</span>
            <span className="text-gray-600 text-sm">© 2024 Alexandria. All rights reserved.</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link to="/login" className="hover:text-white transition-colors">Sign in</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
