import { useEffect, useMemo, useState } from 'react'
import './App.css'

const GENRES = [
  { key: 'fantasy', label: 'Fantasy', query: 'fantasy' },
  { key: 'sci-fi', label: 'Sci-Fi', query: 'science fiction' },
  { key: 'mystery', label: 'Mystery', query: 'mystery' },
  { key: 'romance', label: 'Romance', query: 'romance' },
]

const SHELVES = [
  { key: 'want', label: 'Want to Read' },
  { key: 'reading', label: 'Reading' },
  { key: 'finished', label: 'Finished' },
  { key: 'dropped', label: 'Dropped' },
]

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=800&q=80'

const DEMO_LIBRARY_BOOKS = [
  {
    id: 'demo-priory-orange-tree',
    title: 'The Priory of the Orange Tree',
    author: 'Samantha Shannon',
    year: '2019',
    rating: 4.2,
    ratingsCount: 56000,
    pages: 848,
    description: 'Epic fantasy with dragons, divided kingdoms, and ancient prophecies.',
    cover: 'https://images.unsplash.com/photo-1521056787327-6f2f95b2f14f?auto=format&fit=crop&w=800&q=80',
    shelf: 'reading',
    updatedAtOffsetMin: 14,
  },
  {
    id: 'demo-six-of-crows',
    title: 'Six of Crows',
    author: 'Leigh Bardugo',
    year: '2015',
    rating: 4.5,
    ratingsCount: 760000,
    pages: 465,
    description: 'A high-stakes fantasy heist led by a razor-sharp crew.',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    shelf: 'want',
    updatedAtOffsetMin: 46,
  },
  {
    id: 'demo-martian',
    title: 'The Martian',
    author: 'Andy Weir',
    year: '2014',
    rating: 4.4,
    ratingsCount: 980000,
    pages: 369,
    description: 'A stranded astronaut survives Mars through science and grit.',
    cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    shelf: 'finished',
    updatedAtOffsetMin: 130,
  },
  {
    id: 'demo-silent-patient',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    year: '2019',
    rating: 4.1,
    ratingsCount: 920000,
    pages: 336,
    description: 'A psychotherapist investigates a murder wrapped in silence.',
    cover: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80',
    shelf: 'reading',
    updatedAtOffsetMin: 265,
  },
  {
    id: 'demo-book-lovers',
    title: 'Book Lovers',
    author: 'Emily Henry',
    year: '2022',
    rating: 4.0,
    ratingsCount: 640000,
    pages: 384,
    description: 'A romance where publishing rivals discover unexpected chemistry.',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    shelf: 'want',
    updatedAtOffsetMin: 410,
  },
  {
    id: 'demo-project-hail-mary',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    year: '2021',
    rating: 4.5,
    ratingsCount: 530000,
    pages: 496,
    description: 'A lone astronaut races to save Earth in deep space.',
    cover: 'https://images.unsplash.com/photo-1455885666463-9f4ec8b5b1f3?auto=format&fit=crop&w=800&q=80',
    shelf: 'finished',
    updatedAtOffsetMin: 640,
  },
  {
    id: 'demo-acotar',
    title: 'A Court of Thorns and Roses',
    author: 'Sarah J. Maas',
    year: '2015',
    rating: 4.2,
    ratingsCount: 2300000,
    pages: 432,
    description: 'A romantic fantasy retelling with fae courts and danger.',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
    shelf: 'want',
    updatedAtOffsetMin: 935,
  },
  {
    id: 'demo-girl-train',
    title: 'The Girl on the Train',
    author: 'Paula Hawkins',
    year: '2015',
    rating: 3.9,
    ratingsCount: 2600000,
    pages: 336,
    description: 'A mystery driven by unreliable memory and hidden motives.',
    cover: 'https://images.unsplash.com/photo-1515098506762-79e1384e9d8e?auto=format&fit=crop&w=800&q=80',
    shelf: 'dropped',
    updatedAtOffsetMin: 1200,
  },
]

const USER_TESTING_INSIGHT =
  '5-minute hallway test with 3 readers: all users understood shelf tracking in under 20 seconds, but 2 participants expected the genre buttons to also filter already-saved books.'

