import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  return (
    <Link to={`/book/${book.id}`} className="group relative block w-full aspect-[2/3] rounded-xl overflow-hidden book-card-hover bg-gray-900 border border-white/5">
      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-bold leading-tight line-clamp-2 md:text-lg drop-shadow-md mb-1">{book.title}</h3>
        <p className="text-gray-300 text-sm drop-shadow-sm">{book.author}</p>
        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
           <span className="bg-purple-600/80 text-xs px-2 py-1 rounded text-white backdrop-blur-md shadow-sm">★ {book.rating}</span>
           <span className="text-xs text-gray-300 bg-black/40 px-2 py-1 rounded backdrop-blur-md">{book.genre}</span>
        </div>
      </div>
    </Link>
  );
}
