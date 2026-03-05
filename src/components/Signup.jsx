import React from 'react'
import "./Signup.css";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseApp';

export default function Signup({auth}) {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [spass, setSpass] = useState("")

    const userDataCollection = collection(db, 'user-data');


    const navigate = useNavigate();

    function toLogin() {
        navigate("/login");
    }

    async function SignUpWithEmailandPass() {
      if(pass == spass){
        try {
          await createUserWithEmailAndPassword(auth, email, pass)
          navigate("/")
          await addDoc(userDataCollection, {'email':email, 'username':name, 'picture':'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg'});
        } catch (err) {
          console.log(err);
        } 
      }else{console.log("Nem passzoló jelszavak");}
    }

    async function LoginInWithGoogle() {
        let result = (await signInWithPopup(auth, new GoogleAuthProvider()));
        let check = result.user.email;
        let displayName = result.user.displayName
        // console.log(result);
        navigate("/")
        try {
            const adatSnapshot = await getDocs(query(userDataCollection, where("email", "==", check)));
            if(adatSnapshot.docs.length == 0){
                await addDoc(userDataCollection, {'email':check, 'username':displayName, 'picture':result.user.photoURL});
            };
        } catch (err) {
            console.log(err);
        }
      }

    

  return (
    <div className='signup'>
        <div className='signupForm'>
            <h1>Sign up</h1>
            <input type="text" placeholder='Username' value={name} onChange={e=>setName(e.target.value)} required/>
            <input type="email" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required/>
            <input type="password" placeholder='Password' value={pass} onChange={e=>setPass(e.target.value)} required/>
            <input type="password" placeholder='Password again' value={spass} onChange={e=>setSpass(e.target.value)} required/>
            <input type="button" value="Sign up" className='signupEmail' onClick={()=>SignUpWithEmailandPass()}/>
            <span style={{display:"flex",justifyContent:"center",gap:"5px"}}><p>Already have an account <span className='logB' onClick={()=>toLogin()}>Login</span></p></span>
            <hr className='separator'/>
            <button className='signupGoogle' onClick={()=>LoginInWithGoogle()}><FaGoogle /> <p>Continue with Google!</p></button>
        </div>
        
    </div>
  )
}
