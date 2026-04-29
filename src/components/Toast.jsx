import { useLibrary } from '../contexts/LibraryContext';

export default function Toast() {
  const { toastMessage } = useLibrary();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-[blob_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">
      <div className="bg-purple-600/90 backdrop-blur-lg border border-purple-500 shadow-[0_10px_40px_rgba(124,58,237,0.5)] text-white px-6 py-3 rounded-full font-medium text-sm md:text-base flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {toastMessage}
      </div>
    </div>
  );
}
