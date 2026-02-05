import React from 'react';
import "./Login.css";
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const navigate = useNavigate();

    function toSignup() {
        navigate("/signup");
    }


  return (
    <div className='login'>
        <div className='loginForm'>
            <h1>Login</h1>
            <input type="email" name="" id="" placeholder='Email' required/>
            <input type="password" name="" id="" placeholder='Password' required/>
            <input type="button" value="Login" className='loginEmail'/>
            <span style={{display:"flex",gap:"5px"}}><p>Don't have an account? <span className='signupB' onClick={()=>toSignup()}>Sign up</span></p></span>
            <hr className='separator'/>
            <button className='loginGoogle'><FaGoogle /> <p>Login with Google!</p></button>
        </div>
        
    </div>
  )
}
