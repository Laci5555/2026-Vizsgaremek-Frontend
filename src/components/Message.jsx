import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../firebaseApp';
import {
  addDoc, collection, getDocs, setDoc, doc,
  or, orderBy, query, Timestamp, where, onSnapshot,
} from 'firebase/firestore';
import { IoMdClose } from 'react-icons/io';
import { IoArrowBack } from 'react-icons/io5';
import './Message.css';
import { FaUserFriends } from 'react-icons/fa';
import { useApp } from '../AppContext';

const PLACEHOLDER = 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-2409187029.jpg';

function UserAvatar({ src, alt, className, style }) {
  return (
    <img
      src={src || PLACEHOLDER}
      alt={alt || ''}
      className={className}
      style={{ objectFit: 'cover', ...style }}
      onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
    />
  );
}

function Badge({ count }) {
  if (!count || count === 0) return null;
  return <span className="unread-badge">{count > 9 ? '9+' : count}</span>;
}

export default function Message() {
  const { user } = useApp();

  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [friendEmails, setFriendEmails] = useState([]);
  const [readTimestamps, setReadTimestamps] = useState({});

  const [showMessage, setShowMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');
  const [selectedConv, setSelectedConv] = useState(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  function createKey(a, b) { return [a, b].sort().join('__'); }
  function getUserByEmail(email) { return allUsers.find((u) => u.email === email) ?? null; }

  // ── Fetch users ──────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchUsers() {
      const snap = await getDocs(collection(db, 'user-data'));
      setAllUsers(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
    }
    fetchUsers();
  }, []);

  // ── Fetch read timestamps ────────────────────────────────────────────
  useEffect(() => {
    if (!user?.email) return;
    async function fetchReadTs() {
      const snap = await getDocs(
        query(collection(db, 'read-timestamps'), where('userEmail', '==', user.email))
      );
      const map = {};
      snap.docs.forEach((d) => { map[d.data().convKey] = d.data().readAt?.toDate?.() ?? null; });
      setReadTimestamps(map);
    }
    fetchReadTs();
  }, [user]);

  // ── Real-time listener ───────────────────────────────────────────────
  useEffect(() => {
    if (!user?.email) return;

    const q = query(
      collection(db, 'private-messages'),
      or(
        where('sender', '==', user.email),
        where('receiver', '==', user.email),
      ),
      orderBy('time', 'asc'),
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const adatList = snap.docs.map((d) => ({ ...d.data(), id: d.id }));

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

      const allConvs = Object.values(grouped);
      setMessages(allConvs);
      setFriendEmails([...friendsSet]);

      // Nyitott conv üzeneteinek frissítése
      setSelectedConv((prev) => {
        if (!prev) return prev;
        const key = createKey(user.email, prev.otherEmail);
        const updated = allConvs.find(
          (c) => createKey(c.participants[0], c.participants[1]) === key
        );
        if (updated) return { ...prev, messages: updated.messages };
        return prev;
      });
    });

    return () => unsubscribe();
  }, [user]);

  // ── Ha nyitva van conv és jön új üzenet → azonnal olvasottnak jelöljük ──
  useEffect(() => {
    if (!selectedConv) return;
    markAsRead(selectedConv.otherEmail);
  }, [selectedConv?.messages?.length]);

  // ── Scroll to bottom ─────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages?.length]);

  // ── Send message ─────────────────────────────────────────────────────
  async function sendMessage() {
    if (!inputText.trim() || !selectedConv || !user?.email) return;
    const newMsg = {
      sender: user.email,
      receiver: selectedConv.otherEmail,
      text: inputText.trim(),
      time: Timestamp.now(),
    };
    setInputText('');
    try {
      await addDoc(collection(db, 'private-messages'), newMsg);
    } catch (err) { console.error(err); }
  }

  // ── Mark as read ─────────────────────────────────────────────────────
  async function markAsRead(otherEmail) {
    if (!user?.email) return;
    const key = createKey(user.email, otherEmail);
    const now = Timestamp.now();
    const docId = `${user.email}__${key}`.replace(/[^a-zA-Z0-9_]/g, '_');
    await setDoc(doc(db, 'read-timestamps', docId), {
      userEmail: user.email,
      convKey: key,
      readAt: now,
    });
    setReadTimestamps((prev) => ({ ...prev, [key]: now.toDate() }));
  }

  // ── Open conversation ────────────────────────────────────────────────
  function openConversation(conv) {
    const other = conv.participants.find((p) => p !== user.email);
    setSelectedConv({ otherEmail: other, messages: conv.messages });
    setSearchQuery('');
    markAsRead(other);
  }

  function openNewConversation(email) {
    if (!email) return;
    const key = createKey(user.email, email);
    const existing = messages.find(
      (c) => createKey(c.participants[0], c.participants[1]) === key,
    );
    setSelectedConv({ otherEmail: email, messages: existing?.messages ?? [] });
    setSearchQuery('');
    markAsRead(email);
  }

  // ── Unread count ─────────────────────────────────────────────────────
  function getUnreadCount(otherEmail) {
    const key = createKey(user.email, otherEmail);
    const conv = messages.find(
      (c) => createKey(c.participants[0], c.participants[1]) === key,
    );
    if (!conv) return 0;
    const readAt = readTimestamps[key];
    return conv.messages.filter((m) => {
      if (m.sender === user.email) return false;
      if (!readAt) return true;
      const msgTime = m.time?.toDate?.() ?? null;
      return msgTime && msgTime > readAt;
    }).length;
  }

  // ── Total unread for FAB badge ───────────────────────────────────────
  const totalUnread = friendEmails.reduce((sum, email) => sum + getUnreadCount(email), 0);

  // ── Filtered & sorted lists ──────────────────────────────────────────
  const q = searchQuery.toLowerCase().trim();
  const activeUsers = allUsers.filter((u) => !u.disabled);

  // Legutóbbi üzenet ideje egy conv-ban
  function lastMsgTime(email) {
    const key = createKey(user.email, email);
    const conv = messages.find(
      (c) => createKey(c.participants[0], c.participants[1]) === key,
    );
    if (!conv || conv.messages.length === 0) return 0;
    return conv.messages[conv.messages.length - 1].time?.toDate?.()?.getTime() ?? 0;
  }

  const friendUsers = activeUsers
    .filter((u) => u.email !== user?.email && friendEmails.includes(u.email))
    .sort((a, b) => lastMsgTime(b.email) - lastMsgTime(a.email)); // legújabb felül

  const otherUsers = activeUsers.filter(
    (u) => u.email !== user?.email && !friendEmails.includes(u.email),
  );

  const filteredFriends = q
    ? friendUsers.filter(
        (u) => (u.username ?? '').toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      )
    : friendUsers;

  const filteredOthers = q
    ? otherUsers.filter(
        (u) => (u.username ?? '').toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      )
    : otherUsers;

  if (!user) return null;

  const otherUser = selectedConv ? getUserByEmail(selectedConv.otherEmail) : null;

  return (
    <div className="message">
      {!showMessage ? (
        <div className="showChat" onClick={() => setShowMessage(true)} style={{ position: 'relative' }}>
          <FaUserFriends />
          <Badge count={totalUnread} />
        </div>
      ) : (
        <div className="messages">

          {/* ── CHAT VIEW ── */}
          {selectedConv ? (
            <>
              <div className="messages-header">
                <div className="header-left">
                  <IoArrowBack className="backBtn" onClick={() => setSelectedConv(null)} />
                  <UserAvatar
                    src={otherUser?.picture}
                    alt={otherUser?.username}
                    style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }}
                  />
                  <span className="header-email">
                    {otherUser?.username ?? selectedConv.otherEmail}
                  </span>
                </div>
                <IoMdClose className="closeChat" onClick={() => setShowMessage(false)} />
              </div>

              <div className="chat-messages">
                {selectedConv.messages.map((msg, i) => {
                  const senderUser = getUserByEmail(msg.sender);
                  const isMe = msg.sender === user.email;
                  return (
                    <div key={msg.id ?? i} className={`bubble-wrap ${isMe ? 'me' : 'them'}`}>
                      {!isMe && (
                        <UserAvatar
                          src={senderUser?.picture}
                          alt={senderUser?.username}
                          style={{ width: 22, height: 22, borderRadius: '50%', marginBottom: 2 }}
                        />
                      )}
                      <div className={`bubble ${isMe ? 'me' : 'them'}`}>{msg.text}</div>
                      <span className="bubble-time">
                        {msg.time?.toDate?.()
                          ? (() => {
                              const d = msg.time.toDate();
                              const now = new Date();
                              const isToday = d.toDateString() === now.toDateString();
                              const yesterday = new Date(now);
                              yesterday.setDate(now.getDate() - 1);
                              const isYesterday = d.toDateString() === yesterday.toDateString();
                              if (isToday) return d.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
                              if (isYesterday) return 'tegnap';
                              return d.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
                            })()
                          : ''}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-wrap">
                <input
                  className="chat-input"
                  type="text"
                  placeholder="Üzenet..."
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

          /* ── LIST VIEW ── */
            <>
              <div className="messages-header">
                <span>Messages</span>
                <IoMdClose className="closeChat" onClick={() => setShowMessage(false)} />
              </div>

              <div className="messages-tabs">
                <button
                  className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('friends'); setSearchQuery(''); }}
                >
                  Direct-Messages
                </button>
                <button
                  className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                >
                  Others
                </button>
              </div>

              {/* Search box */}
              <div className="new-chat" style={{ paddingBottom: 10 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.04)',
                  borderBottom: '1px solid rgba(255,255,255,0.12)',
                  padding: '6px 4px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder={activeTab === 'friends' ? 'Search friends...' : 'Search users...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1, background: 'transparent', border: 'none', outline: 'none',
                      fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'inherit',
                    }}
                  />
                  {searchQuery && (
                    <IoMdClose
                      style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}
                      onClick={() => setSearchQuery('')}
                    />
                  )}
                </div>
              </div>

              {/* Friends tab */}
              {activeTab === 'friends' && (
                <div className="conversations-list">
                  <p className="section-label">Most recent</p>
                  {filteredFriends.length === 0 ? (
                    <p className="no-messages">
                      {q ? 'No results.' : 'No conversations yet.'}
                    </p>
                  ) : (
                    filteredFriends.map((fu) => {
                      const key = createKey(user.email, fu.email);
                      const conv = messages.find(
                        (c) => createKey(c.participants[0], c.participants[1]) === key,
                      );
                      const lastMsg = conv?.messages[conv.messages.length - 1];
                      const unread = getUnreadCount(fu.email);
                      return (
                        <div
                          key={fu.email}
                          className="conversation-item"
                          onClick={() => conv ? openConversation(conv) : openNewConversation(fu.email)}
                        >
                          <UserAvatar
                            src={fu.picture}
                            alt={fu.username}
                            style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                              border: '1px solid rgba(255,255,255,0.08)' }}
                          />
                          <div className="conv-info">
                            <span className="conv-email">{fu.username ?? fu.email}</span>
                            {lastMsg && (
                              <span className="conv-last-msg">
                                {lastMsg.sender === user.email ? 'You: ' : ''}{lastMsg.text}
                              </span>
                            )}
                          </div>
                          {unread > 0 && (
                            <div className="conv-right">
                              <Badge count={unread} />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Others tab */}
              {activeTab === 'all' && (
                <div className="conversations-list">
                  <p className="section-label">Others</p>
                  {filteredOthers.length === 0 ? (
                    <p className="no-messages">
                      {q ? 'No results.' : "Everyone's friends now!"}
                    </p>
                  ) : (
                    filteredOthers.map((ou) => (
                      <div
                        key={ou.email}
                        className="conversation-item"
                        onClick={() => openNewConversation(ou.email)}
                      >
                        <UserAvatar
                          src={ou.picture}
                          alt={ou.username}
                          style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                            border: '1px solid rgba(255,255,255,0.08)' }}
                        />
                        <div className="conv-info">
                          <span className="conv-email">{ou.username ?? ou.email}</span>
                          <span className="conv-last-msg" style={{ fontStyle: 'italic' }}>
                            No messages yet
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}