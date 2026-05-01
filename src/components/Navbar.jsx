import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import { IoMdMenu } from 'react-icons/io';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../../firebaseApp';
import { useApp } from '../AppContext';

export default function Navbar() {
  const { user, isAdmin } = useApp();
  const [name, setName] = useState('');
  const [pfp, setPfp] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (!user?.email) {
      setName('');
      setPfp('');
      return;
    }
    async function getUserData() {
      const snap = await getDocs(
        query(collection(db, 'user-data'), where('email', '==', user.email))
      );
      const lst = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setName(lst[0]?.username ?? '');
      setPfp(lst[0]?.picture ?? '');
    }
    getUserData();
  }, [user]);

  return (
    <div className="navbar">
      <IoMdMenu className="menuIkon" onClick={() => setShowMenu((p) => !p)} />
      <div className={`left ${showMenu ? 'show' : ''}`}>
        <div className={`page ${path === '/' ? 'active' : ''}`} onClick={() => navigate('/')} data-testid="nav-home">Home</div>
        <div className={`page ${path === '/games' ? 'active' : ''}`} onClick={() => navigate('/games')} data-testid="nav-games">Games</div>
        <div className={`page ${path.startsWith('/discussion') ? 'active' : ''}`} onClick={() => navigate('/discussions')} data-testid="nav-discussions">Discussions</div>
        <div className={`page ${path === '/finder' ? 'active' : ''}`} onClick={() => navigate('/finder')} data-testid="nav-finder">Finder</div>
        <div className={`page ${path === '/faq' ? 'active' : ''}`} onClick={() => navigate('/faq')} data-testid="nav-faq">FAQ</div>
        {isAdmin && <div className={`page ${path === '/admin' ? 'active' : ''}`} onClick={() => navigate('/admin')}>Admin</div>}
      </div>
      <div className="right" onClick={() => navigate('/profile')}>
        <div className="profName" data-testid="nav-username">{name}</div>
        <div>
          <img className="profPicture" src={pfp} alt="profile" data-testid="nav-profile-pic" />
        </div>
      </div>
    </div>
  );
}
