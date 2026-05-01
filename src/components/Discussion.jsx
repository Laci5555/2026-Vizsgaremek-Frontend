import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Discussion.css';
import { IoArrowBack } from 'react-icons/io5';
import {
  addDoc, collection, getDocs, orderBy, query, where, Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebaseApp';
import Navbar from './Navbar';
import { useApp } from '../AppContext';

export default function Discussion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();

  const [currentchat, setCurrentchat] = useState([]);
  const [users, setUsers] = useState([]);
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function load() {
      const [usersSnap, discSnap] = await Promise.all([
        getDocs(collection(db, 'user-data')),
        getDocs(collection(db, 'discussions')),
      ]);
      const usersList = usersSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setUsers(usersList);
      const found = discSnap.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .find((x) => x.id === id) ?? null;
      setDiscussion(found);
      setLoading(false);
    }
    load();
  }, [id]);

  useEffect(() => {
    if (!loading && !discussion) navigate('/discussions');
  }, [loading, discussion, navigate]);

  useEffect(() => {
    async function getCurrentChat() {
      const snap = await getDocs(
        query(
          collection(db, 'discussion-messages'),
          where('discussionID', '==', id),
          orderBy('time', 'asc'),
        ),
      );
      setCurrentchat(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getCurrentChat();
  }, [id, refresh]);

  function getUser(email) {
    return users.find((x) => x.email === email);
  }

  async function sendMessage() {
    if (message.trim() === '' || !user?.email) return;
    try {
      await addDoc(collection(db, 'discussion-messages'), {
        comment: message,
        discussionID: id,
        email: user.email,
        time: Timestamp.now(),
      });
      setMessage('');
      setRefresh((p) => !p);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading || !discussion || users.length === 0) {
    return <div className="discussion"><Navbar /></div>;
  }

  const creator = getUser(discussion.creatoremail);

  return (
    <div className="discussion">
      <Navbar />

      <div className="discussion-back" onClick={() => navigate('/discussions')}>
        <IoArrowBack />
      </div>

      <div className="discussion-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="discussion-header">
          <div className="person">
            <img src={creator?.picture} alt="" className="picture" />
            <span>{creator?.username}</span>
          </div>
          <div className="discussion-text">
            <p data-testid="discussion-title">{discussion.title}</p>
            <p>{discussion.description}</p>
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="discussion-chats">
          {currentchat.map((x) => {
            const chatUser = getUser(x.email);
            return (
              <div key={x.id}>
                <div className="chatUser">
                  <img className="chatUserPfp" src={chatUser?.picture} alt="" />
                  <span>{chatUser?.username}</span>
                </div>
                <div><p>{x.comment}</p></div>
              </div>
            );
          })}
        </div>

        {/* ── Input bar ── */}
        <div>
          <input
            type="text"
            placeholder="Write a message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            data-testid="discussion-input"
          />
          <input type="button" value="Send" onClick={sendMessage} data-testid="discussion-send-btn" />
        </div>

      </div>
    </div>
  );
}
