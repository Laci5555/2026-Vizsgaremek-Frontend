import React from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import "./Profile.css";
import { useState } from 'react';

export default function Profile({auth}) {

  const [username,setUsername]=useState("");
  const [profilePicture,setProfilePicture]=useState("");
  
  const navigate = useNavigate()


  async function LogOut() {
    try {
      await signOut(auth);
      navigate("/login")
    } catch (err) {
      console.log(err);
    }
  }

  

  return (
    <div className='profile'>
      <Navbar/>
      <div className='profileDiv'>
        <div className="username">
          <input type="text" value={username}/>
          <input type="button" value="Névváltoztatás" />
        </div>
        <div className="profPicture">
          <input type="text" value={profilePicture}/>
          <input type="button" value="Profilkép változtatás" />
        </div>

        <button onClick={()=>LogOut()}>Log out</button>
      </div>
    </div>
  )
}
