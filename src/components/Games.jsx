import {useEffect, useState } from 'react'
import Navbar from './Navbar'
import "./Games.css";
import { IoSearchOutline } from 'react-icons/io5';
import { TfiFilter } from 'react-icons/tfi';
import { IoMdClose } from 'react-icons/io';
import { collection, getDocs } from 'firebase/firestore';

export default function Games({darkmode,setDarkmode,gamesDataCollection,genreCollection}) {

  // const jatekok = ["Cyberpunk 2077", "Devil may cry 5", "Fortnite", "Valorant", "Counter Strike 2", "League of Legends", "Clair Obscure: Expedition 33", "Hollow knight: Silksong", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game", "Example game"]

  // const genres=["Action","Adventure","Fighting","FPS","Gacha","Horror","MOBA","Puzzle","Racing","RPG","Strategy","Survival","Shooter","Simulation","Sports"];

  const [game,setGame]=useState("");

  const [games,setGames]=useState([]);

  const [gamesMain, setGamesmain] = useState([])

  const [genres, setGenres] = useState([])


  const [refresh,setRefresh]=useState(false);
  const [showFilter,setShowFilter]=useState(false);

  useEffect(()=>{
    async function getGames() {
      // setGames([...jatekok])
      // console.log(games);
      setShowFilter(false);
    }
    getGames();
  },[refresh]);

  useEffect(()=>{
    async function FetchGames() {
      const snap = await getDocs(gamesDataCollection);
      const lst = snap.docs.map(doc => ({ ...doc.data(), id:doc.id }));
      setGamesmain(lst)
      setGames(lst)
    }
    async function FetchGenres() {
      const snap = await getDocs(genreCollection);
      const lst = snap.docs.map(doc => ({ ...doc.data(), id:doc.id }));
      setGenres(lst)
    }
    FetchGames()
    FetchGenres()
  },[])

  async function getGame() {
    let modGames=[];
    if(game==""){
      setGames([...gamesMain])
    } else {
      // modGames=jatekok.filter(x=>x.toLowerCase().includes(game.toLowerCase()));
      modGames = gamesMain.filter(x => x.name.toLowerCase().includes(game.toLowerCase()));
      // console.log(modGames);
      setGames(modGames);
    }
    setRefresh(!refresh);
  }

  function showingFilter() {
    setShowFilter(!showFilter);
  }

  return (
    <div className='games'>
      <Navbar darkmode={darkmode} setDarkmode={setDarkmode}/>
      <div className="hbox">
        <button className='filterIcon' onClick={showingFilter}><TfiFilter  /></button>
        <div className={`filter ${showFilter ? "show" : ""}`}>
          <div style={{display:"flex",justifyContent:"flex-end"}}><IoMdClose className='close' onClick={showingFilter}/></div>
          <div className='searchDiv'>
            <IoSearchOutline style={{color:"grey"}}/>
            <input type="text" className='searchBar' value={game} onChange={e=>setGame(e.target.value)}/>
            <input className='searchBtn' type="button" value="Search" onClick={getGame}/>
          </div>
          <div className='checkboxs'>
            {genres.map(x=><div className='genres' key={x.id}>
                <input type="checkbox" name="" id={x.name} />
                <label htmlFor={x.name}>{x.name}</label>
            </div>)}
          </div>
        </div>
        <div className="cardlist">
          {/* x.img, x.likes, x.dislikes, x.genre[] */}
          {gamesMain.length>0 ? (games.length>0 ? games.map(x => <div className='card' key={x.id}>{x.name}</div>) : <div>Sajnos ilyen nevű játék nincs...</div>) : <div>Betöltés...</div>}
        </div>
      </div>
    </div>
  )
}
