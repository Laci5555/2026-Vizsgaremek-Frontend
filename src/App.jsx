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
import Signup from './components/SignUp'
import { initializeApp } from "firebase/app";
import {firebaseConfig} from '../firebaseConfig.js'
import { collection, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'


function App() {

  const [darkmode,setDarkmode]=useState(true);

  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);
  const userDataCollection = collection(db, 'user-data');
  

  const [user, setUser] = useState({});
  const auth = getAuth(app);

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return unsubscribe
  },[])
  

  console.log(user);
  


  const router = createBrowserRouter([
    {path:"/", element:<Home darkmode={darkmode} setDarkmode={setDarkmode}/>},
    {path:"/login", element:<Login auth={auth} userDataCollection={userDataCollection}/>},
    {path:"/signup", element:<Signup auth={auth} userDataCollection={userDataCollection}/>},
    {path:"/games", element:<Games darkmode={darkmode} setDarkmode={setDarkmode}/>},
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
