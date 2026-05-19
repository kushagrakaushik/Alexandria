import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useLibrary } from '../contexts/LibraryContext';
import {
  User, Bell, Shield, CreditCard, Download, Trash2,
  Check, ChevronRight, Zap, Crown, Globe, Moon, Eye, EyeOff, Target
} from 'lucide-react';

const SECTION_ICONS = { account: User, notifications: Bell, privacy: Shield, plan: CreditCard, data: Download };

function ToggleSwitch({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${value ? 'bg-purple-500' : 'bg-white/15'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-4.5' : 'translate-x-0'}`} />
    </button>
  );
}

export default function Settings() {
  const { userSettings, setUserSettings, userPlan, setUserPlan, PLAN_TIERS, readingGoal, setReadingGoal, exportLibrary } = useLibrary();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(searchParams.get('section') || 'account');

  useEffect(() => {
    const s = searchParams.get('section');
    if (s) setActiveSection(s);
  }, [searchParams]);
  const [saved, setSaved] = useState(false);
  const [localSettings, setLocalSettings] = useState({ ...userSettings });
  const [localGoal, setLocalGoal] = useState({ ...readingGoal });

  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'plan', label: 'Plan & Billing', icon: CreditCard },
    { id: 'goals', label: 'Reading Goals', icon: Target },
    { id: 'data', label: 'Data & Export', icon: Download },
  ];

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      color: 'border-white/10',
      accent: 'text-gray-300',
      features: ['Up to 25 books', 'Basic library', 'Community access'],
      icon: Globe,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$7',
      period: '/month',
      color: 'border-purple-500/50',
      accent: 'text-purple-300',
      features: ['Unlimited books', 'Reading goals & analytics', 'Export library', 'Priority support'],
      icon: Zap,
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$29',
      period: '/month',
      color: 'border-amber-500/50',
      accent: 'text-amber-300',
      features: ['Everything in Pro', 'Team library sharing', 'Custom integrations', 'Dedicated support'],
      icon: Crown,
    },
  ];

  const handleSave = () => {
    setUserSettings(localSettings);
    setReadingGoal(localGoal);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateLocal = (key, val) => setLocalSettings(prev => ({ ...prev, [key]: val }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8 pb-20 mt-4">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white">Settings</h1>
        <p className="text-gray-400 mt-1 text-sm">Manage your account, plan, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">

        {/* Sidebar */}
        <div className="glass-panel p-2 h-fit lg:sticky lg:top-28">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === id
                  ? 'bg-purple-500/15 text-white border border-purple-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} className={activeSection === id ? 'text-purple-400' : 'text-gray-500'} />
              {label}
              {activeSection === id && <ChevronRight size={14} className="ml-auto text-purple-400" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">

          {/* Account */}
          {activeSection === 'account' && (
            <motion.div key="account" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="glass-panel p-7 space-y-6">
                <h2 className="text-xl font-bold text-white">Account Details</h2>

                {/* Avatar */}
                <div className="flex items-center gap-5">
                  <img src={localSettings.avatarUrl} className="w-20 h-20 rounded-full border-2 border-white/20 object-cover" />
                  <div>
                    <p className="text-sm text-white font-medium mb-1">Profile Photo</p>
                    <p className="text-xs text-gray-500 mb-3">Enter a URL to use as your avatar</p>
                    <input
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 w-72 placeholder-gray-600"
                      value={localSettings.avatarUrl}
                      onChange={e => updateLocal('avatarUrl', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Fields */}
                {[
                  { label: 'Display Name', key: 'name', type: 'text', placeholder: 'Your name' },
                  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
                    <input
                      type={type}
                      value={localSettings[key] || ''}
                      onChange={e => updateLocal(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all placeholder-gray-600"
                    />
                  </div>
                ))}
              </div>

              <div className="glass-panel p-7 space-y-4">
                <h2 className="text-xl font-bold text-white">Password</h2>
                {['Current Password', 'New Password', 'Confirm Password'].map(label => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder-gray-600"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-panel p-7 space-y-6">
                <h2 className="text-xl font-bold text-white">Notification Preferences</h2>
                {[
                  { key: 'notificationsEnabled', label: 'In-app notifications', desc: 'Get notified about book updates and achievements' },
                  { key: 'emailDigest', label: 'Weekly email digest', desc: 'Receive a summary of your reading activity' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                    <ToggleSwitch
                      value={localSettings[key] ?? true}
                      onChange={val => updateLocal(key, val)}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Privacy */}
          {activeSection === 'privacy' && (
            <motion.div key="privacy" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-panel p-7 space-y-6">
                <h2 className="text-xl font-bold text-white">Privacy Settings</h2>
                {[
                  { key: 'publicProfile', label: 'Public profile', desc: 'Let others find and view your reading profile', icon: Eye },
                ].map(({ key, label, desc, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <Icon size={15} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                    <ToggleSwitch
                      value={localSettings[key] ?? false}
                      onChange={val => updateLocal(key, val)}
                    />
                  </div>
                ))}
                <div className="pt-4 border-t border-white/5">
                  <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 size={14} /> Delete Account
                  </button>
                  <p className="text-xs text-gray-600 mt-1">This action is permanent and cannot be undone.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Plan & Billing */}
          {activeSection === 'plan' && (
            <motion.div key="plan" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="glass-panel p-7 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Plan & Billing</h2>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${PLAN_TIERS[userPlan]?.badge}`}>
                    Current: {PLAN_TIERS[userPlan]?.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map(plan => {
                    const Icon = plan.icon;
                    const isActive = userPlan === plan.id;
                    return (
                      <div
                        key={plan.id}
                        className={`relative rounded-2xl border p-5 transition-all cursor-pointer ${
                          isActive
                            ? `${plan.color} bg-white/5 shadow-[0_0_30px_rgba(139,92,246,0.1)]`
                            : 'border-white/8 hover:border-white/20 hover:bg-white/3'
                        }`}
                        onClick={() => setUserPlan(plan.id)}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-purple-500 text-white text-[10px] font-black rounded-full tracking-widest uppercase">
                            Popular
                          </span>
                        )}
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`p-1.5 rounded-lg bg-white/5 ${plan.accent}`}>
                            <Icon size={16} />
                          </div>
                          <span className={`font-bold text-sm ${plan.accent}`}>{plan.name}</span>
                          {isActive && <Check size={14} className="ml-auto text-emerald-400" />}
                        </div>
                        <div className="mb-4">
                          <span className="text-2xl font-black text-white">{plan.price}</span>
                          <span className="text-xs text-gray-500 ml-1">{plan.period}</span>
                        </div>
                        <ul className="space-y-2">
                          {plan.features.map(f => (
                            <li key={f} className="flex items-start gap-2 text-xs text-gray-400">
                              <Check size={11} className="text-emerald-400 mt-0.5 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Reading Goals */}
          {activeSection === 'goals' && (
            <motion.div key="goals" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-panel p-7 space-y-6">
                <h2 className="text-xl font-bold text-white">Reading Goals</h2>
                <p className="text-sm text-gray-400">Set targets to stay motivated throughout the year.</p>

                {[
                  { key: 'yearly', label: 'Yearly Goal', desc: 'Books to read this year', min: 1, max: 365 },
                  { key: 'monthly', label: 'Monthly Goal', desc: 'Books per month', min: 1, max: 30 },
                ].map(({ key, label, desc, min, max }) => (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                      <span className="text-2xl font-black text-white">{localGoal[key]}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={localGoal[key]}
                      onChange={e => setLocalGoal(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                      className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{min}</span>
                      <span>{max}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Data & Export */}
          {activeSection === 'data' && (
            <motion.div key="data" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-panel p-7 space-y-5">
                <h2 className="text-xl font-bold text-white">Data & Export</h2>
                <p className="text-sm text-gray-400">Download or manage your data.</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-sm font-medium text-white">Export Library</p>
                      <p className="text-xs text-gray-500 mt-0.5">Download all your books as JSON</p>
                    </div>
                    <button onClick={exportLibrary} className="btn-primary py-2 px-5 text-sm">
                      <Download size={14} className="mr-2" /> Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                    <div>
                      <p className="text-sm font-medium text-red-300">Delete All Data</p>
                      <p className="text-xs text-red-500/60 mt-0.5">Permanently remove your library and settings</p>
                    </div>
                    <button className="py-2 px-5 text-sm text-red-400 border border-red-500/30 rounded-full hover:bg-red-500/10 transition-colors">
                      <Trash2 size={14} className="inline mr-2" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Save button — shown for all sections except plan */}
          {activeSection !== 'plan' && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className={`btn-primary py-3 px-8 text-sm flex items-center gap-2 transition-all ${saved ? 'bg-emerald-500 shadow-emerald-500/30' : ''}`}
              >
                {saved ? <><Check size={16} /> Saved!</> : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
