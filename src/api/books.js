const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

const mapGoogleBook = (item) => {
  if (!item || !item.volumeInfo) return null;
  const { id, volumeInfo } = item;
  
  return {
    id: id,
    title: volumeInfo.title || 'Unknown Title',
    author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
    rating: volumeInfo.averageRating || (Math.random() * (5 - 3.5) + 3.5).toFixed(1), // Fake rating if absent
    genre: volumeInfo.categories ? volumeInfo.categories[0] : 'General',
    coverUrl: volumeInfo.imageLinks 
       ? (volumeInfo.imageLinks.thumbnail || volumeInfo.imageLinks.smallThumbnail).replace('http:', 'https:') 
       : 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600', // Better fallback
    description: volumeInfo.description ? volumeInfo.description.replace(/<[^>]*>?/gm, '') : 'No description available for this volume.',
    year: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : 'Unknown',
    readStatus: 'none'
  };
};

export const fetchTrendingBooks = async () => {
  try {
    const response = await fetch(`${BASE_URL}?q=subject:fiction&maxResults=40`);
    const data = await response.json();
    if (data.items) {
      return data.items.map(mapGoogleBook).filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error('Error fetching trending books:', error);
    return [];
  }
};

export const fetchBooksByGenre = async (genre) => {
  try {
    const formattedGenre = genre.split(' ')[0].toLowerCase();
    const response = await fetch(`${BASE_URL}?q=subject:${encodeURIComponent(formattedGenre)}&maxResults=40`);
    const data = await response.json();
    if (data.items) {
      return data.items.map(mapGoogleBook).filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error('Error fetching genre books:', error);
    return [];
  }
};

export const searchBooks = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=40`);
    const data = await response.json();
    if (data.items) {
      return data.items.map(mapGoogleBook).filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

export const fetchBookById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    const data = await response.json();
    return mapGoogleBook({ id: data.id, volumeInfo: data.volumeInfo });
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
};
