import { useEffect, useState, useRef } from 'react';
import Navbar from './Navbar';
import './Games.css';
import { IoSearchOutline } from 'react-icons/io5';
import { TfiFilter } from 'react-icons/tfi';
import { IoMdClose } from 'react-icons/io';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { GoPlus } from 'react-icons/go';
import { db } from '../../firebaseApp';
import Message from './Message';
import { AiFillDislike, AiFillLike } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';

const CARD_WIDTH = 200;
const CARD_GAP = 20;
const MAX_DESC = 500;

export default function Games({ gamesDataCollection, genreCollection, isAdmin = true }) {
  const [game, setGame] = useState('');
  const [games, setGames] = useState([]);
  const [gamesMain, setGamesMain] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genreFilters, setGenreFilters] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [newGameName, setNewGameName] = useState('');
  const [showGame, setShowGame] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searched, setSearched] = useState(false);

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
      const lst = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setGamesMain(lst);
      setGames(lst);
    }
    async function fetchGenres() {
      const snap = await getDocs(genreCollection);
      setGenres(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    fetchGames();
    fetchGenres();
  }, []);

  function filterGames(searchName, activeFilters) {
    let result = gamesMain;
    if (searchName) result = result.filter((x) => x.name.toLowerCase().includes(searchName.toLowerCase()));
    if (activeFilters.length > 0) result = result.filter((x) => x.genre.some((g) => activeFilters.includes(g)));
    setGames(result);
    setSearched(true);
    setShowFilter(false);
  }

  function handleFilterGenre(e, name) {
    e.stopPropagation();
    setGenreFilters((prev) => {
      const next = prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name];
      filterGames(game, next);
      return next;
    });
  }

  async function submitRequest() {
    if (!newGameName.trim()) return;
    setIsOpen(false);
    try {
      await addDoc(collection(db, 'game-requests'), { name: newGameName });
      setNewGameName('');
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
    // TODO: Firestore update hívás ide
    setEditing(false);
  }



  function deleteGame() {
    setConfirmDelete(true);
  }

  async function confirmDeleteGame() {
    // TODO: await deleteDoc(doc(db, 'games', selectedGame.id))
    setConfirmDelete(false);
    setEditing(false);
    setShowGame(false);
  }

  const XIcon = () => (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

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
              onChange={(e) => {
                setGame(e.target.value);
                if (e.target.value.trim() === '') { setGames(gamesMain); setSearched(false); }
              }}
              onKeyDown={(e) => e.key === 'Enter' && filterGames(game, genreFilters)}
            />
            <input className="searchBtn" type="button" value="Search" onClick={() => filterGames(game, genreFilters)} />
          </div>
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
                    <div className="like"><AiFillLike /><span>{selectedGame?.likes}</span></div>
                    <div className="dislike"><AiFillDislike /><span>{selectedGame?.dislikes}</span></div>
                  </div>
                </div>
                <div className="gameGenres">
                  {selectedGame?.genre.map((x, i) => <div className="gameGenre" key={i}>{x}</div>)}
                </div>
                <div className="gameDescription">{selectedGame?.description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAB gombok ── */}
      <Message />
      <div className="requestGame" onClick={() => setIsOpen(true)}><GoPlus /></div>

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
              <input type="text" placeholder="e.g. Elden Ring..." value={newGameName} onChange={(e) => setNewGameName(e.target.value)} />
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
        </div>
      </div>
    </div>
  );
}