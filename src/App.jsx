import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Games from './components/Games'
import Discussion from './components/Discussion'
import Finder from './components/Finder'
import NotFound from './components/NotFound'
import Profile from './components/Profile'

function App() {

  const router = createBrowserRouter([
    {path:"/", element:<Home />},
    {path:"/games", element:<Games/>},
    {path:"/discussion", element:<Discussion/>},
    {path:"/finder", element:<Finder/>},
    {path:"/profile", element:<Profile/>},
    {path:"/*", element:<NotFound/>},

  ])

  return (
    <div className='app'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
