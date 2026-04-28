import { useEffect, useState, useRef } from 'react';
import Navbar from './Navbar';
import './Finder.css';
import { GoPlus } from 'react-icons/go';
import { IoArrowBack, IoExitOutline } from 'react-icons/io5';
import { MdPersonRemove } from 'react-icons/md';
import {
  addDoc, collection, getDocs, doc,
  updateDoc, arrayUnion, arrayRemove, deleteDoc,
  query, where, orderBy, Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebaseApp';
import { useApp } from '../AppContext';

export default function Finder() {
  const { user } = useApp();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);

  const [selectedPost, setSelectedPost] = useState(null);
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [inRoom, setInRoom] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [newGame, setNewGame] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLimit, setNewLimit] = useState(4);
  const [limitEnabled, setLimitEnabled] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const chatRef = useRef(null);
  const MAX_DESC = 300;

  // ── Betöltés ──
  useEffect(() => {
    async function load() {
      const [usersSnap, postsSnap, gamesSnap] = await Promise.all([
        getDocs(collection(db, 'user-data')),
        getDocs(collection(db, 'finder-groups')),
        getDocs(collection(db, 'games')),
      ]);
      setUsers(usersSnap.docs.map((d) => ({ ...d.data(), id: d.id })));
      setPosts(postsSnap.docs.map((d) => ({ ...d.data(), id: d.id })));
      setGames(gamesSnap.docs.map((d) => ({ ...d.data(), id: d.id })));
      setLoading(false);
    }
    load();
  }, [refresh]);

  // ── Üzenetek betöltése ──
  useEffect(() => {
    if (!selectedPost) return;
    async function loadMessages() {
      const snap = await getDocs(
        query(
          collection(db, 'finder-messages'),
          where('finderid', '==', selectedPost.id),
          orderBy('time', 'asc'),
        ),
      );
      setMessages(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
    }
    loadMessages();
  }, [selectedPost, refresh]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  function getUser(email) {
    return users.find((x) => x.email === email);
  }

  function getGame(gameId) {
    return games.find((g) => g.id === gameId || g.name === gameId);
  }

  // ── Szoba létrehozása ──
  async function createPost() {
    if (!newGame || !newDescription.trim()) return;
    try {
      await addDoc(collection(db, 'finder-groups'), {
        creatoremail: user.email,
        game: newGame,
        description: newDescription,
        maxplayers: limitEnabled ? newLimit : 0, // 0 = korlátlan
        members: [user.email],
        createdAt: Timestamp.now(),
      });
      setIsOpen(false);
      setNewGame('');
      setNewDescription('');
      setNewLimit(4);
      setLimitEnabled(false);
      setRefresh((p) => !p);
    } catch (err) { console.error(err); }
  }

  // ── Szoba megnyitása ──
  async function openPost(post) {
    setSelectedPost(post);
    setInRoom((post.members ?? []).includes(user.email));
  }

  // ── Csatlakozás ──
  async function joinRoom() {
    if (!selectedPost) return;
    const isFull = selectedPost.maxplayers > 0 &&
      (selectedPost.members ?? []).length >= selectedPost.maxplayers;
    if (isFull) return;
    await updateDoc(doc(db, 'finder-groups', selectedPost.id), {
      members: arrayUnion(user.email),
    });
    const updated = { ...selectedPost, members: [...(selectedPost.members ?? []), user.email] };
    setSelectedPost(updated);
    setPosts((prev) => prev.map((p) => p.id === selectedPost.id ? updated : p));
    setInRoom(true);
  }

  // ── Kilépés ──
  async function leaveRoom() {
    if (!selectedPost) return;

    // Creator kilép → szoba + üzenetek törlése
    if (selectedPost.creatoremail === user.email) {
      // Üzenetek törlése
      const msgsSnap = await getDocs(
        query(collection(db, 'finder-messages'), where('finderid', '==', selectedPost.id))
      );
      await Promise.all(msgsSnap.docs.map((d) => deleteDoc(d.ref)));
      await deleteDoc(doc(db, 'finder-groups', selectedPost.id));
      setPosts((prev) => prev.filter((p) => p.id !== selectedPost.id));
      closePost();
      return;
    }

    const newMembers = (selectedPost.members ?? []).filter((m) => m !== user.email);
    await updateDoc(doc(db, 'finder-groups', selectedPost.id), {
      members: arrayRemove(user.email),
    });
    const updated = { ...selectedPost, members: newMembers };
    setSelectedPost(updated);
    setPosts((prev) => prev.map((p) => p.id === selectedPost.id ? updated : p));
    setInRoom(false);
  }

  // ── Tag kirúgása (csak creator) ──
  async function kickMember(email) {
    if (!selectedPost || selectedPost.creatoremail !== user.email) return;
    const newMembers = (selectedPost.members ?? []).filter((m) => m !== email);
    await updateDoc(doc(db, 'finder-groups', selectedPost.id), {
      members: arrayRemove(email),
    });
    const updated = { ...selectedPost, members: newMembers };
    setSelectedPost(updated);
    setPosts((prev) => prev.map((p) => p.id === selectedPost.id ? updated : p));
  }

  // ── Üzenet küldése ──
  async function sendMessage() {
    if (message.trim() === '' || !inRoom || !selectedPost) return;
    const text = message.trim();
    const optimistic = {
      id: `temp-${Date.now()}`,
      finderid: selectedPost.id,
      sender: user.email,
      message: text,
      time: Timestamp.now(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setMessage('');
    try {
      await addDoc(collection(db, 'finder-messages'), {
        finderid: selectedPost.id,
        sender: user.email,
        message: text,
        time: optimistic.time,
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
  }

  function closePost() {
    setSelectedPost(null);
    setRoom(null);
    setInRoom(false);
    setMessages([]);
  }

  const members = selectedPost?.members ?? [];
  const maxplayers = selectedPost?.maxplayers ?? 0;
  const isFull = maxplayers > 0 && members.length >= maxplayers;
  const isCreator = selectedPost?.creatoremail === user?.email;

  const XIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="finder">
      <Navbar />

      {/* ── Poszt lista ── */}
      {!selectedPost && (
        <div className="finder-list">
          {loading && <div className="finder-empty">Loading...</div>}
          {!loading && posts.length === 0 && (
            <div className="finder-empty">No posts yet. Be the first!</div>
          )}
          {posts.map((post) => {
            const creator = getUser(post.creatoremail);
            const game = getGame(post.game);
            const memberCount = (post.members ?? []).length;
            const full = post.maxplayers > 0 && memberCount >= post.maxplayers;
            return (
              <div className="finder-card" key={post.id} onClick={() => openPost(post)}>
                <div className="finder-card-top">
                  <img src={creator?.picture} alt="" className="finder-pfp" />
                  <div className="finder-card-meta">
                    <span className="finder-username">{creator?.username}</span>
                    <span className="finder-game">{game?.name ?? post.game}</span>
                  </div>
                  {game?.img && <img src={game.img} alt={game.name} className="finder-game-img" />}
                </div>
                <p className="finder-desc">{post.description}</p>
                <div className="finder-card-footer">
                  <span className={`finder-limit ${full ? 'finder-limit-full' : ''}`}>
                    {post.maxplayers > 0
                      ? `${memberCount} / ${post.maxplayers} players${full ? ' · FULL' : ''}`
                      : `${memberCount} player${memberCount !== 1 ? 's' : ''}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Szoba nézet ── */}
      {selectedPost && (
        <div className="finder-room">
          <div className="finder-room-header">
            <button className="finder-back" onClick={closePost}>
              <IoArrowBack />
            </button>
            <div className="finder-room-info">
              <img src={getUser(selectedPost.creatoremail)?.picture} alt="" className="finder-pfp" />
              <div>
                <span className="finder-username">{getUser(selectedPost.creatoremail)?.username}</span>
                <span className="finder-game">
                  {getGame(selectedPost.game)?.name ?? selectedPost.game}
                </span>
              </div>
            </div>
            <div className="finder-room-meta">
              <span className={`finder-members ${isFull ? 'full' : ''}`}>
                {members.length}{maxplayers > 0 ? ` / ${maxplayers}` : ''} 
              </span>
              {inRoom && (
                <button className="finder-leave" onClick={leaveRoom} title="Leave room">
                  <IoExitOutline />
                </button>
              )}
            </div>
          </div>

          <p className="finder-room-desc">{selectedPost.description}</p>

          {/* ── Tagok lista (creator látja a kick gombokat) ── */}
          {inRoom && (
            <div className="finder-members-list">
              {members.map((email) => {
                const u = getUser(email);
                return (
                  <div key={email} className="finder-member-item">
                    <img src={u?.picture} alt="" className="finder-pfp-sm" />
                    <span>{u?.username ?? email}</span>
                    {email === selectedPost.creatoremail && (
                      <span className="finder-owner-badge">owner</span>
                    )}
                    {isCreator && email !== user.email && (
                      <button
                        className="finder-kick-btn"
                        onClick={() => kickMember(email)}
                        title="Kick"
                      >
                        <MdPersonRemove />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Chat – csak tagoknak ── */}
          {inRoom ? (
            <>
              <div className="finder-chat" ref={chatRef}>
                {messages.map((m) => {
                  const msgUser = getUser(m.sender);
                  return (
                    <div key={m.id} className={`finder-message ${m.sender === user.email ? 'own' : ''}`}>
                      <div className="finder-msg-user">
                        <img src={msgUser?.picture} alt="" className="finder-pfp-sm" />
                        <span>{msgUser?.username ?? m.sender}</span>
                      </div>
                      <p>{m.message}</p>
                    </div>
                  );
                })}
              </div>
              <div className="finder-input">
                <input
                  type="text"
                  placeholder="Type a message…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div className="finder-join-area">
              {isFull
                ? <p className="finder-full-msg">This room is full.</p>
                : <button className="finder-join-btn" onClick={joinRoom}>Join room</button>
              }
            </div>
          )}
        </div>
      )}

      {/* ── FAB ── */}
      {!selectedPost && (
        <div className="finder-fab" onClick={() => setIsOpen(true)} title="New post">
          <GoPlus />
        </div>
      )}

      {/* ── Create modal ── */}
      <div
        className={`backdrop ${isOpen ? 'visible' : ''}`}
        onMouseDownCapture={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
      >
        <div className="finder-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setIsOpen(false)}><XIcon /></button>
          <h2 className="finder-modal-title">Find a teammate</h2>

          <div className="finder-field">
            <label>Game</label>
            <select value={newGame} onChange={(e) => setNewGame(e.target.value)}>
              <option value="">Select a game...</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="finder-field">
            <label>Description</label>
            <textarea
              placeholder="What are you looking for?"
              maxLength={MAX_DESC}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <span className="finder-charcount">{newDescription.length} / {MAX_DESC}</span>
          </div>

          <div className="finder-field">
            <div className="finder-limit-toggle">
              <label>Max players (including you)</label>
              <label className="toggle">
                <input type="checkbox" checked={limitEnabled} onChange={() => setLimitEnabled((p) => !p)} />
                <div className="track"><div className="thumb" /></div>
              </label>
            </div>
            {limitEnabled && (
              <div className="finder-limit-row">
                <input
                  type="range" min={2} max={20}
                  value={newLimit}
                  onChange={(e) => setNewLimit(Number(e.target.value))}
                />
                <span className="finder-limit-val">{newLimit}</span>
              </div>
            )}
          </div>

          <button
            className="finder-create-btn"
            disabled={!newGame || !newDescription.trim()}
            onClick={createPost}
          >
            Create post
          </button>
        </div>
      </div>
    </div>
  );
}