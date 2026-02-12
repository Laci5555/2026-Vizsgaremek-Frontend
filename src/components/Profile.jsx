import React from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";

export default function Profile({auth}) {

  
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
      <div profileDiv>
        <button onClick={()=>LogOut()}>Log out</button>
      </div>
    </div>
  )
}
