import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineLightMode } from "react-icons/md";
import { FaRegMoon } from "react-icons/fa";
import './Navbar.css';
import { IoMdMenu } from 'react-icons/io';
import { log } from 'firebase/firestore/pipelines';
import { useEffect } from 'react';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseApp';

export default function Navbar({darkmode,setDarkmode,user}) {

  const [name,setName] = useState("");
  const [pfp, setPfp] = useState("")


  const [showMenu,setShowMenu]=useState(false);

  const userDataCollection = collection(db, 'user-data');
  

  const navigate = useNavigate()

  function toHome() {
    navigate("/")
  }
  function toGames() {
    navigate("/games")
  }
  function toDiscussions() {
    navigate("/discussions")
  }
  function toFinder() {
    navigate("/finder")
  }
  function toProfile() {
    navigate("/profile")
  }

  function showMenus() {
    setShowMenu(!showMenu);
  }

  useEffect(()=>{
    async function getUserData() {
      const snap = await getDocs(query(userDataCollection, where("email", "==", user.email)))
      const lst = snap.docs.map(doc => ({ ...doc.data(), id:doc.id }));
      setName(lst[0]?.username)
      setPfp(lst[0]?.picture)
    }
    getUserData()
  },[user])

  

  return (
    <div className='navbar'>
      <IoMdMenu className='menuIkon' onClick={showMenus}/>
      <div className={`left ${showMenu ? "show" : ""}`}>
        <div className="page" onClick={()=>toHome()}>Home</div>
        <div className="page" onClick={()=>toGames()}>Games</div>
        <div className="page" onClick={()=>toDiscussions()}>Discussions</div>
        <div className="page" onClick={()=>toFinder()}>Finder</div>
      </div>
      <div className="right">
        <div className="mode" onClick={()=>setDarkmode(!darkmode)}>
          {darkmode ? <FaRegMoon className='ikon'/> : <MdOutlineLightMode size={25} className='ikon'/>}
        </div>
        <div className='profName'>{name}</div>
        <div onClick={()=>toProfile()}>
          <img className='profPicture' src={pfp} alt="" />
        </div>
      </div>
    </div>
  )
}
