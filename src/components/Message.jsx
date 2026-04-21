import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../firebaseApp';
import { addDoc, collection, getDocs, or, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { IoMdClose } from 'react-icons/io';
import { IoArrowBack } from 'react-icons/io5';
import './Message.css';
import { FaUserFriends } from 'react-icons/fa';
import { useApp } from '../AppContext';

export default function Message() {
  const { user } = useApp();
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [nonfriends, setNonFriends] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');
  const [selectedConv, setSelectedConv] = useState(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConv?.messages]);

  useEffect(() => {
    if (!user?.email) return;

    function createKey(a, b) { return [a, b].sort().join('__'); }

    async function getMessages() {
      const q = query(
        collection(db, 'private-messages'),
        or(
          where('sender', '==', user.email),
          where('receiver', '==', user.email)
        ),
        orderBy('time', 'asc')
      );
      const snap = await getDocs(q);
      const adatList = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const grouped = {};
      const friendsSet = new Set();
      adatList.forEach((msg) => {
        const key = createKey(msg.sender, msg.receiver);
        if (!grouped[key]) {
          grouped[key] = { participants: [msg.sender, msg.receiver].sort(), messages: [] };
        }
        grouped[key].messages.push(msg);
        if (msg.sender !== user.email) friendsSet.add(msg.sender);
        if (msg.receiver !== user.email) friendsSet.add(msg.receiver);
      });
      setMessages(Object.values(grouped));
      setFriends([...friendsSet]);
    }

    getMessages();
  }, [user]);

  useEffect(() => {
    if (!user?.email) return;
    async function getNonFriends() {
      const snap = await getDocs(collection(db, 'user-data'));
      const allEmails = snap.docs.map((doc) => doc.data().email).filter(Boolean);
      setNonFriends(allEmails.filter((email) => email !== user.email && !friends.includes(email)));
    }
    getNonFriends();
  }, [friends, user]);

  async function sendMessage() {
    if (!inputText.trim() || !selectedConv || !user?.email) return;

    const newMsg = {
      sender: user.email,
      receiver: selectedConv.otherEmail,
      text: inputText.trim(),
      time: Timestamp.now(),
    };

    setSelectedConv((prev) => ({ ...prev, messages: [...prev.messages, newMsg] }));
    setInputText('');

    try {
      await addDoc(collection(db, 'private-messages'), newMsg);
    } catch (err) {
      console.error(err);
    }
  }

  function openConversation(conv) {
    const other = conv.participants.find((p) => p !== user.email);
    setSelectedConv({ otherEmail: other, messages: conv.messages });
  }

  function openNewConversation(email) {
    if (!email) return;
    setSelectedConv({ otherEmail: email, messages: [] });
  }

  if (!user) return null;

  return (
    <div className="message">
      {!showMessage ? (
        <div className="showChat" onClick={() => setShowMessage(true)}>
          <FaUserFriends />
        </div>
      ) : (
        <div className="messages">
          {selectedConv ? (
            <>
              <div className="messages-header">
                <div className="header-left">
                  <IoArrowBack className="backBtn" onClick={() => setSelectedConv(null)} />
                  <div className="conv-avatar">{selectedConv.otherEmail?.[0]?.toUpperCase()}</div>
                  <span className="header-email">{selectedConv.otherEmail}</span>
                </div>
                <IoMdClose className="closeChat" onClick={() => setShowMessage(false)} />
              </div>
              <div className="chat-messages">
                {selectedConv.messages.map((msg, i) => (
                  <div key={i} className={`bubble-wrap ${msg.sender === user.email ? 'me' : 'them'}`}>
                    <div className={`bubble ${msg.sender === user.email ? 'me' : 'them'}`}>
                      {msg.text}
                    </div>
                    <span className="bubble-time">
                      {msg.time?.toDate?.()
                        ? msg.time.toDate().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="chat-input-wrap">
                <input
                  className="chat-input" type="text" placeholder="Üzenet..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="send-btn" onClick={sendMessage}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="messages-header">
                <span>Messages</span>
                <IoMdClose className="closeChat" onClick={() => setShowMessage(false)} />
              </div>
              <div className="messages-tabs">
                <button className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`} onClick={() => setActiveTab('friends')}>Friends</button>
                <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>Others</button>
              </div>

              {activeTab === 'friends' && (
                <>
                  <div className="new-chat">
                    <select defaultValue="" onChange={(e) => openNewConversation(e.target.value)}>
                      <option value="" disabled>New message to a friend...</option>
                      {friends.map((email) => <option key={email} value={email}>{email}</option>)}
                    </select>
                  </div>
                  <div className="conversations-list">
                    <p className="section-label">Most recent</p>
                    {messages.length === 0
                      ? <p className="no-messages">There are no messages yet.</p>
                      : messages.map((conv, i) => {
                        const other = conv.participants.find((p) => p !== user.email);
                        const lastMsg = conv.messages[conv.messages.length - 1];
                        return (
                          <div key={i} className="conversation-item" onClick={() => openConversation(conv)}>
                            <div className="conv-avatar">{other?.[0]?.toUpperCase()}</div>
                            <div className="conv-info">
                              <span className="conv-email">{other}</span>
                              <span className="conv-last-msg">
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
                  <div className="new-chat">
                    <select defaultValue="" onChange={(e) => openNewConversation(e.target.value)}>
                      <option value="" disabled>Start a new conversation...</option>
                      {nonfriends.map((email) => <option key={email} value={email}>{email}</option>)}
                    </select>
                  </div>
                  <div className="conversations-list">
                    <p className="section-label">Others</p>
                    {nonfriends.length === 0
                      ? <p className="no-messages">Everyone's friends now!</p>
                      : nonfriends.map((email, i) => (
                        <div key={i} className="conversation-item" onClick={() => openNewConversation(email)}>
                          <div className="conv-avatar">{email?.[0]?.toUpperCase()}</div>
                          <div className="conv-info">
                            <span className="conv-email">{email}</span>
                            <span className="conv-last-msg" style={{ fontStyle: 'italic' }}>No messages yet</span>
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
