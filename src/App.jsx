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

function App() {

  const [darkmode,setDarkmode]=useState(true);



  const router = createBrowserRouter([
    {path:"/", element:<Home darkmode={darkmode} setDarkmode={setDarkmode}/>},
    {path:"/login", element:<Login/>},
    {path:"/signup", element:<Signup/>},
    {path:"/games", element:<Games darkmode={darkmode} setDarkmode={setDarkmode}/>},
    {path:"/discussion", element:<Discussion/>},
    {path:"/finder", element:<Finder/>},
    {path:"/profile", element:<Profile/>},
    {path:"/*", element:<NotFound/>},

  ])

  return (
    <div className={'app'+darkmode ? " dark": ""}>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
