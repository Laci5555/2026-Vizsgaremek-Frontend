import { useEffect, useState } from 'react';
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

export default function Games({ gamesDataCollection, genreCollection }) {
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
    if (searchName) {
      result = result.filter((x) => x.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (activeFilters.length > 0) {
      result = result.filter((x) => x.genre.some((g) => activeFilters.includes(g)));
    }
    setGames(result);
    setShowFilter(false);
  }

  function handleFilterGenre(e, name) {
    e.stopPropagation();
    setGenreFilters((prev) => {
      const next = prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name];
      return next;
    });
  }

  async function submitRequest() {
    if (!newGameName.trim()) return;
    setIsOpen(false);
    try {
      await addDoc(collection(db, 'game-requests'), { name: newGameName });
      setNewGameName('');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="games">
      <Navbar />
      <Message />
      <div className="hbox">
        <button className="filterIcon" onClick={() => setShowFilter((p) => !p)}><TfiFilter /></button>
        <div className={`filter ${showFilter ? 'show' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IoMdClose className="close" onClick={() => setShowFilter(false)} />
          </div>
          <div className="searchDiv">
            <IoSearchOutline style={{ color: 'grey' }} />
            <input type="text" className="searchBar" value={game} onChange={(e) => setGame(e.target.value)} />
            <input className="searchBtn" type="button" value="Search" onClick={() => filterGames(game, genreFilters)} />
          </div>
          <div className="checkboxs">
            {genres.map((x) => (
              <div className="genres" key={x.id} onClick={(e) => handleFilterGenre(e, x.name)}>
                <input type="checkbox" readOnly id={x.name} checked={genreFilters.includes(x.name)} />
                <label>{x.name}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="cardlist">
          {gamesMain.length > 0 ? (
            games.length > 0
              ? games.map((x) => (
                <div className="card" key={x.id} onClick={() => { setSelectedGame(x); setShowGame(true); }}>
                  <img src={x.img} alt={x.name} />
                  <h3>{x.name}</h3>
                </div>
              ))
              : <div>Sajnos ilyen nevű játék nincs...</div>
          ) : (
            <div>Loading...</div>
          )}

          <div className="requestGame" onClick={() => setIsOpen(true)}><GoPlus /></div>

          <div
            className={`backdrop ${showGame ? 'visible' : ''}`}
            onMouseDownCapture={(e) => { if (e.target === e.currentTarget) setShowGame(false); }}
          >
            <div className="gameDiv" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn gameClose" onClick={() => setShowGame(false)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
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

      <div
        className={`backdrop ${isOpen ? 'visible' : ''}`}
        onMouseDownCapture={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-top-bar" />
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className="newgame">
            <h2>Submit a game to be added!</h2>
            <div>
              <label>Game's name</label>
              <input type="text" placeholder="pl. Elden Ring..." value={newGameName} onChange={(e) => setNewGameName(e.target.value)} />
            </div>
            <button className="submit-btn" disabled={!newGameName.trim()} onClick={submitRequest}>
              Submit request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
