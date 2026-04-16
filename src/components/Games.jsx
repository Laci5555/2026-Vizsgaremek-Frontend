import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import "./Games.css";
import { IoSearchOutline } from 'react-icons/io5';
import { TfiFilter } from 'react-icons/tfi';
import { IoMdClose } from 'react-icons/io';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { FaPlus } from 'react-icons/fa';
import { GoPlus } from "react-icons/go";
import { db } from '../../firebaseApp';
import Message from './Message';
import { AiFillDislike, AiFillLike } from 'react-icons/ai';

export default function Games({ darkmode, setDarkmode, gamesDataCollection, genreCollection }) {

  // const jatekok = ["Cyberpunk 2077", "Devil may cry 5", "Fortnite", "Valorant", "Counter Strike 2", "League of Legends", "Clair Obscure: Expedition 33", "Hollow knight: Silksong", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game"]

  // const genres=["Action","Adventure","Fighting","FPS","Gacha","Horror","MOBA","Puzzle","Racing","RPG","Strategy","Survival","Shooter","Simulation","Sports"];

  const [game, setGame] = useState("");

  const [games, setGames] = useState([]);

  const [gamesMain, setGamesmain] = useState([])

  const [genres, setGenres] = useState([])

  const [Genrefilters, setGenreFilters] = useState([])


  const [refresh, setRefresh] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [selectedGame, setSelectedGame] = useState(null);

  const [newGameName, setNewGameName] = useState("");

  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    async function getGames() {
      // setGames([...jatekok])
      // console.log(games);
      setShowFilter(false);
    }
    getGames();
  }, [refresh]);

  useEffect(() => {
    async function FetchGames() {
      const snap = await getDocs(gamesDataCollection);
      const lst = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setGamesmain(lst)
      setGames(lst)
    }
    async function FetchGenres() {
      const snap = await getDocs(genreCollection);
      const lst = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setGenres(lst)
    }
    FetchGames()
    FetchGenres()
  }, [])



  async function getGame() {
    let modGames = [];
    if (game == "" && Genrefilters.length == 0) {
      setGames([...gamesMain])
    } else if (Genrefilters.length == 0 && game != "") {
      modGames = gamesMain.filter(x => x.name.toLowerCase().includes(game.toLowerCase()));
      setGames(modGames);
    }
    else {
      // modGames=jatekok.filter(x=>x.toLowerCase().includes(game.toLowerCase()));
      modGames = gamesMain.filter(x => x.name.toLowerCase().includes(game.toLowerCase()) && x.genre.some(x => Genrefilters.includes(x)));
      // console.log(modGames);
      setGames(modGames);
    }
    setRefresh(!refresh);
  }

  function showingFilter() {
    setShowFilter(!showFilter);
  }

  const [isOpen, setIsOpen] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setIsOpen(false);
  };

  async function SubmitRequest() {
    setIsOpen(false)
    try {
      await addDoc(collection(db, "game-requests"), { name: newGameName });
    } catch (err) {
      console.log(err);
    }
  }

  async function getGameDiv(obj) {
    setSelectedGame(obj);
    setShowGame(true);
  }

  function HandleFilterGenre(name) {
    let i = Genrefilters.findIndex(x => x == name)
    event.stopPropagation()
    // console.log(event.target);

    if (i == -1) {
      Genrefilters.push(name)
    }
    else if (i != -1) {
      Genrefilters.splice(i, 1)
    }
    setGenreFilters([...Genrefilters])
  }

  console.log(Genrefilters);

  return (
    <div className='games'>
      <Navbar darkmode={darkmode} setDarkmode={setDarkmode} />
      <Message />
      <div className="hbox">
        <button className='filterIcon' onClick={showingFilter}><TfiFilter /></button>
        <div className={`filter ${showFilter ? "show" : ""}`}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}><IoMdClose className='close' onClick={showingFilter} /></div>
          <div className='searchDiv'>
            <IoSearchOutline style={{ color: "grey" }} />
            <input type="text" className='searchBar' value={game} onChange={e => setGame(e.target.value)} />
            <input className='searchBtn' type="button" value="Search" onClick={getGame} />
          </div>
          <div className='checkboxs'>
            {genres.map(x => <div className='genres' key={x.id} onClick={() => HandleFilterGenre(x.name)}>
              <input type="checkbox" name="" id={x.name} checked={Genrefilters.includes(x.name)} />
              <label>{x.name}</label>
            </div>)}
          </div>
        </div>
        <div className="cardlist">
          {/* x.img, x.likes, x.dislikes, x.genre[] */}
          {gamesMain.length > 0 ? (games.length > 0 ? games.map(x =>
            <div className='card' key={x.id} onClick={() => getGameDiv(x)}>
              <img src={x.img} alt="" />
              <h3>{x.name}</h3>
            </div>)
            :
            <div>Sajnos ilyen nevű játék nincs...</div>)
            :
            <div>Betöltés...</div>}
          <div className="requestGame" onClick={() => setIsOpen(true)}><GoPlus /></div>
          <div className={`backdrop ${showGame ? "visible" : ""}`} onMouseDownCapture={(e) => { if (e.target === e.currentTarget) setShowGame(false); }}>
            <div className="gameDiv" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowGame(false)}>✕</button>
              <img src={selectedGame?.img} alt={selectedGame?.name} />
              <div className='gameInfos'>
                <h3>{selectedGame?.name}</h3>
                <p>{selectedGame?.description}</p>
                <div className='likeRatios'>
                  <div className='like'><AiFillLike /><span>{selectedGame?.likes}</span></div>
                  <div className='dislike'><AiFillDislike /><span>{selectedGame?.dislikes}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`backdrop ${isOpen ? "visible" : ""}`} onMouseDownCapture={handleBackdropClick}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-top-bar" />
          <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          <div className="newgame">
            <h2>Kérj fel egy játékot hogy felkerüljön!</h2>
            <div>
              <label>Játék neve</label>
              <input type="text" placeholder="pl. Elden Ring..." value={newGameName} onChange={(e) => setNewGameName(e.target.value)} />
            </div>
            <button className="submit-btn" disabled={!newGameName.trim()} onClick={() => SubmitRequest()}>
              Kérés elküldése
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
