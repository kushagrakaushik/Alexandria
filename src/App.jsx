import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import InteractiveBackground from './components/InteractiveBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Library from './pages/Library';
import BookDetails from './pages/BookDetails';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { LibraryProvider } from './contexts/LibraryContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Toast from './components/Toast';

// Layout rendered once for all protected routes — uses <Outlet> for child pages
function AppShell() {
  const location = useLocation();
  return (
    <>
      <InteractiveBackground />
      <Navbar />
      <Toast />
      <main className="w-full min-h-screen pt-28 pb-12 px-6 md:px-12 mx-auto flex flex-col relative">
        <AnimatePresence mode="wait">
          {/* key on the wrapper div triggers AnimatePresence exit/enter on route change */}
          <div key={location.pathname} className="flex flex-col flex-1">
            <Outlet />
          </div>
        </AnimatePresence>
      </main>
    </>
  );
}

function RootRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Landing />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Signup />}
      />

      {/* ── Protected layout ── AppShell renders once; Outlet swaps the page ── */}
      <Route
        element={isAuthenticated ? <AppShell /> : <Navigate to="/login" replace />}
      >
        <Route path="/home"       element={<Home />} />
        <Route path="/library"    element={<Library />} />
        <Route path="/book/:id"   element={<BookDetails />} />
        <Route path="/search"     element={<Search />} />
        <Route path="/profile"    element={<Profile />} />
        <Route path="/community"  element={<Community />} />
        <Route path="/settings"   element={<Settings />} />
      </Route>

      {/* ── Catch-all ── */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/home' : '/'} replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <RootRouter />
      </LibraryProvider>
    </AuthProvider>
  );
}

export default App;
