import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { signOut, updateProfile } from "firebase/auth";
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import "./Profile.css";
import { db } from '../../firebaseApp';

export default function Profile({auth,darkmode,setDarkmode,user}) {


  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [currentid, setCurrentid] = useState();

  const userDataCollection = collection(db, 'user-data');
  
  const navigate = useNavigate();

  async function LogOut() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(()=>{
      async function getUserData() {
        const snap = await getDocs(query(userDataCollection, where("email", "==", user.email)))
        const lst = snap.docs.map(doc => ({ ...doc.data(), id:doc.id }));
        setUsername(lst[0]?.username)
        setProfilePicture(lst[0]?.picture)
        setCurrentid(lst[0]?.id)
      }
      getUserData()
    },[user])

    async function updateData() {
      try {
        await setDoc(doc(db, "user-data", currentid), {email:user.email, picture:profilePicture, username:username});
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
          <button className='saveBtn' onClick={()=>updateData()}>Save changes</button>
          <hr />
          <button className='logoutBtn' onClick={LogOut}>Logout</button>
        </div>
      </div>
    </div>
  );
}