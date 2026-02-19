import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { signOut, updateProfile } from "firebase/auth";
import "./Profile.css";
import { useState } from 'react';

export default function Profile({auth,darkmode,setDarkmode }) {
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  
  const navigate = useNavigate();

  async function LogOut() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='profile'>
      <Navbar darkmode={darkmode} setDarkmode={setDarkmode}/>
      <div className='profileContainer'>
        <div className='profileCard'>
          <h2>Edit profile</h2>
          <div className="avatarPreview">
            {profilePicture? <img src={profilePicture}/> : <img src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-2409187029.jpg"/>}
          </div>

          <div className="inputGroup">
            <label>Username:</label>
            <input type="text" placeholder="New username..." value={username} onChange={e => setUsername(e.target.value)} />
          </div>

          <div className="inputGroup">
            <label>Profile picture URL:</label>
            <input type="text" placeholder="Image url..." value={profilePicture} 
              onChange={e => setProfilePicture(e.target.value)} />
          </div>
          <button className='saveBtn'>Save changes</button>
          <hr />
          <button className='logoutBtn' onClick={LogOut}>Logout</button>
        </div>
      </div>
    </div>
  );
}