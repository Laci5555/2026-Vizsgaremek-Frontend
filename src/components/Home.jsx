import React from 'react'
import Navbar from './Navbar'
import Message from './Message'

export default function Home({darkmode,setDarkmode,user}) {
  return (
    <div className='home' style={{height:"100vh",position:"relative"}}>
      <Navbar darkmode={darkmode} setDarkmode={setDarkmode} user={user}/>
      <Message/>
    </div>
  )
}
