import React, { useEffect, useRef, useState } from 'react'
import { db } from '../../firebaseApp';
import { addDoc, collection, getDocs, or, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { GoPlus } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';
import { IoArrowBack } from 'react-icons/io5';
import "./Message.css";
import { FaUserFriends } from 'react-icons/fa';

export default function Message() {
  const [messages, setMessages] = useState([])
  const [friends, setFriends] = useState([])
  const [nonfriends, setNonFriends] = useState([])
  const [users, setUsers] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');
  const [selectedConv, setSelectedConv] = useState(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  let user = { email: "admin@gmail.com" }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConv?.messages]);

  useEffect(() => {
    function createKey(a, b) { return [a, b].sort().join("__"); }

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
        const grouped = {};
        const friendsSet = new Set();
        adatList.forEach(msg => {
          const key = createKey(msg.sender, msg.receiver);
          if (!grouped[key]) {
            grouped[key] = { participants: [msg.sender, msg.receiver].sort(), messages: [] }
          }
          grouped[key].messages.push(msg);
          if (msg.sender !== user.email) friendsSet.add(msg.sender);
          if (msg.receiver !== user.email) friendsSet.add(msg.receiver);
        });
        setMessages(Object.values(grouped));
        setFriends([...friendsSet]);
      } else {
        setMessages([]);
        setFriends([]);
      }
    }

    async function getUsers() {
      const snap = await getDocs(collection(db, "user-data"));
      const lst = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsers(lst);
    }

    getUsers();
    getMessages();
  }, []);

  useEffect(() => {
    async function getNonFriends() {
      const adatSnapshot = await getDocs(collection(db, "user-data"));
      const adatList = adatSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const allEmails = adatList.map(u => u.email).filter(Boolean);
      const filteredEmails = allEmails.filter(
        email => email !== user?.email && !friends.includes(email)
      );
      setNonFriends(filteredEmails);
    }
    getNonFriends();
  }, [friends]);

  async function sendMessage() {
    if (!inputText.trim() || !selectedConv) return;

    const newMsg = {
      sender: user.email,
      receiver: selectedConv.otherEmail,
      text: inputText.trim(),
      time: Timestamp.now()
    };

    // Azonnal megjelenik
    setSelectedConv(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg]
    }));

    setInputText('');

    // Firestore-ba menti
    try {
      await addDoc(collection(db, "private-messages"), newMsg);
    } catch (err) {
      console.error("Küldési hiba:", err);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') sendMessage();
  }

  function openConversation(conv) {
    const other = conv.participants.find(p => p !== user.email);
    setSelectedConv({ otherEmail: other, messages: conv.messages });
  }

  function openNewConversation(email) {
    if (!email) return;
    setSelectedConv({ otherEmail: email, messages: [] });
  }

  return (
    <div className='message'>
      {!showMessage ? (
        <div className="showChat" onClick={() => setShowMessage(true)}>
          <FaUserFriends />
        </div>
      ) : (
        <div className='messages'>

          {/* CHAT NÉZET */}
          {selectedConv ? (
            <>
              <div className='messages-header'>
                <div className='header-left'>
                  <IoArrowBack
                    className='backBtn'
                    onClick={() => setSelectedConv(null)}
                  />
                  <div className='conv-avatar'>
                    {selectedConv.otherEmail?.[0]?.toUpperCase()}
                  </div>
                  <span className='header-email'>{selectedConv.otherEmail}</span>
                </div>
                <IoMdClose className='closeChat' onClick={() => setShowMessage(false)} />
              </div>

              <div className='chat-messages'>
                {selectedConv.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`bubble-wrap ${msg.sender === user.email ? 'me' : 'them'}`}
                  >
                    <div className={`bubble ${msg.sender === user.email ? 'me' : 'them'}`}>
                      {msg.text}
                    </div>
                    <span className='bubble-time'>
                      {msg.time?.toDate?.()
                        ? msg.time.toDate().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className='chat-input-wrap'>
                <input
                  className='chat-input'
                  type='text'
                  placeholder='Üzenet...'
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className='send-btn' onClick={sendMessage}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </>

          ) : (
            /* LISTA NÉZET */
            <>
              <div className='messages-header'>
                <span>Messages</span>
                <IoMdClose className='closeChat' onClick={() => setShowMessage(false)} />
              </div>

              <div className='messages-tabs'>
                <button className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`} onClick={() => setActiveTab('friends')}>Friends</button>
                <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>Others</button>
              </div>

              {activeTab === 'friends' && (
                <>
                  <div className='new-chat'>
                    <select defaultValue="" onChange={e => openNewConversation(e.target.value)}>
                      <option value="" disabled>New message to a friend...</option>
                      {friends.map(email => <option key={email} value={email}>{email}</option>)}
                    </select>
                  </div>
                  <div className='conversations-list'>
                    <p className='section-label'>Most recent</p>
                    {messages.length === 0
                      ? <p className='no-messages'>There are no messages yet.</p>
                      : messages.map((conv, i) => {
                        const other = conv.participants.find(p => p !== user.email);
                        const lastMsg = conv.messages[conv.messages.length - 1];
                        return (
                          <div key={i} className='conversation-item' onClick={() => openConversation(conv)}>
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
                    }
                  </div>
                </>
              )}

              {activeTab === 'all' && (
                <>
                  <div className='new-chat'>
                    <select defaultValue="" onChange={e => openNewConversation(e.target.value)}>
                      <option value="" disabled>Start a new conversation...</option>
                      {nonfriends.map(email => <option key={email} value={email}>{email}</option>)}
                    </select>
                  </div>
                  <div className='conversations-list'>
                    <p className='section-label'>Friends</p>
                    {nonfriends.length === 0
                      ? <p className='no-messages'>Everyone’s friends now!</p>
                      : nonfriends.map((email, i) => (
                        <div key={i} className='conversation-item' onClick={() => openNewConversation(email)}>
                          <div className='conv-avatar'>{email?.[0]?.toUpperCase()}</div>
                          <div className='conv-info'>
                            <span className='conv-email'>{email}</span>
                            <span className='conv-last-msg' style={{ fontStyle: 'italic' }}>No messages yet</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </>
              )}
            </>
          )}

        </div>
      )}
    </div>
  );
}