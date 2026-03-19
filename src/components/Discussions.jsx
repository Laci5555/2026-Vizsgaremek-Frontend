import React from 'react'
import Navbar from './Navbar'
import { useState } from 'react'
import "./Discussions.css";
import { useEffect } from 'react';
import { addDoc, collection, doc, getDocs, orderBy, query, setDoc, Timestamp, where } from 'firebase/firestore';
import { db } from '../../firebaseApp';
import { Link } from 'react-router-dom';

export default function Discussions({ user }) {

  const [discussions, setDiscussions] = useState([]);

  const [users, setUsers] = useState([]);

  const [currentchat, setCurrentchat] = useState([]);

  const [message, setMessage] = useState("");

  const [showDiscussion, setShowDiscussion] = useState(false);

  const [discussionId, setDiscussinId] = useState(null);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    async function getDiscussions() {
      const snap = await getDocs(collection(db, "discussions"))
      const lst = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setDiscussions(lst)
    }
    async function getUsers() {
      const snap = await getDocs(collection(db, "user-data"))
      const lst = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsers(lst)
    }
    getDiscussions()
    getUsers();
  }, []);


  function getUser(email) {
    let i = users.findIndex(x => x.email == email)
    return users[i]
  }

  function OpenChat(id) {
    getCurrentChat(id);
    setShowDiscussion(true);
    for (let i = 0; i < discussions.length; i++) {
      if (discussions[i].id == id) {
        setDiscussinId(i);
      }
    }
  }

  async function getCurrentChat(id) {
    const snap = await getDocs(query(collection(db, "discussion-messages"), where("discussionID", "==", id)), orderBy("time","asc"));
    const lst = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setCurrentchat(lst);
  }

  useEffect(() => {
    if (discussionId !== null) {
      getCurrentChat(discussions[discussionId].id);
    }
  }, [refresh, discussionId]);


  return (
    <div className='discussions'>
      <Navbar />
      <div className="cardlist">
        {discussions.map(x => 
          <Link to={`/discussion/${x.id}/${x.title}`}>
            <div className='card' key={x.id} onClick={() => OpenChat(x.id)}>
              <div className='person'>
                <img src={getUser(x.creatoremail).picture} alt="" className='picture' />
                <span>{getUser(x.creatoremail).username}</span>
              </div>
              <div className='text'>
                <p>{x.title}</p>
                <p>{x.description}</p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
