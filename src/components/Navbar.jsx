import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { IoMdMenu } from 'react-icons/io';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../../firebaseApp';
import { useApp } from '../AppContext';

export default function Navbar() {
  const { user } = useApp();
  const [name, setName] = useState('');
  const [pfp, setPfp] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

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
        <div className="page" onClick={() => navigate('/')}>Home</div>
        <div className="page" onClick={() => navigate('/games')}>Games</div>
        <div className="page" onClick={() => navigate('/discussions')}>Discussions</div>
        <div className="page" onClick={() => navigate('/finder')}>Finder</div>
      </div>
      <div className="right" onClick={() => navigate('/profile')}>
        <div className="profName">{name}</div>
        <div>
          <img className="profPicture" src={pfp} alt="profile" />
        </div>
      </div>
    </div>
  );
}
