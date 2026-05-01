import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import './Profile.css';
import { db } from '../../firebaseApp';
import { useApp } from '../AppContext';
import {
  IoHeartOutline, IoChatbubblesOutline, IoPeopleOutline,
  IoPersonOutline, IoAddOutline, IoTrashOutline, IoCheckmark,
  IoCloseOutline,
} from 'react-icons/io5';
import { GoPlus } from 'react-icons/go';

const MAX_DESC = 300;

const XIcon = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
    <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function Profile({ auth }) {
  const { user, isAdmin } = useApp();
  const navigate = useNavigate();

  // Tab definíciók
  const TABS = [
    { id: 'favourites', label: 'Favourite Games', icon: <IoHeartOutline /> },
    { id: 'discussions', label: isAdmin ? 'All Discussions' : 'My Discussions', icon: <IoChatbubblesOutline /> },
    { id: 'peoples', label: 'Peoples', icon: <IoPeopleOutline />, adminOnly: true },
    { id: 'profile', label: 'My Profile', icon: <IoPersonOutline /> },
  ];

  // ── User adatok ──
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [currentid, setCurrentid] = useState(null);
  const [useUrl, setUseUrl] = useState(true);
  const [activeTab, setActiveTab] = useState('favourites');

  // ── Favourite games ──
  const [favourites, setFavourites] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [showGamePicker, setShowGamePicker] = useState(false);
  const [gameSearch, setGameSearch] = useState('');

  // ── My discussions ──
  const [discussions, setDiscussions] = useState([]);
  const [editingDiscId, setEditingDiscId] = useState(null);
  const [editingDesc, setEditingDesc] = useState('');
  const [discSearch, setDiscSearch] = useState('');

  // ── Peoples (admin) ──
  const [allUsers, setAllUsers] = useState([]);
  const [peoples, setPeoples] = useState([]);
  const [peopleSearch, setPeopleSearch] = useState('');

  useEffect(() => {
    if (!user?.email) return;
    async function load() {
      // User adatok
      const userSnap = await getDocs(query(collection(db, 'user-data'), where('email', '==', user.email)));
      const userData = userSnap.docs[0];
      if (userData) {
        const d = userData.data();
        setUsername(d.username ?? '');
        setProfilePicture(d.picture ?? '');
        setCurrentid(userData.id);
        setFavourites(d.favourites ?? []);
      }

      // Összes játék
      const gamesSnap = await getDocs(collection(db, 'games'));
      setAllGames(gamesSnap.docs.map((d) => ({ ...d.data(), id: d.id })));

      // Saját discussionök
      let discQuery;
      if (isAdmin) {
        discQuery = collection(db, 'discussions'); // admin mindent lát
      } else {
        discQuery = query(collection(db, 'discussions'), where('creatoremail', '==', user.email));
      }
      const discSnap = await getDocs(discQuery);
      setDiscussions(discSnap.docs.map((d) => ({ ...d.data(), id: d.id })));

      // Peoples (csak adminnak)
      if (isAdmin) {
        const peopleSnap = await getDocs(collection(db, 'user-data'));
        setPeoples(peopleSnap.docs.map((d) => ({ ...d.data(), id: d.id })).filter((p) => p.email !== user.email && !p.disabled));
      }

      const allUsersSnap = await getDocs(collection(db, 'user-data'));
      setAllUsers(allUsersSnap.docs.map((d) => ({ ...d.data(), id: d.id })));
    }
    load();
  }, [user, isAdmin]);

  // ── Logout ──
  async function logOut() {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) { console.error(err); }
  }

  // ── Favourite: hozzáadás ──
  async function addFavourite(gameId) {
    if (favourites.includes(gameId)) return;
    const next = [...favourites, gameId];
    setFavourites(next);
    setShowGamePicker(false);
    setGameSearch('');
    try {
      await updateDoc(doc(db, 'user-data', currentid), {
        favourites: arrayUnion(gameId),
      });
    } catch (err) { console.error(err); }
  }

  // ── Favourite: eltávolítás ──
  async function removeFavourite(gameId) {
    const next = favourites.filter((id) => id !== gameId);
    setFavourites(next);
    try {
      await updateDoc(doc(db, 'user-data', currentid), {
        favourites: arrayRemove(gameId),
      });
    } catch (err) { console.error(err); }
  }

  // ── Discussion: inline szerkesztés mentés ──
  async function saveDiscussion(id) {
    setDiscussions((prev) =>
      prev.map((d) => d.id === id ? { ...d, description: editingDesc } : d)
    );
    setEditingDiscId(null);
    try {
      await updateDoc(doc(db, 'discussions', id), {
        description: editingDesc,
      });
    } catch (err) { console.error(err); }
  }

  // ── Discussion: törlés ──
  async function deleteDiscussion(id) {
    setDiscussions((prev) => prev.filter((d) => d.id !== id));
    try {
      await deleteDoc(doc(db, 'discussions', id));
    } catch (err) { console.error(err); }
  }

  function getDiscussionCreator(email) {
    return allUsers.find((p) => p.email === email);
  }

  // ── Profile mentés ──
  async function updateData() {
    if (!currentid) return;
    try {
      await setDoc(doc(db, 'user-data', currentid), {
        email: user.email,
        username,
        picture: profilePicture,
        favourites,
      });
    } catch (err) { console.error(err); }
  }

  // ── User törlés (admin) – "Deleted" pattern ──
  async function deleteUser(person) {
    try {
      await updateDoc(doc(db, 'user-data', person.id), {
        username: 'Deleted',
        picture: 'https://www.shutterstock.com/image-vector/delete-account-vector-icon-user-600nw-2508332847.jpg',
        disabled: true,
      });
      setPeoples((prev) => prev.filter((p) => p.id !== person.id));
    } catch (err) { console.error(err); }
  }

  const visibleTabs = TABS.filter((t) => !t.adminOnly || isAdmin);
  const filteredGames = allGames.filter(
    (g) => !favourites.includes(g.id) && g.name.toLowerCase().includes(gameSearch.toLowerCase())
  );

  return (
    <div className="profile">
      <Navbar />
      <div className="profile-layout">
        {/* ── Sidebar (desktop) ── */}
        <aside className="profile-sidebar">
          <div className="profile-sidebar-user">
            <img
              src={profilePicture || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-2409187029.jpg'}
              alt="avatar"
              className="profile-sidebar-avatar"
            />
            <span className="profile-sidebar-name">{username || 'User'}</span>
          </div>
          <nav className="profile-nav">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                className={`profile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="profile-nav-icon">{tab.icon}</span>
                <span className="profile-nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
          <button className="profile-logout-btn" onClick={logOut}>Log out</button>
        </aside>

        {/* ── Content ── */}
        <main className="profile-content">

          {/* ── FAVOURITE GAMES ── */}
          {activeTab === 'favourites' && (
            <div className="profile-section">
              <div className="profile-section-header">
                <h2>Favourite Games</h2>
                <button className="profile-add-btn" onClick={() => setShowGamePicker(true)}>
                  <GoPlus /> Add game
                </button>
              </div>
              <div className="profile-fav-grid">
                {favourites.length === 0 && (
                  <p className="profile-empty">No favourite games yet.</p>
                )}
                {favourites.map((gameId) => {
                  const game = allGames.find((g) => g.id === gameId);
                  if (!game) return null;
                  return (
                    <div className="profile-fav-card" key={gameId}>
                      <img src={game.img} alt={game.name} />
                      <div className="profile-fav-info">
                        <span>{game.name}</span>
                        <button className="profile-fav-remove" onClick={() => removeFavourite(gameId)}>
                          <XIcon />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Game picker modal */}
              <div
                className={`backdrop ${showGamePicker ? 'visible' : ''}`}
                onMouseDownCapture={(e) => { if (e.target === e.currentTarget) setShowGamePicker(false); }}
              >
                <div className="profile-picker" onClick={(e) => e.stopPropagation()}>
                  <button className="close-btn" onClick={() => setShowGamePicker(false)}><XIcon /></button>
                  <h3>Add a favourite game</h3>
                  <input
                    type="text" placeholder="Search games..."
                    value={gameSearch}
                    onChange={(e) => setGameSearch(e.target.value)}
                    className="profile-picker-search"
                  />
                  <div className="profile-picker-list">
                    {filteredGames.map((g) => (
                      <div key={g.id} className="profile-picker-item" onClick={() => addFavourite(g.id)}>
                        <img src={g.img} alt={g.name} />
                        <span>{g.name}</span>
                      </div>
                    ))}
                    {filteredGames.length === 0 && <p className="profile-empty">No games found.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── MY DISCUSSIONS ── */}
          {activeTab === 'discussions' && (
            <div className="profile-section">
              <div className="profile-section-header">
                {isAdmin ? <h2>All Discussions</h2> : <h2>My Discussions</h2>}
              </div>
              <input
                type="text"
                className="profile-picker-search"
                placeholder="Search discussions..."
                value={discSearch}
                onChange={(e) => setDiscSearch(e.target.value)}
              />
              <div className="profile-disc-list">
                {discussions
                  .filter((d) => {
                    const creator = getDiscussionCreator(d.creatoremail);
                    return (
                      d.title?.toLowerCase().includes(discSearch.toLowerCase()) ||
                      d.description?.toLowerCase().includes(discSearch.toLowerCase()) ||
                      creator?.username?.toLowerCase().includes(discSearch.toLowerCase())
                    );
                  }).map((disc) => (
                    <div key={disc.id} className="profile-disc-card">
                      <div className="profile-disc-header">
                        <h3>{disc.title}</h3>
                        {/* Admin látja ki írta, ha nem saját */}
                        {isAdmin && disc.creatoremail !== user?.email && (() => {
                          const creator = getDiscussionCreator(disc.creatoremail);
                          return (
                            <div className="profile-disc-creator">
                              <img src={creator?.picture} alt="" className="profile-disc-creator-pfp" />
                              <span>{creator?.username ?? disc.creatoremail}</span>
                            </div>
                          );
                        })()}
                        <div className="profile-disc-actions">
                          {(isAdmin || disc.creatoremail === user?.email) && (
                            <button className="profile-disc-delete" onClick={() => deleteDiscussion(disc.id)}>
                              <IoTrashOutline />
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Szerkesztés csak saját discussionnél */}
                      {disc.creatoremail === user?.email ? (
                        editingDiscId === disc.id ? (
                          <div className="profile-disc-edit">
                            <textarea
                              value={editingDesc}
                              onChange={(e) => setEditingDesc(e.target.value)}
                              maxLength={MAX_DESC}
                              rows={4}
                            />
                            <div className="profile-disc-edit-actions">
                              <span className="profile-charcount">{editingDesc.length} / {MAX_DESC}</span>
                              <button className="profile-disc-cancel" onClick={() => setEditingDiscId(null)}>
                                <IoCloseOutline /> Cancel
                              </button>
                              <button className="profile-disc-save" onClick={() => saveDiscussion(disc.id)}>
                                <IoCheckmark /> Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p
                            className="profile-disc-desc"
                            onClick={() => { setEditingDiscId(disc.id); setEditingDesc(disc.description); }}
                            title="Click to edit"
                          >
                            {disc.description || <span className="profile-empty-inline">No description. Click to add.</span>}
                          </p>
                        )
                      ) : (
                        // Admin látja mások leírását, de nem szerkesztheti
                        <p className="profile-disc-desc" style={{ cursor: 'default' }}>
                          {disc.description || <span className="profile-empty-inline">No description.</span>}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ── PEOPLES (admin only) ── */}
          {activeTab === 'peoples' && isAdmin && (
            <div className="profile-section">
              <div className="profile-section-header">
                <h2>Peoples</h2>
              </div>
              <input type="text" className="profile-picker-search" placeholder="Search users..." value={peopleSearch} onChange={(e) => setPeopleSearch(e.target.value)} />
              <div className="profile-peoples-list">
                {peoples.length === 0 && <p className="profile-empty">No users found.</p>}
                {peoples.filter((p) => p.username.toLowerCase().includes(peopleSearch.toLowerCase()) || p.email.toLowerCase().includes(peopleSearch.toLowerCase())).map((person) => (
                  <div key={person.id} className="profile-people-card">
                    <img src={person.picture} alt="" className="profile-people-pfp" />
                    <div className="profile-people-info">
                      <span className="profile-people-name">{person.username}</span>
                      <span className="profile-people-email">{person.email}</span>
                    </div>
                    <button className="profile-people-delete" onClick={() => deleteUser(person)}>
                      <IoTrashOutline /> Delete account
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MY PROFILE ── */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="profile-section-header">
                <h2>My Profile</h2>
              </div>
              <div className="profile-edit-card">
                <div className="profile-avatar-preview">
                  <img
                    src={profilePicture || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-2409187029.jpg'}
                    alt="avatar"
                  />
                </div>

                <div className="profile-field">
                  <label>Username</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="New username..." />
                </div>

                <div className="profile-field">
                  <label>Profile picture upload method</label>
                  <div className="toggle-wrapper">
                    <span className={`label ${useUrl ? 'active' : ''}`}>With link</span>
                    <label className="toggle">
                      <input type="checkbox" checked={!useUrl} onChange={() => setUseUrl((p) => !p)} />
                      <div className="track"><div className="thumb" /></div>
                    </label>
                    <span className={`label ${!useUrl ? 'active' : ''}`}>With file</span>
                  </div>
                </div>

                <div className="profile-field">
                  <label>Profile picture</label>
                  {useUrl ? (
                    <input
                      type="text" placeholder="Image URL..."
                      value={profilePicture}
                      onChange={(e) => setProfilePicture(e.target.value)}
                    />
                  ) : (
                    <div className="profile-file-row">
                      <input
                        style={{ display: 'none' }} type="file" id="profileFile" accept="image/*"
                        onChange={(e) => setProfilePicture(e.target.value)}
                      />
                      <label className="fileChooser" htmlFor="profileFile">Choose file</label>
                      {profilePicture && <span className="fileName">{profilePicture.split('fakepath\\')[1]}</span>}
                    </div>
                  )}
                </div>

                <button className="profile-save-btn" onClick={updateData}>Save changes</button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="profile-tabbar">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            className={`profile-tabbar-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="profile-tabbar-icon">{tab.icon}</span>
            <span className="profile-tabbar-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}