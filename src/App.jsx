import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Games from './components/Games';
import Discussions from './components/Discussions';
import Discussion from './components/Discussion';
import Finder from './components/Finder';
import NotFound from './components/NotFound';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import Admin from './components/Admin';
import { collection } from 'firebase/firestore';
import { auth, db } from '../firebaseApp';
import { AppProvider, useApp } from './AppContext';

const gamesDataCollection = collection(db, 'games');
const genreCollection = collection(db, 'genres');

// 👇 Védett útvonal komponens
function ProtectedRoute({ children }) {
  const { user, loading } = useApp();
  if (loading) return null; // vagy egy spinner
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><Home /></ProtectedRoute>,
  },
  { path: '/login', element: <Login auth={auth} /> },
  { path: '/signup', element: <Signup auth={auth} /> },
  {
    path: '/games',
    element: (
      <ProtectedRoute>
        <Games gamesDataCollection={gamesDataCollection} genreCollection={genreCollection} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/discussions',
    element: <ProtectedRoute><Discussions /></ProtectedRoute>,
  },
  {
    path: '/discussion/:id/:title',
    element: <ProtectedRoute><Discussion /></ProtectedRoute>,
  },
  {
    path: '/finder',
    element: <ProtectedRoute><Finder /></ProtectedRoute>,
  },
  {
    path: '/admin',
    element: <ProtectedRoute><Admin /></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile auth={auth} /></ProtectedRoute>,
  },
  { path: '*', element: <NotFound /> },
]);

function App() {
  return (
    <AppProvider>
      <div className="app">
        <RouterProvider router={router} />
      </div>
    </AppProvider>
  );
}

export default App;