import React from 'react'
import Navbar from './Navbar'

export default function Home({darkmode,setDarkmode}) {
  return (
    <div>
      <Navbar darkmode={darkmode} setDarkmode={setDarkmode}/>
    </div>
  )
}
