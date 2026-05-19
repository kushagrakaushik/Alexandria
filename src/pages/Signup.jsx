import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PERKS = [
  'Track unlimited books (Pro plan)',
  'Reading goals & analytics',
  'Smart notifications',
  'Genre breakdowns',
];

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    login({ email: form.email, password: form.password, name: form.name });
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#040406] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
      >
        {/* Left: value prop */}
        <div className="hidden md:flex flex-col justify-center space-y-8 pt-16">
          <Link to="/" className="text-3xl font-black gradient-text block">Alexandria</Link>
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-white leading-tight">
              Your reading<br />universe awaits.
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Join 12,000+ readers tracking their journey, hitting goals, and discovering new favorites.
            </p>
          </div>
          <ul className="space-y-3">
            {PERKS.map(p => (
              <li key={p} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-emerald-400" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            {['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=60','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=60','https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=60'].map((src, i) => (
              <img key={i} src={src} className="w-9 h-9 rounded-full border-2 border-[#040406] object-cover" style={{ marginLeft: i > 0 ? '-12px' : 0 }} />
            ))}
            <p className="text-xs text-gray-500 ml-2">Join 12K+ readers already tracking</p>
          </div>
        </div>

        {/* Right: form */}
        <div className="w-full">
          <Link to="/" className="block md:hidden text-center mb-8">
            <span className="text-3xl font-black gradient-text">Alexandria</span>
          </Link>

          <div className="glass-panel p-8 border border-white/10 space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white">Create your account</h1>
              <p className="text-gray-400 text-sm">Free forever. No credit card required.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'name', label: 'Full name', type: 'text', icon: User, placeholder: 'Alex Reader' },
                { key: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com' },
              ].map(({ key, label, type, icon: Icon, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</label>
                  <div className="relative">
                    <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      type={type}
                      value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all"
                    />
                  </div>
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Min. 6 characters"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Password strength */}
                {form.password && (
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                        form.password.length >= i * 4
                          ? i === 1 ? 'bg-red-500' : i === 2 ? 'bg-yellow-500' : 'bg-emerald-500'
                          : 'bg-white/10'
                      }`} />
                    ))}
                  </div>
                )}
              </div>

              {error && <p className="text-red-400 text-xs text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <> Create account <ArrowRight size={15} /> </>
                }
              </button>
            </form>

            <p className="text-center text-xs text-gray-600">
              By signing up you agree to our Terms of Service and Privacy Policy.
            </p>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
