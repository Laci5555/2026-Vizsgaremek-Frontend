import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Games from './components/Games'
import Discussion from './components/Discussion'
import Finder from './components/Finder'
import NotFound from './components/NotFound'
import Profile from './components/Profile'
import Login from './components/Login'
import { useState } from 'react'
import Signup from './components/Signup'
import { collection, getFirestore } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { auth, db } from '../firebaseApp'


function App() {

  const [darkmode,setDarkmode]=useState(true);

  
  const userDataCollection = collection(db, 'user-data');

  const gamesDataCollection = collection(db, 'games');
  const genreCollection = collection(db, 'genres');
  

  const [user, setUser] = useState({});
 

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return unsubscribe
  },[])
  

  console.log(user);
  


  const router = createBrowserRouter([
    {path:"/", element:<Home darkmode={darkmode} setDarkmode={setDarkmode}/>},
    {path:"/login", element:<Login auth={auth} userDataCollection={userDataCollection}/>},
    {path:"/signup", element:<Signup auth={auth} userDataCollection={userDataCollection}/>},
    {path:"/games", element:<Games darkmode={darkmode} setDarkmode={setDarkmode} gamesDataCollection={gamesDataCollection} genreCollection={genreCollection}/>},
    {path:"/discussion", element:<Discussion/>},
    {path:"/finder", element:<Finder/>},
    {path:"/profile", element:<Profile auth={auth}/>},
    {path:"*", element:<NotFound/>},
  ])

  return (
    <div className={'app'+darkmode ? " dark": ""}>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
