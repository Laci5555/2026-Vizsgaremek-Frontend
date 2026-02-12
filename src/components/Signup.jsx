import React from 'react'
import "./Signup.css";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { addDoc, getDocs, query, where } from 'firebase/firestore';

export default function Signup({auth, userDataCollection}) {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [spass, setSpass] = useState("")



    const navigate = useNavigate();

    function toLogin() {
        navigate("/login");
    }

    async function SignUpWithEmailandPass() {
      if(pass == spass){
        try {
          await createUserWithEmailAndPassword(auth, email, pass)
          navigate("/")
          await addDoc(userDataCollection, {'email':email, 'username':name, 'picture':'https://www.google.com/search?q=base+user+pictur&sca_esv=bab5da91c7c319fb&rlz=1C1CHBD_huHU1039HU1190&udm=2&biw=1920&bih=953&sxsrf=ANbL-n7NiG9a4jdnsejVPnGXbwvcd7L2iw%3A1770886417350&ei=EZWNabKKFZ7i7_UP0reJyQk&ved=0ahUKEwjy1t_-ydOSAxUe8bsIHdJbIpkQ4dUDCBQ&uact=5&oq=base+user+pictur&gs_lp=Egtnd3Mtd2l6LWltZyIQYmFzZSB1c2VyIHBpY3R1ckjLJlCzD1i4JXACeACQAQCYAcEBoAHXC6oBAzcuN7gBA8gBAPgBAZgCCqAC0gnCAgcQABiABBgTwgIGEAAYExgewgIIEAAYExgFGB7CAgoQABgTGAgYChgewgIIEAAYExgIGB7CAggQABiABBixA8ICBRAAGIAEwgIHEAAYgAQYCsICBBAAGB7CAgYQABgFGB7CAgYQABgIGB6YAwCIBgGSBwUxLjguMaAH2TuyBwUxLjguMbgH0gnCBwUyLTEuOcgHc4AIAA&sclient=gws-wiz-img#sv=CAMSVhoyKhBlLUFMLUY5S3VuckhPRG5NMg5BTC1GOUt1bnJIT0RuTToOUnBtckdESkVBWmpmWE0gBCocCgZtb3NhaWMSEGUtQUwtRjlLdW5ySE9Ebk0YADABGAcgxPOLiAEwAkoIEAIYAiACKAI'});
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
            <span style={{display:"flex",gap:"5px"}}><p>Already have an account <span className='logB' onClick={()=>toLogin()}>Login</span></p></span>
            <hr className='separator'/>
            <button className='signupGoogle' onClick={()=>LoginInWithGoogle()}><FaGoogle /> <p>Sign up with Google!</p></button>
        </div>
        
    </div>
  )
}
