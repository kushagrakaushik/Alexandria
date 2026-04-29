import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import InteractiveBackground from './components/InteractiveBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Library from './pages/Library';
import BookDetails from './pages/BookDetails';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Community from './pages/Community';
import { LibraryProvider } from './contexts/LibraryContext';
import Toast from './components/Toast';

function AppContent() {
  const location = useLocation();

  return (
    <>
      <InteractiveBackground />
      <Navbar />
      <Toast />
      <main className="w-full min-h-screen pt-28 pb-12 px-6 md:px-12 mx-auto flex flex-col relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
}

function App() {
  return (
    <LibraryProvider>
      <AppContent />
    </LibraryProvider>
  );
}

export default App;