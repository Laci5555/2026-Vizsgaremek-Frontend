import React from 'react'
import "./Signup.css";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {

    const navigate = useNavigate();

    function toLogin() {
        navigate("/login");
    }

  return (
    <div className='signup'>
        <div className='signupForm'>
            <h1>Sign up</h1>
            <input type="text" name="" id="" placeholder='Username' required/>
            <input type="email" name="" id="" placeholder='Email' required/>
            <input type="password" name="" id="" placeholder='Password' required/>
            <input type="password" name="" id="" placeholder='Password again' required/>
            <input type="button" value="Sign up" className='signupEmail'/>
            <span style={{display:"flex",gap:"5px"}}><p>Already have an account <span className='logB' onClick={()=>toLogin()}>Login</span></p></span>
            <hr className='separator'/>
            <button className='signupGoogle'><FaGoogle /> <p>Sign up with Google!</p></button>
        </div>
        
    </div>
  )
}