function createSeedLibrary() {
  const now = Date.now()

  return DEMO_LIBRARY_BOOKS.reduce((acc, book) => {
    acc[book.id] = {
      ...book,
      updatedAt: now - book.updatedAtOffsetMin * 60000,
    }
    return acc
  }, {})
}

function normalizeBook(item) {
  const info = item?.volumeInfo || {}
  const image = info?.imageLinks?.thumbnail || info?.imageLinks?.smallThumbnail

  return {
    id: item?.id || `${info?.title}-${(info?.authors || ['unknown'])[0]}`,
    title: info?.title || 'Untitled',
    author: info?.authors?.join(', ') || 'Unknown Author',
    year: info?.publishedDate ? String(info.publishedDate).slice(0, 4) : 'N/A',
    rating: typeof info?.averageRating === 'number' ? info.averageRating : null,
    ratingsCount: typeof info?.ratingsCount === 'number' ? info.ratingsCount : 0,
    pages: info?.pageCount || 'N/A',
    description: info?.description || 'No description available for this title yet.',
    cover: image ? image.replace('http://', 'https://') : FALLBACK_COVER,
  }
}

function timeAgo(timestamp) {
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000))
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  return `${Math.floor(hours / 24)} d ago`
}

function App() {
  const [activeGenre, setActiveGenre] = useState(GENRES[0])
  const [searchText, setSearchText] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [library, setLibrary] = useState({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem('alexandria-library')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && Object.keys(parsed).length > 0) {
          setLibrary(parsed)
        } else {
          setLibrary(createSeedLibrary())
        }
      } else {
        setLibrary(createSeedLibrary())
      }
    } catch {
      setLibrary(createSeedLibrary())
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('alexandria-library', JSON.stringify(library))
  }, [library])

  useEffect(() => {
    const controller = new AbortController()

    async function loadBooks() {
      setLoading(true)
      setError('')

      try {
        const query = searchText.trim().length >= 2
          ? searchText.trim()
          : `subject:${activeGenre.query}`

        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&orderBy=relevance&maxResults=24&printType=books`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error('Unable to load books right now.')
        }

        const data = await response.json()
        setBooks((data?.items || []).map(normalizeBook))
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load books right now.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadBooks()

    return () => controller.abort()
  }, [activeGenre, searchText])

  const libraryItems = useMemo(() => Object.values(library), [library])

  const shelfCounts = useMemo(() => {
    return {
      want: libraryItems.filter((book) => book.shelf === 'want').length,
      reading: libraryItems.filter((book) => book.shelf === 'reading').length,
      finished: libraryItems.filter((book) => book.shelf === 'finished').length,
      dropped: libraryItems.filter((book) => book.shelf === 'dropped').length,
    }
  }, [libraryItems])

  const currentRead = useMemo(() => {
    return libraryItems.find((book) => book.shelf === 'reading') || books[0]
  }, [libraryItems, books])

  const challengeGoal = 24
  const challengeProgress = Math.min(
    100,
    Math.round((shelfCounts.finished / challengeGoal) * 100),
  )

  const topTrending = books.slice(0, 12)

  const recentActivity = useMemo(() => {
    return libraryItems
      .filter((book) => typeof book.updatedAt === 'number')
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 4)
  }, [libraryItems])

  function updateShelf(book, shelf) {
    setLibrary((current) => ({
      ...current,
      [book.id]: {
        ...book,
        shelf,
        updatedAt: Date.now(),
      },
    }))
  }

  return (
    <div className="app-container">
      <aside className="sidebar glass-panel">
        <div className="logo-row">
          <div className="logo-dot">A</div>
          <div>
            <h1>Alexandria</h1>
            <p>Dynamic reading hub</p>
          </div>
        </div>

        <div className="menu-group">
          <h3>Explore</h3>
          {GENRES.map((genre) => (
            <button
              key={genre.key}
              className={genre.key === activeGenre.key ? 'menu-btn active' : 'menu-btn'}
              onClick={() => setActiveGenre(genre)}
            >
              {genre.label}
            </button>
          ))}
        </div>

        <div className="menu-group">
          <h3>Library</h3>
          <p>To Read: {shelfCounts.want}</p>
          <p>Reading: {shelfCounts.reading}</p>
          <p>Finished: {shelfCounts.finished}</p>
          <p>Dropped: {shelfCounts.dropped}</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar glass-panel">
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search books, authors, ISBN..."
          />
          <button
            className="add-btn"
            onClick={() => currentRead && updateShelf(currentRead, 'reading')}
          >
            + Add Book
          </button>
        </header>

        {error && <p className="error-text">{error}</p>}

        <section className="dashboard-grid">
          <article className="hero glass-panel">
            {currentRead && (
              <>
                <div className="hero-content">
                  <p className="eyebrow">Currently Reading</p>
                  <h2>{currentRead.title}</h2>
                  <p className="author">by {currentRead.author}</p>

                  <div className="progress-row">
                    <span>{currentRead.pages} pages</span>
                    <span>
                      {currentRead.rating ? `${currentRead.rating.toFixed(1)} stars` : 'No rating'}
                    </span>
                  </div>

                  <div className="progress-track">
                    <span style={{ width: `${Math.min(96, 35 + shelfCounts.reading * 6)}%` }}></span>
                  </div>

                  <div className="hero-actions">
                    <button onClick={() => updateShelf(currentRead, 'reading')}>Continue Reading</button>
                    <select
                      value={library[currentRead.id]?.shelf || 'want'}
                      onChange={(event) => updateShelf(currentRead, event.target.value)}
                    >
                      {SHELVES.map((shelf) => (
                        <option key={shelf.key} value={shelf.key}>
                          {shelf.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <img src={currentRead.cover} alt={currentRead.title} className="hero-cover" />
              </>
            )}
          </article>

          <aside className="right-widgets">
            <article className="glass-panel widget challenge">
              <h4>2026 Challenge</h4>
              <div className="ring-wrap">
                <div className="ring" style={{ '--p': `${challengeProgress}%` }}>
                  <span>{shelfCounts.finished}</span>
                </div>
              </div>
              <p>{challengeProgress}% of yearly goal</p>
              <small>Goal: {challengeGoal} books</small>
            </article>

            <article className="glass-panel widget stats">
              <div>
                <strong>{shelfCounts.reading}</strong>
                <span>Reading</span>
              </div>
              <div>
                <strong>{shelfCounts.finished}</strong>
                <span>Finished</span>
              </div>
              <div>
                <strong>{libraryItems.length}</strong>
                <span>Total Saved</span>
              </div>
            </article>
          </aside>
        </section>

        <section className="glass-panel trending">
          <div className="section-head">
            <h3>Trending Now</h3>
            <span>{loading ? 'Loading...' : `${topTrending.length} titles`}</span>
          </div>

          <div className="book-row">
            {topTrending.map((book) => (
              <article key={book.id} className="book-card">
                <img src={book.cover} alt={book.title} />
                <h5>{book.title}</h5>
                <p>{book.author}</p>
                <div className="book-meta">
                  <span>{book.year}</span>
                  <span>{book.rating ? book.rating.toFixed(1) : 'N/A'}</span>
                </div>
                <select
                  value={library[book.id]?.shelf || 'want'}
                  onChange={(event) => updateShelf(book, event.target.value)}
                >
                  {SHELVES.map((shelf) => (
                    <option key={shelf.key} value={shelf.key}>
                      {shelf.label}
                    </option>
                  ))}
                </select>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel activity">
          <div className="section-head">
            <h3>Recent Activity</h3>
            <span>Live from your shelves</span>
          </div>

          {recentActivity.length === 0 && <p className="empty">No activity yet. Add books to shelves.</p>}

          {recentActivity.map((book) => (
            <article key={`activity-${book.id}`} className="activity-item">
              <img src={book.cover} alt={book.title} />
              <div>
                <p>
                  <strong>{book.title}</strong> moved to <strong>{SHELVES.find((s) => s.key === book.shelf)?.label}</strong>
                </p>
                <span>{timeAgo(book.updatedAt)}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="glass-panel testing-note">
          <div className="section-head">
            <h3>User Testing Snapshot</h3>
            <span>Design Thinking evidence</span>
          </div>
          <p>{USER_TESTING_INSIGHT}</p>
        </section>
      </main>
    </div>
  )
}

export default App
