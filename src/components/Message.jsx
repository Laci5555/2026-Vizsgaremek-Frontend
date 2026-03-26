import React from 'react'
import { useEffect } from 'react'
import { db } from '../../firebaseApp';
import { useState } from 'react';
import { addDoc, collection, doc, getDocs, or, orderBy, query, setDoc, Timestamp, where } from 'firebase/firestore';
import { GoPlus } from 'react-icons/go';
import "./Message.css";
import { IoMdClose } from 'react-icons/io';

export default function Message() {

  const [messages, setMessages] = useState([])
  const [friends, setFriends] = useState([])
  const [nonfriends, setNonFriends] = useState([])
  const [users, setUsers] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');

  let user = {
    email: "admin@gmail.com"
  }

  useEffect(() => {
    function createKey(a, b) {
      return [a, b].sort().join("__");
    }
    async function getMessages() {
      if (user) {
        const q = query(
          collection(db, "private-messages"),
          or(
            where("sender", "==", user.email),
            where("receiver", "==", user.email)
          ),
          orderBy("time", "asc")
        );

        const adatSnapshot = await getDocs(q);

        const adatList = adatSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        const grouped = {}
        const friendsSet = new Set();
        adatList.forEach(msg => {
          const key = createKey(msg.sender, msg.receiver);
          if (!grouped[key]) {
            grouped[key] = {
              participants: [msg.sender, msg.receiver].sort(),
              messages: []
            }
          }
          grouped[key].messages.push(msg);


          if (msg.sender != user.email) friendsSet.add(msg.sender);
          if (msg.receiver !== user.email) friendsSet.add(msg.receiver);
        })
        setMessages(Object.values(grouped))
        setFriends([...friendsSet])
      } else {
        setMessages([])
        setFriends([])
      }
    }
    async function getUsers() {
      const snap = await getDocs(collection(db, "user-data"))
      const lst = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsers(lst)
    }
    getUsers()
    getMessages()
  }, [])

  useEffect(() => {
    async function getNonFriends() {
      const adatSnapshot = await getDocs(collection(db, "user-data"));
      const adatList = adatSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const allEmails = adatList.map(u => u.email).filter(Boolean);
      const filteredEmails = allEmails.filter(
        email =>
          email !== user?.email &&     // ne saját magad
          !friends.includes(email)     // ne legyen friend
      );
      setNonFriends(filteredEmails);
    }
    getNonFriends()
  }, [friends])




  return (
  <div className='message'>
    {!showMessage ? (
      <div className="showChat" onClick={() => setShowMessage(true)}>
        <GoPlus />
      </div>
    ) : (
      <div className='messages'>

        <div className='messages-header'>
          <span>Üzenetek</span>
          <IoMdClose className='closeChat' onClick={() => setShowMessage(false)} />
        </div>

        {/* Tabok */}
        <div className='messages-tabs'>
          <button
            className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Barátok
          </button>
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Mindenki
          </button>
        </div>

        {/* Barátok tab */}
        {activeTab === 'friends' && (
          <>
            {friends.length > 0 && (
              <div className='new-chat'>
                <select defaultValue="">
                  <option value="" disabled>Új üzenet barátnak...</option>
                  {friends.map(email => (
                    <option key={email} value={email}>{email}</option>
                  ))}
                </select>
              </div>
            )}
            <div className='conversations-list'>
              <p className='section-label'>Legutóbbi</p>
              {messages.length === 0 ? (
                <p className='no-messages'>Még nincs üzenetváltás.</p>
              ) : (
                messages.map((conv, index) => {
                  const other = conv.participants.find(p => p !== user.email);
                  const lastMsg = conv.messages[conv.messages.length - 1];
                  return (
                    <div key={index} className='conversation-item'>
                      <div className='conv-avatar'>{other?.[0]?.toUpperCase()}</div>
                      <div className='conv-info'>
                        <span className='conv-email'>{other}</span>
                        <span className='conv-last-msg'>
                          {lastMsg?.sender === user.email ? 'Te: ' : ''}{lastMsg?.text}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Mindenki tab */}
        {activeTab === 'all' && (
          <>
            {nonfriends.length > 0 && (
              <div className='new-chat'>
                <select defaultValue="">
                  <option value="" disabled>Új beszélgetés indítása...</option>
                  {nonfriends.map(email => (
                    <option key={email} value={email}>{email}</option>
                  ))}
                </select>
              </div>
            )}
            <div className='conversations-list'>
              <p className='section-label'>Ismerősök</p>
              {nonfriends.length === 0 ? (
                <p className='no-messages'>Mindenki barát már!</p>
              ) : (
                nonfriends.map((email, index) => (
                  <div key={index} className='conversation-item'>
                    <div className='conv-avatar'>{email?.[0]?.toUpperCase()}</div>
                    <div className='conv-info'>
                      <span className='conv-email'>{email}</span>
                      <span className='conv-last-msg' style={{ fontStyle: 'italic' }}>
                        Még nincs üzenet
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    )}
  </div>
);
}