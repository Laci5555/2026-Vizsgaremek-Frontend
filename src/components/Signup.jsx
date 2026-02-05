import React from 'react'
import "./Signup.css";
import { FaGoogle } from "react-icons/fa";

export default function Signup() {
  return (
    <div className='signup'>
        <div className='signupForm'>
            <h1>Sign up</h1>
            <input type="text" name="" id="" placeholder='Username'/>
            <input type="email" name="" id="" placeholder='Email'/>
            <input type="password" name="" id="" placeholder='Password'/>
            <input type="password" name="" id="" placeholder='Password again'/>
            <input type="button" value="Sign up" className='signupEmail'/>
            <hr className='separator'/>
            <button className='signupGoogle'><FaGoogle /> <p>Sign up with Google!</p></button>
        </div>
        
    </div>
  )
}
