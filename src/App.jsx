import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
import { AppProvider } from './AppContext';

const gamesDataCollection = collection(db, 'games');
const genreCollection = collection(db, 'genres');

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login auth={auth} /> },
  { path: '/signup', element: <Signup auth={auth} /> },
  { path: '/games', element: <Games gamesDataCollection={gamesDataCollection} genreCollection={genreCollection} /> },
  { path: '/discussions', element: <Discussions /> },
  { path: '/discussion/:id/:title', element: <Discussion /> },
  { path: '/finder', element: <Finder /> },
  { path: '/admin', element: <Admin /> },
  { path: '/profile', element: <Profile auth={auth} /> },
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
