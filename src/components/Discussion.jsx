import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './Discussion.css';
import { IoArrowBack } from 'react-icons/io5';
import { addDoc, collection, getDocs, orderBy, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseApp';
import Navbar from './Navbar';

export default function Discussion({ user }) {

  const { id, title } = useParams();
  const navigate = useNavigate();

  const [currentchat, setCurrentchat] = useState([]);
  const [users, setUsers] = useState([]);
  const [discussion, setDiscussion] = useState(null);
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    async function getData() {
      const usersSnap = await getDocs(collection(db, "user-data"));
      setUsers(usersSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }))); 
    }
    async function getDiscussion() {
      const discSnap = await getDocs(collection(db, "discussions"));
      const all = discSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setDiscussion(all.find(x => x.id === id) || null);
      console.log(discussion);
      
    }
    getData();
    getDiscussion();
  }, [id]);

  useEffect(() => {
    async function getCurrentChat() {
      const snap = await getDocs(
        query(collection(db, "discussion-messages"), where("discussionID", "==", id), orderBy("time", "asc"))
      );
      setCurrentchat(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    }
    getCurrentChat();
  }, [refresh]);

  function getUser(email) {
    return users.find(x => x.email === email);
  }

  async function sendMessage() {
    if (message.trim() === "") return;
    try {
      await addDoc(collection(db, "discussion-messages"), { comment: message, discussionID: id, email: user.email, time: Timestamp.now()});
      setMessage("");
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  }

  function toDiscussions() {
    navigate("/discussions")
  }

  if (!discussion || users.length === 0) toDiscussions();

  const creator = getUser(discussion.creatoremail);

  return (
    <div className='discussion'>
      <div className='discussion-back' onClick={()=>toDiscussions()}>
        <IoArrowBack />
      </div>
      <div className="discussion-modal" onClick={e => e.stopPropagation()}>
        <div className='person'>
          <img src={creator?.picture} alt="" className='picture' />
          <span>{creator?.username}</span>
        </div>
        <div className='discussion-text'>
          <p>{discussion.title}</p>
          <p>{discussion.description}</p>
        </div>
        <div className='discussion-chats'>
          {currentchat.map(x => (
            <div key={x.id}>
              <div className='chatUser'>
                <img className='chatUserPfp' src={getUser(x.email).picture} alt="" />
                <span>{getUser(x.email).username}</span>
              </div>
              <div><p>{x.comment}</p></div>
            </div>
          ))}
        </div>
        <div>
          <input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
          <input type="button" value="Send" onClick={sendMessage} />
        </div>
      </div>
    </div>
  )
}


/*import React from 'react'
import { useParams } from 'react-router-dom';
import './Discussion.css';
import { IoArrowBack } from 'react-icons/io5';

export default function Discussion() {

  const params = useParams();
  let { id, title } = req.params;

  const [users, setUsers] = useState([]);


  async function getCurrentChat() {
    const snap = await getDocs(query(collection(db, "discussion-messages"), where("discussionID", "==", id)), orderBy("time","asc"));
    const lst = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setCurrentchat(lst);
  }


  useEffect(() => {
    if (discussionId !== null) {
      getCurrentChat(discussions[discussionId].id);
    }
  }, [refresh, discussionId]);

  async function sendMessage() {
    try {
      if (message != "") {
        await addDoc(collection(db, "discussion-messages"), { comment: message, discussionID: discussions[discussionId].id, email: user.email, time: Timestamp.now() });
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log(err);
    }
  }*/

  