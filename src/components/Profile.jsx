import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import './Profile.css';
import { db } from '../../firebaseApp';
import { useApp } from '../AppContext';

const userDataCollection = collection(db, 'user-data');

export default function Profile({ auth }) {
  const { user } = useApp();
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [currentid, setCurrentid] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) return;
    async function getUserData() {
      const snap = await getDocs(query(userDataCollection, where('email', '==', user.email)));
      const lst = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
      setUsername(lst[0]?.username ?? '');
      setProfilePicture(lst[0]?.picture ?? '');
      setCurrentid(lst[0]?.id ?? null);
    }
    getUserData();
  }, [user]);

  async function logOut() {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  }

  async function updateData() {
    if (!currentid) return;
    try {
      await setDoc(doc(db, 'user-data', currentid), {
        email: user.email,
        picture: profilePicture,
        username,
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="profile">
      <Navbar />
      <div className="profileContainer">
        <div className="profileCard">
          <h2>Edit profile</h2>
          <div className="avatarPreview">
            <img
              src={profilePicture || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-2409187029.jpg'}
              alt="avatar"
            />
          </div>
          <div className="inputGroup">
            <label>Username:</label>
            <input type="text" placeholder="New username..." value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="inputGroup">
            <label>Profile picture URL:</label>
            <input type="text" placeholder="Image url..." value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} />
          </div>
          <button className="saveBtn" onClick={updateData}>Save changes</button>
          <hr />
          <button className="logoutBtn" onClick={logOut}>Logout</button>
        </div>
      </div>
    </div>
  );
}
