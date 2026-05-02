import React, { useState } from 'react';
import './Login.css';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseApp';
import { useApp } from '../AppContext';

const userDataCollection = collection(db, 'user-data');

export default function Login({ auth }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const { API_BASE_URL } = useApp();

  const navigate = useNavigate();

  async function loginWithEmail() {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
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

        // Welcome email küldése az új Google usernek (Login oldalról is)
        fetch(`${API_BASE_URL}/welcome-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: gEmail, username: displayName })
        }).catch(err => console.error("Email error:", err));
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  }

  return (
    <div className="login">
      <div className="brand">
        <h1 className="brand-name">Gamminity</h1>
        <p className="brand-motto">Your best platform for communication about gaming!</p>
      </div>
      <div className="loginForm">
        <h1>Login</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <input type="button" value="Login" className="loginEmail" onClick={loginWithEmail} />
        <span style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
          <p>Don't have an account? <span className="signupB" onClick={() => navigate('/signup')}>Sign up</span></p>
        </span>
        <hr className="separator" />
        <button className="loginGoogle" onClick={loginWithGoogle}>
          <FaGoogle /> <p>Continue with Google!</p>
        </button>
      </div>
    </div>
  );
}
