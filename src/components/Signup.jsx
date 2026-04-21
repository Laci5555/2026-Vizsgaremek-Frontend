import React, { useState } from 'react';
import './Signup.css';
import { FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,
} from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseApp';

const userDataCollection = collection(db, 'user-data');

export default function Signup({ auth }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [spass, setSpass] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  async function signUpWithEmailAndPass() {
    if (pass !== spass) {
      setError('A két jelszó nem egyezik meg!');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      await addDoc(userDataCollection, {
        email,
        username: name,
        picture: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg',
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  }

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const { email: gEmail, displayName, photoURL } = result.user;
      const snap = await getDocs(query(userDataCollection, where('email', '==', gEmail)));
      if (snap.docs.length === 0) {
        await addDoc(userDataCollection, { email: gEmail, username: displayName, picture: photoURL });
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  }

  return (
    <div className="signup">
      <h1 className="title">Welcome to Gamminity!</h1>
      <div className="motto">Your best platform for communication about gaming!</div>
      <div className="signupForm">
        <h1>Sign up</h1>
        <input type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} required />
        <input type="password" placeholder="Password again" value={spass} onChange={(e) => setSpass(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <input type="button" value="Sign up" className="signupEmail" onClick={signUpWithEmailAndPass} />
        <span style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
          <p>Already have an account? <span className="logB" onClick={() => navigate('/login')}>Login</span></p>
        </span>
        <hr className="separator" />
        <button className="signupGoogle" onClick={loginWithGoogle}>
          <FaGoogle /> <p>Continue with Google!</p>
        </button>
      </div>
    </div>
  );
}
