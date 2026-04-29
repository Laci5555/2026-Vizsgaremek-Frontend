import { useEffect, useState, useRef } from 'react';
import Navbar from './Navbar';
import './Finder.css';
import { GoPlus } from 'react-icons/go';
import { IoArrowBack, IoExitOutline } from 'react-icons/io5';
import { MdPersonRemove } from 'react-icons/md';
import {
  addDoc, collection, getDocs, doc,
  updateDoc, arrayUnion, arrayRemove, deleteDoc,
  query, where, orderBy, Timestamp, onSnapshot,
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
      const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
      const now = Date.now();

      const [usersSnap, postsSnap, gamesSnap] = await Promise.all([
        getDocs(collection(db, 'user-data')),
        getDocs(collection(db, 'finder-groups')),
        getDocs(collection(db, 'games')),
      ]);

      const allUsers = usersSnap.docs.map((d) => ({ ...d.data(), id: d.id }));
      const allPosts = postsSnap.docs.map((d) => ({ ...d.data(), id: d.id }));

      // Disabled userek emailjei
      const disabledEmails = new Set(
        allUsers.filter((u) => u.disabled === true).map((u) => u.email)
      );

      // lastActivity: ha nincs, createdAt alapján számítjuk
      const getActivityMs = (p) => {
        if (p.lastActivity) return p.lastActivity.toMillis?.() ?? p.lastActivity;
        if (p.createdAt) return p.createdAt.toMillis?.() ?? p.createdAt;
        return 0;
      };

      // Törlendő: disabled creator VAGY 3 napja inaktív
      const toDelete = allPosts.filter(
        (p) => disabledEmails.has(p.creatoremail) || (now - getActivityMs(p)) >= THREE_DAYS_MS
      );
      const validPosts = allPosts.filter(
        (p) => !disabledEmails.has(p.creatoremail) && (now - getActivityMs(p)) < THREE_DAYS_MS
      );

      // Törlés Firestore-ból (csoport + üzenetei)
      await Promise.all(
        toDelete.map(async (p) => {
          const msgsSnap = await getDocs(
            query(collection(db, 'finder-messages'), where('finderid', '==', p.id))
          );
          await Promise.all(msgsSnap.docs.map((d) => deleteDoc(d.ref)));
          await deleteDoc(doc(db, 'finder-groups', p.id));
        })
      );

      setUsers(allUsers);
      setPosts(validPosts);
      setGames(gamesSnap.docs.map((d) => ({ ...d.data(), id: d.id })));
      setLoading(false);
    }
    load();
  }, [refresh]);

  // ── Üzenetek valós idejű figyelése ──
  useEffect(() => {
    if (!selectedPost) return;
    const q = query(
      collection(db, 'finder-messages'),
      where('finderid', '==', selectedPost.id),
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
      msgs.sort((a, b) => {
        const ta = a.time?.toMillis?.() ?? a.time ?? 0;
        const tb = b.time?.toMillis?.() ?? b.time ?? 0;
        return ta - tb;
      });
      setMessages(msgs);
    }, (err) => {
      console.error('onSnapshot error:', err);
    });
    return () => unsub();
  }, [selectedPost?.id]);

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
    const now = Timestamp.now();
    setMessage('');
    try {
      await addDoc(collection(db, 'finder-messages'), {
        finderid: selectedPost.id,
        sender: user.email,
        message: text,
        time: now,
      });
      // Frissítjük a csoport lastActivity mezőjét → inaktivitás számítás alapja
      await updateDoc(doc(db, 'finder-groups', selectedPost.id), {
        lastActivity: now,
      });
      const updatedPost = { ...selectedPost, lastActivity: now };
      setSelectedPost(updatedPost);
      setPosts((prev) => prev.map((p) => p.id === selectedPost.id ? updatedPost : p));
    } catch (err) {
      console.error(err);
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

  // Expiry helper – újrahasználható
  const getExpiryInfo = (post) => {
    if (!post) return null;
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    const getActivityMs = (p) => {
      if (p.lastActivity) return p.lastActivity.toMillis?.() ?? p.lastActivity;
      if (p.createdAt) return p.createdAt.toMillis?.() ?? p.createdAt;
      return Date.now();
    };
    const activityMs = getActivityMs(post);
    const hoursLeft = (THREE_DAYS_MS - (Date.now() - activityMs)) / (1000 * 60 * 60);
    const daysLeft = Math.ceil(hoursLeft / 24);
    if (hoursLeft <= 0) return { label: 'Closes today', tier: 'red' };
    if (hoursLeft <= 24) return { label: 'Closes today', tier: 'red' };
    if (daysLeft === 2) return { label: 'Closes in 2 days', tier: 'orange' };
    if (daysLeft === 3) return { label: 'Closes in 3 days', tier: 'gray' };
    return null;
  };
  const roomExpiryInfo = getExpiryInfo(selectedPost);

  const InfoIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6.5" cy="6.5" r="5.75" stroke="currentColor" strokeWidth="1.25" />
      <rect x="6" y="5.5" width="1" height="4" rx="0.5" fill="currentColor" />
      <rect x="6" y="3.5" width="1" height="1" rx="0.5" fill="currentColor" />
    </svg>
  );

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

            // Expiry számítás
            const expiryInfo = getExpiryInfo(post);

            // Leírás tördelése 100 karakterenként
            const formatDesc = (text) => {
              if (!text) return '';
              const chunks = [];
              for (let i = 0; i < text.length; i += 100) {
                chunks.push(text.slice(i, i + 100));
              }
              if(text.length>100){
                return chunks[0]+"...";
              }
              return text;
            };

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
                <p className="finder-desc">{formatDesc(post.description)}</p>
                <div className="finder-card-footer">
                  <span />
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
          {roomExpiryInfo && (
            <div className={`finder-room-expiry finder-room-expiry--${roomExpiryInfo.tier}`}>
              <InfoIcon />
              <span>{roomExpiryInfo.label}</span>
              <span className="finder-expiry-tooltip">
                This room closes automatically after 3 days of inactivity (no new messages).
              </span>
            </div>
          )}

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