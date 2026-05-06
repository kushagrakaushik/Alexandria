import { bookCatalog } from '../data/mockData';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = 'AIzaSyCCnvNGerB_CGpegoHs-tKjcRvHi8Z3wUk';
const FALLBACK_COVER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600';
const CACHE_KEY = 'alexandria_books_cache_v2';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const runtimeCache = new Map();

const normalizeText = (value) => (value || '').toString().toLowerCase().trim();

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readCacheStore = () => {
  if (!isBrowser()) return {};

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeCacheStore = (store) => {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage failures; the in-memory cache still works for this session.
  }
};

const getCachedValue = (key) => {
  const runtimeEntry = runtimeCache.get(key);
  if (runtimeEntry && runtimeEntry.expiresAt > Date.now()) {
    return runtimeEntry.value;
  }

  const store = readCacheStore();
  const persistedEntry = store[key];
  if (persistedEntry && persistedEntry.expiresAt > Date.now()) {
    runtimeCache.set(key, persistedEntry);
    return persistedEntry.value;
  }

  return null;
};

const setCachedValue = (key, value) => {
  const entry = {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS
  };

  runtimeCache.set(key, entry);
  const store = readCacheStore();
  store[key] = entry;
  writeCacheStore(store);
};

const mapGoogleBook = (item) => {
  if (!item || !item.volumeInfo) return null;
  const { id, volumeInfo } = item;

  return {
    id,
    title: volumeInfo.title || 'Unknown Title',
    author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
    rating: volumeInfo.averageRating || (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
    genre: volumeInfo.categories ? volumeInfo.categories[0] : 'General',
    coverUrl: volumeInfo.imageLinks
      ? (volumeInfo.imageLinks.thumbnail || volumeInfo.imageLinks.smallThumbnail).replace('http:', 'https:')
      : FALLBACK_COVER,
    description: volumeInfo.description ? volumeInfo.description.replace(/<[^>]*>?/gm, '') : 'No description available for this volume.',
    year: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : 'Unknown',
    readStatus: 'none'
  };
};

const mapFallbackBook = (book) => ({ ...book });

const getFallbackBooksByGenre = (genre) => {
  const normalizedGenre = normalizeText(genre);
  if (!normalizedGenre) return [];
  return bookCatalog
    .filter((book) => normalizeText(book.genre) === normalizedGenre)
    .map(mapFallbackBook);
};

const getFallbackTrendingBooks = () => bookCatalog.filter((book) => normalizeText(book.genre) === 'fiction').map(mapFallbackBook);

const searchFallbackBooks = (query) => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  return bookCatalog.filter((book) => {
    return [book.title, book.author, book.genre, book.description]
      .some((field) => normalizeText(field).includes(normalizedQuery));
  }).map(mapFallbackBook);
};

const getFallbackBookById = (id) => {
  return bookCatalog.find((book) => book.id === id) || null;
};

const fetchGoogleBooks = async (query) => {
  const url = `${BASE_URL}?${query}&key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Books request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.items ? data.items.map(mapGoogleBook).filter(Boolean) : [];
};

export const fetchTrendingBooks = async () => {
  const cacheKey = 'trending';
  const cachedBooks = getCachedValue(cacheKey);
  if (cachedBooks) {
    return cachedBooks;
  }

  try {
    const books = await fetchGoogleBooks('q=subject:fiction&maxResults=40');
    const resolvedBooks = books.length > 0 ? books : getFallbackTrendingBooks();
    setCachedValue(cacheKey, resolvedBooks);
    return resolvedBooks;
  } catch (error) {
    console.warn('Falling back to bundled trending books:', error);
    const fallbackBooks = getFallbackTrendingBooks();
    setCachedValue(cacheKey, fallbackBooks);
    return fallbackBooks;
  }
};

export const fetchBooksByGenre = async (genre) => {
  const cacheKey = `genre:${normalizeText(genre)}`;
  const cachedBooks = getCachedValue(cacheKey);
  if (cachedBooks) {
    return cachedBooks;
  }

  try {
    const formattedGenre = genre.split(' ')[0].toLowerCase();
    const books = await fetchGoogleBooks(`q=subject:${encodeURIComponent(formattedGenre)}&maxResults=40`);
    const resolvedBooks = books.length > 0 ? books : getFallbackBooksByGenre(genre);
    setCachedValue(cacheKey, resolvedBooks);
    return resolvedBooks;
  } catch (error) {
    console.warn(`Falling back to bundled ${genre} books:`, error);
    const fallbackBooks = getFallbackBooksByGenre(genre);
    setCachedValue(cacheKey, fallbackBooks);
    return fallbackBooks;
  }
};

export const searchBooks = async (query) => {
  const normalizedQuery = normalizeText(query);
  const cacheKey = `search:${normalizedQuery}`;
  const cachedBooks = getCachedValue(cacheKey);
  if (cachedBooks) {
    return cachedBooks;
  }

  try {
    const books = await fetchGoogleBooks(`q=${encodeURIComponent(query)}&maxResults=40`);
    const resolvedBooks = books.length > 0 ? books : searchFallbackBooks(query);
    setCachedValue(cacheKey, resolvedBooks);
    return resolvedBooks;
  } catch (error) {
    console.warn('Falling back to bundled search results:', error);
    const fallbackBooks = searchFallbackBooks(query);
    setCachedValue(cacheKey, fallbackBooks);
    return fallbackBooks;
  }
};

export const fetchBookById = async (id) => {
  const cacheKey = `book:${id}`;
  const cachedBook = getCachedValue(cacheKey);
  if (cachedBook) {
    return cachedBook;
  }

  try {
    const url = `${BASE_URL}/${id}?key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Books request failed with status ${response.status}`);
    }

    const data = await response.json();
    const mappedBook = mapGoogleBook({ id: data.id, volumeInfo: data.volumeInfo });
    setCachedValue(cacheKey, mappedBook);
    return mappedBook;
  } catch (error) {
    const fallbackBook = getFallbackBookById(id);
    if (fallbackBook) {
      console.warn('Falling back to bundled book details:', error);
      const mappedFallbackBook = mapFallbackBook(fallbackBook);
      setCachedValue(cacheKey, mappedFallbackBook);
      return mappedFallbackBook;
    }

    console.error('Error fetching book details:', error);
    return null;
  }
};
