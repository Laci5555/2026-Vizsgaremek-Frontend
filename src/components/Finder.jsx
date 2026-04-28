import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Finder.css';
import { GoPlus } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';
import { IoArrowBack, IoExitOutline } from 'react-icons/io5';
import {
  addDoc, collection, getDocs, getDoc, doc,
  updateDoc, arrayUnion, arrayRemove, deleteDoc,
  query, where, orderBy, Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebaseApp';
import { useApp } from '../AppContext';

export default function Finder() {
  const { user } = useApp();
  const navigate = useNavigate();

  // Listák
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);

  // Kiválasztott poszt / szoba
  const [selectedPost, setSelectedPost] = useState(null);
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [inRoom, setInRoom] = useState(false);

  // Create modal
  const [isOpen, setIsOpen] = useState(false);
  const [newGame, setNewGame] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLimit, setNewLimit] = useState(4);

  const [limitEnabled, setLimitEnabled] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const MAX_DESC = 300;

  // ── Betöltés ──
  useEffect(() => {
    async function load() {
      const [usersSnap, postsSnap, gamesSnap] = await Promise.all([
        getDocs(collection(db, 'user-data')),
        getDocs(collection(db, 'finder-posts')),
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
    if (!room) return;
    async function loadMessages() {
      const snap = await getDocs(
        query(
          collection(db, 'finder-messages'),
          where('roomId', '==', room.id),
          orderBy('time', 'asc'),
        ),
      );
      setMessages(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
    }
    loadMessages();
  }, [room, refresh]);

  function getUser(email) {
    return users.find((x) => x.email === email);
  }

  // ── Poszt létrehozása ──
  async function createPost() {
    if (!newGame || !newDescription.trim()) return;
    try {
      // 1. Poszt létrehozása
      const postRef = await addDoc(collection(db, 'finder-posts'), {
        creatorEmail: user.email,
        game: newGame,
        description: newDescription,
        limit: newLimit,
        createdAt: Timestamp.now(),
      });
      // 2. Szoba létrehozása, creator automatikusan tag
      await addDoc(collection(db, 'finder-rooms'), {
        postId: postRef.id,
        members: [user.email],
      });
      setIsOpen(false);
      setNewGame('');
      setNewDescription('');
      setNewLimit(4);
      setRefresh((p) => !p);
    } catch (err) { console.error(err); }
  }

  // ── Szoba megnyitása ──
  async function openPost(post) {
    setSelectedPost(post);
    const snap = await getDocs(
      query(collection(db, 'finder-rooms'), where('postId', '==', post.id))
    );
    if (!snap.empty) {
      const roomDoc = { ...snap.docs[0].data(), id: snap.docs[0].id };
      setRoom(roomDoc);
      setInRoom(roomDoc.members.includes(user.email));
    }
  }

  // ── Csatlakozás ──
  async function joinRoom() {
    if (!room || room.members.length >= selectedPost.limit) return;
    await updateDoc(doc(db, 'finder-rooms', room.id), {
      members: arrayUnion(user.email),
    });
    setRoom((r) => ({ ...r, members: [...r.members, user.email] }));
    setInRoom(true);
    setRefresh((p) => !p);
  }

  // ── Kilépés ──
  async function leaveRoom() {
    if (!room) return;
    const newMembers = room.members.filter((m) => m !== user.email);

    // Ha a creator lép ki, töröljük a posztot és a szobát
    if (selectedPost.creatorEmail === user.email) {
      await deleteDoc(doc(db, 'finder-rooms', room.id));
      await deleteDoc(doc(db, 'finder-posts', selectedPost.id));
      setSelectedPost(null);
      setRoom(null);
      setInRoom(false);
      setRefresh((p) => !p);
      return;
    }

    await updateDoc(doc(db, 'finder-rooms', room.id), {
      members: arrayRemove(user.email),
    });
    setRoom((r) => ({ ...r, members: newMembers }));
    setInRoom(false);
    setRefresh((p) => !p);
  }

  // ── Üzenet küldése ──
  async function sendMessage() {
    if (message.trim() === '' || !inRoom) return;
    const optimistic = {
      id: `temp-${Date.now()}`,
      roomId: room.id,
      email: user.email,
      message: message,
      time: Timestamp.now(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setMessage('');
    try {
      await addDoc(collection(db, 'finder-messages'), {
        roomId: room.id,
        email: user.email,
        message: optimistic.message,
        time: optimistic.time,
      });
      setRefresh((p) => !p);
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

  const isFull = room && selectedPost && room.members.length >= selectedPost.limit;
  const currentUser = getUser(user?.email);

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
            const creator = getUser(post.creatorEmail);
            const game = games.find((g) => g.id === post.game || g.name === post.game);
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
                  <span className="finder-limit">
                    {/* members count unknown here, shown in detail */}
                    Max {post.limit} players
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Poszt részlet + chat ── */}
      {selectedPost && (
        <div className="finder-room">
          <div className="finder-room-header">
            <button className="finder-back" onClick={closePost}>
              <IoArrowBack />
            </button>
            <div className="finder-room-info">
              <img src={getUser(selectedPost.creatorEmail)?.picture} alt="" className="finder-pfp" />
              <div>
                <span className="finder-username">{getUser(selectedPost.creatorEmail)?.username}</span>
                <span className="finder-game">
                  {games.find((g) => g.id === selectedPost.game || g.name === selectedPost.game)?.name ?? selectedPost.game}
                </span>
              </div>
            </div>
            <div className="finder-room-meta">
              <span className={`finder-members ${isFull ? 'full' : ''}`}>
                {room?.members.length ?? 0} / {selectedPost.limit}
              </span>
              {inRoom && (
                <button className="finder-leave" onClick={leaveRoom} title="Leave room">
                  <IoExitOutline />
                </button>
              )}
            </div>
          </div>

          <p className="finder-room-desc">{selectedPost.description}</p>

          {/* Chat – csak tagoknak */}
          {inRoom ? (
            <>
              <div className="finder-chat">
                {messages.map((m) => {
                  const msgUser = getUser(m.email);
                  return (
                    <div key={m.id} className={`finder-message ${m.email === user.email ? 'own' : ''}`}>
                      <div className="finder-msg-user">
                        <img src={msgUser?.picture} alt="" className="finder-pfp-sm" />
                        <span>{msgUser?.username ?? m.email}</span>
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

      {/* ── Create FAB ── */}
      <div className="finder-fab" onClick={() => setIsOpen(true)} title="New post">
        <GoPlus />
      </div>

      {/* ── Create modal ── */}
      <div
        className={`backdrop ${isOpen ? 'visible' : ''}`}
        onMouseDownCapture={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
      >
        <div className="finder-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

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
                <input type="checkbox" checked={limitEnabled} onChange={() => setLimitEnabled(p => !p)} />
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