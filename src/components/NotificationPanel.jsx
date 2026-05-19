import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Book, RefreshCw, Trash2, CheckCheck, X, Zap, Target, Star, Download, Settings } from 'lucide-react';
import { useLibrary } from '../contexts/LibraryContext';

const ICON_MAP = {
  book: Book,
  refresh: RefreshCw,
  trash: Trash2,
  achievement: Zap,
  star: Star,
  goal: Target,
  download: Download,
  zap: Zap,
  settings: Settings,
};

const TYPE_STYLES = {
  book_added: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  book_removed: 'text-red-400 bg-red-500/10 border-red-500/20',
  status_changed: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  achievement: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  goal: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  system: 'text-gray-400 bg-white/5 border-white/10',
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationPanel({ isOpen, onClose }) {
  const { notifications, markAllRead, clearNotifications, unreadCount } = useLibrary();
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="absolute top-full right-0 mt-3 w-[340px] md:w-[400px] z-[200]"
        >
          <div
            className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.85)]"
            style={{ background: 'rgba(8, 8, 12, 0.95)', backdropFilter: 'blur(30px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <Bell size={16} className="text-purple-400" />
                <span className="font-bold text-white text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-purple-500/25 text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-gray-500">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Bell size={20} className="opacity-40" />
                  </div>
                  <p className="text-sm font-medium">You're all caught up</p>
                  <p className="text-xs mt-1 text-gray-600">Add books to see activity here</p>
                </div>
              ) : (
                notifications.map((notif, i) => {
                  const Icon = ICON_MAP[notif.icon] || Bell;
                  const style = TYPE_STYLES[notif.type] || TYPE_STYLES.system;
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-start gap-3.5 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-default ${!notif.read ? 'bg-purple-500/[0.04]' : ''}`}
                    >
                      <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${style}`}>
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[12px] font-semibold text-white leading-tight">{notif.title}</p>
                          <span className="text-[10px] text-gray-600 shrink-0 mt-0.5">{timeAgo(notif.timestamp)}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-2" />
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-gray-600">{notifications.length} total</span>
                <button
                  onClick={clearNotifications}
                  className="text-[11px] text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={11} /> Clear all
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
