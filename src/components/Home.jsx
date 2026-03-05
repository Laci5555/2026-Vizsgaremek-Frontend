import React from 'react'
import Navbar from './Navbar'

export default function Home({darkmode,setDarkmode,user}) {
  return (
    <div>
      <Navbar darkmode={darkmode} setDarkmode={setDarkmode} user={user}/>
    </div>
  )
}
