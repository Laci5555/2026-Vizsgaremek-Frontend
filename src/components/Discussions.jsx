import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Discussions.css';
import {
  collection, getDocs, orderBy, query, where,
} from 'firebase/firestore';
import { db } from '../../firebaseApp';
import { Link } from 'react-router-dom';

export default function Discussions() {
  const [discussions, setDiscussions] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getDiscussions() {
      const snap = await getDocs(collection(db, 'discussions'));
      setDiscussions(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    async function getUsers() {
      const snap = await getDocs(collection(db, 'user-data'));
      setUsers(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getDiscussions();
    getUsers();
  }, []);

  function getUser(email) {
    return users.find((x) => x.email === email);
  }

  // Amíg a users lista nem töltött be, ne rendereljük a kártyákat (getUser null-t adna)
  if (users.length === 0) return <div className="discussions"><Navbar /></div>;

  return (
    <div className="discussions">
      <Navbar />
      <div className="cardlist">
        {discussions.map((x) => (
          <Link key={x.id} to={`/discussion/${x.id}/${x.title}`}>
            <div className="card">
              <div className="person">
                <img src={getUser(x.creatoremail)?.picture} alt="" className="picture" />
                <span>{getUser(x.creatoremail)?.username}</span>
              </div>
              <div className="text">
                <p>{x.title}</p>
                <p>{x.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
