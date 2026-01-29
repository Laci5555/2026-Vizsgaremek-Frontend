import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineLightMode } from "react-icons/md";
import { FaRegMoon } from "react-icons/fa";

export default function Navbar() {

  const [name,setName]=useState("Aang");
  const [mode,setMode]=useState(true);

    const navigate = useNavigate()

    function toHome() {
        navigate("/")
    }
    function toGames() {
        navigate("/games")
    }
    function toDiscussion() {
        navigate("/discussion")
    }
    function toFinder() {
        navigate("/finder")
    }
    function toProfile() {
      navigate("/profile")
    }


  return (
    <div className='navbar'>
      <div className="left">
        <div className="page" onClick={()=>toHome()}>Home</div>
        <div className="page" onClick={()=>toGames()}>Games</div>
        <div className="page" onClick={()=>toDiscussion()}>Discussion</div>
        <div className="page" onClick={()=>toFinder()}>Finder</div>
      </div>
      <div className="right">
        <div className="mode" onClick={()=>setMode(!mode)}>
          {mode ? <MdOutlineLightMode size={25} className='ikon'/> : <FaRegMoon size={25} className='ikon'/>}
        </div>
        <div className='profName'>{name}</div>
        <div onClick={()=>toProfile()}>
          <img className='profPicture' src="https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg" alt="" />
        </div>
      </div>
    </div>
  )
}
