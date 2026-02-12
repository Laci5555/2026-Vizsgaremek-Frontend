import React from 'react';
import "./Login.css";
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { addDoc, getDocs, query, where } from 'firebase/firestore';

export default function Login({auth, userDataCollection}) {

    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")


    const navigate = useNavigate();

    function toSignup() {
        navigate("/signup");
    }

    async function LoginWithEmail() {
      try {
          await signInWithEmailAndPassword(auth, email, pass);
          navigate("/")
      } catch (err) {
          console.log(err);
      }
    }

    async function LoginInWithGoogle() {
      let result = (await signInWithPopup(auth, new GoogleAuthProvider()));
      let check = result.user.email;
      let displayName = result.user.displayName
      console.log(result);
      navigate("/")
      try {
          const adatSnapshot = await getDocs(query(userDataCollection, where("email", "==", check)));
          if(adatSnapshot.docs.length == 0){
              await addDoc(userDataCollection, {'email':check, 'username':displayName, 'picture':result.user.photoURL});
          }
      } catch (err) {
          console.log(err);
      }
    }

    

  return (
    <div className='login'>
        <div className='loginForm'>
            <h1>Login</h1>
            <input type="email" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required/>
            <input type="password" placeholder='Password' value={pass} onChange={e=>setPass(e.target.value)} required/>
            <input type="button" value="Login" className='loginEmail' onClick={()=>LoginWithEmail()}/>
            <span style={{display:"flex",gap:"5px"}}><p>Don't have an account? <span className='signupB' onClick={()=>toSignup()}>Sign up</span></p></span>
            <hr className='separator'/>
            <button className='loginGoogle' onClick={()=>LoginInWithGoogle()}><FaGoogle /> <p>Login with Google!</p></button>
        </div>
        
    </div>
  )
}
