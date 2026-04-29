import { motion } from 'framer-motion';
import { MessageCircle, Heart, Share2, Flame, Star, Quote } from 'lucide-react';
import { userProfile } from '../data/mockData';

export default function Community() {
  const posts = [
    {
      id: 1,
      user: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      action: "reviewed",
      bookTitle: "The Midnight Library",
      bookCover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      content: "This book completely changed my perspective on regrets and the choices we make. Matt Haig weaves such an intricate web of alternative realities. Absolute masterpiece.",
      likes: 124,
      comments: 18,
      time: "2 hours ago"
    },
    {
      id: 2,
      user: "David Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      action: "started reading",
      bookTitle: "Atomic Habits",
      bookCover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=200&auto=format&fit=crop",
      content: "Finally diving into this one. Let's see if 1% improvements really do compound over time!",
      likes: 89,
      comments: 5,
      time: "5 hours ago"
    },
    {
      id: 3,
      user: "Elena Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
      action: "reviewed",
      bookTitle: "Project Hail Mary",
      bookCover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=200&auto=format&fit=crop",
      rating: 4,
      content: "Amaze! Amaze! Amaze! Andy Weir does it again. The science is heavy but the friendship dynamic is what really carries this interstellar journey.",
      likes: 256,
      comments: 42,
      time: "1 day ago"
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8 pb-20 mt-4 max-w-4xl mx-auto">
      
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
         <h1 className="text-2xl font-bold flex items-center gap-2"><Flame className="text-orange-500"/> Community Feed</h1>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium hover:bg-white/20 transition-colors shadow-inner">Trending</button>
            <button className="px-4 py-2 bg-purple-600 rounded-full text-sm font-medium shadow-[0_0_20px_rgba(147,51,234,0.4)]">Following</button>
         </div>
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="glass-panel p-6 md:p-8 space-y-6 hover:bg-white/[0.04] transition-colors border-white/5">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <img src={post.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-white/10 shadow-lg" />
                   <div>
                      <p className="font-medium text-white">{post.user}</p>
                      <p className="text-xs text-gray-400">{post.time} • {post.action}</p>
                   </div>
                </div>
                {post.rating && (
                  <div className="flex text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                    {Array(post.rating).fill(0).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                )}
             </div>

             <div className="flex flex-col sm:flex-row gap-6 bg-black/20 p-5 rounded-2xl border border-white/5">
                <img src={post.bookCover} className="w-20 h-32 object-cover rounded-md shadow-xl shrink-0 border border-white/10" />
                <div className="flex flex-col justify-center gap-3 relative">
                   <Quote className="absolute top-0 right-0 text-white/5 rotate-180" size={64}/>
                   <h3 className="font-bold text-lg">{post.bookTitle}</h3>
                   <p className="text-gray-300 text-sm leading-relaxed relative z-10">{post.content}</p>
                </div>
             </div>

             <div className="flex items-center gap-8 pt-4 border-t border-white/5 text-gray-400">
                <button className="flex items-center gap-2 hover:text-pink-500 transition-colors group">
                   <Heart size={18} className="group-hover:fill-pink-500/20 transition-all" /> <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                   <MessageCircle size={18} /> <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-green-400 transition-colors ml-auto">
                   <Share2 size={18} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
