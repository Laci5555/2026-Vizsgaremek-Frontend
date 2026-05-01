import { useEffect, useState, useRef, useCallback } from 'react';
import Navbar from './Navbar';
import './Games.css';
import { IoSearchOutline } from 'react-icons/io5';
import { TfiFilter } from 'react-icons/tfi';
import { IoMdClose } from 'react-icons/io';
import { GoPlus } from 'react-icons/go';
import { db } from '../../firebaseApp';
import Message from './Message';
import { AiFillDislike, AiFillLike } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import {
  addDoc, collection, getDocs, updateDoc, deleteDoc,
  doc, getDoc, setDoc, increment, query, where, Timestamp
} from 'firebase/firestore';
import { useApp } from '../AppContext';

const CARD_WIDTH = 200;
const CARD_GAP = 20;
const MAX_DESC = 500;

const XIcon = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
    <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function Games({ gamesDataCollection, genreCollection }) {

  const { user, isAdmin } = useApp();
  const [userVote, setUserVote] = useState(null);

  const [game, setGame] = useState('');
  const [games, setGames] = useState([]);
  const [sortBy, setSortBy] = useState('latest');
  const [gamesMain, setGamesMain] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genreFilters, setGenreFilters] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const [showGame, setShowGame] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searched, setSearched] = useState(false);

  // Reviews & Users state
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [myReviewText, setMyReviewText] = useState('');
  const [isEditingReview, setIsEditingReview] = useState(false);

  // Edit modal state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editGenres, setEditGenres] = useState([]);
  const [editPicture, setEditPicture] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [useUrl, setUseUrl] = useState(true);

  const cardlistRef = useRef(null);
  const [cardsPerRow, setCardsPerRow] = useState(Infinity);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteReview, setConfirmDeleteReview] = useState(false);

  useEffect(() => {
    const el = cardlistRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const perRow = Math.floor((width + CARD_GAP) / (CARD_WIDTH + CARD_GAP));
      setCardsPerRow(Math.max(1, perRow));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isFiltering = searched && games.length < cardsPerRow;

  useEffect(() => {
    async function fetchGames() {
      const snap = await getDocs(gamesDataCollection);
      const lst = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })).sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));;
      setGamesMain(lst);
      setGames(lst);
    }
    async function fetchGenres() {
      const snap = await getDocs(genreCollection);
      setGenres(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    async function fetchUsers() {
      const snap = await getDocs(collection(db, 'user-data'));
      setUsers(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    }
    fetchGames();
    fetchGenres();
    fetchUsers();
  }, [gamesDataCollection, genreCollection]);

  useEffect(() => {
    async function fetchVoteAndReviews() {
      if (!selectedGame || !user) { setUserVote(null); return; }
      // 1. Fetch user vote
      const voteRef = doc(db, 'user-votes', `${user.uid}_${selectedGame.id}`);
      const voteSnap = await getDoc(voteRef);
      setUserVote(voteSnap.exists() ? voteSnap.data().vote : null);

      // 2. Fetch all reviews for this game
      const reviewsSnap = await getDocs(
        query(collection(db, 'game-reviews'), where('gameId', '==', selectedGame.id))
      );
      const revs = reviewsSnap.docs.map(d => ({ ...d.data(), id: d.id }));

      // Sort reviews: my review first, then by time desc
      revs.sort((a, b) => {
        if (a.userId === user.uid) return -1;
        if (b.userId === user.uid) return 1;
        return (b.time?.seconds ?? 0) - (a.time?.seconds ?? 0);
      });
      setReviews(revs);

      // Set my review text if exists
      const myRev = revs.find(r => r.userId === user.uid);
      if (myRev) {
        setMyReviewText(myRev.text);
        setIsEditingReview(false);
      } else {
        setMyReviewText('');
        setIsEditingReview(true);
      }
    }
    fetchVoteAndReviews();
  }, [selectedGame, user]);

  const sortGames = useCallback((list) => {
    switch (sortBy) {
      case 'az': return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case 'likes': return [...list].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
      default: return [...list];
    }
  }, [sortBy]);

  const filterGames = useCallback((searchName, activeFilters) => {
    let result = gamesMain;
    if (searchName) result = result.filter((x) => x.name.toLowerCase().includes(searchName.toLowerCase()));
    if (activeFilters.length > 0) result = result.filter((x) => x.genre.some((g) => activeFilters.includes(g)));
    result = sortGames(result);
    setGames(result);
    setSearched(searchName.trim() !== '' || activeFilters.length > 0);
  }, [gamesMain, sortGames]);

  useEffect(() => {
    const t = setTimeout(() => {
      setGames((prev) => sortGames(prev));
    }, 0);
    return () => clearTimeout(t);
  }, [sortGames]);

  // Real-time search with small debounce (150ms – runs on local data, no Firebase)
  useEffect(() => {
    const timer = setTimeout(() => {
      filterGames(game, genreFilters);
    }, 150);
    return () => clearTimeout(timer);
  }, [game, gamesMain, genreFilters, filterGames]);



  function handleFilterGenre(e, name) {
    e.stopPropagation();
    setGenreFilters((prev) => {
      const next = prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name];
      filterGames(game, next);
      return next;
    });
  }

  async function handleVote(type) {
    if (!user || !selectedGame) return;

    const gameRef = doc(db, 'games', selectedGame.id);
    const voteRef = doc(db, 'user-votes', `${user.uid}_${selectedGame.id}`);

    let likeDelta = 0;
    let dislikeDelta = 0;
    let newVote = null;

    if (userVote === type) {
      // Visszavonás: ugyanazt nyomta újra
      if (type === 'like') likeDelta = -1;
      else dislikeDelta = -1;
      newVote = null;
    } else {
      // Váltás vagy első szavazat
      if (userVote === 'like') likeDelta = -1;
      if (userVote === 'dislike') dislikeDelta = -1;
      if (type === 'like') likeDelta += 1;
      else dislikeDelta += 1;
      newVote = type;
    }

    const updates = {};
    if (likeDelta !== 0) updates.likes = increment(likeDelta);
    if (dislikeDelta !== 0) updates.dislikes = increment(dislikeDelta);
    await updateDoc(gameRef, updates);

    if (newVote) {
      await setDoc(voteRef, { vote: newVote, gameId: selectedGame.id, userId: user.uid });
    } else {
      await deleteDoc(voteRef);
    }

    // Sync vote with review if user has one
    const myRev = reviews.find(r => r.userId === user.uid);
    if (myRev) {
      await updateDoc(doc(db, 'game-reviews', myRev.id), { vote: newVote });
      setReviews(prev => prev.map(r => r.id === myRev.id ? { ...r, vote: newVote } : r));
    }

    const updated = {
      ...selectedGame,
      likes: (selectedGame.likes ?? 0) + likeDelta,
      dislikes: (selectedGame.dislikes ?? 0) + dislikeDelta,
    };
    setSelectedGame(updated);
    setGamesMain((prev) => prev.map((x) => x.id === selectedGame.id ? updated : x));
    setGames((prev) => prev.map((x) => x.id === selectedGame.id ? updated : x));
    setUserVote(newVote);
  }

  async function submitRequest() {
    if (!newGameName.trim()) return;
    setIsOpen(false);
    try {
      await addDoc(collection(db, 'game-requests'), { name: newGameName });
      setNewGameName('');
      setRequestSent(true);
      setTimeout(() => setRequestSent(false), 3000);
    } catch (err) { console.error(err); }
  }

  function openEdit() {
    setEditName(selectedGame?.name ?? '');
    setEditGenres(selectedGame?.genre ?? []);
    setEditPicture(selectedGame?.img ?? '');
    setEditDescription(selectedGame?.description ?? '');
    setUseUrl(true);
    setEditing(true);
  }

  function toggleEditGenre(name) {
    setEditGenres((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  }

  async function saveEdit() {
    if (!selectedGame?.id) return;
    try {
      await updateDoc(doc(db, 'games', selectedGame.id), {
        name: editName,
        genre: editGenres,
        img: editPicture,
        description: editDescription,
      });
      // Lokális state frissítése – nem kell újra fetchelni
      const updated = { ...selectedGame, name: editName, genre: editGenres, img: editPicture, description: editDescription };
      setGamesMain((prev) => prev.map((x) => x.id === selectedGame.id ? updated : x));
      setGames((prev) => prev.map((x) => x.id === selectedGame.id ? updated : x));
      setSelectedGame(updated);
    } catch (err) {
      console.error('Mentés során hiba!', err);
    }
    setEditing(false);
  }

  function deleteGame() {
    setConfirmDelete(true);
  }

  async function confirmDeleteGame() {
    if (!selectedGame?.id) return;
    try {
      await deleteDoc(doc(db, 'games', selectedGame.id));
      setGamesMain((prev) => prev.filter((x) => x.id !== selectedGame.id));
      setGames((prev) => prev.filter((x) => x.id !== selectedGame.id));
    } catch (err) {
      console.error('Törlés során hiba!', err);
    }
    setConfirmDelete(false);
    setEditing(false);
    setShowGame(false);
  }

  async function submitReview() {
    if (!myReviewText.trim()) return;
    const reviewId = `${user.uid}_${selectedGame.id}`;
    const reviewRef = doc(db, 'game-reviews', reviewId);

    const myRev = reviews.find(r => r.id === reviewId);

    const reviewData = {
      gameId: selectedGame.id,
      userId: user.uid,
      email: user.email,
      text: myReviewText.trim(),
      vote: userVote,
      time: myRev ? myRev.time : Timestamp.now(),
      edited: !!myRev,
    };

    try {
      await setDoc(reviewRef, reviewData);
      setIsEditingReview(false);

      const newRev = { ...reviewData, id: reviewId };
      setReviews(prev => {
        const filtered = prev.filter(r => r.id !== reviewId);
        return [newRev, ...filtered];
      });
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  }

  async function confirmDeleteMyReview() {
    if (!user || !selectedGame) return;
    const reviewId = `${user.uid}_${selectedGame.id}`;
    try {
      await deleteDoc(doc(db, 'game-reviews', reviewId));
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      setMyReviewText('');
      setIsEditingReview(true);
    } catch (err) {
      console.error("Error deleting review:", err);
    }
    setConfirmDeleteReview(false);
  }

  return (
    <div className="games">
      <Navbar />

      <div className="hbox">
        <button className="filterIcon" onClick={() => setShowFilter((p) => !p)}>
          <TfiFilter />
        </button>

        {/* ── Sidebar filter ── */}
        <div className={`filter ${showFilter ? 'show' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IoMdClose className="close" onClick={() => setShowFilter(false)} />
          </div>
          <div className="searchDiv">
            <IoSearchOutline style={{ color: 'grey' }} />
            <input
              type="text" className="searchBar" value={game}
              placeholder="Search games..."
              onChange={(e) => setGame(e.target.value)}
            />
          </div>
          <div className="sortOptions">
            <span>Sort by</span>
            {[
              { value: 'latest', label: 'Latest' },
              { value: 'az', label: 'A–Z' },
              { value: 'likes', label: 'Most liked' },
            ].map((opt) => (
              <div
                key={opt.value}
                className={`sortOption ${sortBy === opt.value ? 'active' : ''}`}
                onClick={() => setSortBy(opt.value)}
              >
                <div className="sortRadio">{sortBy === opt.value && <div className="sortRadioDot" />}</div>
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
          <span className="filterLabel">Categories By</span>
          <div className="checkboxs">
            {genres.map((x) => (
              <div className="genres" key={x.id} onClick={(e) => handleFilterGenre(e, x.name)}>
                <input type="checkbox" readOnly checked={genreFilters.includes(x.name)} />
                <label>{x.name}</label>
              </div>
            ))}
          </div>
        </div>

        {/* ── Card list ── */}
        <div ref={cardlistRef} className={`cardlist ${isFiltering ? 'is-filtering' : ''}`}>
          {gamesMain.length > 0 ? (
            games.length > 0
              ? games.map((x) => (
                <div className="card" key={x.id} onClick={() => { setSelectedGame(x); setShowGame(true); }}>
                  <img src={x.img} alt={x.name} />
                  <div className="cardBottom">
                    <h3>{x.name}</h3>
                    <div className="cardRatings">
                      <span className="cardLike"><AiFillLike />{x.likes}</span>
                      <span className="cardDislike"><AiFillDislike />{x.dislikes}</span>
                    </div>
                  </div>
                </div>
              ))
              : <div>No games found...</div>
          ) : <div>Loading...</div>}

          {/* ── Game detail modal ── */}
          <div
            className={`backdrop ${showGame ? 'visible' : ''}`}
            onMouseDownCapture={(e) => { if (e.target === e.currentTarget) setShowGame(false); }}
          >
            <div className="gameDiv" onClick={(e) => e.stopPropagation()}>
              {/* Edit gomb – csak adminnak, ugyanolyan mint a close-btn */}
              {isAdmin && (
                <button className="close-btn gameEditBtn" onClick={openEdit}>
                  <FiEdit size={13} />
                </button>
              )}
              <button className="close-btn gameClose" onClick={() => setShowGame(false)}>
                <XIcon />
              </button>
              <img src={selectedGame?.img} alt={selectedGame?.name} />
              <div className="gameInfos">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                  <h3 className="title">{selectedGame?.name}</h3>
                  <div className="likeRatios">
                    <div
                      className={`like${userVote === 'like' ? ' voted' : ''}`}
                      onClick={() => handleVote('like')}
                    >
                      <AiFillLike /><span>{selectedGame?.likes}</span>
                    </div>
                    <div
                      className={`dislike${userVote === 'dislike' ? ' voted' : ''}`}
                      onClick={() => handleVote('dislike')}
                    >
                      <AiFillDislike /><span>{selectedGame?.dislikes}</span>
                    </div>
                  </div>
                </div>
                <div className="gameGenres">
                  {selectedGame?.genre.map((x, i) => <div className="gameGenre" key={i}>{x}</div>)}
                </div>
                <div className="gameDescription">{selectedGame?.description}</div>

                {/* ── Reviews Section ── */}
                <div className="gameReviews">
                  <h4>Reviews</h4>

                  {/* Review Input */}
                  <div className="reviewInputSection">
                    {isEditingReview ? (
                      <div className="reviewForm">
                        <textarea
                          placeholder="Write your review here..."
                          value={myReviewText}
                          onChange={(e) => setMyReviewText(e.target.value)}
                          maxLength={500}
                        />
                        <div className="reviewFormFooter">
                          <span className={`reviewCharCount${myReviewText.length >= 500 ? ' over' : myReviewText.length > 450 ? ' near' : ''}`}>
                            {myReviewText.length} / 500
                          </span>
                          <div className="reviewFormActions">
                            <button onClick={submitReview} disabled={!myReviewText.trim()}>
                              {reviews.some(r => r.userId === user.uid) ? 'Update Review' : 'Submit Review'}
                            </button>
                            {reviews.some(r => r.userId === user.uid) && (
                              <button className="cancelEditBtn" onClick={() => {
                                setMyReviewText(reviews.find(r => r.userId === user.uid)?.text ?? '');
                                setIsEditingReview(false);
                              }}>Cancel</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="myReviewDisplay">
                        <button className="deleteMyReviewBtn" onClick={() => setConfirmDeleteReview(true)}>
                          Delete review
                        </button>
                        <button className="editMyReviewBtn" onClick={() => setIsEditingReview(true)}>
                          Edit my review
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reviews List */}
                  <div className="reviewsList">
                    {reviews.length > 0 ? reviews.map(r => {
                      const reviewer = users.find(u => u.email === r.email) || { username: r.email, picture: '' };
                      return (
                        <div className="reviewItem" key={r.id}>
                          <img src={reviewer.picture || 'https://via.placeholder.com/40'} alt="" className="reviewAvatar" style={{ width: 28, height: 28 }} />
                          <div className="reviewContent">
                            <div className="reviewHeader">
                              <span className="reviewUsername">{reviewer.username}</span>
                              {r.vote === 'like' && <span className="reviewVote like"><AiFillLike /></span>}
                              {r.vote === 'dislike' && <span className="reviewVote dislike"><AiFillDislike /></span>}
                              {r.edited && <span className="reviewEdited">(edited)</span>}
                            </div>
                            <p className="reviewText">{r.text}</p>
                          </div>
                        </div>
                      );
                    }) : (
                      <p className="noReviews">No reviews yet. Be the first!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAB gombok ── */}
      <Message />
      <div className="requestGame" onClick={() => setIsOpen(true)}><GoPlus /></div>

      {requestSent && (
        <div className="games-toast">
          ✓ Game request submitted successfully!
        </div>
      )}

      {/* ── Request modal ── */}
      <div
        className={`backdrop ${isOpen ? 'visible' : ''}`}
        onMouseDownCapture={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-top-bar" />
          <button className="close-btn" onClick={() => setIsOpen(false)}><XIcon /></button>
          <div className="newgame">
            <h2>Submit a game to be added!</h2>
            <div>
              <label>Game's name</label>
              <input
                type="text"
                placeholder="e.g. Elden Ring..."
                value={newGameName}
                onChange={(e) => setNewGameName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newGameName.trim()) {
                    submitRequest();
                  }
                }}
              />
            </div>
            <button className="submit-btn" disabled={!newGameName.trim()} onClick={submitRequest}>Submit request</button>
          </div>
        </div>
      </div>

      {/* ── Edit modal ── */}
      <div
        className={`backdrop ${editing ? 'visible' : ''}`}
        onMouseDownCapture={(e) => { if (e.target === e.currentTarget) setEditing(false); }}
      >
        <div className="editModal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setEditing(false)}><XIcon /></button>

          {/* Game name */}
          <div className="editField">
            <label htmlFor="editName">Game name:</label>
            <input id="editName" type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>

          {/* Genres grid */}
          <div className="editField">
            <label>Genres:</label>
            <div className="editGenreGrid">
              {genres.map((x) => (
                <div
                  key={x.id}
                  className={`editGenreItem ${editGenres.includes(x.name) ? 'checked' : ''}`}
                  onClick={() => toggleEditGenre(x.name)}
                >
                  <input type="checkbox" readOnly checked={editGenres.includes(x.name)} />
                  <span>{x.name}</span>
                  <IoMdClose className="genreX" onClick={(e) => { e.stopPropagation(); /* delGenre(x.id) */ }} />
                </div>
              ))}
            </div>
          </div>

          {/* Picture toggle */}
          <div className="editField pictureType">
            <label>Picture upload method</label>
            <div className="toggle-wrapper">
              <span className={`label ${useUrl ? 'active' : ''}`}>With link</span>
              <label className="toggle">
                <input type="checkbox" checked={!useUrl} onChange={() => setUseUrl((p) => !p)} />
                <div className="track"><div className="thumb" /></div>
              </label>
              <span className={`label ${!useUrl ? 'active' : ''}`}>With file</span>
            </div>
          </div>

          {/* Picture input */}
          <div className="editField">
            <label>Game picture:</label>
            {useUrl ? (
              <input type="text" value={editPicture} onChange={(e) => setEditPicture(e.target.value)} placeholder="https://..." />
            ) : (
              <div>
                <input style={{ display: 'none' }} type="file" id="editFile" onChange={(e) => setEditPicture(e.target.value)} />
                <label className="fileChooser" htmlFor="editFile">Choose file</label>
                {editPicture && <span className="fileName">{editPicture.split('fakepath\\')[1]}</span>}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="editField">
            <label htmlFor="editDesc">Description</label>
            <textarea
              id="editDesc" className="editTextarea" rows={5} maxLength={MAX_DESC}
              placeholder="Write a short description of the game..."
              value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
            />
            <span className={`charCount${editDescription.length > 450 ? editDescription.length >= MAX_DESC ? ' over' : ' near' : ''}`}>
              {editDescription.length} / {MAX_DESC}
            </span>
          </div>

          <div className="editActions">
            <button className="deleteGameButton" onClick={deleteGame}>Delete game</button>
            <button className="editGameButton" onClick={saveEdit} disabled={!editName.trim()}>Edit game</button>
          </div>
        </div>
      </div>

      {/* ── Confirm delete modal ── */}
      <div
        className={`backdrop ${confirmDelete ? 'visible' : ''}`}
        onMouseDownCapture={(e) => { if (e.target === e.currentTarget) setConfirmDelete(false); }}
      >
        <div className="confirmModal" onClick={(e) => e.stopPropagation()}>
          <p className="confirmTitle">Are you sure you want to delete this game?</p>
          <p className="confirmSub">This action cannot be undone.</p>
          <div className="confirmActions">
            <button className="confirmCancel" onClick={() => setConfirmDelete(false)}>Cancel</button>
            <button className="confirmDelete" onClick={confirmDeleteGame}>Delete</button>
          </div>
        </div>
      </div>

      {/* ── Confirm delete review modal ── */}
      <div
        className={`backdrop ${confirmDeleteReview ? 'visible' : ''}`}
        onMouseDownCapture={(e) => { if (e.target === e.currentTarget) setConfirmDeleteReview(false); }}
      >
        <div className="confirmModal" onClick={(e) => e.stopPropagation()}>
          <p className="confirmTitle">Are you sure you want to delete your review?</p>
          <p className="confirmSub">This action cannot be undone. (Your vote will remain)</p>
          <div className="confirmActions">
            <button className="confirmCancel" onClick={() => setConfirmDeleteReview(false)}>Cancel</button>
            <button className="confirmDelete" onClick={confirmDeleteMyReview}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
