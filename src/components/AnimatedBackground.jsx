import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[var(--bg-base)] pointer-events-none">
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/20 blur-[120px] animate-blob mix-blend-screen"
      />
      <div 
        className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-600/20 blur-[120px] animate-blob animation-delay-2000 mix-blend-screen"
      />
      <div 
        className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-pink-600/20 blur-[120px] animate-blob animation-delay-4000 mix-blend-screen"
      />
    </div>
  );
}
