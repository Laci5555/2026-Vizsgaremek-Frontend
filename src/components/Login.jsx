import React from 'react';
import "./Login.css";

export default function Login() {
  return (
    <div className='login'>
        <h1>Welcome to the Jurassic Park!</h1>
        <div className='loginForm'>
            <input type="text" name="" id="" placeholder='Username'/>
            <input type="email" name="" id="" placeholder='Email'/>
            <input type="password" name="" id="" placeholder='Password'/>
            <input type="password" name="" id="" placeholder='Password again'/>
            <input type="button" value="Login" />
        </div>
        
    </div>
  )
}
